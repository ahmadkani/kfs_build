import { config } from './../../configES6.js';
import { Logger } from './../LoggerES6.js';

const logger = new Logger(config.logging.kfs);

function consoleDotLog(...params) {
  logger.consoleDotLog('[Versioning]', ...params);
}

function consoleDotError(...params) {
  logger.consoleDotError('[Versioning]', ...params);
}

export class VersioningManager {
  constructor(vfs) {
    this.vfs = vfs;
    this.clockIntervalID = null;
    this.operationQueueCount = 0;
    this.config = this._getDefaultVersioningConfig();
  }

  _getDefaultVersioningConfig() {
    const versioning = config.versioning || {};
    return {
      strategy: versioning.strategy,
      interval: versioning.interval,
      number: versioning.number,
    };
  }

  async _getVersioningConfig(options = {}) {
    const defaultConfig = this._getDefaultVersioningConfig();
    const versioning = options.versioning || {};
    return {
      strategy: versioning.strategy || defaultConfig.strategy,
      interval: versioning.interval || defaultConfig.interval,
      number: versioning.number || defaultConfig.number,
    };
  }

  async setup(options = {}) {
    this.config = await this._getVersioningConfig(options);
    consoleDotLog('Versioning configuration:', this.config);

    if (this.config.strategy === 'clock') {
      this._startClockVersioning();
    } else {
      this.clearClock();
    }
  }

  clearClock() {
    if (this.clockIntervalID) {
      clearInterval(this.clockIntervalID);
      this.clockIntervalID = null;
    }
  }

  _startClockVersioning() {
    this.clearClock();
    const intervalMs = (this.config.interval || 10) * 1000;
    consoleDotLog('Starting clock-based versioning with interval:', intervalMs, 'ms');

    this.clockIntervalID = setInterval(async () => {
      consoleDotLog('Clock-based auto commit triggered');
      try {
        await this.vfs.versioner('Clock-based auto commit');
      } catch (error) {
        consoleDotError('Error in clock-based versioning:', error);
      }
    }, intervalMs);
  }

  async maybeTriggerVersioning(overrideConfig = null) {
    const strategyConfig = overrideConfig || this.config;
    if (strategyConfig.strategy === 'immediate') return;

    if (strategyConfig.strategy === 'batch') {
      this.operationQueueCount++;
      const batchSize = strategyConfig.number || 5;
      consoleDotLog(`Batch operation count: ${this.operationQueueCount}/${batchSize}`);

      if (this.operationQueueCount >= batchSize) {
        this.operationQueueCount = 0;
        await this.vfs.versioner(`Batch commit after ${batchSize} operations`);
      }
    }
  }

  async getConfig() {
    return this.config;
  }
}
