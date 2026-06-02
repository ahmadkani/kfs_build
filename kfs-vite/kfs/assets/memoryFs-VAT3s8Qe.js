import { w as workerPool } from './WorkerPool-B814pJ45.js';
import { g as getConfig, L as Logger } from './configES6-bU3v7xiC.js';

const config = await getConfig();
const logger = new Logger(config.logging.memoryFS);

function consoleDotLog(...parameters) {
  logger.consoleDotLog('[ MemoryFS ] ', ...parameters);
}

function consoleDotError(...parameters) {
  logger.consoleDotError('[ MemoryFS ] ', ...parameters);
}

consoleDotLog('memoryFs loaded.');

class MemoryFS {
  constructor(fsName, options = {}) {
    this.fsName = fsName;
    this.fileDescriptors = new Map();
    this.fdCounter = 3;
    this.workerEntry = null;
    this.workerThread = null;
    this.versioningStrategy = options?.versioning?.strategy || config.versioning.strategy;
    this.doImmediateCommit = (this.versioningStrategy === 'immediate') ? true : false;
    this.isInitialized = false;
    consoleDotLog(`MemoryFS created for ${fsName}`);
  }

  async initializeWorker() {
    if (this.isInitialized && this.workerThread) return;
    
    this.workerEntry = await workerPool.getWorker(this.fsName);
    this.workerThread = this.workerEntry.thread;

    await this.workerThread.execute('setFs', {
      fsName: this.fsName,
      fsType: 'memory',
    });

    this.isInitialized = true;
    consoleDotLog(`Worker initialized for ${this.fsName}`);
  }

