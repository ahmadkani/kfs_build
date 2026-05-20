import { w as workerPool, g as getConfig, L as Logger } from './WorkerPool-DqBGROTj.js';
import { Buffer } from 'buffer';

function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
function getAugmentedNamespace(n) {
  if (Object.prototype.hasOwnProperty.call(n, "__esModule")) return n;
  var f = n.default;
  if (typeof f == "function") {
    var a = function a2() {
      if (this instanceof a2) {
        return Reflect.construct(f, arguments, this.constructor);
      }
      return f.apply(this, arguments);
    };
    a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, "__esModule", { value: true });
  Object.keys(n).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n[k];
      }
    });
  });
  return a;
}

var justOnce;
var hasRequiredJustOnce;

function requireJustOnce () {
	if (hasRequiredJustOnce) return justOnce;
	hasRequiredJustOnce = 1;
	justOnce = once;

	/*
	let i = 0;
	const getFirst = once(() => ++i);
	getFirst(); // 1
	getFirst(); // 1
	*/

	function once(fn) {
	  var called, value;

	  if (typeof fn !== 'function') {
	    throw new Error('expected a function but got ' + fn);
	  }

	  return function wrap() {
	    if (called) {
	      return value;
	    }
	    called = true;
	    value = fn.apply(this, arguments);
	    return value;
	  };
	}
	return justOnce;
}

var text_min = {};

var hasRequiredText_min;

function requireText_min () {
	if (hasRequiredText_min) return text_min;
	hasRequiredText_min = 1;
	(function(scope) {
	  function B(r, e) {
	    var f;
	    return r instanceof Buffer ? f = r : f = Buffer.from(r.buffer, r.byteOffset, r.byteLength), f.toString(e);
	  }
	  var w = function(r) {
	    return Buffer.from(r);
	  };
	  function h(r) {
	    for (var e = 0, f = Math.min(256 * 256, r.length + 1), n = new Uint16Array(f), i = [], o = 0; ; ) {
	      var t = e < r.length;
	      if (!t || o >= f - 1) {
	        var s = n.subarray(0, o), m = s;
	        if (i.push(String.fromCharCode.apply(null, m)), !t) return i.join("");
	        r = r.subarray(e), e = 0, o = 0;
	      }
	      var a = r[e++];
	      if ((a & 128) === 0) n[o++] = a;
	      else if ((a & 224) === 192) {
	        var d = r[e++] & 63;
	        n[o++] = (a & 31) << 6 | d;
	      } else if ((a & 240) === 224) {
	        var d = r[e++] & 63, l = r[e++] & 63;
	        n[o++] = (a & 31) << 12 | d << 6 | l;
	      } else if ((a & 248) === 240) {
	        var d = r[e++] & 63, l = r[e++] & 63, R = r[e++] & 63, c = (a & 7) << 18 | d << 12 | l << 6 | R;
	        c > 65535 && (c -= 65536, n[o++] = c >>> 10 & 1023 | 55296, c = 56320 | c & 1023), n[o++] = c;
	      }
	    }
	  }
	  function F(r) {
	    for (var e = 0, f = r.length, n = 0, i = Math.max(32, f + (f >>> 1) + 7), o = new Uint8Array(i >>> 3 << 3); e < f; ) {
	      var t = r.charCodeAt(e++);
	      if (t >= 55296 && t <= 56319) {
	        if (e < f) {
	          var s = r.charCodeAt(e);
	          (s & 64512) === 56320 && (++e, t = ((t & 1023) << 10) + (s & 1023) + 65536);
	        }
	        if (t >= 55296 && t <= 56319) continue;
	      }
	      if (n + 4 > o.length) {
	        i += 8, i *= 1 + e / r.length * 2, i = i >>> 3 << 3;
	        var m = new Uint8Array(i);
	        m.set(o), o = m;
	      }
	      if ((t & 4294967168) === 0) {
	        o[n++] = t;
	        continue;
	      } else if ((t & 4294965248) === 0) o[n++] = t >>> 6 & 31 | 192;
	      else if ((t & 4294901760) === 0) o[n++] = t >>> 12 & 15 | 224, o[n++] = t >>> 6 & 63 | 128;
	      else if ((t & 4292870144) === 0) o[n++] = t >>> 18 & 7 | 240, o[n++] = t >>> 12 & 63 | 128, o[n++] = t >>> 6 & 63 | 128;
	      else continue;
	      o[n++] = t & 63 | 128;
	    }
	    return o.slice ? o.slice(0, n) : o.subarray(0, n);
	  }
	  var u = "Failed to ", p = function(r, e, f) {
	    if (r) throw new Error("".concat(u).concat(e, ": the '").concat(f, "' option is unsupported."));
	  };
	  var x = typeof Buffer == "function" && Buffer.from;
	  var A = x ? w : F;
	  function v() {
	    this.encoding = "utf-8";
	  }
	  v.prototype.encode = function(r, e) {
	    return p(e && e.stream, "encode", "stream"), A(r);
	  };
	  function U(r) {
	    var e;
	    try {
	      var f = new Blob([r], { type: "text/plain;charset=UTF-8" });
	      e = URL.createObjectURL(f);
	      var n = new XMLHttpRequest();
	      return n.open("GET", e, false), n.send(), n.responseText;
	    } finally {
	      e && URL.revokeObjectURL(e);
	    }
	  }
	  var O = !x && typeof Blob == "function" && typeof URL == "function" && typeof URL.createObjectURL == "function", S = ["utf-8", "utf8", "unicode-1-1-utf-8"], T = h;
	  x ? T = B : O && (T = function(r) {
	    try {
	      return U(r);
	    } catch (e) {
	      return h(r);
	    }
	  });
	  var y = "construct 'TextDecoder'", E = "".concat(u, " ").concat(y, ": the ");
	  function g(r, e) {
	    p(e && e.fatal, y, "fatal"), r = r || "utf-8";
	    var f;
	    if (x ? f = Buffer.isEncoding(r) : f = S.indexOf(r.toLowerCase()) !== -1, !f) throw new RangeError("".concat(E, " encoding label provided ('").concat(r, "') is invalid."));
	    this.encoding = r, this.fatal = false, this.ignoreBOM = false;
	  }
	  g.prototype.decode = function(r, e) {
	    p(e && e.stream, "decode", "stream");
	    var f;
	    return r instanceof Uint8Array ? f = r : r.buffer instanceof ArrayBuffer ? f = new Uint8Array(r.buffer) : f = new Uint8Array(r), T(f, this.encoding);
	  };
	  scope.TextEncoder = scope.TextEncoder || v;
	  scope.TextDecoder = scope.TextDecoder || g;
	})(typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : text_min);
	return text_min;
}

var browser;
var hasRequiredBrowser;

function requireBrowser () {
	if (hasRequiredBrowser) return browser;
	hasRequiredBrowser = 1;
	// Polyfill TextEncoder for MS Edge
	requireText_min();

	browser = {
	  encode: string => new TextEncoder().encode(string),
	  decode: buffer => new TextDecoder().decode(buffer)
	};
	return browser;
}

var justDebounceIt;
var hasRequiredJustDebounceIt;

function requireJustDebounceIt () {
	if (hasRequiredJustDebounceIt) return justDebounceIt;
	hasRequiredJustDebounceIt = 1;
	justDebounceIt = debounce;

	function debounce(fn, wait, callFirst) {
	  var timeout;
	  return function() {
	    if (!wait) {
	      return fn.apply(this, arguments);
	    }
	    var context = this;
	    var args = arguments;
	    var callNow = callFirst && !timeout;
	    clearTimeout(timeout);
	    timeout = setTimeout(function() {
	      timeout = null;
	      if (!callNow) {
	        return fn.apply(context, args);
	      }
	    }, wait);

	    if (callNow) {
	      return fn.apply(this, arguments);
	    }
	  };
	}
	return justDebounceIt;
}

var path;
var hasRequiredPath;

