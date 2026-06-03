import { VFS } from "./vfs.js";
import { Logger } from "./libs/LoggerES6.js";
import { getConfig } from './configES6.js';
import { VersioningManager } from './libs/kfsUtils/versioningManager.js';
import { MergingManager } from './libs/kfsUtils/mergingManager.js';

export class KFS {
  constructor() {
    this.vfs = new VFS();
    this.fsInstance = null;
    this.versioningManager = new VersioningManager(this.vfs);
    this.mergingManager = new MergingManager(this.vfs);    
    this.commitCount = 0;
    this.mountPaths = null;
    this.mergingConfig = null;
    this.initialized = false;
    
    // FIX: Initialize config and logger as null, load them in init()
    this.config = null;
    this.logger = null;

    // FIX: Store the initialization promise so other methods can wait for it
    this.ready = this.init();
  }

  // Internal logger wrapper to handle cases where logger isn't ready yet
  _log(...params) {
    if (this.logger) {
      this.logger.consoleDotLog('[KFS]', ...params);
    } else {
      console.log('[KFS]', ...params);
    }
  }

  _error(...params) {
    if (this.logger) {
      this.logger.consoleDotError('[KFS]', ...params);
    } else {
      console.error('[KFS]', ...params);
    }
  }
  
  async init() {
    if (this.initialized) return;

    // FIX: Load config here instead of top-level
    this.config = await getConfig();
    this.logger = new Logger(this.config.logging.kfs);

    this._log('Initializing KFS instance...');
    
    this.mountPaths = await this.vfs.getMountPaths();
    this.initialized = true;
    
    this._log('mountpaths: ', this.mountPaths);
    return this;
  }

  // FIX: Helper method to ensure initialization is complete before running logic
  async _ensureReady() {
    await this.ready;
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
    this.mergingConfig = await this.mergingManager.getConfig();
    const strategyMap = { remote: 'theirs', local: 'ours', combine: 'combine' };
    const userStrategy = this.mergingConfig?.onConflictStrategy || 'remote';
    const onConflictStrategy = strategyMap[userStrategy] || 'remote';

    await this.vfs.versioner(message);
    this.commitCount++;
    
    if (this.mergingConfig?.strategy === 'immediate') {
      await this.vfs.merger(onConflictStrategy);
    }
  }
  
  async merge() {
    try {
      await this._ensureReady(); // ENSURE READY
      this._log('Merging...', this.mountPaths);

      const strategyMap = { remote: 'theirs', local: 'ours', combine: 'combine' };
      const userStrategy = this.mergingConfig?.onConflictStrategy || 'remote';
      const onConflictStrategy = strategyMap[userStrategy] || 'remote';

      this._log('Merging...', this.mountPaths);
      await this.vfs.merger(onConflictStrategy);
      this._log('Merge completed successfully.');
    } catch(error) {
      this._error('Merge failed:', error);
      throw new Error(`Failed to merge: ${error.message}`);
    }
  }
  
  // -------------------------------
  // Filesystem Operations
  // -------------------------------

  async mount(path, fsType, fsName, fetchMethod, options = {}) {
    try {
      await this._ensureReady(); // ENSURE READY
      
      this._setupVersioningAndMerging(options);
      path = this._normalizePath(path);
      const versioningConfig = await this.versioningManager.getConfig();
      this.mergingConfig = await this.mergingManager.getConfig();
      
      const mountData = await this.vfs.mount(path, fsType, fsName, fetchMethod, {
        ...options,
        versioning: versioningConfig,
        merging: this.mergingConfig
      });
      this.mergingConfig = mountData.merging;

      this.fsInstance = mountData.fsInstance;
      const root = await this.read(`${path}/${fsName}`);
      this.mountPaths = await this.vfs.getMountPaths();
      this._log('Mount successful, root:', root);
      return mountData;
    } catch (error) {
      this._error(`Failed to mount filesystem at ${path}:`, error);
      throw new Error(`Failed to mount filesystem: ${error.message}`);
    }
  }

  async unmount(path, fsName) {
    try {
      await this._ensureReady(); // ENSURE READY
      
      path = this._normalizePath(path);
      await this.vfs.unmount(path, fsName);
      this.fsInstance = null;
      this._clearClocks();
      this.commitCount = 0;
      return { success: true };
    } catch (error) {
      this._error(`Failed to unmount filesystem at ${path}:`, error);
      throw new Error(`Failed to unmount filesystem: ${error.message}`);
    }
  }


  async setMergingStrategy(mergingStrategy) {
    await this._ensureReady();
    await this.vfs.setMergingStrategy(mergingStrategy);
    this._log('Merging strategy set to:', mergingStrategy);
  }

  async setVersioingStrategy(versioningStrategy) {
    await this._ensureReady();
    await this.vfs.setVersioingStrategy(versioningStrategy);
    this._log('Versioning strategy set to:', versioningStrategy);
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
    // FIX: Wait for ready before validating or setting config
    await this._ensureReady();

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
    
    args && await this.vfs.setUserConfigs(args);
    return args;
  }

