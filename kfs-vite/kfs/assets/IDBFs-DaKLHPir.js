import { g as getConfig, L as Logger } from './configES6-bU3v7xiC.js';
import { w as workerPool } from './WorkerPool-B814pJ45.js';
import { L as LightningFS } from './index-Da37s8Dj.js';

const config = await getConfig();
const logger = new Logger(config.logging.IDBFs);

function consoleDotLog(...parameters) {
  logger.consoleDotLog('[IDBFS] ', ...parameters);
}

function consoleDotError(...parameters) {
  logger.consoleDotError('[IDBFS] ', ...parameters);
}

class IDBFs {
  constructor(fsName, options = {}) {
    this.fs = new LightningFS(fsName, options);
    this.fileDescriptors = new Map();
    this.fdCounter = 3;
    this.workerEntry = null;
    this.workerThread = null;
    this.fsName = fsName;
    this.versioningStrategy = options?.versioning?.strategy || config.versioning.strategy;
    this.doImmediateCommit = (this.versioningStrategy === 'immediate') ? true : false;

    // Initialize worker asynchronously
    (async () => {
      await this.initializeWorker();
    })();

    consoleDotLog("IDBFS initialized with LightningFS.");
  }

  async initializeWorker() {
    this.workerEntry = await workerPool.getWorker(this.fsName);
    this.workerThread = this.workerEntry.thread;

    await this.workerThread.execute('setFs', {
      fsName: this.fsName,
      fsType: 'idb',
      gitDir: '/'
    });

    consoleDotLog(`Worker initialized for ${this.fsName}`);
  }

  async cleanup() {
    if (this.workerEntry) {
      await workerPool.releaseWorker(this.fsName);
      this.workerEntry = null;
      this.workerThread = null;
    }
  }