function requirePath () {
	if (hasRequiredPath) return path;
	hasRequiredPath = 1;
	function normalizePath(path) {
	  if (path.length === 0) {
	    return ".";
	  }
	  let parts = splitPath(path);
	  parts = parts.reduce(reducer, []);
	  return joinPath(...parts);
	}

	function resolvePath(...paths) {
	  let result = '';
	  for (let path of paths) {
	    if (path.startsWith('/')) {
	      result = path;
	    } else {
	      result = normalizePath(joinPath(result, path));
	    }
	  }
	  return result;
	}

	function joinPath(...parts) {
	  if (parts.length === 0) return "";
	  let path = parts.join("/");
	  // Replace consecutive '/'
	  path = path.replace(/\/{2,}/g, "/");
	  return path;
	}

	function splitPath(path) {
	  if (path.length === 0) return [];
	  if (path === "/") return ["/"];
	  let parts = path.split("/");
	  if (parts[parts.length - 1] === '') {
	      parts.pop();
	  }
	  if (path[0] === "/") {
	    // assert(parts[0] === '')
	    parts[0] = "/";
	  } else {
	    if (parts[0] !== ".") {
	      parts.unshift(".");
	    }
	  }
	  return parts;
	}

	function dirname(path) {
	  const last = path.lastIndexOf("/");
	  if (last === -1) throw new Error(`Cannot get dirname of "${path}"`);
	  if (last === 0) return "/";
	  return path.slice(0, last);
	}

	function basename(path) {
	  if (path === "/") throw new Error(`Cannot get basename of "${path}"`);
	  const last = path.lastIndexOf("/");
	  if (last === -1) return path;
	  return path.slice(last + 1);
	}

	function reducer(ancestors, current) {
	  // Initial condition
	  if (ancestors.length === 0) {
	    ancestors.push(current);
	    return ancestors;
	  }
	  // assert(ancestors.length > 0)
	  // assert(ancestors[0] === '.' || ancestors[0] === '/')

	  // Collapse '.' references
	  if (current === ".") return ancestors;

	  // Collapse '..' references
	  if (current === "..") {
	    if (ancestors.length === 1) {
	      if (ancestors[0] === "/") {
	        throw new Error("Unable to normalize path - traverses above root directory");
	      }
	      // assert(ancestors[0] === '.')
	      if (ancestors[0] === ".") {
	        ancestors.push(current);
	        return ancestors;
	      }
	    }
	    // assert(ancestors.length > 1)
	    if (ancestors[ancestors.length - 1] === "..") {
	      ancestors.push("..");
	      return ancestors;
	    } else {
	      ancestors.pop();
	      return ancestors;
	    }
	  }

	  ancestors.push(current);
	  return ancestors;
	}

	path = {
	  join: joinPath,
	  normalize: normalizePath,
	  split: splitPath,
	  basename,
	  dirname,
	  resolve: resolvePath,
	};
	return path;
}

var errors;
var hasRequiredErrors;

function requireErrors () {
	if (hasRequiredErrors) return errors;
	hasRequiredErrors = 1;
	function Err(name) {
	  return class extends Error {
	    constructor(...args) {
	      super(...args);
	      this.code = name;
	      if (this.message) {
	        this.message = name + ": " + this.message;
	      } else {
	        this.message = name;
	      }
	    }
	  };
	}

	const EEXIST = Err("EEXIST");
	const ENOENT = Err("ENOENT");
	const ENOTDIR = Err("ENOTDIR");
	const ENOTEMPTY = Err("ENOTEMPTY");
	const ETIMEDOUT = Err("ETIMEDOUT");

	errors = { EEXIST, ENOENT, ENOTDIR, ENOTEMPTY, ETIMEDOUT };
	return errors;
}

var CacheFS_1;
var hasRequiredCacheFS;

function requireCacheFS () {
	if (hasRequiredCacheFS) return CacheFS_1;
	hasRequiredCacheFS = 1;
	const path = requirePath();
	const { EEXIST, ENOENT, ENOTDIR, ENOTEMPTY } = requireErrors();

	const STAT = 0;

	CacheFS_1 = class CacheFS {
	  constructor() {
	  }
	  _makeRoot(root = new Map()) {
	    root.set(STAT, { mode: 0o777, type: "dir", size: 0, ino: 0, mtimeMs: Date.now() });
	    return root
	  }
	  activate(superblock = null) {
	    if (superblock === null) {
	      this._root = new Map([["/", this._makeRoot()]]);
	    } else if (typeof superblock === 'string') {
	      this._root = new Map([["/", this._makeRoot(this.parse(superblock))]]);
	    } else {
	      this._root = superblock;
	    }
	  }
	  get activated () {
	    return !!this._root
	  }
	  deactivate () {
	    this._root = void 0;
	  }
	  size () {
	    // subtract 1 to ignore the root directory itself from the count.
	    return this._countInodes(this._root.get("/")) - 1;
	  }
	  _countInodes(map) {
	    let count = 1;
	    for (let [key, val] of map) {
	      if (key === STAT) continue;
	      count += this._countInodes(val);
	    }
	    return count;
	  }
	  autoinc () {
	    let val = this._maxInode(this._root.get("/")) + 1;
	    return val;
	  }
	  _maxInode(map) {
	    let max = map.get(STAT).ino;
	    for (let [key, val] of map) {
	      if (key === STAT) continue;
	      max = Math.max(max, this._maxInode(val));
	    }
	    return max;
	  }
	  print(root = this._root.get("/")) {
	    let str = "";
	    const printTree = (root, indent) => {
	      for (let [file, node] of root) {
	        if (file === 0) continue;
	        let stat = node.get(STAT);
	        let mode = stat.mode.toString(8);
	        str += `${"\t".repeat(indent)}${file}\t${mode}`;
	        if (stat.type === "file") {
	          str += `\t${stat.size}\t${stat.mtimeMs}\n`;
	        } else {
	          str += `\n`;
	          printTree(node, indent + 1);
	        }
	      }
	    };
	    printTree(root, 0);
	    return str;
	  }
	  parse(print) {
	    let autoinc = 0;

	    function mk(stat) {
	      const ino = ++autoinc;
	      // TODO: Use a better heuristic for determining whether file or dir
	      const type = stat.length === 1 ? "dir" : "file";
	      let [mode, size, mtimeMs] = stat;
	      mode = parseInt(mode, 8);
	      size = size ? parseInt(size) : 0;
	      mtimeMs = mtimeMs ? parseInt(mtimeMs) : Date.now();
	      return new Map([[STAT, { mode, type, size, mtimeMs, ino }]]);
	    }

	    let lines = print.trim().split("\n");
	    let _root = this._makeRoot();
	    let stack = [
	      { indent: -1, node: _root },
	      { indent: 0, node: null }
	    ];
	    for (let line of lines) {
	      let prefix = line.match(/^\t*/)[0];
	      let indent = prefix.length;
	      line = line.slice(indent);
	      let [filename, ...stat] = line.split("\t");
	      let node = mk(stat);
	      if (indent <= stack[stack.length - 1].indent) {
	        while (indent <= stack[stack.length - 1].indent) {
	          stack.pop();
	        }
	      }
	      stack.push({ indent, node });
	      let cd = stack[stack.length - 2].node;
	      cd.set(filename, node);
	    }
	    return _root;
	  }
	  _lookup(filepath, follow = true) {
	    let dir = this._root;
	    let partialPath = '/';
	    let parts = path.split(filepath);
	    for (let i = 0; i < parts.length; ++ i) {
	      let part = parts[i];
	      dir = dir.get(part);
	      if (!dir) throw new ENOENT(filepath);
	      // Follow symlinks
	      if (follow || i < parts.length - 1) {
	        const stat = dir.get(STAT);
	        if (stat.type === 'symlink') {
	          let target = path.resolve(partialPath, stat.target);
	          dir = this._lookup(target);
	        }
	        if (!partialPath) {
	          partialPath = part;
	        } else {
	          partialPath = path.join(partialPath, part);
	        }
	      }
	    }
	    return dir;
	  }
	  mkdir(filepath, { mode }) {
	    if (filepath === "/") throw new EEXIST();
	    let dir = this._lookup(path.dirname(filepath));
	    let basename = path.basename(filepath);
	    if (dir.has(basename)) {
	      throw new EEXIST();
	    }
	    let entry = new Map();
	    let stat = {
	      mode,
	      type: "dir",
	      size: 0,
	      mtimeMs: Date.now(),
	      ino: this.autoinc(),
	    };
	    entry.set(STAT, stat);
	    dir.set(basename, entry);
	  }
	  rmdir(filepath) {
	    let dir = this._lookup(filepath);
	    if (dir.get(STAT).type !== 'dir') throw new ENOTDIR();
	    // check it's empty (size should be 1 for just StatSym)
	    if (dir.size > 1) throw new ENOTEMPTY();
	    // remove from parent
	    let parent = this._lookup(path.dirname(filepath));
	    let basename = path.basename(filepath);
	    parent.delete(basename);
	  }
	  readdir(filepath) {
	    let dir = this._lookup(filepath);
	    if (dir.get(STAT).type !== 'dir') throw new ENOTDIR();
	    return [...dir.keys()].filter(key => typeof key === "string");
	  }
	  writeStat(filepath, size, { mode }) {
	    let ino;
	    try {
	      let oldStat = this.stat(filepath);
	      if (mode == null) {
	        mode = oldStat.mode;
	      }
	      ino = oldStat.ino;
	    } catch (err) {}
	    if (mode == null) {
	      mode = 0o666;
	    }
	    if (ino == null) {
	      ino = this.autoinc();
	    }
	    let dir = this._lookup(path.dirname(filepath));
	    let basename = path.basename(filepath);
	    let stat = {
	      mode,
	      type: "file",
	      size,
	      mtimeMs: Date.now(),
	      ino,
	    };
	    let entry = new Map();
	    entry.set(STAT, stat);
	    dir.set(basename, entry);
	    return stat;
	  }
	  unlink(filepath) {
	    // remove from parent
	    let parent = this._lookup(path.dirname(filepath));
	    let basename = path.basename(filepath);
	    parent.delete(basename);
	  }
	  rename(oldFilepath, newFilepath) {
	    let basename = path.basename(newFilepath);
	    // Note: do both lookups before making any changes
	    // so if lookup throws, we don't lose data (issue #23)
	    // grab references
	    let entry = this._lookup(oldFilepath);
	    let destDir = this._lookup(path.dirname(newFilepath));
	    // insert into new parent directory
	    destDir.set(basename, entry);
	    // remove from old parent directory
	    this.unlink(oldFilepath);
	  }
	  stat(filepath) {
	    return this._lookup(filepath).get(STAT);
	  }
	  lstat(filepath) {
	    return this._lookup(filepath, false).get(STAT);
	  }
	  readlink(filepath) {
	    return this._lookup(filepath, false).get(STAT).target;
	  }
	  symlink(target, filepath) {
	    let ino, mode;
	    try {
	      let oldStat = this.stat(filepath);
	      if (mode === null) {
	        mode = oldStat.mode;
	      }
	      ino = oldStat.ino;
	    } catch (err) {}
	    if (mode == null) {
	      mode = 0o120000;
	    }
	    if (ino == null) {
	      ino = this.autoinc();
	    }
	    let dir = this._lookup(path.dirname(filepath));
	    let basename = path.basename(filepath);
	    let stat = {
	      mode,
	      type: "symlink",
	      target,
	      size: 0,
	      mtimeMs: Date.now(),
	      ino,
	    };
	    let entry = new Map();
	    entry.set(STAT, stat);
	    dir.set(basename, entry);
	    return stat;
	  }
	  _du (dir) {
	    let size = 0;
	    for (const [name, entry] of dir.entries()) {
	      if (name === STAT) {
	        size += entry.size;
	      } else {
	        size += this._du(entry);
	      }
	    }
	    return size;
	  }
	  du (filepath) {
	    let dir = this._lookup(filepath);
	    return this._du(dir);
	  }
	};
	return CacheFS_1;
}

