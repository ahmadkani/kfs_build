(function(global) {
  // Verify all dependencies are loaded
  const required = ['memoryBackendGlobal', 'LightningFS', 'Logger'];
  const missing = required.filter(dep => !global[dep]);
  if (missing.length) {
    throw new Error(`Missing dependencies: ${missing.join(', ')}. Load them first.`);
  }

  console.log("fsManager.js is being executed");

  const logger = new global.Logger(true);
  
  class FsManager {
    constructor() {
      this.fsInstances = new Map();
      this.initializationLocks = new Map();
      this.debug = true;
    }

    _log(...args) {
      if (this.debug) consoleDotLog('[FsManager]', ...args);
    }

    _error(...args) {
      consoleDotError('[FsManager]', ...args);
    }

    async initializeFS(fsName, fsType) {
      const key = `${fsName}-${fsType}`;
      this._log(`Initializing FS: ${key}`);

      try {
        if (this.fsInstances.has(key)) {
          this._log(`FS ${key} already exists`);
          return this.fsInstances.get(key);
        }

        let fsInstance;
        if (fsType === "memory") {
          consoleDotLog(`Creating memory FS for service worker : ${key}`);
          const backend = new global.memoryBackendGlobal(fsName);
          consoleDotLog(`Memory backend created for 2 ${key}`);
          fsInstance = new global.LightningFS(fsName, { backend });
          consoleDotLog(`Memory FS created for 2 ${key}`); 
          this._log(`Created memory FS with backend for ${key}`);
        } else if (fsType === "idb") {
          fsInstance = new global.LightningFS(fsName);
          this._log(`Created IDB FS for ${key}`);
        } else {
          throw new Error(`Unsupported FS type: ${fsType}`);
        }

        this.fsInstances.set(key, fsInstance);
        return fsInstance;
      } catch (error) {
        this._error(`Failed to initialize ${key}:`, error);
        throw error;
      }
    }

    async getFS(fsName, fsType) {
      const key = `${fsName}-${fsType}`;

      if (!this.fsInstances.has(key)) {
        await this.initializeFS(fsName, fsType);
      }

      const fsInstance = this.fsInstances.get(key);
      if (!fsInstance) {
        throw new Error(`File system ${key} is not properly initialized.`);
      }

      console.log(`Returning file system ${key}.`, fsInstance);
      return fsInstance;
    }

    async deleteFS(fsName, fsType) {
      const key = `${fsName}-${fsType}`;

      if (!this.fsInstances.has(key)) {
        console.warn(`File system ${key} does not exist. Nothing to delete.`);
        return;
      }

      if (fsType === "idb") {
        try {
          await this.deleteIndexedDB(fsName);
          console.log(`IndexedDB file system ${key} deleted successfully.`);
        } catch (error) {
          console.error(`Error deleting IndexedDB file system ${key}:`, error);
          throw error;
        }
      } else if (fsType === "memory") {
        console.log(`Memory file system ${key} deleted successfully.`);
      } else {
        throw new Error(`Unsupported file system type: ${fsType}`);
      }

      this.fsInstances.delete(key);
    }

    async deleteIndexedDB(databaseName) {
      return new Promise((resolve, reject) => {
        const request = indexedDB.deleteDatabase(databaseName);
        request.onsuccess = () => {
          console.log(`Deleted database ${databaseName} successfully`);
          resolve();
        };
        request.onerror = (event) => {
          console.error(`Error deleting database ${databaseName}:`, event);
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
          console.log(`File store names for ${key}:`, fileStoreNames);
          return fileStoreNames;
        } catch (error) {
          console.error(`Error retrieving file store names for ${key}:`, error);
          throw error;
        }
      } else if (fsType === "memory") {
        console.log(`Memory file system ${key} does not have persistent file stores.`);
        return [];
      } else {
        throw new Error(`Unsupported file system type: ${fsType}`);
      }
    }

    async processDatabaseList(dbList) {
      const fileStoreNames = [];

      for (const db of dbList) {
        const dbName = typeof db === "string" ? db : db.name;

        const dbOpenRequest = await this.openDatabase(dbName);
        const fileStores = dbOpenRequest.objectStoreNames;

        const fsStores = Array.from(fileStores)
          .filter((store) => store.startsWith("fs_"))
          .map((store) => ({ database: dbName, fileStore: store }));

        fileStoreNames.push(...fsStores);
      }
      console.log("Processing database list:", fileStoreNames);
      return fileStoreNames;
    }

    async openDatabase(dbName) {
      console.log("Opening database:", dbName);
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);

        request.onsuccess = (event) => {
          resolve(event.target.result);
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
          reject("Your browser does not support retrieving a list of IndexedDB databases");
          return;
        }

        if (request instanceof Promise) {
          request
            .then((dbList) => this.processDatabaseList(dbList).then(resolve).catch(reject))
            .catch(reject);
        } else {
          request.onsuccess = async (event) => {
            try {
              const fileStoreNames = await this.processDatabaseList(event.target.result);
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

  global.FsManager = FsManager; // Constructor version
  global.fsManager = new FsManager(); // Singleton instance
  
})(typeof self !== 'undefined' ? self : window);