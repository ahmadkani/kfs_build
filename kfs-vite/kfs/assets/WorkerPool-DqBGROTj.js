class Logger {
  constructor(on = true, trace = false) {
    this.on = on;
    this.trace = trace;
    }

    consoleDotLog(...parameters) {
    if (!this.on) return;
    console.log(...parameters);
    this.trace && console.trace();
    }

    consoleDotError(...parameters) {
    if (!this.on) return;
    console.error(...parameters);
    this.trace && console.trace();
    }
}

var e=function(e){var t=this;this.rpc_counter=0,this.channel=e,this.foreign=new Map,this.local=new Map,this.calls=new Map,this.queue=[],this.connectionEstablished=false,this.channel.addEventListener("message",function(e){var n=e.data;if(n&&"object"==typeof n)switch(n.type){case "MP_INIT":return t.onInit(n);case "MP_SET":return t.onSet(n);case "MP_CALL":return t.onCall(n);case "MP_RETURN":return t.onReturn(n)}}),this.channel.postMessage({type:"MP_INIT",id:1,reply:true});};e.prototype.onInit=function(e){this.connectionEstablished=true;var t=this.queue;this.queue=[];for(var n=0,o=t;n<o.length;n+=1){this.channel.postMessage(o[n]);}e.reply&&this.channel.postMessage({type:"MP_INIT",reply:false});},e.prototype.onSet=function(e){for(var t=this,n={},o=e.object,s=function(){var s=i[r],c=!e.void.includes(s);n[s]=function(){for(var e=[],n=arguments.length;n--;)e[n]=arguments[n];return t.rpc_counter=(t.rpc_counter+1)%Number.MAX_SAFE_INTEGER,new Promise(function(n,r){t.postMessage({type:"MP_CALL",object:o,method:s,id:t.rpc_counter,args:e,reply:c}),c?t.calls.set(t.rpc_counter,{resolve:n,reject:r}):n();})};},r=0,i=e.methods;r<i.length;r+=1)s();var c=this.foreign.get(e.object);this.foreign.set(e.object,n),"function"==typeof c&&c(n);},e.prototype.onCall=function(e){var t=this,n=this.local.get(e.object);n&&n[e.method].apply(n,e.args).then(function(n){return e.reply&&t.channel.postMessage({type:"MP_RETURN",id:e.id,result:n})}).catch(function(n){return t.channel.postMessage({type:"MP_RETURN",id:e.id,error:n.message})});},e.prototype.onReturn=function(e){if(this.calls.has(e.id)){var t=this.calls.get(e.id),n=t.resolve,o=t.reject;this.calls.clear(e.id),e.error?o(e.error):n(e.result);}},e.prototype.postMessage=function(e){this.connectionEstablished?this.channel.postMessage(e):this.queue.push(e);},e.prototype.set=function(e,t,n){ void 0===n&&(n={}),this.local.set(e,t);var o=Object.entries(t).filter(function(e){return "function"==typeof e[1]}).map(function(e){return e[0]});this.postMessage({type:"MP_SET",object:e,methods:o,void:n.void||[]});},e.prototype.get=function(e){return new Promise(function(t,n){var o=this;return this.foreign.has(e)?t(this.foreign.get(e)):t(new Promise(function(t,n){return o.foreign.set(e,t)}))}.bind(this))};function MagicPortal(t){var n=new e(t);Object.defineProperties(this,{get:{writable:false,configurable:false,value:n.get.bind(n)},set:{writable:false,configurable:false,value:n.set.bind(n)}});}

// configES6.js
let config$1 = null;

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

/**
 * Try to fetch config.json from multiple candidate locations.
 * Logs every attempt to help debugging.
 */
async function loadConfig() {
  // Build list of URLs to try
  const candidates = [
    '/config.json',                       // served from host root
    './config.json',                      // relative to current page URL
    '/kfs/config.json',                   // if library is under /kfs/
    '/dist/config.json',
    new URL("./config.json", import.meta.url).href,   // same folder as this script
    new URL("../config.json", import.meta.url).href,  // one level up from script
  ];

  for (const url of candidates) {
    try {
      console.debug(`[Config] Trying to load config from: ${url}`);
      const response = await fetch(url);
      if (response.ok) {
        const jsonConfig = await response.json();
        console.debug(`[Config] Successfully loaded config from: ${url}`);
        
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
      } else {
        console.debug(`[Config] Failed to load from ${url} (status ${response.status})`);
      }
    } catch (err) {
      console.debug(`[Config] Error fetching ${url}: ${err.message}`);
    }
  }

  // If we get here, no config file was found
  console.warn('Using default configuration: Config file not found in any candidate location.');
  return defaultConfig;
}

