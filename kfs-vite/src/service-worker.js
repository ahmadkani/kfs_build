/* eslint-env serviceworker */
/* globals LightningFS git GitHttp */
import * as git from './libs/isomorphicgit.js'
import * as GitHttp from './libs/http.js';
import * as LightningFS from './libs/LightningFS.js';
import {Logger} from './libs/LoggerES6.js';
import fsManager from './libs/workerUtils/fsManagerES6.js';
import {config} from './configES6.js';


const logger = new Logger(config.logging.serviceWorker);

function consoleDotLog(...parameters) {
  logger.consoleDotLog('[WorkerPool]', ...parameters);
}

function consoleDotError(...parameters) {
  logger.consoleDotError('[WorkerPool]', ...parameters);
}

let username = '';
let password = '';
let dir = '/';
let depth = 1;
let http = GitHttp;
let remote = 'origin';
let ref = 'main';
let corsProxy = 'http://localhost:9000' 
let cache = {};
let settingsFileAddresses = {};
let useCacheForRepo = 0;
let broadcastChannel;
let fs = null;
let fsArgs = {};
const FSManager = new fsManager();

const CACHE_NAME = 'cache-v1';
//const OFFLINE_URL = '/offline.html';
const URLS_TO_CACHE = [
];

const basePath = new URL(self.registration.scope).pathname.split('/')[1];
const scopePath = basePath ? `/${basePath}/` : '/';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  consoleDotLog('install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      consoleDotLog('Opened cache');
      return cache.addAll(URLS_TO_CACHE);
    }).catch((error) => {
      consoleDotError('Failed to cache', error);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      username = '';
      password = '';
      dir = '/';
      depth = 1;
      remote = 'origin';
      ref = 'main';
      cache = {};
      settingsFileAddresses = {};
      useCacheForRepo = 0;
      broadcastChannel;
      fs = new LightningFS('fs');
      fsArgs = {};
      
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })()
  );
  return self.clients.claim();
});


self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

self.broadcastChannelInitialized = false;

if (!self.broadcastChannelInitialized) {
  broadcastChannel = new BroadcastChannel('worker-channel');

  broadcastChannel.onmessage = async function (event) {
    const message = event.data;
    consoleDotLog(message);

    try {
      switch (message.operation) {
        case 'setAuthParams':
          await handleSetAuthParams(message.data);
          break;
        case 'setDir':
          await handleSetDir(message.data);
          break;
        case 'setRepoDir':
          await handleSetRepoDir(message.data);
          break;
        case 'setDepth':
          await handleSetDepth(message.data);
          break;
        case 'setRemote':
          await handleSetRemote(message.data);
          break;
        case 'setRef':
          await handleSetRef(message.data);
          break;
        case 'setSettingsAddresses':
          await handleSetSettingsFileAddresses(message.data);
          break;
        case 'passFsArgs':
          await handlePassFsArgs(message.data);
          break;
        case 'memorySync':
          await handleMemorySync(message.data);
          break;
        default:
          await exceptionHandler(message);
          break;
      }
    } catch (error) {
      consoleDotError(`${message.operation} failed`, error);
      throw new Error(error);
    }
  };

  self.broadcastChannelInitialized = true;
}

async function exceptionHandler(message) {
  consoleDotError('Unhandled message operation:', message.operation);
}

async function handleSetAuthParams(data) {
  if (username !== data.username || password !== data.password) {
    username = data.username || '';
    password = data.password || '';
    consoleDotLog('handlesetauthparame: ', data);
    broadcastChannel.postMessage({ operation: 'setAuthParams', success: true });
  } else{
    broadcastChannel.postMessage({ operation: 'setAuthParams', success: true });
  }
}

async function handleSetDir(data) {
  if (dir !== data) {
    dir = data;
    broadcastChannel.postMessage({ operation: 'setDir', success: true });
  } else {
    broadcastChannel.postMessage({ operation: 'setDir', success: true });
  }
}

