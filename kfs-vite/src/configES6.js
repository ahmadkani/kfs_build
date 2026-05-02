// configES6.js
let config = null;

// Define group mappings
const loggingGroups = {
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

// Default configuration (fallback)
const defaultConfig = {
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
    memoryFS: true,
    memoryBackendES6: false,
    memoryBackendGlobal: false,
    VFSutils: true,
    gitNoteManager: true,
    storageUtils: true,
    supportChecker: true,
    dotGit: true,
    GitAuth: true,
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
    onConflictStrategy: 'remote'
  }
};

// Promise that resolves when config is loaded
let configReadyPromise = null;

async function loadConfig() {
  try {
    // Use fetch to load config from public directory
    const response = await fetch('/config.json');
    if (!response.ok) {
      throw new Error('Config file not found');
    }
    const jsonConfig = await response.json();
    
    // Apply group mappings to the loaded config
    if (jsonConfig.logging) {
      for (const group in loggingGroups) {
        if (jsonConfig.logging.hasOwnProperty(group)) {
          const value = jsonConfig.logging[group];
          loggingGroups[group].forEach(subKey => {
            if (jsonConfig.logging.hasOwnProperty(subKey)) {
              jsonConfig.logging[subKey] = value;
            }
          });
        }
      }
    }
    
    // Merge with default config
    return {
      ...defaultConfig,
      ...jsonConfig,
      logging: {
        ...defaultConfig.logging,
        ...(jsonConfig.logging || {})
      },
      versioning: {
        ...defaultConfig.versioning,
        ...(jsonConfig.versioning || {})
      },
      merging: {
        ...defaultConfig.merging,
        ...(jsonConfig.merging || {})
      }
    };
  } catch (error) {
    console.warn('Using default configuration:', error.message);
    return defaultConfig;
  }
}

// Initialize config
configReadyPromise = loadConfig().then(loadedConfig => {
  config = loadedConfig;
  return config;
}).catch(error => {
  console.error('Failed to load config:', error);
  config = defaultConfig;
  return config;
});

async function setConfig(newConfig) {
  await configReadyPromise; // Wait for config to load first
  
  for (const key in newConfig) {
    if (key === 'logging') {
      const loggingConfig = newConfig.logging;
      
      // First process group settings
      for (const group in loggingGroups) {
        if (loggingConfig.hasOwnProperty(group)) {
          const value = loggingConfig[group];
          loggingGroups[group].forEach(subKey => {
            if (config.logging.hasOwnProperty(subKey)) {
              config.logging[subKey] = value;
            }
          });
        }
      }
      
      // Then process individual settings
      for (const logKey in loggingConfig) {
        if (config.logging.hasOwnProperty(logKey) && !loggingGroups.hasOwnProperty(logKey)) {
          config.logging[logKey] = loggingConfig[logKey];
        }
      }
    } else if (config.hasOwnProperty(key)) {
      config[key] = newConfig[key];
    } else {
      throw new Error(`Invalid configuration key: ${key}`);
    }
  }
}

async function getConfig() {
  await configReadyPromise; // Wait for config to load
  return config;
}

// Export the config object and ready promise
export { config, getConfig, setConfig, configReadyPromise };