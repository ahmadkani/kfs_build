import { config } from './../../configES6.js';
import { Logger } from './../LoggerES6.js';

const logger = new Logger(config.logging.kfs);

function consoleDotLog(...params) {
  logger.consoleDotLog('[Merging]', ...params);
}

function consoleDotError(...params) {
  logger.consoleDotError('[Merging]', ...params);
}

export class MergingManager {
    constructor(vfs) {
      this.vfs = vfs;
      this.clockIntervalID = null;
      this.config = this._getDefaultMergingConfig();
    }
  
    _getDefaultMergingConfig() {
      return {
        strategy: config.merging?.strategy || null,
        interval: config.merging?.interval || 10,
        number: config.merging?.number || 5
      };
    }
  
    async setup(options = {}) {
        this.config = {
          ...this._getDefaultMergingConfig(),
          ...(options.merging || {})
        };
      
        if (this.config.strategy === 'clock') {
          await this._startClockMerging(); // Now async
        } else {
          this.clearClock();
        }
      }
      
      async _startClockMerging() {
        this.clearClock();
        const intervalMs = this.config.interval * 1000;
        this.clockIntervalID = setInterval(async () => {
          try {
            await this.vfs.merger.merge('Clock-based auto merge');
          } catch (error) {
            console.error('Clock-based merge failed:', error);
          }
        }, intervalMs);
      }

    clearClock() {
      if (this.clockIntervalID) {
        clearInterval(this.clockIntervalID);
        this.clockIntervalID = null;
      }
    }

    async getConfig() {
        return this.config;
      }
  }