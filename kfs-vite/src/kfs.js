import { VFS } from "./vfs.js";
import { Logger } from "./libs/LoggerES6.js";
import { config } from './configES6.js';
import { VersioningManager } from './libs/kfsUtils/versioningManager.js';
import { MergingManager } from './libs/kfsUtils/mergingManager.js';

const logger = new Logger(config.logging.kfs);

function consoleDotLog(...params) {
  logger.consoleDotLog('[KFS]', ...params);
}

function consoleDotError(...params) {
  logger.consoleDotError('[KFS]', ...params);
}

export class KFS {
  constructor() {
    this.vfs = new VFS();
    this.fsInstance = null;
    this.versioningManager = new VersioningManager(this.vfs);
    this.mergingManager = new MergingManager(this.vfs);    
    this.commitCount = 0;
  }
  
  // -------------------------------
  // Versioning Configuration
  // -------------------------------
  
  _setupVersioningAndMerging(options) {
    this.versioningManager.setup(options);
    this.mergingManager.setup(options);
  }
  
  _clearClocks() {
    this.versioningManager.clearClock();
    this.mergingManager.clearClock();
  }
  
  async _handleCommit(message) {
    const versioningConfig = await this.versioningManager.getConfig();
    const mergingConfig = await this.mergingManager.getConfig();
    
    await this.vfs.versioner(message);
    this.commitCount++;
    
    if (mergingConfig.strategy === 'immediate') {
      await this.vfs.merger();
    }
  }
  
  // -------------------------------
  // Filesystem Operations
  // -------------------------------

  async mount(path, fsType, fsName, fetchMethod, options = {}) {
    try {
      this._setupVersioningAndMerging(options);
      
      path = this._normalizePath(path);
      const versioningConfig = await this.versioningManager.getConfig();
      const mergingConfig = await this.mergingManager.getConfig();
      
      const mountData = await this.vfs.mount(path, fsType, fsName, fetchMethod, {
        ...options,
        versioning: versioningConfig,
        merging: mergingConfig
      });

      this.fsInstance = mountData.fsInstance;
      const root = await this.read(`${path}/${fsName}`);
      consoleDotLog('Mount successful, root:', root);
      return mountData;
    } catch (error) {
      consoleDotError(`Failed to mount filesystem at ${path}:`, error);
      throw new Error(`Failed to mount filesystem: ${error.message}`);
    }
  }

  async unmount(path, fsName) {
    try {
      path = this._normalizePath(path);
      await this.vfs.unmount(path, fsName);
      this.fsInstance = null;
      this._clearClocks();
      this.commitCount = 0;
      return { success: true };
    } catch (error) {
      consoleDotError(`Failed to unmount filesystem at ${path}:`, error);
      throw new Error(`Failed to unmount filesystem: ${error.message}`);
    }
  }


  async setMergingStrategy(mergingStrategy) {
    await this.vfs.setMergingStrategy(mergingStrategy);
    consoleDotLog('Merging strategy set to:', mergingStrategy);
  }

  async setVersioingStrategy(versioningStrategy) {
    await this.vfs.setVersioingStrategy(versioningStrategy);
    consoleDotLog('Versioning strategy set to:', versioningStrategy);
  }

  /**
   * Sets user configurations for the KFS instance.
    * @param {string} [args.name] - The name of the user.
    * @param {string} [args.email] - The email of the user.
    * @param {string} [args.username] - The username of the user.
    * @param {string} [args.password] - The password of the user.
    * @throws {Error} - Throws an error if the arguments are invalid or if the operation fails.
   */
  async setUserConfigs(args) {
    if (!args || typeof args !== 'object') {
      throw new Error('Invalid arguments: must be an object');
    }
    const allowedFields = ['password', 'username', 'email', 'name'];
    const invalidFields = Object.keys(args).filter(
      field => !allowedFields.includes(field)
    );
  
    if (invalidFields.length > 0) {
      throw new Error(
        `Invalid field(s) provided: ${invalidFields.join(', ')}. ` +
        `Allowed fields are: ${allowedFields.join(', ')}`
      );
    }
    
    this.vfs.setUserConfigs(args);
    return args;
  }

