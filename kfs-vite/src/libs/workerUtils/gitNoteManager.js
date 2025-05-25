import {Logger} from '../LoggerES6.js';
import {config} from '../../configES6.js';
import git from 'isomorphic-git';
import acl from './acl.js';
import stats from './stats.js';

const logger = new Logger(config.logging.gitNoteManager);

function consoleDotLog(...parameters) {
  logger.consoleDotLog('[gitNoteManager] ', ...parameters);
}

function consoleDotError(...parameters) {
  logger.consoleDotError('[gitNoteManager] ', ...parameters);
}

consoleDotLog('Loading gitNoteManager.');

// Default values for metadata generation
const DEFAULT_UID = 1000;
const DEFAULT_GID = 1000;
const DEFAULT_MODE_FILE = '100644';
const DEFAULT_MODE_DIR = '040755';
const DEFAULT_FILE_SIZE = 0;

async function gitNoteManager(fs, dir, operation, type = null, params = {}) {
  try {
    switch (operation) {
      case 'add':
        return await addNote(fs, dir, type, params);
      case 'read':
        return await readNote(fs, dir, type, params);
      case 'remove':
        return await removeNote(fs, dir, type, params);
      case 'list':
        return await listNotes(fs, dir, type);
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }
  } catch (error) {
    consoleDotError(`Error in gitNoteManager: ${error.message}`);
    throw error;
  }
}

async function getOid(fs, dir, filepath, isDirectory = false) {
  try {
    if (isDirectory) {
      const tree = await git.readTree({ fs, dir, filepath });
      return tree.oid;
    } else {
      const blob = await git.readBlob({ fs, dir, filepath });
      return blob.oid;
    }
  } catch (error) {
    consoleDotError(`Failed to get OID for ${filepath}: ${error.message}`);
    throw error;
  }
}

function getCurrentTimestamp() {
  return new Date().toISOString();
}

function generateInodeNumber() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function createMetadata(fs, dir, type, params) {
  const now = getCurrentTimestamp();
  const { filepath, customMetadata = {}, fsType } = params;
  
  // Common metadata for all types
  const baseMetadata = {
    created_at: now,
    updated_at: now,
    ...customMetadata
  };

  switch (type) {
    case 'inode': {
      // For files, get stats from external module
      const fileStats = stats.getFileStats(filepath) || {};
      const filename = filepath?.split('/').pop() || filepath;
      
      return {
        ...baseMetadata,
        inode: fileStats.inode || generateInodeNumber(),
        mode: fileStats.mode || DEFAULT_MODE_FILE,
        name: filename,
        uid: fileStats.uid || DEFAULT_UID,
        gid: fileStats.gid || DEFAULT_GID,
        acl: acl.getDefaultACL(filepath),
        atime: fileStats.atime || now,
        mtime: fileStats.mtime || now,
        ctime: fileStats.ctime || now,
        size: fileStats.size || DEFAULT_FILE_SIZE,
        type: 'file'
      };
    }
    
    case 'dentry': {
      // For directories, get stats from external module
      const dirStats = stats.getDirStats(filepath) || {};
      const dirname = filepath?.split('/')?.pop() || filepath;
      const parentPath = filepath?.split('/')?.slice(0, -1)?.join('/') || '/';
      
      // Try to get parent inode if parent path exists
      let parentInode = 0;
      try {
        const parentOid = await getOid(fs, dir, parentPath, true);
        const parentNote = await git.readNote({ fs, dir, oid: parentOid });
        const parentMeta = JSON.parse(parentNote);
        parentInode = parentMeta.inode || 0;
      } catch (e) {
        consoleDotLog(`Could not get parent inode for ${filepath}, using 0`);
      }
      
      return {
        ...baseMetadata,
        dentry_id: dirStats.inode || generateInodeNumber(),
        name: dirname,
        parent_inode: parentInode,
        mode: dirStats.mode || DEFAULT_MODE_DIR,
        uid: dirStats.uid || DEFAULT_UID,
        gid: dirStats.gid || DEFAULT_GID,
        acl: acl.getDefaultACL(filepath),
        atime: dirStats.atime || now,
        mtime: dirStats.mtime || now,
        ctime: dirStats.ctime || now,
        type: 'directory'
      };
    }
    
    case 'superblock': {
      if (!params.fsType) {
        throw new Error('fsType is required for superblock notes');
      }
      
      return {
        ...baseMetadata,
        fsType: params?.fsType || null,
        owner: params.owner || 'root',
        created_at: now,
        default_acl: acl.getDefaultACL('/') || null,
        users: ['root'],
        acl_policy: 'strict',
        block_size: params.block_size || 4096,
        features: params.features || [],
        uuid: generateUUID()
      };
    }
    
    case 'acl':
      return {
        ...baseMetadata,
        ...acl.getACL(filepath)
      };
      
    default:
      throw new Error(`Unsupported note type: ${type}`);
  }
}