  async create(path, type = 'file', content = '', mode = 'w') {
    try {
      await this._ensureReady(); // ENSURE READY

      if (!['file', 'dir'].includes(type)) {
        throw new Error(`Invalid type: ${type}. Must be 'file' or 'dir'`);
      }
      if (!['a', 'w'].includes(mode)) {
        throw new Error(`Invalid mode: ${mode}. Must be 'a' (append) or 'w' (write)`);
      }
  
      path = this._normalizePath(path);

      if (this.mountPaths && this.mountPaths.includes(path)) {
        throw new Error(`Cannot write directly to mount path (${path}). Use mount() instead.`);
      }


      const { fs, relativePath, versioning } = await this.vfs.resolveFS(path);
  
      if (type === 'file') {
        await this._ensurePathExists(fs, relativePath);
        
        let finalContent = content;
        let operationMessage = `Created file at ${path}`;
        
        if (mode === 'a') {
          try {
            // Try to read existing content
            const fd = await fs.fsInstance.fs_fopen(relativePath, 'r');
            const existingContent = await fs.fsInstance.fs_fread(fd, 1024*1024); // Read up to 1MB
            await fs.fsInstance.fs_fclose(fd);
            
            finalContent = existingContent + content;
            operationMessage = `Appended to file at ${path}`;
          } catch (readError) {
            // File doesn't exist yet, proceed with normal creation
            operationMessage = `Created file at ${path}`;
          }
        }
  
        const fd = await fs.fsInstance.fs_fopen(relativePath, 'w'); // Always use 'w' here since we've handled append logic
        const writeResult = await fs.fsInstance.fs_fwrite(fd, finalContent);
        if (writeResult === -1) {
          throw new Error('Failed to write to file');
        }
        
        await fs.fsInstance.fs_fclose(fd);
  
        await this.vfs.writeToFsTable(relativePath, type, finalContent.length);
  
        if (versioning?.strategy === 'immediate') {
          await this._handleCommit(operationMessage);
        } else {
          await this.versioningManager.maybeTriggerVersioning(versioning);
        }
      } else if (type === 'dir') {
        if (mode === 'a') {
          // For directories, 'a' mode means don't throw if already exists
          try {
            await fs.fsInstance.fs_mkdir(relativePath);
            await this.vfs.writeToFsTable(relativePath, type, 0);
            
            if (versioning?.strategy === 'immediate') {
              await this._handleCommit(`Created directory at ${path}`);
            }
          } catch (error) {
            if (!error.message.includes('exists')) throw error;
            // Directory already exists - no action needed for append mode
          }
        } else { // mode === 'w'
          // For 'w' mode, try to remove existing first (like truncate for files)
          try {
            const stats = await fs.fsInstance.fs_stat(relativePath);
            if (await stats.isDirectory()) {
              await fs.fsInstance.fs_rmdir(relativePath);
            } else {
              await fs.fsInstance.fs_remove(relativePath);
            }
          } catch (error) {
            // Doesn't exist - that's fine
          }
          
          await fs.fsInstance.fs_mkdir(relativePath);
          await this.vfs.writeToFsTable(relativePath, type, 0);
          
          if (versioning?.strategy === 'immediate') {
            await this._handleCommit(`Created directory at ${path}`);
          }
        }
      }
  
      return { success: true };
    } catch (error) {
      this._error(`Failed to create ${type} at ${path}:`, error);
      throw new Error(`Failed to create: ${error.message}`);
    }
  }

  async remove(path) {
    try {
      await this._ensureReady(); // ENSURE READY

      path = this._normalizePath(path);

      if (this.mountPaths && this.mountPaths.includes(path)) {
        throw new Error(`Cannot remove path (${path}) directly. Use unmount() instead.`);
      }
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
      this._error(`Failed to remove ${path}:`, error);
      throw new Error(`Failed to remove: ${error.message}`);
    }
  }

  async read(path) {
    try {
      await this._ensureReady(); // ENSURE READY

      path = this._normalizePath(path);
      const { fs, relativePath } = await this.vfs.resolveFS(path);
      this.fsInstance = fs.fsInstance;

      const stats = await this.fsInstance.fs_stat(relativePath);
      if (!stats) throw new Error('ENOENT: no such file or directory');

      if (await stats.isDirectory()) {
        const result = await this.fsInstance.fs_readdir(relativePath);
        this._log('result', result)
        return result;
      } else {
        const fd = await this.fsInstance.fs_fopen(relativePath, 'r');
        const data = await this.fsInstance.fs_fread(fd, 1024*1024);
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
            if (!error.message.includes('exists')) this._error(error);
        }
    }
  }

  _normalizePath(path) {
    if (typeof path !== 'string') throw new Error('Path must be a string');
    return path.startsWith('/') ? path : `/${path}`;
  }

  // Config functions
  async setConfig(config) {
    return configStore.setConfig(config)
  }
}