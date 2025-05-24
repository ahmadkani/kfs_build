import {Logger} from '../LoggerES6.js';
import {config} from '../../configES6.js';

const logger = new Logger(config.logging.acl);

const DEFAULT_ACL = {
    owner: {
        read: true,
        write: true,
        execute: true
    },
    group: {
        read: true,
        write: false,
        execute: true
    },
    others: {
        read: true,
        write: false,
        execute: false
    }
};

// Special permissions for system paths
const SPECIAL_ACLS = {
    '/': {
        owner: {
            read: true,
            write: true,
            execute: true
        },
        group: {
            read: true,
            write: false,
            execute: true
        },
        others: {
            read: true,
            write: false,
            execute: true
        }
    },
    '/system': {
        owner: {
            read: true,
            write: true,
            execute: true
        },
        group: {
            read: false,
            write: false,
            execute: false
        },
        others: {
            read: false,
            write: false,
            execute: false
        }
    }
};

// User database (would normally come from config)
const USERS = {
    'root': { uid: 0, gid: 0, groups: ['admin'] },
    'admin': { uid: 1000, gid: 1000, groups: ['admin'] },
    'user': { uid: 1001, gid: 1001, groups: ['users'] }
};

// Group database
const GROUPS = {
    'admin': { gid: 0 },
    'users': { gid: 1000 }
};

class ACLManager {
    constructor() {
        this.aclStore = new Map();
        this.loadDefaultACLs();
    }

    loadDefaultACLs() {
        // Load special ACLs
        for (const path in SPECIAL_ACLS) {
            this.aclStore.set(path, SPECIAL_ACLS[path]);
        }
    }

    getDefaultACL(path) {
        // Check for path-specific ACL first
        if (this.aclStore.has(path)) {
            return this.aclStore.get(path);
        }

        // Return default ACL
        return JSON.parse(JSON.stringify(DEFAULT_ACL));
    }

    getACL(path) {
        return this.aclStore.get(path) || this.getDefaultACL(path);
    }

    setACL(path, aclRules) {
        if (!aclRules.owner || !aclRules.group || !aclRules.others) {
            throw new Error('Invalid ACL structure');
        }
        this.aclStore.set(path, aclRules);
    }

    checkPermission(path, user, permission) {
        const acl = this.getACL(path);
        const userInfo = USERS[user] || USERS['user'];
        
        // Check owner permissions
        if (userInfo.uid === 0 || user === acl.owner) {
            return acl.owner[permission];
        }

        // Check group permissions
        if (userInfo.groups.some(group => group === acl.group)) {
            return acl.group[permission];
        }

        // Check others permissions
        return acl.others[permission];
    }
}

const acl = new ACLManager();

export default acl;