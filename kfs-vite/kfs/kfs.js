import { MemoryFS } from './assets/memoryFs-VAT3s8Qe.js';
import { g as getConfig, L as Logger } from './assets/configES6-bU3v7xiC.js';
import { w as workerPool } from './assets/WorkerPool-B814pJ45.js';

// GitAuth.js

const config$6 = await getConfig();
const logger$5 = new Logger(config$6.logging.GitAuth);

function consoleDotLog$5(...parameters) {
  logger$5.consoleDotLog(...parameters);
}

function consoleDotError$4(...parameters) {
  logger$5.consoleDotError(...parameters);
}

class GitAuth {
  constructor(workerThread) {
    this.workerThread = workerThread;
    this.AuthChecked = false;
  }

  /**
   * Sets authentication credentials for Git operations
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<boolean>}
   */
  async setAuthParams(username, password) {
    try {
      if (!this.workerThread) {
        throw new Error('Worker thread not initialized');
      }
      
      await this.workerThread.execute('setAuthParams', { username, password });
      consoleDotLog$5('Auth params set successfully');
      if (!this.AuthChecked) {
        // await this.verifyAuth();
        this.AuthChecked = true;
      }
      consoleDotLog$5('Auth params verified successfully');
      return true;
    } catch (error) {
      consoleDotError$4('Failed to set auth params:', error);
      throw error;
    }
  }

  /**
   * Verifies if current auth credentials are valid
   * @returns {Promise<boolean>}
   */
  async verifyAuth() {
    try {
      if (!this.workerThread) {
        throw new Error('Worker thread not initialized');
      }

      // Try a lightweight operation that requires auth
      // It is not permanent, because a repo can require no auth for clone
      await this.workerThread.execute('listServerRefs');
      consoleDotLog$5('Auth verification successful');
      return true;
    } catch (error) {
      if (error.toString().includes('401') || error.toString().includes('403')) {
        consoleDotLog$5('Auth verification failed - invalid credentials');
        return false;
      }
      consoleDotError$4('Auth verification error:', error);
      throw error;
    }
  }

    /**
     * Sets Git user config (name and email)
     * @param {string} name 
     * @param {string} email 
     */
    async setUserConfig(name, email) {
        try {
        await this.workerThread.execute('setConfigs', { name, email });
        consoleDotLog$5(`User config set, name: ${name}, email: ${email}`);
        return true;
        } catch (error) {
        consoleDotError$4(`Failed to set user config: ${error}`);
        throw error;
        }
    }
}

const config$5 = await getConfig();
const logger$4 = new Logger(config$5.logging.VFSutils);

function consoleDotLog$4(...parameters) {
  logger$4.consoleDotLog('[ VFSUtils ]' , ...parameters);
}

function consoleDotError$3(...parameters) {
  logger$4.consoleDotError('[ VFSUtils ]' , ...parameters);
}

consoleDotLog$4("Loading VFSUtils module");

class VFSutils {
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
      
      consoleDotLog$4('Setting Fs for VFSUtils.');
      await this.workerThread.execute('setFs', {
        fsName: this.fsName,
        fsType: this.fsType,
      });
      
      
      consoleDotLog$4('Fs set.');
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
      consoleDotLog$4(`VFSutils initialized for ${this.fsName} with type ${this.fsType}`);
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
          consoleDotLog$4('Terminating VFSUtils...', fsName, fsType);
          await this.workerThread.execute('handleDeleteCloseAndReclone', {
            fsName: fsName,
            fsType: fsType,
            reclone: true,
          });
        } catch (error) {
          consoleDotError$3(`Some error happened while terminating VFS: `, error);
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
      consoleDotError$3("VFSutils termination error:", error);
      return false;
    }
  }


    async initRepoLocally() {
    try {
      consoleDotLog$4('Initializing local repository...');
      if (!this.initialized) await this.initialize();

      const initResult = await this.workerThread.execute('init');
      consoleDotLog$4('initialized.');

      if (!initResult.success) {
        throw new Error("Local repository initialization failed!");
      }
      
      if (this.fetchInfo.name && this.fetchInfo.email) {
        await this.setUserConfig(this.fetchInfo.name, this.fetchInfo.email);
      }
      
      // Generate FS table after successful init
      await this.generateFsTable();
      consoleDotLog$4('Repository successfully initialized and indexed');
    } catch (error) {
      consoleDotError$3(`Local repo init failed: ${error}`);
      await this.terminate();
      throw error;
    }
  }