class Store {
    constructor(dbName = 'keyval-store', storeName = 'keyval') {
        this.storeName = storeName;
        this._dbName = dbName;
        this._storeName = storeName;
        this._init();
    }
    _init() {
        if (this._dbp) {
            return;
        }
        this._dbp = new Promise((resolve, reject) => {
            const openreq = indexedDB.open(this._dbName);
            openreq.onerror = () => reject(openreq.error);
            openreq.onsuccess = () => resolve(openreq.result);
            // First time setup: create an empty object store
            openreq.onupgradeneeded = () => {
                openreq.result.createObjectStore(this._storeName);
            };
        });
    }
    _withIDBStore(type, callback) {
        this._init();
        return this._dbp.then(db => new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, type);
            transaction.oncomplete = () => resolve();
            transaction.onabort = transaction.onerror = () => reject(transaction.error);
            callback(transaction.objectStore(this.storeName));
        }));
    }
    _close() {
        this._init();
        return this._dbp.then(db => {
            db.close();
            this._dbp = undefined;
        });
    }
}
let store;
function getDefaultStore() {
    if (!store)
        store = new Store();
    return store;
}
function get(key, store = getDefaultStore()) {
    let req;
    return store._withIDBStore('readwrite', store => {
        req = store.get(key);
    }).then(() => req.result);
}
function set(key, value, store = getDefaultStore()) {
    return store._withIDBStore('readwrite', store => {
        store.put(value, key);
    });
}
function update(key, updater, store = getDefaultStore()) {
    return store._withIDBStore('readwrite', store => {
        const req = store.get(key);
        req.onsuccess = () => {
            store.put(updater(req.result), key);
        };
    });
}
function del(key, store = getDefaultStore()) {
    return store._withIDBStore('readwrite', store => {
        store.delete(key);
    });
}
function clear(store = getDefaultStore()) {
    return store._withIDBStore('readwrite', store => {
        store.clear();
    });
}
function keys(store = getDefaultStore()) {
    const keys = [];
    return store._withIDBStore('readwrite', store => {
        // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
        // And openKeyCursor isn't supported by Safari.
        (store.openKeyCursor || store.openCursor).call(store).onsuccess = function () {
            if (!this.result)
                return;
            keys.push(this.result.key);
            this.result.continue();
        };
    }).then(() => keys);
}
function close(store = getDefaultStore()) {
    return store._close();
}

const idbKeyval = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	Store,
	clear,
	close,
	del,
	get,
	keys,
	set,
	update
}, Symbol.toStringTag, { value: 'Module' }));

const require$$0 = /*@__PURE__*/getAugmentedNamespace(idbKeyval);

var IdbBackend_1;
var hasRequiredIdbBackend;

function requireIdbBackend () {
	if (hasRequiredIdbBackend) return IdbBackend_1;
	hasRequiredIdbBackend = 1;
	const idb = require$$0;

	IdbBackend_1 = class IdbBackend {
	  constructor(dbname, storename) {
	    this._database = dbname;
	    this._storename = storename;
	    this._store = new idb.Store(this._database, this._storename);
	  }
	  saveSuperblock(superblock) {
	    return idb.set("!root", superblock, this._store);
	  }
	  loadSuperblock() {
	    return idb.get("!root", this._store);
	  }
	  readFile(inode) {
	    return idb.get(inode, this._store)
	  }
	  writeFile(inode, data) {
	    return idb.set(inode, data, this._store)
	  }
	  unlink(inode) {
	    return idb.del(inode, this._store)
	  }
	  wipe() {
	    return idb.clear(this._store)
	  }
	  close() {
	    return idb.close(this._store)
	  }
	};
	return IdbBackend_1;
}

var HttpBackend_1;
var hasRequiredHttpBackend;

function requireHttpBackend () {
	if (hasRequiredHttpBackend) return HttpBackend_1;
	hasRequiredHttpBackend = 1;
	HttpBackend_1 = class HttpBackend {
	  constructor(url) {
	    this._url = url;
	  }
	  loadSuperblock() {
	    return fetch(this._url + '/.superblock.txt').then(res => res.ok ? res.text() : null)
	  }
	  async readFile(filepath) {
	    const res = await fetch(this._url + filepath);
	    if (res.status === 200) {
	      return res.arrayBuffer()
	    } else {
	      throw new Error('ENOENT')
	    }
	  }
	  async sizeFile(filepath) {
	    const res = await fetch(this._url + filepath, { method: 'HEAD' });
	    if (res.status === 200) {
	      return res.headers.get('content-length')
	    } else {
	      throw new Error('ENOENT')
	    }
	  }
	};
	return HttpBackend_1;
}

