import memoryBackend from "./memoryBackendES6.js";
import LightningFS from '@isomorphic-git/lightning-fs';
import {Logger} from './../LoggerES6.js';
import {getConfig} from './../../configES6.js';

const config = await getConfig();
const logger = new Logger(config.logging.fsManagerES6);

function consoleDotLog(...parameters) {
    logger.consoleDotLog('[fsManagerES6] ', ...parameters);
  }
  
function consoleDotError(...parameters) {
    logger.consoleDotError('[fsManagerES6] ', ...parameters);
  }

consoleDotLog('Loading fsmanagerES6.')

class fsManager {
  constructor(options = {}) {
    this.fsInstances = new Map();
    this.initializationLocks = new Map(); // For concurrency control
    this.debug = true;
    this.options = options;
    this.memoryBackends = new Map(); // Track memory backends separately
  }

  _log(...args) {
    if (this.debug) consoleDotLog('[fsManager]', ...args);
  }

  _error(...args) {
    consoleDotError('[fsManager]', ...args);
  }

  async initializeFS(fsName, fsType) {
    const key = `${fsName}-${fsType}`;
    this._log(`Initializing FS: ${key}`);

    try {
      consoleDotLog('Initializing.')
      // Check for existing instance with lock protection
      if (this.fsInstances.has(key)) {
        this._log(`FS ${key} already exists`);
        return this.fsInstances.get(key);
      }

      // Create new instance based on type
      let fsInstance;
      if (fsType === "memory") {
        consoleDotLog(`Creating memory FS for ${key}`);
        const backend = new memoryBackend(this.options, fsName);
        consoleDotLog(`Memory backend created for ${key} backend: `, backend);
        this.memoryBackends.set(key, backend); // Store the backend reference
        fsInstance = new LightningFS(fsName, { backend });
        consoleDotLog(`Memory FS created for ${key}`);
        this._log(`Created memory FS with backend for ${key}`);
      } else if (fsType === "idb") {
        fsInstance = new LightningFS(fsName);
        this._log(`Created IDB FS for ${key}`);
      } else {
        throw new Error(`Unsupported FS type: ${fsType}`);
      }

      // Store instance
      this.fsInstances.set(key, fsInstance);
      return fsInstance;
    } catch (error) {
      this._error(`Failed to initialize ${key}:`, error);
      throw error;
    }
  }

  async getFS(fsName, fsType) {
    const key = `${fsName}-${fsType}`;
    this._log(`Requesting FS: ${key}`);

    // Check for existing initialization lock
    if (this.initializationLocks.has(key)) {
      this._log(`Waiting for existing initialization of ${key}`);
      return this.initializationLocks.get(key);
    }

    // Create new initialization promise
    const initPromise = (async () => {
      try {
        if (!this.fsInstances.has(key)) {
          return { new: true, fs: await this.initializeFS(fsName, fsType)};
        }
        return { new: false, fs: this.fsInstances.get(key) };
      } finally {
        this.initializationLocks.delete(key);
      }
    })();

    this.initializationLocks.set(key, initPromise);
    return initPromise;
  }

  async deleteFS(fsName, fsType) {
    const key = `${fsName}-${fsType}`;
    this._log(`Deleting FS: ${key}`);

    try {
        // Check if the file system instance exists
        if (!this.fsInstances.has(key)) {
            this._log(`File system ${key} does not exist. Nothing to delete.`);
            return;
        }

        // Get the instance before deleting it
        const fsInstance = this.fsInstances.get(key);

        // Handle deletion based on the file system type
        if (fsType === "idb") {
            try {
                await this.deleteIndexedDB(fsName);
                this._log(`IndexedDB file system ${key} deleted successfully.`);
            } catch (error) {
                this._error(`Error deleting IndexedDB file system ${key}:`, error);
                throw error;
            }
        } else if (fsType === "memory") {
            // For memory file systems, clean up the backend
            if (this.memoryBackends.has(key)) {
                const backend = this.memoryBackends.get(key);
                if (backend && backend.close) {
                    try {
                        await backend.close();
                        this._log(`Memory backend for ${key} closed successfully.`);
                    } catch (error) {
                        this._error(`Error closing memory backend for ${key}:`, error);
                    }
                }
                this.memoryBackends.delete(key);
            }
            this._log(`Memory file system ${key} deleted successfully.`);
        } else {
            throw new Error(`Unsupported file system type: ${fsType}`);
        }

        // Remove the file system instance from the Map
        this.fsInstances.delete(key);
    } catch (error) {
        this._error(`Failed to delete ${key}:`, error);
        throw error;
    }
  }

