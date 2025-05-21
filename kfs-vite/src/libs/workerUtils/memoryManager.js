import {Logger} from "./../LoggerES6.js";
import {config} from "./../../configES6.js";

const logger = new Logger(config.logging.memoryManagerES6);

function consoleDotLog(...args) {
  logger.consoleDotLog("[MemoryManager ES6]", ...args);
}

function consoleDotError(...args) {
  logger.consoleDotError("[MemoryManager ES6]", ...args);
}

consoleDotLog("Loading MemoryManager module");

class MemoryManager {
  constructor() {
    this._instances = new Map(); // dbName -> { files, versionVector }
    this._broadcastChannels = new Map(); // dbName -> BroadcastChannel
    this._pendingUpdates = new Map(); // dbName -> Array<update>
    this._isProcessing = new Map(); // dbName -> boolean
    
    consoleDotLog("MemoryManager initialized");
  }

  // Register a new MemoryBackend instance
  registerInstance(dbName, deviceId, initialFiles = new Map(), initialVersionVector = {}) {
    if (!this._instances.has(dbName)) {
      this._instances.set(dbName, {
        files: new Map(initialFiles),
        versionVectors: new Map([[deviceId, {...initialVersionVector}]])
      });
      this._setupBroadcastChannel(dbName);
      consoleDotLog(`Registered new database: ${dbName}`);
    } else {
      // Update existing instance with new device
      const dbData = this._instances.get(dbName);
      dbData.versionVectors.set(deviceId, {...initialVersionVector});
      consoleDotLog(`Registered new device ${deviceId} for database: ${dbName}`);
    }
    
    return {
      files: this._instances.get(dbName).files,
      versionVector: this._getMergedVersionVector(dbName)
    };
  }

  // Unregister a MemoryBackend instance
  unregisterInstance(dbName, deviceId) {
    if (this._instances.has(dbName)) {
      const dbData = this._instances.get(dbName);
      dbData.versionVectors.delete(deviceId);
      
      if (dbData.versionVectors.size === 0) {
        this._cleanupDatabase(dbName);
      }
      consoleDotLog(`Unregistered device ${deviceId} from database: ${dbName}`);
    }
  }

  // Get files for a database
  getFiles(dbName) {
    if (!this._instances.has(dbName)) {
      return new Map();
    }
    return new Map(this._instances.get(dbName).files);
  }

  // Update files for a database
  async updateFiles(dbName, deviceId, newFiles, newVersionVector) {
    if (!this._instances.has(dbName)) {
      this.registerInstance(dbName, deviceId, newFiles, newVersionVector);
      return;
    }

    const dbData = this._instances.get(dbName);
    
    // Check if the update is newer
    if (this._isNewerVersionVector(dbName, newVersionVector)) {
      dbData.files = new Map(newFiles);
      this._mergeVersionVector(dbName, deviceId, newVersionVector);
      consoleDotLog(`Updated files for ${dbName} from ${deviceId}`);
      
      // Broadcast the update to other instances
      await this._broadcastUpdate(dbName, {
        operation: "memorySync",
        data: {
          files: Array.from(newFiles.entries()),
          dbName,
          versionVector: newVersionVector,
          sender: deviceId
        }
      });
    }
  }

  // Request initial sync for a database
  requestInitialSync(dbName, requesterId, requesterVV) {
    if (!this._instances.has(dbName)) return;

    const dbData = this._instances.get(dbName);
    if (this._isNewerVersionVector(dbName, requesterVV)) {
      this._broadcastUpdate(dbName, {
        operation: "memorySync",
        data: {
          files: Array.from(dbData.files.entries()),
          dbName,
          versionVector: this._getMergedVersionVector(dbName),
          sender: "manager",
          targetId: requesterId
        }
      });
    }
  }

  // Private methods
  _setupBroadcastChannel(dbName) {
    if (this._broadcastChannels.has(dbName)) return;

    const channel = new BroadcastChannel(`memory-manager-${dbName}`);
    channel.onmessage = (event) => this._handleChannelMessage(dbName, event);
    this._broadcastChannels.set(dbName, channel);
    consoleDotLog(`Setup broadcast channel for ${dbName}`);
  }

  async _handleChannelMessage(dbName, event) {
    const { operation, data } = event.data || {};
    if (!data?.dbName || data.dbName !== dbName) return;

    if (operation === "memorySyncRequest") {
      this.requestInitialSync(dbName, data.requesterId, data.requesterVV);
      return;
    }

    if (operation === "memorySync") {
      await this.updateFiles(
        dbName, 
        data.sender, 
        new Map(data.files), 
        data.versionVector
      );
    }
  }

  async _broadcastUpdate(dbName, update) {
    if (this._isProcessing.get(dbName)) {
      if (!this._pendingUpdates.has(dbName)) {
        this._pendingUpdates.set(dbName, []);
      }
      this._pendingUpdates.get(dbName).push(update);
      return;
    }

    this._isProcessing.set(dbName, true);
    
    try {
      const channel = this._broadcastChannels.get(dbName);
      if (channel) {
        channel.postMessage(update);
        consoleDotLog(`Broadcast update for ${dbName}`, update);
      }
      
      await this._processPendingUpdates(dbName);
    } catch (err) {
      consoleDotError(`Error broadcasting update for ${dbName}:`, err);
    } finally {
      this._isProcessing.set(dbName, false);
    }
  }

  async _processPendingUpdates(dbName) {
    if (!this._pendingUpdates.has(dbName) || this._pendingUpdates.get(dbName).length === 0) {
      return;
    }

    const updates = this._pendingUpdates.get(dbName);
    this._pendingUpdates.set(dbName, []);
    
    for (const update of updates) {
      await this._broadcastUpdate(dbName, update);
    }
  }

  _isNewerVersionVector(dbName, remoteVV) {
    if (!this._instances.has(dbName)) return true;
    
    const dbData = this._instances.get(dbName);
    let isNewer = false;
    
    for (const [id, versions] of dbData.versionVectors) {
      for (const deviceId in remoteVV) {
        const localVersion = versions[deviceId] || 0;
        const remoteVersion = remoteVV[deviceId] || 0;
        if (remoteVersion > localVersion) {
          isNewer = true;
          break;
        }
      }
      if (isNewer) break;
    }
    
    return isNewer;
  }

  _mergeVersionVector(dbName, deviceId, remoteVV) {
    const dbData = this._instances.get(dbName);
    if (!dbData.versionVectors.has(deviceId)) {
      dbData.versionVectors.set(deviceId, {});
    }
    
    const deviceVV = dbData.versionVectors.get(deviceId);
    for (const id in remoteVV) {
      if (!deviceVV[id] || remoteVV[id] > deviceVV[id]) {
        deviceVV[id] = remoteVV[id];
      }
    }
  }

  _getMergedVersionVector(dbName) {
    if (!this._instances.has(dbName)) return {};
    
    const dbData = this._instances.get(dbName);
    const merged = {};
    
    for (const [_, versions] of dbData.versionVectors) {
      for (const id in versions) {
        if (!merged[id] || versions[id] > merged[id]) {
          merged[id] = versions[id];
        }
      }
    }
    
    return merged;
  }

  _cleanupDatabase(dbName) {
    if (this._broadcastChannels.has(dbName)) {
      this._broadcastChannels.get(dbName).close();
      this._broadcastChannels.delete(dbName);
    }
    this._instances.delete(dbName);
    this._pendingUpdates.delete(dbName);
    this._isProcessing.delete(dbName);
    consoleDotLog(`Cleaned up database: ${dbName}`);
  }
}

// Singleton instance
const memoryManager = new MemoryManager();
export default memoryManager;