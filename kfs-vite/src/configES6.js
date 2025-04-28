const config = {
  corsProxy: 'http://localhost:9000/',
  dir: '/',
  logging: {
    vfs: true,
    kfs: true,
    IDBFs: true,
    gitWorker: true,
    fsType: true,
    fsManagerES6: true,
    fsManagerGlobal: true,
    swUtils: true,
    memoryFS: true,
    memoryBackendES6: true,
    memoryBackendGlobal: true,
    VFSutils: true,
    ServiceWorkerRegistration: true,
    serviceWorker: true,
    storageUtils: true,
    supportChecker: true,
    dotGit: true,
    GitAuth: true,
    serviceWorker: true,
    workerPool: true,
  },
  versioning : {
    strategy: 'immediate',
    interval: 10,
    number: 5
  },
  merging: {
    strategy: 'immediate',
    interval: 60,
  }
};

export function setConfig(newConfig) {
  if (config !== null) {
      throw new Error('Configuration has already been set and cannot be modified.');
  }
  for (const key in newConfig) {
    if (config.hasOwnProperty(key)) {
      config[key] = newConfig[key];
    } else {
      throw new Error(`Invalid configuration key: ${key}`);
    }
  }
}

export function getConfig() {
  if (config === null) {
      throw new Error('Configuration has not been set yet.');
  }
  return config;
}

export { config };