  // Enhanced createBackupFS method with better memory support
  async createBackupFS(originalName, fsType, backupSuffix = '_replica') {
    const backupName = `${originalName}${backupSuffix}`;
    const originalKey = `${originalName}-${fsType}`;
    const backupKey = `${backupName}-${fsType}`;
    
    this._log(`Creating backup of ${originalKey} as ${backupKey}`);
    
    try {
        // Get the original filesystem instance
        const getOriginalFS = await this.getFS(originalName, fsType);
        const originalFS = getOriginalFS?.fs;
        
        if (fsType === 'memory') {
            // Get the original backend
            const originalBackend = this.memoryBackends.get(originalKey);
            if (!originalBackend) {
                throw new Error('Original memory backend not found');
            }

            // Create new memory backend with same options
            const newBackend = new memoryBackend({
                ...this.options,
                deviceId: `${this.options.deviceId || 'default'}-${Date.now()}`
            }, backupName);

            // Clone the files from original backend to new backend
            if (originalBackend._files instanceof Map) {
                for (const [path, fileData] of originalBackend._files) {
                    newBackend._files.set(path, {...fileData});
                }
            } else {
                throw new Error('Original memory backend files not in expected format');
            }

            // Create new FS instance with copied data
            const backupFS = new LightningFS(backupName, { backend: newBackend });
            
            // Store both the FS instance and the backend
            this.fsInstances.set(backupKey, backupFS);
            this.memoryBackends.set(backupKey, newBackend);
            
        } else if (fsType === 'idb') {
            const backupFS = new LightningFS(backupName);
            this.fsInstances.set(backupKey, backupFS);
            await this._copyIDBContents(originalFS, backupFS, '/');
        } else {
            throw new Error(`Unsupported FS type for backup: ${fsType}`);
        }
        
        // Register the backup mount
        await this._registerBackupMount(originalName, backupName);
        
        this._log(`Backup created successfully: ${backupKey}`);
        return this.fsInstances.get(backupKey);
        
    } catch (error) {
        this._error(`Failed to create backup ${backupKey}:`, error);
        
        // Clean up if partially created
        if (this.fsInstances.has(backupKey)) {
            this.fsInstances.delete(backupKey);
        }
        if (this.memoryBackends.has(backupKey)) {
            this.memoryBackends.delete(backupKey);
        }
        
        throw error;
    }
  }

  // Memory-specific methods
  async getMemorySnapshot(fsName) {
    const key = `${fsName}-memory`;
    if (!this.memoryBackends.has(key)) {
        throw new Error(`Memory filesystem ${fsName} not found`);
    }

    const backend = this.memoryBackends.get(key);
    if (!backend._files) {
        throw new Error('Memory backend files not initialized');
    }

    // Create a deep clone of the files Map
    const snapshot = new Map();
    for (const [path, fileData] of backend._files) {
        snapshot.set(path, {...fileData});
    }

    return snapshot;
  }

  async restoreMemorySnapshot(fsName, snapshot) {
    const key = `${fsName}-memory`;
    if (!this.memoryBackends.has(key)) {
        throw new Error(`Memory filesystem ${fsName} not found`);
    }

    const backend = this.memoryBackends.get(key);
    if (!backend._files) {
        backend._initializeRoot();
    }

    // Clear existing files
    backend._files.clear();

    // Restore from snapshot
    for (const [path, fileData] of snapshot) {
        backend._files.set(path, {...fileData});
    }

    this._log(`Memory filesystem ${fsName} restored from snapshot`);
  }

