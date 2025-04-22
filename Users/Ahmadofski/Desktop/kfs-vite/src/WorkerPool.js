import { Logger } from "./libs/LoggerES6.js";
import MagicPortal from "./libs/MagicPortalES6.js";
import { config } from './configES6.js';

const logger = new Logger(config.logging.WorkerPool);

function consoleDotLog(...parameters) {
  logger.consoleDotLog('[WorkerPool]', ...parameters);
}

function consoleDotError(...parameters) {
  logger.consoleDotError('[WorkerPool]', ...parameters);
}

class WorkerPool {
  constructor(workerClass = null) {
    this.workers = new Map();
    this.workerCount = 0;
    // Allow dependency injection for testing
    this.WorkerClass = workerClass || (typeof Worker !== 'undefined' ? Worker : null);
  }

  async getWorker(mountPath, useSW = false) {
    if (!this.WorkerClass) {
      throw new Error("Worker class not available in this environment");
    }

    if (!this.workers.has(mountPath)) {
      const worker = new Worker(new URL('./gitWorker.js', import.meta.url));
      console.log('worker created for: ', worker);

      const portal = new MagicPortal(worker);
      const thread = await portal.get("workerThread");
      
      // Mock navigator for tests
      const swSupport = typeof navigator !== 'undefined' && 'serviceWorker' in navigator;
      await thread.setSWUsage(swSupport, useSW);

      this.workers.set(mountPath, {
        worker,
        portal,
        thread,
        users: 0
      });
      
      this.workerCount++;
    }

    const entry = this.workers.get(mountPath);
    entry.users++;
    return entry;
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