var Mutex_1;
var hasRequiredMutex;

function requireMutex () {
	if (hasRequiredMutex) return Mutex_1;
	hasRequiredMutex = 1;
	const idb = require$$0;

	const sleep = ms => new Promise(r => setTimeout(r, ms));

	Mutex_1 = class Mutex {
	  constructor(dbname, storename) {
	    this._id = Math.random();
	    this._database = dbname;
	    this._storename = storename;
	    this._store = new idb.Store(this._database, this._storename);
	    this._lock = null;
	  }
	  async has ({ margin = 2000 } = {}) {
	    if (this._lock && this._lock.holder === this._id) {
	      const now = Date.now();
	      if (this._lock.expires > now + margin) {
	        return true
	      } else {
	        return await this.renew()
	      }
	    } else {
	      return false
	    }
	  }
	  // Returns true if successful
	  async renew ({ ttl = 5000 } = {}) {
	    let success;
	    await idb.update("lock", (current) => {
	      const now = Date.now();
	      const expires = now + ttl;
	      success = current && current.holder === this._id;
	      this._lock = success ? { holder: this._id, expires } : current;
	      return this._lock
	    }, this._store);
	    return success
	  }
	  // Returns true if successful
	  async acquire ({ ttl = 5000 } = {}) {
	    let success;
	    let expired;
	    let doubleLock;
	    await idb.update("lock", (current) => {
	      const now = Date.now();
	      const expires = now + ttl;
	      expired = current && current.expires < now;
	      success = current === undefined || expired;
	      doubleLock = current && current.holder === this._id;
	      this._lock = success ? { holder: this._id, expires } : current;
	      return this._lock
	    }, this._store);
	    if (doubleLock) {
	      throw new Error('Mutex double-locked')
	    }
	    return success
	  }
	  // check at 10Hz, give up after 10 minutes
	  async wait ({ interval = 100, limit = 6000, ttl } = {}) {
	    while (limit--) {
	      if (await this.acquire({ ttl })) return true
	      await sleep(interval);
	    }
	    throw new Error('Mutex timeout')
	  }
	  // Returns true if successful
	  async release ({ force = false } = {}) {
	    let success;
	    let doubleFree;
	    let someoneElseHasIt;
	    await idb.update("lock", (current) => {
	      success = force || (current && current.holder === this._id);
	      doubleFree = current === void 0;
	      someoneElseHasIt = current && current.holder !== this._id;
	      this._lock = success ? void 0 : current;
	      return this._lock
	    }, this._store);
	    await idb.close(this._store);
	    if (!success && !force) {
	      if (doubleFree) throw new Error('Mutex double-freed')
	      if (someoneElseHasIt) throw new Error('Mutex lost ownership')
	    }
	    return success
	  }
	};
	return Mutex_1;
}

var Mutex2;
var hasRequiredMutex2;

function requireMutex2 () {
	if (hasRequiredMutex2) return Mutex2;
	hasRequiredMutex2 = 1;
	Mutex2 = class Mutex {
	  constructor(name) {
	    this._id = Math.random();
	    this._database = name;
	    this._has = false;
	    this._release = null;
	  }
	  async has () {
	    return this._has
	  }
	  // Returns true if successful
	  async acquire () {
	    return new Promise(resolve => {
	      navigator.locks.request(this._database + "_lock", {ifAvailable: true}, lock => {
	        this._has = !!lock;
	        resolve(!!lock);
	        return new Promise(resolve => {
	          this._release = resolve;
	        })
	      }); 
	    })
	  }
	  // Returns true if successful, gives up after 10 minutes
	  async wait ({ timeout = 600000 } = {}) {
	    return new Promise((resolve, reject) => {
	      const controller = new AbortController();
	      setTimeout(() => {
	        controller.abort();
	        reject(new Error('Mutex timeout'));
	      }, timeout);
	      navigator.locks.request(this._database + "_lock", {signal: controller.signal}, lock => {
	        this._has = !!lock;
	        resolve(!!lock);
	        return new Promise(resolve => {
	          this._release = resolve;
	        })
	      }); 
	    })
	  }
	  // Returns true if successful
	  async release ({ force = false } = {}) {
	    this._has = false;
	    if (this._release) {
	      this._release();
	    } else if (force) {
	      navigator.locks.request(this._database + "_lock", {steal: true}, lock => true);
	    }
	  }
	};
	return Mutex2;
}

var DefaultBackend_1;
var hasRequiredDefaultBackend;

function requireDefaultBackend () {
	if (hasRequiredDefaultBackend) return DefaultBackend_1;
	hasRequiredDefaultBackend = 1;
	const { encode, decode } = requireBrowser();
	const debounce = requireJustDebounceIt();

	const CacheFS = requireCacheFS();
	const { ENOENT, ENOTEMPTY, ETIMEDOUT } = requireErrors();
	const IdbBackend = requireIdbBackend();
	const HttpBackend = requireHttpBackend();
	const Mutex = requireMutex();
	const Mutex2 = requireMutex2();

	const path = requirePath();

	DefaultBackend_1 = class DefaultBackend {
	  constructor() {
	    this.saveSuperblock = debounce(() => {
	      this.flush();
	    }, 500);
	  }
	  async init (name, {
	    wipe,
	    url,
	    urlauto,
	    fileDbName = name,
	    db = null,
	    fileStoreName = name + "_files",
	    lockDbName = name + "_lock",
	    lockStoreName = name + "_lock",
	  } = {}) {
	    this._name = name;
	    this._idb = db || new IdbBackend(fileDbName, fileStoreName);
	    this._mutex = navigator.locks ? new Mutex2(name) : new Mutex(lockDbName, lockStoreName);
	    this._cache = new CacheFS(name);
	    this._opts = { wipe, url };
	    this._needsWipe = !!wipe;
	    if (url) {
	      this._http = new HttpBackend(url);
	      this._urlauto = !!urlauto;
	    }
	  }
	  async activate() {
	    if (this._cache.activated) return
	    // Wipe IDB if requested
	    if (this._needsWipe) {
	      this._needsWipe = false;
	      await this._idb.wipe();
	      await this._mutex.release({ force: true });
	    }
	    if (!(await this._mutex.has())) await this._mutex.wait();
	    // Attempt to load FS from IDB backend
	    const root = await this._idb.loadSuperblock();
	    if (root) {
	      this._cache.activate(root);
	    } else if (this._http) {
	      // If that failed, attempt to load FS from HTTP backend
	      const text = await this._http.loadSuperblock();
	      this._cache.activate(text);
	      await this._saveSuperblock();
	    } else {
	      // If there is no HTTP backend, start with an empty filesystem
	      this._cache.activate();
	    }
	    if (await this._mutex.has()) {
	      return
	    } else {
	      throw new ETIMEDOUT()
	    }
	  }
	  async deactivate() {
	    if (await this._mutex.has()) {
	      await this._saveSuperblock();
	    }
	    this._cache.deactivate();
	    try {
	      await this._mutex.release();
	    } catch (e) {
	      console.log(e);
	    }
	    await this._idb.close();
	  }
	  async _saveSuperblock() {
	    if (this._cache.activated) {
	      this._lastSavedAt = Date.now();
	      await this._idb.saveSuperblock(this._cache._root);
	    }
	  }
	  _writeStat(filepath, size, opts) {
	    let dirparts = path.split(path.dirname(filepath));
	    let dir = dirparts.shift();
	    for (let dirpart of dirparts) {
	      dir = path.join(dir, dirpart);
	      try {
	        this._cache.mkdir(dir, { mode: 0o777 });
	      } catch (e) {}
	    }
	    return this._cache.writeStat(filepath, size, opts)
	  }
	  async readFile(filepath, opts) {
	    const { encoding } = opts;
	    if (encoding && encoding !== 'utf8') throw new Error('Only "utf8" encoding is supported in readFile');
	    let data = null, stat = null;
	    try {
	      stat = this._cache.stat(filepath);
	      data = await this._idb.readFile(stat.ino);
	    } catch (e) {
	      if (!this._urlauto) throw e
	    }
	    if (!data && this._http) {
	      let lstat = this._cache.lstat(filepath);
	      while (lstat.type === 'symlink') {
	        filepath = path.resolve(path.dirname(filepath), lstat.target);
	        lstat = this._cache.lstat(filepath);
	      }
	      data = await this._http.readFile(filepath);
	    }
	    if (data) {
	      if (!stat || stat.size != data.byteLength) {
	        stat = await this._writeStat(filepath, data.byteLength, { mode: stat ? stat.mode : 0o666 });
	        this.saveSuperblock(); // debounced
	      }
	      if (encoding === "utf8") {
	        data = decode(data);
	      } else {
	        data.toString = () => decode(data);
	      }
	    }
	    if (!stat) throw new ENOENT(filepath)
	    return data;
	  }
	  async writeFile(filepath, data, opts) {
	    const { mode, encoding = "utf8" } = opts;
	    if (typeof data === "string") {
	      if (encoding !== "utf8") {
	        throw new Error('Only "utf8" encoding is supported in writeFile');
	      }
	      data = encode(data);
	    }
	    const stat = await this._cache.writeStat(filepath, data.byteLength, { mode });
	    await this._idb.writeFile(stat.ino, data);
	  }
	  async unlink(filepath, opts) {
	    const stat = this._cache.lstat(filepath);
	    this._cache.unlink(filepath);
	    if (stat.type !== 'symlink') {
	      await this._idb.unlink(stat.ino);
	    }
	  }
	  readdir(filepath, opts) {
	    return this._cache.readdir(filepath);
	  }
	  mkdir(filepath, opts) {
	    const { mode = 0o777 } = opts;
	    this._cache.mkdir(filepath, { mode });
	  }
	  rmdir(filepath, opts) {
	    // Never allow deleting the root directory.
	    if (filepath === "/") {
	      throw new ENOTEMPTY();
	    }
	    this._cache.rmdir(filepath);
	  }
	  rename(oldFilepath, newFilepath) {
	    this._cache.rename(oldFilepath, newFilepath);
	  }
	  stat(filepath, opts) {
	    return this._cache.stat(filepath);
	  }
	  lstat(filepath, opts) {
	    return this._cache.lstat(filepath);
	  }
	  readlink(filepath, opts) {
	    return this._cache.readlink(filepath);
	  }
	  symlink(target, filepath) {
	    this._cache.symlink(target, filepath);
	  }
	  async backFile(filepath, opts) {
	    let size = await this._http.sizeFile(filepath);
	    await this._writeStat(filepath, size, opts);
	  }
	  du(filepath) {
	    return this._cache.du(filepath);
	  }
	  flush() {
	    return this._saveSuperblock();
	  }
	};
	return DefaultBackend_1;
}

