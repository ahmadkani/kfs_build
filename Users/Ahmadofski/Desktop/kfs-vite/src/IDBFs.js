import "./libs/LightningFS.js";
import "./libs/isomorphicgit129.js";
import "./libs/GitHttp.js";
import { Logger } from "./libs/LoggerES6.js";
import { workerPool } from "./WorkerPool.js";
import { config } from './configES6.js';

const logger = new Logger(config.logging.IDBFs);

function consoleDotLog(...parameters) {
  logger.consoleDotLog(...parameters);
}

function consoleDotError(...parameters) {
  logger.consoleDotError(...parameters);
}

class IDBFs {
  constructor(fsName, options = {}) {
    this.fs = new LightningFS(fsName, options);
    this.fileDescriptors = new Map();
    this.fdCounter = 3;
    this.workerEntry = null;
    this.workerThread = null;    
    this.fsName = fsName;
    this.useSW = options?.useSW || null;
    this.versioningStrategy = options?.versioning?.strategy || config.versioning.strategy;
    this.doImmediateCommit = (this.versioningStrategy === 'immediate') ? true : false;

    // Initialize worker asynchronously
    (async () => {
      await this.initializeWorker();
    })();
    
    consoleDotLog("IDBFS initialized with LightningFS.");
  }

  async initializeWorker() {
    this.workerEntry = await workerPool.getWorker(this.fsName, this.useSW);
    this.workerThread = this.workerEntry.thread;
    
    await this.workerThread.setFs({
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
    const fd = this.fdCounter++;
    this.fileDescriptors.set(fd, { path: filename, pos: 0, mode });
    consoleDotLog(`File descriptor ${fd} created for file: ${filename}`);
    return fd;
  }

  async fs_fclose(fd) {
    consoleDotLog(`Closing file descriptor: ${fd}`);
    if (this.fileDescriptors.has(fd)) {
      this.fileDescriptors.delete(fd);
      consoleDotLog(`File descriptor ${fd} closed successfully.`);
      return 0;
    }
    consoleDotError(`File descriptor ${fd} not found.`);
    return -1;
  }

  async fs_fread(fd, length) {
    consoleDotLog(`Reading ${length} bytes from file descriptor: ${fd}`);
    const file = this.fileDescriptors.get(fd);
    if (!file) {
      consoleDotError(`File descriptor ${fd} not found.`);
      return null;
    }

    try {
      if (!this.workerThread) await this.initializeWorker();
      const data = await this.workerThread.readFileDot(file.path);
      consoleDotLog(`Data read from file ${file.path}:`, data);
      if (data === null) {
        consoleDotError(`Data is null for file ${file.path}.`);
        return null;
      }
      const chunk = data.slice(file.pos, file.pos + length);
      file.pos += chunk.length;
      consoleDotLog(`Read chunk: ${chunk}, new position: ${file.pos}`);
      return chunk;
    } catch (error) {
      consoleDotError(`Error reading file ${file.path}:`, error);
      return null;
    }
  }

  async fs_fwrite(fd, content) {
    consoleDotLog(`Writing content to file descriptor: ${fd}`);
    const file = this.fileDescriptors.get(fd);
    if (!file) {
      consoleDotError(`File descriptor ${fd} not found.`);
      return -1;
    }

    try {
      if (!this.workerThread) await this.initializeWorker();
      let data = await this.workerThread.readFileDot(file.path).catch(() => "");
      consoleDotLog(`Current data in file ${file.path}:`, data);
      if (data === null) data = ""; // Ensure data is not null
      data = data.slice(0, file.pos) + content + data.slice(file.pos + content.length);
      await this.workerThread.writeFileDot(file.path, data, this.doImmediateCommit);
      file.pos += content.length;
      consoleDotLog(`Content written to file ${file.path}, new position: ${file.pos}`);
      return content.length;
    } catch (error) {
      consoleDotError(`Error writing to file ${file.path}:`, error);
      return -1;
    }
  }

  async fs_fseek(fd, offset, whence) {
    consoleDotLog(`Seeking in file descriptor: ${fd}, offset: ${offset}, whence: ${whence}`);
    const file = this.fileDescriptors.get(fd);
    if (!file) {
      consoleDotError(`File descriptor ${fd} not found.`);
      return -1;
    }

    try {
      if (!this.workerThread) await this.initializeWorker();
      const data = await this.workerThread.readFileDot(file.path).catch(() => "");
      consoleDotLog(`Current data in file ${file.path}:`, data);
      if (whence === "SEEK_SET") file.pos = offset;
      else if (whence === "SEEK_CUR") file.pos += offset;
      else if (whence === "SEEK_END") file.pos = data.length + offset;

      file.pos = Math.max(0, Math.min(file.pos, data.length));
      consoleDotLog(`New position in file ${file.path}: ${file.pos}`);
      return 0;
    } catch (error) {
      consoleDotError(`Error seeking in file ${file.path}:`, error);
      return -1;
    }
  }

  async fs_ftell(fd) {
    consoleDotLog(`Getting current position for file descriptor: ${fd}`);
    const file = this.fileDescriptors.get(fd);
    if (!file) {
      consoleDotError(`File descriptor ${fd} not found.`);
      return -1;
    }
    consoleDotLog(`Current position in file ${file.path}: ${file.pos}`);
    return file.pos;
  }

  async fs_ftruncate(fd, length) {
    consoleDotLog(`Truncating file descriptor: ${fd} to length: ${length}`);
    const file = this.fileDescriptors.get(fd);
    if (!file) {
      consoleDotError(`File descriptor ${fd} not found.`);
      return -1;
    }

    try {
      if (!this.workerThread) await this.initializeWorker();
      let data = await this.workerThread.readFileDot(file.path).catch(() => "");
      consoleDotLog(`Current data in file ${file.path}:`, data);
      data = data.slice(0, length);
      await this.workerThread.writeFileDot(file.path, data, this.doImmediateCommit);
      consoleDotLog(`File ${file.path} truncated to length: ${length}`);
      return 0;
    } catch (error) {
      consoleDotError(`Error truncating file ${file.path}:`, error);
      return -1;
    }
  }

  async fs_stat(path) {
    consoleDotLog(`Getting stats for path: ${path}`);
    
    try {
      if (!this.workerThread) await this.initializeWorker();
      // Get basic stats from worker thread
      const stats = '...'//await this.workerThread.stat(path);
      
      if (!stats) {
        consoleDotError(`Path not found: ${path}`);
        return null;
      }

      // Enhance stats with type checking methods
      return {
        ...stats,
        isDirectory: async () => {
          consoleDotLog('path: ', path);
          const isDirectory = await this.workerThread.isDirectoryDot(path);
          return isDirectory.exists ? isDirectory.isDirectory : false;
        },
        isFile: async () => {
          const isDirectory = await this.workerThread.isDirectoryDot(path)
          return isDirectory.exists ? !isDirectory.isDirectory : false;
        },
      };
      
    } catch (error) {
      consoleDotError(`Error getting stats for path ${path}:`, error);
      return null;
    }
  }

  async fs_fstat(fd) {
    consoleDotLog(`Getting stats for file descriptor: ${fd}`);
    const file = this.fileDescriptors.get(fd);
    if (!file) {
      consoleDotError(`File descriptor ${fd} not found.`);
      return null;
    }
    return this.fs_stat(file.path);
  }

  async fs_remove(path) {
    if (!this.workerThread) await this.initializeWorker();
    consoleDotLog(`Removing file: ${path}`);
    return this.workerThread.removeFileDot(path, this.doImmediateCommit).catch((error) => {
      consoleDotError(`Error removing file ${path}:`, error);
      return -1;
    });
  }

  async fs_mkdir(path) {
    if (!this.workerThread) await this.initializeWorker();
    consoleDotLog(`Creating directory: ${path}`);
    return this.workerThread.mkdirDot(path, this.doImmediateCommit).catch((error) => {
      consoleDotError(`Error creating directory ${path}:`, error);
      return -1;
    });
  }

  async fs_rmdir(path) {
    if (!this.workerThread) await this.initializeWorker();
    consoleDotLog(`Removing directory: ${path}`);
    return this.workerThread.removeDirDot(path, this.doImmediateCommit).catch((error) => {
      consoleDotError(`Error removing directory ${path}:`, error);
      return -1;
    });
  }

  async fs_rename(oldPath, newPath) {
    if (!this.workerThread) await this.initializeWorker();
    consoleDotLog(`Renaming ${oldPath} to ${newPath}`);
    //Fake function
    return this.workerThread.rename(oldPath, newPath).catch((error) => {
      consoleDotError(`Error renaming ${oldPath} to ${newPath}:`, error);
      return -1;
    });
  }

  async fs_opendir(path) {
    if (!this.workerThread) await this.initializeWorker();
    consoleDotLog(`Opening directory: ${path}`);
    //Fake function
    return this.workerThread.opendir(path).catch((error) => {
      consoleDotError(`Error opening directory ${path}:`, error);
      return -1;
    });
  }

  async fs_readdir(path, options = {}) {
    consoleDotLog(`Reading directory: ${path}`);
    try {
      if (!this.workerThread) await this.initializeWorker();
      
      const result = await this.workerThread.readDirDot(path);
      const dirEntries = result.entries || [];
  
      return options.fullObjects ? dirEntries : dirEntries.map(entry => entry.path);
    } catch (error) {
      consoleDotError(`Error reading directory ${path}:`, error);
      return [];
    }
  }  

  async fs_feof(fd) {
    consoleDotLog(`Checking EOF for file descriptor: ${fd}`);
    const file = this.fileDescriptors.get(fd);
    if (!file) {
      consoleDotError(`File descriptor ${fd} not found.`);
      return true;
    }

    try {
      if (!this.workerThread) await this.initializeWorker();
      const data = await this.workerThread.readFileDot(file.path).catch(() => "");
      consoleDotLog(`Current data in file ${file.path}:`, data);
      const eof = file.pos >= data.length;
      consoleDotLog(`EOF status for file ${file.path}: ${eof}`);
      return eof;
    } catch (error) {
      consoleDotError(`Error checking EOF for file ${file.path}:`, error);
      return true;
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