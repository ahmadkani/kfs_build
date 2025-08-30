import { Logger } from "./../LoggerES6.js";
import { getConfig } from './../../configES6.js';

const config = await getConfig();
const logger = new Logger(config.logging.supportChecker);

function consoleDotLog(...parameters) {
  logger.consoleDotLog(...parameters);
}

export async function checkIndexedDBSupport() {
  try {
    if (!window.indexedDB) {
      consoleDotLog("IndexedDB not supported in this browser");
      return false;
    }

    // Test opening a dummy database to verify support
    return await new Promise((resolve) => {
      const dbName = "testIDBSupport";
      const request = indexedDB.open(dbName);
      
      request.onerror = () => {
        consoleDotLog("IndexedDB not available");
        resolve(false);
      };
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        db.close();
        
        // Delete the test database
        const deleteRequest = indexedDB.deleteDatabase(dbName);
        
        deleteRequest.onerror = () => {
          consoleDotLog("Failed to delete test database");
          resolve(true); // Still consider IDB supported
        };
        
        deleteRequest.onsuccess = () => {
          consoleDotLog("IndexedDB test successful");
          resolve(true);
        };
      };

      request.onblocked = () => {
        consoleDotLog("IndexedDB request blocked");
        resolve(false);
      };
    });
  } catch (e) {
    consoleDotLog("IndexedDB test failed:", e);
    return false;
  }
}

export const supportChecker = {
  checkIndexedDBSupport
};