var Stat_1;
var hasRequiredStat;

function requireStat () {
	if (hasRequiredStat) return Stat_1;
	hasRequiredStat = 1;
	Stat_1 = class Stat {
	  constructor(stats) {
	    this.type = stats.type;
	    this.mode = stats.mode;
	    this.size = stats.size;
	    this.ino = stats.ino;
	    this.mtimeMs = stats.mtimeMs;
	    this.ctimeMs = stats.ctimeMs || stats.mtimeMs;
	    this.uid = 1;
	    this.gid = 1;
	    this.dev = 1;
	  }
	  isFile() {
	    return this.type === "file";
	  }
	  isDirectory() {
	    return this.type === "dir";
	  }
	  isSymbolicLink() {
	    return this.type === "symlink";
	  }
	};
	return Stat_1;
}

var PromisifiedFS_1;
var hasRequiredPromisifiedFS;

function requirePromisifiedFS () {
	if (hasRequiredPromisifiedFS) return PromisifiedFS_1;
	hasRequiredPromisifiedFS = 1;
	const DefaultBackend = requireDefaultBackend();
	const Stat = requireStat();

	const path = requirePath();

	function cleanParamsFilepathOpts(filepath, opts, ...rest) {
	  // normalize paths
	  filepath = path.normalize(filepath);
	  // strip out callbacks
	  if (typeof opts === "undefined" || typeof opts === "function") {
	    opts = {};
	  }
	  // expand string options to encoding options
	  if (typeof opts === "string") {
	    opts = {
	      encoding: opts,
	    };
	  }
	  return [filepath, opts, ...rest];
	}

	function cleanParamsFilepathDataOpts(filepath, data, opts, ...rest) {
	  // normalize paths
	  filepath = path.normalize(filepath);
	  // strip out callbacks
	  if (typeof opts === "undefined" || typeof opts === "function") {
	    opts = {};
	  }
	  // expand string options to encoding options
	  if (typeof opts === "string") {
	    opts = {
	      encoding: opts,
	    };
	  }
	  return [filepath, data, opts, ...rest];
	}

	function cleanParamsFilepathFilepath(oldFilepath, newFilepath, ...rest) {
	  // normalize paths
	  return [path.normalize(oldFilepath), path.normalize(newFilepath), ...rest];
	}

	PromisifiedFS_1 = class PromisifiedFS {
	  constructor(name, options = {}) {
	    this.init = this.init.bind(this);
	    this.readFile = this._wrap(this.readFile, cleanParamsFilepathOpts, false);
	    this.writeFile = this._wrap(this.writeFile, cleanParamsFilepathDataOpts, true);
	    this.unlink = this._wrap(this.unlink, cleanParamsFilepathOpts, true);
	    this.readdir = this._wrap(this.readdir, cleanParamsFilepathOpts, false);
	    this.mkdir = this._wrap(this.mkdir, cleanParamsFilepathOpts, true);
	    this.rmdir = this._wrap(this.rmdir, cleanParamsFilepathOpts, true);
	    this.rename = this._wrap(this.rename, cleanParamsFilepathFilepath, true);
	    this.stat = this._wrap(this.stat, cleanParamsFilepathOpts, false);
	    this.lstat = this._wrap(this.lstat, cleanParamsFilepathOpts, false);
	    this.readlink = this._wrap(this.readlink, cleanParamsFilepathOpts, false);
	    this.symlink = this._wrap(this.symlink, cleanParamsFilepathFilepath, true);
	    this.backFile = this._wrap(this.backFile, cleanParamsFilepathOpts, true);
	    this.du = this._wrap(this.du, cleanParamsFilepathOpts, false);

	    this._deactivationPromise = null;
	    this._deactivationTimeout = null;
	    this._activationPromise = null;

	    this._operations = new Set();

	    if (name) {
	      this.init(name, options);
	    }
	  }
	  async init (...args) {
	    if (this._initPromiseResolve) await this._initPromise;
	    this._initPromise = this._init(...args);
	    return this._initPromise
	  }
	  async _init (name, options = {}) {
	    await this._gracefulShutdown();
	    if (this._activationPromise) await this._deactivate();

	    if (this._backend && this._backend.destroy) {
	      await this._backend.destroy();
	    }
	    this._backend = options.backend || new DefaultBackend();
	    if (this._backend.init) {
	      await this._backend.init(name, options);
	    }

	    if (this._initPromiseResolve) {
	      this._initPromiseResolve();
	      this._initPromiseResolve = null;
	    }
	    // The next comment starting with the "fs is initially activated when constructed"?
	    // That can create contention for the mutex if two threads try to init at the same time
	    // so I've added an option to disable that behavior.
	    if (!options.defer) {
	      // The fs is initially activated when constructed (in order to wipe/save the superblock)
	      // This is not awaited, because that would create a cycle.
	      this.stat('/');
	    }
	  }
	  async _gracefulShutdown () {
	    if (this._operations.size > 0) {
	      this._isShuttingDown = true;
	      await new Promise(resolve => this._gracefulShutdownResolve = resolve);
	      this._isShuttingDown = false;
	      this._gracefulShutdownResolve = null;
	    }
	  }
	  _wrap (fn, paramCleaner, mutating) {
	    return async (...args) => {
	      args = paramCleaner(...args);
	      let op = {
	        name: fn.name,
	        args,
	      };
	      this._operations.add(op);
	      try {
	        await this._activate();
	        return await fn.apply(this, args)
	      } finally {
	        this._operations.delete(op);
	        if (mutating) this._backend.saveSuperblock(); // this is debounced
	        if (this._operations.size === 0) {
	          if (!this._deactivationTimeout) clearTimeout(this._deactivationTimeout);
	          this._deactivationTimeout = setTimeout(this._deactivate.bind(this), 500);
	        }
	      }
	    }
	  }
	  async _activate() {
	    if (!this._initPromise) console.warn(new Error(`Attempted to use LightningFS ${this._name} before it was initialized.`));
	    await this._initPromise;
	    if (this._deactivationTimeout) {
	      clearTimeout(this._deactivationTimeout);
	      this._deactivationTimeout = null;
	    }
	    if (this._deactivationPromise) await this._deactivationPromise;
	    this._deactivationPromise = null;
	    if (!this._activationPromise) {
	      this._activationPromise = this._backend.activate ? this._backend.activate() : Promise.resolve();
	    }
	    await this._activationPromise;
	  }
	  async _deactivate() {
	    if (this._activationPromise) await this._activationPromise;

	    if (!this._deactivationPromise) {
	      this._deactivationPromise = this._backend.deactivate ? this._backend.deactivate() : Promise.resolve();
	    }
	    this._activationPromise = null;
	    if (this._gracefulShutdownResolve) this._gracefulShutdownResolve();
	    return this._deactivationPromise
	  }
	  async readFile(filepath, opts) {
	    return this._backend.readFile(filepath, opts);
	  }
	  async writeFile(filepath, data, opts) {
	    await this._backend.writeFile(filepath, data, opts);
	    return null
	  }
	  async unlink(filepath, opts) {
	    await this._backend.unlink(filepath, opts);
	    return null
	  }
	  async readdir(filepath, opts) {
	    return this._backend.readdir(filepath, opts);
	  }
	  async mkdir(filepath, opts) {
	    await this._backend.mkdir(filepath, opts);
	    return null
	  }
	  async rmdir(filepath, opts) {
	    await this._backend.rmdir(filepath, opts);
	    return null;
	  }
	  async rename(oldFilepath, newFilepath) {
	    await this._backend.rename(oldFilepath, newFilepath);
	    return null;
	  }
	  async stat(filepath, opts) {
	    const data = await this._backend.stat(filepath, opts);
	    return new Stat(data);
	  }
	  async lstat(filepath, opts) {
	    const data = await this._backend.lstat(filepath, opts);
	    return new Stat(data);
	  }
	  async readlink(filepath, opts) {
	    return this._backend.readlink(filepath, opts);
	  }
	  async symlink(target, filepath) {
	    await this._backend.symlink(target, filepath);
	    return null;
	  }
	  async backFile(filepath, opts) {
	    await this._backend.backFile(filepath, opts);
	    return null
	  }
	  async du(filepath) {
	    return this._backend.du(filepath);
	  }
	  async flush() {
	    return this._backend.flush();
	  }
	};
	return PromisifiedFS_1;
}

