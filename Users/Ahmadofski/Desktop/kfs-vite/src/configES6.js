const config = {
  corsProxy: 'http://localhost:9000/',
  dir: '/',
  logging: {
    vfs: true,
    kfs: true,
    IDBFs: false,
    gitWorker: false,
    fsType: false,
    fsManager: false,
    fsManagerGlobal: false,
    swUtils: false,
    memoryFS: true,
    memoryBackendAMD: true,
    memoryBackendGlobal: false,
    VFSutils: true,
    ServiceWorkerRegistration: false,
    storageUtils: false,
    supportChecker: false,
    dotGit: true,
    GitAuth: true,
    serviceWorker: false,
    workerPool: false,
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

export { config };