async function handleSetRef(data) {
  if (ref !== data) {
    ref = data;
    broadcastChannel.postMessage({ operation: 'setRef', success: true });
  } else {
    broadcastChannel.postMessage({ operation: 'setRef', success: true });
  }
}

async function handleSetRepoDir(data) {
  if (dir !== data) {
    dir = data;
    broadcastChannel.postMessage({ operation: 'setRepoDir', success: true });
  } else {
    broadcastChannel.postMessage({ operation: 'setRepoDir', success: true });
  }
}

async function handleSetDepth(data) {
  if (depth !== data) {
    depth = data;
    broadcastChannel.postMessage({ operation: 'setDepth', success: true });
  } else{
    broadcastChannel.postMessage({ operation: 'setDepth', success: true });
  }
}

async function handleSetRemote(data) {
  if (remote !== data) {
    remote = data;
    broadcastChannel.postMessage({ operation: 'setRemote', success: true });
  } else{
    broadcastChannel.postMessage({ operation: 'setRemote', success: true });
  }
}

async function handleSetSettingsFileAddresses(data) {
  if (settingsFileAddresses !== data) {
    settingsFileAddresses = data;
    broadcastChannel.postMessage({ operation: 'setSettingsAddresses', success: true });
  } else{
    broadcastChannel.postMessage({ operation: 'setSettingsAddresses', success: true });
  };
}

async function handlePassFsArgs(data) {
  try {
    if (fsArgs !== data) {
      fsArgs = data;
      consoleDotLog('fsArgs', fsArgs)
      fs = await FSManager.getFS(fsArgs.fsName, fsArgs.fsType);
      broadcastChannel.postMessage({ operation: 'passFsArgs', success: true });
    } else {
      broadcastChannel.postMessage({ operation: 'passFsArgs', success: true });
    }
  } catch(error) {
    consoleDotError('some error happened in passFsArgs: ', error);
  }
}

async function handleMemorySync(data) {
  consoleDotLog('handle sync yoo hoo: ', data)
}
async function fetchSettingsFileContent(pathname) {
  try {
    consoleDotLog('pathname',pathname)
    const content = await fs.promises.readFile(pathname, 'utf8');
    if (content) {
      consoleDotLog('fetch content', content)
      return content;
    }
  } catch (error) {
    throw new Error('Unable to fetch file content: ' + error);
  }
}