  async create(path, type = 'file', content = '') {
    try {
      if (!['file', 'dir'].includes(type)) {
        throw new Error(`Invalid type: ${type}. Must be 'file' or 'dir'`);
      }

      path = this._normalizePath(path);
      const { fs, relativePath, versioning } = await this.vfs.resolveFS(path);
  
      if (type === 'file') {
          await this._ensurePathExists(fs, relativePath);
      }

      if (type === 'dir') {
        await fs.fsInstance.fs_mkdir(relativePath);
      } else {
        const fd = await fs.fsInstance.fs_fopen(relativePath, 'w');
        await fs.fsInstance.fs_fwrite(fd, content);
        await fs.fsInstance.fs_fclose(fd);
      }

      await this.vfs.writeToFsTable(relativePath, type, content.length);

      if (versioning?.strategy === 'immediate') {
        await this._handleCommit(`Created ${type} at ${path}`);
      } else {
        await this.versioningManager.maybeTriggerVersioning(versioning);
      }

      return { success: true };
    } catch (error) {
      consoleDotError(`Failed to create ${type} at ${path}:`, error);
      throw new Error(`Failed to create: ${error.message}`);
    }
  }

  async remove(path) {
    try {
      path = this._normalizePath(path);
      const { fs, relativePath, versioning } = await this.vfs.resolveFS(path);

      const stats = await fs.fsInstance.fs_stat(relativePath);
      if (!stats) throw new Error('ENOENT: no such file or directory');

      if (await stats.isDirectory()) {
        await fs.fsInstance.fs_rmdir(relativePath);
      } else {
        await fs.fsInstance.fs_remove(relativePath);
      }

      await this.vfs.removeFromFsTable(relativePath);

      if (versioning?.strategy === 'immediate') {
        await this._handleCommit(`Removed ${path}`);
      } else {
        await this.versioningManager.maybeTriggerVersioning(versioning);
      }

      return { success: true };
    } catch (error) {
      consoleDotError(`Failed to remove ${path}:`, error);
      throw new Error(`Failed to remove: ${error.message}`);
    }
  }

  async read(path) {
    try {
      path = this._normalizePath(path);
      const { fs, relativePath } = await this.vfs.resolveFS(path);
      this.fsInstance = fs.fsInstance;

      const stats = await this.fsInstance.fs_stat(relativePath);
      if (!stats) throw new Error('ENOENT: no such file or directory');

      if (await stats.isDirectory()) {
        return await this.fsInstance.fs_readdir(relativePath);
      } else {
        const fd = await this.fsInstance.fs_fopen(relativePath, 'r');
        const data = await this.fsInstance.fs_fread(fd, 1024);
        await this.fsInstance.fs_fclose(fd);
        return data;
      }
    } catch (error) {
      throw new Error(`Failed to read file: ${error.message}`);
    }
  }

  // -------------------------------
  // Utility Methods
  // -------------------------------
  async _ensurePathExists(fs, path) {
    const parts = path.split('/').filter(p => p !== '');
    
    const dirParts = parts.slice(0, -1);
    let currentPath = '';
    
    for (const part of dirParts) {
        currentPath = currentPath ? `${currentPath}/${part}` : `/${part}`;
        try {
            await fs.fsInstance.fs_mkdir(currentPath);
            await this.vfs.writeToFsTable(currentPath, 'dir');
        } catch (error) {
            if (!error.message.includes('exists')) throw error;
        }
    }
  }

  _normalizePath(path) {
    if (typeof path !== 'string') throw new Error('Path must be a string');
    return path.startsWith('/') ? path : `/${path}`;
  }
}

export { serviceWorker } from './libs/sw-register.js';