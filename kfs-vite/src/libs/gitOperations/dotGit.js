import git from 'isomorphic-git'
import baseFunctions from './baseFunctions.js';
import {Logger} from './../LoggerES6.js';
import {getConfig} from './../../configES6.js';

const config = await getConfig();
    const logger = new Logger(config.logging.dotGit);
    const staged = new Map();

    function consoleDotLog(...parameters) {
        logger.consoleDotLog('[DotGit] ', ...parameters);
    }
      
    function consoleDotError(...parameters) {
        logger.consoleDotError('[DotGit] ', ...parameters);
    }

    export default {
        staged,

        async commitStagedChanges(fs, dir, message = null, name = 'System', email = 'system@example.com') {
            try {
                logger.consoleDotLog('staged', staged, dir);

                if (this.staged.size === 0) {
                    logger.consoleDotLog('No staged changes to commit');
                    return { committed: false };
                }
        
                // Get current HEAD commit
                let parentCommitOid;
                try {
                    parentCommitOid = await git.resolveRef({ fs, dir, ref: 'HEAD' });
                    logger.consoleDotLog(`Parent commit OID: ${parentCommitOid}`);
                } catch (e) {
                    logger.consoleDotLog('No existing commit, starting fresh repository');
                    parentCommitOid = null;
                }

                let currentTree = [];
                if (parentCommitOid) {
                    const { commit } = await git.readCommit({ fs, dir, oid: parentCommitOid });
                    const treeResult = await git.readTree({ fs, dir, oid: commit.tree });
                    currentTree = treeResult.tree;
                }
        
                const updateTreeWithStagedChanges = async (tree, stagedOperations) => {
                    // Create a deep copy of the tree to modify
                    const newTree = JSON.parse(JSON.stringify(tree));
                    
                    for (const [filePath, operation] of stagedOperations) {
                        if (!filePath || typeof filePath !== 'string') {
                            logger.consoleDotError('Invalid file path in staged changes:', filePath);
                            continue;
                        }
                
                        const normalizedPath = filePath.replace(/^\/+|\/+$/g, '');
                        const pathParts = normalizedPath.split('/').filter(p => p.length > 0);
                        
                        if (pathParts.length === 0) {
                            logger.consoleDotError('Empty path in staged changes');
                            continue;
                        }
                
                        const fileName = pathParts.pop();
                        let currentTreeLevel = newTree;
                        let currentPath = [];
                        
                        // Navigate through directory structure
                        for (const part of pathParts) {
                            let dirEntry = currentTreeLevel.find(e => e.path === part && e.type === 'tree');
                            
                            if (!dirEntry) {
                                // Create new directory entry if it doesn't exist
                                const newTreeOid = await git.writeTree({ fs, dir, tree: [] });
                                dirEntry = {
                                    mode: '040000',
                                    path: part,
                                    oid: newTreeOid,
                                    type: 'tree',
                                };                                
                                currentTreeLevel.push(dirEntry);
                            }
                            
                            // Move into the directory
                            const { tree: subtree } = await git.readTree({ fs, dir, oid: dirEntry.oid });
                            dirEntry.tree = subtree; // Ensure tree is populated
                            currentTreeLevel = subtree;
                            currentPath.push(part);
                        }
                        
                        // Apply the operation
                        try {
                            if (operation.type === 'write' || operation.type === 'writeDir') {
                                // Add or update entry
                                const existingIndex = currentTreeLevel.findIndex(e => e.path === fileName);
                                const oid = operation.type === 'writeDir' ? operation.treeOid : operation.oid;
                                
                                if (!oid) {
                                    throw new Error(`Missing OID for ${operation.type} operation on ${filePath}`);
                                }
                
                                if (existingIndex >= 0) {
                                    currentTreeLevel[existingIndex].oid = oid;
                                    currentTreeLevel[existingIndex].type = operation.type === 'write' ? 'blob' : 'tree';
                                    currentTreeLevel[existingIndex].mode = operation.type === 'write' ? '100644' : '040000';
                                } else {
                                    currentTreeLevel.push({
                                        mode: operation.type === 'write' ? '100644' : '040000',
                                        path: fileName,
                                        oid: oid,
                                        type: operation.type === 'write' ? 'blob' : 'tree'
                                    });
                                }
                            } else if (operation.type === 'remove' || operation.type === 'removeDir') {
                                // Remove entry
                                const indexToRemove = currentTreeLevel.findIndex(e => e.path === fileName);
                                if (indexToRemove >= 0) {
                                  currentTreeLevel.splice(indexToRemove, 1);
                                }
                                                            }
                        } catch (e) {
                            logger.consoleDotError(`Error processing ${operation.type} for ${filePath}:`, e);
                            throw e;
                        }
                    }
                    
                    return newTree;
                };
        
                // Create new tree incorporating all staged changes
                const stagedOperations = Array.from(this.staged.entries());
                const updatedTree = await updateTreeWithStagedChanges(currentTree, stagedOperations);
                for (const entry of updatedTree) {
                    console.log('entry of updated tree, ', entry)
                    if (!entry.path) {
                      console.error("❌ Missing path:", entry);
                    }
                    if (!entry.oid) {
                      console.error("❌ Missing oid:", entry);
                    }
                  }
                  
                // Validate the final tree structure before writing
                const validateTree = (tree) => {
                    for (const entry of tree) {
                        if (!entry.path || typeof entry.path !== 'string') {
                            throw new Error(`Invalid tree entry: ${JSON.stringify(entry)}`);
                        }
                        if (!entry.oid || typeof entry.oid !== 'string') {
                            throw new Error(`Invalid OID for path ${entry.path}`);
                        }
                    }
                };
                
                validateTree(updatedTree);
                
                const newTreeOid = await this._writeFullTree(fs, dir, updatedTree);
        
                // Commit the new tree
                const commitOid = await this.commitChanges(fs, dir, {
                    message: message || `Batch commit ${stagedOperations.length} staged changes`,
                    treeOid: newTreeOid,
                    parentCommitOids: parentCommitOid ? [parentCommitOid] : [],
                    name,
                    email,
                    actionType: 'batch',
                    filePath: null
                });
        
                // Clear staged changes after successful commit
                this.staged.clear();
        
                return {
                    committed: true,
                    commitOid,
                    treeOid: newTreeOid,
                    stagedCount: stagedOperations.length
                };
            } catch (e) {
                logger.consoleDotError('Error committing staged changes:', e);
                throw e;
            }
        },

        async commitChanges(fs, dir, {
            message,
            treeOid,
            parentCommitOids = [],
            name = 'System',
            email = 'system@example.com',
            actionType = 'change',
            filePath = null
        }) {
            try {
                const commitOid = await git.commit({
                    fs,
                    dir,
                    message,
                    tree: treeOid,
                    parent: parentCommitOids,
                    author: { name, email }
                });
                
                logger.consoleDotLog(`Committed ${actionType} for ${filePath || 'repository'}: ${commitOid}`);
                return commitOid;
            } catch (e) {
                logger.consoleDotError('Error committing changes:', e);
                throw e;
            }
        },

        async _writeFullTree(fs, dir, tree) {
        const writeTreeRecursively = async (entries) => {
            const result = [];
            for (const entry of entries) {
            if (entry.type === 'tree') {
                const subtreeOid = await writeTreeRecursively(entry.tree || []);
                result.push({
                mode: '040000',
                path: entry.path,
                oid: subtreeOid,
                type: 'tree'
                });
            } else {
                result.push(entry);
            }
            }
            return await git.writeTree({ fs, dir, tree: result });
        };
        return await writeTreeRecursively(tree);
        },

        async findInGitHistory(fs, dir, filepath) {
            try {
                logger.consoleDotLog('Starting findInGitHistory function...');
                logger.consoleDotLog(`File path: ${filepath}`);
                const normalizedPath = filepath.replace(/^\/+|\/+$/g, '');
                const pathParts = normalizedPath.split('/');
                logger.consoleDotLog(`Path parts: ${JSON.stringify(pathParts)}`);

                let commitOid = await baseFunctions.resolveRef(fs, dir);
                logger.consoleDotLog(`Starting from commit: ${commitOid}`);

                while (commitOid) {
                    logger.consoleDotLog(`Processing commit: ${commitOid}`);

                    const { commit } = await baseFunctions.readCommit(fs, dir, commitOid);
                    let currentTreeOid = commit.tree;
                    logger.consoleDotLog(`Root tree OID: ${currentTreeOid}`);

                    let found = true;
                    for (let i = 0; i < pathParts.length; i++) {
                        const part = pathParts[i];
                        logger.consoleDotLog(`Processing path part: ${part}`);

                        const { tree: currentTree } = await git.readTree({
                            fs,
                            dir,
                            oid: currentTreeOid,
                        });

                        const entry = currentTree.find(e => e.path === part);
                        if (!entry) {
                            logger.consoleDotLog(`Path part "${part}" not found in tree.`);
                            found = false;
                            break;
                        }

                        if (i === pathParts.length - 1) {
                            logger.consoleDotLog(`Found path "${filepath}" in commit ${commitOid}`, currentTree);
                            logger.consoleDotLog(entry);
                            return {
                                type: entry.type,
                                oid: entry.oid,
                                commitOid: commitOid,
                                treeOid: currentTreeOid,
                            };
                        }

                        if (entry.type === 'tree') {
                            currentTreeOid = entry.oid;
                            logger.consoleDotLog(`Found subtree OID: ${currentTreeOid}`);
                        } else {
                            logger.consoleDotLog(`Path part "${part}" is not a directory.`);
                            found = false;
                            break;
                        }
                    }

                    if (found) {
                        logger.consoleDotLog(`Path "${filepath}" found in commit ${commitOid}`);
                        return {
                            type: 'tree',
                            oid: currentTreeOid,
                            commitOid: commitOid,
                        };
                    }

                    commitOid = commit.parent.length > 0 ? commit.parent[0] : null;
                    logger.consoleDotLog(`Moving to parent commit: ${commitOid}`);
                }

                throw new Error(`Path "${filepath}" not found in any commit.`);
            } catch (e) {
                logger.consoleDotLog('Error in findInGitHistory:', e);
                throw e;
            }
        },
        
        async readFileDot(fs, dir, filePath, _commitOid = null) {
            try {
                logger.consoleDotLog(`args are fs: ${fs}, dir: ${dir}, filePath: ${filePath}, commitOid: ${_commitOid}`);
                filePath = filePath.replace(/^\/+|\/+$/g, '');
        
                // Try reading from staged first
                if (_commitOid === 'staged') {
                    const stagedEntry = this.staged.get(filePath);
                    if (stagedEntry && stagedEntry.type === 'write') {
                        try {
                            const blob = await git.readBlob({
                                fs,
                                dir,
                                oid: stagedEntry.oid
                            });
        
                            const blobData = blob.blob instanceof ArrayBuffer
                                ? new Uint8Array(blob.blob)
                                : blob.blob instanceof Uint8Array
                                    ? blob.blob
                                    : null;
        
                            if (!blobData) throw new Error('Invalid blob data');
        
                            return new TextDecoder().decode(blobData);
                        } catch (e) {
                            logger.consoleDotError('Error reading staged blob, falling back:', e);
                            // Continue to check committed version
                        }
                    } else {
                        logger.consoleDotLog(`File "${filePath}" not found in staged changes. Falling back...`);
                    }
                }
        
                // Handle regular commit fallback
                const pathParts = filePath.split('/');
                const fileName = pathParts.pop();
                const commitOid = _commitOid && _commitOid !== 'staged'
                    ? _commitOid
                    : await baseFunctions.resolveRef(fs, dir);
                const { commit } = await baseFunctions.readCommit(fs, dir, commitOid);
                let currentTreeOid = commit.tree;
        
                // Navigate to target tree
                for (const part of pathParts) {
                    const { tree } = await git.readTree({ fs, dir, oid: currentTreeOid });
                    const dirEntry = tree.find(e => e.path === part && e.type === 'tree');
                    if (!dirEntry) {
                        logger.consoleDotLog(`Directory "${part}" not found`);
                        return '';
                    }
                    currentTreeOid = dirEntry.oid;
                }
        
                // Read the blob from final tree
                const blob = await git.readBlob({
                    fs,
                    dir,
                    oid: currentTreeOid,
                    filepath: fileName
                });
        
                const blobData = blob.blob instanceof ArrayBuffer
                    ? new Uint8Array(blob.blob)
                    : blob.blob instanceof Uint8Array
                        ? blob.blob
                        : null;
        
                if (!blobData) {
                    logger.consoleDotError('Invalid blob data from commit');
                    return '';
                }
        
                return new TextDecoder().decode(blobData);
            } catch (e) {
                logger.consoleDotError('Error in readFileDot:', e);
                return '';
            }
        },        
        
        async readDirDot(fs, dir, dirPath, _commitOid = null) {
            try {
                dirPath = dirPath.replace(/^\/+|\/+$/g, '');
        
                // Handle staged case first
                if (_commitOid === 'staged') {
                    try {
                        const stagedEntries = Array.from(this.staged.entries())
                            .filter(([path, entry]) => {
                                const normalizedPath = path.replace(/^\/+|\/+$/g, '');
                                const pathParts = normalizedPath.split('/');
                                const dirParts = dirPath.split('/');
        
                                return pathParts.length === dirParts.length + 1 &&
                                    normalizedPath.startsWith(dirPath + (dirPath ? '/' : ''));
                            });
        
                        if (stagedEntries.length > 0) {
                            return {
                                entries: stagedEntries.map(([path, entry]) => {
                                    const name = path.split('/').pop();
                                    return {
                                        path: name,
                                        type: entry.type === 'write' ? 'blob' : 'tree',
                                        oid: entry.oid,
                                        mode: entry.type === 'write' ? '100644' : '040000'
                                    };
                                }),
                                dirPath,
                                commitOid: 'staged',
                                treeOid: 'staged'
                            };
                        } else {
                            logger.consoleDotLog(`No staged entries for "${dirPath}", falling back...`);
                        }
                    } catch (e) {
                        logger.consoleDotError('Error reading staged directory, falling back:', e);
                    }
                }
        
                // Handle committed state
                const commitOid = _commitOid && _commitOid !== 'staged'
                    ? _commitOid
                    : await baseFunctions.resolveRef(fs, dir);
                const { commit } = await baseFunctions.readCommit(fs, dir, commitOid);
                let currentTreeOid = commit.tree;
        
                const parts = dirPath.split('/').filter(Boolean);
        
                for (const part of parts) {
                    const { tree } = await git.readTree({ fs, dir, oid: currentTreeOid });
                    const entry = tree.find(e => e.path === part && e.type === 'tree');
                    if (!entry) {
                        logger.consoleDotLog(`Directory "${part}" not found in commit tree.`);
                        return { entries: [], dirPath, commitOid, treeOid: currentTreeOid };
                    }
                    currentTreeOid = entry.oid;
                }
        
                const { tree } = await git.readTree({ fs, dir, oid: currentTreeOid });
                return {
                    entries: tree.map(entry => ({
                        path: entry.path,
                        type: entry.type,
                        oid: entry.oid,
                        mode: entry.mode
                    })),
                    dirPath,
                    commitOid,
                    treeOid: currentTreeOid
                };
            } catch (e) {
                logger.consoleDotError('Error in readDirDot:', e);
                return { entries: [], dirPath, commitOid: null, treeOid: null };
            }
        },        
        
        async writeFileDot(
            fs,
            dir,
            filePath,
            fileContent,
            name = 'sample',
            email = 'sample@email.com',
            doCommit = 1
        ) {
            try {
                logger.consoleDotLog('Starting writeFileDot function...');
                
                // Normalize path and extract components
                filePath = filePath.replace(/^\/+|\/+$/g, '');
                const pathParts = filePath.split('/');
                const fileName = pathParts.pop();
                
                // Check if path exists and is a file (not directory)
                const pathStatus = await this.isDirectoryDot(fs, dir, filePath);
                if (pathStatus.exists) {
                    if (pathStatus.isDirectory) {
                        throw new Error(`Path ${filePath} exists and is a directory - cannot write as file`);
                    }
                    logger.consoleDotLog(`File ${filePath} exists and will be overwritten`);
                }
        
                // Create blob for file content
                const blobOid = await git.writeBlob({
                    fs,
                    dir,
                    blob: new TextEncoder().encode(fileContent)
                });
                logger.consoleDotLog(`Blob OID created: ${blobOid}`);
        
                // Get current HEAD commit
                let commitOid;
                try {
                    commitOid = await git.resolveRef({ fs, dir, ref: 'HEAD' });
                    logger.consoleDotLog(`Latest commit OID resolved: ${commitOid}`);
                } catch (e) {
                    logger.consoleDotLog('No existing commit, starting fresh repository');
                    commitOid = null;
                }
        
                // Get current tree
                let currentTree = [];
                if (commitOid) {
                    const { commit } = await git.readCommit({ fs, dir, oid: commitOid });
                    const treeResult = await git.readTree({ fs, dir, oid: commit.tree });
                    currentTree = treeResult.tree;
                    logger.consoleDotLog(`Current tree loaded with ${currentTree.length} entries`);
                }
        
                // Recursive function to update tree structure
                const updateTree = async (tree, remainingParts, blobOid) => {
                    // Base case: we're at the file level
                    if (remainingParts.length === 0) {
                        const existingIndex = tree.findIndex(e => e.path === fileName);
                        
                        // Validate existing entry is not a directory
                        if (existingIndex >= 0 && tree[existingIndex].type === 'tree') {
                            throw new Error(`Cannot overwrite directory ${fileName} with file content`);
                        }
        
                        // Update or create file entry
                        if (existingIndex >= 0) {
                            tree[existingIndex] = {
                                mode: '100644',
                                path: fileName,
                                oid: blobOid,
                                type: 'blob'
                            };
                        } else {
                            tree.push({
                                mode: '100644',
                                path: fileName,
                                oid: blobOid,
                                type: 'blob'
                            });
                        }
                        return tree;
                    }
        
                    // Recursive case: navigate directory structure
                    const dirName = remainingParts.shift();
                    let dirEntry = tree.find(e => e.path === dirName && e.type === 'tree');
        
                    // Create directory if it doesn't exist
                    if (!dirEntry) {
                        const newTreeOid = await git.writeTree({ fs, dir, tree: [] });
                        dirEntry = {
                            mode: '040000',
                            path: dirName,
                            oid: newTreeOid,
                            type: 'tree'
                        };
                        tree.push(dirEntry);
                    }
        
                    // Recursively update subtree
                    const { tree: subtree } = await git.readTree({ fs, dir, oid: dirEntry.oid });
                    const updatedSubtree = await updateTree([...subtree], remainingParts, blobOid);
                    const updatedSubtreeOid = await git.writeTree({ fs, dir, tree: updatedSubtree });
                    
                    // Update directory entry with new OID
                    dirEntry.oid = updatedSubtreeOid;
                    
                    return tree;
                };
        
                // Update the tree structure
                const updatedTree = await updateTree([...currentTree], [...pathParts], blobOid);
                const newTreeOid = await git.writeTree({ fs, dir, tree: updatedTree });
                logger.consoleDotLog(`New tree OID: ${newTreeOid}`);
        
                // Commit changes if requested
                let newCommitOid = null;
                if (doCommit) {
                    newCommitOid = await git.commit({
                        fs,
                        dir,
                        message: `Updated ${filePath}`,
                        tree: newTreeOid,
                        parent: commitOid ? [commitOid] : [],
                        author: { name, email }
                    });
                    logger.consoleDotLog(`New commit OID: ${newCommitOid}`);
                } else {
                    staged.set(filePath, {
                        type: 'write',
                        oid: blobOid,
                        treeOid: newTreeOid,
                        filePath: filePath,
                        action: 'staged'
                    });
                    logger.consoleDotLog(`Staged write for ${filePath} with blobOid ${blobOid}`);
                }
        
                return {
                    blobOid,
                    treeOid: newTreeOid,
                    commitOid: newCommitOid,
                    filePath,
                    action: doCommit ? 'committed' : 'staged',
                    createdTrees: pathParts.length
                };
            } catch (e) {
                logger.consoleDotError('Error in writeFileDot:', e);
                throw e;
            }
        },     
        
async isDirectoryDot(fs, dir, path) {
    try {
        consoleDotLog('[isDirectoryDot] Checking path:', path);

        if (!path || path === '/') {
            consoleDotLog('[isDirectoryDot] Path is root or empty, resolving root directory...');
            const commitOid = await baseFunctions.resolveRef(fs, dir);
            consoleDotLog('[isDirectoryDot] Resolved commit OID:', commitOid);

            const commit = await baseFunctions.readCommit(fs, dir, commitOid);
            const tree = await git.readTree({
                fs,
                dir,
                oid: commit?.commit?.tree,
            });

            consoleDotLog('[isDirectoryDot] Root directory tree loaded:', tree.tree);
            return {
                exists: true,
                isDirectory: true,
                hasChildren: tree.tree.length > 0,
            };
        }

        const parts = path.split('/').filter(p => p.length > 0);
        consoleDotLog('[isDirectoryDot] Path parts:', parts);

        const commitOid = await baseFunctions.resolveRef(fs, dir);
        consoleDotLog('[isDirectoryDot] Resolved commit OID:', commitOid);

        const commit = await baseFunctions.readCommit(fs, dir, commitOid);
        const tree = await git.readTree({
            fs,
            dir,
            oid: commit.commit.tree,
        });

        consoleDotLog('[isDirectoryDot] Initial tree loaded:', tree.tree);

        let currentTree = tree.tree;
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            consoleDotLog(`[isDirectoryDot] Checking part "${part}" in current tree...`);

            const entry = currentTree.find(e => e.path === part);
            if (!entry) {
                consoleDotLog(`[isDirectoryDot] Part "${part}" not found in current tree.`);
                return {
                    exists: false,
                    isDirectory: false,
                    hasChildren: false,
                };
            }

            if (entry.type === 'tree') {
                consoleDotLog(`[isDirectoryDot] Part "${part}" is a directory.`);
                if (i === parts.length - 1) {
                    const subtree = await git.readTree({ fs, dir, oid: entry.oid });
                    consoleDotLog('[isDirectoryDot] Subtree loaded:', subtree.tree);
                    return {
                        exists: true,
                        isDirectory: true,
                        hasChildren: subtree.tree.length > 0,
                    };
                }
                const subtree = await git.readTree({ fs, dir, oid: entry.oid });
                currentTree = subtree.tree;
            } else if (i === parts.length - 1) {
                consoleDotLog(`[isDirectoryDot] Part "${part}" is a file.`);
                return {
                    exists: true,
                    isDirectory: false,
                    hasChildren: false,
                };
            } else {
                consoleDotLog(`[isDirectoryDot] Part "${part}" is not a directory.`);
                return {
                    exists: false,
                    isDirectory: false,
                    hasChildren: false,
                };
            }
        }

        consoleDotLog('[isDirectoryDot] Path does not exist.');
        return {
            exists: false,
            isDirectory: false,
            hasChildren: false,
        };
    } catch (error) {
        consoleDotError('[isDirectoryDot] Error checking directory:', error);
        return {
            exists: false,
            isDirectory: false,
            hasChildren: false,
        };
    }
},
        
        async listFilesDot(fs, dir, listDirs = true) {
            try {
                let commitOid;
                try {
                    commitOid = await baseFunctions.resolveRef(fs, dir); // Get the latest commit
                } catch (e) {
                    logger.consoleDotLog('No commit found, returning empty list.');
                    return []; // If no commits exist, return an empty list
                }

                // If commitOid is null (empty repository), return empty list
                if (!commitOid) {
                    logger.consoleDotLog('No commit OID found, repository is empty.');
                    return [];
                }

                const allEntries = new Map(); // Store unique file and directory info
                const visitedTrees = new Set(); // Track processed trees to avoid redundant work

                // Read the commit first to get the tree
                let commit;
                try {
                    commit = await baseFunctions.readCommit(fs, dir, commitOid);
                } catch (error) {
                    if (error.message.includes('Cannot read properties of null') || 
                        error.message.includes('readObjectLoose')) {
                        logger.consoleDotLog('Commit reading failed, repository may be empty.');
                        return [];
                    }
                    throw error;
                }

                // If commit is null, return empty list
                if (!commit) {
                    logger.consoleDotLog('No commit found, returning empty list.');
                    return [];
                }

                // Optimized tree traversal function
                const traverseTree = async (treeOid, currentPath = '') => {
                    if (visitedTrees.has(treeOid)) return; // Skip already processed directories
                    visitedTrees.add(treeOid);

                    logger.consoleDotLog('Traversing tree:', treeOid, 'Path:', currentPath);
                    
                    let tree;
                    try {
                        const treeResult = await git.readTree({ fs, dir, oid: treeOid });
                        tree = treeResult.tree;
                    } catch (error) {
                        logger.consoleDotLog('Error reading tree:', error);
                        return; // Skip this tree if there's an error
                    }

                    await Promise.all(tree.map(async (entry) => {
                        const entryPath = currentPath ? `${currentPath}/${entry.path}` : entry.path;
                        
                        if (!allEntries.has(entryPath)) {
                            allEntries.set(entryPath, {
                                path: entryPath,
                                type: entry.type,
                                oid: entry.oid,
                                commitOid: commitOid,
                            });
                        }

                        if (entry.type === 'tree') {
                            return traverseTree(entry.oid, entryPath); // Recursively process directories
                        }
                    }));
                };

                // Traverse the commit tree
                await traverseTree(commit.commit.tree);

                // Convert Map to an array and filter based on listDirs flag
                let allEntriesArr = Array.from(allEntries.values());
                if (!listDirs) {
                    allEntriesArr = allEntriesArr.filter(entry => entry.type !== 'tree');
                }

                logger.consoleDotLog('Total entries:', allEntriesArr.length, 'Entries:', allEntriesArr);
                return allEntriesArr;
            } catch (e) {
                // Handle specific errors for empty repositories
                if (e.message.includes('Could not find HEAD') || 
                    e.message.includes('Could not find refs/heads') ||
                    e.message.includes('Cannot read properties of null') ||
                    e.message.includes('readObjectLoose') ||
                    e.message.includes('ENOENT')) {
                    logger.consoleDotLog('Repository is empty or not fully initialized, returning empty list.');
                    return [];
                }
                logger.consoleDotLog('Error in listFilesDot:', e);
                throw e;
            }
        },               
               

        async mkdirDot(fs, dir, dirPath, name = 'sample', email = 'sample@email.com', doCommit = 1) {
            try {
                logger.consoleDotLog(`Creating directories for path: ${dirPath}`);
                
                dirPath = dirPath.replace(/^\/+|\/+$/g, '');
                const pathParts = dirPath.split('/');
                
                const pathStatus = await this.isDirectoryDot(fs, dir, dirPath);
                if (pathStatus.exists) {
                    if (!pathStatus.isDirectory) {
                        throw new Error(`Path ${dirPath} exists and is a file - cannot create as directory`);
                    }
                    return {
                        dirPath,
                        existing: true,
                        treeOid: pathStatus.treeOid,
                        commitOid: null,
                        action: 'none'
                    };
                }
        
                let parentCommitOid = await baseFunctions.resolveRef(fs, dir).catch(() => null);
                let parentTreeOid = parentCommitOid
                    ? (await baseFunctions.readCommit(fs, dir, parentCommitOid)).commit.tree
                    : null;
                
                let currentTree = parentTreeOid
                    ? (await git.readTree({ fs, dir, oid: parentTreeOid })).tree
                    : [];
                
                let parentTrees = [];
                let currentTreeOid = parentTreeOid;
                let currentDir = currentTree;
                let createdTrees = 0;

                for (const part of pathParts) {
                    let subtree = currentDir.find(entry => entry.path === part && entry.type === 'tree');
                    
                    if (!subtree) {
                        const newTreeOid = await git.writeTree({ fs, dir, tree: [] });
                        subtree = { path: part, mode: '040000', oid: newTreeOid, type: 'tree' };
                        currentDir.push(subtree);
                        createdTrees++;
                    }

                    parentTrees.push({ tree: currentDir, subtree });
                    currentTreeOid = subtree.oid;
                    currentDir = (await git.readTree({ fs, dir, oid: currentTreeOid })).tree;
                }

                for (let i = parentTrees.length - 1; i >= 0; i--) {
                    const { tree, subtree } = parentTrees[i];
                    tree.find(entry => entry.path === subtree.path).oid = currentTreeOid;
                    currentTreeOid = await git.writeTree({ fs, dir, tree });
                }
                
                let newCommitOid = null;
                if (doCommit) {
                    newCommitOid = await git.commit({
                        fs,
                        dir,
                        author: { name, email },
                        message: `Created directory: ${dirPath}`,
                        tree: currentTreeOid,
                        parent: parentCommitOid ? [parentCommitOid] : [],
                    });
                    logger.consoleDotLog(`New commit OID for directory creation: ${newCommitOid}`);
                } else {
                    staged.set(dirPath, {
                        type: 'writeDir',
                        treeOid: currentTreeOid,
                        filePath: dirPath,
                        action: 'staged'
                    });
                    logger.consoleDotLog(`Staged write for ${dirPath} with treeOid ${currentTreeOid}`);
                }

                return {
                    dirPath,
                    treeOid: currentTreeOid,
                    commitOid: newCommitOid,
                    createdTrees,
                    action: doCommit ? 'committed' : 'staged'
                };
            } catch (e) {
                logger.consoleDotLog('Error in mkdirdot:', e);
                throw e;
            }
        },

        async removeFileDot(fs, dir, filePath, doCommit = 1) {
            try {
                logger.consoleDotLog(`[removeFileDot] Starting removal for: ${filePath}, staged files: `, staged);
                
                filePath = filePath.replace(/^\/+|\/+$/g, '');
                const pathComponents = filePath.split('/');
                const fileName = pathComponents.pop();
                
                const parentCommitOid = await baseFunctions.resolveRef(fs, dir);
                const { commit } = await baseFunctions.readCommit(fs, dir, parentCommitOid);
        
                const { tree: rootTree } = await git.readTree({ 
                    fs, 
                    dir, 
                    oid: commit.tree 
                });
        
                // Store the file entry when found
                let fileEntry = null;
                let newTreeOid = null;
        
                // Check unnamed subtree first
                const subtrees = rootTree.filter(entry => entry.type === 'tree');
                const unnamedSubtree = subtrees.find(entry => entry.path === '');
                
                if (unnamedSubtree) {
                    const { tree: subtree } = await git.readTree({ 
                        fs, 
                        dir, 
                        oid: unnamedSubtree.oid 
                    });
                    
                    fileEntry = subtree.find(e => e.path === fileName);
                    if (fileEntry) {
                        logger.consoleDotLog(`[removeFileDot] Found ${fileName} in unnamed subtree`);
                        
                        const updatedSubtree = subtree.filter(e => e.path !== fileName);
                        const newSubtreeOid = await git.writeTree({ 
                            fs, 
                            dir, 
                            tree: updatedSubtree 
                        });
                        
                        const updatedRootTree = rootTree.map(entry => 
                            entry.path === '' && entry.type === 'tree'
                                ? { ...entry, oid: newSubtreeOid }
                                : entry
                        );
                        
                        newTreeOid = await git.writeTree({ 
                            fs, 
                            dir, 
                            tree: updatedRootTree 
                        });
                    }
                }
        
                // If not found in unnamed subtree, check regular path
                if (!fileEntry) {
                    const updateTree = async (treeOid, components) => {
                        const { tree } = await git.readTree({ fs, dir, oid: treeOid });
                        
                        if (components.length === 0) {
                            fileEntry = tree.find(e => e.path === fileName);
                            if (!fileEntry) {
                                throw new Error(`File ${fileName} not found in tree`);
                            }
                            const updatedTree = tree.filter(e => e.path !== fileName);
                            const newTreeOid = await git.writeTree({ fs, dir, tree: updatedTree });
                            return newTreeOid;
                        }
                        
                        const nextDir = components[0];
                        const subtreeEntry = tree.find(e => e.path === nextDir && e.type === 'tree');
                        if (!subtreeEntry) throw new Error(`Directory ${nextDir} not found`);
                        
                        const updatedSubtreeOid = await updateTree(subtreeEntry.oid, components.slice(1));
                        const updatedTree = tree.map(e => 
                            e.path === nextDir && e.type === 'tree' 
                                ? { ...e, oid: updatedSubtreeOid } 
                                : e
                        );
                        return await git.writeTree({ fs, dir, tree: updatedTree });
                    };
        
                    newTreeOid = await updateTree(commit.tree, pathComponents);
                }
        
                if (!fileEntry) {
                    throw new Error(`File ${filePath} not found in repository`);
                }
        
                let newCommitOid = null;
                if (doCommit) {
                    newCommitOid = await git.commit({
                        fs,
                        dir,
                        author: { name: "System", email: "system@example.com" },
                        message: `Removed file ${filePath}`,
                        tree: newTreeOid,
                        parent: [parentCommitOid],
                    });
                    logger.consoleDotLog(`[removeFileDot] Committed removal: ${newCommitOid}`);
                } else {
                    staged.set(filePath, {
                        type: 'remove',
                        oid: fileEntry.oid,
                        treeOid: newTreeOid,
                        filePath: filePath,
                        action: 'staged'
                    });
                    logger.consoleDotLog(`Staged removal for ${filePath} with blobOid ${fileEntry.oid}`);
                }
                
                return {
                    filePath,
                    treeOid: newTreeOid,
                    commitOid: newCommitOid,
                    action: doCommit ? 'committed' : 'staged',
                    blobOid: fileEntry.oid
                };
            } catch (e) {
                logger.consoleDotLog('[removeFileDot] ERROR:', e);
                throw e;
            }
        },
        
        async removeDirDot(fs, dir, dirPath, doCommit = 1) {
            try {
                dirPath = dirPath.replace(/^\/+|\/+$/g, '');
                const pathComponents = dirPath.split('/');
                const dirName = pathComponents.pop();
        
                const parentCommitOid = await baseFunctions.resolveRef(fs, dir);
                const { commit } = await baseFunctions.readCommit(fs, dir, parentCommitOid);
        
                const updateTree = async (treeOid, pathComponents) => {
                    const { tree } = await git.readTree({ fs, dir, oid: treeOid });
        
                    if (pathComponents.length === 0) {
                        const dirEntry = tree.find(entry => entry.path === dirName && entry.type === 'tree');
                        if (!dirEntry) {
                            throw new Error(`Directory ${dirName} not found`);
                        }
                        
                        const updatedTree = tree.filter(entry => entry.path !== dirName);
                        const newTreeOid = await git.writeTree({ fs, dir, tree: updatedTree });
                        return { newTreeOid, removedTreeOid: dirEntry.oid };
                    } else {
                        const nextDir = pathComponents[0];
                        const subtreeEntry = tree.find(entry => entry.path === nextDir && entry.type === 'tree');
                        if (!subtreeEntry) {
                            throw new Error(`Directory not found: ${nextDir}`);
                        }
        
                        const { newTreeOid: updatedSubtreeOid, removedTreeOid } = 
                            await updateTree(subtreeEntry.oid, pathComponents.slice(1));
        
                        const updatedTree = tree.map(entry => {
                            if (entry.path === nextDir && entry.type === 'tree') {
                                return { ...entry, oid: updatedSubtreeOid };
                            }
                            return entry;
                        });
        
                        const newTreeOid = await git.writeTree({ fs, dir, tree: updatedTree });
                        return { newTreeOid, removedTreeOid };
                    }
                };
        
                const { newTreeOid, removedTreeOid } = await updateTree(commit.tree, pathComponents);
                let newCommitOid = null;
                
                if (doCommit) {
                    newCommitOid = await git.commit({
                        fs,
                        dir,
                        author: { name: "System", email: "system@example.com" },
                        message: `Removed directory ${dirPath}`,
                        tree: newTreeOid,
                        parent: [parentCommitOid],
                    });
                } else {
                    staged.set(dirPath, {
                        type: 'removeDir',
                        treeOid: newTreeOid,
                        filePath: dirPath,
                        action: 'staged'
                    });
                    logger.consoleDotLog(`Staged removal for ${dirPath} with newTreeOid ${newTreeOid}`);
                }
                
                return {
                    dirPath,
                    treeOid: newTreeOid,
                    commitOid: newCommitOid,
                    removedTreeOid,
                    action: doCommit ? 'committed' : 'staged'
                };
            } catch (e) {
                logger.consoleDotLog('Error in removeDirDot:', e);
                throw e;
            }
        },       
    };

