import { Logger } from "./libs/LoggerES6.js";
import MagicPortal from "./libs/MagicPortalES6.js";
import { getConfig } from './configES6.js';

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
            workerInstance = new Worker(new URL('./workers/gitWorker.js', import.meta.url), { type: 'module' });
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

export const workerPool = new WorkerPool();