  async fs_fopen(filename, mode) {
    if (!this.workerThread) await this.initializeWorker();
    consoleDotLog(`Opening file: ${filename} with mode: ${mode}`);
    
    // Check if parent directory exists for new files
    if (mode.includes('w') || mode.includes('a') || mode.includes('x')) {
      const parentDir = filename.split('/').slice(0, -1).join('/');
      if (parentDir) {
        const dirExists = await this.workerThread.execute('isDirectoryDot', { path: parentDir });
        if (!dirExists.exists || !dirExists.isDirectory) {
          throw new Error(`ENOENT: no such directory, open '${filename}'`);
        }
      }
    }

    const fd = this.fdCounter++;
    this.fileDescriptors.set(fd, { path: filename, pos: 0, mode });
    consoleDotLog(`File descriptor ${fd} created for file: ${filename}`);
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
      if (!this.workerThread) await this.initializeWorker();
      const data = await this.workerThread.execute('readFileDot', { filePath: file.path });
      if (data === null) {
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
      if (!this.workerThread) await this.initializeWorker();
      
      // Check if the file's parent directory exists
      const parentDir = file.path.split('/').slice(0, -1).join('/');
      if (parentDir) {
        const dirExists = await this.workerThread.execute('isDirectoryDot', { path: parentDir });
        if (!dirExists.exists || !dirExists.isDirectory) {
          throw new Error(`ENOENT: no such directory, open '${file.path}'`);
        }
      }

      let currentData = await this.workerThread.execute('readFileDot', { filePath: file.path }).catch(() => "");
      let data = currentData;
      consoleDotLog(`Current data in file ${file.path}:`, data);
      if (data === null) data = "";
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
      if (!this.workerThread) await this.initializeWorker();
      const data = await this.workerThread.execute('readFileDot', { filePath: file.path }).catch(() => "");
      if (whence === "SEEK_SET") file.pos = offset;
      else if (whence === "SEEK_CUR") file.pos += offset;
      else if (whence === "SEEK_END") file.pos = data.length + offset;

      file.pos = Math.max(0, Math.min(file.pos, data.length));
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
      if (!this.workerThread) await this.initializeWorker();
      let currentData = await this.workerThread.execute('readFileDot', { filePath: file.path }).catch(() => "");
      let data = currentData;
      consoleDotLog(`Current data in file ${file.path}:`, data);
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

  async fs_stat(path) {
    consoleDotLog(`Getting stats for path: ${path}`);
  
    try {
      const normalizedPath = path.replace(/^\/+|\/+$/g, '');
      if (!this.workerThread) await this.initializeWorker();
  
      // First check basic existence and directory status
      const exists = await this.workerThread.execute('isDirectoryDot', { path });
      if (!exists.exists) {
        throw new Error(`ENOENT: no such file or directory, stat '${path}'`);
      }
  
      // Get the complete note metadata
      const noteType = exists.isDirectory ? 'dentry' : 'inode';
      const noteData = await this.workerThread.execute('getPathNote', {
        path
      });

      // If note doesn't exist, create basic stats
      if (noteData.error || !noteData || !noteData?.paths?.[normalizedPath]) {
        consoleDotLog(`No note found for ${path}, returning basic stats`);
      }
  
      // Process the full metadata
      const metadata = noteData?.paths?.[normalizedPath]?.metadata || noteData;
      const stats = {
        // Standard fs.Stats properties
        dev: 0,
        ino: metadata.inode || metadata.dentry_id || 0,
        mode: parseInt(metadata.mode, 8) || (exists.isDirectory ? 16877 : 33188),
        nlink: 1,
        uid: metadata.uid || 1000,
        gid: metadata.gid || 1000,
        rdev: 0,
        size: metadata.size || 0,
        blksize: metadata.block_size || 4096,
        blocks: Math.ceil((metadata.size || 0) / 4096),
        atimeMs: new Date(metadata.atime || metadata.updated_at).getTime(),
        mtimeMs: new Date(metadata.mtime || metadata.updated_at).getTime(),
        ctimeMs: new Date(metadata.ctime || metadata.created_at).getTime(),
        birthtimeMs: new Date(metadata.created_at).getTime(),
  
        // Extended properties from notes
        acl: metadata.acl || 'root',
        owner: metadata.owner,
        fsType: metadata.fsType,
        fullPath: metadata.full_path || path,
  
        // Boolean check methods
        isDirectory: () => exists.isDirectory,
        isFile: () => !exists.isDirectory,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isSymbolicLink: () => false,
        isFIFO: () => false,
        isSocket: () => false,
  
        // Timestamp getters
        atime: () => new Date(metadata.atime || metadata.updated_at),
        mtime: () => new Date(metadata.mtime || metadata.updated_at),
        ctime: () => new Date(metadata.ctime || metadata.created_at),
        birthtime: () => new Date(metadata.created_at),
  
        // Additional metadata
        getMetadata: () => metadata,
        getNoteType: () => noteType,
        getAllPaths: () => noteData.filepath_metadata ? Object.keys(noteData.filepath_metadata) : [path]
      };
  
      consoleDotLog(`Retrieved detailed stats for ${path}`, stats);
      return stats;
    } catch (error) {
      consoleDotError(`Error getting stats for path ${path}:`, error);
      
      // Return basic stats if detailed info fails
      if (error.message.includes('ENOENT')) {
        throw error;
      }
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
    if (!this.workerThread) await this.initializeWorker();
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
    if (!this.workerThread) await this.initializeWorker();
    consoleDotLog(`Creating directory: ${path}`);
    try {
      // Check if parent directory exists
      const parentDir = path.split('/').slice(0, -1).join('/');
      if (parentDir) {
        const dirExists = await this.workerThread.execute('isDirectoryDot', { path: parentDir });
        if (!dirExists.exists || !dirExists.isDirectory) {
          throw new Error(`ENOENT: no such directory, mkdir '${path}'`);
        }
      }

      // Check if path already exists
      const exists = await this.workerThread.execute('isDirectoryDot', { path });
      if (exists.exists) {
        throw new Error(`EEXIST: file or directory already exists, mkdir '${path}'`);
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
    if (!this.workerThread) await this.initializeWorker();
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
    if (!this.workerThread) await this.initializeWorker();
    consoleDotLog(`Renaming ${oldPath} to ${newPath}`);
    try {
      // Check if oldPath exists
      const oldExists = await this.workerThread.execute('isDirectoryDot', { path: oldPath });
      if (!oldExists.exists) {
        throw new Error(`ENOENT: no such file or directory, rename '${oldPath}' -> '${newPath}'`);
      }

      // Check if newPath's parent directory exists
      const newParentDir = newPath.split('/').slice(0, -1).join('/');
      if (newParentDir) {
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
    if (!this.workerThread) await this.initializeWorker();
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
      if (!this.workerThread) await this.initializeWorker();

      const exists = await this.workerThread.execute('isDirectoryDot', { path });
      if (!exists.exists) {
        throw new Error(`ENOENT: no such directory, readdir '${path}'`);
      }
      if (!exists.isDirectory) {
        throw new Error(`ENOTDIR: not a directory, readdir '${path}'`);
      }

      const result = await this.workerThread.execute('readDirDot', { path });
      const dirEntries = result?.entries || [];

      return dirEntries.map(entry => ({ path: entry.path, type: (entry.type === 'tree' ? 'dir' : 'file') }));
      
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
      if (!this.workerThread) await this.initializeWorker();
      const data = await this.workerThread.execute('readFileDot', { filePath: file.path }).catch(() => "");
      consoleDotLog(`Current data in file ${file.path}:`, data);
      const eof = file.pos >= data.length;
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

export { IDBFs };
//# sourceMappingURL=IDBFs-DaKLHPir.js.map
