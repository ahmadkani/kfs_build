import MagicPortal from '../libs/MagicPortalES6.js';
import git from 'isomorphic-git';
import { Logger } from '../libs/LoggerES6.js';
import fsManager from '../libs/workerUtils/fsManagerES6.js';
import dotGit from '../libs/gitOperations/dotGit.js';
import { config } from '../configES6.js';
import gitNoteManager from '../libs/workerUtils/gitNoteManager.js';

// -------------------------------------------------------
// 1. Environment Setup
// -------------------------------------------------------
const isNode = typeof self === 'undefined';

let selfObj;
let http;
console.log('1');

try {
  if (isNode) {
    // --- Node.js Specifics ---
    const { parentPort } = await import('worker_threads');
    console.log('12');

    // Polyfill 'self' for MagicPortal
    selfObj = {
      postMessage: (msg) => parentPort.postMessage(msg),
      addEventListener: (type, listener) => {
        if (type === 'message') {
          parentPort.on('message', (msg) => listener({ data: msg }));
        }
      }
    };

    // Load Node HTTP client
    const nodeHttp = await import('isomorphic-git/http/node');
    http = nodeHttp.default || nodeHttp;

  } else {
    // --- Browser Specifics ---
    selfObj = self;
    
    // FIX: Use the WEB http client for browsers. 
    // Do NOT import 'isomorphic-git/http/node' here.
    const webHttp = await import('./../libs/GitHttp.js');
    http = webHttp.default || webHttp;
  }
  console.log('HTTP: ', http);
} catch (e) {
  console.error('2', e);
}

// ... rest of your file (Imports, MagicPortal, etc)
// -------------------------------------------------------
// 2. Imports
// -------------------------------------------------------
// -------------------------------------------------------
// 3. Initialization
// -------------------------------------------------------
selfObj.onerror = (e) => {
  console.error('Worker initialization error:', e);
};

const portal = new MagicPortal(selfObj);
const logger = new Logger(config.logging.dotGit);
const FSManager = new fsManager();

function consoleDotLog(...parameters) {
  logger.consoleDotLog(...parameters);
}

function consoleDotError(...parameters) {
  logger.consoleDotError(...parameters);
}

consoleDotLog('gitWorker loaded.');

let dir = '/';
let username;
let password;
let ref = 'main';
let url = '';
let remote = 'origin';
let depth = 10;
let name = 'testUser';
let email = 'testUser@example.com';
let settingsFileAddresses = {};
let fs = null;
let gitConfigFilePath = '/settings';
let fsArgs = {};
let fsType;
let fsName;
let corsProxy = isNode ? null : config.corsProxy; 

// Auth object
const authenticate = {
  async fill() {
    consoleDotLog('authenticate', username, password);
    return { username: username, password: password };
  },
  async rejected() {
    const error = new Error("Authentication rejected");
    consoleDotLog("Authentication rejected", error);
    throw error;
  }
};

//This function sets the directory for your working directory
async function setDir(_dir) {
  dir = _dir;
}

function isValidUrl(url) {
  const pattern = /^https?:\/\/.+/;
  return pattern.test(url);
}

//setUrl is an essential function that should be called when you want to
//work with files in the fs, because fileSystem is named after url address
async function setUrl(_url) {
  consoleDotLog('seturl url ', _url)

  // FIX: Remove leading slashes or protocol-relative slashes
  if (typeof _url === 'string') {
      while(_url.startsWith('/')) {
          _url = _url.substring(1);
      }
  }

  if (!isValidUrl(_url)) {
    // Try prepending https:// if missing
    if (!_url.startsWith('http')) {
       _url = 'https://' + _url;
    } else {
       throw new Error("Invalid Git URL format.");
    }
  }
  url = _url;
}

async function setRef(_ref) {
  ref = _ref;
}

//This function sets depth
async function setDepth(_depth) {
  depth = _depth;
}

//Using this function sets the CorsProxy of your choice
async function setCorsProxy(_corsProxy) {
  // FIX: If running in Node, always set to null.
  if (isNode) {
    corsProxy = null;
  } else {
    corsProxy = _corsProxy;
  }
}

//Using this function sets the username and password to use in clone and other functions
async function setAuthParams(_username, _password) {
  username = _username;
  password = _password;
}

//this function sets up the remote that user wants to do things on
async function setRemote(_remote) {
  remote = _remote;
}

async function getRemote() {
  return remote;
}

async function setSettingsAddresses() {
  try {
      const libraries = await readSettingsFile('library'); 
      consoleDotLog('libs', libraries)
      const directories = await listFilesDot(); 
      consoleDotLog('directories', directories)

      if (libraries && directories){
        for (const [fileName, filePath] of Object.entries(libraries)) {
            if (!directories[filePath]) {
                throw new Error(`File not found: ${filePath}`);
            }

            settingsFileAddresses[filePath] = {
                fileName, 
                filePath,
            };
            console.log(`File mapped: ${filePath}`);
            return {success: true};
        }
      } else {
        return {success: false};
      }
  } catch (error) {
      console.error(`Error in setSettingsAddresses: ${error.message}`);
  }
}

async function getFileStoresFromDatabases(fsName, fsType) {
  consoleDotLog('entering getFileStoresFromDatabases object')
  return FSManager.getFileStoreNames(fsName, fsType);
}

