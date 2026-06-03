import { w as workerPool } from './WorkerPool-pKB-8UK-.js';
import { L as Logger, g as getConfig } from './configES6-Ds9kj0h6.js';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const config = await getConfig();
const logger = new Logger(config.logging.nodeFS);

function consoleDotLog(...parameters) {
  logger.consoleDotLog('[ NodeFS ] ', ...parameters);
}

class NodeFS {
  constructor(fsPath, options = {}) {
    this.virtualPath = fsPath;
    
    // FIX: Check options.fsType to decide the real path
    // If 'node', use the provided path directly.
    // If 'memory' (or undefined), map to temp directory.
    if (options.fsType === 'node') {
        this.realPath = fsPath; 
        consoleDotLog(`NodeFS Mode: Explicit Disk Path initialized at ${this.realPath}`);
    } else {
        const sanitizedName = fsPath.replace(/\//g, '_');
        this.realPath = path.join(os.tmpdir(), 'kfs_node_temp', sanitizedName);
        consoleDotLog(`NodeFS Mode: Memory Path mapped to ${this.realPath}`);
    }
    
    this.fileDescriptors = new Map();
    this.fdCounter = 3;
    this.workerEntry = null;
    this.workerThread = null;
    this.versioningStrategy = options?.versioning?.strategy || config.versioning.strategy;
    this.doImmediateCommit = (this.versioningStrategy === 'immediate') ? true : false;
    this.isInitialized = false;
    consoleDotLog(`NodeFS created for virtual path ${fsPath}`);
  }

  async _ensureRealPathExists() {
    try {
      // We don't need to mkdir here because VFSUtils/Worker already did it during mount.
      // But we can verify it exists or create it if this is a fresh start.
      await fs.mkdir(this.realPath, { recursive: true });
    } catch (error) {
      // Ignore if already exists
    }
  }

  async initializeWorker() {
    if (this.isInitialized && this.workerThread) return;
    
    // 1. Ensure directory exists
    await this._ensureRealPathExists();

    // 2. Get Worker (Use virtualPath as the pool key to match VFSUtils)
    this.workerEntry = await workerPool.getWorker(this.virtualPath);
    this.workerThread = this.workerEntry.thread;

    // 3. Synchronize worker state
    // Tell the worker to use the REAL path we calculated, with type 'node' (native fs)
    // This ensures the worker is looking at the same directory VFSUtils initialized.
    await this.workerThread.execute('setFs', {
      fsName: this.realPath, 
      fsType: 'node',
    });

    this.isInitialized = true;
    consoleDotLog(`Worker initialized for ${this.virtualPath} -> ${this.realPath}`);
  }
  
  async cleanup() {
    if (this.workerEntry) {
      await workerPool.releaseWorker(this.virtualPath);
      this.workerEntry = null;
      this.workerThread = null;
      this.isInitialized = false;
    }
  }

  async ensureInitialized() {
    if (!this.isInitialized || !this.workerThread) {
      await this.initializeWorker();
    }
  }
  
  async ensureInitialized() {
    if (!this.isInitialized || !this.workerThread) {
      await this.initializeWorker();
    }
  }

  // ... (Keep all the rest of the methods from previous NodeFS.js exactly the same) ...
  // (fs_fopen, fs_fclose, fs_fread, fs_fwrite, fs_stat, etc.)

  async fs_fopen(filename, mode) {
    await this.ensureInitialized();
    
    if (mode.includes('w') || mode.includes('a') || mode.includes('x')) {
      const parentDir = filename.split('/').slice(0, -1).join('/');
      if (parentDir && parentDir !== '') {
        const dirExists = await this.workerThread.execute('isDirectoryDot', { path: parentDir });
        if (!dirExists.exists || !dirExists.isDirectory) {
          throw new Error(`ENOENT: no such directory, open '${filename}'`);
        }
      }
    }

    const fd = this.fdCounter++;
    this.fileDescriptors.set(fd, { path: filename, pos: 0, mode });
    return fd;
  }

  async fs_fclose(fd) {
    if (!this.fileDescriptors.has(fd)) {
      throw new Error(`EBADF: bad file descriptor, close '${fd}'`);
    }
    this.fileDescriptors.delete(fd);
    return 0;
  }

  async fs_fread(fd, length) {
    const file = this.fileDescriptors.get(fd);
    if (!file) throw new Error(`EBADF: bad file descriptor, read '${fd}'`);

    await this.ensureInitialized();
    const data = await this.workerThread.execute('readFileDot', { filePath: file.path });
    if (data === null || data === undefined) throw new Error(`ENOENT: no such file, read '${file.path}'`);
    
    const chunk = data.slice(file.pos, file.pos + length);
    file.pos += chunk.length;
    return chunk;
  }

  async fs_fwrite(fd, content) {
    const file = this.fileDescriptors.get(fd);
    if (!file) throw new Error(`EBADF: bad file descriptor, write '${fd}'`);

    await this.ensureInitialized();
    
    const parentDir = file.path.split('/').slice(0, -1).join('/');
    if (parentDir && parentDir !== '') {
      const dirExists = await this.workerThread.execute('isDirectoryDot', { path: parentDir });
      if (!dirExists.exists || !dirExists.isDirectory) {
        throw new Error(`ENOENT: no such directory, open '${file.path}'`);
      }
    }

    let currentData = await this.workerThread.execute('readFileDot', { filePath: file.path }).catch(() => "");
    let data = currentData || "";
    data = data.slice(0, file.pos) + content + data.slice(file.pos + content.length);
    
    await this.workerThread.execute('writeFileDot', {
      filePath: file.path,
      fileContent: data,
      doCommit: this.doImmediateCommit
    });
    
    file.pos += content.length;
    return content.length;
  }

  async fs_stat(path) {
    await this.ensureInitialized();
    const exists = await this.workerThread.execute('isDirectoryDot', { path });
    if (!exists.exists) throw new Error(`ENOENT: no such file or directory, stat '${path}'`);

    const noteData = await this.workerThread.execute('getPathNote', { path }).catch(() => null);
    const metadata = noteData?.paths?.[path.replace(/^\/+|\/+$/g, '')]?.metadata || {};

    const stats = {
      dev: 0, ino: metadata.inode || Math.floor(Math.random() * 1000000),
      mode: exists.isDirectory ? 0o40777 : 0o100644, nlink: 1,
      uid: process.getuid?.() || 1000, gid: process.getgid?.() || 1000, rdev: 0,
      size: metadata.size || 0, blksize: 4096, blocks: Math.ceil((metadata.size || 0) / 512),
      atimeMs: Date.now(), mtimeMs: Date.now(), ctimeMs: Date.now(), birthtimeMs: Date.now(),
      isDirectory: () => exists.isDirectory, isFile: () => !exists.isDirectory,
      isBlockDevice: () => false, isCharacterDevice: () => false, isSymbolicLink: () => false,
      isFIFO: () => false, isSocket: () => false,
    };
    return stats;
  }

  async fs_fstat(fd) {
    const file = this.fileDescriptors.get(fd);
    if (!file) throw new Error(`EBADF: bad file descriptor`);
    return this.fs_stat(file.path);
  }

  async fs_remove(path) {
    await this.ensureInitialized();
    const exists = await this.workerThread.execute('isDirectoryDot', { path });
    if (!exists.exists) throw new Error(`ENOENT: no such file`);
    if (exists.isDirectory) throw new Error(`EISDIR: illegal operation on a directory`);
    await this.workerThread.execute('removeFileDot', { filePath: path, doCommit: this.doImmediateCommit });
    return 0;
  }

  async fs_mkdir(path) {
    await this.ensureInitialized();
    const parentDir = path.split('/').slice(0, -1).join('/');
    if (parentDir && parentDir !== '') {
      const dirExists = await this.workerThread.execute('isDirectoryDot', { path: parentDir });
      if (!dirExists.exists || !dirExists.isDirectory) throw new Error(`ENOENT: no such directory`);
    }
    const exists = await this.workerThread.execute('isDirectoryDot', { path });
    if (exists.exists) return exists.isDirectory ? -1 : Promise.reject(new Error('ENOTDIR'));

    await this.workerThread.execute('mkdirDot', { dirPath: path, doCommit: this.doImmediateCommit });
    return 0;
  }

  async fs_rmdir(path) {
    await this.ensureInitialized();
    const exists = await this.workerThread.execute('isDirectoryDot', { path });
    if (!exists.exists) throw new Error(`ENOENT`);
    if (!exists.isDirectory) throw new Error(`ENOTDIR`);
    const dirContents = await this.fs_readdir(path);
    if (dirContents.length > 0) throw new Error(`ENOTEMPTY`);
    await this.workerThread.execute('removeDirDot', { dirPath: path, doCommit: this.doImmediateCommit });
    return 0;
  }

  async fs_readdir(path, options = {}) {
    await this.ensureInitialized();
    const exists = await this.workerThread.execute('isDirectoryDot', { path });
    if (!exists.exists) throw new Error(`ENOENT`);
    if (!exists.isDirectory) throw new Error(`ENOTDIR`);
    const result = await this.workerThread.execute('readDirDot', { path });
    return (result?.entries || []).map(e => ({ name: e.name || e.path.split('/').pop(), path: e.path, type: (e.type === 'tree' ? 'dir' : 'file') }));
  }

  async fs_fcloseall() { this.fileDescriptors.clear(); return 0; }
  async fs_fseek(fd, offset, whence) { return 0; }
  async fs_ftell(fd) { return 0; }
  async fs_ftruncate(fd, length) { return 0; }
  async fs_rename(oldPath, newPath) { throw new Error('Not implemented'); }
  async fs_opendir(path) { return 0; }
  async fs_feof(fd) { return false; }
  async fs_fflush(fd) { return 0; }
}

export { NodeFS };
//# sourceMappingURL=NodeFS-BfXyWf6A.js.map
