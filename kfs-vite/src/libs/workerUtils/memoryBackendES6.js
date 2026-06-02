import {Logger} from "./../LoggerES6.js";
import {getConfig} from "./../../configES6.js";

const config = await getConfig();
const logger = new Logger(config.logging.memoryBackendES6);

function consoleDotLog(...args) {
  logger.consoleDotLog("[MemoryBackend ES6]", ...args);
}

function consoleDotError(...args) {
  logger.consoleDotError("[MemoryBackend ES6]", ...args);
}

function generateSimpleID() {
  return 'tab-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
}

consoleDotLog("Loading memoryBackend module");

class MemoryBackend {
  constructor(options = {}, dbName = "default") {
    this.dbName = dbName;
    this.options = options;
    this.deviceId = options.deviceId || generateSimpleID();
    this._files = new Map();
    this.versionVector = { [this.deviceId]: 0 };
    this.channel = null;
    this.isProcessing = false;
    this.pendingUpdates = [];
    this.processingQueue = false;

    this._initializeRoot();

    Promise.resolve().then(() => this._requestInitialSync());
    consoleDotLog(`Initialized with dbName: ${this.dbName}, deviceId: ${this.deviceId}`);
  }

  _initializeRoot() {
    this._files.set("/", {
      type: "dir",
      mode: 0o777,
      size: 0,
      ino: "/",
      mtimeMs: Date.now(),
      ctimeMs: Date.now(),
    });
  }

  _incrementVersionVector() {
    if (!this.versionVector[this.deviceId]) this.versionVector[this.deviceId] = 0;
    this.versionVector[this.deviceId]++;
  }

  _isNewerVersionVector(remoteVV) {
    let isNewer = false;
    for (const id in remoteVV) {
      const localVersion = this.versionVector[id] || 0;
      const remoteVersion = remoteVV[id];
      if (remoteVersion > localVersion) {
        isNewer = true;
      }
    }
    return isNewer;
  }

  _mergeVersionVector(remoteVV) {
    for (const id in remoteVV) {
      if (!this.versionVector[id] || remoteVV[id] > this.versionVector[id]) {
        this.versionVector[id] = remoteVV[id];
      }
    }
  }

  _requestInitialSync() {
    try {
      const channel = new BroadcastChannel(`memory-backend-${this.dbName}`);
      channel.postMessage({
        operation: "memorySyncRequest",
        data: {
          dbName: this.dbName,
          requesterVV: this.versionVector,
          requesterId: this.deviceId,
        },
      });
      channel.close();
      consoleDotLog("Initial sync request sent");
    } catch (err) {
      consoleDotError("Failed to send initial sync request:", err);
    }
  }

  async getFiles() {
    const files = new Map(
      Array.from(this._files.entries()).map(([key, value]) => {
        return [key, { ...value }];
      })
    );
    return files;
  }  

  async _processPendingUpdates() {
    if (this.processingQueue || this.pendingUpdates.length === 0) return;

    this.processingQueue = true;
    try {
      while (this.pendingUpdates.length > 0) {
        const update = this.pendingUpdates.shift();
        consoleDotLog("Processing queued update:", update);
        const channel = new BroadcastChannel(`memory-backend-${this.dbName}`);
        channel.postMessage(update);
        channel.close();
      }
    } catch (err) {
      consoleDotError("Error processing queued updates:", err);
    } finally {
      this.processingQueue = false;
    }
  }

  _setupReceiveChannel() {
    try {
      const channel = new BroadcastChannel(`memory-backend-${this.dbName}`);
      consoleDotLog("Listening for updates on:", channel.name);
      this.channel = channel;
      this.channel.onmessage = async (event) => {
        Promise.resolve().then(() => this._handleChannelMessage(event));
      };
      this._requestInitialSync();
    } catch (err) {
      consoleDotError("BroadcastChannel init failed:", err);
    }
  }
  

