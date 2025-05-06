import { L as D, c as m, g as j } from "./configES6-BnlXWGoZ.js";
import { s as he } from "./configES6-BnlXWGoZ.js";
import { L as U } from "./index-jVhJ2jaE.js";
import { serviceWorker as ue } from "./sw-register.js";
var F = function(n) {
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
F.prototype.onInit = function(n) {
  this.connectionEstablished = !0;
  var e = this.queue;
  this.queue = [];
  for (var t = 0, r = e; t < r.length; t += 1)
    this.channel.postMessage(r[t]);
  n.reply && this.channel.postMessage({ type: "MP_INIT", reply: !1 });
}, F.prototype.onSet = function(n) {
  for (var e = this, t = {}, r = n.object, i = function() {
    var l = o[s], d = !n.void.includes(l);
    t[l] = function() {
      for (var g = [], k = arguments.length; k--; ) g[k] = arguments[k];
      return e.rpc_counter = (e.rpc_counter + 1) % Number.MAX_SAFE_INTEGER, new Promise(function(E, _) {
        e.postMessage({ type: "MP_CALL", object: r, method: l, id: e.rpc_counter, args: g, reply: d }), d ? e.calls.set(e.rpc_counter, { resolve: E, reject: _ }) : E();
      });
    };
  }, s = 0, o = n.methods; s < o.length; s += 1) i();
  var c = this.foreign.get(n.object);
  this.foreign.set(n.object, t), typeof c == "function" && c(t);
}, F.prototype.onCall = function(n) {
  var e = this, t = this.local.get(n.object);
  t && t[n.method].apply(t, n.args).then(function(r) {
    return n.reply && e.channel.postMessage({ type: "MP_RETURN", id: n.id, result: r });
  }).catch(function(r) {
    return e.channel.postMessage({ type: "MP_RETURN", id: n.id, error: r.message });
  });
}, F.prototype.onReturn = function(n) {
  if (this.calls.has(n.id)) {
    var e = this.calls.get(n.id), t = e.resolve, r = e.reject;
    this.calls.clear(n.id), n.error ? r(n.error) : t(n.result);
  }
}, F.prototype.postMessage = function(n) {
  this.connectionEstablished ? this.channel.postMessage(n) : this.queue.push(n);
}, F.prototype.set = function(n, e, t) {
  t === void 0 && (t = {}), this.local.set(n, e);
  var r = Object.entries(e).filter(function(i) {
    return typeof i[1] == "function";
  }).map(function(i) {
    return i[0];
  });
  this.postMessage({ type: "MP_SET", object: n, methods: r, void: t.void || [] });
}, F.prototype.get = function(n) {
  return new Promise(function(e, t) {
    var r = this;
    return this.foreign.has(n) ? e(this.foreign.get(n)) : e(new Promise(function(i, s) {
      return r.foreign.set(n, i);
    }));
  }.bind(this));
};
function G(n) {
  var e = new F(n);
  Object.defineProperties(this, { get: { writable: !1, configurable: !1, value: e.get.bind(e) }, set: { writable: !1, configurable: !1, value: e.set.bind(e) } });
}
function q(n) {
  return new Worker(
    "/workers/gitWorker.js",
    {
      type: "module",
      name: n?.name
    }
  );
}
const W = new D(m.logging.WorkerPool);
function T(...n) {
  W.consoleDotLog("[WorkerPool]", ...n);
}
function M(...n) {
  W.consoleDotError("[WorkerPool]", ...n);
}
T("Loading workerPool.");
class K {
  constructor(e = null) {
    this.workers = /* @__PURE__ */ new Map(), this.workerCount = 0, this.WorkerClass = e || (typeof Worker < "u" ? Worker : null);
  }
  async getWorker(e, t = !1) {
    try {
      if (!this.WorkerClass)
        throw new Error("Worker class not available in this environment");
      if (!this.workers.has(e)) {
        T(`Creating new worker for ${e}`);
        const i = new q();
        i.onerror = (l) => {
          throw M("Worker error:", l), M("Error details:", {
            filename: l.filename,
            lineno: l.lineno,
            colno: l.colno,
            message: l.message
          }), l;
        };
        const s = new G(i), o = await Promise.race([
          s.get("workerThread"),
          new Promise(
            (l, d) => setTimeout(() => d(new Error("Worker thread timeout")), 5e3)
          )
        ]);
        T("Worker thread obtained, waiting for readiness..."), await o.ready(), T("Worker is ready");
        const c = typeof navigator < "u" && "serviceWorker" in navigator;
        await o.execute("setSWUsage", { supportsServiceWorker: c, useSW: t }), this.workers.set(e, {
          worker: i,
          portal: s,
          thread: o,
          users: 0
        }), this.workerCount++, T(`Worker for ${e} initialized`);
      }
      const r = this.workers.get(e);
      return r.users++, r;
    } catch (r) {
      throw M(`Failed to get worker for ${e}:`, r), r;
    }
  }
  async releaseWorker(e) {
    if (this.workers.has(e)) {
      const t = this.workers.get(e);
      t.users--, t.users <= 0 && (t.worker.terminate(), this.workers.delete(e), this.workerCount--, T(`Terminated worker for ${e}`));
    }
  }
  async forceTerminateAll() {
    for (const [e, { worker: t }] of this.workers)
      t.terminate(), T(`Force terminated worker for ${e}`);
    this.workers.clear(), this.workerCount = 0;
  }
  getActiveCount() {
    return this.workerCount;
  }
}
const v = new K(), V = new D(m.logging.memoryFS);
function f(...n) {
  V.consoleDotLog("[ MemoryFS ] ", ...n);
}
function y(...n) {
  V.consoleDotError("[ MemoryFS ] ", ...n);
}
f("memoryFs loaded.");
class z {
  constructor(e, t = {}) {
    this.fsName = e, this.fileDescriptors = /* @__PURE__ */ new Map(), this.fdCounter = 3, this.workerEntry = null, this.workerThread = null, this.useSW = t?.useSW || null, this.versioningStrategy = t?.versioning?.strategy || m.versioning.strategy, this.doImmediateCommit = this.versioningStrategy === "immediate", f(`MemoryFS created for ${e}`);
  }
  async initializeWorker() {
    this.workerEntry = await v.getWorker(this.fsName, this.useSW), this.workerThread = this.workerEntry.thread, await this.workerThread.execute("setFs", {
      fsName: this.fsName,
      fsType: "memory"
    }), f(`Worker initialized for ${this.fsName}`);
  }
  async cleanup() {
    this.workerEntry && (await v.releaseWorker(this.fsName), this.workerEntry = null, this.workerThread = null);
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
    return this.fileDescriptors.set(r, { path: e, pos: 0, mode: t }), f(`File descriptor ${r} created for ${e}`), r;
  }
  async fs_fclose(e) {
    if (f(`Closing file descriptor: ${e}`), !this.fileDescriptors.has(e))
      throw new Error(`EBADF: bad file descriptor, close '${e}'`);
    return this.fileDescriptors.delete(e), f(`File descriptor ${e} closed successfully.`), 0;
  }
  async fs_fread(e, t) {
    f(`Reading ${t} bytes from file descriptor: ${e}`);
    const r = this.fileDescriptors.get(e);
    if (!r)
      throw new Error(`EBADF: bad file descriptor, read '${e}'`);
    try {
      this.workerThread || await this.initializeWorker();
      const i = await this.workerThread.execute("readFileDot", { filePath: r.path });
      if (i === null)
        throw new Error(`ENOENT: no such file, read '${r.path}'`);
      const s = i.slice(r.pos, r.pos + t);
      return r.pos += s.length, f(`Read chunk: ${s}, new position: ${r.pos}`), s;
    } catch (i) {
      throw y(`Error reading file ${r.path}:`, i), i;
    }
  }
  async fs_fwrite(e, t) {
    f(`Writing content to file descriptor: ${e}`);
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
      return f(`Current data in file ${r.path}:`, o), o === null && (o = ""), o = o.slice(0, r.pos) + t + o.slice(r.pos + t.length), await this.workerThread.execute("writeFileDot", {
        filePath: r.path,
        fileContent: o,
        doCommit: this.doImmediateCommit
      }), r.pos += t.length, f(`Content written to file ${r.path}, new position: ${r.pos}`), t.length;
    } catch (i) {
      throw y(`Error writing to file ${r.path}:`, i), i;
    }
  }
  async fs_fseek(e, t, r) {
    f(`Seeking in file descriptor: ${e}, offset: ${t}, whence: ${r}`);
    const i = this.fileDescriptors.get(e);
    if (!i)
      throw new Error(`EBADF: bad file descriptor, seek '${e}'`);
    try {
      this.workerThread || await this.initializeWorker();
      const s = await this.workerThread.execute("readFileDot", { filePath: i.path }).catch(() => "");
      return r === "SEEK_SET" ? i.pos = t : r === "SEEK_CUR" ? i.pos += t : r === "SEEK_END" && (i.pos = s.length + t), i.pos = Math.max(0, Math.min(i.pos, s.length)), f(`New position in file ${i.path}: ${i.pos}`), 0;
    } catch (s) {
      throw y(`Error seeking in file ${i.path}:`, s), s;
    }
  }
  async fs_ftell(e) {
    f(`Getting current position for file descriptor: ${e}`);
    const t = this.fileDescriptors.get(e);
    if (!t)
      throw new Error(`EBADF: bad file descriptor, tell '${e}'`);
    return f(`Current position in file ${t.path}: ${t.pos}`), t.pos;
  }
  async fs_ftruncate(e, t) {
    f(`Truncating file descriptor: ${e} to length: ${t}`);
    const r = this.fileDescriptors.get(e);
    if (!r)
      throw new Error(`EBADF: bad file descriptor, truncate '${e}'`);
    try {
      this.workerThread || await this.initializeWorker();
      let s = await this.workerThread.execute("readFileDot", { filePath: r.path }).catch(() => "");
      return f(`Current data in file ${r.path}:`, s), s = s.slice(0, t), await this.workerThread.execute("writeFileDot", {
        filePath: r.path,
        fileContent: s,
        doCommit: this.doImmediateCommit
      }), f(`File ${r.path} truncated to length: ${t}`), 0;
    } catch (i) {
      throw y(`Error truncating file ${r.path}:`, i), i;
    }
  }
  async fs_stat(e) {
    f(`Getting stats for path: ${e}`);
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
      throw y(`Error getting stats for path ${e}:`, t), t;
    }
  }
  async fs_fstat(e) {
    f(`Getting stats for file descriptor: ${e}`);
    const t = this.fileDescriptors.get(e);
    if (!t)
      throw new Error(`EBADF: bad file descriptor, fstat '${e}'`);
    return this.fs_stat(t.path);
  }
  async fs_remove(e) {
    this.workerThread || await this.initializeWorker(), f(`Removing file: ${e}`);
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
      throw y(`Error removing file ${e}:`, t), t;
    }
  }
  async fs_mkdir(e) {
    this.workerThread || await this.initializeWorker(), f(`Creating directory: ${e}`);
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
          return y(`EEXIST: directory already exists, mkdir '${e}'`), -1;
        throw new Error(`ENOTDIR: path exists but is not a directory, mkdir '${e}'`);
      }
      return await this.workerThread.execute("mkdirDot", {
        dirPath: e,
        doCommit: this.doImmediateCommit
      }), 0;
    } catch (t) {
      throw y(`Error creating directory ${e}:`, t), t;
    }
  }
  async fs_rmdir(e) {
    this.workerThread || await this.initializeWorker(), f(`Removing directory: ${e}`);
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
      throw y(`Error removing directory ${e}:`, t), t;
    }
  }
  async fs_rename(e, t) {
    this.workerThread || await this.initializeWorker(), f(`Renaming ${e} to ${t}`);
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
      throw y(`Error renaming ${e} to ${t}:`, r), r;
    }
  }
  async fs_opendir(e) {
    this.workerThread || await this.initializeWorker(), f(`Opening directory: ${e}`);
    try {
      const t = await this.workerThread.execute("isDirectoryDot", { path: e });
      if (!t.exists)
        throw new Error(`ENOENT: no such directory, opendir '${e}'`);
      if (!t.isDirectory)
        throw new Error(`ENOTDIR: not a directory, opendir '${e}'`);
      return await this.workerThread.execute("opendir", { path: e }), 0;
    } catch (t) {
      throw y(`Error opening directory ${e}:`, t), t;
    }
  }
  async fs_readdir(e, t = {}) {
    f(`Reading directory: ${e}`);
    try {
      this.workerThread || await this.initializeWorker();
      const r = await this.workerThread.execute("isDirectoryDot", { path: e });
      if (!r.exists)
        throw new Error(`ENOENT: no such directory, readdir '${e}'`);
      if (!r.isDirectory)
        throw new Error(`ENOTDIR: not a directory, readdir '${e}'`);
      return ((await this.workerThread.execute("readDirDot", { path: e }))?.entries || []).map((o) => ({ path: o.path, type: o.type === "tree" ? "dir" : "file" }));
    } catch (r) {
      throw y(`Error reading directory ${e}:`, r), r;
    }
  }
  async fs_feof(e) {
    f(`Checking EOF for file descriptor: ${e}`);
    const t = this.fileDescriptors.get(e);
    if (!t)
      throw new Error(`EBADF: bad file descriptor, eof '${e}'`);
    try {
      this.workerThread || await this.initializeWorker();
      const r = await this.workerThread.execute("readFileDot", { filePath: t.path }).catch(() => "");
      f(`Current data in file ${t.path}:`, r);
      const i = t.pos >= r.length;
      return f(`EOF status for file ${t.path}: ${i}`), i;
    } catch (r) {
      throw y(`Error checking EOF for file ${t.path}:`, r), r;
    }
  }
  async fs_fflush(e) {
    return f(`Flushing file descriptor: ${e}`), 0;
  }
  async fs_fcloseall() {
    return f("Closing all file descriptors."), this.fileDescriptors.clear(), 0;
  }
}
const R = new D(m.logging.IDBFs);
function h(...n) {
  R.consoleDotLog("[IDBFS] ", ...n);
}
function p(...n) {
  R.consoleDotError("[IDBFS] ", ...n);
}
class H {
  constructor(e, t = {}) {
    this.fs = new U(e, t), this.fileDescriptors = /* @__PURE__ */ new Map(), this.fdCounter = 3, this.workerEntry = null, this.workerThread = null, this.fsName = e, this.useSW = t?.useSW || null, this.versioningStrategy = t?.versioning?.strategy || m.versioning.strategy, this.doImmediateCommit = this.versioningStrategy === "immediate", (async () => await this.initializeWorker())(), h("IDBFS initialized with LightningFS.");
  }
  async initializeWorker() {
    this.workerEntry = await v.getWorker(this.fsName, this.useSW), this.workerThread = this.workerEntry.thread, await this.workerThread.execute("setFs", {
      fsName: this.fsName,
      fsType: "idb",
      gitDir: "/"
    }), h(`Worker initialized for ${this.fsName}`);
  }
  async cleanup() {
    this.workerEntry && (await v.releaseWorker(this.fsName), this.workerEntry = null, this.workerThread = null);
  }
  async fs_fopen(e, t) {
    if (this.workerThread || await this.initializeWorker(), h(`Opening file: ${e} with mode: ${t}`), t.includes("w") || t.includes("a") || t.includes("x")) {
      const i = e.split("/").slice(0, -1).join("/");
      if (i) {
        const s = await this.workerThread.execute("isDirectoryDot", { path: i });
        if (!s.exists || !s.isDirectory)
          throw new Error(`ENOENT: no such directory, open '${e}'`);
      }
    }
    const r = this.fdCounter++;
    return this.fileDescriptors.set(r, { path: e, pos: 0, mode: t }), h(`File descriptor ${r} created for file: ${e}`), r;
  }
  async fs_fclose(e) {
    if (h(`Closing file descriptor: ${e}`), !this.fileDescriptors.has(e))
      throw new Error(`EBADF: bad file descriptor, close '${e}'`);
    return this.fileDescriptors.delete(e), h(`File descriptor ${e} closed successfully.`), 0;
  }
  async fs_fread(e, t) {
    h(`Reading ${t} bytes from file descriptor: ${e}`);
    const r = this.fileDescriptors.get(e);
    if (!r)
      throw new Error(`EBADF: bad file descriptor, read '${e}'`);
    try {
      this.workerThread || await this.initializeWorker();
      const i = await this.workerThread.execute("readFileDot", { filePath: r.path });
      if (i === null)
        throw new Error(`ENOENT: no such file, read '${r.path}'`);
      const s = i.slice(r.pos, r.pos + t);
      return r.pos += s.length, h(`Read chunk: ${s}, new position: ${r.pos}`), s;
    } catch (i) {
      throw p(`Error reading file ${r.path}:`, i), i;
    }
  }
  async fs_fwrite(e, t) {
    h(`Writing content to file descriptor: ${e}`);
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
      return h(`Current data in file ${r.path}:`, o), o === null && (o = ""), o = o.slice(0, r.pos) + t + o.slice(r.pos + t.length), await this.workerThread.execute("writeFileDot", {
        filePath: r.path,
        fileContent: o,
        doCommit: this.doImmediateCommit
      }), r.pos += t.length, h(`Content written to file ${r.path}, new position: ${r.pos}`), t.length;
    } catch (i) {
      throw p(`Error writing to file ${r.path}:`, i), i;
    }
  }
  async fs_fseek(e, t, r) {
    h(`Seeking in file descriptor: ${e}, offset: ${t}, whence: ${r}`);
    const i = this.fileDescriptors.get(e);
    if (!i)
      throw new Error(`EBADF: bad file descriptor, seek '${e}'`);
    try {
      this.workerThread || await this.initializeWorker();
      const s = await this.workerThread.execute("readFileDot", { filePath: i.path }).catch(() => "");
      return r === "SEEK_SET" ? i.pos = t : r === "SEEK_CUR" ? i.pos += t : r === "SEEK_END" && (i.pos = s.length + t), i.pos = Math.max(0, Math.min(i.pos, s.length)), h(`New position in file ${i.path}: ${i.pos}`), 0;
    } catch (s) {
      throw p(`Error seeking in file ${i.path}:`, s), s;
    }
  }
  async fs_ftell(e) {
    h(`Getting current position for file descriptor: ${e}`);
    const t = this.fileDescriptors.get(e);
    if (!t)
      throw new Error(`EBADF: bad file descriptor, tell '${e}'`);
    return h(`Current position in file ${t.path}: ${t.pos}`), t.pos;
  }
  async fs_ftruncate(e, t) {
    h(`Truncating file descriptor: ${e} to length: ${t}`);
    const r = this.fileDescriptors.get(e);
    if (!r)
      throw new Error(`EBADF: bad file descriptor, truncate '${e}'`);
    try {
      this.workerThread || await this.initializeWorker();
      let s = await this.workerThread.execute("readFileDot", { filePath: r.path }).catch(() => "");
      return h(`Current data in file ${r.path}:`, s), s = s.slice(0, t), await this.workerThread.execute("writeFileDot", {
        filePath: r.path,
        fileContent: s,
        doCommit: this.doImmediateCommit
      }), h(`File ${r.path} truncated to length: ${t}`), 0;
    } catch (i) {
      throw p(`Error truncating file ${r.path}:`, i), i;
    }
  }
  async fs_stat(e) {
    h(`Getting stats for path: ${e}`);
    try {
      this.workerThread || await this.initializeWorker();
      const t = "...";
      return {
        ...t,
        isDirectory: async () => {
          h("path: ", e);
          const r = await this.workerThread.execute("isDirectoryDot", { path: e });
          return r.exists ? r.isDirectory : !1;
        },
        isFile: async () => {
          const r = await this.workerThread.execute("isDirectoryDot", { path: e });
          return r.exists ? !r.isDirectory : !1;
        }
      };
    } catch (t) {
      throw p(`Error getting stats for path ${e}:`, t), t;
    }
  }
  async fs_fstat(e) {
    h(`Getting stats for file descriptor: ${e}`);
    const t = this.fileDescriptors.get(e);
    if (!t)
      throw new Error(`EBADF: bad file descriptor, fstat '${e}'`);
    return this.fs_stat(t.path);
  }
  async fs_remove(e) {
    this.workerThread || await this.initializeWorker(), h(`Removing file: ${e}`);
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
      throw p(`Error removing file ${e}:`, t), t;
    }
  }
  async fs_mkdir(e) {
    this.workerThread || await this.initializeWorker(), h(`Creating directory: ${e}`);
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
      throw p(`Error creating directory ${e}:`, t), t;
    }
  }
  async fs_rmdir(e) {
    this.workerThread || await this.initializeWorker(), h(`Removing directory: ${e}`);
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
      throw p(`Error removing directory ${e}:`, t), t;
    }
  }
  async fs_rename(e, t) {
    this.workerThread || await this.initializeWorker(), h(`Renaming ${e} to ${t}`);
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
      throw p(`Error renaming ${e} to ${t}:`, r), r;
    }
  }
  async fs_opendir(e) {
    this.workerThread || await this.initializeWorker(), h(`Opening directory: ${e}`);
    try {
      const t = await this.workerThread.execute("isDirectoryDot", { path: e });
      if (!t.exists)
        throw new Error(`ENOENT: no such directory, opendir '${e}'`);
      if (!t.isDirectory)
        throw new Error(`ENOTDIR: not a directory, opendir '${e}'`);
      return await this.workerThread.execute("opendir", { path: e }), 0;
    } catch (t) {
      throw p(`Error opening directory ${e}:`, t), t;
    }
  }
  async fs_readdir(e, t = {}) {
    h(`Reading directory: ${e}`);
    try {
      this.workerThread || await this.initializeWorker();
      const r = await this.workerThread.execute("isDirectoryDot", { path: e });
      if (!r.exists)
        throw new Error(`ENOENT: no such directory, readdir '${e}'`);
      if (!r.isDirectory)
        throw new Error(`ENOTDIR: not a directory, readdir '${e}'`);
      return ((await this.workerThread.execute("readDirDot", { path: e }))?.entries || []).map((o) => ({ path: o.path, type: o.type === "tree" ? "dir" : "file" }));
    } catch (r) {
      throw p(`Error reading directory ${e}:`, r), r;
    }
  }
  async fs_feof(e) {
    h(`Checking EOF for file descriptor: ${e}`);
    const t = this.fileDescriptors.get(e);
    if (!t)
      throw new Error(`EBADF: bad file descriptor, eof '${e}'`);
    try {
      this.workerThread || await this.initializeWorker();
      const r = await this.workerThread.execute("readFileDot", { filePath: t.path }).catch(() => "");
      h(`Current data in file ${t.path}:`, r);
      const i = t.pos >= r.length;
      return h(`EOF status for file ${t.path}: ${i}`), i;
    } catch (r) {
      throw p(`Error checking EOF for file ${t.path}:`, r), r;
    }
  }
  async fs_fflush(e) {
    return h(`Flushing file descriptor: ${e}`), 0;
  }
  async fs_fcloseall() {
    return h("Closing all file descriptors."), this.fileDescriptors.clear(), 0;
  }
}
const B = new D(m.logging.GitAuth);
function b(...n) {
  B.consoleDotLog(...n);
}
function N(...n) {
  B.consoleDotError(...n);
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
      return await this.workerThread.execute("setAuthParams", { username: e, password: t }), b("Auth params set successfully"), this.AuthChecked || (this.AuthChecked = !0), b("Auth params verified successfully"), !0;
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
      return await this.workerThread.execute("listServerRefs"), b("Auth verification successful"), !0;
    } catch (e) {
      if (e.toString().includes("401") || e.toString().includes("403"))
        return b("Auth verification failed - invalid credentials"), !1;
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
      return await this.workerThread.execute("setConfigs", { name: e, email: t }), b(`User config set, name: ${e}, email: ${t}`), !0;
    } catch (r) {
      throw N(`Failed to set user config: ${r}`), r;
    }
  }
}
const O = new D(m.logging.VFSutils);
function u(...n) {
  O.consoleDotLog("[ VFSUtils ]", ...n);
}
function $(...n) {
  O.consoleDotError("[ VFSUtils ]", ...n);
}
u("Loading VFSUtils module");
class J {
  constructor(e, t, r, i, s = !1) {
    this.fsType = e, this.fsInstance = t, this.fsName = r, this.fetchInfo = i, this.workerEntry = null, this.workerThread = null, this.inodeCounter = 12341, this.fsTable = {}, this.initialized = !1, this.useSW = s, this.auth = null;
  }
  async initialize() {
    if (!this.initialized)
      try {
        this.workerEntry = await v.getWorker(this.fsName, this.useSW), this.workerThread = this.workerEntry.thread, u("Setting Fs for VFSUtils."), await this.workerThread.execute("setFs", {
          fsName: this.fsName,
          fsType: this.fsType
        }), u("Fs set."), this.fetchInfo.corsProxy && await this.workerThread.execute("setCorsProxy", {
          corsProxy: this.fetchInfo.corsProxy
        }), u("workerThread:", this.workerThread), this.auth = new Q(this.workerThread), this.fetchInfo.username && this.fetchInfo.password && await this.setAuthParams(this.fetchInfo.username, this.fetchInfo.password), this.initialized = !0, u(`VFSutils initialized for ${this.fsName} with type ${this.fsType}`);
      } catch (e) {
        throw await this.terminate(), e;
      }
  }
  async terminate() {
    try {
      return this.workerEntry && (await v.releaseWorker(this.fsName), this.workerEntry = null, this.workerThread = null), this.initialized = !1, !0;
    } catch (e) {
      return $("VFSutils termination error:", e), !1;
    }
  }
  async fetchFromGit() {
    try {
      u("Fetching from Git repository..."), this.initialized || await this.initialize(), u("initialized.");
      const { url: e, dir: t = "/" } = this.fetchInfo;
      u(`Cloning repository from ${e} to ${t}`), await this.workerThread.execute("doCloneAndStuff", { url: e }), this.fetchInfo.name && this.fetchInfo.email && await this.setUserConfig(this.fetchInfo.name, this.fetchInfo.email), await this.generateFsTable(), u("Repository successfully cloned and indexed");
    } catch (e) {
      throw $(`Git fetch failed: ${e}`), await this.terminate(), e;
    }
  }
  async fetchFromDisk() {
    try {
      this.initialized || await this.initialize();
      const { dir: e } = this.fetchInfo;
      u(`Loading filesystem from disk at ${e}`), await this.generateFsTable(), u("Successfully loaded filesystem from disk");
    } catch (e) {
      throw $(`Disk load failed: ${e.message}`), await this.terminate(), e;
    }
  }
  async fetchFromGoogleDrive() {
    try {
      this.initialized || await this.initialize();
      const { fileId: e } = this.fetchInfo;
      u(`Fetching from Google Drive file ${e}`), await this.generateFsTable(), u("Successfully fetched from Google Drive");
    } catch (e) {
      throw $(`Google Drive fetch failed: ${e.message}`), await this.terminate(), e;
    }
  }
  /* FS Table Management */
  async generateFsTable() {
    try {
      this.initialized || await this.initialize(), u("Generating FS table...");
      const e = await this.workerThread.execute("listFilesDot", { listDirs: !0 });
      return u("File list:", e), this.fsTable = this.buildHierarchicalFsTable(e), u(
        "FS table generated with",
        Object.keys(this.fsTable["/"].children).length,
        "root entries"
      ), this.fsTable;
    } catch (e) {
      throw $("FS table generation failed:", e), e;
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
          const d = s.children[o], g = l && r.type !== "tree" ? "file" : "directory";
          if (d.type !== g)
            throw new Error(
              `FS conflict: ${r.path} has ${g} where ${d.type} already exists`
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
      for (let d = 0; d < o.length - 1; d++) {
        const g = o[d];
        if (!c.children || !c.children[g]) {
          if (e === "remove")
            throw new Error(`Parent path not found: ${o.slice(0, d + 1).join("/")}`);
          c.children[g] = this.createFsTableEntry(
            g,
            "directory",
            0,
            c.dentry_id
          );
        }
        c = c.children[g];
      }
      const l = o[o.length - 1];
      switch (e) {
        case "create":
          c.children || (c.children = {}), c.children[l] && u(`path ${t} already exists, updating its content`), c.children[l] = this.createFsTableEntry(
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
      throw $("FS table update failed:", s), s;
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
      return $("Size calculation failed:", t), 0;
    }
  }
  async commitStagedChanges(e) {
    try {
      return this.initialized || await this.initialize(), await this.workerThread.execute("setFs", {
        fsName: this.fsName,
        fsType: this.fsType
      }), await this.workerThread.execute("commitStagedChanges", { message: e });
    } catch (t) {
      throw $("Version commit failed:", t), t;
    }
  }
  // -------------------
  //  Merging Methods
  // -------------------
  /**
  * High-level sync flow: checks sync status and acts accordingly.
  * Handles different cases like local changes, remote updates, etc.
  * @returns {Promise<void>}
  * @throws {Error} If sync fails or remote branch not found
  */
  async autoSyncFlow() {
    try {
      const e = await this.getSyncStatus();
      switch (u("Auto-sync: Sync status:", e), e) {
        case "up-to-date":
          u("Auto-sync: Repo is already up to date.");
          return;
        case "local-ahead":
          u("Auto-sync: Local changes detected, syncing with remote..."), await this.syncWithRemote("local-ahead");
          break;
        case "other-cases":
          u("Auto-sync: Other cases detected, syncing with remote..."), await this.syncWithRemote("other-cases");
          break;
        case "remote-branch-not-found":
          $("No remote branch found, cannot sync.");
          break;
        default:
          $("No remote branch found, cannot sync.");
          break;
      }
    } catch (e) {
      $("autoSyncFlow() failed:", e);
    }
  }
  /**
  * Syncs the local repo with the remote by pulling changes.
  * Abstract logic — assumes `doFetch` does a pull or fetch + merge.
  */
  async syncWithRemote(e) {
    try {
      this.initialized || await this.initialize();
      const { url: t } = this.fetchInfo;
      switch (u("Attempting to sync with remote:", t), await this.setAuthParams(this.fetchInfo.username, this.fetchInfo.password), await this.setUserConfig(this.fetchInfo.name, this.fetchInfo.email), e) {
        case "local-ahead":
          u("Syncing with remote by pushing local changes..."), await this.workerThread.execute("push", { url: t, ref: "main" });
          break;
        case "other-cases":
          break;
        default:
          if (u("Could not determine sync strategy, defaulting to pull..."), !pullResult.success)
            throw new Error(`Pull failed: ${pullResult.error}`);
          break;
      }
      await this.generateFsTable(), u("Local repo successfully synced with remote.");
    } catch (t) {
      throw $("syncWithRemote failed:", t), t;
    }
  }
  async getSyncStatus(e = null, t = "main") {
    try {
      const r = e || this.fetchInfo?.url, i = await this.workerThread.execute("getLastLocalCommit", { ref: t }), s = await this.workerThread.execute("getLatestRemoteCommit", { url: r, ref: t });
      if (!s.success) return "remote-branch-not-found";
      const o = s.commit;
      u("localHead:", i, "remoteHead:", o);
      const c = await this.workerThread.execute("findMergeBase", {
        oids: [i, o]
      }), l = c[0];
      u("Merge base:", c);
      const d = l === o;
      return o ? i === o ? "up-to-date" : d ? "local-ahead" : "other-cases" : "remote-branch-not-found";
    } catch (r) {
      return `error: ${r.message}`;
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
    return this.initialized || await this.initialize(), this.fetchInfo = { ...this.fetchInfo, ...e }, u("Fetch info updated:", this.fetchInfo), this.fetchInfo;
  }
}
class X {
  constructor(e = "VFS_Mounts") {
    this.dbName = e;
  }
  supportsIndexedDB() {
    return typeof window < "u" && !!window.indexedDB;
  }
  /** IndexedDB Methods **/
  async getFromIndexedDB(e) {
    return new Promise((t, r) => {
      const i = indexedDB.open(this.dbName, 1);
      i.onerror = () => t(null), i.onsuccess = () => {
        const l = i.result.transaction("mounts", "readonly").objectStore("mounts").get(e);
        l.onsuccess = () => t(l.result || null), l.onerror = () => t(null);
      }, i.onupgradeneeded = (s) => {
        s.target.result.createObjectStore("mounts");
      };
    });
  }
  async storeInIndexedDB(e, t) {
    return new Promise((r, i) => {
      const s = indexedDB.open(this.dbName, 1);
      s.onerror = () => r(!1), s.onsuccess = () => {
        const c = s.result.transaction("mounts", "readwrite");
        c.objectStore("mounts").put(t, e), c.oncomplete = () => r(!0), c.onerror = () => r(!1);
      }, s.onupgradeneeded = (o) => {
        o.target.result.createObjectStore("mounts");
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
  /** LocalStorage Methods **/
  async getFromLocalStorage(e) {
    try {
      const t = localStorage.getItem(e);
      return t ? JSON.parse(t) : null;
    } catch {
      return null;
    }
  }
  async storeInLocalStorage(e, t) {
    localStorage.setItem(e, JSON.stringify(t));
  }
  async removeFromLocalStorage(e) {
    localStorage.removeItem(e);
  }
  /** Unified Storage Methods **/
  async get(e) {
    return this.supportsIndexedDB() ? this.getFromIndexedDB(e) : this.getFromLocalStorage(e);
  }
  async store(e, t) {
    return this.supportsIndexedDB() ? this.storeInIndexedDB(e, t) : this.storeInLocalStorage(e, t);
  }
  async remove(e) {
    return this.supportsIndexedDB() ? this.removeFromIndexedDB(e) : this.removeFromLocalStorage(e);
  }
}
const Y = new D(m.logging.supportChecker);
function S(...n) {
  Y.consoleDotLog(...n);
}
async function Z() {
  try {
    return window.indexedDB ? await new Promise((n) => {
      const e = "testIDBSupport", t = indexedDB.open(e);
      t.onerror = () => {
        S("IndexedDB not available"), n(!1);
      }, t.onsuccess = (r) => {
        r.target.result.close();
        const s = indexedDB.deleteDatabase(e);
        s.onerror = () => {
          S("Failed to delete test database"), n(!0);
        }, s.onsuccess = () => {
          S("IndexedDB test successful"), n(!0);
        };
      }, t.onblocked = () => {
        S("IndexedDB request blocked"), n(!1);
      };
    }) : (S("IndexedDB not supported in this browser"), !1);
  } catch (n) {
    return S("IndexedDB test failed:", n), !1;
  }
}
const A = new D(m.logging.vfs);
function a(...n) {
  A.consoleDotLog("[VFS] ", ...n);
}
function w(...n) {
  A.consoleDotError("[VFS] ", ...n);
}
class ee {
  // Initialization and Core Setup
  constructor(e = "VFS_Mounts") {
    a(`Initializing VFS with storage name: ${e}`), this.mounts = /* @__PURE__ */ Object.create(null), this.initializedMounts = /* @__PURE__ */ new Set(), this.VFSutils = null, this.storageUtils = new X(e), this.currentMountPath = "", this.idbSupported = null, a("VFS instance created");
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
          a("Creating IDBFs instance"), s = new H(t, { ...r, useSW: i });
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
      const o = s.fetchInfo || {}, c = this.getVersioningConfig(s), l = this.getMergingConfig(s), g = `${e.endsWith("/") ? e : `${e}/`}${r}`;
      if (a(`Normalized mount path: ${g}`), this.mounts[g]) {
        const E = `Path ${g} is already mounted`;
        throw w(E), new Error(E);
      }
      this.currentMountPath = g, a(`Checking storage for existing mount at ${g}`);
      const k = await this.loadMountFromStorage(g);
      return k ? (a(`Found stored mount, initializing existing mount at ${g}`), this.initializeStoredMount(g, k, i, o, { versioning: c, merging: l })) : (a(`No stored mount found, creating new mount at ${g}`), this.createNewMount(g, t, r, i, o, c, l));
    } catch (o) {
      throw w("Mount operation failed:", o), o;
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
      return a(`Fetching data for stored mount using method: ${t.fetchMethod || r}`), await this.fetchFS(
        t.fetchMethod || r,
        t.fsType,
        o,
        e,
        t.fetchInfo || i
      ), this.mounts[e] = {
        ...t,
        fsInstance: o,
        fetchMethod: t.fetchMethod || r,
        fetchInfo: t.fetchInfo || i,
        versioning: this.getVersioningConfig(t),
        merging: this.getMergingConfig(t)
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
      const d = await this.VFSutils.generateFsTable(), g = await this.VFSutils.getFsTableSize(d);
      a(`Filesystem table generated, size: ${g}`);
      const k = {
        fsInstance: l,
        fsType: l instanceof z ? "memory" : t,
        fsName: r,
        fsTable: d,
        fetchMethod: i,
        fetchInfo: {
          ...s,
          time: (/* @__PURE__ */ new Date()).toISOString(),
          size: g
        },
        versioning: this.getVersioningConfig({ versioning: o }),
        merging: this.getMergingConfig({ merging: c })
      };
      return this.mounts[e] = k, a(`Persisting mount data for ${e}`), await this.persistMountData(e, k), this.initializedMounts.add(e), a(`Successfully mounted new filesystem at ${e}`), k;
    } catch (l) {
      throw w(`Failed to create new mount at ${e}:`, l), l;
    }
  }
  async unmount(e, t) {
    const r = e + "/" + t;
    if (a(`Unmounting filesystem at ${r}`), !this.mounts[r]) {
      const i = `Path ${r} is not mounted`;
      throw w(i), new Error(i);
    }
    try {
      return this.mounts[r].fsInstance && (a(`Closing all files for mount at ${r}`), await this.mounts[r].fsInstance.fs_fcloseall(), this.mounts[r].fsInstance = null), delete this.mounts[r], this.initializedMounts.delete(r), Object.keys(this.mounts).length === 0 && this.VFSutils && (a("Terminating VFSutils instance (no more mounts)"), await this.VFSutils.terminate(), this.VFSutils = null), a(`Successfully unmounted ${r}`), !0;
    } catch (i) {
      throw w(`Error unmounting ${r}:`, i), i;
    }
  }
  // Filesystem Operations
  async fetchFS(e, t, r, i, s, o = !1) {
    a(`Fetching filesystem data - method: ${e}, type: ${t}, name: ${i}`);
    try {
      this.VFSutils && (a("Terminating existing VFSutils instance"), await this.VFSutils.terminate(), this.VFSutils = null), a("Creating new VFSutils instance"), this.VFSutils = new J(t, r, i, s, o);
      const l = {
        git: () => this.VFSutils.fetchFromGit(),
        disk: () => this.VFSutils.fetchFromDisk(),
        googleDrive: () => this.VFSutils.fetchFromGoogleDrive()
      }[e];
      if (!l) {
        const d = `Unknown fetch method: ${e}`;
        throw w(d), new Error(d);
      }
      a(`Executing fetch strategy for ${e}`), await l(), a(`Successfully fetched data using ${e} method`);
    } catch (c) {
      throw w(`Fetch operation failed (method: ${e}):`, c), this.VFSutils && (a("Cleaning up VFSutils after fetch failure"), await this.VFSutils.terminate(), this.VFSutils = null), c;
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
      a(`Updating fsTable with create operation for ${e}`);
      const i = await this.VFSutils.updateFsTable("create", e, t, r);
      return a("Updating mount fsTable with new data"), await this.updateMountFsTable(i.fsTable), a(`Successfully updated fsTable for ${e}`), i.fsTable;
    } catch (i) {
      throw w("Failed to write to fsTable:", i), i;
    }
  }
  async removeFromFsTable(e) {
    a(`Removing from fsTable - path: ${e}`), await this.validateVFSutils();
    try {
      a(`Updating fsTable with remove operation for ${e}`);
      const t = await this.VFSutils.updateFsTable("remove", e);
      return a("Updating mount fsTable with removal data"), await this.updateMountFsTable(t.fsTable), a(`Successfully removed ${e} from fsTable`), t.fsTable;
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
    if (a("Validating VFSutils instance"), !this.VFSutils) {
      const e = "VFSutils not initialized";
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
      const t = await this.VFSutils.commitStagedChanges(e);
      return a("Version committed successfully"), t;
    } catch (t) {
      throw w("Failed to commit version:", t), t;
    }
  }
  //--------------------
  // Merging Operations
  //--------------------
  async merger() {
    a("Starting merge operation"), await this.validateVFSutils();
    try {
      const e = await this.VFSutils.autoSyncFlow();
      return a("Merge operation completed successfully:", e), e;
    } catch (e) {
      throw w("Merge operation failed:", e), e;
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
    return t = { ...t, versioning: e }, await this.persistMountData(mountPath, t), a("Versioning strategy set successfully:", e), !0;
  }
  async setUserConfigs(e) {
    await this.validateVFSutils(), a("Setting user configurations:", e), await this.VFSutils.updateFetchInfo(e);
    let t = this.mounts[this.currentMountPath];
    return t = { ...t, fetchInfo: { ...t.fetchInfo, ...e } }, this.persistMountData(this.currentMountPath, t), e;
  }
}
const L = new D(m.logging.kfs);
function I(...n) {
  L.consoleDotLog("[Versioning]", ...n);
}
function te(...n) {
  L.consoleDotError("[Versioning]", ...n);
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
    this.config = await this._getVersioningConfig(e), I("Versioning configuration:", this.config), this.config.strategy === "clock" ? this._startClockVersioning() : this.clearClock();
  }
  clearClock() {
    this.clockIntervalID && (clearInterval(this.clockIntervalID), this.clockIntervalID = null);
  }
  _startClockVersioning() {
    this.clearClock();
    const e = (this.config.interval || 10) * 1e3;
    I("Starting clock-based versioning with interval:", e, "ms"), this.clockIntervalID = setInterval(async () => {
      I("Clock-based auto commit triggered");
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
      I(`Batch operation count: ${this.operationQueueCount}/${r}`), this.operationQueueCount >= r && (this.operationQueueCount = 0, await this.vfs.versioner(`Batch commit after ${r} operations`));
    }
  }
  async getConfig() {
    return this.config;
  }
}
new D(m.logging.kfs);
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
        await this.vfs.merger.merge("Clock-based auto merge");
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
const se = await j(), P = new D(se.logging.kfs);
function C(...n) {
  P.consoleDotLog("[KFS]", ...n);
}
function x(...n) {
  P.consoleDotError("[KFS]", ...n);
}
class ae {
  constructor() {
    this.vfs = new ee(), this.fsInstance = null, this.versioningManager = new re(this.vfs), this.mergingManager = new ie(this.vfs), this.commitCount = 0;
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
    await this.versioningManager.getConfig();
    const t = await this.mergingManager.getConfig();
    await this.vfs.versioner(e), this.commitCount++, t.strategy === "immediate" && await this.vfs.merger();
  }
  // -------------------------------
  // Filesystem Operations
  // -------------------------------
  async mount(e, t, r, i, s = {}) {
    try {
      this._setupVersioningAndMerging(s), e = this._normalizePath(e);
      const o = await this.versioningManager.getConfig(), c = await this.mergingManager.getConfig(), l = await this.vfs.mount(e, t, r, i, {
        ...s,
        versioning: o,
        merging: c
      });
      this.fsInstance = l.fsInstance;
      const d = await this.read(`${e}/${r}`);
      return C("Mount successful, root:", d), l;
    } catch (o) {
      throw x(`Failed to mount filesystem at ${e}:`, o), new Error(`Failed to mount filesystem: ${o.message}`);
    }
  }
  async unmount(e, t) {
    try {
      return e = this._normalizePath(e), await this.vfs.unmount(e, t), this.fsInstance = null, this._clearClocks(), this.commitCount = 0, { success: !0 };
    } catch (r) {
      throw x(`Failed to unmount filesystem at ${e}:`, r), new Error(`Failed to unmount filesystem: ${r.message}`);
    }
  }
  async setMergingStrategy(e) {
    await this.vfs.setMergingStrategy(e), C("Merging strategy set to:", e);
  }
  async setVersioingStrategy(e) {
    await this.vfs.setVersioingStrategy(e), C("Versioning strategy set to:", e);
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
      e = this._normalizePath(e);
      const { fs: s, relativePath: o, versioning: c } = await this.vfs.resolveFS(e);
      if (t === "file") {
        await this._ensurePathExists(s, o);
        let l = r, d = `Created file at ${e}`;
        if (i === "a")
          try {
            const E = await s.fsInstance.fs_fopen(o, "r"), _ = await s.fsInstance.fs_fread(E, 1024 * 1024);
            await s.fsInstance.fs_fclose(E), l = _ + r, d = `Appended to file at ${e}`;
          } catch {
            d = `Created file at ${e}`;
          }
        const g = await s.fsInstance.fs_fopen(o, "w");
        if (await s.fsInstance.fs_fwrite(g, l) === -1)
          throw new Error("Failed to write to file");
        await s.fsInstance.fs_fclose(g), await this.vfs.writeToFsTable(o, t, l.length), c?.strategy === "immediate" ? await this._handleCommit(d) : await this.versioningManager.maybeTriggerVersioning(c);
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
      throw x(`Failed to create ${t} at ${e}:`, s), new Error(`Failed to create: ${s.message}`);
    }
  }
  async remove(e) {
    try {
      e = this._normalizePath(e);
      const { fs: t, relativePath: r, versioning: i } = await this.vfs.resolveFS(e), s = await t.fsInstance.fs_stat(r);
      if (!s) throw new Error("ENOENT: no such file or directory");
      return await s.isDirectory() ? await t.fsInstance.fs_rmdir(r) : await t.fsInstance.fs_remove(r), await this.vfs.removeFromFsTable(r), i?.strategy === "immediate" ? await this._handleCommit(`Removed ${e}`) : await this.versioningManager.maybeTriggerVersioning(i), { success: !0 };
    } catch (t) {
      throw x(`Failed to remove ${e}:`, t), new Error(`Failed to remove: ${t.message}`);
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
        return C("result", s), s;
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
  ue as serviceWorker,
  he as setConfig
};
//# sourceMappingURL=kfs.js.map