async fetchFromGit() {
    try {
      consoleDotLog$4('Fetching from Git repository...');
      if (!this.initialized) await this.initialize();
      consoleDotLog$4('initialized.');
      
      // --- START FIX ---
      let { url, dir = '/' } = this.fetchInfo;
      
      // 1. Fix Double Slash Issue
      if (url && url.startsWith('//')) {
        url = 'http:' + url;
        consoleDotLog$4(`[FIX] URL started with //, converted to: ${url}`);
      }
      
      // 2. Handle undefined/null/empty URL
      if (!url) {
        consoleDotLog$4('No URL provided, initializing local repository...');
        await this.initRepoLocally();
        return; // Exit early
      }
      // --- END FIX ---

      consoleDotLog$4(`Cloning repository from ${url} to ${dir}`);
      
      const cloneResult = await this.workerThread.execute('doCloneAndStuff', { url });
      
      // ... (rest of the function remains the same)
      
      // FIX: Handle missing notes gracefully by catching the specific error
      try {
        await this.fetchNotes();
      } catch (noteError) {
         if (!noteError.message.includes('refs/notes')) {
           throw noteError; // Re-throw if it's not a "notes missing" error
         }
         consoleDotLog$4('Notes not found on remote, continuing.');
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
      consoleDotLog$4('Repository successfully cloned and indexed');
    } catch (error) {
      consoleDotError$3(`Git fetch failed: ${error}`);
      await this.terminate();
      throw error;
    }
  }

  async fetchFromDisk() {
    try {
      if (!this.initialized) await this.initialize();
      consoleDotLog$4(`Loading filesystem from disk`);
      
      await this.initRepoLocally();
      await this.generateFsTable();
      consoleDotLog$4(`Successfully loaded filesystem from disk`);
    } catch (error) {
      consoleDotError$3(`Disk load failed: ${error.message}`);
      await this.terminate();
      throw error;
    }
  }

  async fetchFromGoogleDrive() {
    try {
      if (!this.initialized) await this.initialize();
      const { fileId } = this.fetchInfo;
      consoleDotLog$4(`Fetching from Google Drive file ${fileId}`);
      
      // Implement Google Drive loading logic here
      await this.generateFsTable();
      consoleDotLog$4(`Successfully fetched from Google Drive`);
    } catch (error) {
      consoleDotError$3(`Google Drive fetch failed: ${error.message}`);
      await this.terminate();
      throw error;
    }
  }

  /* FS Table Management */
  async generateFsTable() {
    try {
      if (!this.initialized) await this.initialize();
      
      consoleDotLog$4('Generating FS table...');
      const fileList = await this.workerThread.execute('listFilesDot', { listDirs: true });
      consoleDotLog$4('File list:', fileList);
      this.fsTable = this.buildHierarchicalFsTable(fileList);
      
      consoleDotLog$4('FS table generated with', 
        Object.keys(this.fsTable['/'].children).length, 'root entries');
      return this.fsTable;
    } catch (error) {
      consoleDotError$3('FS table generation failed:', error);
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
                    consoleDotLog$4(`path ${path} already exists, updating its content`);
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
        consoleDotError$3('FS table update failed:', error);
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
      consoleDotError$3('Size calculation failed:', error);
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
      consoleDotError$3('Version commit failed:', error);
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
            consoleDotLog$4('Starting sync status check...');
            
            // FIX: Add fallback for URL
            const _url = __url || this?.fetchInfo?.url;
            
            // If no URL, we can't check remote status
            if (!_url) {
              return { status: 'offline', error: 'No URL configured' };
            }
            
            // Get local head
            consoleDotLog$4('Getting local head commit...');
            const localHead = await this.workerThread.execute('getLastLocalCommit', { ref });
            consoleDotLog$4('Local head commit:', localHead);
            
            // Get remote head
            consoleDotLog$4('Getting remote head commit...');
            const remoteResult = await this.workerThread.execute('getLatestRemoteCommit', { 
              url: _url,
              ref,
            });
          consoleDotLog$4('Remote head result:', remoteResult);
      
          if (!remoteResult.success) {
            consoleDotLog$4('Remote branch not found');
            return {
              status: 'remote-branch-not-found',
              localHead,
              remoteHead: null
            };
          }
      
          const remoteHead = remoteResult.commit;
          consoleDotLog$4('Remote head commit:', remoteHead);
          
          // Fast path if heads match
          if (localHead === remoteHead) {
            consoleDotLog$4('Local and remote heads match - up to date');
            return {
              status: 'up-to-date',
              localHead,
              remoteHead
            };
          }
      
          // Get commit histories
          consoleDotLog$4('Getting commit histories...');
          const [localCommits, remoteCommits] = await Promise.all([
            await this.getLocalCommitHistory(10),
            await this.getRemoteCommitHistory(10)
          ]);
          
          consoleDotLog$4('Local commits (10 most recent):', localCommits);
          consoleDotLog$4('Remote commits (10 most recent):', remoteCommits);
      
          // Find common commit
          const commonCommit = this.findFirstCommonCommit(localCommits, remoteCommits);
          consoleDotLog$4('Common commit found:', commonCommit);
          
          let status;
          if (!commonCommit) {
            status = 'diverged';
            consoleDotLog$4('No common commit found - branches have diverged');
          } else if (commonCommit === remoteHead) {
            status = 'local-ahead';
            consoleDotLog$4('Local is ahead of remote');
          } else if (commonCommit === localHead) {
            status = 'remote-ahead';
            consoleDotLog$4('Remote is ahead of local');
          } else {
            status = 'diverged';
            consoleDotLog$4('Branches have diverged');
          }
      
          return {
            status,
            localHead,
            remoteHead,
            commonAncestor: commonCommit
          };
        } catch (err) {
          consoleDotError$3("getSyncStatus failed:", err);
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
          consoleDotLog$4('GetLocalCommitHistory result: ', commits);
          return commits || [];
        } catch (error) {
          consoleDotError$3("Failed to get local commit history:", error);
          return [];
        }
      }

      /**
       * Get remote commit history by fetching from replica
       */
      async getRemoteCommitHistory(depth = 10) {
        try {
          consoleDotLog$4('Fetching remote commit history with depth:', depth);
          const result = await this.workerThread.execute('getCommitHistoryFromReplica', {
            depth,
          });
          
          consoleDotLog$4('Raw result from worker:', result);
          
          // Handle both direct array response and success/commits object structure
          if (Array.isArray(result)) {
            consoleDotLog$4('Received direct commits array:', result);
            return result;
          } else if (result && (result.commits || result.success)) {
            consoleDotLog$4('Received structured response with commits:', result.commits || []);
            return result.commits || [];
          } else {
            consoleDotError$3('Unexpected response format:', result);
            return [];
          }
        } catch (error) {
          consoleDotError$3("Failed to get remote commit history:", error);
          return [];
        }
      }

      /**
       * Optimized sync flow that minimizes remote operations
       */
      async autoSyncFlow(onConflictStrategy, syncUrl) {
        try {
          consoleDotLog$4('this.fetchInfo', this.fetchInfo);
          // First do lightweight check
          const { status, localHead, remoteHead, commonAncestor } = await this.getSyncStatus(syncUrl);
          
          consoleDotLog$4("Sync status:", status);
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
              consoleDotError$3('Remote branch not found');
              return { synced: false, error: 'Remote branch not found' };
              
            default:
              throw new Error(`Unknown sync status: ${status}`);
          }
        } catch (err) {
          consoleDotError$3("autoSyncFlow failed:", err);
          throw err;
        }
      }

      /**
       * Handle case where remote is ahead of local (need to pull changes)
       */
      async handleRemoteAhead(localHead, remoteHead, onConflictStrategy, syncUrl) {
        try {
          consoleDotLog$4(`Handling remote-ahead scenario (local: ${localHead}, remote: ${remoteHead})`);
          const _onConflictStrategy = onConflictStrategy || 'theirs';
          // 1. First try a simple fast-forward
          consoleDotLog$4('Attempting fast-forward merge...');
          const ffResult = await this.workerThread.execute('fastForward', {
            url: syncUrl,
            ref: 'main',
          });
          
          if (ffResult.success) {
            consoleDotLog$4('Fast-forward successful');
            await this.generateFsTable(); // Refresh FS table
            return { 
              synced: true, 
              strategy: 'fast-forward',
              oldHead: localHead,
              newHead: remoteHead
            };
          }
          
          // 2. If fast-forward fails, do a full pull with merge
          consoleDotLog$4('Fast-forward failed, attempting full pull...');
          const pullResult = await this.workerThread.execute('doFetch', {
            url: syncUrl,
            ref: 'main',
          });
          consoleDotLog$4('Fetching notes from remote...');
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

          consoleDotLog$4('Fetching notes from remote...');
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
          
          consoleDotLog$4('Pull successful');
          await this.generateFsTable(); // Refresh FS table
          
          // Verify new head matches remote
          const newLocalHead = await this.workerThread.execute('getLastLocalCommit', { ref: 'main' });
          if (newLocalHead !== remoteHead) {
            consoleDotLog$4(`Warning: Local head (${newLocalHead}) doesn't match remote head (${remoteHead}) after pull`);
          }
          
          return { 
            synced: true, 
            strategy: 'pull-with-merge',
            oldHead: localHead,
            newHead: newLocalHead
          };
        } catch (error) {
          consoleDotError$3('handleRemoteAhead failed:', error);
          
          // Attempt to reset to original state if something went wrong
          try {
            await this.workerThread.execute('resetToCommit', { 
              oid: localHead,
              hard: true 
            });
          } catch (resetError) {
            consoleDotError$3('Failed to reset after error:', resetError);
          }
          
          throw error;
        }
      }

      /**
       * Handle case where local is ahead of remote (need to push changes)
       */
      async handleLocalAhead(localHead, remoteHead, onConflictStrategy, syncUrl) {
        try {
          consoleDotLog$4(`Handling local-ahead scenario (local: ${localHead}, remote: ${remoteHead})`);
          
          await this.setAuthParams(this.fetchInfo.username, this.fetchInfo.password);

          const pushNotesResult = await this.workerThread.execute('push', {
            url: syncUrl,
            ref: 'refs/notes/commits',
            remoteRef: 'refs/notes/commits',
            force: false,
          });
                    consoleDotLog$4('Attempting push...');
          const pushResult = await this.workerThread.execute('push', {
            url: syncUrl,
            ref: 'main',
            force: false,
          });
          
          if (pushResult.success || pushNotesResult.success) {
            consoleDotLog$4('Push successful');
            return { 
              synced: true, 
              strategy: 'push',
              oldRemoteHead: remoteHead,
              newRemoteHead: localHead
            };
          }
          
          consoleDotLog$4('Push failed, rechecking sync status...');
          const newStatus = await this.getSyncStatus(syncUrl);
          
          if (newStatus.status === 'up-to-date') {
            consoleDotLog$4('Status is now up-to-date after push failure');
            return { synced: true, strategy: 'concurrent-update' };
          }
          
          if (newStatus.status === 'remote-ahead') {
            consoleDotLog$4('Remote moved ahead during push attempt');
            return this.handleRemoteAhead(localHead, newStatus.remoteHead);
          }
          
          if (newStatus.status === 'diverged') {
            consoleDotLog$4('Branches diverged during push attempt');
            return this.handleDiverged(localHead, newStatus.remoteHead, newStatus.commonAncestor, onConflictStrategy, syncUrl);
          }
          
          throw new Error(`Unexpected status after push failure: ${newStatus.status}`);
        } catch (error) {
          consoleDotError$3('handleLocalAhead failed:', error);
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
    consoleDotLog$4('Using merge workflow');
    
    // 1. Fetch
    consoleDotLog$4('Pulling with merge...');
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
    consoleDotLog$4('Pushing merged changes...');
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
    consoleDotError$3('handleDiverged failed:', error);
    
    // Attempt to reset to original state
    try {
      await this.workerThread.execute('resetToCommit', { 
        oid: localHead,
        hard: true 
      });
    } catch (resetError) {
      consoleDotError$3('Failed to reset after error:', resetError);
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
            
            consoleDotLog$4('Fetch info updated:', this.fetchInfo);
            return this.fetchInfo;
          } catch(error) {
            consoleDotError$3('Some error happened while using updateFetchInfo');
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
            consoleDotLog$4('Fetching notes from remote...');
            await this.workerThread.execute('doFetch', {
              url: this.fetchInfo.url,
              remote: 'origin',
              ref: 'refs/notes/commits',
              tags: true,
              singleBranch: true,
            });
            consoleDotLog$4('Notes Fetch is done.');
          } else {
            consoleDotLog$4('No notes found on remote, skipping notes fetch.');
          }
        } catch (error) {
          // If listServerRefs fails or notes fetch fails, log but continue
          consoleDotError$3('Failed to fetch notes (optional):', error.message);
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

          consoleDotLog$4('Successfully reconfigured remote with notes fetch');
        } catch (error) {
          consoleDotError$3('Failed to reconfigure remote:', error);
          throw error;
        }
      }
}

