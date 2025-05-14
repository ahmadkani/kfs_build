import { MemoryFS } from './memoryFs.js';
import { IDBFs } from './IDBFs.js';
import { VFSutils } from "./libs/vfsUtils/VFSUtils.js";
import { Logger } from "./libs/LoggerES6.js";
import { StorageUtils } from './libs/vfsUtils/storageUtils.js';
import { checkIndexedDBSupport } from './libs/vfsUtils/supportChecker.js';
import { config } from './configES6.js';

const logger = new Logger(config.logging.vfs);

// Logger Utilities
function consoleDotLog(...parameters) {
  logger.consoleDotLog('[VFS] ', ...parameters);
}

function consoleDotError(...parameters) {
  logger.consoleDotError('[VFS] ', ...parameters);
}

export class VFS {
  // Initialization and Core Setup
  constructor(storageName = "VFS_Mounts") {
    this.mounts = Object.create(null);
    this.initializedMounts = new Set();
    this.VFSutils = null;
    this.storageUtils = new StorageUtils(storageName);
    this.currentMountPath = '';
    this.idbSupported = null;
    (async () => {
      try {
        await this.retrieveAndMountFromFsTable();
      } catch (error) {
        consoleDotError('Automatic mount from fsTable failed:', error);
      }
    })();
    consoleDotLog('VFS instance created');
  }