  async getMemoryStats(fsName) {
    const key = `${fsName}-memory`;
    if (!this.memoryBackends.has(key)) {
        throw new Error(`Memory filesystem ${fsName} not found`);
    }

    const backend = this.memoryBackends.get(key);
    if (!backend._files) {
        return {
            fileCount: 0,
            totalSize: 0,
            paths: []
        };
    }

    let fileCount = 0;
    let totalSize = 0;
    const paths = [];

    for (const [path, fileData] of backend._files) {
        fileCount++;
        totalSize += fileData.data ? fileData.data.byteLength : 0;
        paths.push(path);
    }

    return {
        fileCount,
        totalSize,
        paths: paths.sort()
    };
  }

  async _copyIDBContents(sourceFS, targetFS, path = '/') {
    try {
        const normalizedPath = path === '/' ? '/' : path.replace(/\/+$/, '');
        
        // Read directory contents
        const files = await sourceFS.promises.readdir(normalizedPath);
        
        for (const file of files) {
            const sourcePath = normalizedPath === '/' ? `/${file}` : `${normalizedPath}/${file}`;
            const targetPath = sourcePath; // Using same path structure for target
            
            try {
                const stat = await sourceFS.promises.stat(sourcePath);
                
                if (stat.isDirectory()) {
                    // Create directory in target (with recursive:true to prevent ENOENT errors)
                    try {
                        await targetFS.promises.mkdir(targetPath, { recursive: true });
                    } catch (mkdirError) {
                        if (mkdirError.code !== 'EEXIST') {
                            throw mkdirError;
                        }
                        // Directory already exists - this is fine, we can continue
                        consoleDotLog(`Directory ${targetPath} already exists, continuing`);
                    }
                    
                    // Recursively copy contents
                    await this._copyIDBContents(sourceFS, targetFS, sourcePath);
                } else {
                    // Read file content and write to target
                    const content = await sourceFS.promises.readFile(sourcePath);
                    await targetFS.promises.writeFile(targetPath, content);
                }
            } catch (fileError) {
                // Handle individual file/directory errors without stopping the whole process
                this._error(`Error processing ${sourcePath}:`, fileError);
                // Continue with next file
                continue;
            }
        }
    } catch (error) {
        // Handle top-level errors
        if (error.code === 'ENOENT') {
            // Source path doesn't exist
            this._error(`Source path ${path} does not exist`);
        } else if (error.code === 'EEXIST') {
            // This shouldn't happen at top level, but handle it anyway
            consoleDotLog(`Path ${path} already exists`);
        } else {
            this._error(`Error copying path ${path}:`, error);
        }
        throw error;
    }
  }
  
