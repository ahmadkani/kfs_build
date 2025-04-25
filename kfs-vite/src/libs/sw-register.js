import { Logger } from "./LoggerES6.js";
import { config } from '../configES6.js';

const logger = new Logger(config.logging.ServiceWorkerRegistration);

function consoleDotLog(...parameters) {
  logger.consoleDotLog(...parameters);
}

function consoleDotError(...parameters) {
  logger.consoleDotError(...parameters);
}

let updateChannel;

class ServiceWorkerRegistration {
  constructor() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        consoleDotLog('Service Worker controller changed.');
        if (updateChannel) {
          updateChannel.close();
          updateChannel = null;
        }
        window.location.reload();
      });
    }
  }

  async register({ scope = '/', enableSync = false } = {}) {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        
        if (registration) {
          consoleDotLog('Service Worker already registered:', registration);
          return registration;
        }

        // Use relative path from dist
        const swPath = './service-worker.js';
        const newRegistration = await navigator.serviceWorker.register(
          swPath, 
          { scope, type: 'classic' }
        );

        consoleDotLog('Service Worker registered with scope:', scope, newRegistration);

        this._setupUpdateHandling(newRegistration);

        if (enableSync && 'SyncManager' in window) {
          this._setupBackgroundSync(newRegistration);
        }

        return newRegistration;
      } catch (error) {
        consoleDotError('Service Worker registration failed:', error);
        throw error;
      }
    } else {
      consoleDotLog('Service Worker not supported');
      return undefined;
    }
  }

  async unregister() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.unregister();
          consoleDotLog('Service Worker unregistered.');
        }
      } catch (error) {
        consoleDotError('Service Worker unregistration failed:', error);
        throw error;
      }
    }
  }

  _setupUpdateHandling(registration) {
    if (registration.waiting) {
      this._updateReady(registration.waiting);
    }

    registration.onupdatefound = () => {
      const newWorker = registration.installing;
      newWorker.onstatechange = () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          this._updateReady(newWorker);
        }
      };
    };
  }

  _updateReady(worker) {
    consoleDotLog('New update ready:', worker);

    if (!updateChannel) {
      updateChannel = new BroadcastChannel('sw-update-channel');
    }

    if (confirm("A new version is available. Would you like to update?")) {
      worker.postMessage({ action: 'skipWaiting' });

      worker.addEventListener('statechange', () => {
        if (worker.state === 'activated') {
          setTimeout(() => {
            if (updateChannel) updateChannel.close();
            window.location.reload();
          }, 0);
        }
      });
    }
  }

  _setupBackgroundSync(registration) {
    registration.sync
      .register('my-sync')
      .then(() => consoleDotLog('Sync registered'))
      .catch(error => consoleDotError('Sync registration failed:', error));
  }
}

// Export a singleton instance
export const serviceWorker = new ServiceWorkerRegistration();