  async _handleChannelMessage(event) {
    const { operation, data } = event.data || {};
    if (!data?.dbName || data.dbName !== this.dbName) return;

    if (operation === "memorySyncRequest") {
      if (this._isNewerVersionVector(data.requesterVV)) {
      } else {
        consoleDotLog("No newer data to send to requester");
      }
      return;
    }

    if (operation !== "memorySync") return;

    const remoteVV = data.versionVector;
    const remoteSender = data.sender;

    if (remoteSender === this.deviceId) {
      consoleDotLog("Skipping own update");
      return;
    }

    if (data.targetId && data.targetId !== this.deviceId) {
      consoleDotLog("Message not meant for this tab. Ignoring.");
      return;
    }

    if (!this._isNewerVersionVector(remoteVV)) {
      consoleDotLog("Skipping received update - not newer than current", this.versionVector, remoteVV);
      return;
    }

    try {
      consoleDotLog("Applying update from channel:", data);
      this._files = new Map(data.files);
      this._mergeVersionVector(remoteVV);
      consoleDotLog("Memory updated from channel successfully");
    } catch (err) {
      consoleDotError("Failed to apply channel message:", err);
    }
  }

  async wipe() {
    consoleDotLog(`Wiping db: ${this.dbName}`);
    this._files.clear();
    this._initializeRoot();
    this.versionVector = { [this.deviceId]: 0 };
    await this._handleFilesChange();
  }

  async _handleFilesChange() {
    this._incrementVersionVector();
  }

  async readFile(filepath, opts = {}) {
    consoleDotLog('this.files', this._files);
    if (!this._files.has(filepath)) {
      throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
    }
    const file = this._files.get(filepath);
    if (file.type !== "file") {
      throw Object.assign(new Error("EISDIR"), { code: "EISDIR" });
    }
    return opts.encoding === "utf8"
      ? new TextDecoder().decode(file.data)
      : file.data;
  }

  async writeFile(filepath, data, opts = {}) {
    const encoded = typeof data === "string" ? new TextEncoder().encode(data) : data || new Uint8Array();
    this._files.set(filepath, {
      type: "file",
      mode: opts.mode || 0o666,
      data: encoded,
      size: encoded.length,
      ino: filepath,
      mtimeMs: Date.now(),
      ctimeMs: Date.now(),
    });
    await this._handleFilesChange();
  }

  async unlink(filepath) {
    if (!this._files.has(filepath)) {
      throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
    }
    this._files.delete(filepath);
    await this._handleFilesChange();
  }

  async readdir(filepath) {
    const path = filepath.replace(/\/$/, "");
    
    // 1. Check if it's explicitly a file (error case)
    const node = this._files.get(path);
    if (node && node.type !== "dir") {
      throw Object.assign(new Error("ENOTDIR"), { code: "ENOTDIR" });
    }

    // 2. Scan for children (works for both explicit and implicit directories)
    const prefix = path === "" ? "" : `${path}/`;
    const results = new Set();

    for (const key of this._files.keys()) {
      if (key.startsWith(prefix) && key !== path) {
        // Extract the immediate child name
        const relative = key.slice(prefix.length).split("/")[0];
        results.add(relative);
      }
    }

    // 3. If we found children, return them.
    // If no children and no explicit directory entry, THEN throw ENOENT.
    if (results.size === 0 && !node) {
      throw Object.assign(new Error(`ENOENT: no such directory, readdir '${filepath}'`), { code: "ENOENT" });
    }

    return [...results];
  }

    async rename(oldPath, newPath) {
    consoleDotLog(`Renaming ${oldPath} to ${newPath}`);
    
    // 1. Check if source exists
    if (!this._files.has(oldPath)) {
      // If source is a directory, it might be stored without a trailing slash in some logic
      // but typically in your backend logic, we should check strict paths.
      throw Object.assign(new Error(`ENOENT: no such file or directory, rename '${oldPath}'`), { code: "ENOENT" });
    }

    // 2. Get the node (file or directory)
    const node = this._files.get(oldPath);
    
    // 3. Handle Directory Rename (Recursive)
    // In your flat Map, a directory 'mydir' contains keys like 'mydir/file.txt'.
    // We must move all keys starting with oldPath.
    if (node.type === 'dir') {
      // We need to iterate all keys to find children
      const keysToMove = [];
      
      // Identify the prefix (ensure it ends with / to avoid matching 'dir' with 'dir2')
      const prefix = oldPath.endsWith('/') ? oldPath : oldPath + '/';
      
      for (const key of this._files.keys()) {
        if (key === oldPath || key.startsWith(prefix)) {
          keysToMove.push(key);
        }
      }

      // Move the parent directory entry first
      this._files.set(newPath, { ...node, ino: newPath }); // Update ino/path if stored
      
      // Move children
      for (const key of keysToMove) {
        if (key === oldPath) continue; // Already handled parent
        
        const relativePath = key.slice(prefix.length);
        const newKey = (newPath.endsWith('/') ? newPath : newPath + '/') + relativePath;
        
        const childNode = this._files.get(key);
        this._files.set(newKey, childNode);
        this._files.delete(key);
      }
      
      // Delete the old parent entry
      this._files.delete(oldPath);
      
    } else {
      // 4. Handle File Rename
      this._files.set(newPath, node);
      this._files.delete(oldPath);
    }

    await this._handleFilesChange();
    consoleDotLog(`Rename successful: ${oldPath} -> ${newPath}`);
  }