// Initialize config
configReadyPromise = loadConfig().then(loadedConfig => {
  config$1 = loadedConfig;
  return config$1;
}).catch(error => {
  console.error('Failed to load config:', error);
  config$1 = defaultConfig;
  return config$1;
});

async function getConfig() {
  await configReadyPromise; // Wait for config to load
  return config$1;
}

const config = await getConfig();
const logger = new Logger(config.logging.WorkerPool);

function consoleDotLog(...parameters) {
  logger.consoleDotLog('[WorkerPool]', ...parameters);
}

function consoleDotError(...parameters) {
  logger.consoleDotError('[WorkerPool]', ...parameters);
}

consoleDotLog('Loading workerPool.');

// Helper to wrap Node Worker to look like Browser Worker
class NodeWorkerWrapper {
  constructor(worker) {
    this.worker = worker;
    this.listeners = new Map();
    
    this.worker.on('message', (message) => {
      const event = { data: message };
      if (this.onmessage) this.onmessage(event);
      const listeners = this.listeners.get('message') || [];
      listeners.forEach(fn => fn(event));
    });
    
    this.worker.on('error', (err) => {
      const listeners = this.listeners.get('error') || [];
      listeners.forEach(fn => fn(err));
    });
  }

  postMessage(message) {
    this.worker.postMessage(message);
  }

  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(listener);
  }

  terminate() {
    return this.worker.terminate();
  }
}

class WorkerPool {
  constructor() {
    this.workers = new Map();
    this.workerCount = 0;
    this.isNode = typeof window === 'undefined';
  }

  async getWorker(mountPath, useSW = false) {
    try {
      if (!this.workers.has(mountPath)) {
        consoleDotLog(`Creating new worker for ${mountPath}`);
        let workerInstance;

        if (this.isNode) {
            // --- NODE.JS: Dynamic Import to avoid Vite bundling errors ---
            const { Worker } = await import('worker_threads');
            const { fileURLToPath } = await import('url');
            const { dirname, join } = await import('path');

            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(__filename);
            const workerPath = join(__dirname, 'workers', 'gitWorker.js');
            
            const rawWorker = new Worker(workerPath);
            workerInstance = new NodeWorkerWrapper(rawWorker);
        } else {
            // --- BROWSER: Standard Worker ---
            // Ensure this path matches your public structure or Vite config
            workerInstance = new Worker(new URL(/* @vite-ignore */ ""+new URL('gitWorker-hEoWv1h3.js', import.meta.url).href+"", import.meta.url), { type: 'module' });
        }
  
        const portal = new MagicPortal(workerInstance);
        
        const thread = await Promise.race([
          portal.get("workerThread"),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Worker thread timeout')), 10000)
          )
        ]);
        
        consoleDotLog('Worker thread obtained, waiting for readiness...');
        await thread.ready();
        consoleDotLog('Worker is ready');
  
        this.workers.set(mountPath, {
          worker: workerInstance,
          portal,
          thread,
          users: 0
        });
        
        this.workerCount++;
        consoleDotLog(`Worker for ${mountPath} initialized`);
      }
  
      const entry = this.workers.get(mountPath);
      entry.users++;
      return entry;
    } catch (error) {
      consoleDotError(`Failed to get worker for ${mountPath}:`, error);
      throw error;
    }
  }

  async releaseWorker(mountPath) {
    if (this.workers.has(mountPath)) {
      const entry = this.workers.get(mountPath);
      entry.users--;
      if (entry.users <= 0) {
        await entry.worker.terminate();
        this.workers.delete(mountPath);
        this.workerCount--;
      }
    }
  }
}

const workerPool = new WorkerPool();

export { Logger as L, getConfig as g, workerPool as w };
//# sourceMappingURL=WorkerPool-DqBGROTj.js.map