class StorageUtils {
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

  async ensureObjectStoreExists() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => {
        console.error("IndexedDB open error:", request.error);
        resolve(false);
      };
      
      request.onsuccess = () => {
        const db = request.result;
        if (db.objectStoreNames.contains("mounts")) {
          resolve(true);
        } else {
          resolve(false);
        }
        db.close();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("mounts")) {
          db.createObjectStore("mounts");
          console.log("Created 'mounts' object store");
        }
      };
    });
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

  async getFromIndexedDB(key) {
    const hasObjectStore = await this.ensureObjectStoreExists();
    if (!hasObjectStore) return null;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      request.onerror = () => resolve(null);
      request.onsuccess = () => {
        const db = request.result;
        try {
          const transaction = db.transaction("mounts", "readonly");
          const store = transaction.objectStore("mounts");
          const getRequest = store.get(key);

          getRequest.onsuccess = () => resolve(getRequest.result || null);
          getRequest.onerror = () => resolve(null);
        } catch (error) {
          console.error("Transaction error:", error);
          resolve(null);
        } finally {
          db.close();
        }
      };
    });
  }

  async getAll() {
    if (this.supportsIndexedDB()) {
      try {
        return await this.getAllFromIndexedDB();
      } catch (e) {
        console.error("IndexedDB getAll failed:", e);
        // Fallback to localStorage
        return await this.getAllFromLocalStorage();
      }
    }
    return await this.getAllFromLocalStorage();
  }

  async getAllFromIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => resolve({});
      request.onsuccess = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("mounts")) {
          resolve({});
          return;
        }
  
        const transaction = db.transaction("mounts", "readonly");
        const store = transaction.objectStore("mounts");
        const getAllKeysRequest = store.getAllKeys();
        const result = {};
  
        getAllKeysRequest.onsuccess = async () => {
          const keys = getAllKeysRequest.result;
          
          // Get each value by its exact key
          for (const key of keys) {
            const value = await this.get(key);
            if (value) {
              result[key] = value;
            }
          }
          
          resolve(result);
        };
        
        getAllKeysRequest.onerror = () => resolve({});
      };
    });
  }

  async getAllFromLocalStorage() {
    try {
      if (typeof localStorage === "undefined") return {};
      
      const result = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.dbName)) {
          try {
            result[key] = JSON.parse(localStorage.getItem(key));
          } catch (e) {
            console.error("Error parsing localStorage item:", e);
          }
        }
      }
      return result;
    } catch (e) {
      console.error("LocalStorage getAll error:", e);
      return {};
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

const config$4 = await getConfig();
const logger$3 = new Logger(config$4.logging.supportChecker);

function consoleDotLog$3(...parameters) {
  logger$3.consoleDotLog(...parameters);
}

async function checkIndexedDBSupport() {
  try {
    if (!window.indexedDB) {
      consoleDotLog$3("IndexedDB not supported in this browser");
      return false;
    }

    // Test opening a dummy database to verify support
    return await new Promise((resolve) => {
      const dbName = "testIDBSupport";
      const request = indexedDB.open(dbName);
      
      request.onerror = () => {
        consoleDotLog$3("IndexedDB not available");
        resolve(false);
      };
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        db.close();
        
        // Delete the test database
        const deleteRequest = indexedDB.deleteDatabase(dbName);
        
        deleteRequest.onerror = () => {
          consoleDotLog$3("Failed to delete test database");
          resolve(true); // Still consider IDB supported
        };
        
        deleteRequest.onsuccess = () => {
          consoleDotLog$3("IndexedDB test successful");
          resolve(true);
        };
      };

      request.onblocked = () => {
        consoleDotLog$3("IndexedDB request blocked");
        resolve(false);
      };
    });
  } catch (e) {
    consoleDotLog$3("IndexedDB test failed:", e);
    return false;
  }
}

const config$3 = await getConfig();
const logger$2 = new Logger(config$3.logging.vfs);

// Logger Utilities
function consoleDotLog$2(...parameters) {
  logger$2.consoleDotLog('[VFS] ', ...parameters);
}

function consoleDotError$2(...parameters) {
  logger$2.consoleDotError('[VFS] ', ...parameters);
}

class VFS {
  // Initialization and Core Setup
  constructor(storageName = "VFS_Mounts") {
    this.mounts = Object.create(null);
    this.initializedMounts = new Set();
    this.vfsUtilsInstances = new Map(); // Track VFSutils instances per mount
    this.storageUtils = new StorageUtils(storageName);
    this.currentMountPath = '';
    this.idbSupported = null;
    (async () => {
      try {
        await this.retrieveAndMountFromFsTable();
      } catch (error) {
        consoleDotError$2('Automatic mount from fsTable failed:', error);
      }
    })();
    consoleDotLog$2('VFS instance created');
  }