  async cleanup() {
    if (this.workerEntry) {
      await workerPool.releaseWorker(this.fsName);
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

  async fs_fopen(filename, mode) {
    await this.ensureInitialized();
    
    // Check if parent directory exists for new files
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
    consoleDotLog(`File descriptor ${fd} created for ${filename}`);
    return fd;
  }

  async fs_fclose(fd) {
    consoleDotLog(`Closing file descriptor: ${fd}`);
    if (!this.fileDescriptors.has(fd)) {
      throw new Error(`EBADF: bad file descriptor, close '${fd}'`);
    }
    this.fileDescriptors.delete(fd);
    consoleDotLog(`File descriptor ${fd} closed successfully.`);
    return 0;
  }

  async fs_fread(fd, length) {
    consoleDotLog(`Reading ${length} bytes from file descriptor: ${fd}`);
    const file = this.fileDescriptors.get(fd);
    if (!file) {
      throw new Error(`EBADF: bad file descriptor, read '${fd}'`);
    }

    try {
      await this.ensureInitialized();
      const data = await this.workerThread.execute('readFileDot', { filePath: file.path });
      if (data === null || data === undefined) {
        throw new Error(`ENOENT: no such file, read '${file.path}'`);
      }
      const chunk = data.slice(file.pos, file.pos + length);
      file.pos += chunk.length;
      consoleDotLog(`Read chunk: ${chunk}, new position: ${file.pos}`);
      return chunk;
    } catch (error) {
      consoleDotError(`Error reading file ${file.path}:`, error);
      throw error;
    }
  }

  async fs_fwrite(fd, content) {
    consoleDotLog(`Writing content to file descriptor: ${fd}`);
    const file = this.fileDescriptors.get(fd);
    if (!file) {
      throw new Error(`EBADF: bad file descriptor, write '${fd}'`);
    }

    try {
      await this.ensureInitialized();
      
      // Check if the file's parent directory exists
      const parentDir = file.path.split('/').slice(0, -1).join('/');
      if (parentDir && parentDir !== '') {
        const dirExists = await this.workerThread.execute('isDirectoryDot', { path: parentDir });
        if (!dirExists.exists || !dirExists.isDirectory) {
          throw new Error(`ENOENT: no such directory, open '${file.path}'`);
        }
      }

      let currentData = await this.workerThread.execute('readFileDot', { filePath: file.path }).catch(() => "");
      let data = currentData;
      consoleDotLog(`Current data in file ${file.path}:`, data);
      if (data === null || data === undefined) data = "";
      data = data.slice(0, file.pos) + content + data.slice(file.pos + content.length);
      await this.workerThread.execute('writeFileDot', {
        filePath: file.path,
        fileContent: data,
        doCommit: this.doImmediateCommit
      });
      file.pos += content.length;
      consoleDotLog(`Content written to file ${file.path}, new position: ${file.pos}`);
      return content.length;
    } catch (error) {
      consoleDotError(`Error writing to file ${file.path}:`, error);
      throw error;
    }
  }

  async fs_fseek(fd, offset, whence) {
    consoleDotLog(`Seeking in file descriptor: ${fd}, offset: ${offset}, whence: ${whence}`);
    const file = this.fileDescriptors.get(fd);
    if (!file) {
      throw new Error(`EBADF: bad file descriptor, seek '${fd}'`);
    }

    try {
      await this.ensureInitialized();
      const data = await this.workerThread.execute('readFileDot', { filePath: file.path }).catch(() => "");
      if (whence === "SEEK_SET") file.pos = offset;
      else if (whence === "SEEK_CUR") file.pos += offset;
      else if (whence === "SEEK_END") file.pos = (data?.length || 0) + offset;

      file.pos = Math.max(0, Math.min(file.pos, data?.length || 0));
      consoleDotLog(`New position in file ${file.path}: ${file.pos}`);
      return 0;
    } catch (error) {
      consoleDotError(`Error seeking in file ${file.path}:`, error);
      throw error;
    }
  }

  async fs_ftell(fd) {
    consoleDotLog(`Getting current position for file descriptor: ${fd}`);
    const file = this.fileDescriptors.get(fd);
    if (!file) {
      throw new Error(`EBADF: bad file descriptor, tell '${fd}'`);
    }
    consoleDotLog(`Current position in file ${file.path}: ${file.pos}`);
    return file.pos;
  }

  async fs_ftruncate(fd, length) {
    consoleDotLog(`Truncating file descriptor: ${fd} to length: ${length}`);
    const file = this.fileDescriptors.get(fd);
    if (!file) {
      throw new Error(`EBADF: bad file descriptor, truncate '${fd}'`);
    }

    try {
      await this.ensureInitialized();
      let currentData = await this.workerThread.execute('readFileDot', { filePath: file.path }).catch(() => "");
      let data = currentData;
      consoleDotLog(`Current data in file ${file.path}:`, data);
      if (data === null || data === undefined) data = "";
      data = data.slice(0, length);
      await this.workerThread.execute('writeFileDot', {
        filePath: file.path,
        fileContent: data,
        doCommit: this.doImmediateCommit
      });
      consoleDotLog(`File ${file.path} truncated to length: ${length}`);
      return 0;
    } catch (error) {
      consoleDotError(`Error truncating file ${file.path}:`, error);
      throw error;
    }
  }

  async fs_stat(path, visited = new Set()) {
    consoleDotLog(`Getting stats for path: ${path}`);
    
    // Prevent infinite recursion
    const pathKey = path.toString();
    if (visited.has(pathKey)) {
      consoleDotError(`Circular reference detected at ${path}`);
      throw new Error(`Circular reference detected at ${path}`);
    }
    visited.add(pathKey);
  
    try {
      // Normalize path
      const normalizedPath = path.replace(/^\/+|\/+$/g, '');
      
      await this.ensureInitialized();
  
      // Check basic existence - don't use fs_stat recursively
      const exists = await this.workerThread.execute('isDirectoryDot', { path });
      
      // If path doesn't exist, throw ENOENT
      if (!exists.exists) {
        throw new Error(`ENOENT: no such file or directory, stat '${path}'`);
      }
  
      // Get note metadata without causing recursion
      let noteData = null;
      try {
        noteData = await this.workerThread.execute('getPathNote', { path });
      } catch (noteError) {
        consoleDotLog(`Could not get note for ${path}:`, noteError.message);
      }
  
      // Extract metadata safely
      const metadata = noteData?.paths?.[normalizedPath]?.metadata || 
                       noteData || 
                       { created_at: Date.now(), updated_at: Date.now() };
  
      // Create stats object
      const stats = {
        // Standard fs.Stats properties
        dev: 0,
        ino: metadata.inode || metadata.dentry_id || Math.floor(Math.random() * 1000000),
        mode: exists.isDirectory ? 0o40777 : 0o100644, // Directory or file with proper mode
        nlink: 1,
        uid: metadata.uid || 1000,
        gid: metadata.gid || 1000,
        rdev: 0,
        size: metadata.size || 0,
        blksize: metadata.block_size || 4096,
        blocks: Math.ceil((metadata.size || 0) / 512),
        atimeMs: metadata.atime ? new Date(metadata.atime).getTime() : Date.now(),
        mtimeMs: metadata.mtime ? new Date(metadata.mtime).getTime() : Date.now(),
        ctimeMs: metadata.ctime ? new Date(metadata.ctime).getTime() : Date.now(),
        birthtimeMs: metadata.created_at ? new Date(metadata.created_at).getTime() : Date.now(),
  
        // Deno/Node compatibility methods
        isDirectory: () => exists.isDirectory === true,
        isFile: () => exists.isDirectory === false,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isSymbolicLink: () => false,
        isFIFO: () => false,
        isSocket: () => false,
  
        // Timestamp getters for compatibility
        atime: new Date(metadata.atime || Date.now()),
        mtime: new Date(metadata.mtime || Date.now()),
        ctime: new Date(metadata.ctime || Date.now()),
        birthtime: new Date(metadata.created_at || Date.now()),
      };
  
      // Add helper methods that Node.js expects
      stats.isDirectory = stats.isDirectory.bind(stats);
      stats.isFile = stats.isFile.bind(stats);
      stats.isBlockDevice = stats.isBlockDevice.bind(stats);
      stats.isCharacterDevice = stats.isCharacterDevice.bind(stats);
      stats.isSymbolicLink = stats.isSymbolicLink.bind(stats);
      stats.isFIFO = stats.isFIFO.bind(stats);
      stats.isSocket = stats.isSocket.bind(stats);
  
      consoleDotLog(`Retrieved stats for ${path}:`, { 
        isDirectory: stats.isDirectory(), 
        size: stats.size,
        mode: stats.mode.toString(8)
      });
      
      return stats;
    } catch (error) {
      consoleDotError(`Error getting stats for path ${path}:`, error.message);
      throw error;
    }
  }

  async fs_fstat(fd) {
    consoleDotLog(`Getting stats for file descriptor: ${fd}`);
    const file = this.fileDescriptors.get(fd);
    if (!file) {
      throw new Error(`EBADF: bad file descriptor, fstat '${fd}'`);
    }
    return this.fs_stat(file.path);
  }

  async fs_remove(path) {
    await this.ensureInitialized();
    consoleDotLog(`Removing file: ${path}`);
    try {
      const exists = await this.workerThread.execute('isDirectoryDot', { path });
      if (!exists.exists) {
        throw new Error(`ENOENT: no such file, unlink '${path}'`);
      }
      if (exists.isDirectory) {
        throw new Error(`EISDIR: illegal operation on a directory, unlink '${path}'`);
      }
      
      await this.workerThread.execute('removeFileDot', {
        filePath: path,
        doCommit: this.doImmediateCommit
      });
      return 0;
    } catch (error) {
      consoleDotError(`Error removing file ${path}:`, error);
      throw error;
    }
  }

  async fs_mkdir(path) {
    await this.ensureInitialized();
    consoleDotLog(`Creating directory: ${path}`);
    try {
      // Check if parent directory exists
      const parentDir = path.split('/').slice(0, -1).join('/');
      if (parentDir && parentDir !== '') {
        const dirExists = await this.workerThread.execute('isDirectoryDot', { path: parentDir });
        if (!dirExists.exists || !dirExists.isDirectory) {
          throw new Error(`ENOENT: no such directory, mkdir '${path}'`);
        }
      }

      // Check if path already exists
      const exists = await this.workerThread.execute('isDirectoryDot', { path });
      if (exists.exists) {
        if (exists.isDirectory) {
          consoleDotError(`EEXIST: directory already exists, mkdir '${path}'`);
          return -1;
        } else {
          throw new Error(`ENOTDIR: path exists but is not a directory, mkdir '${path}'`);
        }
      }

      await this.workerThread.execute('mkdirDot', {
        dirPath: path,
        doCommit: this.doImmediateCommit
      });
      return 0;
    } catch (error) {
      consoleDotError(`Error creating directory ${path}:`, error);
      throw error;
    }
  }

  async fs_rmdir(path) {
    await this.ensureInitialized();
    consoleDotLog(`Removing directory: ${path}`);
    try {
      const exists = await this.workerThread.execute('isDirectoryDot', { path });
      if (!exists.exists) {
        throw new Error(`ENOENT: no such directory, rmdir '${path}'`);
      }
      if (!exists.isDirectory) {
        throw new Error(`ENOTDIR: not a directory, rmdir '${path}'`);
      }

      // Check if directory is empty
      const dirContents = await this.fs_readdir(path);
      if (dirContents.length > 0) {
        throw new Error(`ENOTEMPTY: directory not empty, rmdir '${path}'`);
      }

      await this.workerThread.execute('removeDirDot', {
        dirPath: path,
        doCommit: this.doImmediateCommit
      });
      return 0;
    } catch (error) {
      consoleDotError(`Error removing directory ${path}:`, error);
      throw error;
    }
  }

  async fs_rename(oldPath, newPath) {
    await this.ensureInitialized();
    consoleDotLog(`Renaming ${oldPath} to ${newPath}`);
    try {
      // Check if oldPath exists
      const oldExists = await this.workerThread.execute('isDirectoryDot', { path: oldPath });
      if (!oldExists.exists) {
        throw new Error(`ENOENT: no such file or directory, rename '${oldPath}' -> '${newPath}'`);
      }

      // Check if newPath's parent directory exists
      const newParentDir = newPath.split('/').slice(0, -1).join('/');
      if (newParentDir && newParentDir !== '') {
        const parentExists = await this.workerThread.execute('isDirectoryDot', { path: newParentDir });
        if (!parentExists.exists || !parentExists.isDirectory) {
          throw new Error(`ENOENT: no such directory, rename '${oldPath}' -> '${newPath}'`);
        }
      }

      await this.workerThread.execute('rename', {
        oldPath,
        newPath
      });
      return 0;
    } catch (error) {
      consoleDotError(`Error renaming ${oldPath} to ${newPath}:`, error);
      throw error;
    }
  }

  async fs_opendir(path) {
    await this.ensureInitialized();
    consoleDotLog(`Opening directory: ${path}`);
    try {
      const exists = await this.workerThread.execute('isDirectoryDot', { path });
      if (!exists.exists) {
        throw new Error(`ENOENT: no such directory, opendir '${path}'`);
      }
      if (!exists.isDirectory) {
        throw new Error(`ENOTDIR: not a directory, opendir '${path}'`);
      }

      await this.workerThread.execute('opendir', { path });
      return 0;
    } catch (error) {
      consoleDotError(`Error opening directory ${path}:`, error);
      throw error;
    }
  }

  async fs_readdir(path, options = {}) {
    consoleDotLog(`Reading directory: ${path}`);
    try {
      await this.ensureInitialized();

      const exists = await this.workerThread.execute('isDirectoryDot', { path });
      if (!exists.exists) {
        throw new Error(`ENOENT: no such directory, readdir '${path}'`);
      }
      if (!exists.isDirectory) {
        throw new Error(`ENOTDIR: not a directory, readdir '${path}'`);
      }

      const result = await this.workerThread.execute('readDirDot', { path });
      const dirEntries = result?.entries || [];

      return dirEntries.map(entry => ({ 
        name: entry.name || entry.path.split('/').pop(),
        path: entry.path, 
        type: (entry.type === 'tree' ? 'dir' : 'file') 
      }));
    } catch (error) {
      consoleDotError(`Error reading directory ${path}:`, error);
      throw error;
    }
  }

  async fs_feof(fd) {
    consoleDotLog(`Checking EOF for file descriptor: ${fd}`);
    const file = this.fileDescriptors.get(fd);
    if (!file) {
      throw new Error(`EBADF: bad file descriptor, eof '${fd}'`);
    }

    try {
      await this.ensureInitialized();
      const data = await this.workerThread.execute('readFileDot', { filePath: file.path }).catch(() => "");
      consoleDotLog(`Current data in file ${file.path}:`, data);
      const eof = file.pos >= (data?.length || 0);
      consoleDotLog(`EOF status for file ${file.path}: ${eof}`);
      return eof;
    } catch (error) {
      consoleDotError(`Error checking EOF for file ${file.path}:`, error);
      throw error;
    }
  }

  async fs_fflush(fd) {
    consoleDotLog(`Flushing file descriptor: ${fd}`);
    return 0;
  }

  async fs_fcloseall() {
    consoleDotLog("Closing all file descriptors.");
    this.fileDescriptors.clear();
    return 0;
  }
}

export { MemoryFS };
//# sourceMappingURL=memoryFs-VAT3s8Qe.js.map
