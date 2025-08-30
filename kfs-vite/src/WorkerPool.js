import { Logger } from "./libs/LoggerES6.js";
import MagicPortal from "./libs/MagicPortalES6.js";
import { getConfig } from './configES6.js';
import GitWorker from './workers/gitWorker.js?worker';

const config = await getConfig();

const logger = new Logger(config.logging.WorkerPool);

function consoleDotLog(...parameters) {
  logger.consoleDotLog('[WorkerPool]', ...parameters);
}

function consoleDotError(...parameters) {
  logger.consoleDotError('[WorkerPool]', ...parameters);
}

consoleDotLog('Loading workerPool.');

class WorkerPool {
  constructor(workerClass = null) {
    this.workers = new Map();
    this.workerCount = 0;
    // Allow dependency injection for testing
    this.WorkerClass = workerClass || (typeof Worker !== 'undefined' ? Worker : null);
  }

  async getWorker(mountPath, useSW = false) {
    try {
      if (!this.WorkerClass) {
        throw new Error("Worker class not available in this environment");
      }
  
      if (!this.workers.has(mountPath)) {
        consoleDotLog(`Creating new worker for ${mountPath}`);

        const worker = new GitWorker();

  
        // Add error handling
        worker.onerror = (e) => {
          consoleDotError('Worker error:', e);
          consoleDotError('Error details:', {
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno,
            message: e.message
          });
          throw e;
        };
  
        const portal = new MagicPortal(worker);
        
        // Add timeout for safety
        const thread = await Promise.race([
          portal.get("workerThread"),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Worker thread timeout')), 5000)
          )
        ]);
        
        consoleDotLog('Worker thread obtained, waiting for readiness...');
        await thread.ready();
        consoleDotLog('Worker is ready');
  
        const swSupport = typeof navigator !== 'undefined' && 'serviceWorker' in navigator;
        await thread.execute('setSWUsage', { supportsServiceWorker: swSupport, useSW });
  
        this.workers.set(mountPath, {
          worker,
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
        entry.worker.terminate();
        this.workers.delete(mountPath);
        this.workerCount--;
        consoleDotLog(`Terminated worker for ${mountPath}`);
      }
    }
  }

  async forceTerminateAll() {
    for (const [path, {worker}] of this.workers) {
      worker.terminate();
      consoleDotLog(`Force terminated worker for ${path}`);
    }
    this.workers.clear();
    this.workerCount = 0;
  }

  getActiveCount() {
    return this.workerCount;
  }
}

// Singleton instance
export const workerPool = new WorkerPool();