  // Environment detection utilities
  getBrowserInfo() {
    if (typeof navigator === 'undefined') return 'Node.js';
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    
    if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('SamsungBrowser')) browser = 'Samsung Browser';
    else if (userAgent.includes('Opera') || userAgent.includes('OPR')) browser = 'Opera';
    else if (userAgent.includes('Trident')) browser = 'IE';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    else if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    
    return browser;
  }

  getDeviceType() {
    if (typeof navigator === 'undefined') return 'Server';
    const userAgent = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
      return 'Tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
      return 'Mobile';
    }
    return 'Desktop';
  }

  getPlatformInfo() {
    const isBrowser = typeof window !== 'undefined';
    return {
      browser: this.getBrowserInfo(),
      device: this.getDeviceType(),
      userAgent: isBrowser ? navigator.userAgent : 'Node.js',
      platform: isBrowser ? navigator.platform : process.platform,
      screenResolution: isBrowser ? `${window.screen.width}x${window.screen.height}` : 'N/A',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: isBrowser ? navigator.language : 'N/A'
    };
  }

  // Utility functions for versioning and merging
  getVersioningConfig(options = {}) {
    const versioning = options.versioning || config$3.versioning || {};
    return {
      strategy: versioning.strategy,
      interval: versioning.interval,
      number: versioning.number
    };
  }

  getMergingConfig(options = {}) {
    const merging = options.merging || config$3.merging || {};
    return {
        ...merging,
        strategy: merging.strategy || 'immediate',
        onConflictStrategy: merging.onConflictStrategy || 'local'
    };
  }

  // Storage and Support Checking
  async checkIndexedDBSupport() {
    consoleDotLog$2('Checking IndexedDB support...');
    if (this.idbSupported !== null) {
      return this.idbSupported; // Return cached result if available
    }
    
    // Check if running in Node.js
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      consoleDotLog$2('Running in Node.js environment, IndexedDB not supported');
      this.idbSupported = false;
      return false;
    }

    try {
      await checkIndexedDBSupport();
      consoleDotLog$2('IndexedDB is supported');
      this.idbSupported = true;
      return true;
    } catch (error) {
      consoleDotError$2('IndexedDB not supported:', error);
      this.idbSupported = false;
      return false;
    }
  }

  async loadMountFromStorage(mountPath) {
    consoleDotLog$2(`Attempting to load mount from storage: ${mountPath}`);
    try {
      const storedMount = await this.storageUtils.get(mountPath);
      if (storedMount) {
        consoleDotLog$2(`Successfully loaded mount from storage: ${mountPath}`);
        return storedMount;
      }
      consoleDotLog$2(`No mount found in storage for path: ${mountPath}`);
      return null;
    } catch (error) {
      consoleDotError$2(`Failed to load mount from storage (path: ${mountPath}):`, error);
      throw error;
    }
  }

  async persistMountData(mountPath, mountData) {
    consoleDotLog$2(`Persisting mount data for ${mountPath}`);
    try {
      // FIX: In Node.js, we don't use IndexedDB. We just keep it in memory.
      if (typeof indexedDB === 'undefined') {
        this.mounts[mountPath] = mountData;
        consoleDotLog$2(`Node.js: Mount data persisted in memory for ${mountPath}`);
        return;
      }

      // Browser logic
      const dataToStore = { ...mountData };
      delete dataToStore.fsInstance;
      await this.storageUtils.store(mountPath, dataToStore);
      consoleDotLog$2(`Successfully persisted mount data for ${mountPath}`);
    } catch (error) {
      consoleDotError$2(`Failed to persist mount data for ${mountPath}:`, error);
      throw error;
    }
  }

  // Filesystem Instance Management
  async createFSInstance(fsType, mountPath, options = {}) {
    consoleDotLog$2(`Creating FS instance of type ${fsType} for mount path ${mountPath}`);
    try {
      const isNode = typeof window === 'undefined';

      // 1. Use NodeFS if explicitly requested
      if (isNode && fsType === 'node') {
          consoleDotLog$2('Using NodeFS (Native Worker Wrapper)');
          const { NodeFS } = await import('./assets/NodeFS-BpR-j37P.js');
          // FIX: Pass fsType: 'node' so NodeFS knows to use the path directly
          return new NodeFS(mountPath, { fsName: mountPath, fsType: 'node', ...options });
      }
      
      // 2. Use NodeFS for 'memory' in Node.js (Disk backed temp folder)
      if (isNode && fsType === 'memory') {
          consoleDotLog$2('Using NodeFS (Disk-backed) for memory in Node.js');
          const { NodeFS } = await import('./assets/NodeFS-BpR-j37P.js');
          // FIX: Pass fsType: 'memory' so NodeFS knows to map to temp
          return new NodeFS(mountPath, { fsName: mountPath, fsType: 'memory', ...options });
      }

      // 3. Browser Logic
      const useSW = false;
      
      if (fsType === 'idb') {
        const isSupported = await this.checkIndexedDBSupport();
        if (!isSupported) {
          consoleDotLog$2(`IndexedDB not supported, falling back to memory FS for ${mountPath}`);
          fsType = 'memory';
        }
      }

      let fsInstance;
      switch (fsType) {
        case 'memory':
          consoleDotLog$2('Creating MemoryFS instance');
          const { MemoryFS } = await import('./assets/memoryFs-VAT3s8Qe.js');
          fsInstance = new MemoryFS(mountPath, { ...options, useSW: false });
          break;
        case 'idb':
          consoleDotLog$2('Creating IDBFs instance');
          const { IDBFs } = await import('./assets/IDBFs-DaKLHPir.js');
          fsInstance = new IDBFs(mountPath, { ...options, useSW });
          break;
        default:
          throw new Error(`Unknown FS type: ${fsType}`);
      }

      return fsInstance;
    } catch (error) {
      consoleDotError$2(`Failed to create FS instance`, error);
      throw error;
    }
  }

  async ensureFSInitialized(fsPath) {
    consoleDotLog$2(`Ensuring FS is initialized for path: ${fsPath}`);
    if (this.initializedMounts.has(fsPath)) {
      consoleDotLog$2(`FS already initialized for path: ${fsPath}`);
      return true;
    }
    
    const mountData = this.mounts[fsPath];
    if (!mountData) {
      const errorMsg = `Mount not found: ${fsPath}`;
      consoleDotError$2(errorMsg);
      throw new Error(errorMsg);
    }
    
    if (!mountData.fsInstance) {
      consoleDotLog$2(`Creating new FS instance for mount at ${fsPath}`);
      mountData.fsInstance = await this.createFSInstance(
        mountData.fsType, 
        fsPath, 
        { 
          versioning: this.getVersioningConfig(mountData),
          merging: this.getMergingConfig(mountData)
        }
      );
    }
    
    consoleDotLog$2(`Fetching data for mount at ${fsPath}`);
    await this.fetchFS(
      mountData.fetchMethod, 
      mountData.fsType, 
      mountData.fsInstance, 
      fsPath, 
      mountData.fetchInfo
    );
    
    this.initializedMounts.add(fsPath);
    consoleDotLog$2(`Successfully initialized FS for path: ${fsPath}`);
    return true;
  }

  // Mount/Unmount Operations
  async mount(path, fsType, fsName, fetchMethod, options = {}) {
    consoleDotLog$2(`Mounting filesystem - path: ${path}, type: ${fsType}, name: ${fsName}, method: ${fetchMethod}, options: ${JSON.stringify(options)}`);
    try {
      const fetchInfo = options.fetchInfo || {};
      const versioning = this.getVersioningConfig(options);
      const merging = this.getMergingConfig(options);
      
      const normalizedPath = path.endsWith('/') ? path : `${path}/`;
      const mountPath = `${normalizedPath}${fsName}`;
      consoleDotLog$2(`Normalized mount path: ${mountPath}`);
      
      if (this.mounts[mountPath]) {
        const errorMsg = `Path ${mountPath} is already mounted`;
        consoleDotError$2(errorMsg);
        throw new Error(errorMsg);
      }

      this.currentMountPath = mountPath;
      consoleDotLog$2(`Checking storage for existing mount at ${mountPath}`);
      const storedMount = await this.loadMountFromStorage(mountPath);

      if (storedMount) {
        consoleDotLog$2(`Found stored mount, initializing existing mount at ${mountPath}`);
        return this.initializeStoredMount(mountPath, storedMount, fetchMethod, fetchInfo, { versioning, merging });
      }

      consoleDotLog$2(`No stored mount found, creating new mount at ${mountPath}`);
      return this.createNewMount(mountPath, fsType, fsName, fetchMethod, fetchInfo, versioning, merging);
    } catch (error) {
      consoleDotError$2('Mount operation failed:', error);
      throw error;
    }
  }

  async retrieveAndMountFromFsTable() {
    consoleDotLog$2('Attempting to retrieve and mount filesystems from fsTable');
    try {
      if (typeof indexedDB === 'undefined') {
        consoleDotLog$2('IndexedDB not available (Node.js environment). Skipping mount from fsTable.');
        return false;
      }

      try {
        const hasData = await this.storageUtils.ensureObjectStoreExists();
        if (!hasData) {
          consoleDotLog$2('No storage data found - fresh initialization');
          return false;
        }
      } catch (e) {
        consoleDotError$2('error: ', e);
      }
  
      const allMounts = await this.storageUtils.getAll();
      consoleDotLog$2('Retrieved all mounts from storage:', allMounts);
      if (!allMounts || Object.keys(allMounts).length === 0) {
        consoleDotLog$2('No stored mounts found in fsTable');
        return false;
      }
  
      consoleDotLog$2(`Found ${Object.keys(allMounts).length} stored mounts`);
      
   
      for (const mountPath in allMounts) {
        const mountData = allMounts[mountPath];
        if (!mountData) continue;

        consoleDotLog$2(`Processing mount at ${mountPath} from fsTable`);
        
        try {
          const lastSlashIndex = mountPath.lastIndexOf('/');
          const path = mountPath.substring(0, lastSlashIndex);
          const fsName = mountPath.substring(lastSlashIndex + 1);

          await this.mount(
            path,
            mountData.fsType,
            fsName,
            mountData.fetchMethod,
            {
              fetchInfo: mountData.fetchInfo,
              versioning: mountData.versioning,
              merging: mountData.merging
            }
          );
          
          consoleDotLog$2(`Successfully mounted ${mountPath} from fsTable`);
        } catch (mountError) {
          consoleDotError$2(`Failed to mount ${mountPath} from fsTable:`, mountError);
        }
      }
      
      consoleDotLog$2('Finished mounting all filesystems from fsTable');
      return true;
        
    } catch (error) {
      consoleDotError$2('Failed to retrieve and mount:', error);
      return false;
    }
  }

  async initializeStoredMount(mountPath, storedMount, fetchMethod, fetchInfo, options) {
    consoleDotLog$2(`Initializing stored mount at ${mountPath}`);
    try {
      consoleDotLog$2(`Creating FS instance for stored mount (type: ${storedMount.fsType})`);
      const fsInstance = await this.createFSInstance(
        storedMount.fsType,
        mountPath,
        { 
          versioning: this.getVersioningConfig(storedMount),
          merging: this.getMergingConfig(storedMount)
        }
      );

      consoleDotLog$2(`Fetching data for stored mount using method: ${storedMount.fetchMethod || fetchMethod}`);
      await this.fetchFS(
        storedMount.fetchMethod || fetchMethod,
        storedMount.fsType,
        fsInstance,
        mountPath,
        storedMount.fetchInfo || fetchInfo
      );

      // Update environment info and access log
      const environment = this.getPlatformInfo();
      const accessLog = storedMount.accessLog || [];
      accessLog.push({
        time: new Date().toISOString(),
        action: 'remount',
        environment: environment
      });

      this.mounts[mountPath] = {
        ...storedMount,
        fsInstance,
        fetchMethod: storedMount.fetchMethod || fetchMethod,
        fetchInfo: {
          ...(storedMount.fetchInfo || fetchInfo),
          lastFetched: new Date().toISOString()
        },
        versioning: this.getVersioningConfig(storedMount),
        merging: this.getMergingConfig(storedMount),
        environment, // Update environment info
        modified: new Date().toISOString(),
        accessLog
      };      

      this.initializedMounts.add(mountPath);
      consoleDotLog$2(`Successfully initialized stored mount at ${mountPath}`);
      return this.mounts[mountPath];
    } catch (error) {
      consoleDotError$2(`Failed to initialize stored mount at ${mountPath}:`, error);
      throw error;
    }
  }

  async createNewMount(mountPath, fsType, fsName, fetchMethod, fetchInfo, versioning = {}, merging = {}) {
    consoleDotLog$2(`Creating new mount at ${mountPath}`);
    try {
        consoleDotLog$2(`Creating new FS instance (type: ${fsType})`);
        const fsInstance = await this.createFSInstance(fsType, mountPath, { versioning, merging });
        
        consoleDotLog$2(`Fetching data for new mount using method: ${fetchMethod}`);
        await this.fetchFS(fetchMethod, fsType, fsInstance, mountPath, fetchInfo);

        // Get the VFSutils instance that was created in fetchFS
        const vfsUtils = this.vfsUtilsInstances.get(mountPath);
        if (!vfsUtils) {
            throw new Error('VFSutils instance not found for mount');
        }

        consoleDotLog$2('Generating filesystem table');
        const fsTable = await vfsUtils.generateFsTable();  // Use the instance from the Map
        const fsSize = await vfsUtils.getFsTableSize(fsTable);
        consoleDotLog$2(`Filesystem table generated, size: ${fsSize}`);

      // Get environment information
      const environment = this.getPlatformInfo();
      
      const mountData = {
        fsInstance,
        fsType: fsInstance instanceof MemoryFS ? 'memory' : fsType,
        fsName,
        fsTable,
        fetchMethod,
        fetchInfo: {
          ...fetchInfo,
          time: new Date().toISOString(),
          size: fsSize,
          lastFetched: new Date().toISOString()
        },
        versioning: this.getVersioningConfig({ versioning }),
        merging: this.getMergingConfig({ merging }),
        environment, // Add environment info
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        accessLog: [{
          time: new Date().toISOString(),
          action: 'mount',
          environment: environment
        }]
      };
      
      this.mounts[mountPath] = mountData;
      consoleDotLog$2(`Persisting mount data for ${mountPath}`);
      await this.persistMountData(mountPath, mountData);
      
      this.initializedMounts.add(mountPath);
      consoleDotLog$2(`Successfully mounted new filesystem at ${mountPath}`);
      return mountData;
    } catch (error) {
      consoleDotError$2(`Failed to create new mount at ${mountPath}:`, error);
      throw error;
    }
  }

  async getMountPaths() {
    return Object.keys(this.mounts);
  }

  async getMountInfo(mountPath) {
    if (!this.mounts[mountPath]) {
      const errorMsg = `Mount not found: ${mountPath}`;
      consoleDotError$2(errorMsg);
      throw new Error(errorMsg);
    }
    
    const mountData = this.mounts[mountPath];
    return {
      path: mountPath,
      type: mountData.fsType,
      name: mountData.fsName,
      fetchMethod: mountData.fetchMethod,
      versioning: mountData.versioning,
      merging: mountData.merging,
      created: mountData.created,
      modified: mountData.modified,
      lastFetched: mountData.fetchInfo.lastFetched,
      size: mountData.fetchInfo.size,
      environment: mountData.environment,
      accessLog: mountData.accessLog
    };
  }

  async unmount(path, fsName) {
    const fsPath = path + '/' + fsName;
    consoleDotLog$2(`Unmounting filesystem at ${fsPath}`);
    
    if (!this.mounts[fsPath]) {
      const errorMsg = `Path ${fsPath} is not mounted`;
      consoleDotError$2(errorMsg);
      throw new Error(errorMsg);
    }
  
    const mountData = this.mounts[fsPath];
  
    try {
      // Clean up VFSutils instance if it exists
      if (this.vfsUtilsInstances.has(fsPath)) {
        consoleDotLog$2(`Terminating VFSutils instance for ${fsPath}`);
        await this.vfsUtilsInstances.get(fsPath).terminate(mountData.fsName, mountData.fsType);
        this.vfsUtilsInstances.delete(fsPath);
      }
  
      if (this.mounts[fsPath].fsInstance) {
        consoleDotLog$2(`Closing all files for mount at ${fsPath}`);
        await this.mounts[fsPath].fsInstance.fs_fcloseall();
        this.mounts[fsPath].fsInstance = null;
      }
  
      delete this.mounts[fsPath];
      this.initializedMounts.delete(fsPath);
  
      this.storageUtils.remove(fsPath);
      consoleDotLog$2(`Successfully unmounted ${fsPath}`);
      return true;
    } catch (error) {
      consoleDotError$2(`Error unmounting ${fsPath}:`, error);
      throw error;
    }
  }

  // Filesystem Operations
  async fetchFS(fetchMethod, fsType, fsInstance, fsName, fetchInfo) {
    consoleDotLog$2(`Fetching filesystem data - method: ${fetchMethod}`);
    try {
      // Cleanup previous instance logic...
      if (this.vfsUtilsInstances.has(this.currentMountPath)) {
        await this.vfsUtilsInstances.get(this.currentMountPath).terminate();
        this.vfsUtilsInstances.delete(this.currentMountPath);
      }
  
      // ═══════════════════════════════════════════════════════
      // ✅ GLOBAL FIX: Sanitize URL at the entry point
      // ═══════════════════════════════════════════════════════
      if (fetchInfo && fetchInfo.url) {
        let url = fetchInfo.url;
        
        // 1. Fix Double Slash (//) caused by protocol stripping
        if (url.startsWith('//')) {
          url = 'http:' + url; 
          consoleDotLog$2(`[VFS FIX] URL started with //, converted to: ${url}`);
        }
        
        // 2. (Optional) Force HTTP if you are using a local HTTP proxy
        // if (url.startsWith('https://')) {
        //    url = url.replace('https://', 'http://');
        // }
        
        fetchInfo.url = url;
      }
      // ═══════════════════════════════════════════════════════
  
      consoleDotLog$2('Creating new VFSutils instance for mount:', this.currentMountPath);
      const vfsUtils = new VFSutils(fsType, fsInstance, fsName, fetchInfo);
      this.vfsUtilsInstances.set(this.currentMountPath, vfsUtils);
      
      // ... rest of the function remains the same
      const fetchStrategies = {
        git: () => vfsUtils.fetchFromGit(),
        disk: () => vfsUtils.fetchFromDisk(),
        googleDrive: () => vfsUtils.fetchFromGoogleDrive()
      };
  
      const strategy = fetchStrategies[fetchMethod];
      if (!strategy) {
        const errorMsg = `Unknown fetch method: ${fetchMethod}`;
        consoleDotError$2(errorMsg);
        throw new Error(errorMsg);
      }
  
      consoleDotLog$2(`Executing fetch strategy for ${fetchMethod}`);
      await strategy();
      
      // Update timestamps...
      if (this.mounts[this.currentMountPath]) {
        this.mounts[this.currentMountPath].fetchInfo.lastFetched = new Date().toISOString();
        this.mounts[this.currentMountPath].modified = new Date().toISOString();
        await this.persistMountData(this.currentMountPath, this.mounts[this.currentMountPath]);
      }
      
    } catch (error) {
      consoleDotError$2(`Fetch operation failed:`, error);
      // Cleanup logic...
      if (this.vfsUtilsInstances.has(this.currentMountPath)) {
        await this.vfsUtilsInstances.get(this.currentMountPath).terminate(fsName, fsType);
        this.vfsUtilsInstances.delete(this.currentMountPath);
      }
      throw error;
    }
  }

  async resolveFS(path) {
    consoleDotLog$2(`Resolving filesystem for path: ${path}`);
    try {
      for (const mountPath in this.mounts) {
        if (path.startsWith(mountPath)) {
          consoleDotLog$2(`Found matching mount at `, mountPath);
          await this.ensureFSInitialized(mountPath);
          const relativePath = path.slice(mountPath.length) || "/";
          consoleDotLog$2(`Resolved path: ${path} to mount: ${mountPath}, relative path: ${relativePath}, this.mounts[mountPath] : `, this.mounts[mountPath]);
          consoleDotLog$2('resolveFs returned value: ', 
            {            
            fs: this.mounts[mountPath],
            relativePath: relativePath,
            versioning: this.mounts[mountPath].versioning || config$3.versioning,
            merging: this.mounts[mountPath].merging || config$3.merging
          });

          return {
            fs: this.mounts[mountPath],
            relativePath: relativePath,
            versioning: this.mounts[mountPath].versioning || config$3.versioning,
            merging: this.mounts[mountPath].merging || config$3.merging
          };
        }
      }
      const errorMsg = `No filesystem mounted for path: ${path}`;
      consoleDotError$2(errorMsg);
      throw new Error(errorMsg);
    } catch (error) {
      consoleDotError$2(`Failed to resolve filesystem for path ${path}:`, error);
      throw error;
    }
  }

  // Filesystem Table Operations
  async writeToFsTable(path, type = "file", size = 0) {
    consoleDotLog$2(`Writing to fsTable - path: ${path}, type: ${type}, size: ${size}`);
    await this.validateVFSutils();
    
    try {
      const vfsUtils = this.vfsUtilsInstances.get(this.currentMountPath);
      consoleDotLog$2(`Updating fsTable with create operation for ${path}`);
      const updateResult = await vfsUtils.updateFsTable("create", path, type, size);
      consoleDotLog$2(`Updating mount fsTable with new data`);
      await this.updateMountFsTable(updateResult.fsTable);
      consoleDotLog$2(`Successfully updated fsTable for ${path}`);
      return updateResult.fsTable;
    } catch (error) {
      consoleDotError$2('Failed to write to fsTable:', error);
      throw error;
    }
  }
  
  async removeFromFsTable(path) {
    consoleDotLog$2(`Removing from fsTable - path: ${path}`);
    await this.validateVFSutils();
    
    try {
      const vfsUtils = this.vfsUtilsInstances.get(this.currentMountPath);
      consoleDotLog$2(`Updating fsTable with remove operation for ${path}`);
      const updateResult = await vfsUtils.updateFsTable("remove", path);
      consoleDotLog$2(`Updating mount fsTable with removal data`);
      await this.updateMountFsTable(updateResult.fsTable);
      consoleDotLog$2(`Successfully removed ${path} from fsTable`);
      return updateResult.fsTable;
    } catch (error) {
      consoleDotError$2('Failed to remove from fsTable:', error);
      throw error;
    }
  }

  async updateMountFsTable(fsTable) {
    consoleDotLog$2(`Updating mount fsTable for current mount path`);
    if (!this.currentMountPath) {
      const errorMsg = 'No active mount path available';
      consoleDotError$2(errorMsg);
      throw new Error(errorMsg);
    }

    // FIX: In Node.js, update the in-memory object directly
    if (typeof indexedDB === 'undefined') {
       if (!this.mounts[this.currentMountPath]) {
          const errorMsg = `Mount data not found in memory for path: ${this.currentMountPath}`;
          consoleDotError$2(errorMsg);
          throw new Error(errorMsg);
       }
       this.mounts[this.currentMountPath].fsTable = fsTable;
       consoleDotLog$2(`Updated in-memory fsTable for ${this.currentMountPath}`);
       return;
    }

    // Browser logic
    consoleDotLog$2(`Loading mount data for ${this.currentMountPath}`);
    const mountData = await this.storageUtils.get(this.currentMountPath);
    if (!mountData) {
      const errorMsg = `Mount data not found for path: ${this.currentMountPath}`;
      consoleDotError$2(errorMsg);
      throw new Error(errorMsg);
    }

    consoleDotLog$2(`Updating fsTable in mount data`);
    mountData.fsTable = fsTable;
    consoleDotLog$2(`Storing updated mount data for ${this.currentMountPath}`);
    await this.storageUtils.store(this.currentMountPath, mountData);
    consoleDotLog$2(`Successfully updated mount fsTable`);
  }

  // Validation Utilities
  async validateVFSutils() {
    consoleDotLog$2('Validating VFSutils instance');
    if (!this.currentMountPath || !this.vfsUtilsInstances.has(this.currentMountPath)) {
      const errorMsg = "VFSutils not initialized for current mount";
      consoleDotError$2(errorMsg);
      throw new Error(errorMsg);
    }
    consoleDotLog$2('VFSutils validation passed');
  }
 
  //----------------------
  // Versioning Operations
  //----------------------

 
  async versioner(message) {
    consoleDotLog$2(`Committing version with message: ${message}`);
    await this.validateVFSutils();
    
    try {
      const vfsUtils = this.vfsUtilsInstances.get(this.currentMountPath);
      const commitResult = await vfsUtils.commitStagedChanges(message);
      consoleDotLog$2(`Version committed successfully`);
      return commitResult;
    } catch (error) {
      consoleDotError$2('Failed to commit version:', error);
      throw error;
    }
  }
  
  //--------------------
  // Merging Operations
  //--------------------

  
  async merger(onConflictStrategy) {
    consoleDotLog$2('Starting merge operation');
    await this.validateVFSutils();
    const syncUrl = this.mounts[this.currentMountPath]?.merging?.syncUrl;
    try {
      const vfsUtils = this.vfsUtilsInstances.get(this.currentMountPath);
      const mergeResult = await vfsUtils.autoSyncFlow(onConflictStrategy, syncUrl);
      consoleDotLog$2('Merge operation completed successfully:', mergeResult);
      return mergeResult;
    } catch (error) {
      consoleDotError$2('Merge operation failed:', error);
      throw error;
    }
  }

  
  //-------------------
  // Some info setters for vfsUtils
  //-------------------

  async setMergingStrategy(mergingStrategy) {
    consoleDotLog$2('Setting merging strategy');
    let mountData = this.mounts[this.currentMountPath];
    mountData = {...mountData, merging: mergingStrategy};
    await this.persistMountData(this.currentMountPath, mountData);
    consoleDotLog$2('Merging strategy set successfully:', mergingStrategy);
    return true;
  }

  async setVersioingStrategy(versioningStrategy) {
    consoleDotLog$2('Setting versioning strategy');
    let mountData = this.mounts[this.currentMountPath];
    mountData = {...mountData, versioning: versioningStrategy};
    await this.persistMountData(this.currentMountPath, mountData);
    consoleDotLog$2('Versioning strategy set successfully:', versioningStrategy);
    return true;
  }

  async setUserConfigs(args) {
    await this.validateVFSutils();
    consoleDotLog$2('Setting user configurations:', args);
    const vfsUtils = this.vfsUtilsInstances.get(this.currentMountPath);
    await vfsUtils.updateFetchInfo(args);
    let mountData = this.mounts[this.currentMountPath];
    mountData = { ...mountData, fetchInfo: { ...mountData.fetchInfo, ...args } };
    this.persistMountData(this.currentMountPath, mountData);
    return args;
  }
}