  // Environment detection utilities
  getBrowserInfo() {
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
    return {
      browser: this.getBrowserInfo(),
      device: this.getDeviceType(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language
    };
  }

  // Utility functions for versioning and merging
  getVersioningConfig(options = {}) {
    const versioning = options.versioning || config.versioning || {};
    return {
      strategy: versioning.strategy,
      interval: versioning.interval,
      number: versioning.number
    };
  }

  getMergingConfig(options = {}) {
    const merging = options.merging || config.merging || {};
    return {
      strategy: merging.strategy || 'none',
      conflictResolution: merging.conflictResolution || 'timestamp'
    };
  }

  // Storage and Support Checking
  async checkIndexedDBSupport() {
    consoleDotLog('Checking IndexedDB support...');
    if (this.idbSupported !== null) {
      return this.idbSupported; // Return cached result if available
    }
    
    try {
      await checkIndexedDBSupport();
      consoleDotLog('IndexedDB is supported');
      this.idbSupported = true;
      return true;
    } catch (error) {
      consoleDotError('IndexedDB not supported:', error);
      this.idbSupported = false;
      return false;
    }
  }

  async determineUseSW(fsType, options) {
    // If useSW is explicitly set in options, use that value
    if (options.useSW !== undefined) {
      return options.useSW;
    }
    
    // For IDB filesystem, check support and disable SW if not supported
    if (fsType === 'idb') {
      const isSupported = await this.checkIndexedDBSupport();
      return isSupported; // Only use SW if IDB is supported
    }
    
    // Default to false for memory filesystem
    return false;
  }

  async loadMountFromStorage(mountPath) {
    consoleDotLog(`Attempting to load mount from storage: ${mountPath}`);
    try {
      const storedMount = await this.storageUtils.get(mountPath);
      if (storedMount) {
        consoleDotLog(`Successfully loaded mount from storage: ${mountPath}`);
        return storedMount;
      }
      consoleDotLog(`No mount found in storage for path: ${mountPath}`);
      return null;
    } catch (error) {
      consoleDotError(`Failed to load mount from storage (path: ${mountPath}):`, error);
      throw error;
    }
  }

  async persistMountData(mountPath, mountData) {
    consoleDotLog(`Persisting mount data for ${mountPath}`);
    try {
      const dataToStore = { ...mountData };
      delete dataToStore.fsInstance;
      await this.storageUtils.store(mountPath, dataToStore);
      consoleDotLog(`Successfully persisted mount data for ${mountPath}`);
    } catch (error) {
      consoleDotError(`Failed to persist mount data for ${mountPath}:`, error);
      throw error;
    }
  }

  // Filesystem Instance Management
  async createFSInstance(fsType, mountPath, options = {}) {
    consoleDotLog(`Creating FS instance of type ${fsType} for mount path ${mountPath}`);
    try {
      // Determine the actual useSW value based on filesystem type and support
      const useSW = await this.determineUseSW(fsType, options);
      
      if (fsType === 'idb') {
        consoleDotLog('Checking IndexedDB support for IDB FS');
        const isSupported = await this.checkIndexedDBSupport();
        if (!isSupported) {
          consoleDotLog(`IndexedDB not supported, falling back to memory FS for ${mountPath}`);
          fsType = 'memory';
        }
      }

      let fsInstance;
      switch (fsType) {
        case 'memory':
          consoleDotLog('Creating MemoryFS instance');
          fsInstance = new MemoryFS(mountPath, { ...options, useSW: false }); // Always disable SW for memory FS
          break;
        case 'idb':
          consoleDotLog('Creating IDBFs instance');
          fsInstance = new IDBFs(mountPath, { ...options, useSW });
          break;
        default:
          const errorMsg = `Unknown FS type: ${fsType}`;
          consoleDotError(errorMsg);
          throw new Error(errorMsg);
      }

      consoleDotLog(`Successfully created ${fsType} FS instance for ${mountPath}`);
      return fsInstance;
    } catch (error) {
      consoleDotError(`Failed to create FS instance (type: ${fsType}, path: ${mountPath}):`, error);
      throw error;
    }
  }

  async ensureFSInitialized(fsPath) {
    consoleDotLog(`Ensuring FS is initialized for path: ${fsPath}`);
    if (this.initializedMounts.has(fsPath)) {
      consoleDotLog(`FS already initialized for path: ${fsPath}`);
      return true;
    }
    
    const mountData = this.mounts[fsPath];
    if (!mountData) {
      const errorMsg = `Mount not found: ${fsPath}`;
      consoleDotError(errorMsg);
      throw new Error(errorMsg);
    }
    
    if (!mountData.fsInstance) {
      consoleDotLog(`Creating new FS instance for mount at ${fsPath}`);
      const useSW = await this.determineUseSW(mountData.fsType, mountData);
      mountData.fsInstance = await this.createFSInstance(
        mountData.fsType, 
        fsPath, 
        { 
          useSW, 
          versioning: this.getVersioningConfig(mountData),
          merging: this.getMergingConfig(mountData)
        }
      );
    }
    
    consoleDotLog(`Fetching data for mount at ${fsPath}`);
    await this.fetchFS(
      mountData.fetchMethod, 
      mountData.fsType, 
      mountData.fsInstance, 
      fsPath, 
      mountData.fetchInfo
    );
    
    this.initializedMounts.add(fsPath);
    consoleDotLog(`Successfully initialized FS for path: ${fsPath}`);
    return true;
  }

  // Mount/Unmount Operations
  async mount(path, fsType, fsName, fetchMethod, options = {}) {
    consoleDotLog(`Mounting filesystem - path: ${path}, type: ${fsType}, name: ${fsName}, method: ${fetchMethod}, options: ${JSON.stringify(options)}`);
    try {
      const fetchInfo = options.fetchInfo || {};
      const versioning = this.getVersioningConfig(options);
      const merging = this.getMergingConfig(options);
      
      const normalizedPath = path.endsWith('/') ? path : `${path}/`;
      const mountPath = `${normalizedPath}${fsName}`;
      consoleDotLog(`Normalized mount path: ${mountPath}`);
      
      if (this.mounts[mountPath]) {
        const errorMsg = `Path ${mountPath} is already mounted`;
        consoleDotError(errorMsg);
        throw new Error(errorMsg);
      }

      this.currentMountPath = mountPath;
      consoleDotLog(`Checking storage for existing mount at ${mountPath}`);
      const storedMount = await this.loadMountFromStorage(mountPath);

      if (storedMount) {
        consoleDotLog(`Found stored mount, initializing existing mount at ${mountPath}`);
        return this.initializeStoredMount(mountPath, storedMount, fetchMethod, fetchInfo, { versioning, merging });
      }

      consoleDotLog(`No stored mount found, creating new mount at ${mountPath}`);
      return this.createNewMount(mountPath, fsType, fsName, fetchMethod, fetchInfo, versioning, merging);
    } catch (error) {
      consoleDotError('Mount operation failed:', error);
      throw error;
    }
  }

  async retrieveAndMountFromFsTable() {
    consoleDotLog('Attempting to retrieve and mount filesystems from fsTable');
    try {
      // First check if we have any data at all
      const hasData = await this.storageUtils.ensureObjectStoreExists();
      if (!hasData) {
        consoleDotLog('No storage data found - fresh initialization');
        return false;
      }
  
      const allMounts = await this.storageUtils.getAll();
      consoleDotLog('Retrieved all mounts from storage:', allMounts);
      if (!allMounts || Object.keys(allMounts).length === 0) {
        consoleDotLog('No stored mounts found in fsTable');
        return false;
      }
  
      consoleDotLog(`Found ${Object.keys(allMounts).length} stored mounts`);
      
   
      for (const mountPath in allMounts) {
        const mountData = allMounts[mountPath];
        if (!mountData) continue;

        consoleDotLog(`Processing mount at ${mountPath} from fsTable`);
        
        try {
          const lastSlashIndex = mountPath.lastIndexOf('/');
          consoleDotLog(`Last slash index:`, lastSlashIndex);
          const path = mountPath.substring(0, lastSlashIndex);
          consoleDotLog('path kir: ', path)
          const fsName = mountPath.substring(lastSlashIndex + 1);
          consoleDotLog('fsname kir: ', fsName)

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
          
          consoleDotLog(`Successfully mounted ${mountPath} from fsTable`);
        } catch (mountError) {
          consoleDotError(`Failed to mount ${mountPath} from fsTable:`, mountError);
        }
      }
      
      consoleDotLog('Finished mounting all filesystems from fsTable');
      return true;
        
    } catch (error) {
      consoleDotError('Failed to retrieve and mount:', error);
      return false;
    }
  }

  async initializeStoredMount(mountPath, storedMount, fetchMethod, fetchInfo, options) {
    consoleDotLog(`Initializing stored mount at ${mountPath}`);
    try {
      consoleDotLog(`Creating FS instance for stored mount (type: ${storedMount.fsType})`);
      const fsInstance = await this.createFSInstance(
        storedMount.fsType,
        mountPath,
        { 
          versioning: this.getVersioningConfig(storedMount),
          merging: this.getMergingConfig(storedMount)
        }
      );

      consoleDotLog(`Fetching data for stored mount using method: ${storedMount.fetchMethod || fetchMethod}`);
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
      consoleDotLog(`Successfully initialized stored mount at ${mountPath}`);
      return this.mounts[mountPath];
    } catch (error) {
      consoleDotError(`Failed to initialize stored mount at ${mountPath}:`, error);
      throw error;
    }
  }

  async createNewMount(mountPath, fsType, fsName, fetchMethod, fetchInfo, versioning = {}, merging = {}) {
    consoleDotLog(`Creating new mount at ${mountPath}`);
    try {
      consoleDotLog(`Creating new FS instance (type: ${fsType})`);
      const fsInstance = await this.createFSInstance(fsType, mountPath, { versioning, merging });
      
      consoleDotLog(`Fetching data for new mount using method: ${fetchMethod}`);
      await this.fetchFS(fetchMethod, fsType, fsInstance, mountPath, fetchInfo);

      consoleDotLog('Generating filesystem table');
      const fsTable = await this.VFSutils.generateFsTable();
      const fsSize = await this.VFSutils.getFsTableSize(fsTable);
      consoleDotLog(`Filesystem table generated, size: ${fsSize}`);

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
      consoleDotLog(`Persisting mount data for ${mountPath}`);
      await this.persistMountData(mountPath, mountData);
      
      this.initializedMounts.add(mountPath);
      consoleDotLog(`Successfully mounted new filesystem at ${mountPath}`);
      return mountData;
    } catch (error) {
      consoleDotError(`Failed to create new mount at ${mountPath}:`, error);
      throw error;
    }
  }

  async getMountPaths() {
    return Object.keys(this.mounts);
  }

  async getMountInfo(mountPath) {
    if (!this.mounts[mountPath]) {
      const errorMsg = `Mount not found: ${mountPath}`;
      consoleDotError(errorMsg);
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
    consoleDotLog(`Unmounting filesystem at ${fsPath}`);
    
    if (!this.mounts[fsPath]) {
      const errorMsg = `Path ${fsPath} is not mounted`;
      consoleDotError(errorMsg);
      throw new Error(errorMsg);
    }
  
    const mountData = this.mounts[fsPath];

    try {
      if (this.mounts[fsPath].fsInstance) {
        consoleDotLog(`Closing all files for mount at ${fsPath}`);
        await this.mounts[fsPath].fsInstance.fs_fcloseall();
        this.mounts[fsPath].fsInstance = null;
      }
  
      delete this.mounts[fsPath];
      this.initializedMounts.delete(fsPath);
  
      if (Object.keys(this.mounts).length === 0 && this.VFSutils) {
        consoleDotLog('Terminating VFSutils instance (no more mounts)');
        await this.VFSutils.terminate(mountData.fsName, mountData.fsType);
        this.VFSutils = null;
      }
  
      consoleDotLog(`Successfully unmounted ${fsPath}`);
      return true;
    } catch (error) {
      consoleDotError(`Error unmounting ${fsPath}:`, error);
      throw error;
    }
  }

  // Filesystem Operations
  async fetchFS(fetchMethod, fsType, fsInstance, fsName, fetchInfo, useSW = false) {
    consoleDotLog(`Fetching filesystem data - method: ${fetchMethod}, type: ${fsType}, name: ${fsName}`);
    try {
      if (this.VFSutils) {
        consoleDotLog('Terminating existing VFSutils instance');
        await this.VFSutils.terminate();
        this.VFSutils = null;
      }

      consoleDotLog('Creating new VFSutils instance');
      this.VFSutils = new VFSutils(fsType, fsInstance, fsName, fetchInfo, useSW);
      
      const fetchStrategies = {
        git: () => this.VFSutils.fetchFromGit(),
        disk: () => this.VFSutils.fetchFromDisk(),
        googleDrive: () => this.VFSutils.fetchFromGoogleDrive()
      };

      const strategy = fetchStrategies[fetchMethod];
      if (!strategy) {
        const errorMsg = `Unknown fetch method: ${fetchMethod}`;
        consoleDotError(errorMsg);
        throw new Error(errorMsg);
      }

      consoleDotLog(`Executing fetch strategy for ${fetchMethod}`);
      await strategy();
      
      // Update last fetched time
      if (this.mounts[this.currentMountPath]) {
        this.mounts[this.currentMountPath].fetchInfo.lastFetched = new Date().toISOString();
        this.mounts[this.currentMountPath].modified = new Date().toISOString();
        await this.persistMountData(this.currentMountPath, this.mounts[this.currentMountPath]);
      }
      
      consoleDotLog(`Successfully fetched data using ${fetchMethod} method`);
    } catch (error) {
      consoleDotError(`Fetch operation failed (method: ${fetchMethod}):`, error);
      if (this.VFSutils) {
        consoleDotLog('Cleaning up VFSutils after fetch failure');
        await this.VFSutils.terminate(fsName, fsType);
        this.VFSutils = null;
      }
      throw error;
    }
  }

  async resolveFS(path) {
    consoleDotLog(`Resolving filesystem for path: ${path}`);
    try {
      for (const mountPath in this.mounts) {
        if (path.startsWith(mountPath)) {
          consoleDotLog(`Found matching mount at `, mountPath);
          await this.ensureFSInitialized(mountPath);
          const relativePath = path.slice(mountPath.length) || "/";
          consoleDotLog(`Resolved path: ${path} to mount: ${mountPath}, relative path: ${relativePath}, this.mounts[mountPath] : `, this.mounts[mountPath]);
          consoleDotLog('resolveFs returned value: ', 
            {            
            fs: this.mounts[mountPath],
            relativePath: relativePath,
            versioning: this.mounts[mountPath].versioning || config.versioning,
            merging: this.mounts[mountPath].merging || config.merging
          })

          return {
            fs: this.mounts[mountPath],
            relativePath: relativePath,
            versioning: this.mounts[mountPath].versioning || config.versioning,
            merging: this.mounts[mountPath].merging || config.merging
          };
        }
      }
      const errorMsg = `No filesystem mounted for path: ${path}`;
      consoleDotError(errorMsg);
      throw new Error(errorMsg);
    } catch (error) {
      consoleDotError(`Failed to resolve filesystem for path ${path}:`, error);
      throw error;
    }
  }

  // Filesystem Table Operations
  async writeToFsTable(path, type = "file", size = 0) {
    consoleDotLog(`Writing to fsTable - path: ${path}, type: ${type}, size: ${size}`);
    await this.validateVFSutils();
    
    try {
      consoleDotLog(`Updating fsTable with create operation for ${path}`);
      const updateResult = await this.VFSutils.updateFsTable("create", path, type, size);
      consoleDotLog(`Updating mount fsTable with new data`);
      await this.updateMountFsTable(updateResult.fsTable);
      consoleDotLog(`Successfully updated fsTable for ${path}`);
      return updateResult.fsTable;
    } catch (error) {
      consoleDotError('Failed to write to fsTable:', error);
      throw error;
    }
  }

  async removeFromFsTable(path) {
    consoleDotLog(`Removing from fsTable - path: ${path}`);
    await this.validateVFSutils();
    
    try {
      consoleDotLog(`Updating fsTable with remove operation for ${path}`);
      const updateResult = await this.VFSutils.updateFsTable("remove", path);
      consoleDotLog(`Updating mount fsTable with removal data`);
      await this.updateMountFsTable(updateResult.fsTable);
      consoleDotLog(`Successfully removed ${path} from fsTable`);
      return updateResult.fsTable;
    } catch (error) {
      consoleDotError('Failed to remove from fsTable:', error);
      throw error;
    }
  }

  async updateMountFsTable(fsTable) {
    consoleDotLog(`Updating mount fsTable for current mount path`);
    if (!this.currentMountPath) {
      const errorMsg = 'No active mount path available';
      consoleDotError(errorMsg);
      throw new Error(errorMsg);
    }

    consoleDotLog(`Loading mount data for ${this.currentMountPath}`);
    const mountData = await this.storageUtils.get(this.currentMountPath);
    if (!mountData) {
      const errorMsg = `Mount data not found for path: ${this.currentMountPath}`;
      consoleDotError(errorMsg);
      throw new Error(errorMsg);
    }

    consoleDotLog(`Updating fsTable in mount data`);
    mountData.fsTable = fsTable;
    consoleDotLog(`Storing updated mount data for ${this.currentMountPath}`);
    await this.storageUtils.store(this.currentMountPath, mountData);
    consoleDotLog(`Successfully updated mount fsTable`);
  }

  // Validation Utilities
  async validateVFSutils() {
    consoleDotLog('Validating VFSutils instance');
    if (!this.VFSutils) {
      const errorMsg = "VFSutils not initialized";
      consoleDotError(errorMsg);
      throw new Error(errorMsg);
    }
    consoleDotLog('VFSutils validation passed');
  }

  //----------------------
  // Versioning Operations
  //----------------------

  async versioner( message ) {
    consoleDotLog(`Committing version with message: ${message}`);
    await this.validateVFSutils();
    
    try {
      const commitResult = await this.VFSutils.commitStagedChanges( message );
      consoleDotLog(`Version committed successfully`);
      return commitResult;
    } catch (error) {
      consoleDotError('Failed to commit version:', error);
      throw error;
    }
  }
  
  //--------------------
  // Merging Operations
  //--------------------

  async merger() {
    consoleDotLog('Starting merge operation');
    await this.validateVFSutils();

    try {
      const mergeResult = await this.VFSutils.autoSyncFlow();
      consoleDotLog('Merge operation completed successfully:', mergeResult);
      return mergeResult;
    }
    catch (error) {
      consoleDotError('Merge operation failed:', error);
      throw error;
    }
  }
  
  //-------------------
  // Some info setters for vfsUtils
  //-------------------

  async setMergingStrategy(mergingStrategy) {
    consoleDotLog('Setting merging strategy');
    let mountData = this.mounts[this.currentMountPath];
    mountData = {...mountData, merging: mergingStrategy};
    await this.persistMountData(this.currentMountPath, mountData);
    consoleDotLog('Merging strategy set successfully:', mergingStrategy);
    return true;
  }

  async setVersioingStrategy(versioningStrategy) {
    consoleDotLog('Setting versioning strategy');
    let mountData = this.mounts[this.currentMountPath];
    mountData = {...mountData, versioning: versioningStrategy};
    await this.persistMountData(this.currentMountPath, mountData);
    consoleDotLog('Versioning strategy set successfully:', versioningStrategy);
    return true;
  }

  async setUserConfigs(args) {
    await this.validateVFSutils();
    consoleDotLog('Setting user configurations:', args);
    await this.VFSutils.updateFetchInfo(args);
    let mountData = this.mounts[this.currentMountPath];
    mountData = { ...mountData, fetchInfo: { ...mountData.fetchInfo, ...args } };
    this.persistMountData(this.currentMountPath, mountData);
    return args;
  }
}