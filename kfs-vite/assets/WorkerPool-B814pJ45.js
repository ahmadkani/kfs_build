import { g as getConfig, L as Logger, M as MagicPortal } from './configES6-bU3v7xiC.js';

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
            // --- NODE.JS LOGIC ---
            // We use createRequire to bypass Vite's polyfills and get the native Node.js modules.
            const { createRequire } = await import('module');
            const require = createRequire(import.meta.url);
            
            const { Worker } = require('worker_threads');
            const { fileURLToPath } = require('url');
            const { join, dirname } = require('path');
            const { existsSync } = require('fs');

            // Get the directory of the current file (WorkerPool.js)
            const currentDir = dirname(fileURLToPath(import.meta.url));
            
            // gitWorker.js is a sibling to kfs.js (in the root of 'kfs' output folder)
            // WorkerPool.js is inside 'kfs/assets', so we go up one level.
            const workerPath = join(currentDir, '../gitWorker.js');

            consoleDotLog(`Resolved worker path: ${workerPath}`);

            if (!existsSync(workerPath)) {
                console.error(`[WorkerPool] ❌ WORKER FILE NOT FOUND at: ${workerPath}`);
                throw new Error(`Worker file not found at ${workerPath}`);
            }

            const rawWorker = new Worker(workerPath, { type: 'module' });
            workerInstance = new NodeWorkerWrapper(rawWorker);
        } else {
            // --- BROWSER LOGIC ---
            // Since gitWorker is defined as an entry in vite.config.js, 
            // new URL() will correctly resolve to the output file path (e.g. /kfs/gitWorker.js).
            // WorkerPool.js is at /kfs/assets/WorkerPool-[hash].js
            // gitWorker.js is at /kfs/gitWorker.js
            const workerUrl = new URL("../gitWorker.js", import.meta.url);
            
            consoleDotLog(`Resolved worker URL: ${workerUrl.href}`);
            workerInstance = new Worker(workerUrl, { type: 'module' });
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

export { workerPool as w };
//# sourceMappingURL=WorkerPool-B814pJ45.js.map
