
import { Logger } from "../LoggerES6.js";
import { workerPool } from '../../WorkerPool.js';
import { getConfig } from '../../configES6.js';
import { GitAuth } from './gitAuth.js';

const config = await getConfig();
const logger = new Logger(config.logging.VFSutils);

function consoleDotLog(...parameters) {
  logger.consoleDotLog('[ VFSUtils ]' , ...parameters);
}

function consoleDotError(...parameters) {
  logger.consoleDotError('[ VFSUtils ]' , ...parameters);
}

consoleDotLog("Loading VFSUtils module");

export class VFSutils {
  constructor(fsType, fsInstance, fsName, fetchInfo) {
    this.fsType = fsType;
    this.fsInstance = fsInstance;
    this.fsName = fsName;
    this.fetchInfo = fetchInfo;
    this.workerEntry = null;
    this.workerThread = null;
    this.inodeCounter = 12341;
    this.fsTable = {};
    this.initialized = false;
    this.auth = null;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      this.workerEntry = await workerPool.getWorker(this.fsName);
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
      this.auth = new GitAuth(this.workerThread);

      if (this.fetchInfo.username || this.fetchInfo.password) {
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
      // FIX: Check if workerThread exists before trying to execute commands
      if (fsName && fsType && this.workerThread) {
        try {
          consoleDotLog('Terminating VFSUtils...', fsName, fsType);
          await this.workerThread.execute('handleDeleteCloseAndReclone', {
            fsName: fsName,
            fsType: fsType,
            reclone: true,
          });
        } catch (error) {
          consoleDotError(`Some error happened while terminating VFS: `, error);
          // We don't throw here, we proceed to clean up local references
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


    async initRepoLocally() {
    try {
      consoleDotLog('Initializing local repository...');
      if (!this.initialized) await this.initialize();

      const initResult = await this.workerThread.execute('init');
      consoleDotLog('initialized.');

      if (!initResult.success) {
        throw new Error("Local repository initialization failed!");
      }
      
      if (this.fetchInfo.name && this.fetchInfo.email) {
        await this.setUserConfig(this.fetchInfo.name, this.fetchInfo.email);
      }
      
      // Generate FS table after successful init
      await this.generateFsTable();
      consoleDotLog('Repository successfully initialized and indexed');
    } catch (error) {
      consoleDotError(`Local repo init failed: ${error}`);
      await this.terminate();
      throw error;
    }
  }

async fetchFromGit() {
    try {
      consoleDotLog('Fetching from Git repository...');
      if (!this.initialized) await this.initialize();
      consoleDotLog('initialized.');
      
      // --- START FIX ---
      let { url, dir = '/' } = this.fetchInfo;
      
      // 1. Fix Double Slash Issue
      if (url && url.startsWith('//')) {
        url = 'http:' + url;
        consoleDotLog(`[FIX] URL started with //, converted to: ${url}`);
      }
      
      // 2. Handle undefined/null/empty URL
      if (!url) {
        consoleDotLog('No URL provided, initializing local repository...');
        await this.initRepoLocally();
        return; // Exit early
      }
      // --- END FIX ---

      consoleDotLog(`Cloning repository from ${url} to ${dir}`);
      
      const cloneResult = await this.workerThread.execute('doCloneAndStuff', { url });
      
      // ... (rest of the function remains the same)
      
      // FIX: Handle missing notes gracefully by catching the specific error
      try {
        await this.fetchNotes();
      } catch (noteError) {
         if (!noteError.message.includes('refs/notes')) {
           throw noteError; // Re-throw if it's not a "notes missing" error
         }
         consoleDotLog('Notes not found on remote, continuing.');
      }

      if (!cloneResult.success) {
        throw new Error("Fetching from git failed!");
      }
      
      // FIX: Use username as fallback for author name
      if (this.fetchInfo.email) {
        const authorName = this.fetchInfo.name || this.fetchInfo.username || 'Default User';
        await this.setUserConfig(authorName, this.fetchInfo.email);
      }

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
      consoleDotLog(`Loading filesystem from disk`);
      
      await this.initRepoLocally();
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
       * Optimized sync status check with minimal remote operations
       */
      async getSyncStatus(__url = null, ref = 'main') {
          try {
            consoleDotLog('Starting sync status check...');
            
            // FIX: Add fallback for URL
            const _url = __url || this?.fetchInfo?.url;
            
            // If no URL, we can't check remote status
            if (!_url) {
              return { status: 'offline', error: 'No URL configured' };
            }
            
            // Get local head
            consoleDotLog('Getting local head commit...');
            const localHead = await this.workerThread.execute('getLastLocalCommit', { ref });
            consoleDotLog('Local head commit:', localHead);
            
            // Get remote head
            consoleDotLog('Getting remote head commit...');
            const remoteResult = await this.workerThread.execute('getLatestRemoteCommit', { 
              url: _url,
              ref,
            });
          consoleDotLog('Remote head result:', remoteResult);
      
          if (!remoteResult.success) {
            consoleDotLog('Remote branch not found');
            return {
              status: 'remote-branch-not-found',
              localHead,
              remoteHead: null
            };
          }
      
          const remoteHead = remoteResult.commit;
          consoleDotLog('Remote head commit:', remoteHead);
          
          // Fast path if heads match
          if (localHead === remoteHead) {
            consoleDotLog('Local and remote heads match - up to date');
            return {
              status: 'up-to-date',
              localHead,
              remoteHead
            };
          }
      
          // Get commit histories
          consoleDotLog('Getting commit histories...');
          const [localCommits, remoteCommits] = await Promise.all([
            await this.getLocalCommitHistory(10),
            await this.getRemoteCommitHistory(10)
          ]);
          
          consoleDotLog('Local commits (10 most recent):', localCommits);
          consoleDotLog('Remote commits (10 most recent):', remoteCommits);
      
          // Find common commit
          const commonCommit = this.findFirstCommonCommit(localCommits, remoteCommits);
          consoleDotLog('Common commit found:', commonCommit);
          
          let status;
          if (!commonCommit) {
            status = 'diverged';
            consoleDotLog('No common commit found - branches have diverged');
          } else if (commonCommit === remoteHead) {
            status = 'local-ahead';
            consoleDotLog('Local is ahead of remote');
          } else if (commonCommit === localHead) {
            status = 'remote-ahead';
            consoleDotLog('Remote is ahead of local');
          } else {
            status = 'diverged';
            consoleDotLog('Branches have diverged');
          }
      
          return {
            status,
            localHead,
            remoteHead,
            commonAncestor: commonCommit
          };
        } catch (err) {
          consoleDotError("getSyncStatus failed:", err);
          return {
            status: 'error',
            error: err.message
          };
        }
      }

      /**
       * Find first common commit between two commit lists
       */
      findFirstCommonCommit(localCommits, remoteCommits) {
        const remoteSet = new Set(remoteCommits);
        for (const commit of localCommits) {
          if (remoteSet.has(commit)) {
            return commit;
          }
        }
        return null;
      }

      /**
       * Get local commit history
       */
      async getLocalCommitHistory(depth = 10) {
        try {
          const logs = await this.workerThread.execute('log', {
            depth,
          });
          const commits = logs.map(commit => commit.oid);
          consoleDotLog('GetLocalCommitHistory result: ', commits);
          return commits || [];
        } catch (error) {
          consoleDotError("Failed to get local commit history:", error);
          return [];
        }
      }

      /**
       * Get remote commit history by fetching from replica
       */
      async getRemoteCommitHistory(depth = 10) {
        try {
          consoleDotLog('Fetching remote commit history with depth:', depth);
          const result = await this.workerThread.execute('getCommitHistoryFromReplica', {
            depth,
          });
          
          consoleDotLog('Raw result from worker:', result);
          
          // Handle both direct array response and success/commits object structure
          if (Array.isArray(result)) {
            consoleDotLog('Received direct commits array:', result);
            return result;
          } else if (result && (result.commits || result.success)) {
            consoleDotLog('Received structured response with commits:', result.commits || []);
            return result.commits || [];
          } else {
            consoleDotError('Unexpected response format:', result);
            return [];
          }
        } catch (error) {
          consoleDotError("Failed to get remote commit history:", error);
          return [];
        }
      }

      /**
       * Optimized sync flow that minimizes remote operations
       */
      async autoSyncFlow(onConflictStrategy, syncUrl) {
        try {
          consoleDotLog('this.fetchInfo', this.fetchInfo);
          // First do lightweight check
          const { status, localHead, remoteHead, commonAncestor } = await this.getSyncStatus(syncUrl);
          
          consoleDotLog("Sync status:", status);
          if (this.fetchInfo.name && this.fetchInfo.email) {
            await this.setUserConfig(this.fetchInfo.name, this.fetchInfo.email);
          }
          switch (status) {
            case 'up-to-date':
              return { synced: true };
              
            case 'local-ahead':
              return await this.handleLocalAhead(localHead, remoteHead, onConflictStrategy, syncUrl);
              
            case 'remote-ahead':
              return await this.handleRemoteAhead(localHead, remoteHead, onConflictStrategy, syncUrl);
              
            case 'diverged':
              return await this.handleDiverged(localHead, remoteHead, commonAncestor, onConflictStrategy, syncUrl);
              
            case 'remote-branch-not-found':
              consoleDotError('Remote branch not found');
              return { synced: false, error: 'Remote branch not found' };
              
            default:
              throw new Error(`Unknown sync status: ${status}`);
          }
        } catch (err) {
          consoleDotError("autoSyncFlow failed:", err);
          throw err;
        }
      }

      /**
       * Handle case where remote is ahead of local (need to pull changes)
       */
      async handleRemoteAhead(localHead, remoteHead, onConflictStrategy, syncUrl) {
        try {
          consoleDotLog(`Handling remote-ahead scenario (local: ${localHead}, remote: ${remoteHead})`);
          const _onConflictStrategy = onConflictStrategy || 'theirs';
          // 1. First try a simple fast-forward
          consoleDotLog('Attempting fast-forward merge...');
          const ffResult = await this.workerThread.execute('fastForward', {
            url: syncUrl,
            ref: 'main',
          });
          
          if (ffResult.success) {
            consoleDotLog('Fast-forward successful');
            await this.generateFsTable(); // Refresh FS table
            return { 
              synced: true, 
              strategy: 'fast-forward',
              oldHead: localHead,
              newHead: remoteHead
            };
          }
          
          // 2. If fast-forward fails, do a full pull with merge
          consoleDotLog('Fast-forward failed, attempting full pull...');
          const pullResult = await this.workerThread.execute('doFetch', {
            url: syncUrl,
            ref: 'main',
          });
          consoleDotLog('Fetching notes from remote...');
          await this.workerThread.execute('doFetch', {
            url: syncUrl,
            remote: 'origin',
            ref: 'refs/notes/commits',
            tags: true,
            singleBranch: true,
          });
          const mergeResult = await this.workerThread.execute('merge', {
            ours : 'main',
            theirs : 'origin/main',
            strategy: _onConflictStrategy,
          });

          consoleDotLog('Fetching notes from remote...');
          await this.workerThread.execute('doFetch', {
            url: syncUrl,
            remote: 'origin',
            ref: 'refs/notes/commits',
            tags: true,
            singleBranch: true,
          });
          
          if (!pullResult.success) {
            throw new Error('Pull failed: ' + (pullResult.error || 'Unknown error'));
          }
          
          consoleDotLog('Pull successful');
          await this.generateFsTable(); // Refresh FS table
          
          // Verify new head matches remote
          const newLocalHead = await this.workerThread.execute('getLastLocalCommit', { ref: 'main' });
          if (newLocalHead !== remoteHead) {
            consoleDotLog(`Warning: Local head (${newLocalHead}) doesn't match remote head (${remoteHead}) after pull`);
          }
          
          return { 
            synced: true, 
            strategy: 'pull-with-merge',
            oldHead: localHead,
            newHead: newLocalHead
          };
        } catch (error) {
          consoleDotError('handleRemoteAhead failed:', error);
          
          // Attempt to reset to original state if something went wrong
          try {
            await this.workerThread.execute('resetToCommit', { 
              oid: localHead,
              hard: true 
            });
          } catch (resetError) {
            consoleDotError('Failed to reset after error:', resetError);
          }
          
          throw error;
        }
      }

      /**
       * Handle case where local is ahead of remote (need to push changes)
       */
      async handleLocalAhead(localHead, remoteHead, onConflictStrategy, syncUrl) {
        try {
          consoleDotLog(`Handling local-ahead scenario (local: ${localHead}, remote: ${remoteHead})`);
          
          await this.setAuthParams(this.fetchInfo.username, this.fetchInfo.password);

          const pushNotesResult = await this.workerThread.execute('push', {
            url: syncUrl,
            ref: 'refs/notes/commits',
            remoteRef: 'refs/notes/commits',
            force: false,
          });
                    consoleDotLog('Attempting push...');
          const pushResult = await this.workerThread.execute('push', {
            url: syncUrl,
            ref: 'main',
            force: false,
          });
          
          if (pushResult.success || pushNotesResult.success) {
            consoleDotLog('Push successful');
            return { 
              synced: true, 
              strategy: 'push',
              oldRemoteHead: remoteHead,
              newRemoteHead: localHead
            };
          }
          
          consoleDotLog('Push failed, rechecking sync status...');
          const newStatus = await this.getSyncStatus(syncUrl);
          
          if (newStatus.status === 'up-to-date') {
            consoleDotLog('Status is now up-to-date after push failure');
            return { synced: true, strategy: 'concurrent-update' };
          }
          
          if (newStatus.status === 'remote-ahead') {
            consoleDotLog('Remote moved ahead during push attempt');
            return this.handleRemoteAhead(localHead, newStatus.remoteHead);
          }
          
          if (newStatus.status === 'diverged') {
            consoleDotLog('Branches diverged during push attempt');
            return this.handleDiverged(localHead, newStatus.remoteHead, newStatus.commonAncestor, onConflictStrategy, syncUrl);
          }
          
          throw new Error(`Unexpected status after push failure: ${newStatus.status}`);
        } catch (error) {
          consoleDotError('handleLocalAhead failed:', error);
          throw error;
        }
      }

      /**
       * Handle case where branches have diverged
       */

// In VFSUtils.js -> handleDiverged

async handleDiverged(localHead, remoteHead, commonAncestor, onConflictStrategy, syncUrl) {
  try {
    // Default to 'local' to preserve user changes
    const _onConflictStrategy = onConflictStrategy || 'local'; 
    consoleDotLog('Using merge workflow');
    
    // 1. Fetch
    consoleDotLog('Pulling with merge...');
    const pullResult = await this.workerThread.execute('doFetch', {
      url: syncUrl,
      ref: 'main',
    });

    if (!pullResult || !pullResult.success) {
       throw new Error('Fetch operation failed, aborting merge.');
    }

    // 2. Merge
    const mergeResult = await this.workerThread.execute('merge', {
      ours : 'main',
      theirs : 'origin/main',
      strategy : _onConflictStrategy,
    });
    
    // Check result
    if (!mergeResult || mergeResult.oid === undefined) {
        throw new Error('Merge failed or produced no commit.');
    }
    
    // 3. Push
    consoleDotLog('Pushing merged changes...');
    await this.setAuthParams(this.fetchInfo.username, this.fetchInfo.password);
    
    const pushResult = await this.workerThread.execute('push', {
      url: syncUrl,
      ref: 'main',
      force: false,
    });
    
    if(!pushResult.success) {
        throw new Error('Push failed after merge.');
    }

    return { 
      synced: true, 
      strategy: 'merge-workflow',
      oldLocalHead: localHead,
      newLocalHead: await this.workerThread.execute('getLastLocalCommit', { ref: 'main' }),
      remoteHead
    };
  } catch (error) {
    consoleDotError('handleDiverged failed:', error);
    
    // Attempt to reset to original state
    try {
      await this.workerThread.execute('resetToCommit', { 
        oid: localHead,
        hard: true 
      });
    } catch (resetError) {
      consoleDotError('Failed to reset after error:', resetError);
    }
    
    throw error;
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

      async updateFetchInfo(args) {
          try {
            const newFetchInfo = args || {};
            if (!this.initialized) await this.initialize();

            // FIX: Handle case where this.fetchInfo might be undefined initially
            this.fetchInfo = { ...(this.fetchInfo || {}), ...newFetchInfo };
            
            consoleDotLog('Fetch info updated:', this.fetchInfo);
            return this.fetchInfo;
          } catch(error) {
            consoleDotError('Some error happened while using updateFetchInfo');
            throw new Error('Some error happened while using updateFetchInfo');
          }
        }

      // ------------------
      //  Helper functions
      // ------------------

      async fetchNotes() {
        try {
          await this.reconfigureRemoteWithNotes();
          const serverRefs = await this.workerThread.execute('listServerRefs', {
            remote: 'origin'
          });
          
          // Check if notes exist before fetching
          const hasNotes = serverRefs.success && serverRefs.refs.some(row => row.ref === 'refs/notes/commits');

          if (hasNotes) {
            consoleDotLog('Fetching notes from remote...');
            await this.workerThread.execute('doFetch', {
              url: this.fetchInfo.url,
              remote: 'origin',
              ref: 'refs/notes/commits',
              tags: true,
              singleBranch: true,
            });
            consoleDotLog('Notes Fetch is done.');
          } else {
            consoleDotLog('No notes found on remote, skipping notes fetch.');
          }
        } catch (error) {
          // If listServerRefs fails or notes fetch fails, log but continue
          consoleDotError('Failed to fetch notes (optional):', error.message);
        }
      }

      async reconfigureRemoteWithNotes() {
        try {
          const fetch = await this.workerThread.execute('getConfig', {
            path: 'remote.origin.fetch',
          });
          
          if (fetch !== '+refs/notes/*:refs/notes/*') {
              await this.workerThread.execute('setConfig', {
              path: 'remote.origin.fetch',
              value: '+refs/notes/*:refs/notes/*',
              args: { append: true }
            });
          }

          consoleDotLog('Successfully reconfigured remote with notes fetch');
        } catch (error) {
          consoleDotError('Failed to reconfigure remote:', error);
          throw error;
        }
      }
}