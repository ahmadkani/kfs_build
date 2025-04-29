import memoryBackend from "./memoryBackendES6.js";
import LightningFS from '@isomorphic-git/lightning-fs';
import {Logger} from './../LoggerES6.js';
import {config} from './../../configES6.js';

const logger = new Logger(config.logging.fsManagerES6);

function consoleDotLog(...parameters) {
    logger.consoleDotLog('[fsManagerES6] ', ...parameters);
  }
  
function consoleDotError(...parameters) {
    logger.consoleDotError('[fsManagerES6] ', ...parameters);
  }

consoleDotLog('Loading fsmanagerES6.')

class fsManager {
  constructor(options = {supportsServiceWorker: true, useSW: true}) {
    this.fsInstances = new Map();
    this.initializationLocks = new Map(); // For concurrency control
    this.debug = true;
    this.options = options;
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
          return await this.initializeFS(fsName, fsType);
        }
        return this.fsInstances.get(key);
      } finally {
        this.initializationLocks.delete(key);
      }
    })();

    this.initializationLocks.set(key, initPromise);
    return initPromise;
  }

  async deleteFS(fsName, fsType) {
    // Create a unique key for the file system instance
    const key = `${fsName}-${fsType}`;

    // Check if the file system instance exists
    if (!this.fsInstances.has(key)) {
      console.warn(`File system ${key} does not exist. Nothing to delete.`);
      return;
    }

    // Handle deletion based on the file system type
    if (fsType === "idb") {
      // Delete the IndexedDB database
      try {
        await this.deleteIndexedDB(fsName);
        consoleDotLog(`IndexedDB file system ${key} deleted successfully.`);
      } catch (error) {
        consoleDotError(`Error deleting IndexedDB file system ${key}:`, error);
        throw error;
      }
    } else if (fsType === "memory") {
      // For memory file systems, just remove the instance from the Map
      consoleDotLog(`Memory file system ${key} deleted successfully.`);
    } else {
      throw new Error(`Unsupported file system type: ${fsType}`);
    }

    // Remove the file system instance from the Map
    this.fsInstances.delete(key);
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
    // Create a unique key for the file system instance
    const key = `${fsName}-${fsType}`;

    // Check if the file system instance exists
    if (!this.fsInstances.has(key)) {
      throw new Error(`File system ${key} not found. Call initializeFS first.`);
    }

    // Handle file store retrieval based on the file system type
    if (fsType === "idb") {
      // For IndexedDB, retrieve file store names
      try {
        const fileStoreNames = await this.getFileStoresFromDatabases();
        consoleDotLog(`File store names for ${key}:`, fileStoreNames);
        return fileStoreNames;
      } catch (error) {
        consoleDotError(`Error retrieving file store names for ${key}:`, error);
        throw error;
      }
    } else if (fsType === "memory") {
      // For memory file systems, return an empty array or a custom message
      consoleDotLog(`Memory file system ${key} does not have persistent file stores.`);
      return [];
    } else {
      throw new Error(`Unsupported file system type: ${fsType}`);
    }
  }

  async processDatabaseList(dbList) {
    const fileStoreNames = [];

    for (const db of dbList) {
      const dbName = typeof db === 'string' ? db : db.name; // Normalize db name

      const dbOpenRequest = await this.openDatabase(dbName);
      const fileStores = dbOpenRequest.objectStoreNames;

      // Filter stores starting with "fs_" and map them with their database name
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