var src;
var hasRequiredSrc;

function requireSrc () {
	if (hasRequiredSrc) return src;
	hasRequiredSrc = 1;
	const once = requireJustOnce();

	const PromisifiedFS = requirePromisifiedFS();

	function wrapCallback (opts, cb) {
	  if (typeof opts === "function") {
	    cb = opts;
	  }
	  cb = once(cb);
	  const resolve = (...args) => cb(null, ...args);
	  return [resolve, cb];
	}

	src = class FS {
	  constructor(...args) {
	    this.promises = new PromisifiedFS(...args);
	    // Needed so things don't break if you destructure fs and pass individual functions around
	    this.init = this.init.bind(this);
	    this.readFile = this.readFile.bind(this);
	    this.writeFile = this.writeFile.bind(this);
	    this.unlink = this.unlink.bind(this);
	    this.readdir = this.readdir.bind(this);
	    this.mkdir = this.mkdir.bind(this);
	    this.rmdir = this.rmdir.bind(this);
	    this.rename = this.rename.bind(this);
	    this.stat = this.stat.bind(this);
	    this.lstat = this.lstat.bind(this);
	    this.readlink = this.readlink.bind(this);
	    this.symlink = this.symlink.bind(this);
	    this.backFile = this.backFile.bind(this);
	    this.du = this.du.bind(this);
	    this.flush = this.flush.bind(this);
	  }
	  init(name, options) {
	    return this.promises.init(name, options)
	  }
	  readFile(filepath, opts, cb) {
	    const [resolve, reject] = wrapCallback(opts, cb);
	    this.promises.readFile(filepath, opts).then(resolve).catch(reject);
	  }
	  writeFile(filepath, data, opts, cb) {
	    const [resolve, reject] = wrapCallback(opts, cb);
	    this.promises.writeFile(filepath, data, opts).then(resolve).catch(reject);
	  }
	  unlink(filepath, opts, cb) {
	    const [resolve, reject] = wrapCallback(opts, cb);
	    this.promises.unlink(filepath, opts).then(resolve).catch(reject);
	  }
	  readdir(filepath, opts, cb) {
	    const [resolve, reject] = wrapCallback(opts, cb);
	    this.promises.readdir(filepath, opts).then(resolve).catch(reject);
	  }
	  mkdir(filepath, opts, cb) {
	    const [resolve, reject] = wrapCallback(opts, cb);
	    this.promises.mkdir(filepath, opts).then(resolve).catch(reject);
	  }
	  rmdir(filepath, opts, cb) {
	    const [resolve, reject] = wrapCallback(opts, cb);
	    this.promises.rmdir(filepath, opts).then(resolve).catch(reject);
	  }
	  rename(oldFilepath, newFilepath, cb) {
	    const [resolve, reject] = wrapCallback(cb);
	    this.promises.rename(oldFilepath, newFilepath).then(resolve).catch(reject);
	  }
	  stat(filepath, opts, cb) {
	    const [resolve, reject] = wrapCallback(opts, cb);
	    this.promises.stat(filepath).then(resolve).catch(reject);
	  }
	  lstat(filepath, opts, cb) {
	    const [resolve, reject] = wrapCallback(opts, cb);
	    this.promises.lstat(filepath).then(resolve).catch(reject);
	  }
	  readlink(filepath, opts, cb) {
	    const [resolve, reject] = wrapCallback(opts, cb);
	    this.promises.readlink(filepath).then(resolve).catch(reject);
	  }
	  symlink(target, filepath, cb) {
	    const [resolve, reject] = wrapCallback(cb);
	    this.promises.symlink(target, filepath).then(resolve).catch(reject);
	  }
	  backFile(filepath, opts, cb) {
	    const [resolve, reject] = wrapCallback(opts, cb);
	    this.promises.backFile(filepath, opts).then(resolve).catch(reject);
	  }
	  du(filepath, cb) {
	    const [resolve, reject] = wrapCallback(cb);
	    this.promises.du(filepath).then(resolve).catch(reject);
	  }
	  flush(cb) {
	    const [resolve, reject] = wrapCallback(cb);
	    this.promises.flush().then(resolve).catch(reject);
	  }
	};
	return src;
}

var srcExports = requireSrc();
const LightningFS = /*@__PURE__*/getDefaultExportFromCjs(srcExports);

const config = await getConfig();
const logger = new Logger(config.logging.IDBFs);

function consoleDotLog(...parameters) {
  logger.consoleDotLog('[IDBFS] ', ...parameters);
}

function consoleDotError(...parameters) {
  logger.consoleDotError('[IDBFS] ', ...parameters);
}

class IDBFs {
  constructor(fsName, options = {}) {
    this.fs = new LightningFS(fsName, options);
    this.fileDescriptors = new Map();
    this.fdCounter = 3;
    this.workerEntry = null;
    this.workerThread = null;
    this.fsName = fsName;
    this.versioningStrategy = options?.versioning?.strategy || config.versioning.strategy;
    this.doImmediateCommit = (this.versioningStrategy === 'immediate') ? true : false;

    // Initialize worker asynchronously
    (async () => {
      await this.initializeWorker();
    })();

    consoleDotLog("IDBFS initialized with LightningFS.");
  }