const config$2 = await getConfig();
const logger$1 = new Logger(config$2.logging.kfs);

function consoleDotLog$1(...params) {
  logger$1.consoleDotLog('[Versioning]', ...params);
}

function consoleDotError$1(...params) {
  logger$1.consoleDotError('[Versioning]', ...params);
}

class VersioningManager {
  constructor(vfs) {
    this.vfs = vfs;
    this.clockIntervalID = null;
    this.operationQueueCount = 0;
    this.config = this._getDefaultVersioningConfig();
  }

  _getDefaultVersioningConfig() {
    const versioning = config$2.versioning || {};
    return {
      strategy: versioning.strategy,
      interval: versioning.interval,
      number: versioning.number,
    };
  }

  async _getVersioningConfig(options = {}) {
    const defaultConfig = this._getDefaultVersioningConfig();
    const versioning = options.versioning || {};
    return {
      strategy: versioning.strategy || defaultConfig.strategy,
      interval: versioning.interval || defaultConfig.interval,
      number: versioning.number || defaultConfig.number,
    };
  }

  async setup(options = {}) {
    this.config = await this._getVersioningConfig(options);
    consoleDotLog$1('Versioning configuration:', this.config);

    if (this.config.strategy === 'clock') {
      this._startClockVersioning();
    } else {
      this.clearClock();
    }
  }

