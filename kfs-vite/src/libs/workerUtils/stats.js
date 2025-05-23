import {Logger} from '../LoggerES6.js';
import {config} from '../../configES6.js';

const logger = new Logger(config.logging.stats);

// Inode counter
let inodeCounter = 1000;

class StatsManager {
    constructor() {
        this.fileStats = new Map();
        this.dirStats = new Map();
        this.loadRootStats();
    }

    loadRootStats() {
        // Initialize root directory stats
        this.dirStats.set('/', {
            inode: 1,
            mode: '040755',
            uid: 0,
            gid: 0,
            atime: new Date().toISOString(),
            mtime: new Date().toISOString(),
            ctime: new Date().toISOString()
        });
    }

    getFileStats(filepath) {
        return this.fileStats.get(filepath) || this.generateFileStats(filepath);
    }

    getDirStats(dirpath) {
        return this.dirStats.get(dirpath) || this.generateDirStats(dirpath);
    }

    setFileStats(filepath, stats) {
        const completeStats = {
            ...this.generateFileStats(filepath),
            ...stats
        };
        this.fileStats.set(filepath, completeStats);
        return completeStats;
    }

    setDirStats(dirpath, stats) {
        const completeStats = {
            ...this.generateDirStats(dirpath),
            ...stats
        };
        this.dirStats.set(dirpath, completeStats);
        return completeStats;
    }

    generateFileStats(filepath) {
        inodeCounter++;
        return {
            inode: inodeCounter,
            mode: '100644',
            uid: 1000,
            gid: 1000,
            size: 0,
            atime: new Date().toISOString(),
            mtime: new Date().toISOString(),
            ctime: new Date().toISOString()
        };
    }

    generateDirStats(dirpath) {
        inodeCounter++;
        return {
            inode: inodeCounter,
            mode: '040755',
            uid: 1000,
            gid: 1000,
            atime: new Date().toISOString(),
            mtime: new Date().toISOString(),
            ctime: new Date().toISOString()
        };
    }

    updateTimestamp(filepath, isDirectory, whichTime = 'mtime') {
        const timestamp = new Date().toISOString();
        const store = isDirectory ? this.dirStats : this.fileStats;
        const stats = store.get(filepath) || 
                      (isDirectory ? this.generateDirStats(filepath) : this.generateFileStats(filepath));
        
        stats[whichTime] = timestamp;
        store.set(filepath, stats);
        return stats;
    }
}

const stats = new StatsManager();

export default stats;