self.addEventListener('fetch', (event) => {
  try {
    const url = new URL(event.request.url);
    console.log(`Fetching: ${url.pathname}`);

    console.log('Service Worker scope:', self.registration.scope);
    console.log('Request URL path:', url.pathname);

    // If the request is for `/git`, handle it specifically
    if (url.pathname.endsWith('/git')) {
      event.respondWith(
        handleGitRequest(event.request).catch(error => {
          console.error('Error handling Git request:', error);
          return new Response(
            JSON.stringify({ error: 'Git request failed', details: error.message || error.toString() }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        })
      );
      return;
    }

    const extractedPath = scopePath && url.pathname.startsWith(scopePath)
      ? url.pathname.slice(scopePath.length - 1)
      : url.pathname;

    console.log(`Extracted path: ${extractedPath}`);

    if (settingsFileAddresses[extractedPath]) {
      console.log('Matched settings file path:', extractedPath);

      event.respondWith(
        fetchSettingsFileContent(extractedPath)
          .then(content =>
            new Response(content, {
              headers: { 'Content-Type': 'application/json' },
            })
          )
          .catch(error => {
            console.error('Error reading file:', error);
            return new Response(
              JSON.stringify({ error: 'File not found or inaccessible', details: error.message || error.toString() }),
              { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
          })
      );
      return;
    }

    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (!response.ok) {
            console.error('HTTP error response:', response.status);
            return new Response(
              JSON.stringify({ error: 'HTTP error', status: response.status }),
              { status: response.status, headers: { 'Content-Type': 'application/json' } }
            );
          }
          return response;
        })
        .catch(error => {
          console.error('Network fetch failed:', error);
          return new Response(
            JSON.stringify({ error: 'Network error', details: error.message || error.toString() }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        })
    );
  } catch (error) {
    console.error('Error in fetch handler:', error);
    event.respondWith(
      new Response(
        JSON.stringify({ error: 'Unexpected error', details: error.message || error.toString() }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    );
  }
});


class Mutex {
  constructor() {
    this.queue = [];
    this.locked = false;
  }

  async lock() {
    return new Promise((resolve) => {
      const execute = () => {
        this.locked = true;
        resolve();
      };

      if (this.locked) {
        this.queue.push(execute);
      } else {
        execute();
      }
    });
  }

  unlock() {
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      next();
    } else {
      this.locked = false;
    }
  }
}

const mutex = new Mutex();

async function handleGitRequest(request) {
  try {
    const requestData = await request.json().catch(() => {
      throw new Error('Invalid JSON in request body');
    });

    const { operation, args } = requestData;

    if (!operation) {
      return new Response(
        JSON.stringify({ error: 'Missing operation field' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let response;
    
    try {
      switch (operation) {
        case 'clone':
          response = await clone(args);
          break;
        case 'pull':
          response = await pull(args);
          break;
        case 'push':
          response = await push(args);
          break;
        case 'fetch':
          response = await doFetch(args);
          break;
        case 'fastForward':
          response = await fastForward(args);
          break;
        case 'listServerRefs':
          response = await listServerRefs(args);
          break;  
        default:
          return new Response(
            JSON.stringify({ error: 'Invalid operation' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
      }
    } catch (operationError) {
      console.error(`Error executing ${operation}:`, operationError);
      return new Response(
        JSON.stringify({
          error: `Error executing ${operation}`,
          details: operationError.message || operationError.toString(),
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in handleGitRequest:', error);
    return new Response(
      JSON.stringify({ error: 'Unexpected error', details: error.message || error.toString() }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function deleteIndexedDB(dbName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(dbName);
    request.onsuccess = () => {
      consoleDotLog(`Deleted database ${dbName} successfully`);
      resolve();
    };
    request.onerror = (event) => {
      consoleDotError(`Error deleting database ${dbName}:`, event);
      reject(event);
    };
    request.onblocked = () => {
      console.warn(`Delete database ${dbName} blocked`);
    };
  });
}

async function gitReset({dir, ref, branch}) {
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
                  git.checkout({ dir, fs, ref: branch, force: true }).then(resolve);
              });
          });
      });
  }
  return Promise.reject(`Wrong ref ${ref}`);
}
async function regenerateIdxFiles() {
  const packDir = `${dir}/.git/objects/pack`;
  let packfiles = await fs.promises.readdir(packDir);
  packfiles = packfiles.filter(name => name.endsWith('.idx'));

  for (const packfile of packfiles) {
      await fs.promises.unlink(`${packDir}/${packfile}`);
      consoleDotLog(`Deleted .idx file: ${packfile}`);
  }

  // **Regenerate .idx files**
  packfiles = await fs.promises.readdir(packDir);
  packfiles = packfiles.filter(name => name.endsWith('.pack'));

  for (const packfile of packfiles) {
      const packFilePath = `${packDir}/${packfile}`;
      try {
          const relativePackFilePath = packFilePath.replace(`${dir}/`, '');
          consoleDotLog('Attempting to generate .idx file for:', packFilePath);
          const { oids } = await git.indexPack({
              fs,
              dir,
              filepath: relativePackFilePath,
              async onProgress(evt) {
                  consoleDotLog(`${evt.phase}: ${evt.loaded} / ${evt.total}`);
              }
          });
          consoleDotLog('Generated .idx file for:', relativePackFilePath, 'OIDs:', oids);
      } catch (err) {
          consoleDotError(`Error regenerating .idx files for ${packfile}:`, err);
      }
  }
}

async function retryOperation(operation, args, maxRetries = 2) {
  let retryCount = 0;
  let delay = 1000;

  while (retryCount <= maxRetries) {
    try {
      return await operation(args);
    } catch (error) {
      if (error.message.includes('Failed to fetch') || error.message.includes('CORS') || error.message.includes('HTTP Error')) {
        retryCount++;
        if (retryCount > maxRetries) throw new Error('Max retries reached for operation.');
        
        consoleDotLog(`Network error, Retrying operation in ${delay / 1000} seconds... (Attempt ${retryCount})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      } else {
        throw error;
      }
    }
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


async function listServerRefs(args) {
  consoleDotLog('listServerRefs args', args);
  return await retryOperation(async () => {
    await mutex.lock();
    try {
      consoleDotLog('Entering listServerRefs function with arguments:', args);

      // Validate URL - critical difference from your original
      if (!args.url) {
        throw new Error('URL parameter is required for listServerRefs');
      }

      const result = await git.listServerRefs({
        ...args,
        fs,
        http,
        dir,
        corsProxy,
        remote: args.remote || remote, // Fallback to global remote
        headers: buildHeaders(username, password),
        onAuth() {
          return authenticate.fill();
        },
        onAuthFailure() {
          return authenticate.rejected();
        },
      });

      consoleDotLog('ListServerRefs successful. Result:', result);
      return { success: true, refs: result };
    } catch (error) {
      if (error?.message?.includes('Could not find') && error?.code === 'NotFoundError') {
        let isHandled = await handleNoMainError();
        if (!isHandled) {
          throw error;
        }
        return { success: true, message: 'listServerRefs was successful' };
      }
      consoleDotError('Error occurred during listServerRefs operation:', error);
      // Return structured error like git worker does
      return { success: false, error: error.message };
    } finally {
      consoleDotLog('Exiting listServerRefs function.');
      mutex.unlock();
    }
  }, args);
}

async function clone(args) {
  consoleDotLog('entering clone with : ', args);
  return await retryOperation(async () => {
    consoleDotLog('Entering clone function with arguments:', args);

    let cloneResult = {};
    await mutex.lock();
    try {

        cloneResult = await fetchCachedFileList(fsArgs.fsName);
        if (!cloneResult) {
            const result = await git.clone({
                ...args,
                fs,
                http,
                dir,
                remote,
                ref,
                corsProxy,
                depth,
                headers: buildHeaders(username, password),
                onAuth() {
                    return authenticate.fill();
                },
                onAuthFailure() {
                    return authenticate.rejected();
                },
            });

            if (useCacheForRepo){
              //await regenerateIdxFiles();
              const fileList = await listFiles();
              await cacheFileList(fsArgs.fsName, fileList);
            }
            cloneResult = { isCacheUsed: false, ref: ref};

            await logToCache('clone', { fsName: fsArgs.fsName, result });
        } else {
            await writeFilesToIndexedDB(cloneResult);
            await gitReset({ dir, ref: 'HEAD~1', branch: ref });
            await logToCache('clone (from cache)', { fsName: fsArgs.fsName });
            consoleDotLog('log', await retrieveLogFromCache());
            cloneResult = { isCacheUsed: true, ref: ref };
        }

        return { success: true, message: 'The repo has successfully cloned', data: cloneResult };
    } catch (error) {
        consoleDotError('Clone failed with error:', error);
        if (error?.message?.includes('Could not find') && error?.code === 'NotFoundError') {
              let isHandled = await handleNoMainError();
              if (!isHandled) {
                  throw error;
              }
              cloneResult = { isCacheUsed: false, ref: ref};
              return { success: true, message: 'The repo has successfully cloned', data: cloneResult };
        } else if (error?.response?.status === 500) {
            consoleDotError('Server responded with 500 Internal Server Error');
            throw new Error('Internal Server Error: The server encountered an error.');
        } else if (typeof error === 'object') {
            consoleDotError('Error properties:', Object.keys(error));
            throw new Error(error || 'An unknown error occurred during the clone operation');
        } else {
            consoleDotError('Unknown error:', error);
            throw new Error('An unknown error occurred during the clone operation');
        }
    } finally {
        mutex.unlock();
      }
    }, args);
}

async function cacheFileList(cacheKey, fileList) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const filesWithContent = {};
    consoleDotLog('fl', fileList);

    for (const [fileName, filePath] of Object.entries(fileList)) {
      consoleDotLog('fn, fp', fileName, filePath);
      const stats = await fs.promises.stat(filePath);
      
      if (stats.isDirectory()) {
        // Store an empty string for directories
        filesWithContent[filePath] = '';
      } else if (stats.isFile()) {
        const fileContent = await fs.promises.readFile(filePath, 'utf8');
        filesWithContent[filePath] = fileContent;
      }
    }

    consoleDotLog('filesWithContent', filesWithContent);

    const response = new Response(JSON.stringify(filesWithContent), {
      headers: { 'Content-Type': 'application/json' }
    });
    await cache.put(cacheKey, response);
    consoleDotLog('File list and contents cached successfully', response);
  } catch (error) {
    consoleDotError('Error caching file list and contents:', error);
  }
}

async function listFiles(filePath = dir) {
  try {
    let path = filePath;
    let files = await fs.promises.readdir(filePath);
    let result = {};
    consoleDotLog('files',files)
    result[filePath] = filePath;

    for (const file of files) {
      consoleDotLog('file',file)
      let fullPath = path !== '/' ? `${path}/${file}` : `${path}${file}`;
      const stat = await fs.promises.lstat(fullPath);

      if (stat.isDirectory()) {
        consoleDotLog('fullPath',fullPath)
        result = { ...result, ...await listFiles(fullPath) };
      } else {
        consoleDotLog('result',result)
        result[fullPath] = fullPath;
      }
    }
    return result;
  } catch (error) {
    consoleDotError('Error listing files:', error);
    throw error;
  }
}

async function fetchCachedFileList(cacheKey) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(cacheKey);

    if (cachedResponse) {
      const filesWithContent = await cachedResponse.json();
      consoleDotLog('Files and contents fetched from cache:', filesWithContent);
      return filesWithContent;
    } else {
      consoleDotLog('No cached file list found');
      return null;
    }
  } catch (error) {
    consoleDotError('Error fetching cached file list and contents:', error);
    return null;
  }
}

async function writeFilesToIndexedDB(filesWithContents) {
  for (const [filePath, fileContent] of Object.entries(filesWithContents)) {
    const directories = filePath.split('/').slice(0, -1).join('/');

    // Create directories if they don't exist
    if (directories) {
      await ensureDirectoryExists(fs, directories);
    }

    if (fileContent === '') {
      // If fileContent is an empty string, create the directory
      await fs.promises.mkdir(filePath, { recursive: true });
      consoleDotLog(`Directory created: ${filePath}`);
    } else {
      // Write file content to the appropriate path
      await fs.promises.writeFile(filePath, fileContent);
    }
  }
  consoleDotLog('All files and contents have been written to IndexedDB using LightningFS.');
}

async function ensureDirectoryExists(fs, dirPath) {
  const parts = dirPath.split('/').filter(part => part);
  let currentPath = '';

  for (const part of parts) {
    currentPath += `/${part}`;
    try {
      await fs.promises.mkdir(currentPath);
      consoleDotLog(`Directory created: ${currentPath}`);
    } catch (error) {
      if (error.code !== 'EEXIST') {
        consoleDotError(`Error creating directory: ${currentPath}`, error);
        throw error;
      }
    }
  }
}

function mapErrorToStatusCode(message) {
  if (message.includes('400')) return 400;
  if (message.includes('401')) return 401;
  if (message.includes('403')) return 403;
  if (message.includes('404')) return 404;
  if (message.includes('409')) return 409;
  if (message.includes('422')) return 422;
  if (message.includes('429')) return 429;
  if (message.includes('500')) return 500;
  if (message.includes('501')) return 501;
  if (message.includes('502')) return 502;
  if (message.includes('503')) return 503;
  if (message.includes('504')) return 504;
  return 500;
}

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


async function pull(args) {
  return await retryOperation(async () => {
    let pullResult = {};
    await mutex.lock();
    try {
      consoleDotLog('Entering pull function with arguments:', args);

      if (!ref) {
        throw new Error('Reference (ref) is not defined.');
      }

      consoleDotLog('Using reference (ref):', ref);

      const result = await git.pull({
        ...args,
        fs,
        http,
        dir,
        corsProxy,
        remote,
        remoteRef: ref,
        fastForward: true,
        forced: true,
        singleBranch: true,
        headers: buildHeaders(username, password),
        onAuth() {
          return authenticate.fill();
        },
        onAuthFailure() {
          return authenticate.rejected();
        },
      });
      pullResult = { ref: ref };
      consoleDotLog('Pull successful. Result:', result);
      return { success: true, message: result, data: pullResult };
    } catch (error) {
      if (error?.message?.includes('Could not find') && error?.code === 'NotFoundError') {
        let isHandled = await handleNoMainError();
        if (!isHandled) {
          throw error;
        }
        pullResult = { ref: ref };
        return { success: true, message: 'pull was successful', data: pullResult };
      }
      consoleDotError('Error occurred during pull operation:', error);
      throw new Error(`Pull failed: ${error}`);
    } finally {
      consoleDotLog('Exiting pull function.');
      mutex.unlock();
    }
  }, args);
}

async function fastForward(args) {
  return await retryOperation(async () => {
    let ffResult = {};
    await mutex.lock();
    try {
      consoleDotLog('Entering fastForward function with arguments:', args);

      if (!ref) {
        throw new Error('Reference (ref) is not defined.');
      }

      const result = await git.fastForward({
        ...args,
        fs,
        http,
        dir,
        remote,
        corsProxy,
        ref,
        remoteref: ref,
        forced: true,
        singleBranch: false,
        headers: buildHeaders(username, password),
        onAuth() {
          return authenticate.fill();
        },
        onAuthFailure() {
          return authenticate.rejected();
        },
      });

      ffResult = { ref: ref };
      consoleDotLog('FastForward pull successful. Result:', result);
      return { success: true, message: result, data: ffResult };
    } catch (error) {
      if (error?.message?.includes('Could not find') && error?.code === 'NotFoundError') {
        let isHandled = await handleNoMainError();
        if (!isHandled) {
          throw error;
        }
        ffResult = { ref: ref };
        return { success: true, message: 'FastForward was successful', data: ffResult };
      }
      consoleDotError('Error occurred during fastForward operation:', error);
      throw new Error(`FastForward pull failed: ${error}`);
    } finally {
      consoleDotLog('Exiting fastForward function.');
      mutex.unlock();
    }
  }, args);
}

async function push(args) {
  return await retryOperation(async () => {
    let pushResult = {};
    await mutex.lock();
    try {
      consoleDotLog('Entering push function with arguments:', args);

      if (!ref) {
        throw new Error('Reference (ref) is not defined.');
      }

      const result = await git.push({
        ...args,
        fs,
        http,
        dir,
        corsProxy,
        remote,
        ref,
        force: true,
        headers: buildHeaders(username, password),
        onAuth() {
          return authenticate.fill();
        },
        onAuthFailure() {
          return authenticate.rejected();
        },
      });

      pushResult = { ref: ref };
      consoleDotLog('Push successful. Result:', result);
      return { success: true, message: 'Push was successful', data: pushResult };
    } catch (error) {
      if (error?.message?.includes('Could not find') && error?.code === 'NotFoundError') {
        let isHandled = await handleNoMainError();
        if (!isHandled) {
          throw error;
        }
        pushResult = { ref: ref };
        return { success: true, message: 'Push was successful', data: pushResult };
      }
      consoleDotError('Error occurred during push operation:', error);
    } finally {
      consoleDotLog('Exiting push function.');
      mutex.unlock();
    }
  }, args);
}

async function doFetch(args) {
  return await retryOperation(async () => {
    let fetchResult = {};
    await mutex.lock();
    try {
      consoleDotLog('Entering doFetch function with arguments:', args);

      if (!ref) {
        throw new Error('Reference (ref) is not defined.');
      }
      let _ref = args?.ref || ref;

      const result = await git.fetch({
        ...args,
        fs,
        http,
        dir,
        corsProxy,
        ref: _ref,
        remote,
        depth,
        singleBranch: false,
        tags: false,
        onProgress: event => {
          consoleDotLog('Fetch progress event:', event);
        },
        headers: buildHeaders(username, password),
        onAuth() {
          return authenticate.fill();
        },
        onAuthFailure() {
          return authenticate.rejected();
        },
      });

      fetchResult = { ref: ref };
      consoleDotLog('Fetch successful. Result:', result);
      return { success: true, message: 'Fetch was successful', data: fetchResult };
    } catch (error) {
      if (error?.message?.includes('Could not find') && error?.code === 'NotFoundError') {
        let isHandled = await handleNoMainError();
        if (!isHandled) {
          throw error;
        }
        fetchResult = { ref: ref };
        return { success: true, message: 'The repo has successfully cloned', data: fetchResult };
      }
      consoleDotError('Error occurred during fetch operation:', error);
      throw new Error(`Fetch failed: ${error}`);
    } finally {
      consoleDotLog('Exiting doFetch function.');
      mutex.unlock();
    }
  }, args);
}

async function logToCache(action, data) {
  try {
    const cache = await caches.open(CACHE_NAME);

    // Retrieve existing logs
    let response = await caches.match('log');
    let logs = response ? await response.json() : [];

    // Add new log entry with a timestamp
    const timestamp = new Date().toISOString();
    const newLogEntry = { action, data, timestamp };
    logs.push(newLogEntry);

    // Check if logs exceed 5 KB limit
    let logSize = new Blob([JSON.stringify(logs)]).size;
    const maxSize = 5 * 1024; // 5 KB

    // Remove oldest logs if necessary
    while (logSize > maxSize) {
      logs.shift(); // Remove the oldest log entry
      logSize = new Blob([JSON.stringify(logs)]).size;
    }

    // Save updated logs back to cache
    const updatedResponse = new Response(JSON.stringify(logs), { headers: { 'Content-Type': 'application/json' } });
    await cache.put('log', updatedResponse);

    consoleDotLog(`Logged action: ${action} at ${timestamp}`, newLogEntry);
  } catch (error) {
    consoleDotError('Error logging data to cache:', error);
  }
}


async function retrieveLogFromCache() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match('log');
    
    if (response) {
      const logs = await response.json();
      consoleDotLog('Retrieved logs from cache:', logs);
      return logs;
    } else {
      consoleDotLog('No logs found in cache.');
      return [];
    }
  } catch (error) {
    consoleDotError('Error retrieving logs from cache:', error);
    return [];
  }
}

async function handleNoMainError() {
  try {
    mutex.unlock();
    consoleDotError('Only Main is supported for refs.');
    throw new Error('Only Main is supported for refs.');
  } catch (checkoutError) {
    consoleDotError(`Checkout to branch "${ref}" failed:`, checkoutError);
    throw checkoutError; // Propagate the error after all attempts
  }
}