  async initializeWorker() {
    this.workerEntry = await workerPool.getWorker(this.fsName);
    this.workerThread = this.workerEntry.thread;

    await this.workerThread.execute('setFs', {
      fsName: this.fsName,
      fsType: 'idb',
      gitDir: '/'
    });

    consoleDotLog(`Worker initialized for ${this.fsName}`);
  }

  async cleanup() {
    if (this.workerEntry) {
      await workerPool.releaseWorker(this.fsName);
      this.workerEntry = null;
      this.workerThread = null;
    }
  }

  async fs_fopen(filename, mode) {
    if (!this.workerThread) await this.initializeWorker();
    consoleDotLog(`Opening file: ${filename} with mode: ${mode}`);
    
    // Check if parent directory exists for new files
    if (mode.includes('w') || mode.includes('a') || mode.includes('x')) {
      const parentDir = filename.split('/').slice(0, -1).join('/');
      if (parentDir) {
        const dirExists = await this.workerThread.execute('isDirectoryDot', { path: parentDir });
        if (!dirExists.exists || !dirExists.isDirectory) {
          throw new Error(`ENOENT: no such directory, open '${filename}'`);
        }
      }
    }

    const fd = this.fdCounter++;
    this.fileDescriptors.set(fd, { path: filename, pos: 0, mode });
    consoleDotLog(`File descriptor ${fd} created for file: ${filename}`);
    return fd;
  }

  async fs_fclose(fd) {
    consoleDotLog(`Closing file descriptor: ${fd}`);
    if (!this.fileDescriptors.has(fd)) {
      throw new Error(`EBADF: bad file descriptor, close '${fd}'`);
    }
    this.fileDescriptors.delete(fd);
    consoleDotLog(`File descriptor ${fd} closed successfully.`);
    return 0;
  }

  async fs_fread(fd, length) {
    consoleDotLog(`Reading ${length} bytes from file descriptor: ${fd}`);
    const file = this.fileDescriptors.get(fd);
    if (!file) {
      throw new Error(`EBADF: bad file descriptor, read '${fd}'`);
    }

    try {
      if (!this.workerThread) await this.initializeWorker();
      const data = await this.workerThread.execute('readFileDot', { filePath: file.path });
      if (data === null) {
        throw new Error(`ENOENT: no such file, read '${file.path}'`);
      }
      const chunk = data.slice(file.pos, file.pos + length);
      file.pos += chunk.length;
      consoleDotLog(`Read chunk: ${chunk}, new position: ${file.pos}`);
      return chunk;
    } catch (error) {
      consoleDotError(`Error reading file ${file.path}:`, error);
      throw error;
    }
  }

  async fs_fwrite(fd, content) {
    consoleDotLog(`Writing content to file descriptor: ${fd}`);
    const file = this.fileDescriptors.get(fd);
    if (!file) {
      throw new Error(`EBADF: bad file descriptor, write '${fd}'`);
    }

    try {
      if (!this.workerThread) await this.initializeWorker();
      
      // Check if the file's parent directory exists
      const parentDir = file.path.split('/').slice(0, -1).join('/');
      if (parentDir) {
        const dirExists = await this.workerThread.execute('isDirectoryDot', { path: parentDir });
        if (!dirExists.exists || !dirExists.isDirectory) {
          throw new Error(`ENOENT: no such directory, open '${file.path}'`);
        }
      }

      let currentData = await this.workerThread.execute('readFileDot', { filePath: file.path }).catch(() => "");
      let data = currentData;
      consoleDotLog(`Current data in file ${file.path}:`, data);
      if (data === null) data = "";
      data = data.slice(0, file.pos) + content + data.slice(file.pos + content.length);
      await this.workerThread.execute('writeFileDot', {
        filePath: file.path,
        fileContent: data,
        doCommit: this.doImmediateCommit
      });
      file.pos += content.length;
      consoleDotLog(`Content written to file ${file.path}, new position: ${file.pos}`);
      return content.length;
    } catch (error) {
      consoleDotError(`Error writing to file ${file.path}:`, error);
      throw error;
    }
  }

  async fs_fseek(fd, offset, whence) {
    consoleDotLog(`Seeking in file descriptor: ${fd}, offset: ${offset}, whence: ${whence}`);
    const file = this.fileDescriptors.get(fd);
    if (!file) {
      throw new Error(`EBADF: bad file descriptor, seek '${fd}'`);
    }

    try {
      if (!this.workerThread) await this.initializeWorker();
      const data = await this.workerThread.execute('readFileDot', { filePath: file.path }).catch(() => "");
      if (whence === "SEEK_SET") file.pos = offset;
      else if (whence === "SEEK_CUR") file.pos += offset;
      else if (whence === "SEEK_END") file.pos = data.length + offset;

      file.pos = Math.max(0, Math.min(file.pos, data.length));
      consoleDotLog(`New position in file ${file.path}: ${file.pos}`);
      return 0;
    } catch (error) {
      consoleDotError(`Error seeking in file ${file.path}:`, error);
      throw error;
    }
  }

  async fs_ftell(fd) {
    consoleDotLog(`Getting current position for file descriptor: ${fd}`);
    const file = this.fileDescriptors.get(fd);
    if (!file) {
      throw new Error(`EBADF: bad file descriptor, tell '${fd}'`);
    }
    consoleDotLog(`Current position in file ${file.path}: ${file.pos}`);
    return file.pos;
  }

  async fs_ftruncate(fd, length) {
    consoleDotLog(`Truncating file descriptor: ${fd} to length: ${length}`);
    const file = this.fileDescriptors.get(fd);
    if (!file) {
      throw new Error(`EBADF: bad file descriptor, truncate '${fd}'`);
    }

    try {
      if (!this.workerThread) await this.initializeWorker();
      let currentData = await this.workerThread.execute('readFileDot', { filePath: file.path }).catch(() => "");
      let data = currentData;
      consoleDotLog(`Current data in file ${file.path}:`, data);
      data = data.slice(0, length);
      await this.workerThread.execute('writeFileDot', {
        filePath: file.path,
        fileContent: data,
        doCommit: this.doImmediateCommit
      });
      consoleDotLog(`File ${file.path} truncated to length: ${length}`);
      return 0;
    } catch (error) {
      consoleDotError(`Error truncating file ${file.path}:`, error);
      throw error;
    }
  }

  async fs_stat(path) {
    consoleDotLog(`Getting stats for path: ${path}`);
  
    try {
      const normalizedPath = path.replace(/^\/+|\/+$/g, '');
      if (!this.workerThread) await this.initializeWorker();
  
      // First check basic existence and directory status
      const exists = await this.workerThread.execute('isDirectoryDot', { path });
      if (!exists.exists) {
        throw new Error(`ENOENT: no such file or directory, stat '${path}'`);
      }
  
      // Get the complete note metadata
      const noteType = exists.isDirectory ? 'dentry' : 'inode';
      const noteData = await this.workerThread.execute('getPathNote', {
        path
      });

      // If note doesn't exist, create basic stats
      if (noteData.error || !noteData || !noteData?.paths?.[normalizedPath]) {
        consoleDotLog(`No note found for ${path}, returning basic stats`);
      }
  
      // Process the full metadata
      const metadata = noteData?.paths?.[normalizedPath]?.metadata || noteData;
      const stats = {
        // Standard fs.Stats properties
        dev: 0,
        ino: metadata.inode || metadata.dentry_id || 0,
        mode: parseInt(metadata.mode, 8) || (exists.isDirectory ? 16877 : 33188),
        nlink: 1,
        uid: metadata.uid || 1000,
        gid: metadata.gid || 1000,
        rdev: 0,
        size: metadata.size || 0,
        blksize: metadata.block_size || 4096,
        blocks: Math.ceil((metadata.size || 0) / 4096),
        atimeMs: new Date(metadata.atime || metadata.updated_at).getTime(),
        mtimeMs: new Date(metadata.mtime || metadata.updated_at).getTime(),
        ctimeMs: new Date(metadata.ctime || metadata.created_at).getTime(),
        birthtimeMs: new Date(metadata.created_at).getTime(),
  
        // Extended properties from notes
        acl: metadata.acl || 'root',
        owner: metadata.owner,
        fsType: metadata.fsType,
        fullPath: metadata.full_path || path,
  
        // Boolean check methods
        isDirectory: () => exists.isDirectory,
        isFile: () => !exists.isDirectory,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isSymbolicLink: () => false,
        isFIFO: () => false,
        isSocket: () => false,
  
        // Timestamp getters
        atime: () => new Date(metadata.atime || metadata.updated_at),
        mtime: () => new Date(metadata.mtime || metadata.updated_at),
        ctime: () => new Date(metadata.ctime || metadata.created_at),
        birthtime: () => new Date(metadata.created_at),
  
        // Additional metadata
        getMetadata: () => metadata,
        getNoteType: () => noteType,
        getAllPaths: () => noteData.filepath_metadata ? Object.keys(noteData.filepath_metadata) : [path]
      };
  
      consoleDotLog(`Retrieved detailed stats for ${path}`, stats);
      return stats;
    } catch (error) {
      consoleDotError(`Error getting stats for path ${path}:`, error);
      
      // Return basic stats if detailed info fails
      if (error.message.includes('ENOENT')) {
        throw error;
      }
    }
  }

