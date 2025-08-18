const config = {
  corsProxy: 'http://localhost:9000/',
  dir: '/',
  logging: {
    vfs: true,
    kfs: true,
    IDBFs: true,
    gitWorker: true,
    acl: true,
    stats: true,
    fsType: true,
    fsManagerES6: false,
    fsManagerGlobal: false,
    swUtils: true,
    memoryFS: true,
    memoryBackendES6: false,
    memoryBackendGlobal: false,
    VFSutils: true,
    gitNoteManager: true,
    ServiceWorkerRegistration: true,
    serviceWorker: true,
    storageUtils: true,
    supportChecker: true,
    dotGit: true,
    GitAuth: true,
    serviceWorker: true,
    WorkerPool: true,
  },
  versioning: {
    strategy: 'immediate',
    interval: 10,
    number: 5
  },
  merging: {
    strategy: 'immediate',
    interval: 60,
    onConflictStrategy: 'remote' // remote, local, combine
  }
};

// Define group mappings
const loggingGroups = {
  serviceWorker: [
    'serviceWorker',
    'ServiceWorkerRegistration',
    'swUtils',
  ],
  kfs: [
    'kfs',
    'fsType',
    'fsManagerES6',
    'fsManagerGlobal',
    'vfs',
    'VFSutils',
  ],
  gitWorker: [
    'gitWorker',
    'dotGit',
    'acl',
    'stats',
    'GitAuth',
    'WorkerPool',
    'gitNoteManager'
  ],
  storage: [
    'memoryFS',
    'memoryBackendES6',
    'memoryBackendGlobal',
    'IDBFs'
  ]
};

async function setConfig(newConfig) {
  if (config === null) {
    throw new Error('Configuration has already been set and cannot be modified.');
  }
  
  for (const key in newConfig) {
    if (key === 'logging') {
      // Handle logging configuration
      const loggingConfig = newConfig.logging;
      
      // First process group settings
      for (const group in loggingGroups) {
        if (loggingConfig.hasOwnProperty(group)) {
          const value = loggingConfig[group];
          // Set all subgroup values to the group value
          loggingGroups[group].forEach(subKey => {
            if (config.logging.hasOwnProperty(subKey)) {
              config.logging[subKey] = value;
            }
          });
        }
      }
      
      // Then process individual settings (overriding group settings if needed)
      for (const logKey in loggingConfig) {
        if (config.logging.hasOwnProperty(logKey) && !loggingGroups.hasOwnProperty(logKey)) {
          config.logging[logKey] = loggingConfig[logKey];
        }
      }
    } else if (config.hasOwnProperty(key)) {
      // Handle non-logging configuration
      config[key] = newConfig[key];
    } else {
      throw new Error(`Invalid configuration key: ${key}`);
    }
  }
}

async function getConfig() {
  if (config === null) {
    throw new Error('Configuration has not been set yet.');
  }
  return config;
}

export { config, getConfig, setConfig };