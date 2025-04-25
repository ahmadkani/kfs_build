export class StorageUtils {
    constructor(dbName = "VFS_Mounts") {
      this.dbName = dbName;
    }
  
    supportsIndexedDB() {
      return typeof window !== 'undefined' && !!window.indexedDB;
    }
  
    /** IndexedDB Methods **/
    async getFromIndexedDB(key) {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, 1);
        request.onerror = () => resolve(null);
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction("mounts", "readonly");
          const store = transaction.objectStore("mounts");
          const getRequest = store.get(key);
  
          getRequest.onsuccess = () => resolve(getRequest.result || null);
          getRequest.onerror = () => resolve(null);
        };
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          db.createObjectStore("mounts");
        };
      });
    }
  
    async storeInIndexedDB(key, data) {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, 1);
        request.onerror = () => resolve(false);
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction("mounts", "readwrite");
          const store = transaction.objectStore("mounts");
          store.put(data, key);
          transaction.oncomplete = () => resolve(true);
          transaction.onerror = () => resolve(false);
        };
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          db.createObjectStore("mounts");
        };
      });
    }
  
    async removeFromIndexedDB(key) {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, 1);
        request.onerror = () => resolve(false);
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction("mounts", "readwrite");
          const store = transaction.objectStore("mounts");
          store.delete(key);
          transaction.oncomplete = () => resolve(true);
          transaction.onerror = () => resolve(false);
        };
      });
    }
  
    /** LocalStorage Methods **/
    async getFromLocalStorage(key) {
      try {
        const storedData = localStorage.getItem(key);
        return storedData ? JSON.parse(storedData) : null;
      } catch (e) {
        return null;
      }
    }
  
    async storeInLocalStorage(key, data) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  
    async removeFromLocalStorage(key) {
      localStorage.removeItem(key);
    }
  
    /** Unified Storage Methods **/
    async get(key) {
      if (this.supportsIndexedDB()) {
        return this.getFromIndexedDB(key);
      }
      return this.getFromLocalStorage(key);
    }
  
    async store(key, data) {
      if (this.supportsIndexedDB()) {
        return this.storeInIndexedDB(key, data);
      }
      return this.storeInLocalStorage(key, data);
    }
  
    async remove(key) {
      if (this.supportsIndexedDB()) {
        return this.removeFromIndexedDB(key);
      }
      return this.removeFromLocalStorage(key);
    }
  }