  async stat(filepath) {
    // 1. Check if it's an explicit file/directory entry
    if (this._files.has(filepath)) {
      const node = this._files.get(filepath);
      // Return standard stats object
      return {
        ...node,
        isDirectory: () => node.type === 'dir',
        isFile: () => node.type === 'file',
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isSymbolicLink: () => false,
        isFIFO: () => false,
        isSocket: () => false,
      };
    }

    // 2. Check for IMPLICIT directory (it has children but no entry)
    // Normalize path for checking
    const path = filepath.replace(/\/$/, "");
    const prefix = path === "" ? "" : `${path}/`;
    
    // We only need to know if AT LEAST ONE child exists
    for (const key of this._files.keys()) {
      if (key.startsWith(prefix) && key !== path) {
        // It's a directory because it contains files
        return {
          type: "dir",
          mode: 0o777,
          size: 0,
          ino: path,
          mtimeMs: Date.now(),
          ctimeMs: Date.now(),
          isDirectory: () => true,
          isFile: () => false,
          isBlockDevice: () => false,
          isCharacterDevice: () => false,
          isSymbolicLink: () => false,
          isFIFO: () => false,
          isSocket: () => false,
        };
      }
    }

    // 3. Not found
    throw Object.assign(new Error(`ENOENT: no such file or directory, stat '${filepath}'`), { code: "ENOENT" });
  }

  async lstat(filepath) {
    return this.stat(filepath);
  }

  async mkdir(filepath) {
    // If it already exists, just return (idempotent)
    if (this._files.has(filepath)) {
       const existing = this._files.get(filepath);
       if (existing.type === 'dir') return;
       // If it's a file, throw error
       throw Object.assign(new Error("ENOTDIR"), { code: "ENOTDIR" });
    }

    const parent = this._getParentDir(filepath);
    // Check parent existence
    if (parent !== "/" && !this._files.has(parent)) {
        // NOTE: isomorphic-git usually creates parents explicitly, 
        // but if it assumes recursive creation, you might need to create parents here.
        // For now, we throw ENOENT if parent is missing.
        throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
    }
    
    this._files.set(filepath, {
      type: "dir",
      mode: 0o777,
      size: 0,
      ino: filepath,
      mtimeMs: Date.now(),
      ctimeMs: Date.now(),
    });
    await this._handleFilesChange();
  }

  async rmdir(filepath) {
    const path = filepath === "/" ? "/" : filepath.replace(/\/+$/, "");
    if (!this._files.has(path)) {
      throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
    }
    const entry = this._files.get(path);
    if (entry.type !== "dir") {
      throw Object.assign(new Error("ENOTDIR"), { code: "ENOTDIR" });
    }

    for (const key of this._files.keys()) {
      if (key.startsWith(`${path}/`)) {
        throw Object.assign(new Error("ENOTEMPTY"), { code: "ENOTEMPTY" });
      }
    }

    this._files.delete(path);
    await this._handleFilesChange();
  }

  _getParentDir(filepath) {
    const idx = filepath.lastIndexOf("/");
    return idx <= 0 ? "/" : filepath.slice(0, idx);
  }

  _getBaseName(filepath) {
    return filepath.slice(filepath.lastIndexOf("/") + 1);
  }

  async saveSuperblock() {
    // Placeholder if needed
  }

  async loadSuperblock() {
    // Placeholder if needed
  }
}

export default MemoryBackend;