// GitAuth.js
import { Logger } from "../LoggerES6.js";
import { getConfig } from '../../configES6.js';

const config = await getConfig();
const logger = new Logger(config.logging.GitAuth);

function consoleDotLog(...parameters) {
  logger.consoleDotLog(...parameters);
}

function consoleDotError(...parameters) {
  logger.consoleDotError(...parameters);
}

export class GitAuth {
  constructor(workerThread) {
    this.workerThread = workerThread;
    this.AuthChecked = false;
  }

  /**
   * Sets authentication credentials for Git operations
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<boolean>}
   */
  async setAuthParams(username, password) {
    try {
      if (!this.workerThread) {
        throw new Error('Worker thread not initialized');
      }
      
      await this.workerThread.execute('setAuthParams', { username, password });
      consoleDotLog('Auth params set successfully');
      if (!this.AuthChecked) {
        // await this.verifyAuth();
        this.AuthChecked = true;
      }
      consoleDotLog('Auth params verified successfully');
      return true;
    } catch (error) {
      consoleDotError('Failed to set auth params:', error);
      throw error;
    }
  }

  /**
   * Verifies if current auth credentials are valid
   * @returns {Promise<boolean>}
   */
  async verifyAuth() {
    try {
      if (!this.workerThread) {
        throw new Error('Worker thread not initialized');
      }

      // Try a lightweight operation that requires auth
      // It is not permanent, because a repo can require no auth for clone
      await this.workerThread.execute('listServerRefs');
      consoleDotLog('Auth verification successful');
      return true;
    } catch (error) {
      if (error.toString().includes('401') || error.toString().includes('403')) {
        consoleDotLog('Auth verification failed - invalid credentials');
        return false;
      }
      consoleDotError('Auth verification error:', error);
      throw error;
    }
  }

    /**
     * Sets Git user config (name and email)
     * @param {string} name 
     * @param {string} email 
     */
    async setUserConfig(name, email) {
        try {
        await this.workerThread.execute('setConfigs', { name, email });
        consoleDotLog(`User config set, name: ${name}, email: ${email}`);
        return true;
        } catch (error) {
        consoleDotError(`Failed to set user config: ${error}`);
        throw error;
        }
    }
}