  clearClock() {
    if (this.clockIntervalID) {
      clearInterval(this.clockIntervalID);
      this.clockIntervalID = null;
    }
  }

  _startClockVersioning() {
    this.clearClock();
    const intervalMs = (this.config.interval || 10) * 1000;
    consoleDotLog$1('Starting clock-based versioning with interval:', intervalMs, 'ms');

    this.clockIntervalID = setInterval(async () => {
      consoleDotLog$1('Clock-based auto commit triggered');
      try {
        await this.vfs.versioner('Clock-based auto commit');
      } catch (error) {
        consoleDotError$1('Error in clock-based versioning:', error);
      }
    }, intervalMs);
  }

  async maybeTriggerVersioning(overrideConfig = null) {
    const strategyConfig = overrideConfig || this.config;
    if (strategyConfig.strategy === 'immediate') return;

    if (strategyConfig.strategy === 'batch') {
      this.operationQueueCount++;
      const batchSize = strategyConfig.number || 5;
      consoleDotLog$1(`Batch operation count: ${this.operationQueueCount}/${batchSize}`);

      if (this.operationQueueCount >= batchSize) {
        this.operationQueueCount = 0;
        await this.vfs.versioner(`Batch commit after ${batchSize} operations`);
      }
    }
  }

  async getConfig() {
    return this.config;
  }
}

