export class StorageUtils {
  constructor(dbName = "VFS_Mounts") {
    this.dbName = dbName;
    this.localStorageWarningShown = false;
    this.forceLocalStorage = false;
  }

  supportsIndexedDB() {
    if (this.forceLocalStorage) return false;
    try {
      return typeof window !== "undefined" && !!window.indexedDB;
    } catch (e) {
      return false;
    }
  }

  /** Simplified localStorage methods with error handling */
  async getFromLocalStorage(key) {
    try {
      if (typeof localStorage === "undefined") return null;
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error("LocalStorage get error:", e);
      return null;
    }
  }

  async storeInLocalStorage(key, data) {
    try {
      if (typeof localStorage === "undefined") return false;

      const dataStr = JSON.stringify(data);

      if (dataStr.length > 5000000) {
        console.error("Data too large for localStorage");
        return false;
      }

      localStorage.setItem(key, dataStr);
      return true;
    } catch (e) {
      console.error("LocalStorage set error:", e);
      if (e.name === "QuotaExceededError") {
        this.forceLocalStorage = true;
      }
      return false;
    }
  }

  async removeFromLocalStorage(key) {
    try {
      if (typeof localStorage === "undefined") return false;
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error("LocalStorage remove error:", e);
      return false;
    }
  }

  async get(key) {
    let value = null;

    if (this.supportsIndexedDB()) {
      try {
        value = await this.getFromIndexedDB(key);
      } catch (e) {
        console.error("IndexedDB get failed:", e);
      }
    }

    if (value === null) {
      try {
        value = await this.getFromLocalStorage(key);
      } catch (e) {
        console.error("LocalStorage get fallback failed:", e);
      }
    }

    return value;
  }

  async store(key, data) {
    let indexedSuccess = false;
    let localSuccess = false;

    if (this.supportsIndexedDB()) {
      try {
        indexedSuccess = await this.storeInIndexedDB(key, data);
      } catch (e) {
        console.error("IndexedDB store failed:", e);
      }
    }

    try {
      localSuccess = await this.storeInLocalStorage(key, data);
    } catch (e) {
      console.error("LocalStorage store failed:", e);
    }

    return indexedSuccess || localSuccess;
  }

  async remove(key) {
    let success = true;

    if (this.supportsIndexedDB()) {
      try {
        success = (await this.removeFromIndexedDB(key)) && success;
      } catch (e) {
        console.error("IndexedDB remove failed:", e);
        success = false;
      }
    }

    try {
      success = (await this.removeFromLocalStorage(key)) && success;
    } catch (e) {
      console.error("LocalStorage remove failed:", e);
      success = false;
    }

    return success;
  }

  /** IndexedDB Methods */
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
        if (!db.objectStoreNames.contains("mounts")) {
          db.createObjectStore("mounts");
        }
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
        if (!db.objectStoreNames.contains("mounts")) {
          db.createObjectStore("mounts");
        }
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
}
