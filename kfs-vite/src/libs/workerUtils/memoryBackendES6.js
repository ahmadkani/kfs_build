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
    if (!this._files.has(filepath)) {
      throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
    }
    const dir = this._files.get(filepath);
    if (dir.type !== "dir") {
      throw Object.assign(new Error("ENOTDIR"), { code: "ENOTDIR" });
    }

    const results = new Set();
    const prefix = filepath === "/" ? "/" : `${filepath}/`;

    for (const key of this._files.keys()) {
      if (key.startsWith(prefix) && key !== filepath) {
        const relative = key.slice(prefix.length).split("/")[0];
        results.add(relative);
      }
    }

    return [...results];
  }

  async stat(filepath) {
    if (!this._files.has(filepath)) {
      throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
    }
    return this._files.get(filepath);
  }

  async lstat(filepath) {
    return this.stat(filepath);
  }

  async mkdir(filepath) {
    const parent = this._getParentDir(filepath);
    if (parent !== "/" && !this._files.has(parent)) {
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