async function setFs({ fsName: _fsName, fsType: _fsType }) {
  try {
    consoleDotLog('Initializing FS with:', { _fsName, _fsType });
    
    // 1. ALWAYS store configuration globally first
    fsName = _fsName;
    fsType = _fsType;

    // 2. NODE JS NATIVE FS
    if (isNode && _fsType === 'node') {
      const nodeFs = await import('fs');
      fs = nodeFs.default; 
      dir = _fsName; // In 'node' mode, fsName IS the real path on disk
      
      // FIX: Ensure the directory exists on disk
      await fs.promises.mkdir(dir, { recursive: true });
      
      consoleDotLog(`NodeNS Mode: Native FS initialized at ${dir}`);
      return fs;
    }

    // 3. NODE JS MEMORY (TEMP DIR)
    if (isNode && _fsType === 'memory') {
       const nodeFs = await import('fs');
       fs = nodeFs.default;
       const path = await import('path');
       const os = await import('os');
       
       // Calculate path exactly like NodeFS does
       const tempDir = path.join(os.tmpdir(), 'kfs_node_temp', _fsName.replace(/\//g, '_'));
       
       // FIX: Ensure the temp directory exists
       await fs.promises.mkdir(tempDir, { recursive: true });
       
       dir = tempDir; 
       consoleDotLog(`Node.js Memory Mode: Using temp directory ${dir}`);
       return fs;
    }

    // 4. BROWSER LOGIC
    if (!_fsName || !_fsType) throw new Error('fsName and fsType are required');
    
    const getFs = await FSManager.getFS(_fsName, _fsType);
    if (getFs && getFs.fs) fs = getFs.fs;
    if (!fs) throw new Error('Failed to initialize file system');
    return fs;
  } catch (error) {
    consoleDotError("Error initializing file system:", error);
    throw error;
  }
}

//this function sets up the branch that user wants to do things on
//gets branch name as parameter
//if there are uncommited changes this function return 2 and abort
async function checkoutBranch(_ref) {

    let current = await currentBranch();
    consoleDotLog('current branch', current)
    consoleDotLog('ref', ref)
    consoleDotLog('_ref', _ref)

    let branchesList = await listBranches();
    consoleDotLog('branchesList', branchesList)

    if (!branchesList.includes(_ref)){
      await createBranch({ref: _ref});
    }
    if (ref === _ref || current === _ref){
      consoleDotLog(`you are already on the branch ${_ref}`);
      return;
    }
    else{
      let changedFiles = await getCheckoutFilesList();
      if (Object.keys(changedFiles).length === 0){
        await checkout({ref: _ref, noCheckout: false, noUpdateHead: false});
        ref = _ref;
        await doFetch({url});
        consoleDotLog('done');
        return;
      }
      else{
        consoleDotLog('failed');
        return 0;
      }
    }

}

//create local branch, branch
async function createBranch(args) {
  //consoleDotLog('object', args.object);
  return await git.branch({
    ...args,
    fs,
    dir
  })
}

//git checkout function implementation
//gets ref as parameter
async function checkout(args) {
  return await git.checkout({
    ...args,
    fs,
    dir,
    remote,
  })
}

//this function lists local branches
async function listBranches() {
  return await git.listBranches({
    fs,
    dir,
  })
}

//this function lists local branches
//you can get another list for another remote by using setRemote function
async function listRemoteBranches() {
  try {
    return await git.listBranches({ fs, dir, remote });
  } catch (error) {
    consoleDotError("Error in listBranches:", error);
  }
}

// Get the current branch name
async function currentBranch() {
  return await git.currentBranch({
    fs,
    dir,
    fullname: false
  })
}

// Get the current branch's remote name
async  function currentRemote() {
  const branch = await currentBranch();
  return await getConfig(`branch.${branch}.remote`);
}

function parseIni(content) {
  const result = {};
  let currentSection = null;

  content.split(/\r?\n/).forEach((line) => {
    line = line.trim();
    if (!line || line.startsWith(';') || line.startsWith('#')) {
      // Ignore empty lines and comments
      return;
    }
    if (line.startsWith('[') && line.endsWith(']')) {
      // New section
      currentSection = line.slice(1, -1).trim();
      result[currentSection] = result[currentSection] || {};
    } else {
      // Key-value pair
      const [key, value] = line.split('=').map((part) => part.trim());
      if (currentSection) {
        result[currentSection][key] = value;
      }
    }
  });
  return result;
}

function stringifyIni(data) {
  let iniString = '';

  Object.keys(data).forEach((section) => {
    iniString += `[${section}]\n`;
    Object.entries(data[section]).forEach(([key, value]) => {
      iniString += `    ${key} = ${value}\n`;
    });
    iniString += '\n';
  });

  return iniString;
}

async function readSettingsFile(type = null, key = null) {
  try {
    const exists = await fs.promises.lstat(gitConfigFilePath).catch(() => null);
    if (!exists) {
        consoleDotError("Settings file does not exist yet.");
        return {};
    }
    
    const settingsPath = await fs.promises.readdir(`${dir}`)
    if (settingsPath.includes('settings')){
      const content = await fs.promises.readFile(gitConfigFilePath);
      const settingsData = parseIni(content);
      consoleDotLog('settingsData,',settingsData)

      if (type && key) {
        return settingsData[type] && settingsData[type][key] ? settingsData[type][key] : null;
      } else if (type) {
        return settingsData[type] ? settingsData[type] : null;
      }

      return settingsData;
    }
    else{
      consoleDotError('The settings file dosen\'t exist yet!')
      return;    
    }
  } catch (err) {
    if (err.code === 'ENOENT') return {};
    throw err;
  }
}

async function writeSettingsFile(data) {
  const iniContent = stringifyIni(data);
  await writeFile({filePath: gitConfigFilePath, fileContents: iniContent});
}

async function addToSetting(type, key, value) {
  let settingsData = {};
  try {
    settingsData = await readSettingsFile();
    consoleDotLog(settingsData)
    if (!settingsData){
      settingsData = {};
      consoleDotLog('No past data is available. New file will be created.');
    }
    if (!settingsData[type]) {
      settingsData[type] = {};
    }
  
    settingsData[type][key] = value;
    consoleDotLog('settingsData',settingsData);
    await writeSettingsFile(settingsData);
    consoleDotLog('done');

  } catch (error) {
    consoleDotLog('No past data is available.');
  }


}

// Not used!
//This function gets a filePath and push it to a remote repository
//gets username, email, commitMessage (optional), url and filePath as parameters 
async function doPushFile(args) {
  try {
    await addFile(args);
    await commit(args);
    return await push(args);
  }
  catch (error){
    consoleDotLog('Something bad happened pushing your file: ', error)
  }
}

//This function push all changed files to the remote repo
//gets username, email, commitMessage, remote, url as parameters
// Not used!
async function doPushAll(args) {
  try {
    await addDot();
    await commit(args);
    return await push(args);
  }
  catch (error){
    consoleDotLog('Something bad happened pushing your files: ', error)
  }
}

//This function removes a filePath from a remote repository
//gets username, email, commitMessage, remote, url and filePath as parameters 
async function removeAndPush(args) {
  try {
    await remove(args);
    await commit(args);
    await push(args);
  }
  catch (error){
    consoleDotLog('Something bad happened pushing your files: ', error)
  }
}

//this function fetches the last information for the given url
//you can change depth by using setDepth
//remote is a prerequisite for this function which is being set using clone
async function doFetch(args) {
  let attempt = args?.attempt || 0;
  let _ref = args?.ref || ref;
  
  const maxDeleteRetries = 1;
  consoleDotLog('Doing fetch operation');
  !url && await setUrl(args?.url);
  try {
      const fetchOptions = {
        ...args,
        fs,
        http,
        dir,
        ref: _ref,
        url, // Use global sanitized url
        remote,
        depth,
        tags: true,
        headers: buildHeaders(username, password),
        onAuth() { return authenticate.fill(); },
        onAuthFailure() { return authenticate.rejected(); },
      };

      // Only add corsProxy if it exists
      if (corsProxy) {
        fetchOptions.corsProxy = corsProxy;
      }

      await git.fetch(fetchOptions);
      
      // await ensureAllFilesHaveNotes();
      return {success: true};}
      catch (error) {
    consoleDotError('some error happend while fetching: ', error);
    await handleGitError(error, args, 'doFetch', maxDeleteRetries);
    return {success: false};
  }
}

async function listFilesAsTree(dir = '/', indent = '') {
  let entries;
  try {
    entries = await fs.promises.readdir(dir);
  } catch (e) {
    consoleDotError(`Failed to read ${dir}:`, e);
    return;
  }

  for (const entry of entries) {
    const fullPath = dir.endsWith('/') ? dir + entry : dir + '/' + entry;
    let stat;
    try {
      stat = await fs.promises.stat(fullPath);
    } catch (e) {
      // consoleDotError(`Failed to stat ${fullPath}:`, e);
      continue;
    }

    if (stat.type === 'dir') {
      consoleDotLog(`${indent}📁 ${entry}`);
      await listFilesAsTree(fullPath, indent + '  ');
    } else {
      try{
      const content = await fs.promises.readFile(fullPath, 'utf8')
      consoleDotLog(`${indent}📄 ${entry} : `, content);
      } catch{}
    }
  }
}


// args can be {url} or some other args accepted by the function
async function listServerRefs(args) {
  let attempt = args?.attempt || 0;
  
  const maxRetries = 1;

  !url && await setUrl(args?.url);
  
  try {
    await setConfigs(args);
    try {
        const refs = await git.listServerRefs({
          ...args,
          fs,
          url,
          http,
          dir,
          corsProxy,
          remote,
          headers: buildHeaders(username, password),
          onAuth() {
            return authenticate.fill();
          },
          onAuthFailure() {
            return authenticate.rejected();
          },
        });
        consoleDotLog('listServerRefs result:', refs);
        return { success: true, refs };
    } catch (error) {
      throw error;
    }
  } catch (error) {
    consoleDotError('some error happened while listing server refs: ', error);
    await handleGitError(error, args, 'listServerRefs', maxRetries);
    return { success: false, error: error.message };
  }
}

// In gitWorker.js

const mergeDriver = ({ contents, filepath }, strategy = 'theirs') => {
  // contents[0]: base
  // contents[1]: ours (local)
  // contents[2]: theirs (remote)
  
  if (contents[1] === contents[2]) return { cleanMerge: true, mergedText: contents[1] };
  if (contents[0] === contents[2]) return { cleanMerge: true, mergedText: contents[1] };
  if (contents[0] === contents[1]) return { cleanMerge: true, mergedText: contents[2] };

 switch (strategy) {
  case 'ours':
  case 'local': // <--- FIX: Map 'local' to 'ours'
    return { cleanMerge: true, mergedText: contents[1] };
  case 'theirs':
  case 'remote':
    return { cleanMerge: true, mergedText: contents[2] };
  case 'combine':
    return {
      cleanMerge: true,
      mergedText: `<<<<<<< ours\n${contents[1]}\n=======\n${contents[2]}\n>>>>>>> theirs\n`
    };
  default:
    // SAFER DEFAULT: Default to 'ours' (local) to prevent data loss
    return { cleanMerge: true, mergedText: contents[1] };
}
};
async function merge(
ours = 'main',
theirs = 'origin/main',
strategy = 'theirs', // 'ours', 'theirs', 'combine'
{ 
  onConflict = null,
  author = { name, email} 
} = {}
) {
try {
  const customMergeDriver = onConflict || (({ contents, filepath }) => 
    mergeDriver({ contents, filepath }, strategy)
  );

  
  const result = await git.merge({
    fs,
    dir,
    ours,
    theirs,
    mergeDriver: customMergeDriver,
    fastForwardOnly: false,
  });

  return result;

} catch (error) {
  if (error.message.includes('MergeConflictError')) {
    // Get conflicted files
    const status = await git.statusMatrix({ fs, dir });
    const conflicted = status.filter(s => s[2] === 2).map(s => s[0]);

    if (strategy === 'combine') {
      // For combine strategy: write conflict markers but don't auto-reset
      console.log('Merge conflicts preserved. Resolve these files:');
      console.log(conflicted.join('\n'));
      
      return {
        status: 'conflicted',
        conflictedFiles: conflicted,
        message: 'Resolve conflicts and commit',
        commit: async () => {
          for (const file of conflicted) {
            await git.add({ fs, dir, filepath: file });
          }
          return git.commit({
            fs,
            dir,
            author,
            message: 'Merge with conflicts resolved'
          });
        }
      };
    }

    // For other strategies: abort the merge
    await git.mergeReset({ fs, dir });
    throw error;
  }
  throw error;
}
}

// In gitWorker.js

async function getCommitHistoryFromReplica(args = {}) {
  const mainFsName = fsName;
  const mainDir = dir; // Save context

  try {
    const _depth = args?.depth || 10;
    
    consoleDotLog('Initializing replica FS...');
    await setFs({ fsName: `${mainFsName}_replica`, fsType });
    
    // FIX: Use clone instead of pull for an empty directory
    // pull requires an existing git repo. clone creates it.
    consoleDotLog('Cloning to replica...');
    await clone({ url, depth: _depth, noCheckout: true }); 
    
    consoleDotLog('Getting commit logs...');
    const logs = await log({depth: _depth});
    
    const commits = logs.map(commit => commit.oid);
    
    return {
      success: true,
      commits: commits,
      head: commits[0] || null
    };
  } catch (error) {
    consoleDotError('Error getting commit history from replica:', error);
    return { success: false, error: error.message, commits: [] };
  } finally {
    // ALWAYS restore context
    await setFs({ fsName: mainFsName, fsType });
    dir = mainDir;
  }
}

// usage: await getLatestRemoteCommit({ url: remoteRepoUrl, ref: 'main' });
async function getLatestRemoteCommit(args) {
  consoleDotLog('getLatestRemoteCommit args:', args);
  let result = { success: false, refs: null }
  const _url = args?.url || url;
  
  if (_url) {
    // Removed timeout parameter
    result = await listServerRefs({...args, url: _url});
  } else {
    return result;
  }
  // consoleDotLog('getLatestRemoteCommit result:', result);
  const _ref = args?.ref || ref || 'HEAD';
  // consoleDotLog('getLatestRemoteCommit _ref:', _ref);
  if (!result.success) {
    consoleDotError('Failed to fetch server refs', result.error);
    return { success: false, error: result.error };
  }

  const refs = result?.refs;
  let headOid = refs.find(ref => ref.ref === `refs/heads/${_ref}`)?.oid;

  if (!headOid) {
    const mainRef = refs.find('refs/heads/main' || ref.ref === 'refs/heads/master');
    headOid = mainRef?.oid;
  }

  if (!headOid) {
    consoleDotError('Could not determine latest remote commit.');
    return { success: false, error: `No HEAD or ${ref} main/master ref found` };
  }
  consoleDotLog('headOid', headOid);
  return {
    success: true,
    commit: headOid,
  };
}

// isSync function checks if user's last local commit is equal to the
// last remote commit or not, gets url as argument
// returns true if it is sync and false if it's not
async function isSync(_url = url) {
  try {
    const lastLocalRef = await getLastLocalCommit();
    const url = _url || url || await getRemoteUrl() || '';

    const remoteResult = await getLatestRemoteCommit({ url });

    if (!remoteResult.success) {
      consoleDotError('Failed to get latest remote commit:', remoteResult.error);
      return true;
    }

    const lastRemoteCommit = remoteResult.commit;

    if (lastRemoteCommit === lastLocalRef) {
      consoleDotLog('lastRemoteCommit', lastRemoteCommit, 'localRef', lastLocalRef);
      return true;
    } else {
      consoleDotLog('lastRemoteCommit', lastRemoteCommit, 'localRef', lastLocalRef);
      return false;
    }
  } catch (error) {
    consoleDotLog(
      'Some error happened while checking whether you are in sync or not:',
      error
    );
    return false;
  }
}


async function getRemoteCommitInLocalRepo() {
  try{
    let lastRemoteCommit = await git.resolveRef({ fs, dir, ref: `/refs/remotes/${remote}/${ref}` });
    return lastRemoteCommit?.trim();
  }
  catch(error){
    consoleDotLog(
      'some error happend while getting last remote commit: '
    , error);
  }
}

async function getLastLocalCommit(_ref) {
  try{
    const branch = _ref || ref || 'HEAD';
    consoleDotLog('branch', branch)
    const localRef = await git.resolveRef({ fs, dir, ref: `refs/heads/${branch}` });
    return localRef?.trim();
  }
  catch(error){
    consoleDotLog(
      'some error happend while getting last local commit: '
    , error);
  }
}

//parameters are remote and url. this function adds remote for a url
async function addRemote(_url = url, _remote = remote) {
  try{
    await setRemote(_remote);
    return await git.addRemote({
      url: _url,
      force: true,
      fs,
      dir,
      remote: _remote,
    });
  }
  catch(error){
    consoleDotLog('some error happend while adding remote: ', error)
  }
}

async function deleteRemote(_remote = remote) {
  try{
    return await git.deleteRemote({
      fs,
      dir,
      remote: _remote,
    });
  }
  catch(error){
    consoleDotLog('some error happend while adding remote: ', error)
  }
}

//lists remotes for a fs
async function listRemotes() {
  return await git.listRemotes({
    fs,
    dir
  });
}

//args are remote and url
async function handleNoRef(args) {
  try {
    const _url = url || args?.url;
    const _remote = remote || args?.remote;
    consoleDotLog('handleNoRef args: ', args, _url, _remote, url, remote);

    await addRemote(_url, _remote);
    let branchList = await listRemoteBranches() || [];
    consoleDotLog(branchList)
    if (branchList.length == 0) {
      return false;
    }
  } catch (error) {
      consoleDotError("Error handling no ref:", error);
      throw error; 
  }
}

async function init() {
  
  try {

    const dirExists = await checkDirExists();
    consoleDotLog('Directory exists:', dirExists);

    if (dirExists) {
      return {     
        message: 'Directory already exists', 
        success: true, 
        alreadyInitialized: true 
      };
    }
    else {
      // FIX: Use 'dir' variable (set by setFs) instead of '/'
      await git.init({fs, dir, defaultBranch: 'main'});
      
      consoleDotLog('Initializing repository...');
  
      await setFs({ fsName, fsType });
      await createInitialCommit();
      await initializeLocalBranches();
      await initRepoNotes(fsType, 'root');
      
      consoleDotLog('Initialization completed successfully');
      return { 
        message: 'Initialization successful', 
        success: true, 
        alreadyInitialized: false 
      };
  
    }    
  } catch (error) {
    consoleDotLog('Initialization failed:', error);
    return { 
      message: 'Initialization failed', 
      success: false, 
      error: error.message 
    };
  }
}

async function createInitialCommit() {
  try {
    // Create initial commit
    const commitOid = await git.commit({
      fs,
      dir, // FIX: Use 'dir' variable instead of '/'
      message: 'Initial commit',
      author: {
        name: 'ahmad',
        email: 'ahmad@kani.com'
      }
    });

    consoleDotLog(`Created initial commit: ${commitOid}`);

    return { 
      success: true, 
      commitOid,
      message: 'Initial commit created successfully' 
    };
    
  } catch (error) {
    consoleDotLog('Failed to create initial commit:', error);
    return { 
      success: false, 
      error: error.message,
      message: 'Failed to create initial commit' 
    };
  }
}

async function checkDirExists() {
  try {
    const contents = await fs.promises.readdir(dir);
    if (contents.length === 0) return false;
    if (!contents.includes('.git')) return false;

    // Verify remote configuration
    try {
      // This command will throw NoRefspecError if config is corrupted
      const remotes = await git.listRemotes({ fs, dir });
      const origin = remotes.find(r => r.remote === 'origin');
      
      // If origin exists and URL matches, it's valid
      if (origin && origin.url === url) {
        return true;
      } else {
        consoleDotLog('Remote missing or URL mismatch. Treating as non-existent.');
        return false;
      }
    } catch (e) {
      // FIX: If config is broken (NoRefspecError), treat as non-existent
      consoleDotLog('Git config check failed (corrupted repo?), assuming directory needs re-cloning.', e.message);
      return false;
    }

  } catch (err) {
    if (err.code === 'ENOENT') return false;
    throw err;
  }
}

async function findMergeBase(oids) {
  try {
    return await git.findMergeBase({
      fs,
      dir,
      oids: oids,
    });
  } catch (error) {
    consoleDotError('Error finding merge base:', error);
  }
}

async function resolveMergeConflict() {
  try {
    consoleDotLog("🔄 Handling merge conflict in git-only storage...");

    // 1. Get the list of conflicted files from git
    const status = await git.statusMatrix({ fs, dir });
    const conflictedFiles = status.filter(row => row[3] === 3).map(row => row[0]);

    if (conflictedFiles.length === 0) {
      consoleDotLog("✅ No conflicted files found in git index");
      return { success: true, resolved: false };
    }

    consoleDotLog(`⚠️ Found ${conflictedFiles.length} conflicted files in git:`, conflictedFiles);

    // 2. Resolve conflicts directly in git index
    for (const filepath of conflictedFiles) {
      try {
        consoleDotLog(`🔧 Resolving ${filepath} in git index...`);

        // Get the "ours" version (stage 2)
        const ourVersion = await git.readBlob({
          fs,
          dir,
          oid: await git.resolveRef({ fs, dir, ref: 'HEAD' }),
          filepath
        }).catch(() => null);

        // Get the "theirs" version (stage 3)
        const theirVersion = await git.readBlob({
          fs,
          dir,
          oid: await git.resolveRef({ fs, dir, ref: `refs/remotes/${remote}/${ref}` }),
          filepath
        }).catch(() => null);

        // Choose which version to keep (default to "ours")
        const resolvedContent = ourVersion?.blob || theirVersion?.blob || '';

        // Write resolved version directly to git index
        await git.add({ 
          fs, 
          dir, 
          filepath,
          // Force add even if file doesn't exist in working directory
          force: true 
        });

        consoleDotLog(`✅ Resolved ${filepath} in git index`);
      } catch (error) {
        consoleDotError(`❌ Failed to resolve ${filepath} in git index:`, error);
      }
    }

    consoleDotLog("✅ All conflicts resolved in git index");
    return { success: true, resolved: true, conflictedFiles };

  } catch (error) {
    consoleDotError("❌ Failed to resolve git-only merge conflicts:", error);
    return { success: false, error: error.message };
  }
}

async function handleGitError(error, args, operationName, maxDeleteRetries = 1, tryReset = 0) {
  consoleDotError(`Some error happened while ${operationName}: `, error);
  
  // 1. Handle Notes errors (ignore them, don't delete repo)
  if (error.code === 'NotFoundError' && error.data?.what?.includes('refs/notes')) {
    consoleDotLog('Notes not found on remote, ignoring.');
    throw error; 
  }

  // 2. Detect Configuration Errors (Corrupted .git)
  const isConfigError = error.code === 'NoRefspecError' || 
                       (error.code === 'NotFoundError' && !error.data?.what?.includes('refs/notes'));

  const errorMessage = (error.message || error.toString()).toLowerCase();
  
  // 3. Detect Browser Network Errors (CORS, Failed to fetch)
  const isBrowserFetchError = error.name === 'TypeError' && errorMessage.includes('failed to fetch');
  
  const isAuthError = error && (error.code === 'HttpError' && (error.data?.statusCode === 401 || error.data?.statusCode === 403));
  
  // Treat timeouts, browser fetch errors, and network errors as temporary issues
  const isNetworkError = error.code === 'HttpError' || isBrowserFetchError || (errorMessage.includes('network') && !isConfigError);
  
  // If it's a config error, we delete and reclone
  if (isConfigError) {
     consoleDotLog('Configuration error detected. Deleting and recloning...');
     const attempt = args?.attempt || 0;
     if (attempt < maxDeleteRetries) {
        await handleDeleteCloseAndReclone({...args, attempt: attempt + 1});
        return;
     }
  }

  // If it's a network/auth error, DO NOT DELETE local data
  if (isAuthError || isNetworkError) {
    consoleDotLog(`Network/Auth error detected. Keeping local data safe.`);
    throw error;
  }

  // Default handling
  const attempt = args?.attempt || 0;
  if (attempt < maxDeleteRetries) {
    consoleDotLog(`Unknown error, attempting recovery.`);
    throw error;
  } else {
    throw new Error(`${operationName} wasn't successful: ${error}`);
  }
}

async function handleHardReset(args) {
  const attempt = args?.attempt + 1 || 1;

  consoleDotLog(`Attempting hard reset for ${fsName}. Attempt: ${attempt}`);

  try {

    await hardReset({dir, ref: 'HEAD~1', branch: ref})

    consoleDotLog(`Hard reset to HEAD~1 successful for ${fsName}`);
    
    return attempt;

  } catch (error) {
    consoleDotError(`Error during hard reset for ${fsName}: `, error);
    throw error;
  }
}

async function handleDeleteCloseAndReclone(args) {
  const attempt = args?.attempt + 1 || 1;
  const reclone = args?.reclone || false;
  const _fsName = args?.fsName || fsName;
  const _fsType = args?.fsType || fsType;

  try {
    // FIX: Handle Node.js deletion natively
    if (isNode) {
       // In Node, _fsName is the actual path on disk
       const path = await import('path');
       // Use recursive delete
       await fs.promises.rm(_fsName, { recursive: true, force: true });
       consoleDotLog(`Deleted Node directory: ${_fsName}`);
    } else {
       // In Browser, use fsManager
       await FSManager.deleteFS(_fsName, _fsType);
    }

    if (reclone) await doCloneAndStuff({ ...args, url: args.url, attempt });
    return;

  } catch (error) {
    consoleDotError(`Error during delete, close, and reclone process for ${fsName}: `, error);
  }
}

//returns false if the repo is not initiated yet
//parameters are url, remote, ...
//you can change depth by using setDepth function
async function doCloneAndStuff(args) {
  consoleDotLog('doCloneAndStuff args: ', args);
  let useNetwork = false;
  let attempt = args?.attempt || 0;
  
  const maxDeleteRetries = 1;
  !url && await setUrl(args?.url);
  await setDepth(depth);

  try {
    let handleNoRefResult = true;
    let dirExists = await checkDirExists();
    consoleDotLog('dirExists', dirExists)
    
    if (dirExists && !useNetwork) {
      consoleDotLog(`Directory already exists. Using existing directory...`);
      let head = await currentBranch();
      await setRef(head);
      return ({handleNoRefResult, message: 'exists', success: true});
    } else {
      consoleDotLog(`Cloning repository ...`);
      
      // FIX: Clean directory if it exists (it might be corrupted)
      try {
         await fs.promises.access(dir);
         // If we reach here, directory exists but checkDirExists returned false
         consoleDotLog(`Removing corrupted or incomplete directory: ${dir}`);
         await fs.promises.rm(dir, { recursive: true, force: true });
      } catch (e) {
         // Directory doesn't exist, which is perfect
      }

      const cloneResult = await clone(args);
      // FIX: Only use fsManager in Browser (non-Node) environments
      // In Node, we use native FS, so we don't need LightningFS backups.
      if (!isNode) {
         await FSManager.createBackupFS(fsName, fsType);
         consoleDotLog('createBackupFS created backup')
      }
      
      await setFs({ fsName, fsType });
      let head = await currentBranch();
      await setRef(head);
      consoleDotLog(cloneResult, head)
      if (cloneResult?.data){
        if (cloneResult?.data?.isCacheUsed){
          await fastForward({
            url: args.url,
          });
        }
      }
      handleNoRefResult = await handleNoRef(args);
      await initializeLocalBranches();
    }

    await initRepoNotes(fsType, 'root');
    return ({handleNoRefResult, message: 'notExist', success: true});
  } catch (error) {
      await handleGitError(error, args, 'doCloneAndStuff', maxDeleteRetries);
      return { handleNoRefResult: false, message: "error", success: false };
  }
}

async function isDirectory(path) {
  const stat = await fs.promises.lstat(path);
  return stat.isDirectory();
}

//this function removes a dir and its subdirectories recursively from FS
//it also removes a file if the path is to a file
async function removeRecursively(path) {
  try {
    if (!await isDirectory(path)) {  
      await unlink(path);
    }
    else{
      const files = await fs.promises.readdir(path);
      for (const file of files) {
        const fullPath = `${path}/${file}`;
        if (await isDirectory(fullPath)) {
          await removeRecursively(fullPath); // Recursively remove subdirectory contents
          await fs.promises.rmdir(fullPath); // Remove subdirectory
        } else {
          await unlink(fullPath); // Remove file
        }
        await fs.promises.rmdir(path);
      }
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      consoleDotLog(`File ${path} already deleted, skipping...`);
      return;
    }
    consoleDotError("Error while removing directory contents:", error);
  }
}

async function initializeLocalBranches() {
  try {
    let remoteBranches = await listRemoteBranches();
    let localBranches = await listBranches();
    consoleDotLog('remoteBranches', remoteBranches);
    consoleDotLog('localBranches', localBranches);
    
    localBranches.push('HEAD');
    const filteredBranches = remoteBranches.filter(item => !localBranches.includes(item));
    consoleDotLog('filteredBranches', filteredBranches);
    
    let path = (dir === '/') ? '' : dir;
    
    await Promise.all(filteredBranches.map(async item => {
      // 1. Create the branch reference
      await createBranch({
        ref: item,
        object: path + '/' + `.git/refs/remotes/${remote}/${item}`
      });
      
      // 2. Read the file content using Native Node FS (string path only)
      const refPath = path + '/' + `.git/refs/remotes/${remote}/${item}`;
      const fileContent = await fs.promises.readFile(refPath, 'utf8'); // FIX: Use string path, not object
      
      // 3. Write the file
      await writeFile({
        filePath: path + '/' + `.git/refs/heads/${item}`,
        fileContents: fileContent
      });
    }));
  } catch (error) {
      consoleDotError("Error initializing local branches:", error);
      throw error; 
  }
}

function buildHeaders(username, password) {
  if (!username && !password) {
    consoleDotLog('No username or password provided. Returning empty headers.');
    return {};
  }
  return {
    authorization: `Basic ${btoa(`${username}:${password}`)}`
  };
}

async function clone(args) {
  try {
    // FIX: Explicitly use the clean 'url' variable, not args.url which might be raw
    // FIX: Do not pass 'corsProxy' if it is null/undefined/empty
    
    const cloneOptions = {
      ...args,
      fs,
      corsProxy,
      http,
      dir,
      remote,
      ref,
      depth,
      force: true,
      noCheckout: true,
      singleBranch: false,
      headers: buildHeaders(username, password),
      url: url, // <--- USE THE SANITIZED GLOBAL 'url' VARIABLE
      onAuth() {
        return authenticate.fill();
      },
      onAuthFailure() {
        return authenticate.rejected();
      },
    };

    // Only add corsProxy if it actually has a value
    if (corsProxy) {
      cloneOptions.corsProxy = corsProxy;
    }

    // Fix 'AlreadyExistsError'
    try {
      await git.deleteRemote({ fs, dir, remote: 'origin' });
    } catch (e) { 
      // Ignore if remote doesn't exist 
    }

    const cloneResult = await git.clone(cloneOptions);
    return cloneResult;
  } catch (error) {
    consoleDotError("Some error happened while cloning:", error);
    throw error;
  }
}

//gets filePath as parameter and returns relative path to the dir
async function relativePath(filePath){
  let path = filePath.split('/').filter(path => path.trim() !== ''); 
  let removeLen = dir.split('/').filter(path => path.trim() !== '').join('').length;
  path = path.join('/');
  path = (dir === '/' ? path : path.slice(removeLen+1));
  return path;
}

//gets filePath as parameter and removes the filePath from .git and fs
async function remove(args) {
  try {
    let filePath = await relativePath(args.filePath);
    await git.remove({
      fs,
      dir, 
      filepath: filePath
    })
    await removeRecursively(args.filePath);
  } catch (error) {
    consoleDotError("Error while removing the file:", error);
  }
}

//gets filePath as parameter
async function unlink(filePath) {
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    consoleDotError("Error occured while unlinking:", error);
  }
}

//Expired
async function rename(oldPath, newPath) {
  try {
    if (oldPath === newPath){
      return;
    }
    await mkdirDot(newPath);
    await fs.promises.rename(oldPath, newPath);
  } catch (error) {
    consoleDotError("Error occured while renaming filePath:", error);
  }
}

//gets nothing but dir and returns log of commits
//you can change depth by using setDepth function
async function log(args = {}) {
  try {
    consoleDotLog('Attempting to retrieve log with the following args:', { ...args, fs, depth, dir, ref });
    const logResult = await git.log({ ...args, fs, depth, dir, ref });
    consoleDotLog('git.log result:', logResult);
    return logResult;

  } catch (error) {
    consoleDotError("Error in log:", error);

    if (error && typeof error === 'object' && Object.keys(error).length > 0) {
      consoleDotError('Error properties:', Object.keys(error));
      consoleDotError('Full error object:', JSON.stringify(error, null, 2));
    } else {
      consoleDotError('An unknown error occurred, and no additional error details are available.');
    }

    throw new Error('An unknown error occurred during the log operation');
  }
}

/**
 * Pushes changes to the remote repository.
 * It uses the `git.push` method from the `isomorphic-git` library to push changes.
 * @param {Object} args - The arguments for the push operation.
 * @param {string} [args.url] - The URL of the remote repository to push to.
 * @param {string} [args.remote='origin'] - The name of the remote repository.
 * @param {string} [args.ref='HEAD'] - The reference to push (default is 'HEAD').
 * @param {boolean} [args.force=true] - Whether to force the push operation (default is true).
 * @param {string} [args.dir='/'] - The directory of the local repository.
 * @param {string} [args.headers=default] - Additional headers for the push operation.
 * @return {Promise<Object>} - A promise that resolves to an object indicating the success of the push operation.
 * @throws {Error} - Throws an error if the push operation fails after retries.
 */

async function push(args) {
  consoleDotLog(`Starting to push with these args: `, args);
  let attempt = args?.attempt || 0;
  let _ref = args?.ref || ref;
  // try{
  // const config = await fs.promises.readFile('/.git/config', 'utf8')
  // } catch(err) {
  //   consoleDotError(err)
  // }
  const maxDeleteRetries = 1;
  const force = args?.force || true;

  !url && await setUrl(args?.url);
  try {
    await setConfigs(args);
    try {
      await git.push({
        ...args,
        fs,
        http, // This uses the imported GitHttp
        dir,
        corsProxy, // Ensure this is passed so GitHttp can use it
        remote,
        ref: _ref,
        force: force, 
        // Pre-emptive auth header (Good for known private repos)
        headers: buildHeaders(username, password), 
        // Challenge-response auth (Necessary if server requires negotiation)
        onAuth() {
          return authenticate.fill();
        },
        onAuthFailure() {
          return authenticate.rejected();
        },
      });
        consoleDotLog('Pushing was successful.');
        return {success: true};
    } catch (error) {
      throw error;
    }
  } catch (error) {
    consoleDotError('some error happend while pushing: ', error);
    await handleGitError(error, args, 'push', maxDeleteRetries);
    return {success: false};
  }
}

// the operations are 'push' | 'pop' | 'apply' | 'drop' | 'list' | 'clear'
async function stash(operation = 'push') {
  try {
    if (!(await getEmail() && await getUsername())) {
      await setUsername({username: name});
      await setEmail({email: email});
    }
    
    await git.stash({
      fs,
      dir,
      op: operation,
    })

  } catch (error) {
    consoleDotError('An error occurred while stashing:', error);
  }
}

async function status(args) {
  return await git.status({
    fs,
    dir,
    filepath: args?.filePath,
  });
}

async function softReset(commitHash, branch = ref = 'HEAD') {
  fs.writeFile(dir + `/.git/refs/heads/${branch}`, commitHash, (err) => {
    if (err) throw err;
    console.log('git reset has successfully done.');
  });
}

// works like this: await hardReset({ dir, ref: 'HEAD~1', branch: ref });
async function hardReset({dir, ref, branch}) {
  var re = /^HEAD~([0-9]+)$/
  var m = ref.match(re);
  if (m) {
      var count = +m[1];
      var commits = await git.log({fs, dir, depth: count + 1});
      var commit = commits.pop().oid;
      return new Promise((resolve, reject) => {
          fs.writeFile(dir + `/.git/refs/heads/${branch}`, commit, (err) => {
              if (err) {
                  return reject(err);
              }
              fs.unlink(dir + '/.git/index', (err) => {
                  if (err) {
                      return reject(err);
                  }
                  git.checkout({ fs, dir, ref: branch, force: true }).then(resolve);
              });
          });
      });
  }
  return Promise.reject(`Wrong ref ${ref}`);
}

//This function takes username as argument
async function setUsername(args) {
  try {
    const _name = args?.name ? args?.name : 'sampleUser';
    name = _name;
    await git.setConfig({
      fs,
      dir,
      path: 'user.name',
      value: _name
    })
  } catch (error) {
    consoleDotError('An error occurred while setting user name:', error);
  }
}

//This function takes email as argument
async function setEmail(args) {
  try {
    const _email = args?.email ? args?.email : 'sampleUser';
    email = _email;
    await git.setConfig({
      fs,
      dir: dir,
      path: 'user.email',
      value: _email
    })
  } catch (error) {
    consoleDotError('An error occurred while setting email:', error);
  }
}

async function getEmail() {
  try {
    const email = await git.getConfig({
      fs,
      dir,
      path: 'user.email'
    });
    consoleDotLog(email);
    return email;
  } catch (error) {
    consoleDotError('An error occurred while getting email:', error);
  }
}

// Function to get username
async function getUsername() {
  try {
    const username = await git.getConfig({
      fs,
      dir,
      path: 'user.name'
    });
    consoleDotLog(username);
    return username;
  } catch (error) {
    consoleDotError('An error occurred while getting username:', error);
  }
}

async function getRemoteUrl(_remote = remote) {
  try {
    return await git.getConfig({
      fs,
      dir,
      path: `remote.${_remote}.url`
    });
  } catch (error) {
    consoleDotError('An error occurred while getting remote url:', error);
  }
}

async function setRemoteUrl(_url = url, _remote = remote) {
  try {
    await git.setConfig({
      fs,
      dir,
      path: `remote.${_remote}.url`,
      value: _url
    });
  } catch (error) {
    consoleDotError('An error occurred while setting remote url:', error);
  }
}

async function getConfig(path) {
  try {
    const config = await git.getConfig({
      fs,
      dir,
      path: path
    });
    consoleDotLog(config);
    return config;
  } catch (error) {
    consoleDotError('An error occurred while getting config:', error);
  }
}

async function setConfig(path, value, args) {
  try {
    await git.setConfig({
      ...args,
      fs,
      dir,
      path: path,
      value: value
    });
  } catch (error) {
    consoleDotError('An error occurred while setting config:', error);
  }
}

/**
 * Sets the username and email for the git configuration.
 * It takes an object `args` as an argument, which can contain
 * `name` and `email` properties.
 * @param {*} args 
 */async function setConfigs(args) {
  try {
    await setUsername(args);
    await setEmail(args);
  } catch (error) {
    consoleDotError('An error occurred while setting configs:', error);
  } 
}

async function resolveRef(_ref = 'HEAD') {
  const head = await git.resolveRef({
    fs, 
    dir,
    ref: _ref
  });
  return head;
}

async function readCommit(head) {
  return await git.readCommit({
    fs, 
    dir, 
    oid: head 
  });
}

async function writeCommit(commit) {
  await git.writeCommit({
    fs,
    dir,
    commit: commit,
  });
}

async function writeRef(value, ref = 'refs/heads/main') {
  await git.writeRef({
    fs,
    dir,
    ref: ref,
    value: value,
  });
}

async function commitStagedChanges(message = '') {
  await dotGit.commitStagedChanges(fs, dir);
}

async function readFileDot(filePath, _commitOid = 'staged') {
  try {
    consoleDotLog(`[GITWorker] Reading file: ${filePath}`);
    const rootContents = await fs.promises.readdir('/');
    consoleDotLog('Root directory contents:', rootContents);
    
    const fileContent = await dotGit.readFileDot(fs, dir, filePath, _commitOid);
    consoleDotLog(`[GITWorker] Successfully read file: ${filePath}`);
    return fileContent;
  } catch (error) {
    consoleDotError(`[GITWorker] Failed to read file ${filePath}:`, error);
    throw new Error(`Failed to read file: ${error.message}`);
  }
}

async function readDirDot(dirPath, _commitOid = 'staged') {
  try {
    // await listFilesAsTree();
    consoleDotLog(`[GITWorker] Reading directory: ${dirPath}`);
    const contents = await dotGit.readDirDot(fs, dir, dirPath, _commitOid);
    consoleDotLog(`[GITWorker] Directory contents for ${dirPath}:`, contents);
    consoleDotLog('ATTACK: ', await listAllNotes());
    return contents;
  } catch (error) {
    consoleDotError(`[GITWorker] Failed to read directory ${dirPath}:`, error);
    throw new Error(`Failed to read directory: ${error.message}`);
  }
}

async function isDirectoryDot(path) {
  try {
    consoleDotLog(`[GITWorker] Checking if path is directory: ${path}`);
    const result = await dotGit.isDirectoryDot(fs, dir, path);
    consoleDotLog(`[GITWorker] Path ${path} is directory:`, result);
    return result;
  } catch (error) {
    consoleDotError(`[GITWorker] Failed to check directory status for ${path}:`, error);
    throw new Error(`Failed to check directory: ${error.message}`);
  }
}

async function listFilesDot(listDirs = 1) {
  try {
    
    consoleDotLog('[GITWorker] Listing all files');
    const files = await dotGit.listFilesDot(fs, dir, listDirs);
    consoleDotLog('[GITWorker] File list:', files);
    return files;
  } catch (error) {
    consoleDotError('[GITWorker] Failed to list files:', error);
    throw new Error(`Failed to list files: ${error.message}`);
  }
}

async function writeFileDot(filePath, fileContent, doCommit = 1) {
  try {
    consoleDotLog(`[GITWorker] Writing to file: ${filePath}`);
    
    // 1. First write the file content
    const result = await dotGit.writeFileDot(
      fs, dir, filePath, fileContent, name, email, doCommit
    );

    // 2. Get the OID for the written file
    let oid = result.blobOid;

    // 3. Add inode note with the obtained OID
    await gitNoteManager(fs, dir, 'add', 'inode', {
      oid: oid,
      filepath: filePath,
      customMetadata: {
        size: fileContent.length,
        operation: 'write',
        timestamp: new Date().toISOString()
      }
    }).catch(e => consoleDotError('Note addition failed:', e));

    consoleDotLog(`[GITWorker] Successfully wrote to file: ${filePath}`);
    return result;
  } catch (error) {
    consoleDotError(`[GITWorker] Failed to write to file ${filePath}:`, error);
    throw new Error(`Failed to write file: ${error.message}`);
  }
}

async function mkdirDot(dirPath, doCommit = 1) {
  try {
    consoleDotLog(`[GITWorker] Creating directory: ${dirPath}`);
    
    // First create the directory
    const result = await dotGit.mkdirDot(fs, dir, dirPath, name, email, doCommit);

    // Now get the OID after directory exists
    let oid = result.treeOid;

    // Add dentry note with the obtained OID
    await gitNoteManager(fs, dir, 'add', 'dentry', {
      oid: oid,
      filepath: dirPath,
      customMetadata: {
        operation: 'create',
        timestamp: new Date().toISOString()
      }
    });

    consoleDotLog(`[GITWorker] Successfully created directory: ${dirPath}`);
    return result;
  } catch (error) {
    consoleDotError(`[GITWorker] Failed to create directory ${dirPath}:`, error);
    throw new Error(`Failed to create directory: ${error.message}`);
  }
}

//path is the path to file
//it recursively makes directories that aren't made yet
async function mkdirRecursive(path) {
  const folders = path.split('/').filter(folder => folder.trim() !== '');
  let currentPath = '';
  for (const folder of folders) {
      if (currentPath === '/'){
      currentPath += folder;
      }
      else{
        currentPath += '/' + folder;
      }
      try {
        consoleDotLog('recur', currentPath);
          await fs.promises.mkdir(currentPath);
      } catch (error) {
          if (error.code === 'EEXIST') {
          } else {
              consoleDotError(`Error creating directory: ${currentPath}`, error);
          }
      }
  }
}

async function removeFileDot(filePath, doCommit = 1) {
  try {
    consoleDotLog(`[GITWorker] Removing file: ${filePath}`);
    const result = await dotGit.removeFileDot(fs, dir, filePath, doCommit);
    consoleDotLog(`[GITWorker] Successfully removed file: ${filePath}`);
    return result;
  } catch (error) {
    consoleDotError(`[GITWorker] Failed to remove file ${filePath}:`, error);
    throw new Error(`Failed to remove file: ${error.message}`);
  }
}

async function removeDirDot(dirPath, doCommit = 1) {
  try {
    consoleDotLog(`[GITWorker] Removing directory: ${dirPath}`);
    const result = await dotGit.removeDirDot(fs, dir, dirPath, doCommit);
    consoleDotLog(`[GITWorker] Successfully removed directory: ${dirPath}`);
    return result;
  } catch (error) {
    consoleDotError(`[GITWorker] Failed to remove directory ${dirPath}:`, error);
    throw new Error(`Failed to remove directory: ${error.message}`);
  }
}

async function getPathNote(path) {
  try {
    consoleDotLog('entering with path : ', path)
    if (path === '/') {
      return await gitNoteManager(fs, dir, 'read', 'superblock', { oid: 'HEAD', fsType }).catch(() => null);
    } else {
      let oid = await findInGitHistory(path);
      return await getNoteByOid(oid.oid, 'commits');
    }
  } catch (error) {
    consoleDotError(`Failed to get note for ${path}:`, error);
    throw error;
  }
}

async function getNoteByOid(oid, type) {
  try {
    const note = await gitNoteManager(fs, dir, 'read', type, { oid });
    return note;
  } catch (err) {
    if (err.message?.includes('Note not found')) {
      return null;
    }
    throw err;
  }
}

async function listAllNotes(detailed = true) {
  try {
    const [listOfNotes, superblock] = await Promise.all([
      gitNoteManager(fs, dir, 'list'),
      gitNoteManager(fs, dir, 'read', 'superblock', { oid: 'HEAD', fsType }).catch(() => null)
    ]);
    let detailedList = [];
    if (detailed) {
      listOfNotes.forEach((note) => {
        detailedList.push(gitNoteManager(fs, dir, 'read', 'commits', { oid: note.target }));
      });
      const resolvedDetails = await Promise.all(detailedList);
      return { listOfNotes, detailed: resolvedDetails, superblock };
    }

  } catch (error) {
    consoleDotError('Failed to list notes:', error);
    throw error;
  }
}

async function initRepoNotes(fsType = 'memory', owner = 'root') {
  try {
    consoleDotLog('[GITWorker] Initializing repository notes');
    
    // Verify we can read the root tree first
    let rootTreeOid = await git.resolveRef({ fs, dir, ref: 'HEAD' });
    
    // Initialize superblock if needed
    try {
      await gitNoteManager(fs, dir, 'read', 'superblock', { oid: 'HEAD', fsType });
      consoleDotLog('Superblock note already exists');
    } catch {
      await gitNoteManager(fs, dir, 'add', 'superblock', {
        oid: 'HEAD',
        fsType,
        customMetadata: {
          owner,
          created_at: new Date().toISOString(),
          block_size: 4096,
          features: []
        }
      });
      consoleDotLog('Created superblock note');
    }
    
    // Initialize root directory note if needed
    try {
      await gitNoteManager(fs, dir, 'read', 'dentry', { oid: rootTreeOid });
      consoleDotLog('Root directory note already exists');
    } catch {
      await gitNoteManager(fs, dir, 'add', 'dentry', {
        oid: rootTreeOid,
        customMetadata: {
          is_root: true,
          created_at: new Date().toISOString(),
          name: '/',
          parent_inode: 0,
          mode: '040755'
        }
      });
      consoleDotLog('Created root directory note');
    }
    
    consoleDotLog('[GITWorker] Repository notes initialized');
    return true;
  } catch (error) {
    consoleDotError('[GITWorker] Failed to initialize notes:', error);
    throw new Error(`Failed to initialize notes: ${error.message}`);
  }
}

async function ensureAllFilesHaveNotes(owner = username) {
  consoleDotLog('[GITWorker] Starting ensureAllFilesHaveNotes...');
  consoleDotLog(`[GITWorker] Owner: ${owner}`);

  let files = [];
  let notes = [];
  try {
    consoleDotLog('[GITWorker] Listing all files in the repository...');
    files = await listFilesDot(1);
    consoleDotLog(`[GITWorker] Total files/directories found: ${files.length}`);
  } catch (err) {
    consoleDotError('[GITWorker] Failed to list files:', err);
    return 0;
  }

  const fileMap = new Map();
  consoleDotLog('[GITWorker] Building file map...');
  for (const file of files) {
    fileMap.set(file.path, file);
    consoleDotLog(`[GITWorker] Mapped: ${file.path} (type: ${file.type}, oid: ${file.oid})`);
  }

  try {
    const listedNotes = await listAllNotes();
    consoleDotLog('[GITWorker] notes list: ', listedNotes);

    listedNotes.listOfNotes.forEach(item => notes.push(item.target))
    consoleDotLog('[GITWorker] notes list: ', notes);
  } catch(error) {
    consoleDotError(error);
  }
  const missingNotes = [];

  consoleDotLog('[GITWorker] Checking for missing notes...');
  for (const file of files) {
    const { path, type, oid } = file; 
    const noteType = type === 'tree' ? 'dentry' : 'inode';

    if (!oid) {
      consoleDotError(`[GITWorker] Skipping ${path}: missing OID.`);
      continue;
    }

    consoleDotLog(`[GITWorker] Checking for existing ${noteType} note for ${path}...`);
    try {
      !(file.oid in notes) && missingNotes.push({path, type: noteType, oid });
    } catch (err) {
      consoleDotLog(`[GITWorker] Error fetching note for ${path}. Assuming missing.`, err);
      missingNotes.push({ path, type: noteType, oid });
    }
  }

  consoleDotLog(`[GITWorker] Total missing notes: ${missingNotes.length}`, missingNotes);

  for (const { path, type, oid } of missingNotes) {
    consoleDotLog(`[GITWorker] Adding ${type} note for ${path}...`);
    const metadata = {
      owner,
      created_at: new Date().toISOString(),
      operation: 'auto-generated',
      timestamp: new Date().toISOString()
    };

    if (type === 'dentry') {
      const pathParts = path.split('/');
      const parentPath = pathParts.slice(0, -1).join('/') || '/';
      
      // Special case for root directory
      if (pathParts.length === 1) {
        // This is a top-level directory, its parent is the root
        try {
          // Get the root note using the commitOid
          const rootNote = 'HEAD';
          metadata.parentOid = rootNote;
        } catch {
          metadata.parentOid = 'HEAD';
        }
      } else {
        // Normal case - get parent from filemapp
        const parent = fileMap.get(parentPath);
        if (parent) {
          try {
            const parentOid = parent.oid;
            metadata.parentOid = parentOid || 'HEAD';
          } catch {
            metadata.parentOid = 'HEAD';
          }
        } else {
          metadata.parentOid = 'HEAD';
        }
      }
    }
    
    try {
      await gitNoteManager(fs, dir, 'add', type, {
        oid,
        filepath: path,
        customMetadata: metadata
      });
      consoleDotLog(`[GITWorker] Successfully added ${type} note for ${path}`);
    } catch (err) {
      consoleDotError(`[GITWorker] Failed to add ${type} note for ${path}`, err);
    }
  }

  consoleDotLog(`[GITWorker] ensureAllFilesHaveNotes completed. Total notes added: ${missingNotes.length}`);
  return missingNotes.length;
}


async function tryGetNote(path) {
  try {
    return await getPathNote(path);
  } catch (err) {
    consoleDotLog(`[GITWorker] No note found for ${path}`);
    return null;
  }
}

async function addMissingNotes(missingNotes, owner) {
  for (const { path, type, oid } of missingNotes) {
    try {
      consoleDotLog(`[GITWorker] Creating metadata for ${path}`);
      const metadata = buildMetadata(owner, type, path);

      await gitNoteManager(fs, dir, 'add', type, {
        oid,
        filepath: path,
        customMetadata: metadata
      });

      consoleDotLog(`[GITWorker] Successfully added ${type} note for ${path}`);
    } catch (error) {
      consoleDotError(`[GITWorker] Failed to add note for ${path}:`, error);
    }
  }
}

function buildMetadata(owner, type, path) {
  const baseMeta = {
    owner,
    created_at: new Date().toISOString(),
    operation: 'auto-generated',
    timestamp: new Date().toISOString()
  };

  if (type === 'dentry') {
    const parentPath = path.split('/').slice(0, -1).join('/') || '/';
    return {
      ...baseMeta,
      parent_inode: getParentInode(parentPath)
    };
  }

  return baseMeta;
}

async function getParentInode(parentPath) {
  consoleDotLog(`[GITWorker] Retrieving parent inode for: ${parentPath}`);
  try {
    const parentNote = await getPathNote(parentPath);
    const inode = parentNote?.inode || parentNote?.dentry_id || 0;
    consoleDotLog(`[GITWorker] Found parent_inode for ${parentPath}: ${inode}`);
    return inode;
  } catch {
    consoleDotLog(`[GITWorker] Failed to retrieve parent inode for ${parentPath}, defaulting to 0`);
    return 0;
  }
}

async function checkForLocalNotes() {
  try {
    consoleDotLog('[GITWorker] Checking for local notes');
    const notes = await gitNoteManager(fs, dir, 'list');
    if (notes.length > 0) {
      consoleDotLog('[GITWorker] Local notes found:', notes);
      return true;
    } else {
      consoleDotLog('[GITWorker] No local notes found');
      return false;
    }
  } catch (error) {
    consoleDotError('[GITWorker] Failed to check for local notes:', error);
    throw new Error(`Failed to check for local notes: ${error.message}`);
  }
}

async function findInGitHistory(path) {
  try {
    consoleDotLog(`[GITWorker] Searching git history for: ${path}`);
    const history = await dotGit.findInGitHistory(fs, dir, path);
    consoleDotLog(`[GITWorker] Found git history for ${path}:`, history);
    return history;
  } catch (error) {
    consoleDotError(`[GITWorker] Failed to search git history for ${path}:`, error);
    throw new Error(`Failed to search git history: ${error.message}`);
  }
}

//This function takes url, username, email
//as arguments and pulls the remote directory
async function pull(args) {
  let attempt = args?.attempt || 0;
  
  const maxDeleteRetries = 1;

  !url && await setUrl(args?.url);
  try {
    await setConfigs(args);
    try {
        await git.pull({
          ...args,
          fs,
          http,
          dir,
          corsProxy,
          remote,
          remoteRef: ref,
          fastForward: true,
          fastForwardOnly: false,
          forced: true,
          noCheckout: true,  // Ensure this is true to prevent file checkout
          singleBranch: false,  // Consider adding this to match clone behavior
          headers: buildHeaders(username, password),
          onAuth() {
            return authenticate.fill();
          },
          onAuthFailure() {
            return authenticate.rejected();
          },
        });
        return {success: true};
    } catch (error) {
      throw error;
    }
  } catch (error) {
    consoleDotError('some error happend while pulling: ', error);
    await handleGitError(error, args, 'pull', maxDeleteRetries);
    return {success: false};
  }
}

//gets url as argument
async function fastForward(args) {
  let attempt = args?.attempt || 0;
  
  const maxDeleteRetries = 1;

  try {
    !url && await setUrl(args?.url);
      await git.fastForward({
        ...args,
        fs,
        http,
        dir,
        remote,
        corsProxy,
        ref,
        remoteref: ref,
        forced: true,
        headers: buildHeaders(username, password),
        onAuth() {
          return authenticate.fill();
        },
        onAuthFailure() {
          return authenticate.rejected();
        },
      });
      return {success: true};
  } catch (error) {
    consoleDotLog('This error occured while fast-forwarding: ', error);
    await handleGitError(error, args, 'fastForward', maxDeleteRetries);
    return {success: false};
  }
}

//gets filePath and adds the filePath to the staging area
async function addFile(args) {
  try {
    consoleDotLog('addFile log', args);
    let filePath = await relativePath(args.filePath);
    await git.add({
      fs,
      dir,
      filepath: filePath
    });
  } catch (error) {
    consoleDotError('An error occurred while adding the file(s):', error);
  }
}

//gets nothings and add all changed files to staging area
async function addDot() {
  try {
    const changedFiles = await getChangedFilesList();
    consoleDotLog('changedFiles', changedFiles);
    for (let filePath in changedFiles){
      if (!changedFiles[filePath].includes('deleted')){
        await addFile({filePath});
      } else {
        await remove({filePath});
      }
    }
  } catch (error) {
    consoleDotError('Error adding all changed files:', error);
  }
}

//gets filepath and filecontents as parameters
async function addFileToStaging(args) {
  try {
    await writeFile(args);
    await addFile(args);
  } catch (error) {
    consoleDotError('Error adding file to staging area:', error);
  } 
}

//gets username, email and commitMessage as parameters 
async function commit(args) {
try{
  const _username = args?.username || username;
  const _email = args?.email || 'sample@email.com';
  await git.commit({
    fs,
    dir,
    author: {
      name: _username,
      email: _email,
    },
    message: args.commitMessage || "Commit by dnegar"
  });
}
catch (error) {
  consoleDotLog('This error occured while commiting: ', error)
}
}

async function readdir(_dir) {
  try {
    return await fs.promises.readdir(_dir);
  } catch (error) {
    consoleDotError('Error reading directory:', error);
    throw(error);
  }
}

//you should pass filePath and fileContents which you want to write in the file, filePath is : /path/to/your/file
//and fileContents is a string.
async function writeFile(args) {
  try {
    // await mkdirRecursive(args.filePath);
    await fs.promises.writeFile(args.filePath, args.fileContents, 'utf8');

  } catch (error) {
    consoleDotError('an error happend while writing to file:', error);
  }
}

//this function lists all changedFiles as an object including filePaths as keys and state of
//the file as values 
async function getChangedFilesList() {
  const HEAD = 1, WORKDIR = 2, STAGE = 3;
  let statusMatrix = await git.statusMatrix({ fs, dir });
  statusMatrix = statusMatrix.filter(row => row[HEAD] !== row[WORKDIR] || row[HEAD] !== row[STAGE]);
  return await statusMapper(statusMatrix);
}

//Unstaged and Uncommited files list
async function getCheckoutFilesList() {
  const HEAD = 1, WORKDIR = 2, STAGE = 3;
  let statusMatrix = await git.statusMatrix({ fs, dir });
  statusMatrix = statusMatrix.filter(row => row[WORKDIR] !== row[STAGE] || row[HEAD] !== row[STAGE]);
  return await statusMapper(statusMatrix);
}

//this function gets statusMatrix and gives back and object with filePaths and their
//corresponding status
async function statusMapper(statusMatrix) {
  const FILE = 0;
  const statusMapping = {
    "003": "added, staged, deleted unstaged",
    "020": "new, untracked",
    "022": "added, staged",
    "023": "added, staged, with unstaged changes",
    "100": "deleted, staged",
    "101": "deleted, unstaged",
    "103": "modified, staged, deleted unstaged",
    "111": "unmodified",
    "121": "modified, unstaged",
    "122": "modified, staged",
    "123": "modified, staged, with unstaged changes"
  };
  try {
    const resultObject = {};
    statusMatrix.forEach(row => {
      const file = row[FILE];
      const status = statusMapping[row.slice(1).join("")];
      if (dir !== '/'){
      resultObject[dir + '/' + file] = status;
      }
      else{
        resultObject[dir + file] = status;
      }
    }); 
    consoleDotLog(resultObject)
    return resultObject;
  } catch (error) {
    consoleDotError('Error getting changed files list:', error);
  }
}

// ==============================================
// Serialization Helpers
// ==============================================

function serializeError(error) {
  return {
    message: error.message,
    stack: error.stack,
    name: error.name,
    code: error.code
  };
}

function ensureSerializable(obj) {
  if (obj === undefined || typeof obj === 'function') {
    return undefined;
  }
  if (obj instanceof Error) {
    return serializeError(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(ensureSerializable);
  }
  if (obj && typeof obj === 'object') {
    const result = {};
    for (const key in obj) {
      result[key] = ensureSerializable(obj[key]);
    }
    return result;
  }
  return obj;
}

// ==============================================
// Operation Handlers
// ==============================================

const operationHandlers = {
  setFs: setFs,
  doCloneAndStuff: doCloneAndStuff,
  doFetch: (args) => doFetch(args),
  doPushFile: doPushFile,
  doPushAll: doPushAll,
  addFile: ({ filePath }) => addFile({ filePath }),
  commit: ({ username, email, commitMessage }) => 
    commit({ username, email, commitMessage }),
  push: ({ url, remote, ref, force = true }) => 
    push({ url, remote, ref, force }),
  pull: ({ url, remote, ref }) =>
    pull({ url, remote, ref }),  addDot: addDot,
  merge: ({ours, theirs, strategy}) => merge(ours, theirs, strategy),
  addFileToStaging: addFileToStaging,
  commitStagedChanges: commitStagedChanges,
  status: status,
  log: log,
  listRemotes: listRemotes,
  listBranches: listBranches,
  checkoutBranch: ({ ref }) => checkoutBranch(ref),
  currentBranch: currentBranch,
  currentRemote: currentRemote,
  createBranch: (args) => createBranch(args),
  setRemote: ({ remote }) => setRemote(remote),
  setRemoteUrl: ({ url, remote }) => setRemoteUrl(url, remote),
  getRemoteUrl: ({ remote }) => getRemoteUrl(remote),
  getRemote: ({remote}) => getRemote(remote),
  getRemoteCommitInLocalRepo: ({ remote }) => getRemoteCommitInLocalRepo(remote),
  getChangedFilesList: getChangedFilesList,
  getCommitHistoryFromReplica: getCommitHistoryFromReplica,
  getLatestRemoteCommit: ({ url, remote }) => getLatestRemoteCommit({url, remote}),
  getLastLocalCommit: ({ ref }) => getLastLocalCommit (ref),
  handleDeleteCloseAndReclone: ( {args} ) => handleDeleteCloseAndReclone(args),
  isSync: ({ url }) => isSync(url),
  hardReset: hardReset,
  softReset: ({ commitHash, branch }) => softReset(commitHash, branch),
  addRemote: ({ url, remote }) => addRemote(url, remote),
  deleteRemote: ({ remote }) => deleteRemote(remote),
  findMergeBase: ({ oids }) => findMergeBase(oids),
  findInGitHistory: findInGitHistory,
  resolveMergeConflict: resolveMergeConflict,
  fastForward: fastForward,
  setConfigs: setConfigs,
  setUrl: ({ url }) => setUrl(url),
  setCorsProxy: ({ corsProxy }) => setCorsProxy(corsProxy),
  setDir: ({ dir }) => setDir(dir),
  setDepth: ({ depth }) => setDepth(depth),
  setRef: ({ ref }) => setRef(ref),
  setAuthParams: ({ username, password }) => setAuthParams(username, password),
  setSettingsAddresses: setSettingsAddresses,
  addToSetting: addToSetting,
  stash: ({ operation }) => stash(operation),
  readFileDot: ({ filePath, commitOid = 'staged' }) => readFileDot(filePath, commitOid),
  writeFileDot: ({ filePath, fileContent, doCommit = 1 }) => 
    writeFileDot(filePath, fileContent, doCommit),
  readDirDot: ({ path, commitOid = 'staged' }) => readDirDot(path, commitOid),
  isDirectoryDot: ({ path }) => isDirectoryDot(path),
  listFilesDot: ({ listDirs = 1 }) => listFilesDot(listDirs),
  mkdirDot: ({ dirPath, doCommit = 1 }) => mkdirDot(dirPath, doCommit),
  mkdirRecursive: ({path}) => mkdirRecursive(path),
  removeDirDot: ({ dirPath, doCommit = 1 }) => removeDirDot(dirPath, doCommit),
  removeFileDot: ({ filePath, doCommit = 1 }) => removeFileDot(filePath, doCommit),
  rename: ({ oldPath, newPath }) => rename(oldPath, newPath),
  listServerRefs: ({args}) => listServerRefs(args),
  getUsername: getUsername,
  getEmail: getEmail,
  getConfig: ({ path }) => getConfig(path),
  setConfig: ({ path, value, args }) => setConfig(path, value, args),
  resolveRef: ({ ref }) => resolveRef(ref),
  readCommit: ({ head }) => readCommit(head),
  writeCommit: writeCommit,
  writeRef: writeRef,
  init: init,
  isDirectory: ({ path }) => isDirectory(path),
  isDirectoryDot: ({ path }) => isDirectoryDot(path),
  readdir: ({ path }) => readdir(path),
  readDirDot: ({ path }) => readDirDot(path),
  getFileStoresFromDatabases: getFileStoresFromDatabases,
  checkForLocalNotes: checkForLocalNotes,
  getPathNote: ({path}) => getPathNote(path),
  ensureAllFilesHaveNotes: ({owner}) => ensureAllFilesHaveNotes(owner),
};

// ==============================================
// Worker API
// ==============================================

let resolveReady;
const workerReady = new Promise((resolve) => {
  resolveReady = resolve;
});

const workerAPI = {
  execute: async (operation, args = {}) => {
    try {
      const handler = operationHandlers[operation];
      if (!handler) throw new Error(`Unknown operation: ${operation}`);

      // Ensure arguments are serializable
      const safeArgs = ensureSerializable(args);
      
      // Execute the operation
      const result = await handler(safeArgs);
      
      // Return the raw result for backward compatibility
      // (callers can still check for errors if needed)
      return ensureSerializable(result);
    } catch (error) {
      // For backward compatibility, we throw errors rather than returning them
      throw ensureSerializable(error);
    }
  },
  
  // Special case for ready check
  ready: () => workerReady,
  
  // Maintain backward compatibility with direct method calls
  // by proxying them to execute()
  ...Object.fromEntries(
    Object.keys(operationHandlers).map(op => [
      op, 
      async (args) => workerAPI.execute(op, args)
    ])
  )
};

// ==============================================
// Initialization Complete
// ==============================================

resolveReady();
portal.set("workerThread", workerAPI);
consoleDotLog('Worker initialized and ready');