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

export { config };