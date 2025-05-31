import { L as E, c as m, g as V } from "./configES6-BskFHtaY.js";
import { s as he } from "./configES6-BskFHtaY.js";
import { L as j } from "./index-jVhJ2jaE.js";
import { serviceWorker as fe } from "./sw-register.js";
var v = function(n) {
  var e = this;
  this.rpc_counter = 0, this.channel = n, this.foreign = /* @__PURE__ */ new Map(), this.local = /* @__PURE__ */ new Map(), this.calls = /* @__PURE__ */ new Map(), this.queue = [], this.connectionEstablished = !1, this.channel.addEventListener("message", function(t) {
    var r = t.data;
    if (r && typeof r == "object") switch (r.type) {
      case "MP_INIT":
        return e.onInit(r);
      case "MP_SET":
        return e.onSet(r);
      case "MP_CALL":
        return e.onCall(r);
      case "MP_RETURN":
        return e.onReturn(r);
    }
  }), this.channel.postMessage({ type: "MP_INIT", id: 1, reply: !0 });
};
v.prototype.onInit = function(n) {
  this.connectionEstablished = !0;
  var e = this.queue;
  this.queue = [];
  for (var t = 0, r = e; t < r.length; t += 1)
    this.channel.postMessage(r[t]);
  n.reply && this.channel.postMessage({ type: "MP_INIT", reply: !1 });
}, v.prototype.onSet = function(n) {
  for (var e = this, t = {}, r = n.object, i = function() {
    var l = o[s], f = !n.void.includes(l);
    t[l] = function() {
      for (var u = [], p = arguments.length; p--; ) u[p] = arguments[p];
      return e.rpc_counter = (e.rpc_counter + 1) % Number.MAX_SAFE_INTEGER, new Promise(function($, M) {
        e.postMessage({ type: "MP_CALL", object: r, method: l, id: e.rpc_counter, args: u, reply: f }), f ? e.calls.set(e.rpc_counter, { resolve: $, reject: M }) : $();
      });
    };
  }, s = 0, o = n.methods; s < o.length; s += 1) i();
  var c = this.foreign.get(n.object);
  this.foreign.set(n.object, t), typeof c == "function" && c(t);
}, v.prototype.onCall = function(n) {
  var e = this, t = this.local.get(n.object);
  t && t[n.method].apply(t, n.args).then(function(r) {
    return n.reply && e.channel.postMessage({ type: "MP_RETURN", id: n.id, result: r });
  }).catch(function(r) {
    return e.channel.postMessage({ type: "MP_RETURN", id: n.id, error: r.message });
  });
}, v.prototype.onReturn = function(n) {
  if (this.calls.has(n.id)) {
    var e = this.calls.get(n.id), t = e.resolve, r = e.reject;
    this.calls.clear(n.id), n.error ? r(n.error) : t(n.result);
  }
}, v.prototype.postMessage = function(n) {
  this.connectionEstablished ? this.channel.postMessage(n) : this.queue.push(n);
}, v.prototype.set = function(n, e, t) {
  t === void 0 && (t = {}), this.local.set(n, e);
  var r = Object.entries(e).filter(function(i) {
    return typeof i[1] == "function";
  }).map(function(i) {
    return i[0];
  });
  this.postMessage({ type: "MP_SET", object: n, methods: r, void: t.void || [] });
}, v.prototype.get = function(n) {
  return new Promise(function(e, t) {
    var r = this;
    return this.foreign.has(n) ? e(this.foreign.get(n)) : e(new Promise(function(i, s) {
      return r.foreign.set(n, i);
    }));
  }.bind(this));
};
function G(n) {
  var e = new v(n);
  Object.defineProperties(this, { get: { writable: !1, configurable: !1, value: e.get.bind(e) }, set: { writable: !1, configurable: !1, value: e.set.bind(e) } });
}
function H(n) {
  return new Worker(
    "/workers/gitWorker.js",
    {
      type: "module",
      name: n?.name
    }
  );
}
const R = new E(m.logging.WorkerPool);
function F(...n) {
  R.consoleDotLog("[WorkerPool]", ...n);
}
function _(...n) {
  R.consoleDotError("[WorkerPool]", ...n);
}
F("Loading workerPool.");
class q {
  constructor(e = null) {
    this.workers = /* @__PURE__ */ new Map(), this.workerCount = 0, this.WorkerClass = e || (typeof Worker < "u" ? Worker : null);
  }
  async getWorker(e, t = !1) {
    try {
      if (!this.WorkerClass)
        throw new Error("Worker class not available in this environment");
      if (!this.workers.has(e)) {
        F(`Creating new worker for ${e}`);
        const i = new H();
        i.onerror = (l) => {
          throw _("Worker error:", l), _("Error details:", {
            filename: l.filename,
            lineno: l.lineno,
            colno: l.colno,
            message: l.message
          }), l;
        };
        const s = new G(i), o = await Promise.race([
          s.get("workerThread"),
          new Promise(
            (l, f) => setTimeout(() => f(new Error("Worker thread timeout")), 5e3)
          )
        ]);
        F("Worker thread obtained, waiting for readiness..."), await o.ready(), F("Worker is ready");
        const c = typeof navigator < "u" && "serviceWorker" in navigator;
        await o.execute("setSWUsage", { supportsServiceWorker: c, useSW: t }), this.workers.set(e, {
          worker: i,
          portal: s,
          thread: o,
          users: 0
        }), this.workerCount++, F(`Worker for ${e} initialized`);
      }
      const r = this.workers.get(e);
      return r.users++, r;
    } catch (r) {
      throw _(`Failed to get worker for ${e}:`, r), r;
    }
  }
  async releaseWorker(e) {
    if (this.workers.has(e)) {
      const t = this.workers.get(e);
      t.users--, t.users <= 0 && (t.worker.terminate(), this.workers.delete(e), this.workerCount--, F(`Terminated worker for ${e}`));
    }
  }
  async forceTerminateAll() {
    for (const [e, { worker: t }] of this.workers)
      t.terminate(), F(`Force terminated worker for ${e}`);
    this.workers.clear(), this.workerCount = 0;
  }
  getActiveCount() {
    return this.workerCount;
  }
}
const b = new q(), W = new E(m.logging.memoryFS);
function g(...n) {
  W.consoleDotLog("[ MemoryFS ] ", ...n);
}
function k(...n) {
  W.consoleDotError("[ MemoryFS ] ", ...n);
}
g("memoryFs loaded.");
class z {
  constructor(e, t = {}) {
    this.fsName = e, this.fileDescriptors = /* @__PURE__ */ new Map(), this.fdCounter = 3, this.workerEntry = null, this.workerThread = null, this.useSW = t?.useSW || null, this.versioningStrategy = t?.versioning?.strategy || m.versioning.strategy, this.doImmediateCommit = this.versioningStrategy === "immediate", g(`MemoryFS created for ${e}`);
  }
  async initializeWorker() {
    this.workerEntry = await b.getWorker(this.fsName, this.useSW), this.workerThread = this.workerEntry.thread, await this.workerThread.execute("setFs", {
      fsName: this.fsName,
      fsType: "memory"
    }), g(`Worker initialized for ${this.fsName}`);
  }
  async cleanup() {
    this.workerEntry && (await b.releaseWorker(this.fsName), this.workerEntry = null, this.workerThread = null);
  }
  async fs_fopen(e, t) {
    if (this.workerThread || await this.initializeWorker(), t.includes("w") || t.includes("a") || t.includes("x")) {
      const i = e.split("/").slice(0, -1).join("/");
      if (i) {
        const s = await this.workerThread.execute("isDirectoryDot", { path: i });
        if (!s.exists || !s.isDirectory)
          throw new Error(`ENOENT: no such directory, open '${e}'`);
      }
    }
    const r = this.fdCounter++;
    return this.fileDescriptors.set(r, { path: e, pos: 0, mode: t }), g(`File descriptor ${r} created for ${e}`), r;
  }
  async fs_fclose(e) {
    if (g(`Closing file descriptor: ${e}`), !this.fileDescriptors.has(e))
      throw new Error(`EBADF: bad file descriptor, close '${e}'`);
    return this.fileDescriptors.delete(e), g(`File descriptor ${e} closed successfully.`), 0;
  }
  async fs_fread(e, t) {
    g(`Reading ${t} bytes from file descriptor: ${e}`);
    const r = this.fileDescriptors.get(e);
    if (!r)
      throw new Error(`EBADF: bad file descriptor, read '${e}'`);
    try {
      this.workerThread || await this.initializeWorker();
      const i = await this.workerThread.execute("readFileDot", { filePath: r.path });
      if (i === null)
        throw new Error(`ENOENT: no such file, read '${r.path}'`);
      const s = i.slice(r.pos, r.pos + t);
      return r.pos += s.length, g(`Read chunk: ${s}, new position: ${r.pos}`), s;
    } catch (i) {
      throw k(`Error reading file ${r.path}:`, i), i;
    }
  }
  async fs_fwrite(e, t) {
    g(`Writing content to file descriptor: ${e}`);
    const r = this.fileDescriptors.get(e);
    if (!r)
      throw new Error(`EBADF: bad file descriptor, write '${e}'`);
    try {
      this.workerThread || await this.initializeWorker();
      const i = r.path.split("/").slice(0, -1).join("/");
      if (i) {
        const c = await this.workerThread.execute("isDirectoryDot", { path: i });
        if (!c.exists || !c.isDirectory)
          throw new Error(`ENOENT: no such directory, open '${r.path}'`);
      }
      let o = await this.workerThread.execute("readFileDot", { filePath: r.path }).catch(() => "");
      return g(`Current data in file ${r.path}:`, o), o === null && (o = ""), o = o.slice(0, r.pos) + t + o.slice(r.pos + t.length), await this.workerThread.execute("writeFileDot", {
        filePath: r.path,
        fileContent: o,
        doCommit: this.doImmediateCommit
      }), r.pos += t.length, g(`Content written to file ${r.path}, new position: ${r.pos}`), t.length;
    } catch (i) {
      throw k(`Error writing to file ${r.path}:`, i), i;
    }
  }
  async fs_fseek(e, t, r) {
    g(`Seeking in file descriptor: ${e}, offset: ${t}, whence: ${r}`);
    const i = this.fileDescriptors.get(e);
    if (!i)
      throw new Error(`EBADF: bad file descriptor, seek '${e}'`);
    try {
      this.workerThread || await this.initializeWorker();
      const s = await this.workerThread.execute("readFileDot", { filePath: i.path }).catch(() => "");
      return r === "SEEK_SET" ? i.pos = t : r === "SEEK_CUR" ? i.pos += t : r === "SEEK_END" && (i.pos = s.length + t), i.pos = Math.max(0, Math.min(i.pos, s.length)), g(`New position in file ${i.path}: ${i.pos}`), 0;
    } catch (s) {
      throw k(`Error seeking in file ${i.path}:`, s), s;
    }
  }
  async fs_ftell(e) {
    g(`Getting current position for file descriptor: ${e}`);
    const t = this.fileDescriptors.get(e);
    if (!t)
      throw new Error(`EBADF: bad file descriptor, tell '${e}'`);
    return g(`Current position in file ${t.path}: ${t.pos}`), t.pos;
  }
  async fs_ftruncate(e, t) {
    g(`Truncating file descriptor: ${e} to length: ${t}`);
    const r = this.fileDescriptors.get(e);
    if (!r)
      throw new Error(`EBADF: bad file descriptor, truncate '${e}'`);
    try {
      this.workerThread || await this.initializeWorker();
      let s = await this.workerThread.execute("readFileDot", { filePath: r.path }).catch(() => "");
      return g(`Current data in file ${r.path}:`, s), s = s.slice(0, t), await this.workerThread.execute("writeFileDot", {
        filePath: r.path,
        fileContent: s,
        doCommit: this.doImmediateCommit
      }), g(`File ${r.path} truncated to length: ${t}`), 0;
    } catch (i) {
      throw k(`Error truncating file ${r.path}:`, i), i;
    }
  }
  async fs_stat(e) {
    g(`Getting stats for path: ${e}`);
    try {
      this.workerThread || await this.initializeWorker();
      const t = await this.workerThread.execute("isDirectoryDot", { path: e });
      if (!t.exists)
        throw new Error(`ENOENT: no such file or directory, stat '${e}'`);
      return {
        isDirectory: async () => t.isDirectory,
        isFile: async () => !t.isDirectory
      };
    } catch (t) {
      throw k(`Error getting stats for path ${e}:`, t), t;
    }
  }
  async fs_fstat(e) {
    g(`Getting stats for file descriptor: ${e}`);
    const t = this.fileDescriptors.get(e);
    if (!t)
      throw new Error(`EBADF: bad file descriptor, fstat '${e}'`);
    return this.fs_stat(t.path);
  }
  async fs_remove(e) {
    this.workerThread || await this.initializeWorker(), g(`Removing file: ${e}`);
    try {
      const t = await this.workerThread.execute("isDirectoryDot", { path: e });
      if (!t.exists)
        throw new Error(`ENOENT: no such file, unlink '${e}'`);
      if (t.isDirectory)
        throw new Error(`EISDIR: illegal operation on a directory, unlink '${e}'`);
      return await this.workerThread.execute("removeFileDot", {
        filePath: e,
        doCommit: this.doImmediateCommit
      }), 0;
    } catch (t) {
      throw k(`Error removing file ${e}:`, t), t;
    }
  }
  async fs_mkdir(e) {
    this.workerThread || await this.initializeWorker(), g(`Creating directory: ${e}`);
    try {
      const t = e.split("/").slice(0, -1).join("/");
      if (t) {
        const i = await this.workerThread.execute("isDirectoryDot", { path: t });
        if (!i.exists || !i.isDirectory)
          throw new Error(`ENOENT: no such directory, mkdir '${e}'`);
      }
      const r = await this.workerThread.execute("isDirectoryDot", { path: e });
      if (r.exists) {
        if (r.isDirectory)
          return k(`EEXIST: directory already exists, mkdir '${e}'`), -1;
        throw new Error(`ENOTDIR: path exists but is not a directory, mkdir '${e}'`);
      }
      return await this.workerThread.execute("mkdirDot", {
        dirPath: e,
        doCommit: this.doImmediateCommit
      }), 0;
    } catch (t) {
      throw k(`Error creating directory ${e}:`, t), t;
    }
  }
  async fs_rmdir(e) {
    this.workerThread || await this.initializeWorker(), g(`Removing directory: ${e}`);
    try {
      const t = await this.workerThread.execute("isDirectoryDot", { path: e });
      if (!t.exists)
        throw new Error(`ENOENT: no such directory, rmdir '${e}'`);
      if (!t.isDirectory)
        throw new Error(`ENOTDIR: not a directory, rmdir '${e}'`);
      if ((await this.fs_readdir(e)).length > 0)
        throw new Error(`ENOTEMPTY: directory not empty, rmdir '${e}'`);
      return await this.workerThread.execute("removeDirDot", {
        dirPath: e,
        doCommit: this.doImmediateCommit
      }), 0;
    } catch (t) {
      throw k(`Error removing directory ${e}:`, t), t;
    }
  }
  async fs_rename(e, t) {
    this.workerThread || await this.initializeWorker(), g(`Renaming ${e} to ${t}`);
    try {
      if (!(await this.workerThread.execute("isDirectoryDot", { path: e })).exists)
        throw new Error(`ENOENT: no such file or directory, rename '${e}' -> '${t}'`);
      const i = t.split("/").slice(0, -1).join("/");
      if (i) {
        const s = await this.workerThread.execute("isDirectoryDot", { path: i });
        if (!s.exists || !s.isDirectory)
          throw new Error(`ENOENT: no such directory, rename '${e}' -> '${t}'`);
      }
      return await this.workerThread.execute("rename", {
        oldPath: e,
        newPath: t
      }), 0;
    } catch (r) {
      throw k(`Error renaming ${e} to ${t}:`, r), r;
    }
  }
  async fs_opendir(e) {
    this.workerThread || await this.initializeWorker(), g(`Opening directory: ${e}`);
    try {
      const t = await this.workerThread.execute("isDirectoryDot", { path: e });
      if (!t.exists)
        throw new Error(`ENOENT: no such directory, opendir '${e}'`);
      if (!t.isDirectory)
        throw new Error(`ENOTDIR: not a directory, opendir '${e}'`);
      return await this.workerThread.execute("opendir", { path: e }), 0;
    } catch (t) {
      throw k(`Error opening directory ${e}:`, t), t;
    }
  }
  async fs_readdir(e, t = {}) {
    g(`Reading directory: ${e}`);
    try {
      this.workerThread || await this.initializeWorker();
      const r = await this.workerThread.execute("isDirectoryDot", { path: e });
      if (!r.exists)
        throw new Error(`ENOENT: no such directory, readdir '${e}'`);
      if (!r.isDirectory)
        throw new Error(`ENOTDIR: not a directory, readdir '${e}'`);
      return ((await this.workerThread.execute("readDirDot", { path: e }))?.entries || []).map((o) => ({ path: o.path, type: o.type === "tree" ? "dir" : "file" }));
    } catch (r) {
      throw k(`Error reading directory ${e}:`, r), r;
    }
  }
  async fs_feof(e) {
    g(`Checking EOF for file descriptor: ${e}`);
    const t = this.fileDescriptors.get(e);
    if (!t)
      throw new Error(`EBADF: bad file descriptor, eof '${e}'`);
    try {
      this.workerThread || await this.initializeWorker();
      const r = await this.workerThread.execute("readFileDot", { filePath: t.path }).catch(() => "");
      g(`Current data in file ${t.path}:`, r);
      const i = t.pos >= r.length;
      return g(`EOF status for file ${t.path}: ${i}`), i;
    } catch (r) {
      throw k(`Error checking EOF for file ${t.path}:`, r), r;
    }
  }
  async fs_fflush(e) {
    return g(`Flushing file descriptor: ${e}`), 0;
  }
  async fs_fcloseall() {
    return g("Closing all file descriptors."), this.fileDescriptors.clear(), 0;
  }
}
const A = new E(m.logging.IDBFs);
function d(...n) {
  A.consoleDotLog("[IDBFS] ", ...n);
}
function D(...n) {
  A.consoleDotError("[IDBFS] ", ...n);
}
class K {
  constructor(e, t = {}) {
    this.fs = new j(e, t), this.fileDescriptors = /* @__PURE__ */ new Map(), this.fdCounter = 3, this.workerEntry = null, this.workerThread = null, this.fsName = e, this.useSW = t?.useSW || null, this.versioningStrategy = t?.versioning?.strategy || m.versioning.strategy, this.doImmediateCommit = this.versioningStrategy === "immediate", (async () => await this.initializeWorker())(), d("IDBFS initialized with LightningFS.");
  }
  async initializeWorker() {
    this.workerEntry = await b.getWorker(this.fsName, this.useSW), this.workerThread = this.workerEntry.thread, await this.workerThread.execute("setFs", {
      fsName: this.fsName,
      fsType: "idb",
      gitDir: "/"
    }), d(`Worker initialized for ${this.fsName}`);
  }
  async cleanup() {
    this.workerEntry && (await b.releaseWorker(this.fsName), this.workerEntry = null, this.workerThread = null);
  }
  async fs_fopen(e, t) {
    if (this.workerThread || await this.initializeWorker(), d(`Opening file: ${e} with mode: ${t}`), t.includes("w") || t.includes("a") || t.includes("x")) {
      const i = e.split("/").slice(0, -1).join("/");
      if (i) {
        const s = await this.workerThread.execute("isDirectoryDot", { path: i });
        if (!s.exists || !s.isDirectory)
          throw new Error(`ENOENT: no such directory, open '${e}'`);
      }
    }
    const r = this.fdCounter++;
    return this.fileDescriptors.set(r, { path: e, pos: 0, mode: t }), d(`File descriptor ${r} created for file: ${e}`), r;
  }
  async fs_fclose(e) {
    if (d(`Closing file descriptor: ${e}`), !this.fileDescriptors.has(e))
      throw new Error(`EBADF: bad file descriptor, close '${e}'`);
    return this.fileDescriptors.delete(e), d(`File descriptor ${e} closed successfully.`), 0;
  }
  async fs_fread(e, t) {
    d(`Reading ${t} bytes from file descriptor: ${e}`);
    const r = this.fileDescriptors.get(e);
    if (!r)
      throw new Error(`EBADF: bad file descriptor, read '${e}'`);
    try {
      this.workerThread || await this.initializeWorker();
      const i = await this.workerThread.execute("readFileDot", { filePath: r.path });
      if (i === null)
        throw new Error(`ENOENT: no such file, read '${r.path}'`);
      const s = i.slice(r.pos, r.pos + t);
      return r.pos += s.length, d(`Read chunk: ${s}, new position: ${r.pos}`), s;
    } catch (i) {
      throw D(`Error reading file ${r.path}:`, i), i;
    }
  }
  async fs_fwrite(e, t) {
    d(`Writing content to file descriptor: ${e}`);
    const r = this.fileDescriptors.get(e);
    if (!r)
      throw new Error(`EBADF: bad file descriptor, write '${e}'`);
    try {
      this.workerThread || await this.initializeWorker();
      const i = r.path.split("/").slice(0, -1).join("/");
      if (i) {
        const c = await this.workerThread.execute("isDirectoryDot", { path: i });
        if (!c.exists || !c.isDirectory)
          throw new Error(`ENOENT: no such directory, open '${r.path}'`);
      }
      let o = await this.workerThread.execute("readFileDot", { filePath: r.path }).catch(() => "");
      return d(`Current data in file ${r.path}:`, o), o === null && (o = ""), o = o.slice(0, r.pos) + t + o.slice(r.pos + t.length), await this.workerThread.execute("writeFileDot", {
        filePath: r.path,
        fileContent: o,
        doCommit: this.doImmediateCommit
      }), r.pos += t.length, d(`Content written to file ${r.path}, new position: ${r.pos}`), t.length;
    } catch (i) {
      throw D(`Error writing to file ${r.path}:`, i), i;
    }
  }
  async fs_fseek(e, t, r) {
    d(`Seeking in file descriptor: ${e}, offset: ${t}, whence: ${r}`);
    const i = this.fileDescriptors.get(e);
    if (!i)
      throw new Error(`EBADF: bad file descriptor, seek '${e}'`);
    try {
      this.workerThread || await this.initializeWorker();
      const s = await this.workerThread.execute("readFileDot", { filePath: i.path }).catch(() => "");
      return r === "SEEK_SET" ? i.pos = t : r === "SEEK_CUR" ? i.pos += t : r === "SEEK_END" && (i.pos = s.length + t), i.pos = Math.max(0, Math.min(i.pos, s.length)), d(`New position in file ${i.path}: ${i.pos}`), 0;
    } catch (s) {
      throw D(`Error seeking in file ${i.path}:`, s), s;
    }
  }
  async fs_ftell(e) {
    d(`Getting current position for file descriptor: ${e}`);
    const t = this.fileDescriptors.get(e);
    if (!t)
      throw new Error(`EBADF: bad file descriptor, tell '${e}'`);
    return d(`Current position in file ${t.path}: ${t.pos}`), t.pos;
  }
  async fs_ftruncate(e, t) {
    d(`Truncating file descriptor: ${e} to length: ${t}`);
    const r = this.fileDescriptors.get(e);
    if (!r)
      throw new Error(`EBADF: bad file descriptor, truncate '${e}'`);
    try {
      this.workerThread || await this.initializeWorker();
      let s = await this.workerThread.execute("readFileDot", { filePath: r.path }).catch(() => "");
      return d(`Current data in file ${r.path}:`, s), s = s.slice(0, t), await this.workerThread.execute("writeFileDot", {
        filePath: r.path,
        fileContent: s,
        doCommit: this.doImmediateCommit
      }), d(`File ${r.path} truncated to length: ${t}`), 0;
    } catch (i) {
      throw D(`Error truncating file ${r.path}:`, i), i;
    }
  }
  async fs_stat(e) {
    d(`Getting stats for path: ${e}`);
    try {
      this.workerThread || await this.initializeWorker();
      const t = "...";
      return {
        ...t,
        isDirectory: async () => {
          d("path: ", e);
          const r = await this.workerThread.execute("isDirectoryDot", { path: e });
          return r.exists ? r.isDirectory : !1;
        },
        isFile: async () => {
          const r = await this.workerThread.execute("isDirectoryDot", { path: e });
          return r.exists ? !r.isDirectory : !1;
        }
      };
    } catch (t) {
      throw D(`Error getting stats for path ${e}:`, t), t;
    }
  }
  async fs_fstat(e) {
    d(`Getting stats for file descriptor: ${e}`);
    const t = this.fileDescriptors.get(e);
    if (!t)
      throw new Error(`EBADF: bad file descriptor, fstat '${e}'`);
    return this.fs_stat(t.path);
  }
  async fs_remove(e) {
    this.workerThread || await this.initializeWorker(), d(`Removing file: ${e}`);
    try {
      const t = await this.workerThread.execute("isDirectoryDot", { path: e });
      if (!t.exists)
        throw new Error(`ENOENT: no such file, unlink '${e}'`);
      if (t.isDirectory)
        throw new Error(`EISDIR: illegal operation on a directory, unlink '${e}'`);
      return await this.workerThread.execute("removeFileDot", {
        filePath: e,
        doCommit: this.doImmediateCommit
      }), 0;
    } catch (t) {
      throw D(`Error removing file ${e}:`, t), t;
    }
  }
  async fs_mkdir(e) {
    this.workerThread || await this.initializeWorker(), d(`Creating directory: ${e}`);
    try {
      const t = e.split("/").slice(0, -1).join("/");
      if (t) {
        const i = await this.workerThread.execute("isDirectoryDot", { path: t });
        if (!i.exists || !i.isDirectory)
          throw new Error(`ENOENT: no such directory, mkdir '${e}'`);
      }
      if ((await this.workerThread.execute("isDirectoryDot", { path: e })).exists)
        throw new Error(`EEXIST: file or directory already exists, mkdir '${e}'`);
      return await this.workerThread.execute("mkdirDot", {
        dirPath: e,
        doCommit: this.doImmediateCommit
      }), 0;
    } catch (t) {
      throw D(`Error creating directory ${e}:`, t), t;
    }
  }
  async fs_rmdir(e) {
    this.workerThread || await this.initializeWorker(), d(`Removing directory: ${e}`);
    try {
      const t = await this.workerThread.execute("isDirectoryDot", { path: e });
      if (!t.exists)
        throw new Error(`ENOENT: no such directory, rmdir '${e}'`);
      if (!t.isDirectory)
        throw new Error(`ENOTDIR: not a directory, rmdir '${e}'`);
      if ((await this.fs_readdir(e)).length > 0)
        throw new Error(`ENOTEMPTY: directory not empty, rmdir '${e}'`);
      return await this.workerThread.execute("removeDirDot", {
        dirPath: e,
        doCommit: this.doImmediateCommit
      }), 0;
    } catch (t) {
      throw D(`Error removing directory ${e}:`, t), t;
    }
  }
  async fs_rename(e, t) {
    this.workerThread || await this.initializeWorker(), d(`Renaming ${e} to ${t}`);
    try {
      if (!(await this.workerThread.execute("isDirectoryDot", { path: e })).exists)
        throw new Error(`ENOENT: no such file or directory, rename '${e}' -> '${t}'`);
      const i = t.split("/").slice(0, -1).join("/");
      if (i) {
        const s = await this.workerThread.execute("isDirectoryDot", { path: i });
        if (!s.exists || !s.isDirectory)
          throw new Error(`ENOENT: no such directory, rename '${e}' -> '${t}'`);
      }
      return await this.workerThread.execute("rename", {
        oldPath: e,
        newPath: t
      }), 0;
    } catch (r) {
      throw D(`Error renaming ${e} to ${t}:`, r), r;
    }
  }
  async fs_opendir(e) {
    this.workerThread || await this.initializeWorker(), d(`Opening directory: ${e}`);
    try {
      const t = await this.workerThread.execute("isDirectoryDot", { path: e });
      if (!t.exists)
        throw new Error(`ENOENT: no such directory, opendir '${e}'`);
      if (!t.isDirectory)
        throw new Error(`ENOTDIR: not a directory, opendir '${e}'`);
      return await this.workerThread.execute("opendir", { path: e }), 0;
    } catch (t) {
      throw D(`Error opening directory ${e}:`, t), t;
    }
  }
  async fs_readdir(e, t = {}) {
    d(`Reading directory: ${e}`);
    try {
      this.workerThread || await this.initializeWorker();
      const r = await this.workerThread.execute("isDirectoryDot", { path: e });
      if (!r.exists)
        throw new Error(`ENOENT: no such directory, readdir '${e}'`);
      if (!r.isDirectory)
        throw new Error(`ENOTDIR: not a directory, readdir '${e}'`);
      return ((await this.workerThread.execute("readDirDot", { path: e }))?.entries || []).map((o) => ({ path: o.path, type: o.type === "tree" ? "dir" : "file" }));
    } catch (r) {
      throw D(`Error reading directory ${e}:`, r), r;
    }
  }
  async fs_feof(e) {
    d(`Checking EOF for file descriptor: ${e}`);
    const t = this.fileDescriptors.get(e);
    if (!t)
      throw new Error(`EBADF: bad file descriptor, eof '${e}'`);
    try {
      this.workerThread || await this.initializeWorker();
      const r = await this.workerThread.execute("readFileDot", { filePath: t.path }).catch(() => "");
      d(`Current data in file ${t.path}:`, r);
      const i = t.pos >= r.length;
      return d(`EOF status for file ${t.path}: ${i}`), i;
    } catch (r) {
      throw D(`Error checking EOF for file ${t.path}:`, r), r;
    }
  }
  async fs_fflush(e) {
    return d(`Flushing file descriptor: ${e}`), 0;
  }
  async fs_fcloseall() {
    return d("Closing all file descriptors."), this.fileDescriptors.clear(), 0;
  }
}
const P = new E(m.logging.GitAuth);
function x(...n) {
  P.consoleDotLog(...n);
}
function N(...n) {
  P.consoleDotError(...n);
}
class Q {
  constructor(e) {
    this.workerThread = e, this.AuthChecked = !1;
  }
  /**
   * Sets authentication credentials for Git operations
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<boolean>}
   */
  async setAuthParams(e, t) {
    try {
      if (!this.workerThread)
        throw new Error("Worker thread not initialized");
      return await this.workerThread.execute("setAuthParams", { username: e, password: t }), x("Auth params set successfully"), this.AuthChecked || (this.AuthChecked = !0), x("Auth params verified successfully"), !0;
    } catch (r) {
      throw N("Failed to set auth params:", r), r;
    }
  }
  /**
   * Verifies if current auth credentials are valid
   * @returns {Promise<boolean>}
   */
  async verifyAuth() {
    try {
      if (!this.workerThread)
        throw new Error("Worker thread not initialized");
      return await this.workerThread.execute("listServerRefs"), x("Auth verification successful"), !0;
    } catch (e) {
      if (e.toString().includes("401") || e.toString().includes("403"))
        return x("Auth verification failed - invalid credentials"), !1;
      throw N("Auth verification error:", e), e;
    }
  }
  /**
   * Sets Git user config (name and email)
   * @param {string} name 
   * @param {string} email 
   */
  async setUserConfig(e, t) {
    try {
      return await this.workerThread.execute("setConfigs", { name: e, email: t }), x(`User config set, name: ${e}, email: ${t}`), !0;
    } catch (r) {
      throw N(`Failed to set user config: ${r}`), r;
    }
  }
}
const L = new E(m.logging.VFSutils);
function h(...n) {
  L.consoleDotLog("[ VFSUtils ]", ...n);
}
function y(...n) {
  L.consoleDotError("[ VFSUtils ]", ...n);
}
h("Loading VFSUtils module");
class J {
  constructor(e, t, r, i, s = !1) {
    this.fsType = e, this.fsInstance = t, this.fsName = r, this.fetchInfo = i, this.workerEntry = null, this.workerThread = null, this.inodeCounter = 12341, this.fsTable = {}, this.initialized = !1, this.useSW = s, this.auth = null;
  }
  async initialize() {
    if (!this.initialized)
      try {
        this.workerEntry = await b.getWorker(this.fsName, this.useSW), this.workerThread = this.workerEntry.thread, h("Setting Fs for VFSUtils."), await this.workerThread.execute("setFs", {
          fsName: this.fsName,
          fsType: this.fsType
        }), h("Fs set."), this.fetchInfo.corsProxy && await this.workerThread.execute("setCorsProxy", {
          corsProxy: this.fetchInfo.corsProxy
        }), h("workerThread:", this.workerThread), this.auth = new Q(this.workerThread), this.fetchInfo.username && this.fetchInfo.password && await this.setAuthParams(this.fetchInfo.username, this.fetchInfo.password), this.initialized = !0, h(`VFSutils initialized for ${this.fsName} with type ${this.fsType}`);
      } catch (e) {
        throw await this.terminate(), e;
      }
  }
  async terminate(e = null, t = null) {
    try {
      if (e && t)
        try {
          h("Terminating VFSUtils...", e, t), await this.workerThread.execute("handleDeleteCloseAndReclone", {
            fsName: e,
            fsType: t,
            reclone: !0
          });
        } catch (r) {
          throw y("Some error happend while terminating VFS: ", r), r;
        }
      return this.workerEntry && (await b.releaseWorker(this.fsName), this.workerEntry = null, this.workerThread = null), this.initialized = !1, !0;
    } catch (r) {
      return y("VFSutils termination error:", r), !1;
    }
  }
  async fetchFromGit() {
    try {
      h("Fetching from Git repository..."), this.initialized || await this.initialize(), h("initialized.");
      const { url: e, dir: t = "/" } = this.fetchInfo;
      if (h(`Cloning repository from ${e} to ${t}`), !(await this.workerThread.execute("doCloneAndStuff", { url: e })).success)
        throw new Error("Fetching from git failed!");
      this.fetchInfo.name && this.fetchInfo.email && await this.setUserConfig(this.fetchInfo.name, this.fetchInfo.email), await this.generateFsTable(), h("Repository successfully cloned and indexed");
    } catch (e) {
      throw y(`Git fetch failed: ${e}`), await this.terminate(), e;
    }
  }
  async fetchFromDisk() {
    try {
      this.initialized || await this.initialize();
      const { dir: e } = this.fetchInfo;
      h(`Loading filesystem from disk at ${e}`), await this.generateFsTable(), h("Successfully loaded filesystem from disk");
    } catch (e) {
      throw y(`Disk load failed: ${e.message}`), await this.terminate(), e;
    }
  }
  async fetchFromGoogleDrive() {
    try {
      this.initialized || await this.initialize();
      const { fileId: e } = this.fetchInfo;
      h(`Fetching from Google Drive file ${e}`), await this.generateFsTable(), h("Successfully fetched from Google Drive");
    } catch (e) {
      throw y(`Google Drive fetch failed: ${e.message}`), await this.terminate(), e;
    }
  }
  /* FS Table Management */
  async generateFsTable() {
    try {
      this.initialized || await this.initialize(), h("Generating FS table...");
      const e = await this.workerThread.execute("listFilesDot", { listDirs: !0 });
      return h("File list:", e), this.fsTable = this.buildHierarchicalFsTable(e), h(
        "FS table generated with",
        Object.keys(this.fsTable["/"].children).length,
        "root entries"
      ), this.fsTable;
    } catch (e) {
      throw y("FS table generation failed:", e), e;
    }
  }
  buildHierarchicalFsTable(e) {
    const t = this.createRootEntry();
    return e.forEach((r) => {
      const i = r.path.split("/").filter((o) => o !== "");
      let s = t;
      i.forEach((o, c) => {
        const l = c === i.length - 1;
        if (s.children[o]) {
          const f = s.children[o], u = l && r.type !== "tree" ? "file" : "directory";
          if (f.type !== u)
            throw new Error(
              `FS conflict: ${r.path} has ${u} where ${f.type} already exists`
            );
        } else
          s.children[o] = this.createFsTableEntry(
            o,
            l && r.type !== "tree" ? "file" : "directory",
            r.size || 0,
            s.dentry_id
          );
        l || (s.children[o].type !== "directory" && (s.children[o] = {
          ...s.children[o],
          type: "directory",
          children: {}
        }), s = s.children[o]);
      });
    }), { "/": t };
  }
  async updateFsTable(e, t, r = "file", i = 0) {
    try {
      const s = t.replace(/^\/+|\/+$/g, "");
      this.fsTable["/"] || (this.fsTable["/"] = this.createRootEntry());
      const o = s.split("/");
      let c = this.fsTable["/"];
      if (e === "remove" && o.length === 0)
        throw new Error("Cannot remove root directory");
      for (let f = 0; f < o.length - 1; f++) {
        const u = o[f];
        if (!c.children || !c.children[u]) {
          if (e === "remove")
            throw new Error(`Parent path not found: ${o.slice(0, f + 1).join("/")}`);
          c.children[u] = this.createFsTableEntry(
            u,
            "directory",
            0,
            c.dentry_id
          );
        }
        c = c.children[u];
      }
      const l = o[o.length - 1];
      switch (e) {
        case "create":
          c.children || (c.children = {}), c.children[l] && h(`path ${t} already exists, updating its content`), c.children[l] = this.createFsTableEntry(
            l,
            r,
            i,
            c.dentry_id
          );
          break;
        case "remove":
          if (!c.children || !c.children[l])
            return { success: !1, message: `Path not found: ${t}` };
          if (c.children[l].type === "directory" && Object.keys(c.children[l].children || {}).length > 0)
            throw new Error(`Cannot remove non-empty directory: ${t}`);
          delete c.children[l];
          break;
        default:
          throw new Error(`Invalid action: ${e}`);
      }
      return { success: !0, fsTable: this.fsTable };
    } catch (s) {
      throw y("FS table update failed:", s), s;
    }
  }
  createRootEntry() {
    return {
      type: "directory",
      dentry_id: this.inodeCounter++,
      name: "",
      parent_inode: 0,
      acl: { owner: "root", permissions: "rwx", groups: { users: "r" } },
      children: {},
      ctime: Date.now(),
      mtime: Date.now()
    };
  }
  createFsTableEntry(e, t, r, i) {
    const s = t === "directory";
    return {
      inode: this.inodeCounter++,
      type: t,
      name: e,
      mode: s ? 16877 : 100644,
      size: s ? 0 : r,
      uid: 1e3,
      gid: 100,
      parent_inode: i,
      acl: {
        owner: "user",
        permissions: s ? "rwx" : "rw-",
        groups: { users: "r" }
      },
      children: s ? {} : void 0,
      ctime: Date.now(),
      mtime: Date.now()
    };
  }
  async getFsTableSize(e) {
    try {
      return e ? JSON.stringify(e).length : 0;
    } catch (t) {
      return y("Size calculation failed:", t), 0;
    }
  }
  async commitStagedChanges(e) {
    try {
      return this.initialized || await this.initialize(), await this.workerThread.execute("setFs", {
        fsName: this.fsName,
        fsType: this.fsType
      }), await this.workerThread.execute("commitStagedChanges", { message: e });
    } catch (t) {
      throw y("Version commit failed:", t), t;
    }
  }
  // -------------------
  //  Merging Methods
  // -------------------
  /**
   * Optimized sync status check with minimal remote operations
   */
  async getSyncStatus(e = null, t = "main") {
    try {
      h("Starting sync status check...");
      const r = e || this.fetchInfo?.url;
      h("Getting local head commit...");
      const i = await this.workerThread.execute("getLastLocalCommit", { ref: t });
      h("Local head commit:", i), h("Getting remote head commit...");
      const s = await this.workerThread.execute("getLatestRemoteCommit", {
        url: r,
        ref: t
      });
      if (h("Remote head result:", s), !s.success)
        return h("Remote branch not found"), {
          status: "remote-branch-not-found",
          localHead: i,
          remoteHead: null
        };
      const o = s.commit;
      if (h("Remote head commit:", o), i === o)
        return h("Local and remote heads match - up to date"), {
          status: "up-to-date",
          localHead: i,
          remoteHead: o
        };
      h("Getting commit histories...");
      const [c, l] = await Promise.all([
        await this.getLocalCommitHistory(10),
        await this.getRemoteCommitHistory(10)
      ]);
      h("Local commits (10 most recent):", c), h("Remote commits (10 most recent):", l);
      const f = this.findFirstCommonCommit(c, l);
      h("Common commit found:", f);
      let u;
      return f ? f === o ? (u = "local-ahead", h("Local is ahead of remote")) : f === i ? (u = "remote-ahead", h("Remote is ahead of local")) : (u = "diverged", h("Branches have diverged")) : (u = "diverged", h("No common commit found - branches have diverged")), {
        status: u,
        localHead: i,
        remoteHead: o,
        commonAncestor: f
      };
    } catch (r) {
      return y("getSyncStatus failed:", r), {
        status: "error",
        error: r.message
      };
    }
  }
  /**
   * Find first common commit between two commit lists
   */
  findFirstCommonCommit(e, t) {
    const r = new Set(t);
    for (const i of e)
      if (r.has(i))
        return i;
    return null;
  }
  /**
   * Get local commit history
   */
  async getLocalCommitHistory(e = 10) {
    try {
      const r = (await this.workerThread.execute("log", {
        depth: e
      })).map((i) => i.oid);
      return h("GetLocalCommitHistory result: ", r), r || [];
    } catch (t) {
      return y("Failed to get local commit history:", t), [];
    }
  }
  /**
   * Get remote commit history by fetching from replica
   */
  async getRemoteCommitHistory(e = 10) {
    try {
      h("Fetching remote commit history with depth:", e);
      const t = await this.workerThread.execute("getCommitHistoryFromReplica", {
        depth: e
      });
      return h("Raw result from worker:", t), Array.isArray(t) ? (h("Received direct commits array:", t), t) : t && (t.commits || t.success) ? (h("Received structured response with commits:", t.commits || []), t.commits || []) : (y("Unexpected response format:", t), []);
    } catch (t) {
      return y("Failed to get remote commit history:", t), [];
    }
  }
  /**
   * Optimized sync flow that minimizes remote operations
   */
  async autoSyncFlow(e) {
    try {
      h("this.fetchInfo", this.fetchInfo);
      const { status: t, localHead: r, remoteHead: i, commonAncestor: s } = await this.getSyncStatus();
      switch (h("Sync status:", t), t) {
        case "up-to-date":
          return { synced: !0 };
        case "local-ahead":
          return await this.handleLocalAhead(r, i, e);
        case "remote-ahead":
          return await this.handleRemoteAhead(r, i, e);
        case "diverged":
          return await this.handleDiverged(r, i, s, e);
        case "remote-branch-not-found":
          return y("Remote branch not found"), { synced: !1, error: "Remote branch not found" };
        default:
          throw new Error(`Unknown sync status: ${t}`);
      }
    } catch (t) {
      throw y("autoSyncFlow failed:", t), t;
    }
  }
  /**
   * Handle case where remote is ahead of local (need to pull changes)
   */
  async handleRemoteAhead(e, t, r) {
    try {
      h(`Handling remote-ahead scenario (local: ${e}, remote: ${t})`);
      const i = r || "theirs";
      if (h("Attempting fast-forward merge..."), (await this.workerThread.execute("fastForward", {
        url: this.fetchInfo.url,
        ref: "main"
      })).success)
        return h("Fast-forward successful"), await this.generateFsTable(), {
          synced: !0,
          strategy: "fast-forward",
          oldHead: e,
          newHead: t
        };
      h("Fast-forward failed, attempting full pull...");
      const o = await this.workerThread.execute("doFetch", {
        url: this.fetchInfo.url,
        ref: "main"
      }), c = await this.workerThread.execute("merge", {
        ours: "main",
        theirs: "origin/main",
        strategy: i
      });
      if (!o.success)
        throw new Error("Pull failed: " + (o.error || "Unknown error"));
      h("Pull successful"), await this.generateFsTable();
      const l = await this.workerThread.execute("getLastLocalCommit", { ref: "main" });
      return l !== t && h(`Warning: Local head (${l}) doesn't match remote head (${t}) after pull`), {
        synced: !0,
        strategy: "pull-with-merge",
        oldHead: e,
        newHead: l
      };
    } catch (i) {
      y("handleRemoteAhead failed:", i);
      try {
        await this.workerThread.execute("resetToCommit", {
          oid: e,
          hard: !0
        });
      } catch (s) {
        y("Failed to reset after error:", s);
      }
      throw i;
    }
  }
  /**
   * Handle case where local is ahead of remote (need to push changes)
   */
  async handleLocalAhead(e, t) {
    try {
      if (h(`Handling local-ahead scenario (local: ${e}, remote: ${t})`), await this.setAuthParams(this.fetchInfo.username, this.fetchInfo.password), h("Attempting push..."), (await this.workerThread.execute("push", {
        url: this.fetchInfo.url,
        ref: "main",
        force: !1
      })).success)
        return h("Push successful"), {
          synced: !0,
          strategy: "push",
          oldRemoteHead: t,
          newRemoteHead: e
        };
      h("Push failed, rechecking sync status...");
      const i = await this.getSyncStatus();
      if (i.status === "up-to-date")
        return h("Status is now up-to-date after push failure"), { synced: !0, strategy: "concurrent-update" };
      if (i.status === "remote-ahead")
        return h("Remote moved ahead during push attempt"), this.handleRemoteAhead(e, i.remoteHead);
      if (i.status === "diverged")
        return h("Branches diverged during push attempt"), this.handleDiverged(e, i.remoteHead, i.commonAncestor);
      throw new Error(`Unexpected status after push failure: ${i.status}`);
    } catch (r) {
      throw y("handleLocalAhead failed:", r), r;
    }
  }
  /**
   * Handle case where branches have diverged
   */
  async handleDiverged(e, t, r, i) {
    try {
      const s = i || "theirs";
      h("Using merge workflow"), h("Pulling with merge...");
      const o = await this.workerThread.execute("doFetch", {
        url: this.fetchInfo.url,
        ref: "main"
      }), c = await this.workerThread.execute("merge", {
        ours: "main",
        theirs: "origin/main",
        strategy: s
      });
      if (!o.success)
        throw new Error("Pull failed: " + (o.error || "Unknown error"));
      h("Pushing merged changes..."), await this.setAuthParams(this.fetchInfo.username, this.fetchInfo.password);
      const l = await this.workerThread.execute("push", {
        url: this.fetchInfo.url,
        ref: "main",
        force: !1
      });
      return {
        synced: !0,
        strategy: "merge-workflow",
        oldLocalHead: e,
        newLocalHead: await this.workerThread.execute("getLastLocalCommit", { ref: "main" }),
        remoteHead: t
      };
    } catch (s) {
      y("handleDiverged failed:", s);
      try {
        await this.workerThread.execute("resetToCommit", {
          oid: e,
          hard: !0
        });
      } catch (o) {
        y("Failed to reset after error:", o);
      }
      throw s;
    }
  }
  // ------------------------
  //  Authentication Methods
  // ------------------------
  /**
   * Sets authentication credentials
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<boolean>}
   */
  async setAuthParams(e, t) {
    return this.auth.setAuthParams(e, t);
  }
  /**
   * Sets Git user config (name and email)
   * @param {string} name
   * @param {string} email
   * @returns {Promise<void>}
   */
  async setUserConfig(e, t) {
    return this.auth.setUserConfig(e, t);
  }
  /**
   * Verifies if current auth credentials are valid
   * @returns {Promise<boolean>}
   */
  async verifyAuth() {
    return this.auth.verifyAuth();
  }
  async updateFetchInfo(e) {
    return this.initialized || await this.initialize(), this.fetchInfo = { ...this.fetchInfo, ...e }, h("Fetch info updated:", this.fetchInfo), this.fetchInfo;
  }
}
class X {
  constructor(e = "VFS_Mounts") {
    this.dbName = e, this.localStorageWarningShown = !1, this.forceLocalStorage = !1;
  }
  supportsIndexedDB() {
    if (this.forceLocalStorage) return !1;
    try {
      return typeof window < "u" && !!window.indexedDB;
    } catch {
      return !1;
    }
  }
  async ensureObjectStoreExists() {
    return new Promise((e, t) => {
      const r = indexedDB.open(this.dbName, this.dbVersion);
      r.onerror = () => {
        console.error("IndexedDB open error:", r.error), e(!1);
      }, r.onsuccess = () => {
        const i = r.result;
        i.objectStoreNames.contains("mounts") ? e(!0) : e(!1), i.close();
      }, r.onupgradeneeded = (i) => {
        const s = i.target.result;
        s.objectStoreNames.contains("mounts") || (s.createObjectStore("mounts"), console.log("Created 'mounts' object store"));
      };
    });
  }
  /** Simplified localStorage methods with error handling */
  async getFromLocalStorage(e) {
    try {
      if (typeof localStorage > "u") return null;
      const t = localStorage.getItem(e);
      return t ? JSON.parse(t) : null;
    } catch (t) {
      return console.error("LocalStorage get error:", t), null;
    }
  }
  async getFromIndexedDB(e) {
    return await this.ensureObjectStoreExists() ? new Promise((r, i) => {
      const s = indexedDB.open(this.dbName, this.dbVersion);
      s.onerror = () => r(null), s.onsuccess = () => {
        const o = s.result;
        try {
          const f = o.transaction("mounts", "readonly").objectStore("mounts").get(e);
          f.onsuccess = () => r(f.result || null), f.onerror = () => r(null);
        } catch (c) {
          console.error("Transaction error:", c), r(null);
        } finally {
          o.close();
        }
      };
    }) : null;
  }
  async getAll() {
    if (this.supportsIndexedDB())
      try {
        return await this.getAllFromIndexedDB();
      } catch (e) {
        return console.error("IndexedDB getAll failed:", e), await this.getAllFromLocalStorage();
      }
    return await this.getAllFromLocalStorage();
  }
  async getAllFromIndexedDB() {
    return new Promise((e, t) => {
      const r = indexedDB.open(this.dbName, this.dbVersion);
      r.onerror = () => e({}), r.onsuccess = () => {
        const i = r.result;
        if (!i.objectStoreNames.contains("mounts")) {
          e({});
          return;
        }
        const c = i.transaction("mounts", "readonly").objectStore("mounts").getAllKeys(), l = {};
        c.onsuccess = async () => {
          const f = c.result;
          for (const u of f) {
            const p = await this.get(u);
            p && (l[u] = p);
          }
          e(l);
        }, c.onerror = () => e({});
      };
    });
  }
  async getAllFromLocalStorage() {
    try {
      if (typeof localStorage > "u") return {};
      const e = {};
      for (let t = 0; t < localStorage.length; t++) {
        const r = localStorage.key(t);
        if (r && r.startsWith(this.dbName))
          try {
            e[r] = JSON.parse(localStorage.getItem(r));
          } catch (i) {
            console.error("Error parsing localStorage item:", i);
          }
      }
      return e;
    } catch (e) {
      return console.error("LocalStorage getAll error:", e), {};
    }
  }
  async storeInLocalStorage(e, t) {
    try {
      if (typeof localStorage > "u") return !1;
      const r = JSON.stringify(t);
      return r.length > 5e6 ? (console.error("Data too large for localStorage"), !1) : (localStorage.setItem(e, r), !0);
    } catch (r) {
      return console.error("LocalStorage set error:", r), r.name === "QuotaExceededError" && (this.forceLocalStorage = !0), !1;
    }
  }
  async removeFromLocalStorage(e) {
    try {
      return typeof localStorage > "u" ? !1 : (localStorage.removeItem(e), !0);
    } catch (t) {
      return console.error("LocalStorage remove error:", t), !1;
    }
  }
  async get(e) {
    let t = null;
    if (this.supportsIndexedDB())
      try {
        t = await this.getFromIndexedDB(e);
      } catch (r) {
        console.error("IndexedDB get failed:", r);
      }
    if (t === null)
      try {
        t = await this.getFromLocalStorage(e);
      } catch (r) {
        console.error("LocalStorage get fallback failed:", r);
      }
    return t;
  }
  async store(e, t) {
    let r = !1, i = !1;
    if (this.supportsIndexedDB())
      try {
        r = await this.storeInIndexedDB(e, t);
      } catch (s) {
        console.error("IndexedDB store failed:", s);
      }
    try {
      i = await this.storeInLocalStorage(e, t);
    } catch (s) {
      console.error("LocalStorage store failed:", s);
    }
    return r || i;
  }
  async remove(e) {
    let t = !0;
    if (this.supportsIndexedDB())
      try {
        t = await this.removeFromIndexedDB(e) && t;
      } catch (r) {
        console.error("IndexedDB remove failed:", r), t = !1;
      }
    try {
      t = await this.removeFromLocalStorage(e) && t;
    } catch (r) {
      console.error("LocalStorage remove failed:", r), t = !1;
    }
    return t;
  }
  async storeInIndexedDB(e, t) {
    return new Promise((r, i) => {
      const s = indexedDB.open(this.dbName, 1);
      s.onerror = () => r(!1), s.onsuccess = () => {
        const c = s.result.transaction("mounts", "readwrite");
        c.objectStore("mounts").put(t, e), c.oncomplete = () => r(!0), c.onerror = () => r(!1);
      }, s.onupgradeneeded = (o) => {
        const c = o.target.result;
        c.objectStoreNames.contains("mounts") || c.createObjectStore("mounts");
      };
    });
  }
  async removeFromIndexedDB(e) {
    return new Promise((t, r) => {
      const i = indexedDB.open(this.dbName, 1);
      i.onerror = () => t(!1), i.onsuccess = () => {
        const o = i.result.transaction("mounts", "readwrite");
        o.objectStore("mounts").delete(e), o.oncomplete = () => t(!0), o.onerror = () => t(!1);
      };
    });
  }
}
const Y = new E(m.logging.supportChecker);
function T(...n) {
  Y.consoleDotLog(...n);
}
async function Z() {
  try {
    return window.indexedDB ? await new Promise((n) => {
      const e = "testIDBSupport", t = indexedDB.open(e);
      t.onerror = () => {
        T("IndexedDB not available"), n(!1);
      }, t.onsuccess = (r) => {
        r.target.result.close();
        const s = indexedDB.deleteDatabase(e);
        s.onerror = () => {
          T("Failed to delete test database"), n(!0);
        }, s.onsuccess = () => {
          T("IndexedDB test successful"), n(!0);
        };
      }, t.onblocked = () => {
        T("IndexedDB request blocked"), n(!1);
      };
    }) : (T("IndexedDB not supported in this browser"), !1);
  } catch (n) {
    return T("IndexedDB test failed:", n), !1;
  }
}
const O = new E(m.logging.vfs);
function a(...n) {
  O.consoleDotLog("[VFS] ", ...n);
}
function w(...n) {
  O.consoleDotError("[VFS] ", ...n);
}
class ee {
  // Initialization and Core Setup
  constructor(e = "VFS_Mounts") {
    this.mounts = /* @__PURE__ */ Object.create(null), this.initializedMounts = /* @__PURE__ */ new Set(), this.vfsUtilsInstances = /* @__PURE__ */ new Map(), this.storageUtils = new X(e), this.currentMountPath = "", this.idbSupported = null, (async () => {
      try {
        await this.retrieveAndMountFromFsTable();
      } catch (t) {
        w("Automatic mount from fsTable failed:", t);
      }
    })(), a("VFS instance created");
  }
  // Environment detection utilities
  getBrowserInfo() {
    const e = navigator.userAgent;
    let t = "Unknown";
    return e.includes("Firefox") ? t = "Firefox" : e.includes("SamsungBrowser") ? t = "Samsung Browser" : e.includes("Opera") || e.includes("OPR") ? t = "Opera" : e.includes("Trident") ? t = "IE" : e.includes("Edge") ? t = "Edge" : e.includes("Chrome") ? t = "Chrome" : e.includes("Safari") && (t = "Safari"), t;
  }
  getDeviceType() {
    const e = navigator.userAgent;
    return /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(e) ? "Tablet" : /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(e) ? "Mobile" : "Desktop";
  }
  getPlatformInfo() {
    return {
      browser: this.getBrowserInfo(),
      device: this.getDeviceType(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language
    };
  }
  // Utility functions for versioning and merging
  getVersioningConfig(e = {}) {
    const t = e.versioning || m.versioning || {};
    return {
      strategy: t.strategy,
      interval: t.interval,
      number: t.number
    };
  }
  getMergingConfig(e = {}) {
    const t = e.merging || m.merging || {};
    return {
      strategy: t.strategy || "none",
      conflictResolution: t.conflictResolution || "timestamp"
    };
  }
  // Storage and Support Checking
  async checkIndexedDBSupport() {
    if (a("Checking IndexedDB support..."), this.idbSupported !== null)
      return this.idbSupported;
    try {
      return await Z(), a("IndexedDB is supported"), this.idbSupported = !0, !0;
    } catch (e) {
      return w("IndexedDB not supported:", e), this.idbSupported = !1, !1;
    }
  }
  async determineUseSW(e, t) {
    return t.useSW !== void 0 ? t.useSW : e === "idb" ? await this.checkIndexedDBSupport() : !1;
  }
  async loadMountFromStorage(e) {
    a(`Attempting to load mount from storage: ${e}`);
    try {
      const t = await this.storageUtils.get(e);
      return t ? (a(`Successfully loaded mount from storage: ${e}`), t) : (a(`No mount found in storage for path: ${e}`), null);
    } catch (t) {
      throw w(`Failed to load mount from storage (path: ${e}):`, t), t;
    }
  }
  async persistMountData(e, t) {
    a(`Persisting mount data for ${e}`);
    try {
      const r = { ...t };
      delete r.fsInstance, await this.storageUtils.store(e, r), a(`Successfully persisted mount data for ${e}`);
    } catch (r) {
      throw w(`Failed to persist mount data for ${e}:`, r), r;
    }
  }
  // Filesystem Instance Management
  async createFSInstance(e, t, r = {}) {
    a(`Creating FS instance of type ${e} for mount path ${t}`);
    try {
      const i = await this.determineUseSW(e, r);
      e === "idb" && (a("Checking IndexedDB support for IDB FS"), await this.checkIndexedDBSupport() || (a(`IndexedDB not supported, falling back to memory FS for ${t}`), e = "memory"));
      let s;
      switch (e) {
        case "memory":
          a("Creating MemoryFS instance"), s = new z(t, { ...r, useSW: !1 });
          break;
        case "idb":
          a("Creating IDBFs instance"), s = new K(t, { ...r, useSW: i });
          break;
        default:
          const o = `Unknown FS type: ${e}`;
          throw w(o), new Error(o);
      }
      return a(`Successfully created ${e} FS instance for ${t}`), s;
    } catch (i) {
      throw w(`Failed to create FS instance (type: ${e}, path: ${t}):`, i), i;
    }
  }
  async ensureFSInitialized(e) {
    if (a(`Ensuring FS is initialized for path: ${e}`), this.initializedMounts.has(e))
      return a(`FS already initialized for path: ${e}`), !0;
    const t = this.mounts[e];
    if (!t) {
      const r = `Mount not found: ${e}`;
      throw w(r), new Error(r);
    }
    if (!t.fsInstance) {
      a(`Creating new FS instance for mount at ${e}`);
      const r = await this.determineUseSW(t.fsType, t);
      t.fsInstance = await this.createFSInstance(
        t.fsType,
        e,
        {
          useSW: r,
          versioning: this.getVersioningConfig(t),
          merging: this.getMergingConfig(t)
        }
      );
    }
    return a(`Fetching data for mount at ${e}`), await this.fetchFS(
      t.fetchMethod,
      t.fsType,
      t.fsInstance,
      e,
      t.fetchInfo
    ), this.initializedMounts.add(e), a(`Successfully initialized FS for path: ${e}`), !0;
  }
  // Mount/Unmount Operations
  async mount(e, t, r, i, s = {}) {
    a(`Mounting filesystem - path: ${e}, type: ${t}, name: ${r}, method: ${i}, options: ${JSON.stringify(s)}`);
    try {
      const o = s.fetchInfo || {}, c = this.getVersioningConfig(s), l = this.getMergingConfig(s), u = `${e.endsWith("/") ? e : `${e}/`}${r}`;
      if (a(`Normalized mount path: ${u}`), this.mounts[u]) {
        const $ = `Path ${u} is already mounted`;
        throw w($), new Error($);
      }
      this.currentMountPath = u, a(`Checking storage for existing mount at ${u}`);
      const p = await this.loadMountFromStorage(u);
      return p ? (a(`Found stored mount, initializing existing mount at ${u}`), this.initializeStoredMount(u, p, i, o, { versioning: c, merging: l })) : (a(`No stored mount found, creating new mount at ${u}`), this.createNewMount(u, t, r, i, o, c, l));
    } catch (o) {
      throw w("Mount operation failed:", o), o;
    }
  }
  async retrieveAndMountFromFsTable() {
    a("Attempting to retrieve and mount filesystems from fsTable");
    try {
      if (!await this.storageUtils.ensureObjectStoreExists())
        return a("No storage data found - fresh initialization"), !1;
      const t = await this.storageUtils.getAll();
      if (a("Retrieved all mounts from storage:", t), !t || Object.keys(t).length === 0)
        return a("No stored mounts found in fsTable"), !1;
      a(`Found ${Object.keys(t).length} stored mounts`);
      for (const r in t) {
        const i = t[r];
        if (i) {
          a(`Processing mount at ${r} from fsTable`);
          try {
            const s = r.lastIndexOf("/");
            a("Last slash index:", s);
            const o = r.substring(0, s);
            a("path kir: ", o);
            const c = r.substring(s + 1);
            a("fsname kir: ", c), await this.mount(
              o,
              i.fsType,
              c,
              i.fetchMethod,
              {
                fetchInfo: i.fetchInfo,
                versioning: i.versioning,
                merging: i.merging
              }
            ), a(`Successfully mounted ${r} from fsTable`);
          } catch (s) {
            w(`Failed to mount ${r} from fsTable:`, s);
          }
        }
      }
      return a("Finished mounting all filesystems from fsTable"), !0;
    } catch (e) {
      return w("Failed to retrieve and mount:", e), !1;
    }
  }
  async initializeStoredMount(e, t, r, i, s) {
    a(`Initializing stored mount at ${e}`);
    try {
      a(`Creating FS instance for stored mount (type: ${t.fsType})`);
      const o = await this.createFSInstance(
        t.fsType,
        e,
        {
          versioning: this.getVersioningConfig(t),
          merging: this.getMergingConfig(t)
        }
      );
      a(`Fetching data for stored mount using method: ${t.fetchMethod || r}`), await this.fetchFS(
        t.fetchMethod || r,
        t.fsType,
        o,
        e,
        t.fetchInfo || i
      );
      const c = this.getPlatformInfo(), l = t.accessLog || [];
      return l.push({
        time: (/* @__PURE__ */ new Date()).toISOString(),
        action: "remount",
        environment: c
      }), this.mounts[e] = {
        ...t,
        fsInstance: o,
        fetchMethod: t.fetchMethod || r,
        fetchInfo: {
          ...t.fetchInfo || i,
          lastFetched: (/* @__PURE__ */ new Date()).toISOString()
        },
        versioning: this.getVersioningConfig(t),
        merging: this.getMergingConfig(t),
        environment: c,
        // Update environment info
        modified: (/* @__PURE__ */ new Date()).toISOString(),
        accessLog: l
      }, this.initializedMounts.add(e), a(`Successfully initialized stored mount at ${e}`), this.mounts[e];
    } catch (o) {
      throw w(`Failed to initialize stored mount at ${e}:`, o), o;
    }
  }
  async createNewMount(e, t, r, i, s, o = {}, c = {}) {
    a(`Creating new mount at ${e}`);
    try {
      a(`Creating new FS instance (type: ${t})`);
      const l = await this.createFSInstance(t, e, { versioning: o, merging: c });
      a(`Fetching data for new mount using method: ${i}`), await this.fetchFS(i, t, l, e, s), a("Generating filesystem table");
      const f = await this.VFSutils.generateFsTable(), u = await this.VFSutils.getFsTableSize(f);
      a(`Filesystem table generated, size: ${u}`);
      const p = this.getPlatformInfo(), $ = {
        fsInstance: l,
        fsType: l instanceof z ? "memory" : t,
        fsName: r,
        fsTable: f,
        fetchMethod: i,
        fetchInfo: {
          ...s,
          time: (/* @__PURE__ */ new Date()).toISOString(),
          size: u,
          lastFetched: (/* @__PURE__ */ new Date()).toISOString()
        },
        versioning: this.getVersioningConfig({ versioning: o }),
        merging: this.getMergingConfig({ merging: c }),
        environment: p,
        // Add environment info
        created: (/* @__PURE__ */ new Date()).toISOString(),
        modified: (/* @__PURE__ */ new Date()).toISOString(),
        accessLog: [{
          time: (/* @__PURE__ */ new Date()).toISOString(),
          action: "mount",
          environment: p
        }]
      };
      return this.mounts[e] = $, a(`Persisting mount data for ${e}`), await this.persistMountData(e, $), this.initializedMounts.add(e), a(`Successfully mounted new filesystem at ${e}`), $;
    } catch (l) {
      throw w(`Failed to create new mount at ${e}:`, l), l;
    }
  }
  async getMountPaths() {
    return Object.keys(this.mounts);
  }
  async getMountInfo(e) {
    if (!this.mounts[e]) {
      const r = `Mount not found: ${e}`;
      throw w(r), new Error(r);
    }
    const t = this.mounts[e];
    return {
      path: e,
      type: t.fsType,
      name: t.fsName,
      fetchMethod: t.fetchMethod,
      versioning: t.versioning,
      merging: t.merging,
      created: t.created,
      modified: t.modified,
      lastFetched: t.fetchInfo.lastFetched,
      size: t.fetchInfo.size,
      environment: t.environment,
      accessLog: t.accessLog
    };
  }
  async unmount(e, t) {
    const r = e + "/" + t;
    if (a(`Unmounting filesystem at ${r}`), !this.mounts[r]) {
      const s = `Path ${r} is not mounted`;
      throw w(s), new Error(s);
    }
    const i = this.mounts[r];
    try {
      return this.vfsUtilsInstances.has(r) && (a(`Terminating VFSutils instance for ${r}`), await this.vfsUtilsInstances.get(r).terminate(i.fsName, i.fsType), this.vfsUtilsInstances.delete(r)), this.mounts[r].fsInstance && (a(`Closing all files for mount at ${r}`), await this.mounts[r].fsInstance.fs_fcloseall(), this.mounts[r].fsInstance = null), delete this.mounts[r], this.initializedMounts.delete(r), this.storageUtils.remove(r), a(`Successfully unmounted ${r}`), !0;
    } catch (s) {
      throw w(`Error unmounting ${r}:`, s), s;
    }
  }
  // Filesystem Operations
  async fetchFS(e, t, r, i, s, o = !1) {
    a(`Fetching filesystem data - method: ${e}, type: ${t}, name: ${i}`);
    try {
      this.vfsUtilsInstances.has(this.currentMountPath) && (a("Terminating existing VFSutils instance for this mount"), await this.vfsUtilsInstances.get(this.currentMountPath).terminate(), this.vfsUtilsInstances.delete(this.currentMountPath)), a("Creating new VFSutils instance for mount:", this.currentMountPath);
      const c = new J(t, r, i, s, o);
      this.vfsUtilsInstances.set(this.currentMountPath, c);
      const f = {
        git: () => c.fetchFromGit(),
        disk: () => c.fetchFromDisk(),
        googleDrive: () => c.fetchFromGoogleDrive()
      }[e];
      if (!f) {
        const u = `Unknown fetch method: ${e}`;
        throw w(u), new Error(u);
      }
      a(`Executing fetch strategy for ${e}`), await f(), this.mounts[this.currentMountPath] && (this.mounts[this.currentMountPath].fetchInfo.lastFetched = (/* @__PURE__ */ new Date()).toISOString(), this.mounts[this.currentMountPath].modified = (/* @__PURE__ */ new Date()).toISOString(), await this.persistMountData(this.currentMountPath, this.mounts[this.currentMountPath])), a(`Successfully fetched data using ${e} method`);
    } catch (c) {
      throw w(`Fetch operation failed (method: ${e}):`, c), this.vfsUtilsInstances.has(this.currentMountPath) && (a("Cleaning up VFSutils after fetch failure"), await this.vfsUtilsInstances.get(this.currentMountPath).terminate(i, t), this.vfsUtilsInstances.delete(this.currentMountPath)), c;
    }
  }
  async resolveFS(e) {
    a(`Resolving filesystem for path: ${e}`);
    try {
      for (const r in this.mounts)
        if (e.startsWith(r)) {
          a("Found matching mount at ", r), await this.ensureFSInitialized(r);
          const i = e.slice(r.length) || "/";
          return a(`Resolved path: ${e} to mount: ${r}, relative path: ${i}, this.mounts[mountPath] : `, this.mounts[r]), a(
            "resolveFs returned value: ",
            {
              fs: this.mounts[r],
              relativePath: i,
              versioning: this.mounts[r].versioning || m.versioning,
              merging: this.mounts[r].merging || m.merging
            }
          ), {
            fs: this.mounts[r],
            relativePath: i,
            versioning: this.mounts[r].versioning || m.versioning,
            merging: this.mounts[r].merging || m.merging
          };
        }
      const t = `No filesystem mounted for path: ${e}`;
      throw w(t), new Error(t);
    } catch (t) {
      throw w(`Failed to resolve filesystem for path ${e}:`, t), t;
    }
  }
  // Filesystem Table Operations
  async writeToFsTable(e, t = "file", r = 0) {
    a(`Writing to fsTable - path: ${e}, type: ${t}, size: ${r}`), await this.validateVFSutils();
    try {
      const i = this.vfsUtilsInstances.get(this.currentMountPath);
      a(`Updating fsTable with create operation for ${e}`);
      const s = await i.updateFsTable("create", e, t, r);
      return a("Updating mount fsTable with new data"), await this.updateMountFsTable(s.fsTable), a(`Successfully updated fsTable for ${e}`), s.fsTable;
    } catch (i) {
      throw w("Failed to write to fsTable:", i), i;
    }
  }
  async removeFromFsTable(e) {
    a(`Removing from fsTable - path: ${e}`), await this.validateVFSutils();
    try {
      const t = this.vfsUtilsInstances.get(this.currentMountPath);
      a(`Updating fsTable with remove operation for ${e}`);
      const r = await t.updateFsTable("remove", e);
      return a("Updating mount fsTable with removal data"), await this.updateMountFsTable(r.fsTable), a(`Successfully removed ${e} from fsTable`), r.fsTable;
    } catch (t) {
      throw w("Failed to remove from fsTable:", t), t;
    }
  }
  async updateMountFsTable(e) {
    if (a("Updating mount fsTable for current mount path"), !this.currentMountPath) {
      const r = "No active mount path available";
      throw w(r), new Error(r);
    }
    a(`Loading mount data for ${this.currentMountPath}`);
    const t = await this.storageUtils.get(this.currentMountPath);
    if (!t) {
      const r = `Mount data not found for path: ${this.currentMountPath}`;
      throw w(r), new Error(r);
    }
    a("Updating fsTable in mount data"), t.fsTable = e, a(`Storing updated mount data for ${this.currentMountPath}`), await this.storageUtils.store(this.currentMountPath, t), a("Successfully updated mount fsTable");
  }
  // Validation Utilities
  async validateVFSutils() {
    if (a("Validating VFSutils instance"), !this.currentMountPath || !this.vfsUtilsInstances.has(this.currentMountPath)) {
      const e = "VFSutils not initialized for current mount";
      throw w(e), new Error(e);
    }
    a("VFSutils validation passed");
  }
  //----------------------
  // Versioning Operations
  //----------------------
  async versioner(e) {
    a(`Committing version with message: ${e}`), await this.validateVFSutils();
    try {
      const r = await this.vfsUtilsInstances.get(this.currentMountPath).commitStagedChanges(e);
      return a("Version committed successfully"), r;
    } catch (t) {
      throw w("Failed to commit version:", t), t;
    }
  }
  //--------------------
  // Merging Operations
  //--------------------
  async merger(e) {
    a("Starting merge operation"), await this.validateVFSutils();
    try {
      const r = await this.vfsUtilsInstances.get(this.currentMountPath).autoSyncFlow(e);
      return a("Merge operation completed successfully:", r), r;
    } catch (t) {
      throw w("Merge operation failed:", t), t;
    }
  }
  //-------------------
  // Some info setters for vfsUtils
  //-------------------
  async setMergingStrategy(e) {
    a("Setting merging strategy");
    let t = this.mounts[this.currentMountPath];
    return t = { ...t, merging: e }, await this.persistMountData(this.currentMountPath, t), a("Merging strategy set successfully:", e), !0;
  }
  async setVersioingStrategy(e) {
    a("Setting versioning strategy");
    let t = this.mounts[this.currentMountPath];
    return t = { ...t, versioning: e }, await this.persistMountData(this.currentMountPath, t), a("Versioning strategy set successfully:", e), !0;
  }
  async setUserConfigs(e) {
    await this.validateVFSutils(), a("Setting user configurations:", e), await this.VFSutils.updateFetchInfo(e);
    let t = this.mounts[this.currentMountPath];
    return t = { ...t, fetchInfo: { ...t.fetchInfo, ...e } }, this.persistMountData(this.currentMountPath, t), e;
  }
}
const B = new E(m.logging.kfs);
function C(...n) {
  B.consoleDotLog("[Versioning]", ...n);
}
function te(...n) {
  B.consoleDotError("[Versioning]", ...n);
}
class re {
  constructor(e) {
    this.vfs = e, this.clockIntervalID = null, this.operationQueueCount = 0, this.config = this._getDefaultVersioningConfig();
  }
  _getDefaultVersioningConfig() {
    const e = m.versioning || {};
    return {
      strategy: e.strategy,
      interval: e.interval,
      number: e.number
    };
  }
  async _getVersioningConfig(e = {}) {
    const t = this._getDefaultVersioningConfig(), r = e.versioning || {};
    return {
      strategy: r.strategy || t.strategy,
      interval: r.interval || t.interval,
      number: r.number || t.number
    };
  }
  async setup(e = {}) {
    this.config = await this._getVersioningConfig(e), C("Versioning configuration:", this.config), this.config.strategy === "clock" ? this._startClockVersioning() : this.clearClock();
  }
  clearClock() {
    this.clockIntervalID && (clearInterval(this.clockIntervalID), this.clockIntervalID = null);
  }
  _startClockVersioning() {
    this.clearClock();
    const e = (this.config.interval || 10) * 1e3;
    C("Starting clock-based versioning with interval:", e, "ms"), this.clockIntervalID = setInterval(async () => {
      C("Clock-based auto commit triggered");
      try {
        await this.vfs.versioner("Clock-based auto commit");
      } catch (t) {
        te("Error in clock-based versioning:", t);
      }
    }, e);
  }
  async maybeTriggerVersioning(e = null) {
    const t = e || this.config;
    if (t.strategy !== "immediate" && t.strategy === "batch") {
      this.operationQueueCount++;
      const r = t.number || 5;
      C(`Batch operation count: ${this.operationQueueCount}/${r}`), this.operationQueueCount >= r && (this.operationQueueCount = 0, await this.vfs.versioner(`Batch commit after ${r} operations`));
    }
  }
  async getConfig() {
    return this.config;
  }
}
new E(m.logging.kfs);
class ie {
  constructor(e) {
    this.vfs = e, this.clockIntervalID = null, this.config = this._getDefaultMergingConfig();
  }
  _getDefaultMergingConfig() {
    return {
      strategy: m.merging?.strategy || null,
      interval: m.merging?.interval || 10,
      number: m.merging?.number || 5
    };
  }
  async setup(e = {}) {
    this.config = {
      ...this._getDefaultMergingConfig(),
      ...e.merging || {}
    }, this.config.strategy === "clock" ? await this._startClockMerging() : this.clearClock();
  }
  async _startClockMerging() {
    this.clearClock();
    const e = this.config.interval * 1e3;
    this.clockIntervalID = setInterval(async () => {
      try {
        await this.vfs.merger();
      } catch (t) {
        console.error("Clock-based merge failed:", t);
      }
    }, e);
  }
  clearClock() {
    this.clockIntervalID && (clearInterval(this.clockIntervalID), this.clockIntervalID = null);
  }
  async getConfig() {
    return this.config;
  }
}
const se = await V(), U = new E(se.logging.kfs);
function S(...n) {
  U.consoleDotLog("[KFS]", ...n);
}
function I(...n) {
  U.consoleDotError("[KFS]", ...n);
}
class ae {
  constructor() {
    this.vfs = new ee(), this.fsInstance = null, this.versioningManager = new re(this.vfs), this.mergingManager = new ie(this.vfs), this.commitCount = 0, this.mountPaths = null, this.mergingConfig = null, (async () => {
      try {
        await this.init();
      } catch (e) {
        I("Initing Failed for KFS: ", e);
      }
    })(), S("KFS instance created");
  }
  async init() {
    return this.initialized || (this.mountPaths = await this.vfs.getMountPaths(), this.initialized = !0), S("mountpaths: ", this.mountPaths), this;
  }
  // -------------------------------
  // Versioning Configuration
  // -------------------------------
  _setupVersioningAndMerging(e) {
    this.versioningManager.setup(e), this.mergingManager.setup(e);
  }
  _clearClocks() {
    this.versioningManager.clearClock(), this.mergingManager.clearClock();
  }
  async _handleCommit(e) {
    await this.versioningManager.getConfig(), this.mergingConfig = await this.mergingManager.getConfig();
    const t = { remote: "theirs", local: "ours", combine: "combine" }, r = this.mergingConfig?.onConflictStrategy || "remote", i = t[r] || "remote";
    await this.vfs.versioner(e), this.commitCount++, this.mergingConfig.strategy === "immediate" && await this.vfs.merger(i);
  }
  async merge() {
    try {
      const e = { remote: "theirs", local: "ours", combine: "combine" }, t = this.mergingConfig?.onConflictStrategy || "remote", r = e[t] || "remote";
      S("Merging..."), await this.vfs.merger(r), S("Merge completed successfully.");
    } catch (e) {
      throw I("Merge failed:", e), new Error(`Failed to merge: ${e.message}`);
    }
  }
  // -------------------------------
  // Filesystem Operations
  // -------------------------------
  async mount(e, t, r, i, s = {}) {
    try {
      this._setupVersioningAndMerging(s), e = this._normalizePath(e);
      const o = await this.versioningManager.getConfig();
      this.mergingConfig = await this.mergingManager.getConfig();
      const c = await this.vfs.mount(e, t, r, i, {
        ...s,
        versioning: o,
        merging: this.mergingConfig
      });
      this.fsInstance = c.fsInstance;
      const l = await this.read(`${e}/${r}`);
      return this.mountPaths = await this.vfs.getMountPaths(), S("Mount successful, root:", l), c;
    } catch (o) {
      throw I(`Failed to mount filesystem at ${e}:`, o), new Error(`Failed to mount filesystem: ${o.message}`);
    }
  }
  async unmount(e, t) {
    try {
      return e = this._normalizePath(e), await this.vfs.unmount(e, t), this.fsInstance = null, this._clearClocks(), this.commitCount = 0, { success: !0 };
    } catch (r) {
      throw I(`Failed to unmount filesystem at ${e}:`, r), new Error(`Failed to unmount filesystem: ${r.message}`);
    }
  }
  async setMergingStrategy(e) {
    await this.vfs.setMergingStrategy(e), S("Merging strategy set to:", e);
  }
  async setVersioingStrategy(e) {
    await this.vfs.setVersioingStrategy(e), S("Versioning strategy set to:", e);
  }
  /**
   * Sets user configurations for the KFS instance.
    * @param {string} [args.name] - The name of the user.
    * @param {string} [args.email] - The email of the user.
    * @param {string} [args.username] - The username of the user.
    * @param {string} [args.password] - The password of the user.
    * @throws {Error} - Throws an error if the arguments are invalid or if the operation fails.
   */
  async setUserConfigs(e) {
    if (!e || typeof e != "object")
      throw new Error("Invalid arguments: must be an object");
    const t = ["password", "username", "email", "name"], r = Object.keys(e).filter(
      (i) => !t.includes(i)
    );
    if (r.length > 0)
      throw new Error(
        `Invalid field(s) provided: ${r.join(", ")}. Allowed fields are: ${t.join(", ")}`
      );
    return this.vfs.setUserConfigs(e), e;
  }
  async create(e, t = "file", r = "", i = "w") {
    try {
      if (!["file", "dir"].includes(t))
        throw new Error(`Invalid type: ${t}. Must be 'file' or 'dir'`);
      if (!["a", "w"].includes(i))
        throw new Error(`Invalid mode: ${i}. Must be 'a' (append) or 'w' (write)`);
      if (e = this._normalizePath(e), this.mountPaths.includes(e))
        throw new Error(`Cannot write directly to mount path (${e}). Use mount() instead.`);
      const { fs: s, relativePath: o, versioning: c } = await this.vfs.resolveFS(e);
      if (t === "file") {
        await this._ensurePathExists(s, o);
        let l = r, f = `Created file at ${e}`;
        if (i === "a")
          try {
            const $ = await s.fsInstance.fs_fopen(o, "r"), M = await s.fsInstance.fs_fread($, 1024 * 1024);
            await s.fsInstance.fs_fclose($), l = M + r, f = `Appended to file at ${e}`;
          } catch {
            f = `Created file at ${e}`;
          }
        const u = await s.fsInstance.fs_fopen(o, "w");
        if (await s.fsInstance.fs_fwrite(u, l) === -1)
          throw new Error("Failed to write to file");
        await s.fsInstance.fs_fclose(u), await this.vfs.writeToFsTable(o, t, l.length), c?.strategy === "immediate" ? await this._handleCommit(f) : await this.versioningManager.maybeTriggerVersioning(c);
      } else if (t === "dir")
        if (i === "a")
          try {
            await s.fsInstance.fs_mkdir(o), await this.vfs.writeToFsTable(o, t, 0), c?.strategy === "immediate" && await this._handleCommit(`Created directory at ${e}`);
          } catch (l) {
            if (!l.message.includes("exists")) throw l;
          }
        else {
          try {
            await (await s.fsInstance.fs_stat(o)).isDirectory() ? await s.fsInstance.fs_rmdir(o) : await s.fsInstance.fs_remove(o);
          } catch {
          }
          await s.fsInstance.fs_mkdir(o), await this.vfs.writeToFsTable(o, t, 0), c?.strategy === "immediate" && await this._handleCommit(`Created directory at ${e}`);
        }
      return { success: !0 };
    } catch (s) {
      throw I(`Failed to create ${t} at ${e}:`, s), new Error(`Failed to create: ${s.message}`);
    }
  }
  async remove(e) {
    try {
      if (e = this._normalizePath(e), this.mountPaths.includes(e))
        throw new Error(`Cannot remove path (${e}) directly. Use unmount() instead.`);
      const { fs: t, relativePath: r, versioning: i } = await this.vfs.resolveFS(e), s = await t.fsInstance.fs_stat(r);
      if (!s) throw new Error("ENOENT: no such file or directory");
      return await s.isDirectory() ? await t.fsInstance.fs_rmdir(r) : await t.fsInstance.fs_remove(r), await this.vfs.removeFromFsTable(r), i?.strategy === "immediate" ? await this._handleCommit(`Removed ${e}`) : await this.versioningManager.maybeTriggerVersioning(i), { success: !0 };
    } catch (t) {
      throw I(`Failed to remove ${e}:`, t), new Error(`Failed to remove: ${t.message}`);
    }
  }
  async read(e) {
    try {
      e = this._normalizePath(e);
      const { fs: t, relativePath: r } = await this.vfs.resolveFS(e);
      this.fsInstance = t.fsInstance;
      const i = await this.fsInstance.fs_stat(r);
      if (!i) throw new Error("ENOENT: no such file or directory");
      if (await i.isDirectory()) {
        const s = await this.fsInstance.fs_readdir(r);
        return S("result", s), s;
      } else {
        const s = await this.fsInstance.fs_fopen(r, "r"), o = await this.fsInstance.fs_fread(s, 1024 * 1024);
        return await this.fsInstance.fs_fclose(s), o;
      }
    } catch (t) {
      throw new Error(`Failed to read file: ${t.message}`);
    }
  }
  // -------------------------------
  // Utility Methods
  // -------------------------------
  async _ensurePathExists(e, t) {
    const i = t.split("/").filter((o) => o !== "").slice(0, -1);
    let s = "";
    for (const o of i) {
      s = s ? `${s}/${o}` : `/${o}`;
      try {
        await e.fsInstance.fs_mkdir(s), await this.vfs.writeToFsTable(s, "dir");
      } catch (c) {
        if (!c.message.includes("exists")) throw c;
      }
    }
  }
  _normalizePath(e) {
    if (typeof e != "string") throw new Error("Path must be a string");
    return e.startsWith("/") ? e : `/${e}`;
  }
}
export {
  ae as KFS,
  fe as serviceWorker,
  he as setConfig
};
//# sourceMappingURL=kfs.js.map
