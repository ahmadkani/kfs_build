import { Logger } from "../LoggerES6.js";
import { workerPool } from '../../WorkerPool.js';
import { config } from '../../configES6.js';
import { GitAuth } from './gitAuth.js';

const logger = new Logger(config.logging.VFSutils);

function consoleDotLog(...parameters) {
  logger.consoleDotLog('[ VFSUtils ]' , ...parameters);
}

function consoleDotError(...parameters) {
  logger.consoleDotError('[ VFSUtils ]' , ...parameters);
}

consoleDotLog("Loading VFSUtils module");

export class VFSutils {
  constructor(fsType, fsInstance, fsName, fetchInfo, useSW = false) {
    this.fsType = fsType;
    this.fsInstance = fsInstance;
    this.fsName = fsName;
    this.fetchInfo = fetchInfo;
    this.workerEntry = null;
    this.workerThread = null;
    this.inodeCounter = 12341;
    this.fsTable = {};
    this.initialized = false;
    this.useSW = useSW;
    this.auth = null;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      this.workerEntry = await workerPool.getWorker(this.fsName, this.useSW);
      this.workerThread = this.workerEntry.thread;
      
      consoleDotLog('Setting Fs for VFSUtils.')
      await this.workerThread.execute('setFs', {
        fsName: this.fsName,
        fsType: this.fsType,
      });
      
      
      consoleDotLog('Fs set.')
      if (this.fetchInfo.corsProxy) {
        await this.workerThread.execute('setCorsProxy', {
          corsProxy: this.fetchInfo.corsProxy,
        });
      }
      consoleDotLog('workerThread:', this.workerThread);
      this.auth = new GitAuth(this.workerThread);

      if (this.fetchInfo.username && this.fetchInfo.password) {
        await this.setAuthParams(this.fetchInfo.username, this.fetchInfo.password);
      }

      this.initialized = true;
      consoleDotLog(`VFSutils initialized for ${this.fsName} with type ${this.fsType}`);
    } catch (error) {
      await this.terminate();
      throw error;
    }
  }

  async terminate(fsName = null, fsType = null) {
    try {
      if (fsName && fsType) {
        try {
          consoleDotLog('Terminating VFSUtils...', fsName, fsType);
          await this.workerThread.execute('handleDeleteCloseAndReclone', {
            fsName: fsName,
            fsType: fsType,
            reclone: true,
          });
        } catch (error) {
          consoleDotError(`Some error happend while terminating VFS: `, error);
          throw error;
        }
      }
      
      if (this.workerEntry) {
        await workerPool.releaseWorker(this.fsName);
        this.workerEntry = null;
        this.workerThread = null;
      }
      this.initialized = false;
      return true;
    } catch (error) {
      consoleDotError("VFSutils termination error:", error);
      return false;
    }
  }

  async fetchFromGit() {
    try {
      consoleDotLog('Fetching from Git repository...');
      if (!this.initialized) await this.initialize();
      consoleDotLog('initialized.')
      const { url, dir = '/' } = this.fetchInfo;
      
      consoleDotLog(`Cloning repository from ${url} to ${dir}`);
      await this.workerThread.execute('doCloneAndStuff', { url });

      if (this.fetchInfo.name && this.fetchInfo.email) {
        await this.setUserConfig(this.fetchInfo.name, this.fetchInfo.email);
      }

      // Generate FS table after successful clone
      await this.generateFsTable();
      consoleDotLog('Repository successfully cloned and indexed');
    } catch (error) {
      consoleDotError(`Git fetch failed: ${error}`);
      await this.terminate();
      throw error;
    }
  }

  async fetchFromDisk() {
    try {
      if (!this.initialized) await this.initialize();
      const { dir } = this.fetchInfo;
      consoleDotLog(`Loading filesystem from disk at ${dir}`);
      
      // Implement disk loading logic here
      await this.generateFsTable();
      consoleDotLog(`Successfully loaded filesystem from disk`);
    } catch (error) {
      consoleDotError(`Disk load failed: ${error.message}`);
      await this.terminate();
      throw error;
    }
  }

  async fetchFromGoogleDrive() {
    try {
      if (!this.initialized) await this.initialize();
      const { fileId } = this.fetchInfo;
      consoleDotLog(`Fetching from Google Drive file ${fileId}`);
      
      // Implement Google Drive loading logic here
      await this.generateFsTable();
      consoleDotLog(`Successfully fetched from Google Drive`);
    } catch (error) {
      consoleDotError(`Google Drive fetch failed: ${error.message}`);
      await this.terminate();
      throw error;
    }
  }

  /* FS Table Management */
  async generateFsTable() {
    try {
      if (!this.initialized) await this.initialize();
      
      consoleDotLog('Generating FS table...');
      const fileList = await this.workerThread.execute('listFilesDot', { listDirs: true });
      consoleDotLog('File list:', fileList);
      this.fsTable = this.buildHierarchicalFsTable(fileList);
      
      consoleDotLog('FS table generated with', 
        Object.keys(this.fsTable['/'].children).length, 'root entries');
      return this.fsTable;
    } catch (error) {
      consoleDotError('FS table generation failed:', error);
      throw error;
    }
  }

  buildHierarchicalFsTable(fileList) {
    const root = this.createRootEntry();
    
    fileList.forEach(entry => {
      const pathParts = entry.path.split('/').filter(p => p !== '');
      let current = root;
      
      pathParts.forEach((part, index) => {
        const isLast = index === pathParts.length - 1;
        
        // If current node doesn't exist or isn't a directory, create it
        if (current.children[part]) {
          const existing = current.children[part];
          const expectedType = isLast && entry.type !== 'tree' ? 'file' : 'directory';
        
          if (existing.type !== expectedType) {
            throw new Error(
              `FS conflict: ${entry.path} has ${expectedType} where ${existing.type} already exists`
            );
          }
        } else {
          current.children[part] = this.createFsTableEntry(
            part,
            isLast && entry.type !== 'tree' ? 'file' : 'directory',
            entry.size || 0,
            current.dentry_id
          );
        }    
        
        // Only traverse into directories
        if (!isLast) {
          // Ensure the node we're moving into is a directory
          if (current.children[part].type !== 'directory') {
            // Convert existing file to directory if needed
            current.children[part] = {
              ...current.children[part],
              type: 'directory',
              children: {}
            };
          }
          current = current.children[part];
        }
      });
    });
    
    return { "/": root };
  }

  async updateFsTable(action, path, type = "file", size = 0) {
    try {
        // Normalize the path (remove leading/trailing slashes)
        const normalizedPath = path.replace(/^\/+|\/+$/g, '');
        
        // Ensure root exists
        if (!this.fsTable['/']) {
            this.fsTable['/'] = this.createRootEntry();
        }

        const pathParts = normalizedPath.split('/');
        let current = this.fsTable['/'];

        // Special case: removing root (should never happen)
        if (action === 'remove' && pathParts.length === 0) {
            throw new Error('Cannot remove root directory');
        }

        // Traverse the path
        for (let i = 0; i < pathParts.length - 1; i++) {
            const part = pathParts[i];
            
            if (!current.children || !current.children[part]) {
                if (action === 'remove') {
                    // For removal, parent must exist
                    throw new Error(`Parent path not found: ${pathParts.slice(0, i+1).join('/')}`);
                }
                // For creation, create intermediate directories
                current.children[part] = this.createFsTableEntry(
                    part, 
                    'directory', 
                    0, 
                    current.dentry_id
                );
            }
            
            current = current.children[part];
        }

        const name = pathParts[pathParts.length - 1];

        switch (action) {
            case 'create':
                if (!current.children) {
                    current.children = {};
                }
                
                // Check if already exists
                if (current.children[name]) {
                    consoleDotLog(`path ${path} already exists, updating its content`);
                }
                
                current.children[name] = this.createFsTableEntry(
                    name, 
                    type, 
                    size, 
                    current.dentry_id
                );
                break;
                
            case 'remove':
                if (!current.children || !current.children[name]) {
                    // Return false instead of throwing error for non-existent paths
                    return { success: false, message: `Path not found: ${path}` };
                }
                
                // Check if trying to remove non-empty directory
                if (current.children[name].type === 'directory' && 
                    Object.keys(current.children[name].children || {}).length > 0) {
                    throw new Error(`Cannot remove non-empty directory: ${path}`);
                }
                
                delete current.children[name];
                break;
                
            default:
                throw new Error(`Invalid action: ${action}`);
        }

        return { success: true, fsTable: this.fsTable };
    } catch (error) {
        consoleDotError('FS table update failed:', error);
        throw error;
    }
}

  createRootEntry() {
    return {
      type: "directory",
      dentry_id: this.inodeCounter++,
      name: "",
      parent_inode: 0,
      acl: { owner: "root", permissions: "rwx", groups: { "users": "r" } },
      children: {},
      ctime: Date.now(),
      mtime: Date.now()
    };
  }

  createFsTableEntry(name, type, size, parentInode) {
    const isDir = type === "directory";
    return {
      inode: this.inodeCounter++,
      type,
      name,
      mode: isDir ? 16877 : 100644,
      size: isDir ? 0 : size,
      uid: 1000,
      gid: 100,
      parent_inode: parentInode,
      acl: { 
        owner: "user", 
        permissions: isDir ? "rwx" : "rw-", 
        groups: { users: "r" } 
      },
      children: isDir ? {} : undefined,
      ctime: Date.now(),
      mtime: Date.now()
    };
  }

  async getFsTableSize(fsTable) {
    try {
      return fsTable ? JSON.stringify(fsTable).length : 0;
    } catch (error) {
      consoleDotError('Size calculation failed:', error);
      return 0;
    }
  }

  async commitStagedChanges( message ) {
    try {
      if (!this.initialized) await this.initialize();

      await this.workerThread.execute('setFs', {
        fsName: this.fsName,
        fsType: this.fsType,
      });

      return await this.workerThread.execute('commitStagedChanges', { message });
    } catch (error) {
      consoleDotError('Version commit failed:', error);
      throw error;
    } 
  }

  // -------------------
  //  Merging Methods
  // -------------------

    /**
   * High-level sync flow: checks sync status and acts accordingly.
   * Handles different cases like local changes, remote updates, etc.
   * @returns {Promise<void>}
   * @throws {Error} If sync fails or remote branch not found
   */
    async autoSyncFlow() {
      try {
        const syncStatus = await this.getSyncStatus();
        consoleDotLog("Auto-sync: Sync status:", syncStatus);
        switch (syncStatus) {
          case 'up-to-date':
            consoleDotLog("Auto-sync: Repo is already up to date.");
            return;
          case 'local-ahead':
            consoleDotLog("Auto-sync: Local changes detected, syncing with remote...");
            await this.syncWithRemote('local-ahead');
            break;
          case 'other-cases':
            consoleDotLog("Auto-sync: Other cases detected, syncing with remote...");
            await this.syncWithRemote('other-cases');
            break;
          case 'remote-branch-not-found':
            consoleDotError('No remote branch found, cannot sync.');
            break;
          default:
            consoleDotError('No remote branch found, cannot sync.');
            break;
        }
      } catch (err) {
        consoleDotError("autoSyncFlow() failed:", err);
      }
    }

    /**
   * Syncs the local repo with the remote by pulling changes.
   * Abstract logic — assumes `doFetch` does a pull or fetch + merge.
   */
    async syncWithRemote(strategy) {
      try {
        if (!this.initialized) await this.initialize();
  
        const { url } = this.fetchInfo;
        consoleDotLog("Attempting to sync with remote:", url);

        await this.setAuthParams(this.fetchInfo.username, this.fetchInfo.password);
        await this.setUserConfig(this.fetchInfo.name, this.fetchInfo.email);
        switch (strategy) {
          case 'local-ahead':
            consoleDotLog("Syncing with remote by pushing local changes...");
            await this.workerThread.execute('push', { url, ref: 'main' });
            break;
          case 'other-cases':
            
            break;
          default:
            consoleDotLog("Could not determine sync strategy, defaulting to pull...");
            // const pullResult = await this.workerThread.pull({ url, ref: 'main' });
            if (!pullResult.success) {
              throw new Error(`Pull failed: ${pullResult.error}`);
            }
            break;
        }

        // You might want to handle merge logic here later
        await this.generateFsTable();
        consoleDotLog("Local repo successfully synced with remote.");
      } catch (err) {
        consoleDotError("syncWithRemote failed:", err);
        throw err;
      }
    }

    async getSyncStatus(_url = null, ref = 'main') {
      try {
        const url = _url || this.fetchInfo?.url;
        const localHead = await this.workerThread.execute('getLastLocalCommit', { ref });
        const getRemoteHead = await this.workerThread.execute('getLatestRemoteCommit', { url, ref });
        if (!getRemoteHead.success) return 'remote-branch-not-found';
        const remoteHead = getRemoteHead.commit;

        consoleDotLog('localHead:', localHead, 'remoteHead:', remoteHead);
        const mergeBase = await this.workerThread.execute('findMergeBase', {
          oids: [localHead, remoteHead]
        });
            
        const base = mergeBase[0];
        consoleDotLog("Merge base:", mergeBase);
    
        const localHasRemote = base === remoteHead;
        if (!remoteHead) return 'remote-branch-not-found';
        if (localHead === remoteHead) return 'up-to-date';
        return localHasRemote ? 'local-ahead' : 'other-cases';   

      } catch (err) {
        return `error: ${err.message}`;
      }
    }
    
      // ------------------------
      //  Authentication Methods
      // ------------------------

      /**
       * Sets authentication credentials
       * @param {string} username 
       * @param {string} password 
       * @returns {Promise<boolean>}
       */
      async setAuthParams(username, password) {
        return this.auth.setAuthParams(username, password);
      }

      /**
       * Sets Git user config (name and email)
       * @param {string} name
       * @param {string} email
       * @returns {Promise<void>}
       */
      async setUserConfig(name, email) {
        return this.auth.setUserConfig(name, email);
      }
      
      /**
       * Verifies if current auth credentials are valid
       * @returns {Promise<boolean>}
       */
      async verifyAuth() {
        return this.auth.verifyAuth();
      }

      async updateFetchInfo(newFetchInfo) {
        if (!this.initialized) await this.initialize();
        this.fetchInfo = { ...this.fetchInfo, ...newFetchInfo };
        consoleDotLog('Fetch info updated:', this.fetchInfo);
        return this.fetchInfo;
      }
}