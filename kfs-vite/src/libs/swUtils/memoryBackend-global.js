(function(global) {
  if (!global.Logger) throw new Error("Logger not loaded");

  const logger = new global.Logger(true);

  function consoleDotLog(...parameters) {
    logger.consoleDotLog('[GLOBAL MemoryBackend]', ...parameters);
  }

  function consoleDotError(...parameters) {
    logger.consoleDotError('[GLOBAL MemoryBackend]', ...parameters);
  }

  consoleDotLog("Initializing memoryBackend module global");

  class memoryBackend {
    constructor(dbName = "default") {
      this.dbName = dbName;
      this._files = new Map();
      this.files = this._files;
      this.isProcessing = false;
      this.lastUpdateTimestamp = 0;
      this.pendingUpdates = [];
      this.processingQueue = false;
      this.updateDebounceTimer = null;
      this.versionVector = {}; // Version vector per dbName
      this.versionVector[dbName] = 0;

      this._initializeRoot();
      this.receiveFilesFromChannel();
      this._requestInitialSync();
      consoleDotLog(`Initialized for database: ${dbName}`);
    }

    _initializeRoot() {
      this.files.set("/", {
        type: "dir",
        mode: 0o777,
        size: 0,
        ino: "/",
        mtimeMs: Date.now(),
        ctimeMs: Date.now(),
      });
    }

    _requestInitialSync() {
      const channel = new BroadcastChannel(`memory-backend-${this.dbName}`);
      channel.postMessage({
        operation: 'memorySyncRequest',
        data: {
          dbName: this.dbName,
          requesterTimestamp: this.lastUpdateTimestamp,
          requesterVector: this.versionVector[this.dbName] || 0
        }
      });
      channel.close();
      consoleDotLog('Initial sync request sent');
    }

    sendFilesToChannel = async () => {
      const now = Date.now();
      const currentVector = ++this.versionVector[this.dbName];

      const update = {
        operation: 'memorySync',
        data: {
          files: Array.from(this._files.entries()),
          dbName: this.dbName,
          timestamp: now,
          versionVector: { ...this.versionVector },
        }
      };

      if (this.isProcessing) {
        consoleDotLog('Queueing update due to ongoing processing');
        this.pendingUpdates.push(update);
        return;
      }

      try {
        this.isProcessing = true;
        this.lastUpdateTimestamp = now;
        consoleDotLog('Sending files to channel:', this.files, now);

        clearTimeout(this.updateDebounceTimer);
        this.updateDebounceTimer = setTimeout(async () => {
          try {
            const channel = new BroadcastChannel(`memory-backend-${this.dbName}`);
            channel.postMessage(update);
            channel.close();
            consoleDotLog('Files update sent to channel successfully');

            await this._processPendingUpdates();
          } catch (error) {
            consoleDotError('Error sending queued update:', error);
          }
        }, 50);
      } catch (error) {
        consoleDotError('Error in sendFilesToChannel:', error);
      } finally {
        this.isProcessing = false;
      }
    };

    async _processPendingUpdates() {
      if (this.processingQueue || this.pendingUpdates.length === 0) return;

      this.processingQueue = true;
      try {
        while (this.pendingUpdates.length > 0) {
          const update = this.pendingUpdates.shift();
          const channel = new BroadcastChannel(`memory-backend-${this.dbName}`);
          channel.postMessage(update);
          channel.close();
          this.lastUpdateTimestamp = update.data.timestamp;
        }
      } catch (error) {
        consoleDotError('Error processing queued updates:', error);
      } finally {
        this.processingQueue = false;
      }
    }

    receiveFilesFromChannel = () => {
      const channel = new BroadcastChannel(`memory-backend-${this.dbName}`);
      consoleDotLog('Setting up channel listener for:', `memory-backend-${this.dbName}`);

      channel.onmessage = (event) => {
        setTimeout(() => {
          const { operation, data } = event.data || {};

          if (operation === 'memorySync' && data?.dbName === this.dbName) {
            this._handleIncomingUpdate(data);
          }

          if (operation === 'memorySyncRequest' && data?.dbName === this.dbName) {
            const requesterVector = data?.requesterVector ?? 0;
            const currentVector = this.versionVector[this.dbName] ?? 0;

            if (currentVector > requesterVector) {
              consoleDotLog('Responding to sync request with newer data');
              this.sendFilesToChannel();
            } else {
              consoleDotLog('No update needed for requester; skipping response');
            }
          }
        }, 0);
      };
    };

    async _handleIncomingUpdate(data) {
      const incomingVector = data.versionVector?.[this.dbName] ?? 0;
      const currentVector = this.versionVector[this.dbName] ?? 0;

      if (incomingVector <= currentVector) {
        consoleDotLog(`Skipping update: incoming vector (${incomingVector}) <= current (${currentVector})`);
        return;
      }

      try {
        consoleDotLog('Applying update from channel:', data);
        this._files = new Map(data.files);
        this.files = this._files;
        this.lastUpdateTimestamp = data.timestamp;
        this.versionVector[this.dbName] = incomingVector;
        consoleDotLog(`Files updated from channel for db: ${this.dbName}`);
      } catch (error) {
        consoleDotError('Error applying update:', error);
      }
    }

    _getParentDir(filepath) {
      const lastSlashIndex = filepath.lastIndexOf("/");
      return lastSlashIndex === 0 ? "/" : filepath.slice(0, lastSlashIndex);
    }

    _getBaseName(filepath) {
      const lastSlashIndex = filepath.lastIndexOf("/");
      return filepath.slice(lastSlashIndex + 1);
    }

    async saveSuperblock() {}
    async loadSuperblock() {}

    async wipe() {
      consoleDotLog(`Wiping MemoryBackend for database: ${this.dbName}`);
      this.files.clear();
      this._initializeRoot();
      await this.sendFilesToChannel();
      consoleDotLog(`MemoryBackend wiped for database: ${this.dbName}`);
    }

    async readFile(filepath, opts = {}) {
      consoleDotLog('this.files', this._files);
      if (!this.files.has(filepath)) {
        throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
      }
      const file = this.files.get(filepath);
      if (file.type !== "file") {
        throw Object.assign(new Error("EISDIR"), { code: "EISDIR" });
      }
      return opts.encoding === "utf8" ? new TextDecoder().decode(file.data) : file.data;
    }

    async writeFile(filepath, data, opts = {}) {
      this.files.set(filepath, {
        type: "file",
        mode: opts.mode || 0o666,
        data: typeof data === "string" ? new TextEncoder().encode(data) : data || new Uint8Array(),
        size: data ? data.length : 0,
        ino: filepath,
        mtimeMs: Date.now(),
        ctimeMs: Date.now(),
      });
      await this.sendFilesToChannel();
    }

    async unlink(filepath) {
      if (!this.files.has(filepath)) {
        throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
      }
      this.files.delete(filepath);
      await this.sendFilesToChannel();
    }

    async readdir(filepath) {
      const dirEntry = this.files.get(filepath);
      if (!dirEntry || dirEntry.type !== 'dir') {
        throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
      }

      const entries = new Set();
      const dirPath = filepath === '/' ? '/' : `${filepath}/`;

      for (const [key] of this.files) {
        if (key.startsWith(dirPath) && key !== dirPath) {
          const relativePath = key.slice(dirPath.length);
          const nextSlashIndex = relativePath.indexOf('/');
          entries.add(nextSlashIndex === -1 ? relativePath : relativePath.substring(0, nextSlashIndex));
        }
      }

      return [...entries];
    }

    async mkdir(filepath) {
      const parent = this._getParentDir(filepath);
      if (parent !== '/' && !this.files.has(parent)) {
        throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
      }

      this.files.set(filepath, {
        type: "dir",
        mode: 0o777,
        size: 0,
        ino: filepath,
        mtimeMs: Date.now(),
        ctimeMs: Date.now(),
      });
      await this.sendFilesToChannel();
    }

    async rmdir(filepath) {
      const normalizedPath = filepath === '/' ? '/' : filepath.replace(/\/+$/, '');

      if (!this.files.has(normalizedPath)) {
        throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
      }

      const dirEntry = this.files.get(normalizedPath);
      if (dirEntry.type !== 'dir') {
        throw Object.assign(new Error("ENOTDIR"), { code: "ENOTDIR" });
      }

      const dirPrefix = normalizedPath === '/' ? '/' : `${normalizedPath}/`;
      for (const key of this.files.keys()) {
        if (key !== normalizedPath && key.startsWith(dirPrefix)) {
          throw Object.assign(new Error("ENOTEMPTY"), { code: "ENOTEMPTY" });
        }
      }

      this.files.delete(normalizedPath);
      await this.sendFilesToChannel();
    }

    async stat(filepath) {
      if (!this.files.has(filepath)) {
        throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
      }
      return this.files.get(filepath);
    }

    async lstat(filepath) {
      return this.stat(filepath);
    }
  }

  global.memoryBackendGlobal = memoryBackend;
})(typeof window !== 'undefined' ? window : globalThis);