  async _registerBackupMount(originalName, backupName, options = {}) {
    const defaultOptions = {
        readOnly: true,          // Backups are typically read-only
        hidden: false,           // Whether to hide from normal listings
        preserveOriginal: true,  // Keep original metadata
        mountPath: `/${backupName}` // Customizable mount path
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    const { mountPath } = finalOptions;
  
    this._log(`Registering backup mount from ${originalName} to ${mountPath}`);
  
    try {
        // Initialize mounts object if it doesn't exist
        if (typeof this.mounts !== 'object') {
            this.mounts = {};
        }
  
        // Initialize backup registry if it doesn't exist
        if (!this.backupRegistry) {
            this.backupRegistry = new Map();
        }
  
        // Check for existing mount
        if (this.mounts[mountPath]) {
            throw new Error(`Mount path ${mountPath} already in use`);
        }
  
        // Get original mount details if available
        const originalMount = this.mounts[`/${originalName}`] || {};
  
        // Create backup mount entry
        this.mounts[mountPath] = {
            ...(finalOptions.preserveOriginal ? originalMount : {}),
            fsName: backupName,
            isBackup: true,
            originalFsName: originalName,
            createdAt: new Date().toISOString(),
            lastAccessed: null,
            accessCount: 0,
            metadata: {
                ...(originalMount.metadata || {}),
                backupType: 'full', // could be 'incremental' or 'differential'
                backupVersion: 1,
                ...finalOptions
            }
        };
  
        // Add to backup registry
        this.backupRegistry.set(backupName, {
            original: originalName,
            mountPoint: mountPath,
            createdAt: this.mounts[mountPath].createdAt,
            options: finalOptions,
            stats: {
                fileCount: 0,    // Could be populated during backup
                totalSize: 0,    // Could be populated during backup
                lastVerified: null
            }
        });
  
        this._log(`Successfully registered backup mount at ${mountPath}`);
        return {
            mountPath,
            backupName,
            originalName,
            details: this.mounts[mountPath]
        };
    } catch (error) {
        this._error(`Failed to register backup mount:`, error);
        
        // Clean up if partially created
        if (this.mounts && this.mounts[mountPath]) {
            delete this.mounts[mountPath];
        }
        if (this.backupRegistry && this.backupRegistry.has(backupName)) {
            this.backupRegistry.delete(backupName);
        }
        
        throw error;
    }
  }
  
  async deleteIndexedDB(databaseName) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(databaseName);
      request.onsuccess = () => {
        consoleDotLog(`Deleted database ${databaseName} successfully`);
        resolve();
      };
      request.onerror = (event) => {
        consoleDotError(`Error deleting database ${databaseName}:`, event);
        reject(event);
      };
      request.onblocked = () => {
        console.warn(`Delete database ${databaseName} blocked`);
      };
    });
  }

  async getFileStoreNames(fsName, fsType) {
    const key = `${fsName}-${fsType}`;

    if (!this.fsInstances.has(key)) {
      throw new Error(`File system ${key} not found. Call initializeFS first.`);
    }

    if (fsType === "idb") {
      try {
        const fileStoreNames = await this.getFileStoresFromDatabases();
        consoleDotLog(`File store names for ${key}:`, fileStoreNames);
        return fileStoreNames;
      } catch (error) {
        consoleDotError(`Error retrieving file store names for ${key}:`, error);
        throw error;
      }
    } else if (fsType === "memory") {
      // For memory file systems, return information about stored files
      if (this.memoryBackends.has(key)) {
        const backend = this.memoryBackends.get(key);
        if (backend._files) {
          return {
            fileCount: backend._files.size,
            filePaths: Array.from(backend._files.keys())
          };
        }
      }
      return {
        fileCount: 0,
        filePaths: []
      };
    } else {
      throw new Error(`Unsupported file system type: ${fsType}`);
    }
  }

  async processDatabaseList(dbList) {
    const fileStoreNames = [];

    for (const db of dbList) {
      const dbName = typeof db === 'string' ? db : db.name;

      const dbOpenRequest = await this.openDatabase(dbName);
      const fileStores = dbOpenRequest.objectStoreNames;

      const fsStores = Array.from(fileStores)
        .filter((store) => store.startsWith('fs_'))
        .map((store) => ({ database: dbName, fileStore: store }));

      fileStoreNames.push(...fsStores);
    }
    consoleDotLog('Processing database list:', fileStoreNames);
    return fileStoreNames;
  }

  async openDatabase(dbName) {
    consoleDotLog('Opening database:', dbName);
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName);

      request.onsuccess = (event) => {
        const db = event.target.result;
        resolve(db);
      };

      request.onerror = (event) => {
        reject(`Error opening database ${dbName}: ${event.target.error}`);
      };
    });
  }

  async getFileStoresFromDatabases() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.webkitGetDatabaseNames
        ? indexedDB.webkitGetDatabaseNames()
        : indexedDB.databases
        ? indexedDB.databases()
        : null;

      if (!request) {
        reject('Your browser does not support retrieving a list of IndexedDB databases');
        return;
      }

      if (request instanceof Promise) {
        request
          .then((dbList) => {
            this.processDatabaseList(dbList)
              .then((fileStoreNames) => resolve(fileStoreNames))
              .catch((err) => reject(err));
          })
          .catch((err) => reject(err));
      } else {
        request.onsuccess = async (event) => {
          const dbList = event.target.result;
          try {
            const fileStoreNames = await this.processDatabaseList(dbList);
            resolve(fileStoreNames);
          } catch (err) {
            reject(err);
          }
        };

        request.onerror = (event) => {
          reject(`Error retrieving database list: ${event.target.error}`);
        };
      }
    });
  }
}

export default fsManager;