const config$1 = await getConfig();
new Logger(config$1.logging.kfs);

class MergingManager {
    constructor(vfs) {
      this.vfs = vfs;
      this.clockIntervalID = null;
      this.config = this._getDefaultMergingConfig();
    }
  
    _getDefaultMergingConfig() {
      return {
        strategy: config$1.merging?.strategy || null,
        interval: config$1.merging?.interval || 10,
        number: config$1.merging?.number || 5
      };
    }
  
    async setup(options = {}) {
        this.config = {
          ...this._getDefaultMergingConfig(),
          ...(options.merging || {})
        };
      
        if (this.config.strategy === 'clock') {
          await this._startClockMerging(); // Now async
        } else {
          this.clearClock();
        }
      }
      
      async _startClockMerging() {
        this.clearClock();
        const intervalMs = this.config.interval * 1000;
        this.clockIntervalID = setInterval(async () => {
          try {
            await this.vfs.merger();
          } catch (error) {
            console.error('Clock-based merge failed:', error);
          }
        }, intervalMs);
      }

    clearClock() {
      if (this.clockIntervalID) {
        clearInterval(this.clockIntervalID);
        this.clockIntervalID = null;
      }
    }

    async getConfig() {
        return this.config;
      }
  }

const config = await getConfig();
const logger = new Logger(config.logging.kfs);

function consoleDotLog(...params) {
  logger.consoleDotLog('[KFS]', ...params);
}

function consoleDotError(...params) {
  logger.consoleDotError('[KFS]', ...params);
}

class KFS {
  constructor() {
    this.vfs = new VFS();
    this.fsInstance = null;
    this.versioningManager = new VersioningManager(this.vfs);
    this.mergingManager = new MergingManager(this.vfs);    
    this.commitCount = 0;
    this.mountPaths = null;
    this.mergingConfig = null;
    (async () => {
      try {
        await this.init();
      } catch (error) {
        consoleDotError('Initing Failed for KFS: ', error);
      }
    })();
    consoleDotLog('KFS instance created');
  }
  
  async init() {
    if (!this.initialized) {
      this.mountPaths = await this.vfs.getMountPaths();
      this.initialized = true;
    }
    consoleDotLog('mountpaths: ', this.mountPaths);
    return this;
  }

  // -------------------------------
  // Versioning Configuration
  // -------------------------------
  
  _setupVersioningAndMerging(options) {
    this.versioningManager.setup(options);
    this.mergingManager.setup(options);
  }
  
  _clearClocks() {
    this.versioningManager.clearClock();
    this.mergingManager.clearClock();
  }
  
  async _handleCommit(message) {
    await this.versioningManager.getConfig();
    this.mergingConfig = await this.mergingManager.getConfig();
    const strategyMap = { remote: 'theirs', local: 'ours', combine: 'combine' };
    const userStrategy = this.mergingConfig?.onConflictStrategy || 'remote';
    const onConflictStrategy = strategyMap[userStrategy] || 'remote';

    await this.vfs.versioner(message);
    this.commitCount++;
    
    if (this.mergingConfig?.strategy === 'immediate') {
      await this.vfs.merger(onConflictStrategy);
    }
  }
  
  async merge() {
    try {
      consoleDotLog('Merging...', this.mountPaths);

      const strategyMap = { remote: 'theirs', local: 'ours', combine: 'combine' };
      const userStrategy = this.mergingConfig?.onConflictStrategy || 'remote';
      const onConflictStrategy = strategyMap[userStrategy] || 'remote';

      consoleDotLog('Merging...', this.mountPaths);
      await this.vfs.merger(onConflictStrategy);
      consoleDotLog('Merge completed successfully.');
    } catch(error) {
      consoleDotError('Merge failed:', error);
      throw new Error(`Failed to merge: ${error.message}`);
    }
  }
  
  // -------------------------------
  // Filesystem Operations
  // -------------------------------

  async mount(path, fsType, fsName, fetchMethod, options = {}) {
    try {
      this._setupVersioningAndMerging(options);
      path = this._normalizePath(path);
      const versioningConfig = await this.versioningManager.getConfig();
      this.mergingConfig = await this.mergingManager.getConfig();
      
      const mountData = await this.vfs.mount(path, fsType, fsName, fetchMethod, {
        ...options,
        versioning: versioningConfig,
        merging: this.mergingConfig
      });
      this.mergingConfig = mountData.merging;

      this.fsInstance = mountData.fsInstance;
      const root = await this.read(`${path}/${fsName}`);
      this.mountPaths = await this.vfs.getMountPaths();
      consoleDotLog('Mount successful, root:', root);
      return mountData;
    } catch (error) {
      consoleDotError(`Failed to mount filesystem at ${path}:`, error);
      throw new Error(`Failed to mount filesystem: ${error.message}`);
    }
  }