async function addNote(fs, dir, type, params) {
  try {
    let { oid, filepath, customMetadata, fsType } = params;
    
    // Validate input
    if (type === 'superblock' && !params.fsType) {
      throw new Error('fsType parameter is required for superblock notes');
    }
    
    if (!oid && !filepath) {
      throw new Error('Either oid or filepath must be provided');
    }
    
    // Get OID if filepath is provided
    const isDirectory = type === 'dentry';
    if (filepath && !oid) {
      oid = await getOid(fs, dir, filepath, isDirectory);
    }
    
    // Generate complete metadata
    const metadata = await createMetadata(fs, dir, type, {
      filepath,
      customMetadata,
      fsType
    });
    
    let noteRef;
    let message;
    
    switch (type) {
      case 'inode':
        noteRef = undefined; // default notes ref
        message = JSON.stringify(metadata);
        break;
        
      case 'dentry':
        noteRef = undefined;
        message = JSON.stringify(metadata);
        break;
        
      case 'superblock':
        noteRef = 'repo';
        message = JSON.stringify(metadata);
        break;
        
      case 'acl':
        noteRef = 'acl';
        message = JSON.stringify(metadata);
        break;
        
      default:
        throw new Error(`Unsupported note type: ${type}`);
    }
    
    await git.addNote({
      fs,
      dir,
      oid,
      note: message,
      author: {
        name: 'gitNoteManager',
        email: 'gitnotemanager@system'
      },
      force: true,
      ref: noteRef
    });
    
    consoleDotLog(`Successfully added ${type} note to ${oid}`);
    return metadata;
  } catch (error) {
    consoleDotError(`Failed to add ${type} note: ${error.message}`);
    throw error;
  }
}


async function readNote(fs, dir, type, params) {
  let targetOid;
  try {
    const { oid, filepath } = params;
    
    targetOid = oid;
    if (filepath && !oid) {
      const isDirectory = type === 'dentry';
      targetOid = await getOid(fs, dir, filepath, isDirectory).catch(() => null);
    }

    if (!targetOid) {
      throw new Error('Valid OID or filepath must be provided');
    }

    let noteRef;
    switch (type) {
      case 'superblock':
        noteRef = 'repo';
        break;
      case 'acl':
        noteRef = 'acl';
        break;
      default:
        noteRef = undefined;
    }

    const noteUint8 = await git.readNote({
      fs,
      dir,
      oid: targetOid,
      ref: noteRef
    }).catch(() => null);

    if (!noteUint8) {
      if (type === 'superblock') {
        // Initialize default superblock if not found
        return await initDefaultSuperblock(fs, dir);
      }
      throw new Error(`Note not found for ${type}`);
    }

    const noteStr = new TextDecoder().decode(noteUint8);
    return JSON.parse(noteStr);

  } catch (error) {
    consoleDotError(`Failed to get ${type} note: ${error.message}`);
    return {
      error: error.message,
      type,
      oid: targetOid || null,
      exists: false
    };
  }
}

async function listNotes(fs, dir) {
  try {    
    const notes = await git.listNotes({ fs, dir });
    consoleDotLog(`Successfully listed notes`);
    return notes;
  } catch (error) {
    consoleDotError(`Failed to list notes: ${error.message}`);
    throw error;
  }
}

async function initDefaultSuperblock(fs, dir) {
  const defaultSuperblock = {
    fs_type: 'memory',
    owner: 'root',
    created_at: new Date().toISOString(),
    block_size: 4096,
    features: []
  };

  await git.addNote({
    fs,
    dir,
    oid: 'HEAD',
    note: new TextEncoder().encode(JSON.stringify(defaultSuperblock)),
    author: { name: 'system', email: 'system@git' },
    ref: 'repo',
    force: true
  });

  return defaultSuperblock;
}

async function removeNote(fs, dir, type, params) {
    try {
      const { oid, filepath } = params;
      
      let targetOid = oid;
      if (filepath && !oid) {
        targetOid = await getOid(fs, dir, filepath);
      }
      
      let noteRef;
      
      switch (type) {
        case 'inode':
        case 'dentry':
          noteRef = undefined; // default notes ref
          break;
        case 'superblock':
          noteRef = 'repo';
          break;
        case 'acl':
          noteRef = 'acl';
          break;
        default:
          throw new Error(`Unsupported note type: ${type}`);
      }
      
      await git.removeNote({
        fs,
        dir,
        oid: targetOid,
        ref: noteRef
      });
      
      consoleDotLog(`Successfully removed ${type} note from ${targetOid}`);
      return true;
    } catch (error) {
      consoleDotError(`Failed to remove ${type} note: ${error.message}`);
      throw error;
    }
  }
  
export default gitNoteManager;