  async fs_fstat(fd) {
    consoleDotLog(`Getting stats for file descriptor: ${fd}`);
    const file = this.fileDescriptors.get(fd);
    if (!file) {
      throw new Error(`EBADF: bad file descriptor, fstat '${fd}'`);
    }
    return this.fs_stat(file.path);
  }

  async fs_remove(path) {
    if (!this.workerThread) await this.initializeWorker();
    consoleDotLog(`Removing file: ${path}`);
    try {
      const exists = await this.workerThread.execute('isDirectoryDot', { path });
      if (!exists.exists) {
        throw new Error(`ENOENT: no such file, unlink '${path}'`);
      }
      if (exists.isDirectory) {
        throw new Error(`EISDIR: illegal operation on a directory, unlink '${path}'`);
      }
      
      await this.workerThread.execute('removeFileDot', {
        filePath: path,
        doCommit: this.doImmediateCommit
      });
      return 0;
    } catch (error) {
      consoleDotError(`Error removing file ${path}:`, error);
      throw error;
    }
  }

  async fs_mkdir(path) {
    if (!this.workerThread) await this.initializeWorker();
    consoleDotLog(`Creating directory: ${path}`);
    try {
      // Check if parent directory exists
      const parentDir = path.split('/').slice(0, -1).join('/');
      if (parentDir) {
        const dirExists = await this.workerThread.execute('isDirectoryDot', { path: parentDir });
        if (!dirExists.exists || !dirExists.isDirectory) {
          throw new Error(`ENOENT: no such directory, mkdir '${path}'`);
        }
      }

      // Check if path already exists
      const exists = await this.workerThread.execute('isDirectoryDot', { path });
      if (exists.exists) {
        throw new Error(`EEXIST: file or directory already exists, mkdir '${path}'`);
      }

      await this.workerThread.execute('mkdirDot', {
        dirPath: path,
        doCommit: this.doImmediateCommit
      });
      return 0;
    } catch (error) {
      consoleDotError(`Error creating directory ${path}:`, error);
      throw error;
    }
  }

  async fs_rmdir(path) {
    if (!this.workerThread) await this.initializeWorker();
    consoleDotLog(`Removing directory: ${path}`);
    try {
      const exists = await this.workerThread.execute('isDirectoryDot', { path });
      if (!exists.exists) {
        throw new Error(`ENOENT: no such directory, rmdir '${path}'`);
      }
      if (!exists.isDirectory) {
        throw new Error(`ENOTDIR: not a directory, rmdir '${path}'`);
      }

      // Check if directory is empty
      const dirContents = await this.fs_readdir(path);
      if (dirContents.length > 0) {
        throw new Error(`ENOTEMPTY: directory not empty, rmdir '${path}'`);
      }

      await this.workerThread.execute('removeDirDot', {
        dirPath: path,
        doCommit: this.doImmediateCommit
      });
      return 0;
    } catch (error) {
      consoleDotError(`Error removing directory ${path}:`, error);
      throw error;
    }
  }

  async fs_rename(oldPath, newPath) {
    if (!this.workerThread) await this.initializeWorker();
    consoleDotLog(`Renaming ${oldPath} to ${newPath}`);
    try {
      // Check if oldPath exists
      const oldExists = await this.workerThread.execute('isDirectoryDot', { path: oldPath });
      if (!oldExists.exists) {
        throw new Error(`ENOENT: no such file or directory, rename '${oldPath}' -> '${newPath}'`);
      }

      // Check if newPath's parent directory exists
      const newParentDir = newPath.split('/').slice(0, -1).join('/');
      if (newParentDir) {
        const parentExists = await this.workerThread.execute('isDirectoryDot', { path: newParentDir });
        if (!parentExists.exists || !parentExists.isDirectory) {
          throw new Error(`ENOENT: no such directory, rename '${oldPath}' -> '${newPath}'`);
        }
      }

      await this.workerThread.execute('rename', {
        oldPath,
        newPath
      });
      return 0;
    } catch (error) {
      consoleDotError(`Error renaming ${oldPath} to ${newPath}:`, error);
      throw error;
    }
  }

  async fs_opendir(path) {
    if (!this.workerThread) await this.initializeWorker();
    consoleDotLog(`Opening directory: ${path}`);
    try {
      const exists = await this.workerThread.execute('isDirectoryDot', { path });
      if (!exists.exists) {
        throw new Error(`ENOENT: no such directory, opendir '${path}'`);
      }
      if (!exists.isDirectory) {
        throw new Error(`ENOTDIR: not a directory, opendir '${path}'`);
      }

      await this.workerThread.execute('opendir', { path });
      return 0;
    } catch (error) {
      consoleDotError(`Error opening directory ${path}:`, error);
      throw error;
    }
  }

  async fs_readdir(path, options = {}) {
    consoleDotLog(`Reading directory: ${path}`);
    try {
      if (!this.workerThread) await this.initializeWorker();

      const exists = await this.workerThread.execute('isDirectoryDot', { path });
      if (!exists.exists) {
        throw new Error(`ENOENT: no such directory, readdir '${path}'`);
      }
      if (!exists.isDirectory) {
        throw new Error(`ENOTDIR: not a directory, readdir '${path}'`);
      }

      const result = await this.workerThread.execute('readDirDot', { path });
      const dirEntries = result?.entries || [];

      return dirEntries.map(entry => ({ path: entry.path, type: (entry.type === 'tree' ? 'dir' : 'file') }));
      
    } catch (error) {
      consoleDotError(`Error reading directory ${path}:`, error);
      throw error;
    }
  }

  async fs_feof(fd) {
    consoleDotLog(`Checking EOF for file descriptor: ${fd}`);
    const file = this.fileDescriptors.get(fd);
    if (!file) {
      throw new Error(`EBADF: bad file descriptor, eof '${fd}'`);
    }

    try {
      if (!this.workerThread) await this.initializeWorker();
      const data = await this.workerThread.execute('readFileDot', { filePath: file.path }).catch(() => "");
      consoleDotLog(`Current data in file ${file.path}:`, data);
      const eof = file.pos >= data.length;
      consoleDotLog(`EOF status for file ${file.path}: ${eof}`);
      return eof;
    } catch (error) {
      consoleDotError(`Error checking EOF for file ${file.path}:`, error);
      throw error;
    }
  }

  async fs_fflush(fd) {
    consoleDotLog(`Flushing file descriptor: ${fd}`);
    return 0;
  }

  async fs_fcloseall() {
    consoleDotLog("Closing all file descriptors.");
    this.fileDescriptors.clear();
    return 0;
  }
}

export { IDBFs };
//# sourceMappingURL=IDBFs-CoY9en-p.js.map
