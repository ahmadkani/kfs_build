import { Logger } from "./src/libs/LoggerES6.js";
import { config } from './src/configES6.js';
  
const logger = new Logger(config.logging.ServiceWorkerRegistration);

function consoleDotLog(...parameters) {
  logger.consoleDotLog(...parameters);
}

function consoleDotError(...parameters) {
  logger.consoleDotError(...parameters);
}

let updateChannel;

export async function register() {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.register('./service-worker.js', {
      scope: '/',
      type: 'classic' // Use classic instead of module
    })
    if (registration) {
      consoleDotLog('Service Worker already registered:', registration);
      return;
    }

    // Dynamically determine the base path (GitHub Pages repo name)
    // const basePath = window.location.pathname.split('/')[1];
    // const scopePath = basePath ? `/${basePath}/` : '/';
    // consoleDotLog('scopePath', scopePath);
    const scopePath = './';
    // Register the service worker with the dynamically set scope
    navigator.serviceWorker
      .register('./service-worker.js', { 
        scope: scopePath
       })
      .then((registration) => {
        consoleDotLog('Service Worker registered with scope:', scopePath, registration);

        if (registration.waiting) {
          updateReady(registration.waiting);
        }

        registration.onupdatefound = () => {
          const newWorker = registration.installing;
          newWorker.onstatechange = () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              updateReady(newWorker);
            }
          };
        };
      })
      .catch((error) => {
        consoleDotError('Service Worker registration failed:', error);
      });
  } else {
    consoleDotLog('Service Worker not supported');
  }

  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.sync
        .register('my-sync')
        .then(() => {
          consoleDotLog('Sync registered');
        })
        .catch((error) => {
          consoleDotError('Sync registration failed:', error);
        });
    });
  } else {
    consoleDotLog('Background Sync not supported');
  }
}

function updateReady(worker) {
  consoleDotLog('New update ready:', worker);

  if (!updateChannel) {
    updateChannel = new BroadcastChannel('sw-update-channel');
  }

  if (confirm("یک نسخه‌ی جدید وجود دارد، آیا می‌خواهید به روزرسانی شود؟")) {
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

navigator.serviceWorker.addEventListener('controllerchange', () => {
  consoleDotLog('Service Worker controller changed.');
  if (updateChannel) {
    updateChannel.close();
    updateChannel = null;
  }
  window.location.reload();
});

export async function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
        consoleDotLog('Service Worker unregistered.');
      })
      .catch((error) => {
        consoleDotError(error.message);
      });
  }
}