  async unmount(path, fsName) {
    try {
      path = this._normalizePath(path);
      await this.vfs.unmount(path, fsName);
      this.fsInstance = null;
      this._clearClocks();
      this.commitCount = 0;
      return { success: true };
    } catch (error) {
      consoleDotError(`Failed to unmount filesystem at ${path}:`, error);
      throw new Error(`Failed to unmount filesystem: ${error.message}`);
    }
  }


  async setMergingStrategy(mergingStrategy) {
    await this.vfs.setMergingStrategy(mergingStrategy);
    consoleDotLog('Merging strategy set to:', mergingStrategy);
  }

  async setVersioingStrategy(versioningStrategy) {
    await this.vfs.setVersioingStrategy(versioningStrategy);
    consoleDotLog('Versioning strategy set to:', versioningStrategy);
  }

  /**
   * Sets user configurations for the KFS instance.
    * @param {string} [args.name] - The name of the user.
    * @param {string} [args.email] - The email of the user.
    * @param {string} [args.username] - The username of the user.
    * @param {string} [args.password] - The password of the user.
    * @throws {Error} - Throws an error if the arguments are invalid or if the operation fails.
   */
  async setUserConfigs(args) {
    if (!args || typeof args !== 'object') {
      throw new Error('Invalid arguments: must be an object');
    }
    const allowedFields = ['password', 'username', 'email', 'name'];
    const invalidFields = Object.keys(args).filter(
      field => !allowedFields.includes(field)
    );
  
    if (invalidFields.length > 0) {
      throw new Error(
        `Invalid field(s) provided: ${invalidFields.join(', ')}. ` +
        `Allowed fields are: ${allowedFields.join(', ')}`
      );
    }
    
    args && this.vfs.setUserConfigs(args);
    return args;
  }

  async create(path, type = 'file', content = '', mode = 'w') {
    try {
      if (!['file', 'dir'].includes(type)) {
        throw new Error(`Invalid type: ${type}. Must be 'file' or 'dir'`);
      }
      if (!['a', 'w'].includes(mode)) {
        throw new Error(`Invalid mode: ${mode}. Must be 'a' (append) or 'w' (write)`);
      }
  
      path = this._normalizePath(path);

      if (this.mountPaths && this.mountPaths.includes(path)) {
        throw new Error(`Cannot write directly to mount path (${path}). Use mount() instead.`);
      }


      const { fs, relativePath, versioning } = await this.vfs.resolveFS(path);
  
      if (type === 'file') {
        await this._ensurePathExists(fs, relativePath);
        
        let finalContent = content;
        let operationMessage = `Created file at ${path}`;
        
        if (mode === 'a') {
          try {
            // Try to read existing content
            const fd = await fs.fsInstance.fs_fopen(relativePath, 'r');
            const existingContent = await fs.fsInstance.fs_fread(fd, 1024*1024); // Read up to 1MB
            await fs.fsInstance.fs_fclose(fd);
            
            finalContent = existingContent + content;
            operationMessage = `Appended to file at ${path}`;
          } catch (readError) {
            // File doesn't exist yet, proceed with normal creation
            operationMessage = `Created file at ${path}`;
          }
        }
  
        const fd = await fs.fsInstance.fs_fopen(relativePath, 'w'); // Always use 'w' here since we've handled append logic
        const writeResult = await fs.fsInstance.fs_fwrite(fd, finalContent);
        if (writeResult === -1) {
          throw new Error('Failed to write to file');
        }
        
        await fs.fsInstance.fs_fclose(fd);
  
        await this.vfs.writeToFsTable(relativePath, type, finalContent.length);
  
        if (versioning?.strategy === 'immediate') {
          await this._handleCommit(operationMessage);
        } else {
          await this.versioningManager.maybeTriggerVersioning(versioning);
        }
      } else if (type === 'dir') {
        if (mode === 'a') {
          // For directories, 'a' mode means don't throw if already exists
          try {
            await fs.fsInstance.fs_mkdir(relativePath);
            await this.vfs.writeToFsTable(relativePath, type, 0);
            
            if (versioning?.strategy === 'immediate') {
              await this._handleCommit(`Created directory at ${path}`);
            }
          } catch (error) {
            if (!error.message.includes('exists')) throw error;
            // Directory already exists - no action needed for append mode
          }
        } else { // mode === 'w'
          // For 'w' mode, try to remove existing first (like truncate for files)
          try {
            const stats = await fs.fsInstance.fs_stat(relativePath);
            if (await stats.isDirectory()) {
              await fs.fsInstance.fs_rmdir(relativePath);
            } else {
              await fs.fsInstance.fs_remove(relativePath);
            }
          } catch (error) {
            // Doesn't exist - that's fine
          }
          
          await fs.fsInstance.fs_mkdir(relativePath);
          await this.vfs.writeToFsTable(relativePath, type, 0);
          
          if (versioning?.strategy === 'immediate') {
            await this._handleCommit(`Created directory at ${path}`);
          }
        }
      }
  
      return { success: true };
    } catch (error) {
      consoleDotError(`Failed to create ${type} at ${path}:`, error);
      throw new Error(`Failed to create: ${error.message}`);
    }
  }

  async remove(path) {
    try {
      path = this._normalizePath(path);

      if (this.mountPaths && this.mountPaths.includes(path)) {
        throw new Error(`Cannot remove path (${path}) directly. Use unmount() instead.`);
      }
      const { fs, relativePath, versioning } = await this.vfs.resolveFS(path);

      const stats = await fs.fsInstance.fs_stat(relativePath);
      if (!stats) throw new Error('ENOENT: no such file or directory');

      if (await stats.isDirectory()) {
        await fs.fsInstance.fs_rmdir(relativePath);
      } else {
        await fs.fsInstance.fs_remove(relativePath);
      }

      await this.vfs.removeFromFsTable(relativePath);

      if (versioning?.strategy === 'immediate') {
        await this._handleCommit(`Removed ${path}`);
      } else {
        await this.versioningManager.maybeTriggerVersioning(versioning);
      }

      return { success: true };
    } catch (error) {
      consoleDotError(`Failed to remove ${path}:`, error);
      throw new Error(`Failed to remove: ${error.message}`);
    }
  }

  async read(path) {
    try {
      path = this._normalizePath(path);
      const { fs, relativePath } = await this.vfs.resolveFS(path);
      this.fsInstance = fs.fsInstance;

      const stats = await this.fsInstance.fs_stat(relativePath);
      if (!stats) throw new Error('ENOENT: no such file or directory');

      if (await stats.isDirectory()) {
        const result = await this.fsInstance.fs_readdir(relativePath);
        consoleDotLog('result', result);
        return result;
      } else {
        const fd = await this.fsInstance.fs_fopen(relativePath, 'r');
        const data = await this.fsInstance.fs_fread(fd, 1024*1024);
        await this.fsInstance.fs_fclose(fd);
        return data;
      }
    } catch (error) {
      throw new Error(`Failed to read file: ${error.message}`);
    }
  }

  // -------------------------------
  // Utility Methods
  // -------------------------------
  async _ensurePathExists(fs, path) {
    const parts = path.split('/').filter(p => p !== '');
    
    const dirParts = parts.slice(0, -1);
    let currentPath = '';
    
    for (const part of dirParts) {
        currentPath = currentPath ? `${currentPath}/${part}` : `/${part}`;
        try {
            await fs.fsInstance.fs_mkdir(currentPath);
            await this.vfs.writeToFsTable(currentPath, 'dir');
        } catch (error) {
            if (!error.message.includes('exists')) consoleDotError(error);
        }
    }
  }

  _normalizePath(path) {
    if (typeof path !== 'string') throw new Error('Path must be a string');
    return path.startsWith('/') ? path : `/${path}`;
  }

  // Config functions
  async setConfig(config) {
    return configStore.setConfig(config)
  }
}

export { KFS };
//# sourceMappingURL=kfs.js.map
