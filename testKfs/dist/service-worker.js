var Al = (N, h) => () => (h || N((h = { exports: {} }).exports, h), h.exports);
import { L as Lr, c as qr } from "./configES6-cRERl-FC.js";
var Mh = Al((xe, Le) => {
  (function(N, h) {
    typeof xe == "object" && typeof Le == "object" ? Le.exports = h() : typeof define == "function" && define.amd ? define([], h) : typeof xe == "object" ? xe.git = h() : N.git = h();
  })(self, function() {
    return function(N) {
      var h = {};
      function t(s) {
        if (h[s]) return h[s].exports;
        var u = h[s] = { i: s, l: !1, exports: {} };
        return N[s].call(u.exports, u, u.exports, t), u.l = !0, u.exports;
      }
      return t.m = N, t.c = h, t.d = function(s, u, P) {
        t.o(s, u) || Object.defineProperty(s, u, { enumerable: !0, get: P });
      }, t.r = function(s) {
        typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(s, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(s, "__esModule", { value: !0 });
      }, t.t = function(s, u) {
        if (1 & u && (s = t(s)), 8 & u || 4 & u && typeof s == "object" && s && s.__esModule) return s;
        var P = /* @__PURE__ */ Object.create(null);
        if (t.r(P), Object.defineProperty(P, "default", { enumerable: !0, value: s }), 2 & u && typeof s != "string") for (var c in s) t.d(P, c, function(n) {
          return s[n];
        }.bind(null, c));
        return P;
      }, t.n = function(s) {
        var u = s && s.__esModule ? function() {
          return s.default;
        } : function() {
          return s;
        };
        return t.d(u, "a", u), u;
      }, t.o = function(s, u) {
        return Object.prototype.hasOwnProperty.call(s, u);
      }, t.p = "", t(t.s = 167);
    }([function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(24);
      function u(P, c) {
        if (c === void 0) throw new s.a(P);
      }
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return s;
      });
      class s extends Error {
        constructor(P) {
          super(P), this.caller = "";
        }
        toJSON() {
          return { code: this.code, data: this.data, caller: this.caller, message: this.message, stack: this.stack };
        }
        fromJSON(P) {
          const c = new s(P.message);
          return c.code = P.code, c.data = P.data, c.caller = P.caller, c.stack = P.stack, c;
        }
        get isIsomorphicGitError() {
          return !0;
        }
      }
    }, function(N, h, t) {
      (function(s) {
        t.d(h, "a", function() {
          return d;
        });
        var u = t(91), P = t.n(u), c = t(38), n = t(27), a = t(116), i = t(136);
        function e(S, x, A, f, E, w, I) {
          try {
            var T = S[w](I), M = T.value;
          } catch (R) {
            return void A(R);
          }
          T.done ? x(M) : Promise.resolve(M).then(f, E);
        }
        function k(S) {
          return function() {
            var x = this, A = arguments;
            return new Promise(function(f, E) {
              var w = S.apply(x, A);
              function I(M) {
                e(w, f, E, I, T, "next", M);
              }
              function T(M) {
                e(w, f, E, I, T, "throw", M);
              }
              I(void 0);
            });
          };
        }
        function O(S) {
          return Object(i.a)(((x) => {
            try {
              return x.readFile().catch((A) => A);
            } catch (A) {
              return A;
            }
          })(S));
        }
        const m = ["readFile", "writeFile", "mkdir", "rmdir", "unlink", "stat", "lstat", "readdir", "readlink", "symlink"];
        function _(S, x) {
          if (O(x)) for (const A of m) S[`_${A}`] = x[A].bind(x);
          else for (const A of m) S[`_${A}`] = P()(x[A].bind(x));
          O(x) ? x.rm ? S._rm = x.rm.bind(x) : x.rmdir.length > 1 ? S._rm = x.rmdir.bind(x) : S._rm = a.a.bind(null, S) : x.rm ? S._rm = P()(x.rm.bind(x)) : x.rmdir.length > 2 ? S._rm = P()(x.rmdir.bind(x)) : S._rm = a.a.bind(null, S);
        }
        class d {
          constructor(x) {
            if (x._original_unwrapped_fs !== void 0) return x;
            const A = Object.getOwnPropertyDescriptor(x, "promises");
            A && A.enumerable ? _(this, x.promises) : _(this, x), this._original_unwrapped_fs = x;
          }
          exists(x, A = {}) {
            var f = this;
            return k(function* () {
              try {
                return yield f._stat(x), !0;
              } catch (E) {
                if (E.code === "ENOENT" || E.code === "ENOTDIR" || (E.code || "").includes("ENS")) return !1;
                throw console.log('Unhandled error in "FileSystem.exists()" function', E), E;
              }
            })();
          }
          read(x, A = {}) {
            var f = this;
            return k(function* () {
              try {
                let E = yield f._readFile(x, A);
                if (A.autocrlf === "true") try {
                  E = new TextDecoder("utf8", { fatal: !0 }).decode(E), E = E.replace(/\r\n/g, `
`), E = new TextEncoder().encode(E);
                } catch {
                }
                return typeof E != "string" && (E = s.from(E)), E;
              } catch {
                return null;
              }
            })();
          }
          write(x, A, f = {}) {
            var E = this;
            return k(function* () {
              try {
                return void (yield E._writeFile(x, A, f));
              } catch {
                yield E.mkdir(Object(n.a)(x)), yield E._writeFile(x, A, f);
              }
            })();
          }
          mkdir(x, A = !1) {
            var f = this;
            return k(function* () {
              try {
                return void (yield f._mkdir(x));
              } catch (E) {
                if (E === null || E.code === "EEXIST") return;
                if (A) throw E;
                if (E.code === "ENOENT") {
                  const w = Object(n.a)(x);
                  if (w === "." || w === "/" || w === x) throw E;
                  yield f.mkdir(w), yield f.mkdir(x, !0);
                }
              }
            })();
          }
          rm(x) {
            var A = this;
            return k(function* () {
              try {
                yield A._unlink(x);
              } catch (f) {
                if (f.code !== "ENOENT") throw f;
              }
            })();
          }
          rmdir(x, A) {
            var f = this;
            return k(function* () {
              try {
                A && A.recursive ? yield f._rm(x, A) : yield f._rmdir(x);
              } catch (E) {
                if (E.code !== "ENOENT") throw E;
              }
            })();
          }
          readdir(x) {
            var A = this;
            return k(function* () {
              try {
                const f = yield A._readdir(x);
                return f.sort(c.a), f;
              } catch (f) {
                return f.code === "ENOTDIR" ? null : [];
              }
            })();
          }
          readdirDeep(x) {
            var A = this;
            return k(function* () {
              const f = yield A._readdir(x);
              return (yield Promise.all(f.map(function() {
                var E = k(function* (w) {
                  const I = x + "/" + w;
                  return (yield A._stat(I)).isDirectory() ? A.readdirDeep(I) : I;
                });
                return function(w) {
                  return E.apply(this, arguments);
                };
              }()))).reduce((E, w) => E.concat(w), []);
            })();
          }
          lstat(x) {
            var A = this;
            return k(function* () {
              try {
                return yield A._lstat(x);
              } catch (f) {
                if (f.code === "ENOENT" || (f.code || "").includes("ENS")) return null;
                throw f;
              }
            })();
          }
          readlink(x, A = { encoding: "buffer" }) {
            var f = this;
            return k(function* () {
              try {
                const E = yield f._readlink(x, A);
                return s.isBuffer(E) ? E : s.from(E);
              } catch (E) {
                if (E.code === "ENOENT" || (E.code || "").includes("ENS")) return null;
                throw E;
              }
            })();
          }
          writelink(x, A) {
            var f = this;
            return k(function* () {
              return f._symlink(A.toString("utf8"), x);
            })();
          }
        }
      }).call(this, t(10).Buffer);
    }, function(N, h, t) {
      var s = t(33), u = t.n(s), P = t(32), c = t(72), n = t(8);
      class a {
        constructor(I) {
          if (this.refs = /* @__PURE__ */ new Map(), this.parsedConfig = [], I) {
            let T = null;
            this.parsedConfig = I.trim().split(`
`).map((M) => {
              if (/^\s*#/.test(M)) return { line: M, comment: !0 };
              const R = M.indexOf(" ");
              if (M.startsWith("^")) {
                const U = M.slice(1);
                return this.refs.set(T + "^{}", U), { line: M, ref: T, peeled: U };
              }
              {
                const U = M.slice(0, R);
                return T = M.slice(R + 1), this.refs.set(T, U), { line: M, ref: T, oid: U };
              }
            });
          }
          return this;
        }
        static from(I) {
          return new a(I);
        }
        delete(I) {
          this.parsedConfig = this.parsedConfig.filter((T) => T.ref !== I), this.refs.delete(I);
        }
        toString() {
          return this.parsedConfig.map(({ line: I }) => I).join(`
`) + `
`;
        }
      }
      var i = t(109);
      function e(w, I) {
        const T = w.replace(/\^\{\}$/, ""), M = I.replace(/\^\{\}$/, ""), R = -(T < M) || +(T > M);
        return R === 0 ? w.endsWith("^{}") ? 1 : -1 : R;
      }
      var k = t(16), O = t(11);
      function m(w, I, T, M, R, U, z) {
        try {
          var $ = w[U](z), H = $.value;
        } catch (nt) {
          return void T(nt);
        }
        $.done ? I(H) : Promise.resolve(H).then(M, R);
      }
      function _(w) {
        return function() {
          var I = this, T = arguments;
          return new Promise(function(M, R) {
            var U = w.apply(I, T);
            function z(H) {
              m(U, M, R, z, $, "next", H);
            }
            function $(H) {
              m(U, M, R, z, $, "throw", H);
            }
            z(void 0);
          });
        };
      }
      t.d(h, "a", function() {
        return E;
      });
      const d = (w) => [`${w}`, `refs/${w}`, `refs/tags/${w}`, `refs/heads/${w}`, `refs/remotes/${w}`, `refs/remotes/${w}/HEAD`], S = ["config", "description", "index", "shallow", "commondir"];
      let x;
      function A(w, I) {
        return f.apply(this, arguments);
      }
      function f() {
        return (f = _(function* (w, I) {
          return x === void 0 && (x = new u.a()), x.acquire(w, I);
        })).apply(this, arguments);
      }
      class E {
        static updateRemoteRefs({ fs: I, gitdir: T, remote: M, refs: R, symrefs: U, tags: z, refspecs: $, prune: H = !1, pruneTags: nt = !1 }) {
          return _(function* () {
            for (const Z of R.values()) if (!Z.match(/[0-9a-f]{40}/)) throw new P.a(Z);
            const ot = yield O.a.get({ fs: I, gitdir: T });
            if (!$) {
              if (($ = yield ot.getall(`remote.${M}.fetch`)).length === 0) throw new c.a(M);
              $.unshift(`+HEAD:refs/remotes/${M}/HEAD`);
            }
            const V = i.a.from($), it = /* @__PURE__ */ new Map();
            if (nt) {
              const Z = yield E.listRefs({ fs: I, gitdir: T, filepath: "refs/tags" });
              yield E.deleteRefs({ fs: I, gitdir: T, refs: Z.map((ut) => `refs/tags/${ut}`) });
            }
            if (z) {
              for (const Z of R.keys()) if (Z.startsWith("refs/tags") && !Z.endsWith("^{}") && !(yield E.exists({ fs: I, gitdir: T, ref: Z }))) {
                const ut = R.get(Z);
                it.set(Z, ut);
              }
            }
            const lt = V.translate([...R.keys()]);
            for (const [Z, ut] of lt) {
              const pt = R.get(Z);
              it.set(ut, pt);
            }
            const dt = V.translate([...U.keys()]);
            for (const [Z, ut] of dt) {
              const pt = U.get(Z), st = V.translateOne(pt);
              st && it.set(ut, `ref: ${st}`);
            }
            const G = [];
            if (H) {
              for (const Z of V.localNamespaces()) {
                const ut = (yield E.listRefs({ fs: I, gitdir: T, filepath: Z })).map((pt) => `${Z}/${pt}`);
                for (const pt of ut) it.has(pt) || G.push(pt);
              }
              G.length > 0 && (yield E.deleteRefs({ fs: I, gitdir: T, refs: G }));
            }
            for (const [Z, ut] of it) yield A(Z, _(function* () {
              return I.write(Object(k.join)(T, Z), `${ut.trim()}
`, "utf8");
            }));
            return { pruned: G };
          })();
        }
        static writeRef({ fs: I, gitdir: T, ref: M, value: R }) {
          return _(function* () {
            if (!R.match(/[0-9a-f]{40}/)) throw new P.a(R);
            yield A(M, _(function* () {
              return I.write(Object(k.join)(T, M), `${R.trim()}
`, "utf8");
            }));
          })();
        }
        static writeSymbolicRef({ fs: I, gitdir: T, ref: M, value: R }) {
          return _(function* () {
            yield A(M, _(function* () {
              return I.write(Object(k.join)(T, M), `ref: ${R.trim()}
`, "utf8");
            }));
          })();
        }
        static deleteRef({ fs: I, gitdir: T, ref: M }) {
          return _(function* () {
            return E.deleteRefs({ fs: I, gitdir: T, refs: [M] });
          })();
        }
        static deleteRefs({ fs: I, gitdir: T, refs: M }) {
          return _(function* () {
            yield Promise.all(M.map(($) => I.rm(Object(k.join)(T, $))));
            let R = yield A("packed-refs", _(function* () {
              return I.read(`${T}/packed-refs`, { encoding: "utf8" });
            }));
            const U = a.from(R), z = U.refs.size;
            for (const $ of M) U.refs.has($) && U.delete($);
            U.refs.size < z && (R = U.toString(), yield A("packed-refs", _(function* () {
              return I.write(`${T}/packed-refs`, R, { encoding: "utf8" });
            })));
          })();
        }
        static resolve({ fs: I, gitdir: T, ref: M, depth: R }) {
          return _(function* () {
            if (R !== void 0 && --R === -1) return M;
            if (M.startsWith("ref: ")) return M = M.slice(5), E.resolve({ fs: I, gitdir: T, ref: M, depth: R });
            if (M.length === 40 && /[0-9a-f]{40}/.test(M)) return M;
            const U = yield E.packedRefs({ fs: I, gitdir: T }), z = d(M).filter(($) => !S.includes($));
            for (const $ of z) {
              const H = yield A($, _(function* () {
                return (yield I.read(`${T}/${$}`, { encoding: "utf8" })) || U.get($);
              }));
              if (H) return E.resolve({ fs: I, gitdir: T, ref: H.trim(), depth: R });
            }
            throw new n.a(M);
          })();
        }
        static exists({ fs: I, gitdir: T, ref: M }) {
          return _(function* () {
            try {
              return yield E.expand({ fs: I, gitdir: T, ref: M }), !0;
            } catch {
              return !1;
            }
          })();
        }
        static expand({ fs: I, gitdir: T, ref: M }) {
          return _(function* () {
            if (M.length === 40 && /[0-9a-f]{40}/.test(M)) return M;
            const R = yield E.packedRefs({ fs: I, gitdir: T }), U = d(M);
            for (const z of U)
              if ((yield A(z, _(function* () {
                return I.exists(`${T}/${z}`);
              }))) || R.has(z)) return z;
            throw new n.a(M);
          })();
        }
        static expandAgainstMap({ ref: I, map: T }) {
          return _(function* () {
            const M = d(I);
            for (const R of M) if (yield T.has(R)) return R;
            throw new n.a(I);
          })();
        }
        static resolveAgainstMap({ ref: I, fullref: T = I, depth: M, map: R }) {
          if (M !== void 0 && --M === -1) return { fullref: T, oid: I };
          if (I.startsWith("ref: ")) return I = I.slice(5), E.resolveAgainstMap({ ref: I, fullref: T, depth: M, map: R });
          if (I.length === 40 && /[0-9a-f]{40}/.test(I)) return { fullref: T, oid: I };
          const U = d(I);
          for (const z of U) {
            const $ = R.get(z);
            if ($) return E.resolveAgainstMap({ ref: $.trim(), fullref: z, depth: M, map: R });
          }
          throw new n.a(I);
        }
        static packedRefs({ fs: I, gitdir: T }) {
          return _(function* () {
            const M = yield A("packed-refs", _(function* () {
              return I.read(`${T}/packed-refs`, { encoding: "utf8" });
            }));
            return a.from(M).refs;
          })();
        }
        static listRefs({ fs: I, gitdir: T, filepath: M }) {
          return _(function* () {
            const R = E.packedRefs({ fs: I, gitdir: T });
            let U = null;
            try {
              U = yield I.readdirDeep(`${T}/${M}`), U = U.map((z) => z.replace(`${T}/${M}/`, ""));
            } catch {
              U = [];
            }
            for (let z of (yield R).keys()) z.startsWith(M) && (z = z.replace(M + "/", ""), U.includes(z) || U.push(z));
            return U.sort(e), U;
          })();
        }
        static listBranches({ fs: I, gitdir: T, remote: M }) {
          return _(function* () {
            return M ? E.listRefs({ fs: I, gitdir: T, filepath: `refs/remotes/${M}` }) : E.listRefs({ fs: I, gitdir: T, filepath: "refs/heads" });
          })();
        }
        static listTags({ fs: I, gitdir: T }) {
          return _(function* () {
            return (yield E.listRefs({ fs: I, gitdir: T, filepath: "refs/tags" })).filter((M) => !M.endsWith("^{}"));
          })();
        }
      }
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor(c) {
          super(`An internal error caused this command to fail. Please file a bug report at https://github.com/isomorphic-git/isomorphic-git/issues with this error message: ${c}`), this.code = this.name = u.code, this.data = { message: c };
        }
      }
      u.code = "InternalError";
    }, , , function(N, h, t) {
      (function(s) {
        t.d(h, "a", function() {
          return m;
        });
        var u = t(4), P = t(8), c = t(25), n = t(113), a = t(110), i = t(83), e = t(19);
        function k(d, S, x, A, f, E, w) {
          try {
            var I = d[E](w), T = I.value;
          } catch (M) {
            return void x(M);
          }
          I.done ? S(T) : Promise.resolve(T).then(A, f);
        }
        function O(d) {
          return function() {
            var S = this, x = arguments;
            return new Promise(function(A, f) {
              var E = d.apply(S, x);
              function w(T) {
                k(E, A, f, w, I, "next", T);
              }
              function I(T) {
                k(E, A, f, w, I, "throw", T);
              }
              w(void 0);
            });
          };
        }
        function m(d) {
          return _.apply(this, arguments);
        }
        function _() {
          return (_ = O(function* ({ fs: d, cache: S, gitdir: x, oid: A, format: f = "content" }) {
            const E = (R) => m({ fs: d, cache: S, gitdir: x, oid: R });
            let w;
            if (A === "4b825dc642cb6eb9a060e54bf8d69288fbee4904" && (w = { format: "wrapped", object: s.from("tree 0\0") }), w || (w = yield Object(n.a)({ fs: d, gitdir: x, oid: A })), !w) {
              if (w = yield Object(a.a)({ fs: d, cache: S, gitdir: x, oid: A, getExternalRefDelta: E }), !w) throw new P.a(A);
              return w;
            }
            if (f === "deflated" || (w.format === "deflated" && (w.object = s.from(yield Object(i.a)(w.object)), w.format = "wrapped"), f === "wrapped")) return w;
            const I = yield Object(e.a)(w.object);
            if (I !== A) throw new u.a(`SHA check failed! Expected ${A}, computed ${I}`);
            const { object: T, type: M } = c.a.unwrap(w.object);
            if (w.type = M, w.object = T, w.format = "content", f === "content") return w;
            throw new u.a(`invalid requested format "${f}"`);
          })).apply(this, arguments);
        }
      }).call(this, t(10).Buffer);
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor(c) {
          super(`Could not find ${c}.`), this.code = this.name = u.code, this.data = { what: c };
        }
      }
      u.code = "NotFoundError";
    }, function(N, h, t) {
      (function(s) {
        t.d(h, "a", function() {
          return n;
        });
        var u = t(82), P = t(50);
        function c(a, i, e, k, O, m, _) {
          try {
            var d = a[m](_), S = d.value;
          } catch (x) {
            return void e(x);
          }
          d.done ? i(S) : Promise.resolve(S).then(k, O);
        }
        class n {
          static flush() {
            return s.from("0000", "utf8");
          }
          static delim() {
            return s.from("0001", "utf8");
          }
          static encode(i) {
            typeof i == "string" && (i = s.from(i));
            const e = i.length + 4, k = Object(P.a)(4, e);
            return s.concat([s.from(k, "utf8"), i]);
          }
          static streamReader(i) {
            const e = new u.a(i);
            return function() {
              var k, O = (k = function* () {
                try {
                  let m = yield e.read(4);
                  if (m == null) return !0;
                  if (m = parseInt(m.toString("utf8"), 16), m === 0 || m === 1) return null;
                  const _ = yield e.read(m - 4);
                  return _ == null || _;
                } catch (m) {
                  return i.error = m, !0;
                }
              }, function() {
                var m = this, _ = arguments;
                return new Promise(function(d, S) {
                  var x = k.apply(m, _);
                  function A(E) {
                    c(x, d, S, A, f, "next", E);
                  }
                  function f(E) {
                    c(x, d, S, A, f, "throw", E);
                  }
                  A(void 0);
                });
              });
              return function() {
                return O.apply(this, arguments);
              };
            }();
          }
        }
      }).call(this, t(10).Buffer);
    }, function(N, h, t) {
      (function(s) {
        /*!
         * The buffer module from node.js, for the browser.
         *
         * @author   Feross Aboukhadijeh <http://feross.org>
         * @license  MIT
         */
        var u = t(145), P = t(146), c = t(147);
        function n() {
          return i.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
        }
        function a(C, F) {
          if (n() < F) throw new RangeError("Invalid typed array length");
          return i.TYPED_ARRAY_SUPPORT ? (C = new Uint8Array(F)).__proto__ = i.prototype : (C === null && (C = new i(F)), C.length = F), C;
        }
        function i(C, F, L) {
          if (!(i.TYPED_ARRAY_SUPPORT || this instanceof i)) return new i(C, F, L);
          if (typeof C == "number") {
            if (typeof F == "string") throw new Error("If encoding is specified then the first argument must be a string");
            return O(this, C);
          }
          return e(this, C, F, L);
        }
        function e(C, F, L, K) {
          if (typeof F == "number") throw new TypeError('"value" argument must not be a number');
          return typeof ArrayBuffer < "u" && F instanceof ArrayBuffer ? function(X, rt, yt, kt) {
            if (rt.byteLength, yt < 0 || rt.byteLength < yt) throw new RangeError("'offset' is out of bounds");
            if (rt.byteLength < yt + (kt || 0)) throw new RangeError("'length' is out of bounds");
            return rt = yt === void 0 && kt === void 0 ? new Uint8Array(rt) : kt === void 0 ? new Uint8Array(rt, yt) : new Uint8Array(rt, yt, kt), i.TYPED_ARRAY_SUPPORT ? (X = rt).__proto__ = i.prototype : X = m(X, rt), X;
          }(C, F, L, K) : typeof F == "string" ? function(X, rt, yt) {
            if (typeof yt == "string" && yt !== "" || (yt = "utf8"), !i.isEncoding(yt)) throw new TypeError('"encoding" must be a valid string encoding');
            var kt = 0 | d(rt, yt), At = (X = a(X, kt)).write(rt, yt);
            return At !== kt && (X = X.slice(0, At)), X;
          }(C, F, L) : function(X, rt) {
            if (i.isBuffer(rt)) {
              var yt = 0 | _(rt.length);
              return (X = a(X, yt)).length === 0 || rt.copy(X, 0, 0, yt), X;
            }
            if (rt) {
              if (typeof ArrayBuffer < "u" && rt.buffer instanceof ArrayBuffer || "length" in rt) return typeof rt.length != "number" || (kt = rt.length) != kt ? a(X, 0) : m(X, rt);
              if (rt.type === "Buffer" && c(rt.data)) return m(X, rt.data);
            }
            var kt;
            throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
          }(C, F);
        }
        function k(C) {
          if (typeof C != "number") throw new TypeError('"size" argument must be a number');
          if (C < 0) throw new RangeError('"size" argument must not be negative');
        }
        function O(C, F) {
          if (k(F), C = a(C, F < 0 ? 0 : 0 | _(F)), !i.TYPED_ARRAY_SUPPORT) for (var L = 0; L < F; ++L) C[L] = 0;
          return C;
        }
        function m(C, F) {
          var L = F.length < 0 ? 0 : 0 | _(F.length);
          C = a(C, L);
          for (var K = 0; K < L; K += 1) C[K] = 255 & F[K];
          return C;
        }
        function _(C) {
          if (C >= n()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + n().toString(16) + " bytes");
          return 0 | C;
        }
        function d(C, F) {
          if (i.isBuffer(C)) return C.length;
          if (typeof ArrayBuffer < "u" && typeof ArrayBuffer.isView == "function" && (ArrayBuffer.isView(C) || C instanceof ArrayBuffer)) return C.byteLength;
          typeof C != "string" && (C = "" + C);
          var L = C.length;
          if (L === 0) return 0;
          for (var K = !1; ; ) switch (F) {
            case "ascii":
            case "latin1":
            case "binary":
              return L;
            case "utf8":
            case "utf-8":
            case void 0:
              return mt(C).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return 2 * L;
            case "hex":
              return L >>> 1;
            case "base64":
              return bt(C).length;
            default:
              if (K) return mt(C).length;
              F = ("" + F).toLowerCase(), K = !0;
          }
        }
        function S(C, F, L) {
          var K = !1;
          if ((F === void 0 || F < 0) && (F = 0), F > this.length || ((L === void 0 || L > this.length) && (L = this.length), L <= 0) || (L >>>= 0) <= (F >>>= 0)) return "";
          for (C || (C = "utf8"); ; ) switch (C) {
            case "hex":
              return nt(this, F, L);
            case "utf8":
            case "utf-8":
              return z(this, F, L);
            case "ascii":
              return $(this, F, L);
            case "latin1":
            case "binary":
              return H(this, F, L);
            case "base64":
              return U(this, F, L);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return ot(this, F, L);
            default:
              if (K) throw new TypeError("Unknown encoding: " + C);
              C = (C + "").toLowerCase(), K = !0;
          }
        }
        function x(C, F, L) {
          var K = C[F];
          C[F] = C[L], C[L] = K;
        }
        function A(C, F, L, K, X) {
          if (C.length === 0) return -1;
          if (typeof L == "string" ? (K = L, L = 0) : L > 2147483647 ? L = 2147483647 : L < -2147483648 && (L = -2147483648), L = +L, isNaN(L) && (L = X ? 0 : C.length - 1), L < 0 && (L = C.length + L), L >= C.length) {
            if (X) return -1;
            L = C.length - 1;
          } else if (L < 0) {
            if (!X) return -1;
            L = 0;
          }
          if (typeof F == "string" && (F = i.from(F, K)), i.isBuffer(F)) return F.length === 0 ? -1 : f(C, F, L, K, X);
          if (typeof F == "number") return F &= 255, i.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf == "function" ? X ? Uint8Array.prototype.indexOf.call(C, F, L) : Uint8Array.prototype.lastIndexOf.call(C, F, L) : f(C, [F], L, K, X);
          throw new TypeError("val must be string, number or Buffer");
        }
        function f(C, F, L, K, X) {
          var rt, yt = 1, kt = C.length, At = F.length;
          if (K !== void 0 && ((K = String(K).toLowerCase()) === "ucs2" || K === "ucs-2" || K === "utf16le" || K === "utf-16le")) {
            if (C.length < 2 || F.length < 2) return -1;
            yt = 2, kt /= 2, At /= 2, L /= 2;
          }
          function Tt(re, vt) {
            return yt === 1 ? re[vt] : re.readUInt16BE(vt * yt);
          }
          if (X) {
            var Et = -1;
            for (rt = L; rt < kt; rt++) if (Tt(C, rt) === Tt(F, Et === -1 ? 0 : rt - Et)) {
              if (Et === -1 && (Et = rt), rt - Et + 1 === At) return Et * yt;
            } else Et !== -1 && (rt -= rt - Et), Et = -1;
          } else for (L + At > kt && (L = kt - At), rt = L; rt >= 0; rt--) {
            for (var Wt = !0, Vt = 0; Vt < At; Vt++) if (Tt(C, rt + Vt) !== Tt(F, Vt)) {
              Wt = !1;
              break;
            }
            if (Wt) return rt;
          }
          return -1;
        }
        function E(C, F, L, K) {
          L = Number(L) || 0;
          var X = C.length - L;
          K ? (K = Number(K)) > X && (K = X) : K = X;
          var rt = F.length;
          if (rt % 2 != 0) throw new TypeError("Invalid hex string");
          K > rt / 2 && (K = rt / 2);
          for (var yt = 0; yt < K; ++yt) {
            var kt = parseInt(F.substr(2 * yt, 2), 16);
            if (isNaN(kt)) return yt;
            C[L + yt] = kt;
          }
          return yt;
        }
        function w(C, F, L, K) {
          return wt(mt(F, C.length - L), C, L, K);
        }
        function I(C, F, L, K) {
          return wt(function(X) {
            for (var rt = [], yt = 0; yt < X.length; ++yt) rt.push(255 & X.charCodeAt(yt));
            return rt;
          }(F), C, L, K);
        }
        function T(C, F, L, K) {
          return I(C, F, L, K);
        }
        function M(C, F, L, K) {
          return wt(bt(F), C, L, K);
        }
        function R(C, F, L, K) {
          return wt(function(X, rt) {
            for (var yt, kt, At, Tt = [], Et = 0; Et < X.length && !((rt -= 2) < 0); ++Et) yt = X.charCodeAt(Et), kt = yt >> 8, At = yt % 256, Tt.push(At), Tt.push(kt);
            return Tt;
          }(F, C.length - L), C, L, K);
        }
        function U(C, F, L) {
          return F === 0 && L === C.length ? u.fromByteArray(C) : u.fromByteArray(C.slice(F, L));
        }
        function z(C, F, L) {
          L = Math.min(C.length, L);
          for (var K = [], X = F; X < L; ) {
            var rt, yt, kt, At, Tt = C[X], Et = null, Wt = Tt > 239 ? 4 : Tt > 223 ? 3 : Tt > 191 ? 2 : 1;
            if (X + Wt <= L) switch (Wt) {
              case 1:
                Tt < 128 && (Et = Tt);
                break;
              case 2:
                (192 & (rt = C[X + 1])) == 128 && (At = (31 & Tt) << 6 | 63 & rt) > 127 && (Et = At);
                break;
              case 3:
                rt = C[X + 1], yt = C[X + 2], (192 & rt) == 128 && (192 & yt) == 128 && (At = (15 & Tt) << 12 | (63 & rt) << 6 | 63 & yt) > 2047 && (At < 55296 || At > 57343) && (Et = At);
                break;
              case 4:
                rt = C[X + 1], yt = C[X + 2], kt = C[X + 3], (192 & rt) == 128 && (192 & yt) == 128 && (192 & kt) == 128 && (At = (15 & Tt) << 18 | (63 & rt) << 12 | (63 & yt) << 6 | 63 & kt) > 65535 && At < 1114112 && (Et = At);
            }
            Et === null ? (Et = 65533, Wt = 1) : Et > 65535 && (Et -= 65536, K.push(Et >>> 10 & 1023 | 55296), Et = 56320 | 1023 & Et), K.push(Et), X += Wt;
          }
          return function(Vt) {
            var re = Vt.length;
            if (re <= 4096) return String.fromCharCode.apply(String, Vt);
            for (var vt = "", Zt = 0; Zt < re; ) vt += String.fromCharCode.apply(String, Vt.slice(Zt, Zt += 4096));
            return vt;
          }(K);
        }
        h.Buffer = i, h.SlowBuffer = function(C) {
          return +C != C && (C = 0), i.alloc(+C);
        }, h.INSPECT_MAX_BYTES = 50, i.TYPED_ARRAY_SUPPORT = s.TYPED_ARRAY_SUPPORT !== void 0 ? s.TYPED_ARRAY_SUPPORT : function() {
          try {
            var C = new Uint8Array(1);
            return C.__proto__ = { __proto__: Uint8Array.prototype, foo: function() {
              return 42;
            } }, C.foo() === 42 && typeof C.subarray == "function" && C.subarray(1, 1).byteLength === 0;
          } catch {
            return !1;
          }
        }(), h.kMaxLength = n(), i.poolSize = 8192, i._augment = function(C) {
          return C.__proto__ = i.prototype, C;
        }, i.from = function(C, F, L) {
          return e(null, C, F, L);
        }, i.TYPED_ARRAY_SUPPORT && (i.prototype.__proto__ = Uint8Array.prototype, i.__proto__ = Uint8Array, typeof Symbol < "u" && Symbol.species && i[Symbol.species] === i && Object.defineProperty(i, Symbol.species, { value: null, configurable: !0 })), i.alloc = function(C, F, L) {
          return function(K, X, rt, yt) {
            return k(X), X <= 0 ? a(K, X) : rt !== void 0 ? typeof yt == "string" ? a(K, X).fill(rt, yt) : a(K, X).fill(rt) : a(K, X);
          }(null, C, F, L);
        }, i.allocUnsafe = function(C) {
          return O(null, C);
        }, i.allocUnsafeSlow = function(C) {
          return O(null, C);
        }, i.isBuffer = function(C) {
          return !(C == null || !C._isBuffer);
        }, i.compare = function(C, F) {
          if (!i.isBuffer(C) || !i.isBuffer(F)) throw new TypeError("Arguments must be Buffers");
          if (C === F) return 0;
          for (var L = C.length, K = F.length, X = 0, rt = Math.min(L, K); X < rt; ++X) if (C[X] !== F[X]) {
            L = C[X], K = F[X];
            break;
          }
          return L < K ? -1 : K < L ? 1 : 0;
        }, i.isEncoding = function(C) {
          switch (String(C).toLowerCase()) {
            case "hex":
            case "utf8":
            case "utf-8":
            case "ascii":
            case "latin1":
            case "binary":
            case "base64":
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return !0;
            default:
              return !1;
          }
        }, i.concat = function(C, F) {
          if (!c(C)) throw new TypeError('"list" argument must be an Array of Buffers');
          if (C.length === 0) return i.alloc(0);
          var L;
          if (F === void 0) for (F = 0, L = 0; L < C.length; ++L) F += C[L].length;
          var K = i.allocUnsafe(F), X = 0;
          for (L = 0; L < C.length; ++L) {
            var rt = C[L];
            if (!i.isBuffer(rt)) throw new TypeError('"list" argument must be an Array of Buffers');
            rt.copy(K, X), X += rt.length;
          }
          return K;
        }, i.byteLength = d, i.prototype._isBuffer = !0, i.prototype.swap16 = function() {
          var C = this.length;
          if (C % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
          for (var F = 0; F < C; F += 2) x(this, F, F + 1);
          return this;
        }, i.prototype.swap32 = function() {
          var C = this.length;
          if (C % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
          for (var F = 0; F < C; F += 4) x(this, F, F + 3), x(this, F + 1, F + 2);
          return this;
        }, i.prototype.swap64 = function() {
          var C = this.length;
          if (C % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
          for (var F = 0; F < C; F += 8) x(this, F, F + 7), x(this, F + 1, F + 6), x(this, F + 2, F + 5), x(this, F + 3, F + 4);
          return this;
        }, i.prototype.toString = function() {
          var C = 0 | this.length;
          return C === 0 ? "" : arguments.length === 0 ? z(this, 0, C) : S.apply(this, arguments);
        }, i.prototype.equals = function(C) {
          if (!i.isBuffer(C)) throw new TypeError("Argument must be a Buffer");
          return this === C || i.compare(this, C) === 0;
        }, i.prototype.inspect = function() {
          var C = "", F = h.INSPECT_MAX_BYTES;
          return this.length > 0 && (C = this.toString("hex", 0, F).match(/.{2}/g).join(" "), this.length > F && (C += " ... ")), "<Buffer " + C + ">";
        }, i.prototype.compare = function(C, F, L, K, X) {
          if (!i.isBuffer(C)) throw new TypeError("Argument must be a Buffer");
          if (F === void 0 && (F = 0), L === void 0 && (L = C ? C.length : 0), K === void 0 && (K = 0), X === void 0 && (X = this.length), F < 0 || L > C.length || K < 0 || X > this.length) throw new RangeError("out of range index");
          if (K >= X && F >= L) return 0;
          if (K >= X) return -1;
          if (F >= L) return 1;
          if (this === C) return 0;
          for (var rt = (X >>>= 0) - (K >>>= 0), yt = (L >>>= 0) - (F >>>= 0), kt = Math.min(rt, yt), At = this.slice(K, X), Tt = C.slice(F, L), Et = 0; Et < kt; ++Et) if (At[Et] !== Tt[Et]) {
            rt = At[Et], yt = Tt[Et];
            break;
          }
          return rt < yt ? -1 : yt < rt ? 1 : 0;
        }, i.prototype.includes = function(C, F, L) {
          return this.indexOf(C, F, L) !== -1;
        }, i.prototype.indexOf = function(C, F, L) {
          return A(this, C, F, L, !0);
        }, i.prototype.lastIndexOf = function(C, F, L) {
          return A(this, C, F, L, !1);
        }, i.prototype.write = function(C, F, L, K) {
          if (F === void 0) K = "utf8", L = this.length, F = 0;
          else if (L === void 0 && typeof F == "string") K = F, L = this.length, F = 0;
          else {
            if (!isFinite(F)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
            F |= 0, isFinite(L) ? (L |= 0, K === void 0 && (K = "utf8")) : (K = L, L = void 0);
          }
          var X = this.length - F;
          if ((L === void 0 || L > X) && (L = X), C.length > 0 && (L < 0 || F < 0) || F > this.length) throw new RangeError("Attempt to write outside buffer bounds");
          K || (K = "utf8");
          for (var rt = !1; ; ) switch (K) {
            case "hex":
              return E(this, C, F, L);
            case "utf8":
            case "utf-8":
              return w(this, C, F, L);
            case "ascii":
              return I(this, C, F, L);
            case "latin1":
            case "binary":
              return T(this, C, F, L);
            case "base64":
              return M(this, C, F, L);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return R(this, C, F, L);
            default:
              if (rt) throw new TypeError("Unknown encoding: " + K);
              K = ("" + K).toLowerCase(), rt = !0;
          }
        }, i.prototype.toJSON = function() {
          return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
        };
        function $(C, F, L) {
          var K = "";
          L = Math.min(C.length, L);
          for (var X = F; X < L; ++X) K += String.fromCharCode(127 & C[X]);
          return K;
        }
        function H(C, F, L) {
          var K = "";
          L = Math.min(C.length, L);
          for (var X = F; X < L; ++X) K += String.fromCharCode(C[X]);
          return K;
        }
        function nt(C, F, L) {
          var K = C.length;
          (!F || F < 0) && (F = 0), (!L || L < 0 || L > K) && (L = K);
          for (var X = "", rt = F; rt < L; ++rt) X += st(C[rt]);
          return X;
        }
        function ot(C, F, L) {
          for (var K = C.slice(F, L), X = "", rt = 0; rt < K.length; rt += 2) X += String.fromCharCode(K[rt] + 256 * K[rt + 1]);
          return X;
        }
        function V(C, F, L) {
          if (C % 1 != 0 || C < 0) throw new RangeError("offset is not uint");
          if (C + F > L) throw new RangeError("Trying to access beyond buffer length");
        }
        function it(C, F, L, K, X, rt) {
          if (!i.isBuffer(C)) throw new TypeError('"buffer" argument must be a Buffer instance');
          if (F > X || F < rt) throw new RangeError('"value" argument is out of bounds');
          if (L + K > C.length) throw new RangeError("Index out of range");
        }
        function lt(C, F, L, K) {
          F < 0 && (F = 65535 + F + 1);
          for (var X = 0, rt = Math.min(C.length - L, 2); X < rt; ++X) C[L + X] = (F & 255 << 8 * (K ? X : 1 - X)) >>> 8 * (K ? X : 1 - X);
        }
        function dt(C, F, L, K) {
          F < 0 && (F = 4294967295 + F + 1);
          for (var X = 0, rt = Math.min(C.length - L, 4); X < rt; ++X) C[L + X] = F >>> 8 * (K ? X : 3 - X) & 255;
        }
        function G(C, F, L, K, X, rt) {
          if (L + K > C.length) throw new RangeError("Index out of range");
          if (L < 0) throw new RangeError("Index out of range");
        }
        function Z(C, F, L, K, X) {
          return X || G(C, 0, L, 4), P.write(C, F, L, K, 23, 4), L + 4;
        }
        function ut(C, F, L, K, X) {
          return X || G(C, 0, L, 8), P.write(C, F, L, K, 52, 8), L + 8;
        }
        i.prototype.slice = function(C, F) {
          var L, K = this.length;
          if ((C = ~~C) < 0 ? (C += K) < 0 && (C = 0) : C > K && (C = K), (F = F === void 0 ? K : ~~F) < 0 ? (F += K) < 0 && (F = 0) : F > K && (F = K), F < C && (F = C), i.TYPED_ARRAY_SUPPORT) (L = this.subarray(C, F)).__proto__ = i.prototype;
          else {
            var X = F - C;
            L = new i(X, void 0);
            for (var rt = 0; rt < X; ++rt) L[rt] = this[rt + C];
          }
          return L;
        }, i.prototype.readUIntLE = function(C, F, L) {
          C |= 0, F |= 0, L || V(C, F, this.length);
          for (var K = this[C], X = 1, rt = 0; ++rt < F && (X *= 256); ) K += this[C + rt] * X;
          return K;
        }, i.prototype.readUIntBE = function(C, F, L) {
          C |= 0, F |= 0, L || V(C, F, this.length);
          for (var K = this[C + --F], X = 1; F > 0 && (X *= 256); ) K += this[C + --F] * X;
          return K;
        }, i.prototype.readUInt8 = function(C, F) {
          return F || V(C, 1, this.length), this[C];
        }, i.prototype.readUInt16LE = function(C, F) {
          return F || V(C, 2, this.length), this[C] | this[C + 1] << 8;
        }, i.prototype.readUInt16BE = function(C, F) {
          return F || V(C, 2, this.length), this[C] << 8 | this[C + 1];
        }, i.prototype.readUInt32LE = function(C, F) {
          return F || V(C, 4, this.length), (this[C] | this[C + 1] << 8 | this[C + 2] << 16) + 16777216 * this[C + 3];
        }, i.prototype.readUInt32BE = function(C, F) {
          return F || V(C, 4, this.length), 16777216 * this[C] + (this[C + 1] << 16 | this[C + 2] << 8 | this[C + 3]);
        }, i.prototype.readIntLE = function(C, F, L) {
          C |= 0, F |= 0, L || V(C, F, this.length);
          for (var K = this[C], X = 1, rt = 0; ++rt < F && (X *= 256); ) K += this[C + rt] * X;
          return K >= (X *= 128) && (K -= Math.pow(2, 8 * F)), K;
        }, i.prototype.readIntBE = function(C, F, L) {
          C |= 0, F |= 0, L || V(C, F, this.length);
          for (var K = F, X = 1, rt = this[C + --K]; K > 0 && (X *= 256); ) rt += this[C + --K] * X;
          return rt >= (X *= 128) && (rt -= Math.pow(2, 8 * F)), rt;
        }, i.prototype.readInt8 = function(C, F) {
          return F || V(C, 1, this.length), 128 & this[C] ? -1 * (255 - this[C] + 1) : this[C];
        }, i.prototype.readInt16LE = function(C, F) {
          F || V(C, 2, this.length);
          var L = this[C] | this[C + 1] << 8;
          return 32768 & L ? 4294901760 | L : L;
        }, i.prototype.readInt16BE = function(C, F) {
          F || V(C, 2, this.length);
          var L = this[C + 1] | this[C] << 8;
          return 32768 & L ? 4294901760 | L : L;
        }, i.prototype.readInt32LE = function(C, F) {
          return F || V(C, 4, this.length), this[C] | this[C + 1] << 8 | this[C + 2] << 16 | this[C + 3] << 24;
        }, i.prototype.readInt32BE = function(C, F) {
          return F || V(C, 4, this.length), this[C] << 24 | this[C + 1] << 16 | this[C + 2] << 8 | this[C + 3];
        }, i.prototype.readFloatLE = function(C, F) {
          return F || V(C, 4, this.length), P.read(this, C, !0, 23, 4);
        }, i.prototype.readFloatBE = function(C, F) {
          return F || V(C, 4, this.length), P.read(this, C, !1, 23, 4);
        }, i.prototype.readDoubleLE = function(C, F) {
          return F || V(C, 8, this.length), P.read(this, C, !0, 52, 8);
        }, i.prototype.readDoubleBE = function(C, F) {
          return F || V(C, 8, this.length), P.read(this, C, !1, 52, 8);
        }, i.prototype.writeUIntLE = function(C, F, L, K) {
          C = +C, F |= 0, L |= 0, K || it(this, C, F, L, Math.pow(2, 8 * L) - 1, 0);
          var X = 1, rt = 0;
          for (this[F] = 255 & C; ++rt < L && (X *= 256); ) this[F + rt] = C / X & 255;
          return F + L;
        }, i.prototype.writeUIntBE = function(C, F, L, K) {
          C = +C, F |= 0, L |= 0, K || it(this, C, F, L, Math.pow(2, 8 * L) - 1, 0);
          var X = L - 1, rt = 1;
          for (this[F + X] = 255 & C; --X >= 0 && (rt *= 256); ) this[F + X] = C / rt & 255;
          return F + L;
        }, i.prototype.writeUInt8 = function(C, F, L) {
          return C = +C, F |= 0, L || it(this, C, F, 1, 255, 0), i.TYPED_ARRAY_SUPPORT || (C = Math.floor(C)), this[F] = 255 & C, F + 1;
        }, i.prototype.writeUInt16LE = function(C, F, L) {
          return C = +C, F |= 0, L || it(this, C, F, 2, 65535, 0), i.TYPED_ARRAY_SUPPORT ? (this[F] = 255 & C, this[F + 1] = C >>> 8) : lt(this, C, F, !0), F + 2;
        }, i.prototype.writeUInt16BE = function(C, F, L) {
          return C = +C, F |= 0, L || it(this, C, F, 2, 65535, 0), i.TYPED_ARRAY_SUPPORT ? (this[F] = C >>> 8, this[F + 1] = 255 & C) : lt(this, C, F, !1), F + 2;
        }, i.prototype.writeUInt32LE = function(C, F, L) {
          return C = +C, F |= 0, L || it(this, C, F, 4, 4294967295, 0), i.TYPED_ARRAY_SUPPORT ? (this[F + 3] = C >>> 24, this[F + 2] = C >>> 16, this[F + 1] = C >>> 8, this[F] = 255 & C) : dt(this, C, F, !0), F + 4;
        }, i.prototype.writeUInt32BE = function(C, F, L) {
          return C = +C, F |= 0, L || it(this, C, F, 4, 4294967295, 0), i.TYPED_ARRAY_SUPPORT ? (this[F] = C >>> 24, this[F + 1] = C >>> 16, this[F + 2] = C >>> 8, this[F + 3] = 255 & C) : dt(this, C, F, !1), F + 4;
        }, i.prototype.writeIntLE = function(C, F, L, K) {
          if (C = +C, F |= 0, !K) {
            var X = Math.pow(2, 8 * L - 1);
            it(this, C, F, L, X - 1, -X);
          }
          var rt = 0, yt = 1, kt = 0;
          for (this[F] = 255 & C; ++rt < L && (yt *= 256); ) C < 0 && kt === 0 && this[F + rt - 1] !== 0 && (kt = 1), this[F + rt] = (C / yt >> 0) - kt & 255;
          return F + L;
        }, i.prototype.writeIntBE = function(C, F, L, K) {
          if (C = +C, F |= 0, !K) {
            var X = Math.pow(2, 8 * L - 1);
            it(this, C, F, L, X - 1, -X);
          }
          var rt = L - 1, yt = 1, kt = 0;
          for (this[F + rt] = 255 & C; --rt >= 0 && (yt *= 256); ) C < 0 && kt === 0 && this[F + rt + 1] !== 0 && (kt = 1), this[F + rt] = (C / yt >> 0) - kt & 255;
          return F + L;
        }, i.prototype.writeInt8 = function(C, F, L) {
          return C = +C, F |= 0, L || it(this, C, F, 1, 127, -128), i.TYPED_ARRAY_SUPPORT || (C = Math.floor(C)), C < 0 && (C = 255 + C + 1), this[F] = 255 & C, F + 1;
        }, i.prototype.writeInt16LE = function(C, F, L) {
          return C = +C, F |= 0, L || it(this, C, F, 2, 32767, -32768), i.TYPED_ARRAY_SUPPORT ? (this[F] = 255 & C, this[F + 1] = C >>> 8) : lt(this, C, F, !0), F + 2;
        }, i.prototype.writeInt16BE = function(C, F, L) {
          return C = +C, F |= 0, L || it(this, C, F, 2, 32767, -32768), i.TYPED_ARRAY_SUPPORT ? (this[F] = C >>> 8, this[F + 1] = 255 & C) : lt(this, C, F, !1), F + 2;
        }, i.prototype.writeInt32LE = function(C, F, L) {
          return C = +C, F |= 0, L || it(this, C, F, 4, 2147483647, -2147483648), i.TYPED_ARRAY_SUPPORT ? (this[F] = 255 & C, this[F + 1] = C >>> 8, this[F + 2] = C >>> 16, this[F + 3] = C >>> 24) : dt(this, C, F, !0), F + 4;
        }, i.prototype.writeInt32BE = function(C, F, L) {
          return C = +C, F |= 0, L || it(this, C, F, 4, 2147483647, -2147483648), C < 0 && (C = 4294967295 + C + 1), i.TYPED_ARRAY_SUPPORT ? (this[F] = C >>> 24, this[F + 1] = C >>> 16, this[F + 2] = C >>> 8, this[F + 3] = 255 & C) : dt(this, C, F, !1), F + 4;
        }, i.prototype.writeFloatLE = function(C, F, L) {
          return Z(this, C, F, !0, L);
        }, i.prototype.writeFloatBE = function(C, F, L) {
          return Z(this, C, F, !1, L);
        }, i.prototype.writeDoubleLE = function(C, F, L) {
          return ut(this, C, F, !0, L);
        }, i.prototype.writeDoubleBE = function(C, F, L) {
          return ut(this, C, F, !1, L);
        }, i.prototype.copy = function(C, F, L, K) {
          if (L || (L = 0), K || K === 0 || (K = this.length), F >= C.length && (F = C.length), F || (F = 0), K > 0 && K < L && (K = L), K === L || C.length === 0 || this.length === 0) return 0;
          if (F < 0) throw new RangeError("targetStart out of bounds");
          if (L < 0 || L >= this.length) throw new RangeError("sourceStart out of bounds");
          if (K < 0) throw new RangeError("sourceEnd out of bounds");
          K > this.length && (K = this.length), C.length - F < K - L && (K = C.length - F + L);
          var X, rt = K - L;
          if (this === C && L < F && F < K) for (X = rt - 1; X >= 0; --X) C[X + F] = this[X + L];
          else if (rt < 1e3 || !i.TYPED_ARRAY_SUPPORT) for (X = 0; X < rt; ++X) C[X + F] = this[X + L];
          else Uint8Array.prototype.set.call(C, this.subarray(L, L + rt), F);
          return rt;
        }, i.prototype.fill = function(C, F, L, K) {
          if (typeof C == "string") {
            if (typeof F == "string" ? (K = F, F = 0, L = this.length) : typeof L == "string" && (K = L, L = this.length), C.length === 1) {
              var X = C.charCodeAt(0);
              X < 256 && (C = X);
            }
            if (K !== void 0 && typeof K != "string") throw new TypeError("encoding must be a string");
            if (typeof K == "string" && !i.isEncoding(K)) throw new TypeError("Unknown encoding: " + K);
          } else typeof C == "number" && (C &= 255);
          if (F < 0 || this.length < F || this.length < L) throw new RangeError("Out of range index");
          if (L <= F) return this;
          var rt;
          if (F >>>= 0, L = L === void 0 ? this.length : L >>> 0, C || (C = 0), typeof C == "number") for (rt = F; rt < L; ++rt) this[rt] = C;
          else {
            var yt = i.isBuffer(C) ? C : mt(new i(C, K).toString()), kt = yt.length;
            for (rt = 0; rt < L - F; ++rt) this[rt + F] = yt[rt % kt];
          }
          return this;
        };
        var pt = /[^+\/0-9A-Za-z-_]/g;
        function st(C) {
          return C < 16 ? "0" + C.toString(16) : C.toString(16);
        }
        function mt(C, F) {
          var L;
          F = F || 1 / 0;
          for (var K = C.length, X = null, rt = [], yt = 0; yt < K; ++yt) {
            if ((L = C.charCodeAt(yt)) > 55295 && L < 57344) {
              if (!X) {
                if (L > 56319) {
                  (F -= 3) > -1 && rt.push(239, 191, 189);
                  continue;
                }
                if (yt + 1 === K) {
                  (F -= 3) > -1 && rt.push(239, 191, 189);
                  continue;
                }
                X = L;
                continue;
              }
              if (L < 56320) {
                (F -= 3) > -1 && rt.push(239, 191, 189), X = L;
                continue;
              }
              L = 65536 + (X - 55296 << 10 | L - 56320);
            } else X && (F -= 3) > -1 && rt.push(239, 191, 189);
            if (X = null, L < 128) {
              if ((F -= 1) < 0) break;
              rt.push(L);
            } else if (L < 2048) {
              if ((F -= 2) < 0) break;
              rt.push(L >> 6 | 192, 63 & L | 128);
            } else if (L < 65536) {
              if ((F -= 3) < 0) break;
              rt.push(L >> 12 | 224, L >> 6 & 63 | 128, 63 & L | 128);
            } else {
              if (!(L < 1114112)) throw new Error("Invalid code point");
              if ((F -= 4) < 0) break;
              rt.push(L >> 18 | 240, L >> 12 & 63 | 128, L >> 6 & 63 | 128, 63 & L | 128);
            }
          }
          return rt;
        }
        function bt(C) {
          return u.toByteArray(function(F) {
            if ((F = function(L) {
              return L.trim ? L.trim() : L.replace(/^\s+|\s+$/g, "");
            }(F).replace(pt, "")).length < 2) return "";
            for (; F.length % 4 != 0; ) F += "=";
            return F;
          }(C));
        }
        function wt(C, F, L, K) {
          for (var X = 0; X < K && !(X + L >= F.length || X >= C.length); ++X) F[X + L] = C[X];
          return X;
        }
      }).call(this, t(144));
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return c;
      });
      var s = t(108);
      function u(n, a, i, e, k, O, m) {
        try {
          var _ = n[O](m), d = _.value;
        } catch (S) {
          return void i(S);
        }
        _.done ? a(d) : Promise.resolve(d).then(e, k);
      }
      function P(n) {
        return function() {
          var a = this, i = arguments;
          return new Promise(function(e, k) {
            var O = n.apply(a, i);
            function m(d) {
              u(O, e, k, m, _, "next", d);
            }
            function _(d) {
              u(O, e, k, m, _, "throw", d);
            }
            m(void 0);
          });
        };
      }
      class c {
        static get({ fs: a, gitdir: i }) {
          return P(function* () {
            const e = yield a.read(`${i}/config`, { encoding: "utf8" });
            return s.a.from(e);
          })();
        }
        static save({ fs: a, gitdir: i, config: e }) {
          return P(function* () {
            yield a.write(`${i}/config`, e.toString(), { encoding: "utf8" });
          })();
        }
      }
    }, function(N, h, t) {
      (function(s) {
        t.d(h, "a", function() {
          return e;
        });
        var u = t(4), P = t(46), c = t(61), n = t(131);
        function a(k) {
          switch (k) {
            case "040000":
              return "tree";
            case "100644":
            case "100755":
            case "120000":
              return "blob";
            case "160000":
              return "commit";
          }
          throw new u.a(`Unexpected GitTree entry mode: ${k}`);
        }
        function i(k) {
          return !k.oid && k.sha && (k.oid = k.sha), k.mode = function(O) {
            if (typeof O == "number" && (O = O.toString(8)), O.match(/^0?4.*/)) return "040000";
            if (O.match(/^1006.*/)) return "100644";
            if (O.match(/^1007.*/)) return "100755";
            if (O.match(/^120.*/)) return "120000";
            if (O.match(/^160.*/)) return "160000";
            throw new u.a(`Could not understand file mode: ${O}`);
          }(k.mode), k.type || (k.type = a(k.mode)), k;
        }
        class e {
          constructor(O) {
            if (s.isBuffer(O)) this._entries = function(m) {
              const _ = [];
              let d = 0;
              for (; d < m.length; ) {
                const S = m.indexOf(32, d);
                if (S === -1) throw new u.a(`GitTree: Error parsing buffer at byte location ${d}: Could not find the next space character.`);
                const x = m.indexOf(0, d);
                if (x === -1) throw new u.a(`GitTree: Error parsing buffer at byte location ${d}: Could not find the next null character.`);
                let A = m.slice(d, S).toString("utf8");
                A === "40000" && (A = "040000");
                const f = a(A), E = m.slice(S + 1, x).toString("utf8");
                if (E.includes("\\") || E.includes("/")) throw new P.a(E);
                const w = m.slice(x + 1, x + 21).toString("hex");
                d = x + 21, _.push({ mode: A, path: E, oid: w, type: f });
              }
              return _;
            }(O);
            else {
              if (!Array.isArray(O)) throw new u.a("invalid type passed to GitTree constructor");
              this._entries = O.map(i);
            }
            this._entries.sort(c.a);
          }
          static from(O) {
            return new e(O);
          }
          render() {
            return this._entries.map((O) => `${O.mode} ${O.type} ${O.oid}    ${O.path}`).join(`
`);
          }
          toObject() {
            const O = [...this._entries];
            return O.sort(n.a), s.concat(O.map((m) => {
              const _ = s.from(m.mode.replace(/^0/, "")), d = s.from(" "), S = s.from(m.path, "utf8"), x = s.from([0]), A = s.from(m.oid, "hex");
              return s.concat([_, d, S, x, A]);
            }));
          }
          entries() {
            return this._entries;
          }
          *[Symbol.iterator]() {
            for (const O of this._entries) yield O;
          }
        }
      }).call(this, t(10).Buffer);
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return _;
      });
      var s = t(33), u = t.n(s), P = t(76), c = t(106), n = t(69);
      function a(d, S, x, A, f, E, w) {
        try {
          var I = d[E](w), T = I.value;
        } catch (M) {
          return void x(M);
        }
        I.done ? S(T) : Promise.resolve(T).then(A, f);
      }
      function i(d) {
        return function() {
          var S = this, x = arguments;
          return new Promise(function(A, f) {
            var E = d.apply(S, x);
            function w(T) {
              a(E, A, f, w, I, "next", T);
            }
            function I(T) {
              a(E, A, f, w, I, "throw", T);
            }
            w(void 0);
          });
        };
      }
      let e = null;
      const k = Symbol("IndexCache");
      function O() {
        return (O = i(function* (d, S, x) {
          const A = yield d.lstat(S), f = yield d.read(S), E = yield c.a.from(f);
          x.map.set(S, E), x.stats.set(S, A);
        })).apply(this, arguments);
      }
      function m() {
        return (m = i(function* (d, S, x) {
          const A = x.stats.get(S);
          if (A === void 0) return !0;
          const f = yield d.lstat(S);
          return A !== null && f !== null && Object(n.a)(A, f);
        })).apply(this, arguments);
      }
      class _ {
        static acquire({ fs: S, gitdir: x, cache: A, allowUnmerged: f = !0 }, E) {
          return i(function* () {
            A[k] || (A[k] = { map: /* @__PURE__ */ new Map(), stats: /* @__PURE__ */ new Map() });
            const w = `${x}/index`;
            let I;
            e === null && (e = new u.a({ maxPending: 1 / 0 }));
            let T = [];
            return yield e.acquire(w, i(function* () {
              (yield function(R, U, z) {
                return m.apply(this, arguments);
              }(S, w, A[k])) && (yield function(R, U, z) {
                return O.apply(this, arguments);
              }(S, w, A[k]));
              const M = A[k].map.get(w);
              if (T = M.unmergedPaths, T.length && !f) throw new P.a(T);
              if (I = yield E(M), M._dirty) {
                const R = yield M.toObject();
                yield S.write(w, R), A[k].stats.set(w, yield S.lstat(w)), M._dirty = !1;
              }
            })), I;
          })();
        }
      }
    }, function(N, h, t) {
      (function(s) {
        t.d(h, "a", function() {
          return k;
        });
        var u = t(4), P = t(64), c = t(90), n = t(23), a = t(135), i = t(51);
        function e(O, m, _, d, S, x, A) {
          try {
            var f = O[x](A), E = f.value;
          } catch (w) {
            return void _(w);
          }
          f.done ? m(E) : Promise.resolve(E).then(d, S);
        }
        class k {
          constructor(m) {
            if (typeof m == "string") this._commit = m;
            else if (s.isBuffer(m)) this._commit = m.toString("utf8");
            else {
              if (typeof m != "object") throw new u.a("invalid type passed to GitCommit constructor");
              this._commit = k.render(m);
            }
          }
          static fromPayloadSignature({ payload: m, signature: _ }) {
            const d = k.justHeaders(m), S = k.justMessage(m), x = Object(n.a)(d + `
gpgsig` + Object(c.a)(_) + `
` + S);
            return new k(x);
          }
          static from(m) {
            return new k(m);
          }
          toObject() {
            return s.from(this._commit, "utf8");
          }
          headers() {
            return this.parseHeaders();
          }
          message() {
            return k.justMessage(this._commit);
          }
          parse() {
            return Object.assign({ message: this.message() }, this.headers());
          }
          static justMessage(m) {
            return Object(n.a)(m.slice(m.indexOf(`

`) + 2));
          }
          static justHeaders(m) {
            return m.slice(0, m.indexOf(`

`));
          }
          parseHeaders() {
            const m = k.justHeaders(this._commit).split(`
`), _ = [];
            for (const S of m) S[0] === " " ? _[_.length - 1] += `
` + S.slice(1) : _.push(S);
            const d = { parent: [] };
            for (const S of _) {
              const x = S.slice(0, S.indexOf(" ")), A = S.slice(S.indexOf(" ") + 1);
              Array.isArray(d[x]) ? d[x].push(A) : d[x] = A;
            }
            return d.author && (d.author = Object(i.a)(d.author)), d.committer && (d.committer = Object(i.a)(d.committer)), d;
          }
          static renderHeaders(m) {
            let _ = "";
            if (m.tree ? _ += `tree ${m.tree}
` : _ += `tree 4b825dc642cb6eb9a060e54bf8d69288fbee4904
`, m.parent) {
              if (m.parent.length === void 0) throw new u.a("commit 'parent' property should be an array");
              for (const x of m.parent) _ += `parent ${x}
`;
            }
            const d = m.author;
            _ += `author ${Object(P.a)(d)}
`;
            const S = m.committer || m.author;
            return _ += `committer ${Object(P.a)(S)}
`, m.gpgsig && (_ += "gpgsig" + Object(c.a)(m.gpgsig)), _;
          }
          static render(m) {
            return k.renderHeaders(m) + `
` + Object(n.a)(m.message);
          }
          render() {
            return this._commit;
          }
          withoutSignature() {
            const m = Object(n.a)(this._commit);
            if (m.indexOf(`
gpgsig`) === -1) return m;
            const _ = m.slice(0, m.indexOf(`
gpgsig`)), d = m.slice(m.indexOf(`-----END PGP SIGNATURE-----
`) + 28);
            return Object(n.a)(_ + `
` + d);
          }
          isolateSignature() {
            const m = this._commit.slice(this._commit.indexOf("-----BEGIN PGP SIGNATURE-----"), this._commit.indexOf("-----END PGP SIGNATURE-----") + 27);
            return Object(a.a)(m);
          }
          static sign(m, _, d) {
            return (S = function* () {
              const x = m.withoutSignature(), A = k.justMessage(m._commit);
              let { signature: f } = yield _({ payload: x, secretKey: d });
              f = Object(n.a)(f);
              const E = k.justHeaders(m._commit) + `
gpgsig` + Object(c.a)(f) + `
` + A;
              return k.from(E);
            }, function() {
              var x = this, A = arguments;
              return new Promise(function(f, E) {
                var w = S.apply(x, A);
                function I(M) {
                  e(w, f, E, I, T, "next", M);
                }
                function T(M) {
                  e(w, f, E, I, T, "throw", M);
                }
                I(void 0);
              });
            })();
            var S;
          }
        }
      }).call(this, t(10).Buffer);
    }, function(N, h, t) {
      (function(s) {
        t.d(h, "a", function() {
          return e;
        });
        var u = t(25), P = t(138), c = t(84), n = t(19);
        function a(O, m, _, d, S, x, A) {
          try {
            var f = O[x](A), E = f.value;
          } catch (w) {
            return void _(w);
          }
          f.done ? m(E) : Promise.resolve(E).then(d, S);
        }
        function i(O) {
          return function() {
            var m = this, _ = arguments;
            return new Promise(function(d, S) {
              var x = O.apply(m, _);
              function A(E) {
                a(x, d, S, A, f, "next", E);
              }
              function f(E) {
                a(x, d, S, A, f, "throw", E);
              }
              A(void 0);
            });
          };
        }
        function e(O) {
          return k.apply(this, arguments);
        }
        function k() {
          return (k = i(function* ({ fs: O, gitdir: m, type: _, object: d, format: S = "content", oid: x, dryRun: A = !1 }) {
            return S !== "deflated" && (S !== "wrapped" && (d = u.a.wrap({ type: _, object: d })), x = yield Object(n.a)(d), d = s.from(yield Object(c.a)(d))), A || (yield Object(P.a)({ fs: O, gitdir: m, object: d, format: "deflated", oid: x })), x;
          })).apply(this, arguments);
        }
      }).call(this, t(10).Buffer);
    }, function(N, h, t) {
      (function(s) {
        function u(n) {
          if (typeof n != "string") throw new TypeError("Path must be a string. Received " + JSON.stringify(n));
        }
        function P(n, a) {
          for (var i, e = "", k = 0, O = -1, m = 0, _ = 0; _ <= n.length; ++_) {
            if (_ < n.length) i = n.charCodeAt(_);
            else {
              if (i === 47) break;
              i = 47;
            }
            if (i === 47) {
              if (!(O === _ - 1 || m === 1)) if (O !== _ - 1 && m === 2) {
                if (e.length < 2 || k !== 2 || e.charCodeAt(e.length - 1) !== 46 || e.charCodeAt(e.length - 2) !== 46) {
                  if (e.length > 2) {
                    var d = e.lastIndexOf("/");
                    if (d !== e.length - 1) {
                      d === -1 ? (e = "", k = 0) : k = (e = e.slice(0, d)).length - 1 - e.lastIndexOf("/"), O = _, m = 0;
                      continue;
                    }
                  } else if (e.length === 2 || e.length === 1) {
                    e = "", k = 0, O = _, m = 0;
                    continue;
                  }
                }
                a && (e.length > 0 ? e += "/.." : e = "..", k = 2);
              } else e.length > 0 ? e += "/" + n.slice(O + 1, _) : e = n.slice(O + 1, _), k = _ - O - 1;
              O = _, m = 0;
            } else i === 46 && m !== -1 ? ++m : m = -1;
          }
          return e;
        }
        var c = { resolve: function() {
          for (var n, a = "", i = !1, e = arguments.length - 1; e >= -1 && !i; e--) {
            var k;
            e >= 0 ? k = arguments[e] : (n === void 0 && (n = s.cwd()), k = n), u(k), k.length !== 0 && (a = k + "/" + a, i = k.charCodeAt(0) === 47);
          }
          return a = P(a, !i), i ? a.length > 0 ? "/" + a : "/" : a.length > 0 ? a : ".";
        }, normalize: function(n) {
          if (u(n), n.length === 0) return ".";
          var a = n.charCodeAt(0) === 47, i = n.charCodeAt(n.length - 1) === 47;
          return (n = P(n, !a)).length !== 0 || a || (n = "."), n.length > 0 && i && (n += "/"), a ? "/" + n : n;
        }, isAbsolute: function(n) {
          return u(n), n.length > 0 && n.charCodeAt(0) === 47;
        }, join: function() {
          if (arguments.length === 0) return ".";
          for (var n, a = 0; a < arguments.length; ++a) {
            var i = arguments[a];
            u(i), i.length > 0 && (n === void 0 ? n = i : n += "/" + i);
          }
          return n === void 0 ? "." : c.normalize(n);
        }, relative: function(n, a) {
          if (u(n), u(a), n === a || (n = c.resolve(n)) === (a = c.resolve(a))) return "";
          for (var i = 1; i < n.length && n.charCodeAt(i) === 47; ++i) ;
          for (var e = n.length, k = e - i, O = 1; O < a.length && a.charCodeAt(O) === 47; ++O) ;
          for (var m = a.length - O, _ = k < m ? k : m, d = -1, S = 0; S <= _; ++S) {
            if (S === _) {
              if (m > _) {
                if (a.charCodeAt(O + S) === 47) return a.slice(O + S + 1);
                if (S === 0) return a.slice(O + S);
              } else k > _ && (n.charCodeAt(i + S) === 47 ? d = S : S === 0 && (d = 0));
              break;
            }
            var x = n.charCodeAt(i + S);
            if (x !== a.charCodeAt(O + S)) break;
            x === 47 && (d = S);
          }
          var A = "";
          for (S = i + d + 1; S <= e; ++S) S !== e && n.charCodeAt(S) !== 47 || (A.length === 0 ? A += ".." : A += "/..");
          return A.length > 0 ? A + a.slice(O + d) : (O += d, a.charCodeAt(O) === 47 && ++O, a.slice(O));
        }, _makeLong: function(n) {
          return n;
        }, dirname: function(n) {
          if (u(n), n.length === 0) return ".";
          for (var a = n.charCodeAt(0), i = a === 47, e = -1, k = !0, O = n.length - 1; O >= 1; --O) if ((a = n.charCodeAt(O)) === 47) {
            if (!k) {
              e = O;
              break;
            }
          } else k = !1;
          return e === -1 ? i ? "/" : "." : i && e === 1 ? "//" : n.slice(0, e);
        }, basename: function(n, a) {
          if (a !== void 0 && typeof a != "string") throw new TypeError('"ext" argument must be a string');
          u(n);
          var i, e = 0, k = -1, O = !0;
          if (a !== void 0 && a.length > 0 && a.length <= n.length) {
            if (a.length === n.length && a === n) return "";
            var m = a.length - 1, _ = -1;
            for (i = n.length - 1; i >= 0; --i) {
              var d = n.charCodeAt(i);
              if (d === 47) {
                if (!O) {
                  e = i + 1;
                  break;
                }
              } else _ === -1 && (O = !1, _ = i + 1), m >= 0 && (d === a.charCodeAt(m) ? --m == -1 && (k = i) : (m = -1, k = _));
            }
            return e === k ? k = _ : k === -1 && (k = n.length), n.slice(e, k);
          }
          for (i = n.length - 1; i >= 0; --i) if (n.charCodeAt(i) === 47) {
            if (!O) {
              e = i + 1;
              break;
            }
          } else k === -1 && (O = !1, k = i + 1);
          return k === -1 ? "" : n.slice(e, k);
        }, extname: function(n) {
          u(n);
          for (var a = -1, i = 0, e = -1, k = !0, O = 0, m = n.length - 1; m >= 0; --m) {
            var _ = n.charCodeAt(m);
            if (_ !== 47) e === -1 && (k = !1, e = m + 1), _ === 46 ? a === -1 ? a = m : O !== 1 && (O = 1) : a !== -1 && (O = -1);
            else if (!k) {
              i = m + 1;
              break;
            }
          }
          return a === -1 || e === -1 || O === 0 || O === 1 && a === e - 1 && a === i + 1 ? "" : n.slice(a, e);
        }, format: function(n) {
          if (n === null || typeof n != "object") throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof n);
          return function(a, i) {
            var e = i.dir || i.root, k = i.base || (i.name || "") + (i.ext || "");
            return e ? e === i.root ? e + k : e + a + k : k;
          }("/", n);
        }, parse: function(n) {
          u(n);
          var a = { root: "", dir: "", base: "", ext: "", name: "" };
          if (n.length === 0) return a;
          var i, e = n.charCodeAt(0), k = e === 47;
          k ? (a.root = "/", i = 1) : i = 0;
          for (var O = -1, m = 0, _ = -1, d = !0, S = n.length - 1, x = 0; S >= i; --S) if ((e = n.charCodeAt(S)) !== 47) _ === -1 && (d = !1, _ = S + 1), e === 46 ? O === -1 ? O = S : x !== 1 && (x = 1) : O !== -1 && (x = -1);
          else if (!d) {
            m = S + 1;
            break;
          }
          return O === -1 || _ === -1 || x === 0 || x === 1 && O === _ - 1 && O === m + 1 ? _ !== -1 && (a.base = a.name = m === 0 && k ? n.slice(1, _) : n.slice(m, _)) : (m === 0 && k ? (a.name = n.slice(1, O), a.base = n.slice(1, _)) : (a.name = n.slice(m, O), a.base = n.slice(m, _)), a.ext = n.slice(O, _)), m > 0 ? a.dir = n.slice(0, m - 1) : k && (a.dir = "/"), a;
        }, sep: "/", delimiter: ":", win32: null, posix: null };
        c.posix = c, N.exports = c;
      }).call(this, t(92));
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor(c, n, a, i) {
          super(`Object ${c} ${i ? `at ${i}` : ""}was anticipated to be a ${a} but it is a ${n}.`), this.code = this.name = u.code, this.data = { oid: c, actual: n, expected: a, filepath: i };
        }
      }
      u.code = "ObjectTypeError";
    }, function(N, h, t) {
      (function(s) {
        t.d(h, "a", function() {
          return i;
        });
        var u = t(4), P = t(64), c = t(23), n = t(51);
        function a(e, k, O, m, _, d, S) {
          try {
            var x = e[d](S), A = x.value;
          } catch (f) {
            return void O(f);
          }
          x.done ? k(A) : Promise.resolve(A).then(m, _);
        }
        class i {
          constructor(k) {
            if (typeof k == "string") this._tag = k;
            else if (s.isBuffer(k)) this._tag = k.toString("utf8");
            else {
              if (typeof k != "object") throw new u.a("invalid type passed to GitAnnotatedTag constructor");
              this._tag = i.render(k);
            }
          }
          static from(k) {
            return new i(k);
          }
          static render(k) {
            return `object ${k.object}
type ${k.type}
tag ${k.tag}
tagger ${Object(P.a)(k.tagger)}

${k.message}
${k.gpgsig ? k.gpgsig : ""}`;
          }
          justHeaders() {
            return this._tag.slice(0, this._tag.indexOf(`

`));
          }
          message() {
            const k = this.withoutSignature();
            return k.slice(k.indexOf(`

`) + 2);
          }
          parse() {
            return Object.assign(this.headers(), { message: this.message(), gpgsig: this.gpgsig() });
          }
          render() {
            return this._tag;
          }
          headers() {
            const k = this.justHeaders().split(`
`), O = [];
            for (const _ of k) _[0] === " " ? O[O.length - 1] += `
` + _.slice(1) : O.push(_);
            const m = {};
            for (const _ of O) {
              const d = _.slice(0, _.indexOf(" ")), S = _.slice(_.indexOf(" ") + 1);
              Array.isArray(m[d]) ? m[d].push(S) : m[d] = S;
            }
            return m.tagger && (m.tagger = Object(n.a)(m.tagger)), m.committer && (m.committer = Object(n.a)(m.committer)), m;
          }
          withoutSignature() {
            const k = Object(c.a)(this._tag);
            return k.indexOf(`
-----BEGIN PGP SIGNATURE-----`) === -1 ? k : k.slice(0, k.lastIndexOf(`
-----BEGIN PGP SIGNATURE-----`));
          }
          gpgsig() {
            if (this._tag.indexOf(`
-----BEGIN PGP SIGNATURE-----`) === -1) return;
            const k = this._tag.slice(this._tag.indexOf("-----BEGIN PGP SIGNATURE-----"), this._tag.indexOf("-----END PGP SIGNATURE-----") + 27);
            return Object(c.a)(k);
          }
          payload() {
            return this.withoutSignature() + `
`;
          }
          toObject() {
            return s.from(this._tag, "utf8");
          }
          static sign(k, O, m) {
            return (_ = function* () {
              const d = k.payload();
              let { signature: S } = yield O({ payload: d, secretKey: m });
              S = Object(c.a)(S);
              const x = d + S;
              return i.from(x);
            }, function() {
              var d = this, S = arguments;
              return new Promise(function(x, A) {
                var f = _.apply(d, S);
                function E(I) {
                  a(f, x, A, E, w, "next", I);
                }
                function w(I) {
                  a(f, x, A, E, w, "throw", I);
                }
                E(void 0);
              });
            })();
            var _;
          }
        }
      }).call(this, t(10).Buffer);
    }, function(N, h, t) {
      var s = t(78), u = t.n(s);
      function P(S) {
        let x = "";
        for (const A of new Uint8Array(S)) A < 16 && (x += "0"), x += A.toString(16);
        return x;
      }
      function c(S, x, A, f, E, w, I) {
        try {
          var T = S[w](I), M = T.value;
        } catch (R) {
          return void A(R);
        }
        T.done ? x(M) : Promise.resolve(M).then(f, E);
      }
      function n(S) {
        return function() {
          var x = this, A = arguments;
          return new Promise(function(f, E) {
            var w = S.apply(x, A);
            function I(M) {
              c(w, f, E, I, T, "next", M);
            }
            function T(M) {
              c(w, f, E, I, T, "throw", M);
            }
            I(void 0);
          });
        };
      }
      t.d(h, "a", function() {
        return i;
      });
      let a = null;
      function i(S) {
        return e.apply(this, arguments);
      }
      function e() {
        return (e = n(function* (S) {
          return a === null && (a = yield _()), a ? O(S) : k(S);
        })).apply(this, arguments);
      }
      function k(S) {
        return new u.a().update(S).digest("hex");
      }
      function O(S) {
        return m.apply(this, arguments);
      }
      function m() {
        return (m = n(function* (S) {
          return P(yield crypto.subtle.digest("SHA-1", S));
        })).apply(this, arguments);
      }
      function _() {
        return d.apply(this, arguments);
      }
      function d() {
        return (d = n(function* () {
          try {
            if ((yield O(new Uint8Array([]))) === "da39a3ee5e6b4b0d3255bfef95601890afd80709") return !0;
          } catch {
          }
          return !1;
        })).apply(this, arguments);
      }
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return s;
      });
      class s {
        constructor(P) {
          this.buffer = P, this._start = 0;
        }
        eof() {
          return this._start >= this.buffer.length;
        }
        tell() {
          return this._start;
        }
        seek(P) {
          this._start = P;
        }
        slice(P) {
          const c = this.buffer.slice(this._start, this._start + P);
          return this._start += P, c;
        }
        toString(P, c) {
          const n = this.buffer.toString(P, this._start, this._start + c);
          return this._start += c, n;
        }
        write(P, c, n) {
          const a = this.buffer.write(P, this._start, c, n);
          return this._start += c, a;
        }
        copy(P, c, n) {
          const a = P.copy(this.buffer, this._start, c, n);
          return this._start += a, a;
        }
        readUInt8() {
          const P = this.buffer.readUInt8(this._start);
          return this._start += 1, P;
        }
        writeUInt8(P) {
          const c = this.buffer.writeUInt8(P, this._start);
          return this._start += 1, c;
        }
        readUInt16BE() {
          const P = this.buffer.readUInt16BE(this._start);
          return this._start += 2, P;
        }
        writeUInt16BE(P) {
          const c = this.buffer.writeUInt16BE(P, this._start);
          return this._start += 2, c;
        }
        readUInt32BE() {
          const P = this.buffer.readUInt32BE(this._start);
          return this._start += 4, P;
        }
        writeUInt32BE(P) {
          const c = this.buffer.writeUInt32BE(P, this._start);
          return this._start += 4, c;
        }
      }
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor(c) {
          super(`No name was provided for ${c} in the argument or in the .git/config file.`), this.code = this.name = u.code, this.data = { role: c };
        }
      }
      u.code = "MissingNameError";
    }, function(N, h, t) {
      var s = t(8), u = t(17), P = t(3), c = t(12), n = t(7), a = t(16), i = t(79), e = t(47);
      function k(S, x, A, f, E, w, I) {
        try {
          var T = S[w](I), M = T.value;
        } catch (R) {
          return void A(R);
        }
        T.done ? x(M) : Promise.resolve(M).then(f, E);
      }
      function O(S) {
        return function() {
          var x = this, A = arguments;
          return new Promise(function(f, E) {
            var w = S.apply(x, A);
            function I(M) {
              k(w, f, E, I, T, "next", M);
            }
            function T(M) {
              k(w, f, E, I, T, "throw", M);
            }
            I(void 0);
          });
        };
      }
      class m {
        constructor({ fs: x, gitdir: A, ref: f, cache: E }) {
          var w = this;
          this.fs = x, this.cache = E, this.gitdir = A, this.mapPromise = O(function* () {
            const T = /* @__PURE__ */ new Map();
            let M;
            try {
              M = yield P.a.resolve({ fs: x, gitdir: A, ref: f });
            } catch (U) {
              U instanceof s.a && (M = "4b825dc642cb6eb9a060e54bf8d69288fbee4904");
            }
            const R = yield Object(e.a)({ fs: x, cache: w.cache, gitdir: A, oid: M });
            return R.type = "tree", R.mode = "40000", T.set(".", R), T;
          })();
          const I = this;
          this.ConstructEntry = class {
            constructor(T) {
              this._fullpath = T, this._type = !1, this._mode = !1, this._stat = !1, this._content = !1, this._oid = !1;
            }
            type() {
              var T = this;
              return O(function* () {
                return I.type(T);
              })();
            }
            mode() {
              var T = this;
              return O(function* () {
                return I.mode(T);
              })();
            }
            stat() {
              var T = this;
              return O(function* () {
                return I.stat(T);
              })();
            }
            content() {
              var T = this;
              return O(function* () {
                return I.content(T);
              })();
            }
            oid() {
              var T = this;
              return O(function* () {
                return I.oid(T);
              })();
            }
          };
        }
        readdir(x) {
          var A = this;
          return O(function* () {
            const f = x._fullpath, { fs: E, cache: w, gitdir: I } = A, T = yield A.mapPromise, M = T.get(f);
            if (!M) throw new Error(`No obj for ${f}`);
            const R = M.oid;
            if (!R) throw new Error(`No oid for obj ${JSON.stringify(M)}`);
            if (M.type !== "tree") return null;
            const { type: U, object: z } = yield Object(n.a)({ fs: E, cache: w, gitdir: I, oid: R });
            if (U !== M.type) throw new u.a(R, U, M.type);
            const $ = c.a.from(z);
            for (const H of $) T.set(Object(a.join)(f, H.path), H);
            return $.entries().map((H) => Object(a.join)(f, H.path));
          })();
        }
        type(x) {
          var A = this;
          return O(function* () {
            if (x._type === !1) {
              const f = yield A.mapPromise, { type: E } = f.get(x._fullpath);
              x._type = E;
            }
            return x._type;
          })();
        }
        mode(x) {
          var A = this;
          return O(function* () {
            if (x._mode === !1) {
              const f = yield A.mapPromise, { mode: E } = f.get(x._fullpath);
              x._mode = Object(i.a)(parseInt(E, 8));
            }
            return x._mode;
          })();
        }
        stat(x) {
          return O(function* () {
          })();
        }
        content(x) {
          var A = this;
          return O(function* () {
            if (x._content === !1) {
              const f = yield A.mapPromise, { fs: E, cache: w, gitdir: I } = A, T = f.get(x._fullpath).oid, { type: M, object: R } = yield Object(n.a)({ fs: E, cache: w, gitdir: I, oid: T });
              x._content = M !== "blob" ? void 0 : new Uint8Array(R);
            }
            return x._content;
          })();
        }
        oid(x) {
          var A = this;
          return O(function* () {
            if (x._oid === !1) {
              const f = (yield A.mapPromise).get(x._fullpath);
              x._oid = f.oid;
            }
            return x._oid;
          })();
        }
      }
      var _ = t(37);
      function d({ ref: S = "HEAD" } = {}) {
        const x = /* @__PURE__ */ Object.create(null);
        return Object.defineProperty(x, _.a, { value: function({ fs: A, gitdir: f, cache: E }) {
          return new m({ fs: A, gitdir: f, ref: S, cache: E });
        } }), Object.freeze(x), x;
      }
      t.d(h, "a", function() {
        return d;
      });
    }, function(N, h, t) {
      function s(u) {
        return u = (u = (u = u.replace(/\r/g, "")).replace(/^\n+/, "")).replace(/\n+$/, "") + `
`;
      }
      t.d(h, "a", function() {
        return s;
      });
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor(c) {
          super(`The function requires a "${c}" parameter but none was provided.`), this.code = this.name = u.code, this.data = { parameter: c };
        }
      }
      u.code = "MissingParameterError";
    }, function(N, h, t) {
      (function(s) {
        t.d(h, "a", function() {
          return P;
        });
        var u = t(4);
        class P {
          static wrap({ type: n, object: a }) {
            return s.concat([s.from(`${n} ${a.byteLength.toString()}\0`), s.from(a)]);
          }
          static unwrap(n) {
            const a = n.indexOf(32), i = n.indexOf(0), e = n.slice(0, a).toString("utf8"), k = n.slice(a + 1, i).toString("utf8"), O = n.length - (i + 1);
            if (parseInt(k) !== O) throw new u.a(`Length mismatch: expected ${k} bytes but got ${O} instead.`);
            return { type: e, object: s.from(n.slice(i + 1)) };
          }
        }
      }).call(this, t(10).Buffer);
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor(c, n, a = !0) {
          super(`Failed to create ${c} at ${n} because it already exists.${a ? ` (Hint: use 'force: true' parameter to overwrite existing ${c}.)` : ""}`), this.code = this.name = u.code, this.data = { noun: c, where: n, canForce: a };
        }
      }
      u.code = "AlreadyExistsError";
    }, function(N, h, t) {
      function s(u) {
        const P = Math.max(u.lastIndexOf("/"), u.lastIndexOf("\\"));
        return P === -1 ? "." : P === 0 ? "/" : u.slice(0, P);
      }
      t.d(h, "a", function() {
        return s;
      });
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor(c, n) {
          super(`"${c}" would be an invalid git reference. (Hint: a valid alternative would be "${n}".)`), this.code = this.name = u.code, this.data = { ref: c, suggestion: n };
        }
      }
      u.code = "InvalidRefNameError";
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return n;
      });
      var s = t(41), u = t(85);
      function P(i, e, k, O, m, _, d) {
        try {
          var S = i[_](d), x = S.value;
        } catch (A) {
          return void k(A);
        }
        S.done ? e(x) : Promise.resolve(x).then(O, m);
      }
      function c(i) {
        return function() {
          var e = this, k = arguments;
          return new Promise(function(O, m) {
            var _ = i.apply(e, k);
            function d(x) {
              P(_, O, m, d, S, "next", x);
            }
            function S(x) {
              P(_, O, m, d, S, "throw", x);
            }
            d(void 0);
          });
        };
      }
      function n(i) {
        return a.apply(this, arguments);
      }
      function a() {
        return (a = c(function* ({ fs: i, gitdir: e, author: k, commit: O }) {
          const m = Math.floor(Date.now() / 1e3), _ = { name: yield Object(s.a)({ fs: i, gitdir: e, path: "user.name" }), email: (yield Object(s.a)({ fs: i, gitdir: e, path: "user.email" })) || "", timestamp: m, timezoneOffset: new Date(1e3 * m).getTimezoneOffset() }, d = Object(u.a)({}, _, O ? O.author : void 0, k);
          if (d.name !== void 0) return d;
        })).apply(this, arguments);
      }
    }, function(N, h, t) {
      function s(O, m) {
        const _ = m - O;
        return Array.from({ length: _ }, (d, S) => O + S);
      }
      var u = t(114), P = t(37);
      class c {
        constructor() {
          this.value = null;
        }
        consider(m) {
          m != null && (this.value === null ? this.value = m : m < this.value && (this.value = m));
        }
        reset() {
          this.value = null;
        }
      }
      function* n(O) {
        const m = new c();
        let _;
        const d = [], S = O.length;
        for (let x = 0; x < S; x++) d[x] = O[x].next().value, d[x] !== void 0 && m.consider(d[x]);
        if (m.value !== null) for (; ; ) {
          const x = [];
          _ = m.value, m.reset();
          for (let A = 0; A < S; A++) d[A] !== void 0 && d[A] === _ ? (x[A] = d[A], d[A] = O[A].next().value) : x[A] = null, d[A] !== void 0 && m.consider(d[A]);
          if (yield x, m.value === null) return;
        }
      }
      function a(O, m, _, d, S, x, A) {
        try {
          var f = O[x](A), E = f.value;
        } catch (w) {
          return void _(w);
        }
        f.done ? m(E) : Promise.resolve(E).then(d, S);
      }
      function i(O) {
        return function() {
          var m = this, _ = arguments;
          return new Promise(function(d, S) {
            var x = O.apply(m, _);
            function A(E) {
              a(x, d, S, A, f, "next", E);
            }
            function f(E) {
              a(x, d, S, A, f, "throw", E);
            }
            A(void 0);
          });
        };
      }
      function e(O) {
        return k.apply(this, arguments);
      }
      function k() {
        return (k = i(function* ({ fs: O, cache: m, dir: _, gitdir: d, trees: S, map: x = function() {
          var E = i(function* (w, I) {
            return I;
          });
          return function(w, I) {
            return E.apply(this, arguments);
          };
        }(), reduce: A = function() {
          var E = i(function* (w, I) {
            const T = Object(u.a)(I);
            return w !== void 0 && T.unshift(w), T;
          });
          return function(w, I) {
            return E.apply(this, arguments);
          };
        }(), iterate: f = (E, w) => Promise.all([...w].map(E)) }) {
          const E = S.map((R) => R[P.a]({ fs: O, dir: _, gitdir: d, cache: m })), w = new Array(E.length).fill("."), I = s(0, E.length), T = function() {
            var R = i(function* (U) {
              I.map(($) => {
                U[$] = U[$] && new E[$].ConstructEntry(U[$]);
              });
              const z = (yield Promise.all(I.map(($) => U[$] ? E[$].readdir(U[$]) : []))).map(($) => $ === null ? [] : $).map(($) => $[Symbol.iterator]());
              return { entries: U, children: n(z) };
            });
            return function(U) {
              return R.apply(this, arguments);
            };
          }(), M = function() {
            var R = i(function* (U) {
              const { entries: z, children: $ } = yield T(U), H = z.find((ot) => ot && ot._fullpath)._fullpath, nt = yield x(H, z);
              if (nt !== null) {
                let ot = yield f(M, $);
                return ot = ot.filter((V) => V !== void 0), A(nt, ot);
              }
            });
            return function(U) {
              return R.apply(this, arguments);
            };
          }();
          return M(w);
        })).apply(this, arguments);
      }
      t.d(h, "a", function() {
        return e;
      });
    }, function(N, h, t) {
      var s = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
      function u(n, a) {
        return Object.prototype.hasOwnProperty.call(n, a);
      }
      h.assign = function(n) {
        for (var a = Array.prototype.slice.call(arguments, 1); a.length; ) {
          var i = a.shift();
          if (i) {
            if (typeof i != "object") throw new TypeError(i + "must be non-object");
            for (var e in i) u(i, e) && (n[e] = i[e]);
          }
        }
        return n;
      }, h.shrinkBuf = function(n, a) {
        return n.length === a ? n : n.subarray ? n.subarray(0, a) : (n.length = a, n);
      };
      var P = { arraySet: function(n, a, i, e, k) {
        if (a.subarray && n.subarray) n.set(a.subarray(i, i + e), k);
        else for (var O = 0; O < e; O++) n[k + O] = a[i + O];
      }, flattenChunks: function(n) {
        var a, i, e, k, O, m;
        for (e = 0, a = 0, i = n.length; a < i; a++) e += n[a].length;
        for (m = new Uint8Array(e), k = 0, a = 0, i = n.length; a < i; a++) O = n[a], m.set(O, k), k += O.length;
        return m;
      } }, c = { arraySet: function(n, a, i, e, k) {
        for (var O = 0; O < e; O++) n[k + O] = a[i + O];
      }, flattenChunks: function(n) {
        return [].concat.apply([], n);
      } };
      h.setTyped = function(n) {
        n ? (h.Buf8 = Uint8Array, h.Buf16 = Uint16Array, h.Buf32 = Int32Array, h.assign(h, P)) : (h.Buf8 = Array, h.Buf16 = Array, h.Buf32 = Array, h.assign(h, c));
      }, h.setTyped(s);
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor(c) {
          super(`Expected a 40-char hex object id but saw "${c}".`), this.code = this.name = u.code, this.data = { value: c };
        }
      }
      u.code = "InvalidOidError";
    }, function(N, h, t) {
      N.exports = t(143);
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return P;
      });
      var s = t(79);
      function u(c, n, a, i) {
        if (c !== void 0 && n !== void 0) return [c, n];
        a === void 0 && (a = i.valueOf());
        const e = Math.floor(a / 1e3);
        return [e, 1e6 * (a - 1e3 * e)];
      }
      function P(c) {
        const [n, a] = u(c.ctimeSeconds, c.ctimeNanoseconds, c.ctimeMs, c.ctime), [i, e] = u(c.mtimeSeconds, c.mtimeNanoseconds, c.mtimeMs, c.mtime);
        return { ctimeSeconds: n % 2 ** 32, ctimeNanoseconds: a % 2 ** 32, mtimeSeconds: i % 2 ** 32, mtimeNanoseconds: e % 2 ** 32, dev: c.dev % 2 ** 32, ino: c.ino % 2 ** 32, mode: Object(s.a)(c.mode % 2 ** 32), uid: c.uid % 2 ** 32, gid: c.gid % 2 ** 32, size: c.size > -1 ? c.size % 2 ** 32 : 0 };
      }
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return n;
      });
      var s = t(3), u = t(66);
      function P(i, e, k, O, m, _, d) {
        try {
          var S = i[_](d), x = S.value;
        } catch (A) {
          return void k(A);
        }
        S.done ? e(x) : Promise.resolve(x).then(O, m);
      }
      function c(i) {
        return function() {
          var e = this, k = arguments;
          return new Promise(function(O, m) {
            var _ = i.apply(e, k);
            function d(x) {
              P(_, O, m, d, S, "next", x);
            }
            function S(x) {
              P(_, O, m, d, S, "throw", x);
            }
            d(void 0);
          });
        };
      }
      function n(i) {
        return a.apply(this, arguments);
      }
      function a() {
        return (a = c(function* ({ fs: i, gitdir: e, fullname: k = !1, test: O = !1 }) {
          const m = yield s.a.resolve({ fs: i, gitdir: e, ref: "HEAD", depth: 2 });
          if (O) try {
            yield s.a.resolve({ fs: i, gitdir: e, ref: m });
          } catch {
            return;
          }
          if (m.startsWith("refs/")) return k ? m : Object(u.a)(m);
        })).apply(this, arguments);
      }
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor(c, n) {
          super(`Expected "${c}" but received "${n}".`), this.code = this.name = u.code, this.data = { expected: c, actual: n };
        }
      }
      u.code = "ParseError";
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return s;
      });
      const s = Symbol("GitWalkSymbol");
    }, function(N, h, t) {
      function s(u, P) {
        return -(u < P) || +(u > P);
      }
      t.d(h, "a", function() {
        return s;
      });
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return c;
      });
      var s = t(88);
      function u(a, i, e, k, O, m, _) {
        try {
          var d = a[m](_), S = d.value;
        } catch (x) {
          return void e(x);
        }
        d.done ? i(S) : Promise.resolve(S).then(k, O);
      }
      function P(a) {
        return function() {
          var i = this, e = arguments;
          return new Promise(function(k, O) {
            var m = a.apply(i, e);
            function _(S) {
              u(m, k, O, _, d, "next", S);
            }
            function d(S) {
              u(m, k, O, _, d, "throw", S);
            }
            _(void 0);
          });
        };
      }
      function c(a, i) {
        return n.apply(this, arguments);
      }
      function n() {
        return (n = P(function* (a, i) {
          const e = Object(s.a)(a);
          for (; ; ) {
            const { value: k, done: O } = yield e.next();
            if (k && (yield i(k)), O) break;
          }
          e.return && e.return();
        })).apply(this, arguments);
      }
    }, function(N, h, t) {
      function s(u) {
        const P = Math.max(u.lastIndexOf("/"), u.lastIndexOf("\\"));
        return P > -1 && (u = u.slice(P + 1)), u;
      }
      t.d(h, "a", function() {
        return s;
      });
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return c;
      });
      var s = t(11);
      function u(a, i, e, k, O, m, _) {
        try {
          var d = a[m](_), S = d.value;
        } catch (x) {
          return void e(x);
        }
        d.done ? i(S) : Promise.resolve(S).then(k, O);
      }
      function P(a) {
        return function() {
          var i = this, e = arguments;
          return new Promise(function(k, O) {
            var m = a.apply(i, e);
            function _(S) {
              u(m, k, O, _, d, "next", S);
            }
            function d(S) {
              u(m, k, O, _, d, "throw", S);
            }
            _(void 0);
          });
        };
      }
      function c(a) {
        return n.apply(this, arguments);
      }
      function n() {
        return (n = P(function* ({ fs: a, gitdir: i, path: e }) {
          return (yield s.a.get({ fs: a, gitdir: i })).get(e);
        })).apply(this, arguments);
      }
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return i;
      });
      var s = t(137), u = t.n(s), P = t(40), c = t(27), n = t(16);
      function a(e, k, O, m, _, d, S) {
        try {
          var x = e[d](S), A = x.value;
        } catch (f) {
          return void O(f);
        }
        x.done ? k(A) : Promise.resolve(A).then(m, _);
      }
      class i {
        static isIgnored({ fs: k, dir: O, gitdir: m = Object(n.join)(O, ".git"), filepath: _ }) {
          return (d = function* () {
            if (Object(P.a)(_) === ".git") return !0;
            if (_ === ".") return !1;
            let S = "";
            const x = Object(n.join)(m, "info", "exclude");
            (yield k.exists(x)) && (S = yield k.read(x, "utf8"));
            const A = [{ gitignore: Object(n.join)(O, ".gitignore"), filepath: _ }], f = _.split("/").filter(Boolean);
            for (let w = 1; w < f.length; w++) {
              const I = f.slice(0, w).join("/"), T = f.slice(w).join("/");
              A.push({ gitignore: Object(n.join)(O, I, ".gitignore"), filepath: T });
            }
            let E = !1;
            for (const w of A) {
              let I;
              try {
                I = yield k.read(w.gitignore, "utf8");
              } catch (R) {
                if (R.code === "NOENT") continue;
              }
              const T = u()().add(S);
              T.add(I);
              const M = Object(c.a)(w.filepath);
              if (M !== "." && T.ignores(M)) return !0;
              E = E ? !T.test(w.filepath).unignored : T.test(w.filepath).ignored;
            }
            return E;
          }, function() {
            var S = this, x = arguments;
            return new Promise(function(A, f) {
              var E = d.apply(S, x);
              function w(T) {
                a(E, A, f, w, I, "next", T);
              }
              function I(T) {
                a(E, A, f, w, I, "throw", T);
              }
              w(void 0);
            });
          })();
          var d;
        }
      }
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return n;
      });
      var s = t(41), u = t(85);
      function P(i, e, k, O, m, _, d) {
        try {
          var S = i[_](d), x = S.value;
        } catch (A) {
          return void k(A);
        }
        S.done ? e(x) : Promise.resolve(x).then(O, m);
      }
      function c(i) {
        return function() {
          var e = this, k = arguments;
          return new Promise(function(O, m) {
            var _ = i.apply(e, k);
            function d(x) {
              P(_, O, m, d, S, "next", x);
            }
            function S(x) {
              P(_, O, m, d, S, "throw", x);
            }
            d(void 0);
          });
        };
      }
      function n(i) {
        return a.apply(this, arguments);
      }
      function a() {
        return (a = c(function* ({ fs: i, gitdir: e, author: k, committer: O, commit: m }) {
          const _ = Math.floor(Date.now() / 1e3), d = { name: yield Object(s.a)({ fs: i, gitdir: e, path: "user.name" }), email: (yield Object(s.a)({ fs: i, gitdir: e, path: "user.email" })) || "", timestamp: _, timezoneOffset: new Date(1e3 * _).getTimezoneOffset() }, S = Object(u.a)({}, d, m ? m.committer : void 0, k, O);
          if (S.name !== void 0) return S;
        })).apply(this, arguments);
      }
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return i;
      });
      var s = t(33), u = t.n(s), P = t(16);
      function c(e, k, O, m, _, d, S) {
        try {
          var x = e[d](S), A = x.value;
        } catch (f) {
          return void O(f);
        }
        x.done ? k(A) : Promise.resolve(A).then(m, _);
      }
      function n(e) {
        return function() {
          var k = this, O = arguments;
          return new Promise(function(m, _) {
            var d = e.apply(k, O);
            function S(A) {
              c(d, m, _, S, x, "next", A);
            }
            function x(A) {
              c(d, m, _, S, x, "throw", A);
            }
            S(void 0);
          });
        };
      }
      let a = null;
      class i {
        static read({ fs: k, gitdir: O }) {
          return n(function* () {
            a === null && (a = new u.a());
            const m = Object(P.join)(O, "shallow"), _ = /* @__PURE__ */ new Set();
            return yield a.acquire(m, n(function* () {
              const d = yield k.read(m, { encoding: "utf8" });
              return d === null || d.trim() === "" ? _ : void d.trim().split(`
`).map((S) => _.add(S));
            })), _;
          })();
        }
        static write({ fs: k, gitdir: O, oids: m }) {
          return n(function* () {
            a === null && (a = new u.a());
            const _ = Object(P.join)(O, "shallow");
            if (m.size > 0) {
              const d = [...m].join(`
`) + `
`;
              yield a.acquire(_, n(function* () {
                yield k.write(_, d, { encoding: "utf8" });
              }));
            } else yield a.acquire(_, n(function* () {
              yield k.rm(_);
            }));
          })();
        }
      }
    }, function(N, h, t) {
      function s(P, c, n) {
        return c = c instanceof RegExp ? c : new RegExp(c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), P.replace(c, n);
      }
      var u = { clean: function(P) {
        if (typeof P != "string") throw new Error("Expected a string, received: " + P);
        return P = s(P, "./", "/"), P = s(P, "..", "."), P = s(P, " ", "-"), P = s(P, /^[~^:?*\\\-]/g, ""), P = s(P, /[~^:?*\\]/g, "-"), P = s(P, /[~^:?*\\\-]$/g, ""), P = s(P, "@{", "-"), P = s(P, /\.$/g, ""), P = s(P, /\/$/g, ""), P = s(P, /\.lock$/g, "");
      } };
      N.exports = u;
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor(c) {
          super(`The filepath "${c}" contains unsafe character sequences`), this.code = this.name = u.code, this.data = { filepath: c };
        }
      }
      u.code = "UnsafeFilepathError";
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return e;
      });
      var s = t(17), u = t(18), P = t(14), c = t(12), n = t(7);
      function a(O, m, _, d, S, x, A) {
        try {
          var f = O[x](A), E = f.value;
        } catch (w) {
          return void _(w);
        }
        f.done ? m(E) : Promise.resolve(E).then(d, S);
      }
      function i(O) {
        return function() {
          var m = this, _ = arguments;
          return new Promise(function(d, S) {
            var x = O.apply(m, _);
            function A(E) {
              a(x, d, S, A, f, "next", E);
            }
            function f(E) {
              a(x, d, S, A, f, "throw", E);
            }
            A(void 0);
          });
        };
      }
      function e(O) {
        return k.apply(this, arguments);
      }
      function k() {
        return (k = i(function* ({ fs: O, cache: m, gitdir: _, oid: d }) {
          if (d === "4b825dc642cb6eb9a060e54bf8d69288fbee4904") return { tree: c.a.from([]), oid: d };
          const { type: S, object: x } = yield Object(n.a)({ fs: O, cache: m, gitdir: _, oid: d });
          if (S === "tag") return e({ fs: O, cache: m, gitdir: _, oid: d = u.a.from(x).parse().object });
          if (S === "commit") return e({ fs: O, cache: m, gitdir: _, oid: d = P.a.from(x).parse().tree });
          if (S !== "tree") throw new s.a(d, S, "tree");
          return { tree: c.a.from(x), oid: d };
        })).apply(this, arguments);
      }
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return s;
      });
      const s = { name: "isomorphic-git", version: "1.29.0", agent: "git/isomorphic-git@1.29.0" };
    }, function(N, h, t) {
      var s = {};
      (0, t(31).assign)(s, t(150), t(153), t(124)), N.exports = s;
    }, function(N, h, t) {
      function s(u, P) {
        const c = P.toString(16);
        return "0".repeat(u - c.length) + c;
      }
      t.d(h, "a", function() {
        return s;
      });
    }, function(N, h, t) {
      function s(P) {
        const [, c, n, a, i] = P.match(/^(.*) <(.*)> (.*) (.*)$/);
        return { name: c, email: n, timestamp: Number(a), timezoneOffset: u(i) };
      }
      function u(P) {
        let [, c, n, a] = P.match(/(\+|-)(\d\d)(\d\d)/);
        return a = (c === "+" ? 1 : -1) * (60 * Number(n) + Number(a)), (i = a) === 0 ? i : -i;
        var i;
      }
      t.d(h, "a", function() {
        return s;
      });
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return c;
      });
      var s = t(39);
      function u(a, i, e, k, O, m, _) {
        try {
          var d = a[m](_), S = d.value;
        } catch (x) {
          return void e(x);
        }
        d.done ? i(S) : Promise.resolve(S).then(k, O);
      }
      function P(a) {
        return function() {
          var i = this, e = arguments;
          return new Promise(function(k, O) {
            var m = a.apply(i, e);
            function _(S) {
              u(m, k, O, _, d, "next", S);
            }
            function d(S) {
              u(m, k, O, _, d, "throw", S);
            }
            _(void 0);
          });
        };
      }
      function c(a) {
        return n.apply(this, arguments);
      }
      function n() {
        return (n = P(function* (a) {
          let i = 0;
          const e = [];
          yield Object(s.a)(a, (m) => {
            e.push(m), i += m.byteLength;
          });
          const k = new Uint8Array(i);
          let O = 0;
          for (const m of e) k.set(m, O), O += m.byteLength;
          return k;
        })).apply(this, arguments);
      }
    }, function(N, h, t) {
      function s(n, a, i, e, k, O, m) {
        try {
          var _ = n[O](m), d = _.value;
        } catch (S) {
          return void i(S);
        }
        _.done ? a(d) : Promise.resolve(d).then(e, k);
      }
      function u(n) {
        return function() {
          var a = this, i = arguments;
          return new Promise(function(e, k) {
            var O = n.apply(a, i);
            function m(d) {
              s(O, e, k, m, _, "next", d);
            }
            function _(d) {
              s(O, e, k, m, _, "throw", d);
            }
            m(void 0);
          });
        };
      }
      function P(n, a) {
        return c.apply(this, arguments);
      }
      function c() {
        return (c = u(function* (n, a) {
          return !(!n && !a) && (!(!n || a) || !(n || !a) || ((yield n.type()) !== "tree" || (yield a.type()) !== "tree") && ((yield n.type()) !== (yield a.type()) || (yield n.mode()) !== (yield a.mode()) || (yield n.oid()) !== (yield a.oid())));
        })).apply(this, arguments);
      }
      t.d(h, "a", function() {
        return P;
      });
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return n;
      });
      var s = t(70), u = t(47);
      function P(i, e, k, O, m, _, d) {
        try {
          var S = i[_](d), x = S.value;
        } catch (A) {
          return void k(A);
        }
        S.done ? e(x) : Promise.resolve(x).then(O, m);
      }
      function c(i) {
        return function() {
          var e = this, k = arguments;
          return new Promise(function(O, m) {
            var _ = i.apply(e, k);
            function d(x) {
              P(_, O, m, d, S, "next", x);
            }
            function S(x) {
              P(_, O, m, d, S, "throw", x);
            }
            d(void 0);
          });
        };
      }
      function n(i) {
        return a.apply(this, arguments);
      }
      function a() {
        return (a = c(function* ({ fs: i, cache: e, gitdir: k, oid: O, filepath: m }) {
          m !== void 0 && (O = yield Object(s.a)({ fs: i, cache: e, gitdir: k, oid: O, filepath: m }));
          const { tree: _, oid: d } = yield Object(u.a)({ fs: i, cache: e, gitdir: k, oid: O });
          return { oid: d, tree: _.entries() };
        })).apply(this, arguments);
      }
    }, function(N, h, t) {
      (function(s) {
        t.d(h, "a", function() {
          return f;
        });
        var u = t(59), P = t(73), c = t(58), n = t(86), a = t(52), i = t(117), e = t(87);
        function k(E, w) {
          var I = Object.keys(E);
          if (Object.getOwnPropertySymbols) {
            var T = Object.getOwnPropertySymbols(E);
            w && (T = T.filter(function(M) {
              return Object.getOwnPropertyDescriptor(E, M).enumerable;
            })), I.push.apply(I, T);
          }
          return I;
        }
        function O(E) {
          for (var w = 1; w < arguments.length; w++) {
            var I = arguments[w] != null ? arguments[w] : {};
            w % 2 ? k(Object(I), !0).forEach(function(T) {
              m(E, T, I[T]);
            }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(E, Object.getOwnPropertyDescriptors(I)) : k(Object(I)).forEach(function(T) {
              Object.defineProperty(E, T, Object.getOwnPropertyDescriptor(I, T));
            });
          }
          return E;
        }
        function m(E, w, I) {
          return w in E ? Object.defineProperty(E, w, { value: I, enumerable: !0, configurable: !0, writable: !0 }) : E[w] = I, E;
        }
        function _(E, w, I, T, M, R, U) {
          try {
            var z = E[R](U), $ = z.value;
          } catch (H) {
            return void I(H);
          }
          z.done ? w($) : Promise.resolve($).then(T, M);
        }
        function d(E) {
          return function() {
            var w = this, I = arguments;
            return new Promise(function(T, M) {
              var R = E.apply(w, I);
              function U($) {
                _(R, T, M, U, z, "next", $);
              }
              function z($) {
                _(R, T, M, U, z, "throw", $);
              }
              U(void 0);
            });
          };
        }
        const S = (E, w) => E.endsWith("?") ? `${E}${w}` : `${E}/${w.replace(/^https?:\/\//, "")}`, x = (E, w) => {
          (w.username || w.password) && (E.Authorization = Object(n.a)(w)), w.headers && Object.assign(E, w.headers);
        }, A = function() {
          var E = d(function* (w) {
            try {
              const I = s.from(yield Object(a.a)(w.body)), T = I.toString("utf8");
              return { preview: T.length < 256 ? T : T.slice(0, 256) + "...", response: T, data: I };
            } catch {
              return {};
            }
          });
          return function(w) {
            return E.apply(this, arguments);
          };
        }();
        class f {
          static capabilities() {
            return d(function* () {
              return ["discover", "connect"];
            })();
          }
          static discover({ http: w, onProgress: I, onAuth: T, onAuthSuccess: M, onAuthFailure: R, corsProxy: U, service: z, url: $, headers: H, protocolVersion: nt }) {
            return d(function* () {
              let { url: ot, auth: V } = Object(i.a)($);
              const it = U ? S(U, ot) : ot;
              let lt, dt;
              (V.username || V.password) && (H.Authorization = Object(n.a)(V)), nt === 2 && (H["Git-Protocol"] = "version=2");
              let G = !1;
              do
                if (lt = yield w.request({ onProgress: I, method: "GET", url: `${it}/info/refs?service=${z}`, headers: H }), dt = !1, lt.statusCode === 401 || lt.statusCode === 203) {
                  const Z = G ? R : T;
                  if (Z) {
                    if (V = yield Z(ot, O({}, V, { headers: O({}, H) })), V && V.cancel) throw new c.a();
                    V && (x(H, V), G = !0, dt = !0);
                  }
                } else lt.statusCode === 200 && G && M && (yield M(ot, V));
              while (dt);
              if (lt.statusCode !== 200) {
                const { response: Z } = yield A(lt);
                throw new u.a(lt.statusCode, lt.statusMessage, Z);
              }
              if (lt.headers["content-type"] === `application/x-${z}-advertisement`) {
                const Z = yield Object(e.a)(lt.body, { service: z });
                return Z.auth = V, Z;
              }
              {
                const { preview: Z, response: ut, data: pt } = yield A(lt);
                try {
                  const st = yield Object(e.a)([pt], { service: z });
                  return st.auth = V, st;
                } catch {
                  throw new P.a(Z, ut);
                }
              }
            })();
          }
          static connect({ http: w, onProgress: I, corsProxy: T, service: M, url: R, auth: U, body: z, headers: $ }) {
            return d(function* () {
              const H = Object(i.a)(R);
              H && (R = H.url), T && (R = S(T, R)), $["content-type"] = `application/x-${M}-request`, $.accept = `application/x-${M}-result`, x($, U);
              const nt = yield w.request({ onProgress: I, method: "POST", url: `${R}/${M}`, body: z, headers: $ });
              if (nt.statusCode !== 200) {
                const { response: ot } = A(nt);
                throw new u.a(nt.statusCode, nt.statusMessage, ot);
              }
              return nt;
            })();
          }
        }
      }).call(this, t(10).Buffer);
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor() {
          super("Merges with conflicts are not supported yet."), this.code = this.name = u.code, this.data = {};
        }
      }
      u.code = "MergeNotSupportedError";
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor(c, n, a, i) {
          super(`Automatic merge failed with one or more merge conflicts in the following files: ${c.toString()}. Fix conflicts then commit the result.`), this.code = this.name = u.code, this.data = { filepaths: c, bothModified: n, deleteByUs: a, deleteByTheirs: i };
        }
      }
      u.code = "MergeConflictError";
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor() {
          super("The operation was canceled."), this.code = this.name = u.code, this.data = {};
        }
      }
      u.code = "UserCanceledError";
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor(c, n, a) {
          super(`HTTP Error: ${c} ${n}`), this.code = this.name = u.code, this.data = { statusCode: c, statusMessage: n, response: a };
        }
      }
      u.code = "HttpError";
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor(c) {
          let n = "invalid filepath";
          c === "leading-slash" || c === "trailing-slash" ? n = '"filepath" parameter should not include leading or trailing directory separators because these can cause problems on some platforms.' : c === "directory" && (n = '"filepath" should not be a directory.'), super(n), this.code = this.name = u.code, this.data = { reason: c };
        }
      }
      u.code = "InvalidFilepathError";
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(38);
      function u(P, c) {
        return Object(s.a)(P.path, c.path);
      }
    }, function(N, h, t) {
      (function(s) {
        t.d(h, "a", function() {
          return d;
        });
        var u = t(132), P = t.n(u), c = t(4), n = t(25), a = t(20), i = t(134), e = t(133), k = t(83), O = t(19);
        function m(S, x, A, f, E, w, I) {
          try {
            var T = S[w](I), M = T.value;
          } catch (R) {
            return void A(R);
          }
          T.done ? x(M) : Promise.resolve(M).then(f, E);
        }
        function _(S) {
          return function() {
            var x = this, A = arguments;
            return new Promise(function(f, E) {
              var w = S.apply(x, A);
              function I(M) {
                m(w, f, E, I, T, "next", M);
              }
              function T(M) {
                m(w, f, E, I, T, "throw", M);
              }
              I(void 0);
            });
          };
        }
        class d {
          constructor(x) {
            Object.assign(this, x), this.offsetCache = {};
          }
          static fromIdx({ idx: x, getExternalRefDelta: A }) {
            return _(function* () {
              const f = new a.a(x);
              if (f.slice(4).toString("hex") !== "ff744f63") return;
              const E = f.readUInt32BE();
              if (E !== 2) throw new c.a(`Unable to read version ${E} packfile IDX. (Only version 2 supported)`);
              if (x.byteLength > 2147483648) throw new c.a("To keep implementation simple, I haven't implemented the layer 5 feature needed to support packfiles > 2GB in size.");
              f.seek(f.tell() + 1020);
              const w = f.readUInt32BE(), I = [];
              for (let R = 0; R < w; R++) {
                const U = f.slice(20).toString("hex");
                I[R] = U;
              }
              f.seek(f.tell() + 4 * w);
              const T = /* @__PURE__ */ new Map();
              for (let R = 0; R < w; R++) T.set(I[R], f.readUInt32BE());
              const M = f.slice(20).toString("hex");
              return new d({ hashes: I, crcs: {}, offsets: T, packfileSha: M, getExternalRefDelta: A });
            })();
          }
          static fromPack({ pack: x, getExternalRefDelta: A, onProgress: f }) {
            return _(function* () {
              const E = { 1: "commit", 2: "tree", 3: "blob", 4: "tag", 6: "ofs-delta", 7: "ref-delta" }, w = {}, I = x.slice(-20).toString("hex"), T = [], M = {}, R = /* @__PURE__ */ new Map();
              let U = null, z = null;
              yield Object(e.a)([x], function() {
                var V = _(function* ({ data: it, type: lt, reference: dt, offset: G, num: Z }) {
                  U === null && (U = Z);
                  const ut = Math.floor(100 * (U - Z) / U);
                  ut !== z && f && (yield f({ phase: "Receiving objects", loaded: U - Z, total: U })), z = ut, ["commit", "tree", "blob", "tag"].includes(lt = E[lt]) ? w[G] = { type: lt, offset: G } : lt === "ofs-delta" ? w[G] = { type: lt, offset: G } : lt === "ref-delta" && (w[G] = { type: lt, offset: G });
                });
                return function(it) {
                  return V.apply(this, arguments);
                };
              }());
              const $ = Object.keys(w).map(Number);
              for (const [V, it] of $.entries()) {
                const lt = V + 1 === $.length ? x.byteLength - 20 : $[V + 1], dt = w[it], G = P.a.buf(x.slice(it, lt)) >>> 0;
                dt.end = lt, dt.crc = G;
              }
              const H = new d({ pack: Promise.resolve(x), packfileSha: I, crcs: M, hashes: T, offsets: R, getExternalRefDelta: A });
              z = null;
              let nt = 0;
              const ot = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
              for (let V in w) {
                V = Number(V);
                const it = Math.floor(100 * nt / U);
                it !== z && f && (yield f({ phase: "Resolving deltas", loaded: nt, total: U })), nt++, z = it;
                const lt = w[V];
                if (!lt.oid) try {
                  H.readDepth = 0, H.externalReadDepth = 0;
                  const { type: dt, object: G } = yield H.readSlice({ start: V });
                  ot[H.readDepth] += 1;
                  const Z = yield Object(O.a)(n.a.wrap({ type: dt, object: G }));
                  lt.oid = Z, T.push(Z), R.set(Z, V), M[Z] = lt.crc;
                } catch {
                  continue;
                }
              }
              return T.sort(), H;
            })();
          }
          toBuffer() {
            var x = this;
            return _(function* () {
              const A = [], f = (U, z) => {
                A.push(s.from(U, z));
              };
              f("ff744f63", "hex"), f("00000002", "hex");
              const E = new a.a(s.alloc(1024));
              for (let U = 0; U < 256; U++) {
                let z = 0;
                for (const $ of x.hashes) parseInt($.slice(0, 2), 16) <= U && z++;
                E.writeUInt32BE(z);
              }
              A.push(E.buffer);
              for (const U of x.hashes) f(U, "hex");
              const w = new a.a(s.alloc(4 * x.hashes.length));
              for (const U of x.hashes) w.writeUInt32BE(x.crcs[U]);
              A.push(w.buffer);
              const I = new a.a(s.alloc(4 * x.hashes.length));
              for (const U of x.hashes) I.writeUInt32BE(x.offsets.get(U));
              A.push(I.buffer), f(x.packfileSha, "hex");
              const T = s.concat(A), M = yield Object(O.a)(T), R = s.alloc(20);
              return R.write(M, "hex"), s.concat([T, R]);
            })();
          }
          load({ pack: x }) {
            var A = this;
            return _(function* () {
              A.pack = x;
            })();
          }
          unload() {
            var x = this;
            return _(function* () {
              x.pack = null;
            })();
          }
          read({ oid: x }) {
            var A = this;
            return _(function* () {
              if (!A.offsets.get(x)) {
                if (A.getExternalRefDelta) return A.externalReadDepth++, A.getExternalRefDelta(x);
                throw new c.a(`Could not read object ${x} from packfile`);
              }
              const f = A.offsets.get(x);
              return A.readSlice({ start: f });
            })();
          }
          readSlice({ start: x }) {
            var A = this;
            return _(function* () {
              if (A.offsetCache[x]) return Object.assign({}, A.offsetCache[x]);
              if (A.readDepth++, !A.pack) throw new c.a("Tried to read from a GitPackIndex with no packfile loaded into memory");
              const f = (yield A.pack).slice(x), E = new a.a(f), w = E.readUInt8(), I = 112 & w;
              let T = { 16: "commit", 32: "tree", 48: "blob", 64: "tag", 96: "ofs_delta", 112: "ref_delta" }[I];
              if (T === void 0) throw new c.a("Unrecognized type: 0b" + I.toString(2));
              const M = 15 & w;
              let R = M;
              128 & w && (R = function(H, nt) {
                let ot = nt, V = 4, it = null;
                do
                  it = H.readUInt8(), ot |= (127 & it) << V, V += 7;
                while (128 & it);
                return ot;
              }(E, M));
              let U = null, z = null;
              if (T === "ofs_delta") {
                const H = function(ot) {
                  const V = [];
                  let it = 0, lt = 0;
                  do {
                    it = ot.readUInt8();
                    const dt = 127 & it;
                    V.push(dt), lt = 128 & it;
                  } while (lt);
                  return V.reduce((dt, G) => dt + 1 << 7 | G, -1);
                }(E), nt = x - H;
                ({ object: U, type: T } = yield A.readSlice({ start: nt }));
              }
              if (T === "ref_delta") {
                const H = E.slice(20).toString("hex");
                ({ object: U, type: T } = yield A.read({ oid: H }));
              }
              const $ = f.slice(E.tell());
              if (z = s.from(yield Object(k.a)($)), z.byteLength !== R) throw new c.a(`Packfile told us object would have length ${R} but it had length ${z.byteLength}`);
              return U && (z = s.from(Object(i.a)(z, U))), A.readDepth > 3 && (A.offsetCache[x] = { type: T, object: z }), { type: T, format: "content", object: z };
            })();
          }
        }
      }).call(this, t(10).Buffer);
    }, function(N, h, t) {
      var s = t(74), u = t(75), P = t(55);
      t.d(h, "a", function() {
        return c;
      });
      class c {
        static getRemoteHelperFor({ url: a }) {
          const i = /* @__PURE__ */ new Map();
          i.set("http", P.a), i.set("https", P.a);
          const e = function({ url: k }) {
            if (k.startsWith("git@")) return { transport: "ssh", address: k };
            const O = k.match(/(\w+)(:\/\/|::)(.*)/);
            return O !== null ? O[2] === "://" ? { transport: O[1], address: O[0] } : O[2] === "::" ? { transport: O[1], address: O[3] } : void 0 : void 0;
          }({ url: a });
          if (!e) throw new u.a(a);
          if (i.has(e.transport)) return i.get(e.transport);
          throw new s.a(a, e.transport, e.transport === "ssh" ? function(k) {
            return k = (k = k.replace(/^git@([^:]+):/, "https://$1/")).replace(/^ssh:\/\//, "https://");
          }(a) : void 0);
        }
      }
    }, function(N, h, t) {
      function s({ name: u, email: P, timestamp: c, timezoneOffset: n }) {
        return `${u} <${P}> ${c} ${n = function(a) {
          const i = function(_) {
            return Math.sign(_) || (Object.is(_, -0) ? -1 : 1);
          }((e = a, e === 0 ? e : -e));
          var e;
          a = Math.abs(a);
          const k = Math.floor(a / 60);
          a -= 60 * k;
          let O = String(k), m = String(a);
          return O.length < 2 && (O = "0" + O), m.length < 2 && (m = "0" + m), (i === -1 ? "-" : "+") + O + m;
        }(n)}`;
      }
      t.d(h, "a", function() {
        return s;
      });
    }, function(N, h, t) {
      var s = t(17), u = t(18), P = t(14), c = t(7);
      function n(d, S, x, A, f, E, w) {
        try {
          var I = d[E](w), T = I.value;
        } catch (M) {
          return void x(M);
        }
        I.done ? S(T) : Promise.resolve(T).then(A, f);
      }
      function a(d) {
        return function() {
          var S = this, x = arguments;
          return new Promise(function(A, f) {
            var E = d.apply(S, x);
            function w(T) {
              n(E, A, f, w, I, "next", T);
            }
            function I(T) {
              n(E, A, f, w, I, "throw", T);
            }
            w(void 0);
          });
        };
      }
      function i(d) {
        return e.apply(this, arguments);
      }
      function e() {
        return (e = a(function* ({ fs: d, cache: S, gitdir: x, oid: A }) {
          const { type: f, object: E } = yield Object(c.a)({ fs: d, cache: S, gitdir: x, oid: A });
          if (f === "tag") return i({ fs: d, cache: S, gitdir: x, oid: A = u.a.from(E).parse().object });
          if (f !== "commit") throw new s.a(A, f, "commit");
          return { commit: P.a.from(E), oid: A };
        })).apply(this, arguments);
      }
      function k(d, S, x, A, f, E, w) {
        try {
          var I = d[E](w), T = I.value;
        } catch (M) {
          return void x(M);
        }
        I.done ? S(T) : Promise.resolve(T).then(A, f);
      }
      function O(d) {
        return function() {
          var S = this, x = arguments;
          return new Promise(function(A, f) {
            var E = d.apply(S, x);
            function w(T) {
              k(E, A, f, w, I, "next", T);
            }
            function I(T) {
              k(E, A, f, w, I, "throw", T);
            }
            w(void 0);
          });
        };
      }
      function m(d) {
        return _.apply(this, arguments);
      }
      function _() {
        return (_ = O(function* ({ fs: d, cache: S, gitdir: x, oid: A }) {
          const { commit: f, oid: E } = yield i({ fs: d, cache: S, gitdir: x, oid: A });
          return { oid: E, commit: f.parse(), payload: f.withoutSignature() };
        })).apply(this, arguments);
      }
      t.d(h, "a", function() {
        return m;
      });
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      const s = new RegExp("^refs/(heads/|tags/|remotes/)?(.*)");
      function u(P) {
        const c = s.exec(P);
        return c ? c[1] === "remotes/" && P.endsWith("/HEAD") ? c[2].slice(0, -5) : c[2] : P;
      }
    }, function(N, h, t) {
      function s(P, c, n, a, i, e, k) {
        try {
          var O = P[e](k), m = O.value;
        } catch (_) {
          return void n(_);
        }
        O.done ? c(m) : Promise.resolve(m).then(a, i);
      }
      t.d(h, "a", function() {
        return u;
      });
      class u {
        constructor() {
          this._queue = [];
        }
        write(c) {
          if (this._ended) throw Error("You cannot write to a FIFO that has already been ended!");
          if (this._waiting) {
            const n = this._waiting;
            this._waiting = null, n({ value: c });
          } else this._queue.push(c);
        }
        end() {
          if (this._ended = !0, this._waiting) {
            const c = this._waiting;
            this._waiting = null, c({ done: !0 });
          }
        }
        destroy(c) {
          this.error = c, this.end();
        }
        next() {
          var c, n = this;
          return (c = function* () {
            if (n._queue.length > 0) return { value: n._queue.shift() };
            if (n._ended) return { done: !0 };
            if (n._waiting) throw Error("You cannot call read until the previous call to read has returned!");
            return new Promise((a) => {
              n._waiting = a;
            });
          }, function() {
            var a = this, i = arguments;
            return new Promise(function(e, k) {
              var O = c.apply(a, i);
              function m(d) {
                s(O, e, k, m, _, "next", d);
              }
              function _(d) {
                s(O, e, k, m, _, "throw", d);
              }
              m(void 0);
            });
          })();
        }
      }
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor(c, n) {
          super(`Remote does not support the "${c}" so the "${n}" parameter cannot be used.`), this.code = this.name = u.code, this.data = { capability: c, parameter: n };
        }
      }
      u.code = "RemoteCapabilityError";
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(34);
      function u(P, c, n = !0, a = !0) {
        const i = Object(s.a)(P), e = Object(s.a)(c);
        return n && i.mode !== e.mode || i.mtimeSeconds !== e.mtimeSeconds || i.ctimeSeconds !== e.ctimeSeconds || i.uid !== e.uid || i.gid !== e.gid || a && i.ino !== e.ino || i.size !== e.size;
      }
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return k;
      });
      var s = t(60), u = t(8), P = t(17), c = t(12), n = t(7), a = t(47);
      function i(d, S, x, A, f, E, w) {
        try {
          var I = d[E](w), T = I.value;
        } catch (M) {
          return void x(M);
        }
        I.done ? S(T) : Promise.resolve(T).then(A, f);
      }
      function e(d) {
        return function() {
          var S = this, x = arguments;
          return new Promise(function(A, f) {
            var E = d.apply(S, x);
            function w(T) {
              i(E, A, f, w, I, "next", T);
            }
            function I(T) {
              i(E, A, f, w, I, "throw", T);
            }
            w(void 0);
          });
        };
      }
      function k(d) {
        return O.apply(this, arguments);
      }
      function O() {
        return (O = e(function* ({ fs: d, cache: S, gitdir: x, oid: A, filepath: f }) {
          if (f.startsWith("/")) throw new s.a("leading-slash");
          if (f.endsWith("/")) throw new s.a("trailing-slash");
          const E = A, w = yield Object(a.a)({ fs: d, cache: S, gitdir: x, oid: A }), I = w.tree;
          if (f === "") A = w.oid;
          else {
            const T = f.split("/");
            A = yield m({ fs: d, cache: S, gitdir: x, tree: I, pathArray: T, oid: E, filepath: f });
          }
          return A;
        })).apply(this, arguments);
      }
      function m(d) {
        return _.apply(this, arguments);
      }
      function _() {
        return (_ = e(function* ({ fs: d, cache: S, gitdir: x, tree: A, pathArray: f, oid: E, filepath: w }) {
          const I = f.shift();
          for (const T of A) if (T.path === I) {
            if (f.length === 0) return T.oid;
            {
              const { type: M, object: R } = yield Object(n.a)({ fs: d, cache: S, gitdir: x, oid: T.oid });
              if (M !== "tree") throw new P.a(E, M, "tree", w);
              return m({ fs: d, cache: S, gitdir: x, tree: A = c.a.from(R), pathArray: f, oid: E, filepath: w });
            }
          }
          throw new u.a(`file or directory found at "${E}:${w}"`);
        })).apply(this, arguments);
      }
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor() {
          super("Empty response from git server."), this.code = this.name = u.code, this.data = {};
        }
      }
      u.code = "EmptyServerResponseError";
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor(c) {
          super(`Could not find a fetch refspec for remote "${c}". Make sure the config file has an entry like the following:
[remote "${c}"]
	fetch = +refs/heads/*:refs/remotes/origin/*
`), this.code = this.name = u.code, this.data = { remote: c };
        }
      }
      u.code = "NoRefspecError";
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor(c, n) {
          super(`Remote did not reply using the "smart" HTTP protocol. Expected "001e# service=git-upload-pack" but received: ${c}`), this.code = this.name = u.code, this.data = { preview: c, response: n };
        }
      }
      u.code = "SmartHttpError";
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor(c, n, a) {
          super(`Git remote "${c}" uses an unrecognized transport protocol: "${n}"`), this.code = this.name = u.code, this.data = { url: c, transport: n, suggestion: a };
        }
      }
      u.code = "UnknownTransportError";
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor(c) {
          super(`Cannot parse remote URL: "${c}"`), this.code = this.name = u.code, this.data = { url: c };
        }
      }
      u.code = "UrlParseError";
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor(c) {
          super(`Modifying the index is not possible because you have unmerged files: ${c.toString}. Fix them up in the work tree, and then use 'git add/rm as appropriate to mark resolution and make a commit.`), this.code = this.name = u.code, this.data = { filepaths: c };
        }
      }
      u.code = "UnmergedPathsError";
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return c;
      });
      var s = t(67), u = t(9);
      function P(n, a, i, e, k, O, m) {
        try {
          var _ = n[O](m), d = _.value;
        } catch (S) {
          return void i(S);
        }
        _.done ? a(d) : Promise.resolve(d).then(e, k);
      }
      class c {
        static demux(a) {
          const i = u.a.streamReader(a), e = new s.a(), k = new s.a(), O = new s.a(), m = function() {
            var _, d = (_ = function* () {
              const S = yield i();
              if (S === null) return m();
              if (S === !0) return e.end(), O.end(), void (a.error ? k.destroy(a.error) : k.end());
              switch (S[0]) {
                case 1:
                  k.write(S.slice(1));
                  break;
                case 2:
                  O.write(S.slice(1));
                  break;
                case 3: {
                  const x = S.slice(1);
                  return O.write(x), e.end(), O.end(), void k.destroy(new Error(x.toString("utf8")));
                }
                default:
                  e.write(S);
              }
              m();
            }, function() {
              var S = this, x = arguments;
              return new Promise(function(A, f) {
                var E = _.apply(S, x);
                function w(T) {
                  P(E, A, f, w, I, "next", T);
                }
                function I(T) {
                  P(E, A, f, w, I, "throw", T);
                }
                w(void 0);
              });
            });
            return function() {
              return d.apply(this, arguments);
            };
          }();
          return m(), { packetlines: e, packfile: k, progress: O };
        }
      }
    }, function(N, h, t) {
      var s = t(148), u = t(149), P = t(119).Buffer, c = [1518500249, 1859775393, -1894007588, -899497514], n = new Array(80);
      function a() {
        this.init(), this._w = n, u.call(this, 64, 56);
      }
      function i(O) {
        return O << 5 | O >>> 27;
      }
      function e(O) {
        return O << 30 | O >>> 2;
      }
      function k(O, m, _, d) {
        return O === 0 ? m & _ | ~m & d : O === 2 ? m & _ | m & d | _ & d : m ^ _ ^ d;
      }
      s(a, u), a.prototype.init = function() {
        return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
      }, a.prototype._update = function(O) {
        for (var m, _ = this._w, d = 0 | this._a, S = 0 | this._b, x = 0 | this._c, A = 0 | this._d, f = 0 | this._e, E = 0; E < 16; ++E) _[E] = O.readInt32BE(4 * E);
        for (; E < 80; ++E) _[E] = (m = _[E - 3] ^ _[E - 8] ^ _[E - 14] ^ _[E - 16]) << 1 | m >>> 31;
        for (var w = 0; w < 80; ++w) {
          var I = ~~(w / 20), T = i(d) + k(I, S, x, A) + f + _[w] + c[I] | 0;
          f = A, A = x, x = e(S), S = d, d = T;
        }
        this._a = d + this._a | 0, this._b = S + this._b | 0, this._c = x + this._c | 0, this._d = A + this._d | 0, this._e = f + this._e | 0;
      }, a.prototype._hash = function() {
        var O = P.allocUnsafe(20);
        return O.writeInt32BE(0 | this._a, 0), O.writeInt32BE(0 | this._b, 4), O.writeInt32BE(0 | this._c, 8), O.writeInt32BE(0 | this._d, 12), O.writeInt32BE(0 | this._e, 16), O;
      }, N.exports = a;
    }, function(N, h, t) {
      function s(u) {
        let P = u > 0 ? u >> 12 : 0;
        P !== 4 && P !== 8 && P !== 10 && P !== 14 && (P = 8);
        let c = 511 & u;
        return c = 73 & c ? 493 : 420, P !== 8 && (c = 0), (P << 12) + c;
      }
      t.d(h, "a", function() {
        return s;
      });
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(4);
      class u {
        constructor({ remotePath: c, localPath: n, force: a, matchPrefix: i }) {
          Object.assign(this, { remotePath: c, localPath: n, force: a, matchPrefix: i });
        }
        static from(c) {
          const [n, a, i, e, k] = c.match(/^(\+?)(.*?)(\*?):(.*?)(\*?)$/).slice(1), O = n === "+", m = i === "*";
          if (m !== (k === "*")) throw new s.a("Invalid refspec");
          return new u({ remotePath: a, localPath: e, force: O, matchPrefix: m });
        }
        translate(c) {
          if (this.matchPrefix) {
            if (c.startsWith(this.remotePath)) return this.localPath + c.replace(this.remotePath, "");
          } else if (c === this.remotePath) return this.localPath;
          return null;
        }
        reverseTranslate(c) {
          if (this.matchPrefix) {
            if (c.startsWith(this.localPath)) return this.remotePath + c.replace(this.localPath, "");
          } else if (c === this.localPath) return this.remotePath;
          return null;
        }
      }
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return a;
      });
      var s = t(62);
      function u(i, e, k, O, m, _, d) {
        try {
          var S = i[_](d), x = S.value;
        } catch (A) {
          return void k(A);
        }
        S.done ? e(x) : Promise.resolve(x).then(O, m);
      }
      function P(i) {
        return function() {
          var e = this, k = arguments;
          return new Promise(function(O, m) {
            var _ = i.apply(e, k);
            function d(x) {
              u(_, O, m, d, S, "next", x);
            }
            function S(x) {
              u(_, O, m, d, S, "throw", x);
            }
            d(void 0);
          });
        };
      }
      const c = Symbol("PackfileCache");
      function n() {
        return (n = P(function* ({ fs: i, filename: e, getExternalRefDelta: k, emitter: O, emitterPrefix: m }) {
          const _ = yield i.read(e);
          return s.a.fromIdx({ idx: _, getExternalRefDelta: k });
        })).apply(this, arguments);
      }
      function a({ fs: i, cache: e, filename: k, getExternalRefDelta: O, emitter: m, emitterPrefix: _ }) {
        e[c] || (e[c] = /* @__PURE__ */ new Map());
        let d = e[c].get(k);
        return d || (d = function(S) {
          return n.apply(this, arguments);
        }({ fs: i, filename: k, getExternalRefDelta: O, emitter: m, emitterPrefix: _ }), e[c].set(k, d)), d;
      }
    }, function(N, h, t) {
      (function(s) {
        t.d(h, "a", function() {
          return n;
        });
        var u = t(88);
        function P(i, e, k, O, m, _, d) {
          try {
            var S = i[_](d), x = S.value;
          } catch (A) {
            return void k(A);
          }
          S.done ? e(x) : Promise.resolve(x).then(O, m);
        }
        function c(i) {
          return function() {
            var e = this, k = arguments;
            return new Promise(function(O, m) {
              var _ = i.apply(e, k);
              function d(x) {
                P(_, O, m, d, S, "next", x);
              }
              function S(x) {
                P(_, O, m, d, S, "throw", x);
              }
              d(void 0);
            });
          };
        }
        class n {
          constructor(e) {
            if (s === void 0) throw new Error("Missing Buffer dependency");
            this.stream = Object(u.a)(e), this.buffer = null, this.cursor = 0, this.undoCursor = 0, this.started = !1, this._ended = !1, this._discardedBytes = 0;
          }
          eof() {
            return this._ended && this.cursor === this.buffer.length;
          }
          tell() {
            return this._discardedBytes + this.cursor;
          }
          byte() {
            var e = this;
            return c(function* () {
              if (!e.eof() && (e.started || (yield e._init()), e.cursor !== e.buffer.length || (yield e._loadnext(), !e._ended))) return e._moveCursor(1), e.buffer[e.undoCursor];
            })();
          }
          chunk() {
            var e = this;
            return c(function* () {
              if (!e.eof() && (e.started || (yield e._init()), e.cursor !== e.buffer.length || (yield e._loadnext(), !e._ended))) return e._moveCursor(e.buffer.length), e.buffer.slice(e.undoCursor, e.cursor);
            })();
          }
          read(e) {
            var k = this;
            return c(function* () {
              if (!k.eof()) return k.started || (yield k._init()), k.cursor + e > k.buffer.length && (k._trim(), yield k._accumulate(e)), k._moveCursor(e), k.buffer.slice(k.undoCursor, k.cursor);
            })();
          }
          skip(e) {
            var k = this;
            return c(function* () {
              k.eof() || (k.started || (yield k._init()), k.cursor + e > k.buffer.length && (k._trim(), yield k._accumulate(e)), k._moveCursor(e));
            })();
          }
          undo() {
            var e = this;
            return c(function* () {
              e.cursor = e.undoCursor;
            })();
          }
          _next() {
            var e = this;
            return c(function* () {
              e.started = !0;
              let { done: k, value: O } = yield e.stream.next();
              return k && (e._ended = !0, !O) ? s.alloc(0) : (O && (O = s.from(O)), O);
            })();
          }
          _trim() {
            this.buffer = this.buffer.slice(this.undoCursor), this.cursor -= this.undoCursor, this._discardedBytes += this.undoCursor, this.undoCursor = 0;
          }
          _moveCursor(e) {
            this.undoCursor = this.cursor, this.cursor += e, this.cursor > this.buffer.length && (this.cursor = this.buffer.length);
          }
          _accumulate(e) {
            var k = this;
            return c(function* () {
              if (k._ended) return;
              const O = [k.buffer];
              for (; k.cursor + e > a(O); ) {
                const m = yield k._next();
                if (k._ended) break;
                O.push(m);
              }
              k.buffer = s.concat(O);
            })();
          }
          _loadnext() {
            var e = this;
            return c(function* () {
              e._discardedBytes += e.buffer.length, e.undoCursor = 0, e.cursor = 0, e.buffer = yield e._next();
            })();
          }
          _init() {
            var e = this;
            return c(function* () {
              e.buffer = yield e._next();
            })();
          }
        }
        function a(i) {
          return i.reduce((e, k) => e + k.length, 0);
        }
      }).call(this, t(10).Buffer);
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return n;
      });
      var s = t(49), u = t.n(s);
      function P(i, e, k, O, m, _, d) {
        try {
          var S = i[_](d), x = S.value;
        } catch (A) {
          return void k(A);
        }
        S.done ? e(x) : Promise.resolve(x).then(O, m);
      }
      function c(i) {
        return function() {
          var e = this, k = arguments;
          return new Promise(function(O, m) {
            var _ = i.apply(e, k);
            function d(x) {
              P(_, O, m, d, S, "next", x);
            }
            function S(x) {
              P(_, O, m, d, S, "throw", x);
            }
            d(void 0);
          });
        };
      }
      function n(i) {
        return a.apply(this, arguments);
      }
      function a() {
        return (a = c(function* (i) {
          return u.a.inflate(i);
        })).apply(this, arguments);
      }
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return a;
      });
      var s = t(49), u = t.n(s);
      function P(m, _, d, S, x, A, f) {
        try {
          var E = m[A](f), w = E.value;
        } catch (I) {
          return void d(I);
        }
        E.done ? _(w) : Promise.resolve(w).then(S, x);
      }
      function c(m) {
        return function() {
          var _ = this, d = arguments;
          return new Promise(function(S, x) {
            var A = m.apply(_, d);
            function f(w) {
              P(A, S, x, f, E, "next", w);
            }
            function E(w) {
              P(A, S, x, f, E, "throw", w);
            }
            f(void 0);
          });
        };
      }
      let n = null;
      function a(m) {
        return i.apply(this, arguments);
      }
      function i() {
        return (i = c(function* (m) {
          return n === null && (n = O()), n ? e(m) : u.a.deflate(m);
        })).apply(this, arguments);
      }
      function e(m) {
        return k.apply(this, arguments);
      }
      function k() {
        return (k = c(function* (m) {
          const _ = new CompressionStream("deflate"), d = new Blob([m]).stream().pipeThrough(_);
          return new Uint8Array(yield new Response(d).arrayBuffer());
        })).apply(this, arguments);
      }
      function O() {
        try {
          return new CompressionStream("deflate").writable.close(), new Blob([]).stream().cancel(), !0;
        } catch {
          return !1;
        }
      }
    }, function(N, h, t) {
      function s(u, ...P) {
        for (const c of P) if (c) for (const n of Object.keys(c)) {
          const a = c[n];
          a !== void 0 && (u[n] = a);
        }
        return u;
      }
      t.d(h, "a", function() {
        return s;
      });
    }, function(N, h, t) {
      (function(s) {
        function u({ username: P = "", password: c = "" }) {
          return `Basic ${s.from(`${P}:${c}`).toString("base64")}`;
        }
        t.d(h, "a", function() {
          return u;
        });
      }).call(this, t(10).Buffer);
    }, function(N, h, t) {
      var s = t(71), u = t(36), P = t(9);
      function c(d, S, x, A, f, E, w) {
        try {
          var I = d[E](w), T = I.value;
        } catch (M) {
          return void x(M);
        }
        I.done ? S(T) : Promise.resolve(T).then(A, f);
      }
      function n(d) {
        return function() {
          var S = this, x = arguments;
          return new Promise(function(A, f) {
            var E = d.apply(S, x);
            function w(T) {
              c(E, A, f, w, I, "next", T);
            }
            function I(T) {
              c(E, A, f, w, I, "throw", T);
            }
            w(void 0);
          });
        };
      }
      function a(d) {
        return i.apply(this, arguments);
      }
      function i() {
        return (i = n(function* (d) {
          const S = {};
          let x;
          for (; x = yield d(), x !== !0; ) {
            if (x === null) continue;
            x = x.toString("utf8").replace(/\n$/, "");
            const A = x.indexOf("=");
            if (A > -1) {
              const f = x.slice(0, A), E = x.slice(A + 1);
              S[f] = E;
            } else S[x] = !0;
          }
          return { protocolVersion: 2, capabilities2: S };
        })).apply(this, arguments);
      }
      function e(d, S, x, A, f, E, w) {
        try {
          var I = d[E](w), T = I.value;
        } catch (M) {
          return void x(M);
        }
        I.done ? S(T) : Promise.resolve(T).then(A, f);
      }
      function k(d) {
        return function() {
          var S = this, x = arguments;
          return new Promise(function(A, f) {
            var E = d.apply(S, x);
            function w(T) {
              e(E, A, f, w, I, "next", T);
            }
            function I(T) {
              e(E, A, f, w, I, "throw", T);
            }
            w(void 0);
          });
        };
      }
      function O(d, S) {
        return m.apply(this, arguments);
      }
      function m() {
        return (m = k(function* (d, { service: S }) {
          const x = /* @__PURE__ */ new Set(), A = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), E = P.a.streamReader(d);
          let w = yield E();
          for (; w === null; ) w = yield E();
          if (w === !0) throw new s.a();
          if (w.includes("version 2")) return a(E);
          if (w.toString("utf8").replace(/\n$/, "") !== `# service=${S}`) throw new u.a(`# service=${S}\\n`, w.toString("utf8"));
          let I = yield E();
          for (; I === null; ) I = yield E();
          if (I === !0) return { capabilities: x, refs: A, symrefs: f };
          if (I = I.toString("utf8"), I.includes("version 2")) return a(E);
          const [T, M] = _(I, "\0", "\\x00");
          if (M.split(" ").map((R) => x.add(R)), T !== "0000000000000000000000000000000000000000 capabilities^{}") {
            const [R, U] = _(T, " ", " ");
            for (A.set(U, R); ; ) {
              const z = yield E();
              if (z === !0) break;
              if (z !== null) {
                const [$, H] = _(z.toString("utf8"), " ", " ");
                A.set(H, $);
              }
            }
          }
          for (const R of x) if (R.startsWith("symref=")) {
            const U = R.match(/symref=([^:]+):(.*)/);
            U.length === 3 && f.set(U[1], U[2]);
          }
          return { protocolVersion: 1, capabilities: x, refs: A, symrefs: f };
        })).apply(this, arguments);
      }
      function _(d, S, x) {
        const A = d.trim().split(S);
        if (A.length !== 2) throw new u.a(`Two strings separated by '${x}'`, d.toString("utf8"));
        return A;
      }
      t.d(h, "a", function() {
        return O;
      });
    }, function(N, h, t) {
      function s(u) {
        return u[Symbol.asyncIterator] ? u[Symbol.asyncIterator]() : u[Symbol.iterator] ? u[Symbol.iterator]() : u.next ? u : /* @__PURE__ */ function(P) {
          let c = [P];
          return { next: () => Promise.resolve({ done: c.length === 0, value: c.pop() }), return: () => (c = [], {}), [Symbol.asyncIterator]() {
            return this;
          } };
        }(u);
      }
      t.d(h, "a", function() {
        return s;
      });
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return n;
      });
      var s = t(12), u = t(15);
      function P(i, e, k, O, m, _, d) {
        try {
          var S = i[_](d), x = S.value;
        } catch (A) {
          return void k(A);
        }
        S.done ? e(x) : Promise.resolve(x).then(O, m);
      }
      function c(i) {
        return function() {
          var e = this, k = arguments;
          return new Promise(function(O, m) {
            var _ = i.apply(e, k);
            function d(x) {
              P(_, O, m, d, S, "next", x);
            }
            function S(x) {
              P(_, O, m, d, S, "throw", x);
            }
            d(void 0);
          });
        };
      }
      function n(i) {
        return a.apply(this, arguments);
      }
      function a() {
        return (a = c(function* ({ fs: i, gitdir: e, tree: k }) {
          const O = s.a.from(k).toObject();
          return yield Object(u.a)({ fs: i, gitdir: e, type: "tree", object: O, format: "content" });
        })).apply(this, arguments);
      }
    }, function(N, h, t) {
      function s(u) {
        return u.trim().split(`
`).map((P) => " " + P).join(`
`) + `
`;
      }
      t.d(h, "a", function() {
        return s;
      });
    }, function(N, h, t) {
      const s = (u, P) => function(...c) {
        return new P.promiseModule((n, a) => {
          P.multiArgs ? c.push((...i) => {
            P.errorFirst ? i[0] ? a(i) : (i.shift(), n(i)) : n(i);
          }) : P.errorFirst ? c.push((i, e) => {
            i ? a(i) : n(e);
          }) : c.push(n), u.apply(this, c);
        });
      };
      N.exports = (u, P) => {
        P = Object.assign({ exclude: [/.+(Sync|Stream)$/], errorFirst: !0, promiseModule: Promise }, P);
        const c = typeof u;
        if (u === null || c !== "object" && c !== "function") throw new TypeError(`Expected \`input\` to be a \`Function\` or \`Object\`, got \`${u === null ? "null" : c}\``);
        const n = (i) => {
          const e = (k) => typeof k == "string" ? i === k : k.test(i);
          return P.include ? P.include.some(e) : !P.exclude.some(e);
        };
        let a;
        a = c === "function" ? function(...i) {
          return P.excludeMain ? u(...i) : s(u, P).apply(this, i);
        } : Object.create(Object.getPrototypeOf(u));
        for (const i in u) {
          const e = u[i];
          a[i] = typeof e == "function" && n(i) ? s(e, P) : e;
        }
        return a;
      };
    }, function(N, h) {
      var t, s, u = N.exports = {};
      function P() {
        throw new Error("setTimeout has not been defined");
      }
      function c() {
        throw new Error("clearTimeout has not been defined");
      }
      function n(S) {
        if (t === setTimeout) return setTimeout(S, 0);
        if ((t === P || !t) && setTimeout) return t = setTimeout, setTimeout(S, 0);
        try {
          return t(S, 0);
        } catch {
          try {
            return t.call(null, S, 0);
          } catch {
            return t.call(this, S, 0);
          }
        }
      }
      (function() {
        try {
          t = typeof setTimeout == "function" ? setTimeout : P;
        } catch {
          t = P;
        }
        try {
          s = typeof clearTimeout == "function" ? clearTimeout : c;
        } catch {
          s = c;
        }
      })();
      var a, i = [], e = !1, k = -1;
      function O() {
        e && a && (e = !1, a.length ? i = a.concat(i) : k = -1, i.length && m());
      }
      function m() {
        if (!e) {
          var S = n(O);
          e = !0;
          for (var x = i.length; x; ) {
            for (a = i, i = []; ++k < x; ) a && a[k].run();
            k = -1, x = i.length;
          }
          a = null, e = !1, function(A) {
            if (s === clearTimeout) return clearTimeout(A);
            if ((s === c || !s) && clearTimeout) return s = clearTimeout, clearTimeout(A);
            try {
              s(A);
            } catch {
              try {
                return s.call(null, A);
              } catch {
                return s.call(this, A);
              }
            }
          }(S);
        }
      }
      function _(S, x) {
        this.fun = S, this.array = x;
      }
      function d() {
      }
      u.nextTick = function(S) {
        var x = new Array(arguments.length - 1);
        if (arguments.length > 1) for (var A = 1; A < arguments.length; A++) x[A - 1] = arguments[A];
        i.push(new _(S, x)), i.length !== 1 || e || n(m);
      }, _.prototype.run = function() {
        this.fun.apply(null, this.array);
      }, u.title = "browser", u.browser = !0, u.env = {}, u.argv = [], u.version = "", u.versions = {}, u.on = d, u.addListener = d, u.once = d, u.off = d, u.removeListener = d, u.removeAllListeners = d, u.emit = d, u.prependListener = d, u.prependOnceListener = d, u.listeners = function(S) {
        return [];
      }, u.binding = function(S) {
        throw new Error("process.binding is not supported");
      }, u.cwd = function() {
        return "/";
      }, u.chdir = function(S) {
        throw new Error("process.chdir is not supported");
      }, u.umask = function() {
        return 0;
      };
    }, function(N, h, t) {
      t.r(h);
      var s = t(26);
      t.d(h, "AlreadyExistsError", function() {
        return s.a;
      });
      var u = t(97);
      t.d(h, "AmbiguousError", function() {
        return u.a;
      });
      var P = t(98);
      t.d(h, "CheckoutConflictError", function() {
        return P.a;
      });
      var c = t(99);
      t.d(h, "CommitNotFetchedError", function() {
        return c.a;
      });
      var n = t(71);
      t.d(h, "EmptyServerResponseError", function() {
        return n.a;
      });
      var a = t(100);
      t.d(h, "FastForwardError", function() {
        return a.a;
      });
      var i = t(101);
      t.d(h, "GitPushError", function() {
        return i.a;
      });
      var e = t(59);
      t.d(h, "HttpError", function() {
        return e.a;
      });
      var k = t(4);
      t.d(h, "InternalError", function() {
        return k.a;
      });
      var O = t(60);
      t.d(h, "InvalidFilepathError", function() {
        return O.a;
      });
      var m = t(32);
      t.d(h, "InvalidOidError", function() {
        return m.a;
      });
      var _ = t(28);
      t.d(h, "InvalidRefNameError", function() {
        return _.a;
      });
      var d = t(102);
      t.d(h, "MaxDepthError", function() {
        return d.a;
      });
      var S = t(56);
      t.d(h, "MergeNotSupportedError", function() {
        return S.a;
      });
      var x = t(57);
      t.d(h, "MergeConflictError", function() {
        return x.a;
      });
      var A = t(21);
      t.d(h, "MissingNameError", function() {
        return A.a;
      });
      var f = t(24);
      t.d(h, "MissingParameterError", function() {
        return f.a;
      });
      var E = t(103);
      t.d(h, "MultipleGitError", function() {
        return E.a;
      });
      var w = t(72);
      t.d(h, "NoRefspecError", function() {
        return w.a;
      });
      var I = t(8);
      t.d(h, "NotFoundError", function() {
        return I.a;
      });
      var T = t(17);
      t.d(h, "ObjectTypeError", function() {
        return T.a;
      });
      var M = t(36);
      t.d(h, "ParseError", function() {
        return M.a;
      });
      var R = t(94);
      t.d(h, "PushRejectedError", function() {
        return R.a;
      });
      var U = t(68);
      t.d(h, "RemoteCapabilityError", function() {
        return U.a;
      });
      var z = t(73);
      t.d(h, "SmartHttpError", function() {
        return z.a;
      });
      var $ = t(74);
      t.d(h, "UnknownTransportError", function() {
        return $.a;
      });
      var H = t(46);
      t.d(h, "UnsafeFilepathError", function() {
        return H.a;
      });
      var nt = t(75);
      t.d(h, "UrlParseError", function() {
        return nt.a;
      });
      var ot = t(58);
      t.d(h, "UserCanceledError", function() {
        return ot.a;
      });
      var V = t(76);
      t.d(h, "UnmergedPathsError", function() {
        return V.a;
      });
      var it = t(104);
      t.d(h, "IndexResetError", function() {
        return it.a;
      });
      var lt = t(105);
      t.d(h, "NoCommitError", function() {
        return lt.a;
      });
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor(c) {
          let n = "";
          c === "not-fast-forward" ? n = " because it was not a simple fast-forward" : c === "tag-exists" && (n = " because tag already exists"), super(`Push rejected${n}. Use "force: true" to override.`), this.code = this.name = u.code, this.data = { reason: c };
        }
      }
      u.code = "PushRejectedError";
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return x;
      });
      var s = t(21), u = t(24), P = t(105), c = t(13), n = t(3), a = t(14), i = t(12), e = t(15), k = t(107), O = t(29), m = t(43), _ = t(65);
      function d(w, I, T, M, R, U, z) {
        try {
          var $ = w[U](z), H = $.value;
        } catch (nt) {
          return void T(nt);
        }
        $.done ? I(H) : Promise.resolve(H).then(M, R);
      }
      function S(w) {
        return function() {
          var I = this, T = arguments;
          return new Promise(function(M, R) {
            var U = w.apply(I, T);
            function z(H) {
              d(U, M, R, z, $, "next", H);
            }
            function $(H) {
              d(U, M, R, z, $, "throw", H);
            }
            z(void 0);
          });
        };
      }
      function x(w) {
        return A.apply(this, arguments);
      }
      function A() {
        return (A = S(function* ({ fs: w, cache: I, onSign: T, gitdir: M, message: R, author: U, committer: z, signingKey: $, amend: H = !1, dryRun: nt = !1, noUpdateBranch: ot = !1, ref: V, parent: it, tree: lt }) {
          let dt, G, Z = !1;
          V || (V = yield n.a.resolve({ fs: w, gitdir: M, ref: "HEAD", depth: 2 }));
          try {
            dt = yield n.a.resolve({ fs: w, gitdir: M, ref: V }), G = yield Object(_.a)({ fs: w, gitdir: M, oid: dt, cache: {} });
          } catch {
            Z = !0;
          }
          if (H && Z) throw new P.a(V);
          const ut = H ? yield Object(O.a)({ fs: w, gitdir: M, author: U, commit: G.commit }) : yield Object(O.a)({ fs: w, gitdir: M, author: U });
          if (!ut) throw new s.a("author");
          const pt = H ? yield Object(m.a)({ fs: w, gitdir: M, author: ut, committer: z, commit: G.commit }) : yield Object(m.a)({ fs: w, gitdir: M, author: ut, committer: z });
          if (!pt) throw new s.a("committer");
          return c.a.acquire({ fs: w, gitdir: M, cache: I, allowUnmerged: !1 }, function() {
            var st = S(function* (mt) {
              const bt = Object(k.a)(mt.entries).get(".");
              if (lt || (lt = yield f({ fs: w, gitdir: M, inode: bt, dryRun: nt })), it = it ? yield Promise.all(it.map((F) => n.a.resolve({ fs: w, gitdir: M, ref: F }))) : H ? G.commit.parent : dt ? [dt] : [], !R) {
                if (!H) throw new u.a("message");
                R = G.commit.message;
              }
              let wt = a.a.from({ tree: lt, parent: it, author: ut, committer: pt, message: R });
              $ && (wt = yield a.a.sign(wt, T, $));
              const C = yield Object(e.a)({ fs: w, gitdir: M, type: "commit", object: wt.toObject(), dryRun: nt });
              return ot || nt || (yield n.a.writeRef({ fs: w, gitdir: M, ref: V, value: C })), C;
            });
            return function(mt) {
              return st.apply(this, arguments);
            };
          }());
        })).apply(this, arguments);
      }
      function f(w) {
        return E.apply(this, arguments);
      }
      function E() {
        return (E = S(function* ({ fs: w, gitdir: I, inode: T, dryRun: M }) {
          const R = T.children;
          for (const $ of R) $.type === "tree" && ($.metadata.mode = "040000", $.metadata.oid = yield f({ fs: w, gitdir: I, inode: $, dryRun: M }));
          const U = R.map(($) => ({ mode: $.metadata.mode, path: $.basename, oid: $.metadata.oid, type: $.type })), z = i.a.from(U);
          return yield Object(e.a)({ fs: w, gitdir: I, type: "tree", object: z.toObject(), dryRun: M });
        })).apply(this, arguments);
      }
    }, function(N, h, t) {
      N.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor(c, n, a) {
          super(`Found multiple ${c} matching "${n}" (${a.join(", ")}). Use a longer abbreviation length to disambiguate them.`), this.code = this.name = u.code, this.data = { nouns: c, short: n, matches: a };
        }
      }
      u.code = "AmbiguousError";
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor(c) {
          super(`Your local changes to the following files would be overwritten by checkout: ${c.join(", ")}`), this.code = this.name = u.code, this.data = { filepaths: c };
        }
      }
      u.code = "CheckoutConflictError";
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor(c, n) {
          super(`Failed to checkout "${c}" because commit ${n} is not available locally. Do a git fetch to make the branch available locally.`), this.code = this.name = u.code, this.data = { ref: c, oid: n };
        }
      }
      u.code = "CommitNotFetchedError";
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor() {
          super("A simple fast-forward merge was not possible."), this.code = this.name = u.code, this.data = {};
        }
      }
      u.code = "FastForwardError";
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor(c, n) {
          super(`One or more branches were not updated: ${c}`), this.code = this.name = u.code, this.data = { prettyDetails: c, result: n };
        }
      }
      u.code = "GitPushError";
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor(c) {
          super(`Maximum search depth of ${c} exceeded.`), this.code = this.name = u.code, this.data = { depth: c };
        }
      }
      u.code = "MaxDepthError";
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor(c) {
          super('There are multiple errors that were thrown by the method. Please refer to the "errors" property to see more'), this.code = this.name = u.code, this.data = { errors: c }, this.errors = c;
        }
      }
      u.code = "MultipleGitError";
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor(c) {
          super(`Could not merge index: Entry for '${c}' is not up to date. Either reset the index entry to HEAD, or stage your unstaged changes.`), this.code = this.name = u.code, this.data = { filepath: c };
        }
      }
      u.code = "IndexResetError";
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(1);
      class u extends s.a {
        constructor(c) {
          super(`"${c}" does not point to any commit. You're maybe working on a repository with no commits yet. `), this.code = this.name = u.code, this.data = { ref: c };
        }
      }
      u.code = "NoCommitError";
    }, function(N, h, t) {
      (function(s) {
        t.d(h, "a", function() {
          return O;
        });
        var u = t(4), P = t(46), c = t(20), n = t(61), a = t(34), i = t(19);
        function e(m, _, d, S, x, A, f) {
          try {
            var E = m[A](f), w = E.value;
          } catch (I) {
            return void d(I);
          }
          E.done ? _(w) : Promise.resolve(w).then(S, x);
        }
        function k(m) {
          return function() {
            var _ = this, d = arguments;
            return new Promise(function(S, x) {
              var A = m.apply(_, d);
              function f(w) {
                e(A, S, x, f, E, "next", w);
              }
              function E(w) {
                e(A, S, x, f, E, "throw", w);
              }
              f(void 0);
            });
          };
        }
        class O {
          constructor(_, d) {
            this._dirty = !1, this._unmergedPaths = d || /* @__PURE__ */ new Set(), this._entries = _ || /* @__PURE__ */ new Map();
          }
          _addEntry(_) {
            if (_.flags.stage === 0) _.stages = [_], this._entries.set(_.path, _), this._unmergedPaths.delete(_.path);
            else {
              let d = this._entries.get(_.path);
              d || (this._entries.set(_.path, _), d = _), d.stages[_.flags.stage] = _, this._unmergedPaths.add(_.path);
            }
          }
          static from(_) {
            return k(function* () {
              if (s.isBuffer(_)) return O.fromBuffer(_);
              if (_ === null) return new O(null);
              throw new u.a("invalid type passed to GitIndex.from");
            })();
          }
          static fromBuffer(_) {
            return k(function* () {
              if (_.length === 0) throw new u.a("Index file is empty (.git/index)");
              const d = new O(), S = new c.a(_), x = S.toString("utf8", 4);
              if (x !== "DIRC") throw new u.a(`Invalid dircache magic file number: ${x}`);
              const A = yield Object(i.a)(_.slice(0, -20)), f = _.slice(-20).toString("hex");
              if (f !== A) throw new u.a(`Invalid checksum in GitIndex buffer: expected ${f} but saw ${A}`);
              const E = S.readUInt32BE();
              if (E !== 2) throw new u.a(`Unsupported dircache version: ${E}`);
              const w = S.readUInt32BE();
              let I = 0;
              for (; !S.eof() && I < w; ) {
                const M = {};
                M.ctimeSeconds = S.readUInt32BE(), M.ctimeNanoseconds = S.readUInt32BE(), M.mtimeSeconds = S.readUInt32BE(), M.mtimeNanoseconds = S.readUInt32BE(), M.dev = S.readUInt32BE(), M.ino = S.readUInt32BE(), M.mode = S.readUInt32BE(), M.uid = S.readUInt32BE(), M.gid = S.readUInt32BE(), M.size = S.readUInt32BE(), M.oid = S.slice(20).toString("hex");
                const R = S.readUInt16BE();
                M.flags = (T = R, { assumeValid: !!(32768 & T), extended: !!(16384 & T), stage: (12288 & T) >> 12, nameLength: 4095 & T });
                const U = _.indexOf(0, S.tell() + 1) - S.tell();
                if (U < 1) throw new u.a(`Got a path length of: ${U}`);
                if (M.path = S.toString("utf8", U), M.path.includes("..\\") || M.path.includes("../")) throw new P.a(M.path);
                let z = 8 - (S.tell() - 12) % 8;
                for (z === 0 && (z = 8); z--; ) {
                  const $ = S.readUInt8();
                  if ($ !== 0) throw new u.a(`Expected 1-8 null characters but got '${$}' after ${M.path}`);
                  if (S.eof()) throw new u.a("Unexpected end of file");
                }
                M.stages = [], d._addEntry(M), I++;
              }
              var T;
              return d;
            })();
          }
          get unmergedPaths() {
            return [...this._unmergedPaths];
          }
          get entries() {
            return [...this._entries.values()].sort(n.a);
          }
          get entriesMap() {
            return this._entries;
          }
          get entriesFlat() {
            return [...this.entries].flatMap((_) => _.stages.length > 1 ? _.stages.filter((d) => d) : _);
          }
          *[Symbol.iterator]() {
            for (const _ of this.entries) yield _;
          }
          insert({ filepath: _, stats: d, oid: S, stage: x = 0 }) {
            d || (d = { ctimeSeconds: 0, ctimeNanoseconds: 0, mtimeSeconds: 0, mtimeNanoseconds: 0, dev: 0, ino: 0, mode: 0, uid: 0, gid: 0, size: 0 }), d = Object(a.a)(d);
            const A = s.from(_), f = { ctimeSeconds: d.ctimeSeconds, ctimeNanoseconds: d.ctimeNanoseconds, mtimeSeconds: d.mtimeSeconds, mtimeNanoseconds: d.mtimeNanoseconds, dev: d.dev, ino: d.ino, mode: d.mode || 33188, uid: d.uid, gid: d.gid, size: d.size, path: _, oid: S, flags: { assumeValid: !1, extended: !1, stage: x, nameLength: A.length < 4095 ? A.length : 4095 }, stages: [] };
            this._addEntry(f), this._dirty = !0;
          }
          delete({ filepath: _ }) {
            if (this._entries.has(_)) this._entries.delete(_);
            else for (const d of this._entries.keys()) d.startsWith(_ + "/") && this._entries.delete(d);
            this._unmergedPaths.has(_) && this._unmergedPaths.delete(_), this._dirty = !0;
          }
          clear() {
            this._entries.clear(), this._dirty = !0;
          }
          has({ filepath: _ }) {
            return this._entries.has(_);
          }
          render() {
            return this.entries.map((_) => `${_.mode.toString(8)} ${_.oid}    ${_.path}`).join(`
`);
          }
          static _entryToBuffer(_) {
            return k(function* () {
              const d = s.from(_.path), S = 8 * Math.ceil((62 + d.length + 1) / 8), x = s.alloc(S), A = new c.a(x), f = Object(a.a)(_);
              return A.writeUInt32BE(f.ctimeSeconds), A.writeUInt32BE(f.ctimeNanoseconds), A.writeUInt32BE(f.mtimeSeconds), A.writeUInt32BE(f.mtimeNanoseconds), A.writeUInt32BE(f.dev), A.writeUInt32BE(f.ino), A.writeUInt32BE(f.mode), A.writeUInt32BE(f.uid), A.writeUInt32BE(f.gid), A.writeUInt32BE(f.size), A.write(_.oid, 20, "hex"), A.writeUInt16BE(function(E) {
                const w = E.flags;
                return w.extended = !1, w.nameLength = Math.min(s.from(E.path).length, 4095), (w.assumeValid ? 32768 : 0) + (w.extended ? 16384 : 0) + ((3 & w.stage) << 12) + (4095 & w.nameLength);
              }(_)), A.write(_.path, d.length, "utf8"), x;
            })();
          }
          toObject() {
            var _ = this;
            return k(function* () {
              const d = s.alloc(12), S = new c.a(d);
              S.write("DIRC", 4, "utf8"), S.writeUInt32BE(2), S.writeUInt32BE(_.entriesFlat.length);
              let x = [];
              for (const w of _.entries) if (x.push(O._entryToBuffer(w)), w.stages.length > 1) for (const I of w.stages) I && I !== w && x.push(O._entryToBuffer(I));
              x = yield Promise.all(x);
              const A = s.concat(x), f = s.concat([d, A]), E = yield Object(i.a)(f);
              return s.concat([f, s.from(E, "hex")]);
            })();
          }
        }
      }).call(this, t(10).Buffer);
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return P;
      });
      var s = t(40), u = t(27);
      function P(c) {
        const n = /* @__PURE__ */ new Map(), a = function(e) {
          if (!n.has(e)) {
            const k = { type: "tree", fullpath: e, basename: Object(s.a)(e), metadata: {}, children: [] };
            n.set(e, k), k.parent = a(Object(u.a)(e)), k.parent && k.parent !== k && k.parent.children.push(k);
          }
          return n.get(e);
        }, i = function(e, k) {
          if (!n.has(e)) {
            const O = { type: "blob", fullpath: e, basename: Object(s.a)(e), metadata: k, parent: a(Object(u.a)(e)), children: [] };
            O.parent && O.parent.children.push(O), n.set(e, O);
          }
          return n.get(e);
        };
        a(".");
        for (const e of c) i(e.path, e);
        return n;
      }
    }, function(N, h, t) {
      function s(f, E, w, I, T, M, R) {
        try {
          var U = f[M](R), z = U.value;
        } catch ($) {
          return void w($);
        }
        U.done ? E(z) : Promise.resolve(z).then(I, T);
      }
      function u(f) {
        return function() {
          var E = this, w = arguments;
          return new Promise(function(I, T) {
            var M = f.apply(E, w);
            function R(z) {
              s(M, I, T, R, U, "next", z);
            }
            function U(z) {
              s(M, I, T, R, U, "throw", z);
            }
            R(void 0);
          });
        };
      }
      t.d(h, "a", function() {
        return A;
      });
      const P = (f) => {
        if ((f = f.trim().toLowerCase()) === "true" || f === "yes" || f === "on") return !0;
        if (f === "false" || f === "no" || f === "off") return !1;
        throw Error(`Expected 'true', 'false', 'yes', 'no', 'on', or 'off', but got ${f}`);
      }, c = { core: { filemode: P, bare: P, logallrefupdates: P, symlinks: P, ignorecase: P, bigFileThreshold: (f) => {
        f = f.toLowerCase();
        let E = parseInt(f);
        return f.endsWith("k") && (E *= 1024), f.endsWith("m") && (E *= 1048576), f.endsWith("g") && (E *= 1073741824), E;
      } } }, n = /^\[([A-Za-z0-9-.]+)(?: "(.*)")?\]$/, a = /^[A-Za-z0-9-.]+$/, i = /^([A-Za-z][A-Za-z-]*)(?: *= *(.*))?$/, e = /^[A-Za-z][A-Za-z-]*$/, k = /^(.*?)( *[#;].*)$/, O = (f) => {
        const E = k.exec(f);
        if (E == null) return f;
        const [w, I] = E.slice(1);
        return m(w) && m(I) ? `${w}${I}` : w;
      }, m = (f) => (f.match(/(?:^|[^\\])"/g) || []).length % 2 != 0, _ = (f) => f.split("").reduce((E, w, I, T) => {
        const M = w === '"' && T[I - 1] !== "\\", R = w === "\\" && T[I + 1] === '"';
        return M || R ? E : E + w;
      }, ""), d = (f) => f != null ? f.toLowerCase() : null, S = (f, E, w) => [d(f), E, d(w)].filter((I) => I != null).join("."), x = (f) => {
        const E = f.split("."), w = E.shift(), I = E.pop(), T = E.length ? E.join(".") : void 0;
        return { section: w, subsection: T, name: I, path: S(w, T, I), sectionPath: S(w, T, null) };
      };
      class A {
        constructor(E) {
          let w = null, I = null;
          this.parsedConfig = E ? E.split(`
`).map((T) => {
            let M = null, R = null;
            const U = T.trim(), z = ((nt) => {
              const ot = n.exec(nt);
              if (ot != null) {
                const [V, it] = ot.slice(1);
                return [V, it];
              }
              return null;
            })(U), $ = z != null;
            if ($) [w, I] = z;
            else {
              const nt = ((ot) => {
                const V = i.exec(ot);
                if (V != null) {
                  const [it, lt = "true"] = V.slice(1), dt = O(lt);
                  return [it, _(dt)];
                }
                return null;
              })(U);
              nt != null && ([M, R] = nt);
            }
            const H = S(w, I, M);
            return { line: T, isSection: $, section: w, subsection: I, name: M, value: R, path: H };
          }) : [];
        }
        static from(E) {
          return new A(E);
        }
        get(E, w = !1) {
          var I = this;
          return u(function* () {
            const T = x(E).path, M = I.parsedConfig.filter((R) => R.path === T).map(({ section: R, name: U, value: z }) => {
              const $ = c[R] && c[R][U];
              return $ ? $(z) : z;
            });
            return w ? M : M.pop();
          })();
        }
        getall(E) {
          var w = this;
          return u(function* () {
            return w.get(E, !0);
          })();
        }
        getSubsections(E) {
          var w = this;
          return u(function* () {
            return w.parsedConfig.filter((I) => I.section === E && I.isSection).map((I) => I.subsection);
          })();
        }
        deleteSection(E, w) {
          var I = this;
          return u(function* () {
            I.parsedConfig = I.parsedConfig.filter((T) => !(T.section === E && T.subsection === w));
          })();
        }
        append(E, w) {
          var I = this;
          return u(function* () {
            return I.set(E, w, !0);
          })();
        }
        set(E, w, I = !1) {
          var T = this;
          return u(function* () {
            const { section: M, subsection: R, name: U, path: z, sectionPath: $ } = x(E), H = (nt = T.parsedConfig, ot = (V) => V.path === z, nt.reduce((V, it, lt) => ot(it) ? lt : V, -1));
            var nt, ot;
            if (w == null) H !== -1 && T.parsedConfig.splice(H, 1);
            else if (H !== -1) {
              const V = T.parsedConfig[H], it = Object.assign({}, V, { name: U, value: w, modified: !0 });
              I ? T.parsedConfig.splice(H + 1, 0, it) : T.parsedConfig[H] = it;
            } else {
              const V = T.parsedConfig.findIndex((lt) => lt.path === $), it = { section: M, subsection: R, name: U, value: w, modified: !0, path: z };
              if (a.test(M) && e.test(U)) if (V >= 0) T.parsedConfig.splice(V + 1, 0, it);
              else {
                const lt = { section: M, subsection: R, modified: !0, path: $ };
                T.parsedConfig.push(lt, it);
              }
            }
          })();
        }
        toString() {
          return this.parsedConfig.map(({ line: E, section: w, subsection: I, name: T, value: M, modified: R = !1 }) => R ? T != null && M != null ? typeof M == "string" && /[#;]/.test(M) ? `	${T} = "${M}"` : `	${T} = ${M}` : I != null ? `[${w} "${I}"]` : `[${w}]` : E).join(`
`);
        }
      }
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(80);
      class u {
        constructor(c = []) {
          this.rules = c;
        }
        static from(c) {
          const n = [];
          for (const a of c) n.push(s.a.from(a));
          return new u(n);
        }
        add(c) {
          const n = s.a.from(c);
          this.rules.push(n);
        }
        translate(c) {
          const n = [];
          for (const a of this.rules) for (const i of c) {
            const e = a.translate(i);
            e && n.push([i, e]);
          }
          return n;
        }
        translateOne(c) {
          let n = null;
          for (const a of this.rules) {
            const i = a.translate(c);
            i && (n = i);
          }
          return n;
        }
        localNamespaces() {
          return this.rules.filter((c) => c.matchPrefix).map((c) => c.localPath.replace(/\/$/, ""));
        }
      }
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return a;
      });
      var s = t(4), u = t(81), P = t(16);
      function c(e, k, O, m, _, d, S) {
        try {
          var x = e[d](S), A = x.value;
        } catch (f) {
          return void O(f);
        }
        x.done ? k(A) : Promise.resolve(A).then(m, _);
      }
      function n(e) {
        return function() {
          var k = this, O = arguments;
          return new Promise(function(m, _) {
            var d = e.apply(k, O);
            function S(A) {
              c(d, m, _, S, x, "next", A);
            }
            function x(A) {
              c(d, m, _, S, x, "throw", A);
            }
            S(void 0);
          });
        };
      }
      function a(e) {
        return i.apply(this, arguments);
      }
      function i() {
        return (i = n(function* ({ fs: e, cache: k, gitdir: O, oid: m, format: _ = "content", getExternalRefDelta: d }) {
          let S = yield e.readdir(Object(P.join)(O, "objects/pack"));
          S = S.filter((x) => x.endsWith(".idx"));
          for (const x of S) {
            const A = `${O}/objects/pack/${x}`, f = yield Object(u.a)({ fs: e, cache: k, filename: A, getExternalRefDelta: d });
            if (f.error) throw new s.a(f.error);
            if (f.offsets.has(m)) {
              if (!f.pack) {
                const w = A.replace(/idx$/, "pack");
                f.pack = e.read(w);
              }
              const E = yield f.read({ oid: m, getExternalRefDelta: d });
              return E.format = "content", E.source = `objects/pack/${x.replace(/idx$/, "pack")}`, E;
            }
          }
          return null;
        })).apply(this, arguments);
      }
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return c;
      });
      var s = t(139), u = t.n(s);
      const P = /^.*(\r?\n|$)/gm;
      function c({ branches: n, contents: a }) {
        const i = n[1], e = n[2], k = a[0], O = a[1], m = a[2], _ = O.match(P), d = k.match(P), S = m.match(P), x = u()(_, d, S);
        let A = "", f = !0;
        for (const E of x) E.ok && (A += E.ok.join("")), E.conflict && (f = !1, A += `${"<".repeat(7)} ${i}
`, A += E.conflict.a.join(""), A += `${"=".repeat(7)}
`, A += E.conflict.b.join(""), A += `${">".repeat(7)} ${e}
`);
        return { cleanMerge: f, mergedText: A };
      }
    }, function(N, h, t) {
      (function(s) {
        t.d(h, "a", function() {
          return m;
        });
        var u = t(78), P = t.n(u), c = t(140), n = t(7), a = t(84), i = t(16), e = t(50);
        function k(d, S, x, A, f, E, w) {
          try {
            var I = d[E](w), T = I.value;
          } catch (M) {
            return void x(M);
          }
          I.done ? S(T) : Promise.resolve(T).then(A, f);
        }
        function O(d) {
          return function() {
            var S = this, x = arguments;
            return new Promise(function(A, f) {
              var E = d.apply(S, x);
              function w(T) {
                k(E, A, f, w, I, "next", T);
              }
              function I(T) {
                k(E, A, f, w, I, "throw", T);
              }
              w(void 0);
            });
          };
        }
        function m(d) {
          return _.apply(this, arguments);
        }
        function _() {
          return (_ = O(function* ({ fs: d, cache: S, dir: x, gitdir: A = Object(i.join)(x, ".git"), oids: f }) {
            const E = new P.a(), w = [];
            function I(U, z) {
              const $ = s.from(U, z);
              w.push($), E.update($);
            }
            function T(U) {
              return M.apply(this, arguments);
            }
            function M() {
              return (M = O(function* ({ stype: U, object: z }) {
                const $ = c.a[U];
                let H = z.length, nt = H > 15 ? 128 : 0;
                const ot = 15 & H;
                H >>>= 4;
                let V = (nt | $ | ot).toString(16);
                for (I(V, "hex"); nt; ) nt = H > 127 ? 128 : 0, V = nt | 127 & H, I(Object(e.a)(2, V), "hex"), H >>>= 7;
                I(s.from(yield Object(a.a)(z)));
              })).apply(this, arguments);
            }
            I("PACK"), I("00000002", "hex"), I(Object(e.a)(8, f.length), "hex");
            for (const U of f) {
              const { type: z, object: $ } = yield Object(n.a)({ fs: d, cache: S, gitdir: A, oid: U });
              yield T({ write: I, object: $, stype: z });
            }
            const R = E.digest();
            return w.push(R), w;
          })).apply(this, arguments);
        }
      }).call(this, t(10).Buffer);
    }, function(N, h, t) {
      function s(n, a, i, e, k, O, m) {
        try {
          var _ = n[O](m), d = _.value;
        } catch (S) {
          return void i(S);
        }
        _.done ? a(d) : Promise.resolve(d).then(e, k);
      }
      function u(n) {
        return function() {
          var a = this, i = arguments;
          return new Promise(function(e, k) {
            var O = n.apply(a, i);
            function m(d) {
              s(O, e, k, m, _, "next", d);
            }
            function _(d) {
              s(O, e, k, m, _, "throw", d);
            }
            m(void 0);
          });
        };
      }
      function P(n) {
        return c.apply(this, arguments);
      }
      function c() {
        return (c = u(function* ({ fs: n, gitdir: a, oid: i }) {
          const e = `objects/${i.slice(0, 2)}/${i.slice(2)}`, k = yield n.read(`${a}/${e}`);
          return k ? { object: k, format: "deflated", source: e } : null;
        })).apply(this, arguments);
      }
      t.d(h, "a", function() {
        return P;
      });
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return s;
      });
      const s = Array.prototype.flat === void 0 ? (u) => u.reduce((P, c) => P.concat(c), []) : (u) => u.flat();
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return e;
      });
      var s = t(18), u = t(14), P = t(12), c = t(7), n = t(16);
      function a(O, m, _, d, S, x, A) {
        try {
          var f = O[x](A), E = f.value;
        } catch (w) {
          return void _(w);
        }
        f.done ? m(E) : Promise.resolve(E).then(d, S);
      }
      function i(O) {
        return function() {
          var m = this, _ = arguments;
          return new Promise(function(d, S) {
            var x = O.apply(m, _);
            function A(E) {
              a(x, d, S, A, f, "next", E);
            }
            function f(E) {
              a(x, d, S, A, f, "throw", E);
            }
            A(void 0);
          });
        };
      }
      function e(O) {
        return k.apply(this, arguments);
      }
      function k() {
        return (k = i(function* ({ fs: O, cache: m, dir: _, gitdir: d = Object(n.join)(_, ".git"), oids: S }) {
          const x = /* @__PURE__ */ new Set();
          function A(E) {
            return f.apply(this, arguments);
          }
          function f() {
            return (f = i(function* (E) {
              if (x.has(E)) return;
              x.add(E);
              const { type: w, object: I } = yield Object(c.a)({ fs: O, cache: m, gitdir: d, oid: E });
              if (w === "tag") {
                const T = s.a.from(I).headers().object;
                yield A(T);
              } else if (w === "commit") {
                const T = u.a.from(I).headers().tree;
                yield A(T);
              } else if (w === "tree") {
                const T = P.a.from(I);
                for (const M of T) M.type === "blob" && x.add(M.oid), M.type === "tree" && (yield A(M.oid));
              }
            })).apply(this, arguments);
          }
          for (const E of S) yield A(E);
          return x;
        })).apply(this, arguments);
      }
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return c;
      });
      var s = t(16);
      function u(a, i, e, k, O, m, _) {
        try {
          var d = a[m](_), S = d.value;
        } catch (x) {
          return void e(x);
        }
        d.done ? i(S) : Promise.resolve(S).then(k, O);
      }
      function P(a) {
        return function() {
          var i = this, e = arguments;
          return new Promise(function(k, O) {
            var m = a.apply(i, e);
            function _(S) {
              u(m, k, O, _, d, "next", S);
            }
            function d(S) {
              u(m, k, O, _, d, "throw", S);
            }
            _(void 0);
          });
        };
      }
      function c(a, i) {
        return n.apply(this, arguments);
      }
      function n() {
        return (n = P(function* (a, i) {
          const e = yield a.readdir(i);
          e == null ? yield a.rm(i) : e.length ? yield Promise.all(e.map((k) => {
            const O = Object(s.join)(i, k);
            return a.lstat(O).then((m) => {
              if (m) return m.isDirectory() ? c(a, O) : a.rm(O);
            });
          })).then(() => a.rmdir(i)) : yield a.rmdir(i);
        })).apply(this, arguments);
      }
    }, function(N, h, t) {
      function s(u) {
        let P = u.match(/^https?:\/\/([^/]+)@/);
        if (P == null) return { url: u, auth: {} };
        P = P[1];
        const [c, n] = P.split(":");
        return { url: u = u.replace(`${P}@`, ""), auth: { username: c, password: n } };
      }
      t.d(h, "a", function() {
        return s;
      });
    }, function(N, h, t) {
      (function(s) {
        t.d(h, "a", function() {
          return z;
        });
        var u = t(35), P = t(24), c = t(68), n = t(11), a = t(3), i = t(63), e = t(44), k = t(14), O = t(62), m = t(161), _ = t(7), d = t(66), S = t(52), x = t(164), A = t(141), f = t(39), E = t(16), w = t(48), I = t(142), T = t(126), M = t(125);
        function R(H, nt, ot, V, it, lt, dt) {
          try {
            var G = H[lt](dt), Z = G.value;
          } catch (ut) {
            return void ot(ut);
          }
          G.done ? nt(Z) : Promise.resolve(Z).then(V, it);
        }
        function U(H) {
          return function() {
            var nt = this, ot = arguments;
            return new Promise(function(V, it) {
              var lt = H.apply(nt, ot);
              function dt(Z) {
                R(lt, V, it, dt, G, "next", Z);
              }
              function G(Z) {
                R(lt, V, it, dt, G, "throw", Z);
              }
              dt(void 0);
            });
          };
        }
        function z(H) {
          return $.apply(this, arguments);
        }
        function $() {
          return ($ = U(function* ({ fs: H, cache: nt, http: ot, onProgress: V, onMessage: it, onAuth: lt, onAuthSuccess: dt, onAuthFailure: G, gitdir: Z, ref: ut, remoteRef: pt, remote: st, url: mt, corsProxy: bt, depth: wt = null, since: C = null, exclude: F = [], relative: L = !1, tags: K = !1, singleBranch: X = !1, headers: rt = {}, prune: yt = !1, pruneTags: kt = !1 }) {
            const At = ut || (yield Object(u.a)({ fs: H, gitdir: Z, test: !0 })), Tt = yield n.a.get({ fs: H, gitdir: Z }), Et = st || At && (yield Tt.get(`branch.${At}.remote`)) || "origin", Wt = mt || (yield Tt.get(`remote.${Et}.url`));
            if (Wt === void 0) throw new P.a("remote OR url");
            const Vt = pt || At && (yield Tt.get(`branch.${At}.merge`)) || ut || "HEAD";
            bt === void 0 && (bt = yield Tt.get("http.corsProxy"));
            const re = i.a.getRemoteHelperFor({ url: Wt }), vt = yield re.discover({ http: ot, onAuth: lt, onAuthSuccess: dt, onAuthFailure: G, corsProxy: bt, service: "git-upload-pack", url: Wt, headers: rt, protocolVersion: 1 }), Zt = vt.auth, Dt = vt.refs;
            if (Dt.size === 0) return { defaultBranch: null, fetchHead: null, fetchHeadDescription: null };
            if (wt !== null && !vt.capabilities.has("shallow")) throw new c.a("shallow", "depth");
            if (C !== null && !vt.capabilities.has("deepen-since")) throw new c.a("deepen-since", "since");
            if (F.length > 0 && !vt.capabilities.has("deepen-not")) throw new c.a("deepen-not", "exclude");
            if (L === !0 && !vt.capabilities.has("deepen-relative")) throw new c.a("deepen-relative", "relative");
            const { oid: qt, fullref: pe } = a.a.resolveAgainstMap({ ref: Vt, map: Dt });
            for (const xt of Dt.keys()) xt === pe || xt === "HEAD" || xt.startsWith("refs/heads/") || K && xt.startsWith("refs/tags/") || Dt.delete(xt);
            const De = Object(A.a)([...vt.capabilities], ["multi_ack_detailed", "no-done", "side-band-64k", "ofs-delta", `agent=${w.a.agent}`]);
            L && De.push("deepen-relative");
            const oe = X ? [qt] : Dt.values(), Me = X ? [At] : yield a.a.listRefs({ fs: H, gitdir: Z, filepath: "refs" });
            let W = [];
            for (let xt of Me) try {
              xt = yield a.a.expand({ fs: H, gitdir: Z, ref: xt });
              const Kt = yield a.a.resolve({ fs: H, gitdir: Z, ref: xt });
              (yield Object(m.a)({ fs: H, cache: nt, gitdir: Z, oid: Kt })) && W.push(Kt);
            } catch {
            }
            W = [...new Set(W)];
            const B = yield e.a.read({ fs: H, gitdir: Z }), D = vt.capabilities.has("shallow") ? [...B] : [], Y = Object(M.a)({ capabilities: De, wants: oe, haves: W, shallows: D, depth: wt, since: C, exclude: F }), tt = s.from(yield Object(S.a)(Y)), at = yield re.connect({ http: ot, onProgress: V, corsProxy: bt, service: "git-upload-pack", url: Wt, auth: Zt, body: [tt], headers: rt }), ct = yield Object(T.a)(at.body);
            at.headers && (ct.headers = at.headers);
            for (const xt of ct.shallows) if (!B.has(xt)) try {
              const { object: Kt } = yield Object(_.a)({ fs: H, cache: nt, gitdir: Z, oid: xt }), ae = new k.a(Kt), Jt = yield Promise.all(ae.headers().parent.map((_e) => Object(m.a)({ fs: H, cache: nt, gitdir: Z, oid: _e })));
              Jt.length === 0 || Jt.every((_e) => _e) || B.add(xt);
            } catch {
              B.add(xt);
            }
            for (const xt of ct.unshallows) B.delete(xt);
            if (yield e.a.write({ fs: H, gitdir: Z, oids: B }), X) {
              const xt = /* @__PURE__ */ new Map([[pe, qt]]), Kt = /* @__PURE__ */ new Map();
              let ae = 10, Jt = pe;
              for (; ae--; ) {
                const Be = vt.symrefs.get(Jt);
                if (Be === void 0) break;
                Kt.set(Jt, Be), Jt = Be;
              }
              const _e = Dt.get(Jt);
              _e && xt.set(Jt, _e);
              const { pruned: le } = yield a.a.updateRemoteRefs({ fs: H, gitdir: Z, remote: Et, refs: xt, symrefs: Kt, tags: K, prune: yt });
              yt && (ct.pruned = le);
            } else {
              const { pruned: xt } = yield a.a.updateRemoteRefs({ fs: H, gitdir: Z, remote: Et, refs: Dt, symrefs: vt.symrefs, tags: K, prune: yt, pruneTags: kt });
              yt && (ct.pruned = xt);
            }
            if (ct.HEAD = vt.symrefs.get("HEAD"), ct.HEAD === void 0) {
              const { oid: xt } = a.a.resolveAgainstMap({ ref: "HEAD", map: Dt });
              for (const [Kt, ae] of Dt.entries()) if (Kt !== "HEAD" && ae === xt) {
                ct.HEAD = Kt;
                break;
              }
            }
            const Bt = pe.startsWith("refs/tags") ? "tag" : "branch";
            if (ct.FETCH_HEAD = { oid: qt, description: `${Bt} '${Object(d.a)(pe)}' of ${Wt}` }, V || it) {
              const xt = Object(I.a)(ct.progress);
              Object(f.a)(xt, function() {
                var Kt = U(function* (ae) {
                  if (it && (yield it(ae)), V) {
                    const Jt = ae.match(/([^:]*).*\((\d+?)\/(\d+?)\)/);
                    Jt && (yield V({ phase: Jt[1].trim(), loaded: parseInt(Jt[2], 10), total: parseInt(Jt[3], 10) }));
                  }
                });
                return function(ae) {
                  return Kt.apply(this, arguments);
                };
              }());
            }
            const zt = s.from(yield Object(S.a)(ct.packfile));
            if (at.body.error) throw at.body.error;
            const Ft = zt.slice(-20).toString("hex"), Ut = { defaultBranch: ct.HEAD, fetchHead: ct.FETCH_HEAD.oid, fetchHeadDescription: ct.FETCH_HEAD.description };
            if (ct.headers && (Ut.headers = ct.headers), yt && (Ut.pruned = ct.pruned), Ft !== "" && !Object(x.a)(zt)) {
              Ut.packfile = `objects/pack/pack-${Ft}.pack`;
              const xt = Object(E.join)(Z, Ut.packfile);
              yield H.write(xt, zt);
              const Kt = (Jt) => Object(_.a)({ fs: H, cache: nt, gitdir: Z, oid: Jt }), ae = yield O.a.fromPack({ pack: zt, getExternalRefDelta: Kt, onProgress: V });
              yield H.write(xt.replace(/\.pack$/, ".idx"), yield ae.toBuffer());
            }
            return Ut;
          })).apply(this, arguments);
        }
      }).call(this, t(10).Buffer);
    }, function(N, h, t) {
      var s = t(10), u = s.Buffer;
      function P(n, a) {
        for (var i in n) a[i] = n[i];
      }
      function c(n, a, i) {
        return u(n, a, i);
      }
      u.from && u.alloc && u.allocUnsafe && u.allocUnsafeSlow ? N.exports = s : (P(s, h), h.Buffer = c), P(u, c), c.from = function(n, a, i) {
        if (typeof n == "number") throw new TypeError("Argument must not be a number");
        return u(n, a, i);
      }, c.alloc = function(n, a, i) {
        if (typeof n != "number") throw new TypeError("Argument must be a number");
        var e = u(n);
        return a !== void 0 ? typeof i == "string" ? e.fill(a, i) : e.fill(a) : e.fill(0), e;
      }, c.allocUnsafe = function(n) {
        if (typeof n != "number") throw new TypeError("Argument must be a number");
        return u(n);
      }, c.allocUnsafeSlow = function(n) {
        if (typeof n != "number") throw new TypeError("Argument must be a number");
        return s.SlowBuffer(n);
      };
    }, function(N, h, t) {
      N.exports = function(s, u, P, c) {
        for (var n = 65535 & s | 0, a = s >>> 16 & 65535 | 0, i = 0; P !== 0; ) {
          P -= i = P > 2e3 ? 2e3 : P;
          do
            a = a + (n = n + u[c++] | 0) | 0;
          while (--i);
          n %= 65521, a %= 65521;
        }
        return n | a << 16 | 0;
      };
    }, function(N, h, t) {
      var s = function() {
        for (var u, P = [], c = 0; c < 256; c++) {
          u = c;
          for (var n = 0; n < 8; n++) u = 1 & u ? 3988292384 ^ u >>> 1 : u >>> 1;
          P[c] = u;
        }
        return P;
      }();
      N.exports = function(u, P, c, n) {
        var a = s, i = n + c;
        u ^= -1;
        for (var e = n; e < i; e++) u = u >>> 8 ^ a[255 & (u ^ P[e])];
        return -1 ^ u;
      };
    }, function(N, h, t) {
      var s = t(31), u = !0, P = !0;
      try {
        String.fromCharCode.apply(null, [0]);
      } catch {
        u = !1;
      }
      try {
        String.fromCharCode.apply(null, new Uint8Array(1));
      } catch {
        P = !1;
      }
      for (var c = new s.Buf8(256), n = 0; n < 256; n++) c[n] = n >= 252 ? 6 : n >= 248 ? 5 : n >= 240 ? 4 : n >= 224 ? 3 : n >= 192 ? 2 : 1;
      function a(i, e) {
        if (e < 65534 && (i.subarray && P || !i.subarray && u)) return String.fromCharCode.apply(null, s.shrinkBuf(i, e));
        for (var k = "", O = 0; O < e; O++) k += String.fromCharCode(i[O]);
        return k;
      }
      c[254] = c[254] = 1, h.string2buf = function(i) {
        var e, k, O, m, _, d = i.length, S = 0;
        for (m = 0; m < d; m++) (64512 & (k = i.charCodeAt(m))) == 55296 && m + 1 < d && (64512 & (O = i.charCodeAt(m + 1))) == 56320 && (k = 65536 + (k - 55296 << 10) + (O - 56320), m++), S += k < 128 ? 1 : k < 2048 ? 2 : k < 65536 ? 3 : 4;
        for (e = new s.Buf8(S), _ = 0, m = 0; _ < S; m++) (64512 & (k = i.charCodeAt(m))) == 55296 && m + 1 < d && (64512 & (O = i.charCodeAt(m + 1))) == 56320 && (k = 65536 + (k - 55296 << 10) + (O - 56320), m++), k < 128 ? e[_++] = k : k < 2048 ? (e[_++] = 192 | k >>> 6, e[_++] = 128 | 63 & k) : k < 65536 ? (e[_++] = 224 | k >>> 12, e[_++] = 128 | k >>> 6 & 63, e[_++] = 128 | 63 & k) : (e[_++] = 240 | k >>> 18, e[_++] = 128 | k >>> 12 & 63, e[_++] = 128 | k >>> 6 & 63, e[_++] = 128 | 63 & k);
        return e;
      }, h.buf2binstring = function(i) {
        return a(i, i.length);
      }, h.binstring2buf = function(i) {
        for (var e = new s.Buf8(i.length), k = 0, O = e.length; k < O; k++) e[k] = i.charCodeAt(k);
        return e;
      }, h.buf2string = function(i, e) {
        var k, O, m, _, d = e || i.length, S = new Array(2 * d);
        for (O = 0, k = 0; k < d; ) if ((m = i[k++]) < 128) S[O++] = m;
        else if ((_ = c[m]) > 4) S[O++] = 65533, k += _ - 1;
        else {
          for (m &= _ === 2 ? 31 : _ === 3 ? 15 : 7; _ > 1 && k < d; ) m = m << 6 | 63 & i[k++], _--;
          _ > 1 ? S[O++] = 65533 : m < 65536 ? S[O++] = m : (m -= 65536, S[O++] = 55296 | m >> 10 & 1023, S[O++] = 56320 | 1023 & m);
        }
        return a(S, O);
      }, h.utf8border = function(i, e) {
        var k;
        for ((e = e || i.length) > i.length && (e = i.length), k = e - 1; k >= 0 && (192 & i[k]) == 128; ) k--;
        return k < 0 || k === 0 ? e : k + c[i[k]] > e ? k : e;
      };
    }, function(N, h, t) {
      N.exports = function() {
        this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
      };
    }, function(N, h, t) {
      N.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(9);
      function u({ capabilities: P = [], wants: c = [], haves: n = [], shallows: a = [], depth: i = null, since: e = null, exclude: k = [] }) {
        const O = [];
        c = [...new Set(c)];
        let m = ` ${P.join(" ")}`;
        for (const _ of c) O.push(s.a.encode(`want ${_}${m}
`)), m = "";
        for (const _ of a) O.push(s.a.encode(`shallow ${_}
`));
        i !== null && O.push(s.a.encode(`deepen ${i}
`)), e !== null && O.push(s.a.encode(`deepen-since ${Math.floor(e.valueOf() / 1e3)}
`));
        for (const _ of k) O.push(s.a.encode(`deepen-not ${_}
`));
        O.push(s.a.flush());
        for (const _ of n) O.push(s.a.encode(`have ${_}
`));
        return O.push(s.a.encode(`done
`)), O;
      }
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return a;
      });
      var s = t(32), u = t(77), P = t(39);
      function c(e, k, O, m, _, d, S) {
        try {
          var x = e[d](S), A = x.value;
        } catch (f) {
          return void O(f);
        }
        x.done ? k(A) : Promise.resolve(A).then(m, _);
      }
      function n(e) {
        return function() {
          var k = this, O = arguments;
          return new Promise(function(m, _) {
            var d = e.apply(k, O);
            function S(A) {
              c(d, m, _, S, x, "next", A);
            }
            function x(A) {
              c(d, m, _, S, x, "throw", A);
            }
            S(void 0);
          });
        };
      }
      function a(e) {
        return i.apply(this, arguments);
      }
      function i() {
        return (i = n(function* (e) {
          const { packetlines: k, packfile: O, progress: m } = u.a.demux(e), _ = [], d = [], S = [];
          let x = !1, A = !1;
          return new Promise((f, E) => {
            Object(P.a)(k, (w) => {
              const I = w.toString("utf8").trim();
              if (I.startsWith("shallow")) {
                const T = I.slice(-41).trim();
                T.length !== 40 && E(new s.a(T)), _.push(T);
              } else if (I.startsWith("unshallow")) {
                const T = I.slice(-41).trim();
                T.length !== 40 && E(new s.a(T)), d.push(T);
              } else if (I.startsWith("ACK")) {
                const [, T, M] = I.split(" ");
                S.push({ oid: T, status: M }), M || (A = !0);
              } else I.startsWith("NAK") ? (x = !0, A = !0) : (A = !0, x = !0);
              A && (e.error ? E(e.error) : f({ shallows: _, unshallows: d, acks: S, nak: x, packfile: O, progress: m }));
            }).finally(() => {
              A || (e.error ? E(e.error) : f({ shallows: _, unshallows: d, acks: S, nak: x, packfile: O, progress: m }));
            });
          });
        })).apply(this, arguments);
      }
    }, function(N, h, t) {
      (function(s) {
        t.d(h, "a", function() {
          return S;
        });
        var u = t(22), P = t(30), c = t(57), n = t(56), a = t(12), i = t(15), e = t(40), k = t(16), O = t(111), m = t(53);
        function _(E, w, I, T, M, R, U) {
          try {
            var z = E[R](U), $ = z.value;
          } catch (H) {
            return void I(H);
          }
          z.done ? w($) : Promise.resolve($).then(T, M);
        }
        function d(E) {
          return function() {
            var w = this, I = arguments;
            return new Promise(function(T, M) {
              var R = E.apply(w, I);
              function U($) {
                _(R, T, M, U, z, "next", $);
              }
              function z($) {
                _(R, T, M, U, z, "throw", $);
              }
              U(void 0);
            });
          };
        }
        function S(E) {
          return x.apply(this, arguments);
        }
        function x() {
          return (x = d(function* ({ fs: E, cache: w, dir: I, gitdir: T = Object(k.join)(I, ".git"), index: M, ourOid: R, baseOid: U, theirOid: z, ourName: $ = "ours", baseName: H = "base", theirName: nt = "theirs", dryRun: ot = !1, abortOnConflict: V = !0, mergeDriver: it }) {
            const lt = Object(u.a)({ ref: R }), dt = Object(u.a)({ ref: U }), G = Object(u.a)({ ref: z }), Z = [], ut = [], pt = [], st = [], mt = yield Object(P.a)({ fs: E, cache: w, dir: I, gitdir: T, trees: [lt, dt, G], map: (bt = d(function* (C, [F, L, K]) {
              const X = Object(e.a)(C);
              switch (`${yield Object(m.a)(F, L)}-${yield Object(m.a)(K, L)}`) {
                case "false-false":
                  return { mode: yield L.mode(), path: X, oid: yield L.oid(), type: yield L.type() };
                case "false-true":
                  return K ? { mode: yield K.mode(), path: X, oid: yield K.oid(), type: yield K.type() } : void 0;
                case "true-false":
                  return F ? { mode: yield F.mode(), path: X, oid: yield F.oid(), type: yield F.type() } : void 0;
                case "true-true":
                  if (F && L && K && (yield F.type()) === "blob" && (yield L.type()) === "blob" && (yield K.type()) === "blob") return A({ fs: E, gitdir: T, path: X, ours: F, base: L, theirs: K, ourName: $, baseName: H, theirName: nt, mergeDriver: it }).then(function() {
                    var rt = d(function* (yt) {
                      if (yt.cleanMerge) V || M.insert({ filepath: C, oid: yt.mergeResult.oid, stage: 0 });
                      else if (Z.push(C), ut.push(C), !V) {
                        const kt = yield L.oid(), At = yield F.oid(), Tt = yield K.oid();
                        M.delete({ filepath: C }), M.insert({ filepath: C, oid: kt, stage: 1 }), M.insert({ filepath: C, oid: At, stage: 2 }), M.insert({ filepath: C, oid: Tt, stage: 3 });
                      }
                      return yt.mergeResult;
                    });
                    return function(yt) {
                      return rt.apply(this, arguments);
                    };
                  }());
                  if (L && !F && K && (yield L.type()) === "blob" && (yield K.type()) === "blob") {
                    if (Z.push(C), pt.push(C), !V) {
                      const rt = yield L.oid(), yt = yield K.oid();
                      M.delete({ filepath: C }), M.insert({ filepath: C, oid: rt, stage: 1 }), M.insert({ filepath: C, oid: yt, stage: 3 });
                    }
                    return { mode: yield K.mode(), oid: yield K.oid(), type: "blob", path: X };
                  }
                  if (L && F && !K && (yield L.type()) === "blob" && (yield F.type()) === "blob") {
                    if (Z.push(C), st.push(C), !V) {
                      const rt = yield L.oid(), yt = yield F.oid();
                      M.delete({ filepath: C }), M.insert({ filepath: C, oid: rt, stage: 1 }), M.insert({ filepath: C, oid: yt, stage: 2 });
                    }
                    return { mode: yield F.mode(), oid: yield F.oid(), type: "blob", path: X };
                  }
                  if (L && !F && !K && (yield L.type()) === "blob") return;
                  throw new n.a();
              }
            }), function(C, F) {
              return bt.apply(this, arguments);
            }), reduce: Z.length === 0 || I && !V ? function() {
              var C = d(function* (F, L) {
                const K = L.filter(Boolean);
                if (F && (!F || F.type !== "tree" || K.length !== 0)) {
                  if (K.length > 0) {
                    const X = new a.a(K).toObject(), rt = yield Object(i.a)({ fs: E, gitdir: T, type: "tree", object: X, dryRun: ot });
                    F.oid = rt;
                  }
                  return F;
                }
              });
              return function(F, L) {
                return C.apply(this, arguments);
              };
            }() : void 0 });
            var bt, wt;
            return Z.length !== 0 ? (I && !V && (yield Object(P.a)({ fs: E, cache: w, dir: I, gitdir: T, trees: [Object(u.a)({ ref: mt.oid })], map: (wt = d(function* (C, [F]) {
              const L = `${I}/${C}`;
              if ((yield F.type()) === "blob") {
                const K = yield F.mode(), X = new TextDecoder().decode(yield F.content());
                yield E.write(L, X, { mode: K });
              }
              return !0;
            }), function(C, F) {
              return wt.apply(this, arguments);
            }) })), new c.a(Z, ut, pt, st)) : mt.oid;
          })).apply(this, arguments);
        }
        function A(E) {
          return f.apply(this, arguments);
        }
        function f() {
          return (f = d(function* ({ fs: E, gitdir: w, path: I, ours: T, base: M, theirs: R, ourName: U, theirName: z, baseName: $, dryRun: H, mergeDriver: nt = O.a }) {
            const ot = (yield M.mode()) === (yield T.mode()) ? yield R.mode() : yield T.mode();
            if ((yield T.oid()) === (yield R.oid())) return { cleanMerge: !0, mergeResult: { mode: ot, path: I, oid: yield T.oid(), type: "blob" } };
            if ((yield T.oid()) === (yield M.oid())) return { cleanMerge: !0, mergeResult: { mode: ot, path: I, oid: yield R.oid(), type: "blob" } };
            if ((yield R.oid()) === (yield M.oid())) return { cleanMerge: !0, mergeResult: { mode: ot, path: I, oid: yield T.oid(), type: "blob" } };
            const V = s.from(yield T.content()).toString("utf8"), it = s.from(yield M.content()).toString("utf8"), lt = s.from(yield R.content()).toString("utf8"), { mergedText: dt, cleanMerge: G } = yield nt({ branches: [$, U, z], contents: [it, V, lt], path: I });
            return { cleanMerge: G, mergeResult: { mode: ot, path: I, oid: yield Object(i.a)({ fs: E, gitdir: w, type: "blob", object: s.from(dt, "utf8"), dryRun: H }), type: "blob" } };
          })).apply(this, arguments);
        }
      }).call(this, t(10).Buffer);
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return O;
      });
      var s = t(17), u = t(3), P = t(44), c = t(18), n = t(14), a = t(7), i = t(16);
      function e(_, d, S, x, A, f, E) {
        try {
          var w = _[f](E), I = w.value;
        } catch (T) {
          return void S(T);
        }
        w.done ? d(I) : Promise.resolve(I).then(x, A);
      }
      function k(_) {
        return function() {
          var d = this, S = arguments;
          return new Promise(function(x, A) {
            var f = _.apply(d, S);
            function E(I) {
              e(f, x, A, E, w, "next", I);
            }
            function w(I) {
              e(f, x, A, E, w, "throw", I);
            }
            E(void 0);
          });
        };
      }
      function O(_) {
        return m.apply(this, arguments);
      }
      function m() {
        return (m = k(function* ({ fs: _, cache: d, dir: S, gitdir: x = Object(i.join)(S, ".git"), start: A, finish: f }) {
          const E = yield P.a.read({ fs: _, gitdir: x }), w = /* @__PURE__ */ new Set(), I = /* @__PURE__ */ new Set();
          for (const U of A) w.add(yield u.a.resolve({ fs: _, gitdir: x, ref: U }));
          for (const U of f) try {
            const z = yield u.a.resolve({ fs: _, gitdir: x, ref: U });
            I.add(z);
          } catch {
          }
          const T = /* @__PURE__ */ new Set();
          function M(U) {
            return R.apply(this, arguments);
          }
          function R() {
            return (R = k(function* (U) {
              T.add(U);
              const { type: z, object: $ } = yield Object(a.a)({ fs: _, cache: d, gitdir: x, oid: U });
              if (z === "tag")
                return M(c.a.from($).headers().object);
              if (z !== "commit") throw new s.a(U, z, "commit");
              if (!E.has(U)) {
                const H = n.a.from($).headers().parent;
                for (U of H) I.has(U) || T.has(U) || (yield M(U));
              }
            })).apply(this, arguments);
          }
          for (const U of w) yield M(U);
          return T;
        })).apply(this, arguments);
      }
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return c;
      });
      var s = t(9);
      function u(a, i, e, k, O, m, _) {
        try {
          var d = a[m](_), S = d.value;
        } catch (x) {
          return void e(x);
        }
        d.done ? i(S) : Promise.resolve(S).then(k, O);
      }
      function P(a) {
        return function() {
          var i = this, e = arguments;
          return new Promise(function(k, O) {
            var m = a.apply(i, e);
            function _(S) {
              u(m, k, O, _, d, "next", S);
            }
            function d(S) {
              u(m, k, O, _, d, "throw", S);
            }
            _(void 0);
          });
        };
      }
      function c(a) {
        return n.apply(this, arguments);
      }
      function n() {
        return (n = P(function* ({ capabilities: a = [], triplets: i = [] }) {
          const e = [];
          let k = `\0 ${a.join(" ")}`;
          for (const O of i) e.push(s.a.encode(`${O.oldoid} ${O.oid} ${O.fullRef}${k}
`)), k = "";
          return e.push(s.a.flush()), e;
        })).apply(this, arguments);
      }
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return n;
      });
      var s = t(36), u = t(9);
      function P(i, e, k, O, m, _, d) {
        try {
          var S = i[_](d), x = S.value;
        } catch (A) {
          return void k(A);
        }
        S.done ? e(x) : Promise.resolve(x).then(O, m);
      }
      function c(i) {
        return function() {
          var e = this, k = arguments;
          return new Promise(function(O, m) {
            var _ = i.apply(e, k);
            function d(x) {
              P(_, O, m, d, S, "next", x);
            }
            function S(x) {
              P(_, O, m, d, S, "throw", x);
            }
            d(void 0);
          });
        };
      }
      function n(i) {
        return a.apply(this, arguments);
      }
      function a() {
        return (a = c(function* (i) {
          const e = {};
          let k = "";
          const O = u.a.streamReader(i);
          let m = yield O();
          for (; m !== !0; ) m !== null && (k += m.toString("utf8") + `
`), m = yield O();
          const _ = k.toString("utf8").split(`
`);
          if (m = _.shift(), !m.startsWith("unpack ")) throw new s.a('unpack ok" or "unpack [error message]', m);
          e.ok = m === "unpack ok", e.ok || (e.error = m.slice(7)), e.refs = {};
          for (const d of _) {
            if (d.trim() === "") continue;
            const S = d.slice(0, 2), x = d.slice(3);
            let A = x.indexOf(" ");
            A === -1 && (A = x.length);
            const f = x.slice(0, A), E = x.slice(A + 1);
            e.refs[f] = { ok: S === "ok", error: E };
          }
          return e;
        })).apply(this, arguments);
      }
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return u;
      });
      var s = t(38);
      function u(c, n) {
        return Object(s.a)(P(c), P(n));
      }
      function P(c) {
        return c.mode === "040000" ? c.path + "/" : c.path;
      }
    }, function(N, h, t) {
      var s;
      s = function(u) {
        u.version = "1.2.0";
        var P = function() {
          for (var c = 0, n = new Array(256), a = 0; a != 256; ++a) c = 1 & (c = 1 & (c = 1 & (c = 1 & (c = 1 & (c = 1 & (c = 1 & (c = 1 & (c = a) ? -306674912 ^ c >>> 1 : c >>> 1) ? -306674912 ^ c >>> 1 : c >>> 1) ? -306674912 ^ c >>> 1 : c >>> 1) ? -306674912 ^ c >>> 1 : c >>> 1) ? -306674912 ^ c >>> 1 : c >>> 1) ? -306674912 ^ c >>> 1 : c >>> 1) ? -306674912 ^ c >>> 1 : c >>> 1) ? -306674912 ^ c >>> 1 : c >>> 1, n[a] = c;
          return typeof Int32Array < "u" ? new Int32Array(n) : n;
        }();
        u.table = P, u.bstr = function(c, n) {
          for (var a = -1 ^ n, i = c.length - 1, e = 0; e < i; ) a = (a = a >>> 8 ^ P[255 & (a ^ c.charCodeAt(e++))]) >>> 8 ^ P[255 & (a ^ c.charCodeAt(e++))];
          return e === i && (a = a >>> 8 ^ P[255 & (a ^ c.charCodeAt(e))]), -1 ^ a;
        }, u.buf = function(c, n) {
          if (c.length > 1e4) return function(k, O) {
            for (var m = -1 ^ O, _ = k.length - 7, d = 0; d < _; ) m = (m = (m = (m = (m = (m = (m = (m = m >>> 8 ^ P[255 & (m ^ k[d++])]) >>> 8 ^ P[255 & (m ^ k[d++])]) >>> 8 ^ P[255 & (m ^ k[d++])]) >>> 8 ^ P[255 & (m ^ k[d++])]) >>> 8 ^ P[255 & (m ^ k[d++])]) >>> 8 ^ P[255 & (m ^ k[d++])]) >>> 8 ^ P[255 & (m ^ k[d++])]) >>> 8 ^ P[255 & (m ^ k[d++])];
            for (; d < _ + 7; ) m = m >>> 8 ^ P[255 & (m ^ k[d++])];
            return -1 ^ m;
          }(c, n);
          for (var a = -1 ^ n, i = c.length - 3, e = 0; e < i; ) a = (a = (a = (a = a >>> 8 ^ P[255 & (a ^ c[e++])]) >>> 8 ^ P[255 & (a ^ c[e++])]) >>> 8 ^ P[255 & (a ^ c[e++])]) >>> 8 ^ P[255 & (a ^ c[e++])];
          for (; e < i + 3; ) a = a >>> 8 ^ P[255 & (a ^ c[e++])];
          return -1 ^ a;
        }, u.str = function(c, n) {
          for (var a, i, e = -1 ^ n, k = 0, O = c.length; k < O; ) (a = c.charCodeAt(k++)) < 128 ? e = e >>> 8 ^ P[255 & (e ^ a)] : a < 2048 ? e = (e = e >>> 8 ^ P[255 & (e ^ (192 | a >> 6 & 31))]) >>> 8 ^ P[255 & (e ^ (128 | 63 & a))] : a >= 55296 && a < 57344 ? (a = 64 + (1023 & a), i = 1023 & c.charCodeAt(k++), e = (e = (e = (e = e >>> 8 ^ P[255 & (e ^ (240 | a >> 8 & 7))]) >>> 8 ^ P[255 & (e ^ (128 | a >> 2 & 63))]) >>> 8 ^ P[255 & (e ^ (128 | i >> 6 & 15 | (3 & a) << 4))]) >>> 8 ^ P[255 & (e ^ (128 | 63 & i))]) : e = (e = (e = e >>> 8 ^ P[255 & (e ^ (224 | a >> 12 & 15))]) >>> 8 ^ P[255 & (e ^ (128 | a >> 6 & 63))]) >>> 8 ^ P[255 & (e ^ (128 | 63 & a))];
          return -1 ^ e;
        };
      }, s(typeof DO_NOT_EXPORT_CRC > "u" ? h : {});
    }, function(N, h, t) {
      (function(s) {
        t.d(h, "a", function() {
          return e;
        });
        var u = t(49), P = t.n(u), c = t(4), n = t(82);
        function a(_, d, S, x, A, f, E) {
          try {
            var w = _[f](E), I = w.value;
          } catch (T) {
            return void S(T);
          }
          w.done ? d(I) : Promise.resolve(I).then(x, A);
        }
        function i(_) {
          return function() {
            var d = this, S = arguments;
            return new Promise(function(x, A) {
              var f = _.apply(d, S);
              function E(I) {
                a(f, x, A, E, w, "next", I);
              }
              function w(I) {
                a(f, x, A, E, w, "throw", I);
              }
              E(void 0);
            });
          };
        }
        function e(_, d) {
          return k.apply(this, arguments);
        }
        function k() {
          return (k = i(function* (_, d) {
            const S = new n.a(_);
            let x = yield S.read(4);
            if (x = x.toString("utf8"), x !== "PACK") throw new c.a(`Invalid PACK header '${x}'`);
            let A = yield S.read(4);
            if (A = A.readUInt32BE(0), A !== 2) throw new c.a(`Invalid packfile version: ${A}`);
            let f = yield S.read(4);
            if (f = f.readUInt32BE(0), !(f < 1)) for (; !S.eof() && f--; ) {
              const E = S.tell(), { type: w, length: I, ofs: T, reference: M } = yield O(S), R = new P.a.Inflate();
              for (; !R.result; ) {
                const U = yield S.chunk();
                if (!U) break;
                if (R.push(U, !1), R.err) throw new c.a(`Pako error: ${R.msg}`);
                if (R.result) {
                  if (R.result.length !== I) throw new c.a("Inflated object size is different from that stated in packfile.");
                  yield S.undo(), yield S.read(U.length - R.strm.avail_in);
                  const z = S.tell();
                  yield d({ data: R.result, type: w, num: f, offset: E, end: z, reference: M, ofs: T });
                }
              }
            }
          })).apply(this, arguments);
        }
        function O(_) {
          return m.apply(this, arguments);
        }
        function m() {
          return (m = i(function* (_) {
            let d = yield _.byte();
            const S = d >> 4 & 7;
            let x, A, f = 15 & d;
            if (128 & d) {
              let E = 4;
              do
                d = yield _.byte(), f |= (127 & d) << E, E += 7;
              while (128 & d);
            }
            if (S === 6) {
              let E = 0;
              x = 0;
              const w = [];
              do
                d = yield _.byte(), x |= (127 & d) << E, E += 7, w.push(d);
              while (128 & d);
              A = s.from(w);
            }
            return S === 7 && (A = yield _.read(20)), { type: S, length: f, ofs: x, reference: A };
          })).apply(this, arguments);
        }
      }).call(this, t(10).Buffer);
    }, function(N, h, t) {
      (function(s) {
        t.d(h, "a", function() {
          return c;
        });
        var u = t(4), P = t(20);
        function c(e, k) {
          const O = new P.a(e), m = n(O);
          if (m !== k.byteLength) throw new u.a(`applyDelta expected source buffer to be ${m} bytes but the provided buffer was ${k.length} bytes`);
          const _ = n(O);
          let d;
          const S = i(O, k);
          if (S.byteLength === _) d = S;
          else {
            d = s.alloc(_);
            const x = new P.a(d);
            for (x.copy(S); !O.eof(); ) x.copy(i(O, k));
            const A = x.tell();
            if (_ !== A) throw new u.a(`applyDelta expected target buffer to be ${_} bytes but the resulting buffer was ${A} bytes`);
          }
          return d;
        }
        function n(e) {
          let k = 0, O = 0, m = null;
          do
            m = e.readUInt8(), k |= (127 & m) << O, O += 7;
          while (128 & m);
          return k;
        }
        function a(e, k, O) {
          let m = 0, _ = 0;
          for (; O--; ) 1 & k && (m |= e.readUInt8() << _), k >>= 1, _ += 8;
          return m;
        }
        function i(e, k) {
          const O = e.readUInt8();
          if (128 & O) {
            const m = a(e, 15 & O, 4);
            let _ = a(e, (112 & O) >> 4, 3);
            return _ === 0 && (_ = 65536), k.slice(m, m + _);
          }
          return e.slice(O);
        }
      }).call(this, t(10).Buffer);
    }, function(N, h, t) {
      function s(u) {
        return u.split(`
`).map((P) => P.replace(/^ /, "")).join(`
`);
      }
      t.d(h, "a", function() {
        return s;
      });
    }, function(N, h, t) {
      function s(P) {
        return /* @__PURE__ */ function(c) {
          return c && typeof c == "object";
        }(P) && u(P.then) && u(P.catch);
      }
      function u(P) {
        return typeof P == "function";
      }
      t.d(h, "a", function() {
        return s;
      });
    }, function(N, h, t) {
      (function(s) {
        function u(T) {
          return Array.isArray(T) ? T : [T];
        }
        const P = /^\s+$/, c = /^\\!/, n = /^\\#/, a = /\r?\n/g, i = /^\.*\/|^\.+$/, e = typeof Symbol < "u" ? Symbol.for("node-ignore") : "node-ignore", k = /([0-z])-([0-z])/g, O = () => !1, m = [[/\\?\s+$/, (T) => T.indexOf("\\") === 0 ? " " : ""], [/\\\s/g, () => " "], [/[\\$.|*+(){^]/g, (T) => `\\${T}`], [/(?!\\)\?/g, () => "[^/]"], [/^\//, () => "^"], [/\//g, () => "\\/"], [/^\^*\\\*\\\*\\\//, () => "^(?:.*\\/)?"], [/^(?=[^^])/, function() {
          return /\/(?!$)/.test(this) ? "^" : "(?:^|\\/)";
        }], [/\\\/\\\*\\\*(?=\\\/|$)/g, (T, M, R) => M + 6 < R.length ? "(?:\\/[^\\/]+)*" : "\\/.+"], [/(^|[^\\]+)\\\*(?=.+)/g, (T, M) => `${M}[^\\/]*`], [/\\\\\\(?=[$.|*+(){^])/g, () => "\\"], [/\\\\/g, () => "\\"], [/(\\)?\[([^\]/]*?)(\\*)($|\])/g, (T, M, R, U, z) => M === "\\" ? `\\[${R}${(($) => {
          const { length: H } = $;
          return $.slice(0, H - H % 2);
        })(U)}${z}` : z === "]" && U.length % 2 == 0 ? `[${(($) => $.replace(k, (H, nt, ot) => nt.charCodeAt(0) <= ot.charCodeAt(0) ? H : ""))(R)}${U}]` : "[]"], [/(?:[^*])$/, (T) => /\/$/.test(T) ? `${T}$` : `${T}(?=$|\\/$)`], [/(\^|\\\/)?\\\*$/, (T, M) => `${M ? `${M}[^/]+` : "[^/]*"}(?=$|\\/$)`]], _ = /* @__PURE__ */ Object.create(null), d = (T) => typeof T == "string";
        class S {
          constructor(M, R, U, z) {
            this.origin = M, this.pattern = R, this.negative = U, this.regex = z;
          }
        }
        const x = (T, M) => {
          const R = T;
          let U = !1;
          T.indexOf("!") === 0 && (U = !0, T = T.substr(1));
          const z = (($, H) => {
            let nt = _[$];
            return nt || (nt = m.reduce((ot, V) => ot.replace(V[0], V[1].bind($)), $), _[$] = nt), H ? new RegExp(nt, "i") : new RegExp(nt);
          })(T = T.replace(c, "!").replace(n, "#"), M);
          return new S(R, T, U, z);
        }, A = (T, M) => {
          throw new M(T);
        }, f = (T, M, R) => d(T) ? T ? f.isNotRelative(T) ? R(`path should be a \`path.relative()\`d string, but got "${M}"`, RangeError) : !0 : R("path must not be empty", TypeError) : R(`path must be a string, but got \`${M}\``, TypeError), E = (T) => i.test(T);
        f.isNotRelative = E, f.convert = (T) => T;
        class w {
          constructor({ ignorecase: M = !0, ignoreCase: R = M, allowRelativePaths: U = !1 } = {}) {
            var z, $, H;
            z = this, $ = e, H = !0, Object.defineProperty(z, $, { value: H }), this._rules = [], this._ignoreCase = R, this._allowRelativePaths = U, this._initCache();
          }
          _initCache() {
            this._ignoreCache = /* @__PURE__ */ Object.create(null), this._testCache = /* @__PURE__ */ Object.create(null);
          }
          _addPattern(M) {
            if (M && M[e]) return this._rules = this._rules.concat(M._rules), void (this._added = !0);
            if (((R) => R && d(R) && !P.test(R) && R.indexOf("#") !== 0)(M)) {
              const R = x(M, this._ignoreCase);
              this._added = !0, this._rules.push(R);
            }
          }
          add(M) {
            return this._added = !1, u(d(M) ? ((R) => R.split(a))(M) : M).forEach(this._addPattern, this), this._added && this._initCache(), this;
          }
          addPattern(M) {
            return this.add(M);
          }
          _testOne(M, R) {
            let U = !1, z = !1;
            return this._rules.forEach(($) => {
              const { negative: H } = $;
              z === H && U !== z || H && !U && !z && !R || $.regex.test(M) && (U = !H, z = H);
            }), { ignored: U, unignored: z };
          }
          _test(M, R, U, z) {
            const $ = M && f.convert(M);
            return f($, M, this._allowRelativePaths ? O : A), this._t($, R, U, z);
          }
          _t(M, R, U, z) {
            if (M in R) return R[M];
            if (z || (z = M.split("/")), z.pop(), !z.length) return R[M] = this._testOne(M, U);
            const $ = this._t(z.join("/") + "/", R, U, z);
            return R[M] = $.ignored ? $ : this._testOne(M, U);
          }
          ignores(M) {
            return this._test(M, this._ignoreCache, !1).ignored;
          }
          createFilter() {
            return (M) => !this.ignores(M);
          }
          filter(M) {
            return u(M).filter(this.createFilter());
          }
          test(M) {
            return this._test(M, this._testCache, !0);
          }
        }
        const I = (T) => new w(T);
        if (I.isPathValid = (T) => f(T && f.convert(T), T, O), I.default = I, N.exports = I, s !== void 0 && (s.env && s.env.IGNORE_TEST_WIN32 || s.platform === "win32")) {
          const T = (R) => /^\\\\\?\\/.test(R) || /["<>|\u0000-\u001F]+/u.test(R) ? R : R.replace(/\\/g, "/");
          f.convert = T;
          const M = /^[a-z]:\//i;
          f.isNotRelative = (R) => M.test(R) || E(R);
        }
      }).call(this, t(92));
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return c;
      });
      var s = t(4);
      function u(a, i, e, k, O, m, _) {
        try {
          var d = a[m](_), S = d.value;
        } catch (x) {
          return void e(x);
        }
        d.done ? i(S) : Promise.resolve(S).then(k, O);
      }
      function P(a) {
        return function() {
          var i = this, e = arguments;
          return new Promise(function(k, O) {
            var m = a.apply(i, e);
            function _(S) {
              u(m, k, O, _, d, "next", S);
            }
            function d(S) {
              u(m, k, O, _, d, "throw", S);
            }
            _(void 0);
          });
        };
      }
      function c(a) {
        return n.apply(this, arguments);
      }
      function n() {
        return (n = P(function* ({ fs: a, gitdir: i, object: e, format: k, oid: O }) {
          if (k !== "deflated") throw new s.a("GitObjectStoreLoose expects objects to write to be in deflated format");
          const m = `${i}/${`objects/${O.slice(0, 2)}/${O.slice(2)}`}`;
          (yield a.exists(m)) || (yield a.write(m, e));
        })).apply(this, arguments);
      }
    }, function(N, h, t) {
      var s = t(158);
      function u(P, c) {
        for (var n = [], a = P.length, i = c.length, e = function(m, _) {
          var d = new s(m, _);
          d.compose();
          for (var S, x, A = d.getses(), f = m.length - 1, E = _.length - 1, w = A.length - 1; w >= 0; --w) A[w].t === d.SES_COMMON ? (x ? (x.chain = { file1index: f, file2index: E, chain: null }, x = x.chain) : x = S = { file1index: f, file2index: E, chain: null }, f--, E--) : A[w].t === d.SES_DELETE ? f-- : A[w].t === d.SES_ADD && E--;
          var I = { file1index: -1, file2index: -1, chain: null };
          return x ? (x.chain = I, S) : I;
        }(P, c); e !== null; e = e.chain) {
          var k = a - e.file1index - 1, O = i - e.file2index - 1;
          a = e.file1index, i = e.file2index, (k || O) && n.push({ file1: [a + 1, k], file2: [i + 1, O] });
        }
        return n.reverse(), n;
      }
      N.exports = function(P, c, n) {
        var a = [], i = [P, c, n], e = function(A, f, E) {
          var w, I = u(f, A), T = u(f, E), M = [];
          function R(L, K) {
            M.push([L.file1[0], K, L.file1[1], L.file2[0], L.file2[1]]);
          }
          for (w = 0; w < I.length; w++) R(I[w], 0);
          for (w = 0; w < T.length; w++) R(T[w], 2);
          M.sort(function(L, K) {
            return L[0] - K[0];
          });
          var U = [], z = 0;
          function $(L) {
            L > z && (U.push([1, z, L - z]), z = L);
          }
          for (var H = 0; H < M.length; H++) {
            for (var nt = H, ot = M[H], V = ot[0], it = V + ot[2]; H < M.length - 1; ) {
              var lt = M[H + 1], dt = lt[0];
              if (dt > it) break;
              it = Math.max(it, dt + lt[2]), H++;
            }
            if ($(V), nt == H) ot[4] > 0 && U.push([ot[1], ot[3], ot[4]]);
            else {
              var G = { 0: [A.length, -1, f.length, -1], 2: [E.length, -1, f.length, -1] };
              for (w = nt; w <= H; w++) {
                var Z = G[(ot = M[w])[1]], ut = ot[0], pt = ut + ot[2], st = ot[3], mt = st + ot[4];
                Z[0] = Math.min(st, Z[0]), Z[1] = Math.max(mt, Z[1]), Z[2] = Math.min(ut, Z[2]), Z[3] = Math.max(pt, Z[3]);
              }
              var bt = G[0][0] + (V - G[0][2]), wt = G[0][1] + (it - G[0][3]), C = G[2][0] + (V - G[2][2]), F = G[2][1] + (it - G[2][3]);
              U.push([-1, bt, wt - bt, V, it - V, C, F - C]);
            }
            z = it;
          }
          return $(f.length), U;
        }(P, c, n), k = [];
        function O() {
          k.length && a.push({ ok: k }), k = [];
        }
        function m(A) {
          for (var f = 0; f < A.length; f++) k.push(A[f]);
        }
        function _(A) {
          if (A[2] != A[6]) return !0;
          for (var f = A[1], E = A[5], w = 0; w < A[2]; w++) if (P[w + f] != n[w + E]) return !0;
          return !1;
        }
        for (var d = 0; d < e.length; d++) {
          var S = e[d], x = S[0];
          x == -1 ? _(S) ? (O(), a.push({ conflict: { a: P.slice(S[1], S[1] + S[2]), aIndex: S[1], o: c.slice(S[3], S[3] + S[4]), oIndex: S[3], b: n.slice(S[5], S[5] + S[6]), bIndex: S[5] } })) : m(i[0].slice(S[1], S[1] + S[2])) : m(i[x].slice(S[1], S[1] + S[2]));
        }
        return O(), a;
      };
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return s;
      });
      const s = { commit: 16, tree: 32, blob: 48, tag: 64, ofs_delta: 96, ref_delta: 112 };
    }, function(N, h, t) {
      function s(u, P) {
        const c = u.map((n) => n.split("=", 1)[0]);
        return P.filter((n) => {
          const a = n.split("=", 1)[0];
          return c.includes(a);
        });
      }
      t.d(h, "a", function() {
        return s;
      });
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return n;
      });
      var s = t(67), u = t(39);
      function P(a, i, e, k, O, m, _) {
        try {
          var d = a[m](_), S = d.value;
        } catch (x) {
          return void e(x);
        }
        d.done ? i(S) : Promise.resolve(S).then(k, O);
      }
      function c(a) {
        const i = a.indexOf("\r"), e = a.indexOf(`
`);
        return i === -1 && e === -1 ? -1 : i === -1 ? e + 1 : e === -1 ? i + 1 : e === i + 1 ? e + 1 : Math.min(i, e) + 1;
      }
      function n(a) {
        const i = new s.a();
        let e = "";
        var k;
        return (k = function* () {
          yield Object(u.a)(a, (O) => {
            for (O = O.toString("utf8"), e += O; ; ) {
              const m = c(e);
              if (m === -1) break;
              i.write(e.slice(0, m)), e = e.slice(m);
            }
          }), e.length > 0 && i.write(e), i.end();
        }, function() {
          var O = this, m = arguments;
          return new Promise(function(_, d) {
            var S = k.apply(O, m);
            function x(f) {
              P(S, _, d, x, A, "next", f);
            }
            function A(f) {
              P(S, _, d, x, A, "throw", f);
            }
            x(void 0);
          });
        })(), i;
      }
    }, function(N, h, t) {
      (function(s) {
        var u = function(P) {
          if (P = P || {}, this.Promise = P.Promise || Promise, this.queues = /* @__PURE__ */ Object.create(null), this.domainReentrant = P.domainReentrant || !1, this.domainReentrant) {
            if (s === void 0 || s.domain === void 0) throw new Error("Domain-reentrant locks require `process.domain` to exist. Please flip `opts.domainReentrant = false`, use a NodeJS version that still implements Domain, or install a browser polyfill.");
            this.domains = /* @__PURE__ */ Object.create(null);
          }
          this.timeout = P.timeout || u.DEFAULT_TIMEOUT, this.maxOccupationTime = P.maxOccupationTime || u.DEFAULT_MAX_OCCUPATION_TIME, this.maxExecutionTime = P.maxExecutionTime || u.DEFAULT_MAX_EXECUTION_TIME, P.maxPending === 1 / 0 || Number.isInteger(P.maxPending) && P.maxPending >= 0 ? this.maxPending = P.maxPending : this.maxPending = u.DEFAULT_MAX_PENDING;
        };
        u.DEFAULT_TIMEOUT = 0, u.DEFAULT_MAX_OCCUPATION_TIME = 0, u.DEFAULT_MAX_EXECUTION_TIME = 0, u.DEFAULT_MAX_PENDING = 1e3, u.prototype.acquire = function(P, c, n, a) {
          if (Array.isArray(P)) return this._acquireBatch(P, c, n, a);
          if (typeof c != "function") throw new Error("You must pass a function to execute");
          var i = null, e = null, k = null;
          typeof n != "function" && (a = n, n = null, k = new this.Promise(function(T, M) {
            i = T, e = M;
          })), a = a || {};
          var O = !1, m = null, _ = null, d = null, S = this, x = function(T, M, R) {
            _ && (clearTimeout(_), _ = null), d && (clearTimeout(d), d = null), T && (S.queues[P] && S.queues[P].length === 0 && delete S.queues[P], S.domainReentrant && delete S.domains[P]), O || (k ? M ? e(M) : i(R) : typeof n == "function" && n(M, R), O = !0), T && S.queues[P] && S.queues[P].length > 0 && S.queues[P].shift()();
          }, A = function(T) {
            if (O) return x(T);
            m && (clearTimeout(m), m = null), S.domainReentrant && T && (S.domains[P] = s.domain);
            var M = a.maxExecutionTime || S.maxExecutionTime;
            if (M && (d = setTimeout(function() {
              S.queues[P] && x(T, new Error("Maximum execution time is exceeded " + P));
            }, M)), c.length === 1) {
              var R = !1;
              try {
                c(function(U, z) {
                  R || (R = !0, x(T, U, z));
                });
              } catch (U) {
                R || (R = !0, x(T, U));
              }
            } else S._promiseTry(function() {
              return c();
            }).then(function(U) {
              x(T, void 0, U);
            }, function(U) {
              x(T, U);
            });
          };
          S.domainReentrant && s.domain && (A = s.domain.bind(A));
          var f = a.maxPending || S.maxPending;
          if (S.queues[P]) if (S.domainReentrant && s.domain && s.domain === S.domains[P]) A(!1);
          else if (S.queues[P].length >= f) x(!1, new Error("Too many pending tasks in queue " + P));
          else {
            var E = function() {
              A(!0);
            };
            a.skipQueue ? S.queues[P].unshift(E) : S.queues[P].push(E);
            var w = a.timeout || S.timeout;
            w && (m = setTimeout(function() {
              m = null, x(!1, new Error("async-lock timed out in queue " + P));
            }, w));
          }
          else S.queues[P] = [], A(!0);
          var I = a.maxOccupationTime || S.maxOccupationTime;
          return I && (_ = setTimeout(function() {
            S.queues[P] && x(!1, new Error("Maximum occupation time is exceeded in queue " + P));
          }, I)), k || void 0;
        }, u.prototype._acquireBatch = function(P, c, n, a) {
          typeof n != "function" && (a = n, n = null);
          var i = this, e = P.reduceRight(function(k, O) {
            return /* @__PURE__ */ function(m, _) {
              return function(d) {
                i.acquire(m, _, d, a);
              };
            }(O, k);
          }, c);
          if (typeof n != "function") return new this.Promise(function(k, O) {
            e.length === 1 ? e(function(m, _) {
              m ? O(m) : k(_);
            }) : k(e());
          });
          e(n);
        }, u.prototype.isBusy = function(P) {
          return P ? !!this.queues[P] : Object.keys(this.queues).length > 0;
        }, u.prototype._promiseTry = function(P) {
          try {
            return this.Promise.resolve(P());
          } catch (c) {
            return this.Promise.reject(c);
          }
        }, N.exports = u;
      }).call(this, t(92));
    }, function(N, h) {
      var t;
      t = /* @__PURE__ */ function() {
        return this;
      }();
      try {
        t = t || new Function("return this")();
      } catch {
        typeof window == "object" && (t = window);
      }
      N.exports = t;
    }, function(N, h, t) {
      h.byteLength = function(k) {
        var O = i(k), m = O[0], _ = O[1];
        return 3 * (m + _) / 4 - _;
      }, h.toByteArray = function(k) {
        var O, m, _ = i(k), d = _[0], S = _[1], x = new P(function(E, w, I) {
          return 3 * (w + I) / 4 - I;
        }(0, d, S)), A = 0, f = S > 0 ? d - 4 : d;
        for (m = 0; m < f; m += 4) O = u[k.charCodeAt(m)] << 18 | u[k.charCodeAt(m + 1)] << 12 | u[k.charCodeAt(m + 2)] << 6 | u[k.charCodeAt(m + 3)], x[A++] = O >> 16 & 255, x[A++] = O >> 8 & 255, x[A++] = 255 & O;
        return S === 2 && (O = u[k.charCodeAt(m)] << 2 | u[k.charCodeAt(m + 1)] >> 4, x[A++] = 255 & O), S === 1 && (O = u[k.charCodeAt(m)] << 10 | u[k.charCodeAt(m + 1)] << 4 | u[k.charCodeAt(m + 2)] >> 2, x[A++] = O >> 8 & 255, x[A++] = 255 & O), x;
      }, h.fromByteArray = function(k) {
        for (var O, m = k.length, _ = m % 3, d = [], S = 0, x = m - _; S < x; S += 16383) d.push(e(k, S, S + 16383 > x ? x : S + 16383));
        return _ === 1 ? (O = k[m - 1], d.push(s[O >> 2] + s[O << 4 & 63] + "==")) : _ === 2 && (O = (k[m - 2] << 8) + k[m - 1], d.push(s[O >> 10] + s[O >> 4 & 63] + s[O << 2 & 63] + "=")), d.join("");
      };
      for (var s = [], u = [], P = typeof Uint8Array < "u" ? Uint8Array : Array, c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", n = 0, a = c.length; n < a; ++n) s[n] = c[n], u[c.charCodeAt(n)] = n;
      function i(k) {
        var O = k.length;
        if (O % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
        var m = k.indexOf("=");
        return m === -1 && (m = O), [m, m === O ? 0 : 4 - m % 4];
      }
      function e(k, O, m) {
        for (var _, d, S = [], x = O; x < m; x += 3) _ = (k[x] << 16 & 16711680) + (k[x + 1] << 8 & 65280) + (255 & k[x + 2]), S.push(s[(d = _) >> 18 & 63] + s[d >> 12 & 63] + s[d >> 6 & 63] + s[63 & d]);
        return S.join("");
      }
      u[45] = 62, u[95] = 63;
    }, function(N, h) {
      h.read = function(t, s, u, P, c) {
        var n, a, i = 8 * c - P - 1, e = (1 << i) - 1, k = e >> 1, O = -7, m = u ? c - 1 : 0, _ = u ? -1 : 1, d = t[s + m];
        for (m += _, n = d & (1 << -O) - 1, d >>= -O, O += i; O > 0; n = 256 * n + t[s + m], m += _, O -= 8) ;
        for (a = n & (1 << -O) - 1, n >>= -O, O += P; O > 0; a = 256 * a + t[s + m], m += _, O -= 8) ;
        if (n === 0) n = 1 - k;
        else {
          if (n === e) return a ? NaN : 1 / 0 * (d ? -1 : 1);
          a += Math.pow(2, P), n -= k;
        }
        return (d ? -1 : 1) * a * Math.pow(2, n - P);
      }, h.write = function(t, s, u, P, c, n) {
        var a, i, e, k = 8 * n - c - 1, O = (1 << k) - 1, m = O >> 1, _ = c === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, d = P ? 0 : n - 1, S = P ? 1 : -1, x = s < 0 || s === 0 && 1 / s < 0 ? 1 : 0;
        for (s = Math.abs(s), isNaN(s) || s === 1 / 0 ? (i = isNaN(s) ? 1 : 0, a = O) : (a = Math.floor(Math.log(s) / Math.LN2), s * (e = Math.pow(2, -a)) < 1 && (a--, e *= 2), (s += a + m >= 1 ? _ / e : _ * Math.pow(2, 1 - m)) * e >= 2 && (a++, e /= 2), a + m >= O ? (i = 0, a = O) : a + m >= 1 ? (i = (s * e - 1) * Math.pow(2, c), a += m) : (i = s * Math.pow(2, m - 1) * Math.pow(2, c), a = 0)); c >= 8; t[u + d] = 255 & i, d += S, i /= 256, c -= 8) ;
        for (a = a << c | i, k += c; k > 0; t[u + d] = 255 & a, d += S, a /= 256, k -= 8) ;
        t[u + d - S] |= 128 * x;
      };
    }, function(N, h) {
      var t = {}.toString;
      N.exports = Array.isArray || function(s) {
        return t.call(s) == "[object Array]";
      };
    }, function(N, h) {
      typeof Object.create == "function" ? N.exports = function(t, s) {
        t.super_ = s, t.prototype = Object.create(s.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } });
      } : N.exports = function(t, s) {
        t.super_ = s;
        var u = function() {
        };
        u.prototype = s.prototype, t.prototype = new u(), t.prototype.constructor = t;
      };
    }, function(N, h, t) {
      var s = t(119).Buffer;
      function u(P, c) {
        this._block = s.alloc(P), this._finalSize = c, this._blockSize = P, this._len = 0;
      }
      u.prototype.update = function(P, c) {
        typeof P == "string" && (c = c || "utf8", P = s.from(P, c));
        for (var n = this._block, a = this._blockSize, i = P.length, e = this._len, k = 0; k < i; ) {
          for (var O = e % a, m = Math.min(i - k, a - O), _ = 0; _ < m; _++) n[O + _] = P[k + _];
          k += m, (e += m) % a == 0 && this._update(n);
        }
        return this._len += i, this;
      }, u.prototype.digest = function(P) {
        var c = this._len % this._blockSize;
        this._block[c] = 128, this._block.fill(0, c + 1), c >= this._finalSize && (this._update(this._block), this._block.fill(0));
        var n = 8 * this._len;
        if (n <= 4294967295) this._block.writeUInt32BE(n, this._blockSize - 4);
        else {
          var a = (4294967295 & n) >>> 0, i = (n - a) / 4294967296;
          this._block.writeUInt32BE(i, this._blockSize - 8), this._block.writeUInt32BE(a, this._blockSize - 4);
        }
        this._update(this._block);
        var e = this._hash();
        return P ? e.toString(P) : e;
      }, u.prototype._update = function() {
        throw new Error("_update must be implemented by subclass");
      }, N.exports = u;
    }, function(N, h, t) {
      var s = t(151), u = t(31), P = t(122), c = t(96), n = t(123), a = Object.prototype.toString;
      function i(k) {
        if (!(this instanceof i)) return new i(k);
        this.options = u.assign({ level: -1, method: 8, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: 0, to: "" }, k || {});
        var O = this.options;
        O.raw && O.windowBits > 0 ? O.windowBits = -O.windowBits : O.gzip && O.windowBits > 0 && O.windowBits < 16 && (O.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new n(), this.strm.avail_out = 0;
        var m = s.deflateInit2(this.strm, O.level, O.method, O.windowBits, O.memLevel, O.strategy);
        if (m !== 0) throw new Error(c[m]);
        if (O.header && s.deflateSetHeader(this.strm, O.header), O.dictionary) {
          var _;
          if (_ = typeof O.dictionary == "string" ? P.string2buf(O.dictionary) : a.call(O.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(O.dictionary) : O.dictionary, (m = s.deflateSetDictionary(this.strm, _)) !== 0) throw new Error(c[m]);
          this._dict_set = !0;
        }
      }
      function e(k, O) {
        var m = new i(O);
        if (m.push(k, !0), m.err) throw m.msg || c[m.err];
        return m.result;
      }
      i.prototype.push = function(k, O) {
        var m, _, d = this.strm, S = this.options.chunkSize;
        if (this.ended) return !1;
        _ = O === ~~O ? O : O === !0 ? 4 : 0, typeof k == "string" ? d.input = P.string2buf(k) : a.call(k) === "[object ArrayBuffer]" ? d.input = new Uint8Array(k) : d.input = k, d.next_in = 0, d.avail_in = d.input.length;
        do {
          if (d.avail_out === 0 && (d.output = new u.Buf8(S), d.next_out = 0, d.avail_out = S), (m = s.deflate(d, _)) !== 1 && m !== 0) return this.onEnd(m), this.ended = !0, !1;
          d.avail_out !== 0 && (d.avail_in !== 0 || _ !== 4 && _ !== 2) || (this.options.to === "string" ? this.onData(P.buf2binstring(u.shrinkBuf(d.output, d.next_out))) : this.onData(u.shrinkBuf(d.output, d.next_out)));
        } while ((d.avail_in > 0 || d.avail_out === 0) && m !== 1);
        return _ === 4 ? (m = s.deflateEnd(this.strm), this.onEnd(m), this.ended = !0, m === 0) : _ !== 2 || (this.onEnd(0), d.avail_out = 0, !0);
      }, i.prototype.onData = function(k) {
        this.chunks.push(k);
      }, i.prototype.onEnd = function(k) {
        k === 0 && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = u.flattenChunks(this.chunks)), this.chunks = [], this.err = k, this.msg = this.strm.msg;
      }, h.Deflate = i, h.deflate = e, h.deflateRaw = function(k, O) {
        return (O = O || {}).raw = !0, e(k, O);
      }, h.gzip = function(k, O) {
        return (O = O || {}).gzip = !0, e(k, O);
      };
    }, function(N, h, t) {
      var s, u = t(31), P = t(152), c = t(120), n = t(121), a = t(96);
      function i(R, U) {
        return R.msg = a[U], U;
      }
      function e(R) {
        return (R << 1) - (R > 4 ? 9 : 0);
      }
      function k(R) {
        for (var U = R.length; --U >= 0; ) R[U] = 0;
      }
      function O(R) {
        var U = R.state, z = U.pending;
        z > R.avail_out && (z = R.avail_out), z !== 0 && (u.arraySet(R.output, U.pending_buf, U.pending_out, z, R.next_out), R.next_out += z, U.pending_out += z, R.total_out += z, R.avail_out -= z, U.pending -= z, U.pending === 0 && (U.pending_out = 0));
      }
      function m(R, U) {
        P._tr_flush_block(R, R.block_start >= 0 ? R.block_start : -1, R.strstart - R.block_start, U), R.block_start = R.strstart, O(R.strm);
      }
      function _(R, U) {
        R.pending_buf[R.pending++] = U;
      }
      function d(R, U) {
        R.pending_buf[R.pending++] = U >>> 8 & 255, R.pending_buf[R.pending++] = 255 & U;
      }
      function S(R, U) {
        var z, $, H = R.max_chain_length, nt = R.strstart, ot = R.prev_length, V = R.nice_match, it = R.strstart > R.w_size - 262 ? R.strstart - (R.w_size - 262) : 0, lt = R.window, dt = R.w_mask, G = R.prev, Z = R.strstart + 258, ut = lt[nt + ot - 1], pt = lt[nt + ot];
        R.prev_length >= R.good_match && (H >>= 2), V > R.lookahead && (V = R.lookahead);
        do
          if (lt[(z = U) + ot] === pt && lt[z + ot - 1] === ut && lt[z] === lt[nt] && lt[++z] === lt[nt + 1]) {
            nt += 2, z++;
            do
              ;
            while (lt[++nt] === lt[++z] && lt[++nt] === lt[++z] && lt[++nt] === lt[++z] && lt[++nt] === lt[++z] && lt[++nt] === lt[++z] && lt[++nt] === lt[++z] && lt[++nt] === lt[++z] && lt[++nt] === lt[++z] && nt < Z);
            if ($ = 258 - (Z - nt), nt = Z - 258, $ > ot) {
              if (R.match_start = U, ot = $, $ >= V) break;
              ut = lt[nt + ot - 1], pt = lt[nt + ot];
            }
          }
        while ((U = G[U & dt]) > it && --H != 0);
        return ot <= R.lookahead ? ot : R.lookahead;
      }
      function x(R) {
        var U, z, $, H, nt, ot, V, it, lt, dt, G = R.w_size;
        do {
          if (H = R.window_size - R.lookahead - R.strstart, R.strstart >= G + (G - 262)) {
            u.arraySet(R.window, R.window, G, G, 0), R.match_start -= G, R.strstart -= G, R.block_start -= G, U = z = R.hash_size;
            do
              $ = R.head[--U], R.head[U] = $ >= G ? $ - G : 0;
            while (--z);
            U = z = G;
            do
              $ = R.prev[--U], R.prev[U] = $ >= G ? $ - G : 0;
            while (--z);
            H += G;
          }
          if (R.strm.avail_in === 0) break;
          if (ot = R.strm, V = R.window, it = R.strstart + R.lookahead, lt = H, dt = void 0, (dt = ot.avail_in) > lt && (dt = lt), z = dt === 0 ? 0 : (ot.avail_in -= dt, u.arraySet(V, ot.input, ot.next_in, dt, it), ot.state.wrap === 1 ? ot.adler = c(ot.adler, V, dt, it) : ot.state.wrap === 2 && (ot.adler = n(ot.adler, V, dt, it)), ot.next_in += dt, ot.total_in += dt, dt), R.lookahead += z, R.lookahead + R.insert >= 3) for (nt = R.strstart - R.insert, R.ins_h = R.window[nt], R.ins_h = (R.ins_h << R.hash_shift ^ R.window[nt + 1]) & R.hash_mask; R.insert && (R.ins_h = (R.ins_h << R.hash_shift ^ R.window[nt + 3 - 1]) & R.hash_mask, R.prev[nt & R.w_mask] = R.head[R.ins_h], R.head[R.ins_h] = nt, nt++, R.insert--, !(R.lookahead + R.insert < 3)); ) ;
        } while (R.lookahead < 262 && R.strm.avail_in !== 0);
      }
      function A(R, U) {
        for (var z, $; ; ) {
          if (R.lookahead < 262) {
            if (x(R), R.lookahead < 262 && U === 0) return 1;
            if (R.lookahead === 0) break;
          }
          if (z = 0, R.lookahead >= 3 && (R.ins_h = (R.ins_h << R.hash_shift ^ R.window[R.strstart + 3 - 1]) & R.hash_mask, z = R.prev[R.strstart & R.w_mask] = R.head[R.ins_h], R.head[R.ins_h] = R.strstart), z !== 0 && R.strstart - z <= R.w_size - 262 && (R.match_length = S(R, z)), R.match_length >= 3) if ($ = P._tr_tally(R, R.strstart - R.match_start, R.match_length - 3), R.lookahead -= R.match_length, R.match_length <= R.max_lazy_match && R.lookahead >= 3) {
            R.match_length--;
            do
              R.strstart++, R.ins_h = (R.ins_h << R.hash_shift ^ R.window[R.strstart + 3 - 1]) & R.hash_mask, z = R.prev[R.strstart & R.w_mask] = R.head[R.ins_h], R.head[R.ins_h] = R.strstart;
            while (--R.match_length != 0);
            R.strstart++;
          } else R.strstart += R.match_length, R.match_length = 0, R.ins_h = R.window[R.strstart], R.ins_h = (R.ins_h << R.hash_shift ^ R.window[R.strstart + 1]) & R.hash_mask;
          else $ = P._tr_tally(R, 0, R.window[R.strstart]), R.lookahead--, R.strstart++;
          if ($ && (m(R, !1), R.strm.avail_out === 0)) return 1;
        }
        return R.insert = R.strstart < 2 ? R.strstart : 2, U === 4 ? (m(R, !0), R.strm.avail_out === 0 ? 3 : 4) : R.last_lit && (m(R, !1), R.strm.avail_out === 0) ? 1 : 2;
      }
      function f(R, U) {
        for (var z, $, H; ; ) {
          if (R.lookahead < 262) {
            if (x(R), R.lookahead < 262 && U === 0) return 1;
            if (R.lookahead === 0) break;
          }
          if (z = 0, R.lookahead >= 3 && (R.ins_h = (R.ins_h << R.hash_shift ^ R.window[R.strstart + 3 - 1]) & R.hash_mask, z = R.prev[R.strstart & R.w_mask] = R.head[R.ins_h], R.head[R.ins_h] = R.strstart), R.prev_length = R.match_length, R.prev_match = R.match_start, R.match_length = 2, z !== 0 && R.prev_length < R.max_lazy_match && R.strstart - z <= R.w_size - 262 && (R.match_length = S(R, z), R.match_length <= 5 && (R.strategy === 1 || R.match_length === 3 && R.strstart - R.match_start > 4096) && (R.match_length = 2)), R.prev_length >= 3 && R.match_length <= R.prev_length) {
            H = R.strstart + R.lookahead - 3, $ = P._tr_tally(R, R.strstart - 1 - R.prev_match, R.prev_length - 3), R.lookahead -= R.prev_length - 1, R.prev_length -= 2;
            do
              ++R.strstart <= H && (R.ins_h = (R.ins_h << R.hash_shift ^ R.window[R.strstart + 3 - 1]) & R.hash_mask, z = R.prev[R.strstart & R.w_mask] = R.head[R.ins_h], R.head[R.ins_h] = R.strstart);
            while (--R.prev_length != 0);
            if (R.match_available = 0, R.match_length = 2, R.strstart++, $ && (m(R, !1), R.strm.avail_out === 0)) return 1;
          } else if (R.match_available) {
            if (($ = P._tr_tally(R, 0, R.window[R.strstart - 1])) && m(R, !1), R.strstart++, R.lookahead--, R.strm.avail_out === 0) return 1;
          } else R.match_available = 1, R.strstart++, R.lookahead--;
        }
        return R.match_available && ($ = P._tr_tally(R, 0, R.window[R.strstart - 1]), R.match_available = 0), R.insert = R.strstart < 2 ? R.strstart : 2, U === 4 ? (m(R, !0), R.strm.avail_out === 0 ? 3 : 4) : R.last_lit && (m(R, !1), R.strm.avail_out === 0) ? 1 : 2;
      }
      function E(R, U, z, $, H) {
        this.good_length = R, this.max_lazy = U, this.nice_length = z, this.max_chain = $, this.func = H;
      }
      function w() {
        this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = 8, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new u.Buf16(1146), this.dyn_dtree = new u.Buf16(122), this.bl_tree = new u.Buf16(78), k(this.dyn_ltree), k(this.dyn_dtree), k(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new u.Buf16(16), this.heap = new u.Buf16(573), k(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new u.Buf16(573), k(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
      }
      function I(R) {
        var U;
        return R && R.state ? (R.total_in = R.total_out = 0, R.data_type = 2, (U = R.state).pending = 0, U.pending_out = 0, U.wrap < 0 && (U.wrap = -U.wrap), U.status = U.wrap ? 42 : 113, R.adler = U.wrap === 2 ? 0 : 1, U.last_flush = 0, P._tr_init(U), 0) : i(R, -2);
      }
      function T(R) {
        var U, z = I(R);
        return z === 0 && ((U = R.state).window_size = 2 * U.w_size, k(U.head), U.max_lazy_match = s[U.level].max_lazy, U.good_match = s[U.level].good_length, U.nice_match = s[U.level].nice_length, U.max_chain_length = s[U.level].max_chain, U.strstart = 0, U.block_start = 0, U.lookahead = 0, U.insert = 0, U.match_length = U.prev_length = 2, U.match_available = 0, U.ins_h = 0), z;
      }
      function M(R, U, z, $, H, nt) {
        if (!R) return -2;
        var ot = 1;
        if (U === -1 && (U = 6), $ < 0 ? (ot = 0, $ = -$) : $ > 15 && (ot = 2, $ -= 16), H < 1 || H > 9 || z !== 8 || $ < 8 || $ > 15 || U < 0 || U > 9 || nt < 0 || nt > 4) return i(R, -2);
        $ === 8 && ($ = 9);
        var V = new w();
        return R.state = V, V.strm = R, V.wrap = ot, V.gzhead = null, V.w_bits = $, V.w_size = 1 << V.w_bits, V.w_mask = V.w_size - 1, V.hash_bits = H + 7, V.hash_size = 1 << V.hash_bits, V.hash_mask = V.hash_size - 1, V.hash_shift = ~~((V.hash_bits + 3 - 1) / 3), V.window = new u.Buf8(2 * V.w_size), V.head = new u.Buf16(V.hash_size), V.prev = new u.Buf16(V.w_size), V.lit_bufsize = 1 << H + 6, V.pending_buf_size = 4 * V.lit_bufsize, V.pending_buf = new u.Buf8(V.pending_buf_size), V.d_buf = 1 * V.lit_bufsize, V.l_buf = 3 * V.lit_bufsize, V.level = U, V.strategy = nt, V.method = z, T(R);
      }
      s = [new E(0, 0, 0, 0, function(R, U) {
        var z = 65535;
        for (z > R.pending_buf_size - 5 && (z = R.pending_buf_size - 5); ; ) {
          if (R.lookahead <= 1) {
            if (x(R), R.lookahead === 0 && U === 0) return 1;
            if (R.lookahead === 0) break;
          }
          R.strstart += R.lookahead, R.lookahead = 0;
          var $ = R.block_start + z;
          if ((R.strstart === 0 || R.strstart >= $) && (R.lookahead = R.strstart - $, R.strstart = $, m(R, !1), R.strm.avail_out === 0) || R.strstart - R.block_start >= R.w_size - 262 && (m(R, !1), R.strm.avail_out === 0)) return 1;
        }
        return R.insert = 0, U === 4 ? (m(R, !0), R.strm.avail_out === 0 ? 3 : 4) : (R.strstart > R.block_start && (m(R, !1), R.strm.avail_out), 1);
      }), new E(4, 4, 8, 4, A), new E(4, 5, 16, 8, A), new E(4, 6, 32, 32, A), new E(4, 4, 16, 16, f), new E(8, 16, 32, 32, f), new E(8, 16, 128, 128, f), new E(8, 32, 128, 256, f), new E(32, 128, 258, 1024, f), new E(32, 258, 258, 4096, f)], h.deflateInit = function(R, U) {
        return M(R, U, 8, 15, 8, 0);
      }, h.deflateInit2 = M, h.deflateReset = T, h.deflateResetKeep = I, h.deflateSetHeader = function(R, U) {
        return R && R.state ? R.state.wrap !== 2 ? -2 : (R.state.gzhead = U, 0) : -2;
      }, h.deflate = function(R, U) {
        var z, $, H, nt;
        if (!R || !R.state || U > 5 || U < 0) return R ? i(R, -2) : -2;
        if ($ = R.state, !R.output || !R.input && R.avail_in !== 0 || $.status === 666 && U !== 4) return i(R, R.avail_out === 0 ? -5 : -2);
        if ($.strm = R, z = $.last_flush, $.last_flush = U, $.status === 42) if ($.wrap === 2) R.adler = 0, _($, 31), _($, 139), _($, 8), $.gzhead ? (_($, ($.gzhead.text ? 1 : 0) + ($.gzhead.hcrc ? 2 : 0) + ($.gzhead.extra ? 4 : 0) + ($.gzhead.name ? 8 : 0) + ($.gzhead.comment ? 16 : 0)), _($, 255 & $.gzhead.time), _($, $.gzhead.time >> 8 & 255), _($, $.gzhead.time >> 16 & 255), _($, $.gzhead.time >> 24 & 255), _($, $.level === 9 ? 2 : $.strategy >= 2 || $.level < 2 ? 4 : 0), _($, 255 & $.gzhead.os), $.gzhead.extra && $.gzhead.extra.length && (_($, 255 & $.gzhead.extra.length), _($, $.gzhead.extra.length >> 8 & 255)), $.gzhead.hcrc && (R.adler = n(R.adler, $.pending_buf, $.pending, 0)), $.gzindex = 0, $.status = 69) : (_($, 0), _($, 0), _($, 0), _($, 0), _($, 0), _($, $.level === 9 ? 2 : $.strategy >= 2 || $.level < 2 ? 4 : 0), _($, 3), $.status = 113);
        else {
          var ot = 8 + ($.w_bits - 8 << 4) << 8;
          ot |= ($.strategy >= 2 || $.level < 2 ? 0 : $.level < 6 ? 1 : $.level === 6 ? 2 : 3) << 6, $.strstart !== 0 && (ot |= 32), ot += 31 - ot % 31, $.status = 113, d($, ot), $.strstart !== 0 && (d($, R.adler >>> 16), d($, 65535 & R.adler)), R.adler = 1;
        }
        if ($.status === 69) if ($.gzhead.extra) {
          for (H = $.pending; $.gzindex < (65535 & $.gzhead.extra.length) && ($.pending !== $.pending_buf_size || ($.gzhead.hcrc && $.pending > H && (R.adler = n(R.adler, $.pending_buf, $.pending - H, H)), O(R), H = $.pending, $.pending !== $.pending_buf_size)); ) _($, 255 & $.gzhead.extra[$.gzindex]), $.gzindex++;
          $.gzhead.hcrc && $.pending > H && (R.adler = n(R.adler, $.pending_buf, $.pending - H, H)), $.gzindex === $.gzhead.extra.length && ($.gzindex = 0, $.status = 73);
        } else $.status = 73;
        if ($.status === 73) if ($.gzhead.name) {
          H = $.pending;
          do {
            if ($.pending === $.pending_buf_size && ($.gzhead.hcrc && $.pending > H && (R.adler = n(R.adler, $.pending_buf, $.pending - H, H)), O(R), H = $.pending, $.pending === $.pending_buf_size)) {
              nt = 1;
              break;
            }
            nt = $.gzindex < $.gzhead.name.length ? 255 & $.gzhead.name.charCodeAt($.gzindex++) : 0, _($, nt);
          } while (nt !== 0);
          $.gzhead.hcrc && $.pending > H && (R.adler = n(R.adler, $.pending_buf, $.pending - H, H)), nt === 0 && ($.gzindex = 0, $.status = 91);
        } else $.status = 91;
        if ($.status === 91) if ($.gzhead.comment) {
          H = $.pending;
          do {
            if ($.pending === $.pending_buf_size && ($.gzhead.hcrc && $.pending > H && (R.adler = n(R.adler, $.pending_buf, $.pending - H, H)), O(R), H = $.pending, $.pending === $.pending_buf_size)) {
              nt = 1;
              break;
            }
            nt = $.gzindex < $.gzhead.comment.length ? 255 & $.gzhead.comment.charCodeAt($.gzindex++) : 0, _($, nt);
          } while (nt !== 0);
          $.gzhead.hcrc && $.pending > H && (R.adler = n(R.adler, $.pending_buf, $.pending - H, H)), nt === 0 && ($.status = 103);
        } else $.status = 103;
        if ($.status === 103 && ($.gzhead.hcrc ? ($.pending + 2 > $.pending_buf_size && O(R), $.pending + 2 <= $.pending_buf_size && (_($, 255 & R.adler), _($, R.adler >> 8 & 255), R.adler = 0, $.status = 113)) : $.status = 113), $.pending !== 0) {
          if (O(R), R.avail_out === 0) return $.last_flush = -1, 0;
        } else if (R.avail_in === 0 && e(U) <= e(z) && U !== 4) return i(R, -5);
        if ($.status === 666 && R.avail_in !== 0) return i(R, -5);
        if (R.avail_in !== 0 || $.lookahead !== 0 || U !== 0 && $.status !== 666) {
          var V = $.strategy === 2 ? function(it, lt) {
            for (var dt; ; ) {
              if (it.lookahead === 0 && (x(it), it.lookahead === 0)) {
                if (lt === 0) return 1;
                break;
              }
              if (it.match_length = 0, dt = P._tr_tally(it, 0, it.window[it.strstart]), it.lookahead--, it.strstart++, dt && (m(it, !1), it.strm.avail_out === 0)) return 1;
            }
            return it.insert = 0, lt === 4 ? (m(it, !0), it.strm.avail_out === 0 ? 3 : 4) : it.last_lit && (m(it, !1), it.strm.avail_out === 0) ? 1 : 2;
          }($, U) : $.strategy === 3 ? function(it, lt) {
            for (var dt, G, Z, ut, pt = it.window; ; ) {
              if (it.lookahead <= 258) {
                if (x(it), it.lookahead <= 258 && lt === 0) return 1;
                if (it.lookahead === 0) break;
              }
              if (it.match_length = 0, it.lookahead >= 3 && it.strstart > 0 && (G = pt[Z = it.strstart - 1]) === pt[++Z] && G === pt[++Z] && G === pt[++Z]) {
                ut = it.strstart + 258;
                do
                  ;
                while (G === pt[++Z] && G === pt[++Z] && G === pt[++Z] && G === pt[++Z] && G === pt[++Z] && G === pt[++Z] && G === pt[++Z] && G === pt[++Z] && Z < ut);
                it.match_length = 258 - (ut - Z), it.match_length > it.lookahead && (it.match_length = it.lookahead);
              }
              if (it.match_length >= 3 ? (dt = P._tr_tally(it, 1, it.match_length - 3), it.lookahead -= it.match_length, it.strstart += it.match_length, it.match_length = 0) : (dt = P._tr_tally(it, 0, it.window[it.strstart]), it.lookahead--, it.strstart++), dt && (m(it, !1), it.strm.avail_out === 0)) return 1;
            }
            return it.insert = 0, lt === 4 ? (m(it, !0), it.strm.avail_out === 0 ? 3 : 4) : it.last_lit && (m(it, !1), it.strm.avail_out === 0) ? 1 : 2;
          }($, U) : s[$.level].func($, U);
          if (V !== 3 && V !== 4 || ($.status = 666), V === 1 || V === 3) return R.avail_out === 0 && ($.last_flush = -1), 0;
          if (V === 2 && (U === 1 ? P._tr_align($) : U !== 5 && (P._tr_stored_block($, 0, 0, !1), U === 3 && (k($.head), $.lookahead === 0 && ($.strstart = 0, $.block_start = 0, $.insert = 0))), O(R), R.avail_out === 0)) return $.last_flush = -1, 0;
        }
        return U !== 4 ? 0 : $.wrap <= 0 ? 1 : ($.wrap === 2 ? (_($, 255 & R.adler), _($, R.adler >> 8 & 255), _($, R.adler >> 16 & 255), _($, R.adler >> 24 & 255), _($, 255 & R.total_in), _($, R.total_in >> 8 & 255), _($, R.total_in >> 16 & 255), _($, R.total_in >> 24 & 255)) : (d($, R.adler >>> 16), d($, 65535 & R.adler)), O(R), $.wrap > 0 && ($.wrap = -$.wrap), $.pending !== 0 ? 0 : 1);
      }, h.deflateEnd = function(R) {
        var U;
        return R && R.state ? (U = R.state.status) !== 42 && U !== 69 && U !== 73 && U !== 91 && U !== 103 && U !== 113 && U !== 666 ? i(R, -2) : (R.state = null, U === 113 ? i(R, -3) : 0) : -2;
      }, h.deflateSetDictionary = function(R, U) {
        var z, $, H, nt, ot, V, it, lt, dt = U.length;
        if (!R || !R.state || (nt = (z = R.state).wrap) === 2 || nt === 1 && z.status !== 42 || z.lookahead) return -2;
        for (nt === 1 && (R.adler = c(R.adler, U, dt, 0)), z.wrap = 0, dt >= z.w_size && (nt === 0 && (k(z.head), z.strstart = 0, z.block_start = 0, z.insert = 0), lt = new u.Buf8(z.w_size), u.arraySet(lt, U, dt - z.w_size, z.w_size, 0), U = lt, dt = z.w_size), ot = R.avail_in, V = R.next_in, it = R.input, R.avail_in = dt, R.next_in = 0, R.input = U, x(z); z.lookahead >= 3; ) {
          $ = z.strstart, H = z.lookahead - 2;
          do
            z.ins_h = (z.ins_h << z.hash_shift ^ z.window[$ + 3 - 1]) & z.hash_mask, z.prev[$ & z.w_mask] = z.head[z.ins_h], z.head[z.ins_h] = $, $++;
          while (--H);
          z.strstart = $, z.lookahead = 2, x(z);
        }
        return z.strstart += z.lookahead, z.block_start = z.strstart, z.insert = z.lookahead, z.lookahead = 0, z.match_length = z.prev_length = 2, z.match_available = 0, R.next_in = V, R.input = it, R.avail_in = ot, z.wrap = nt, 0;
      }, h.deflateInfo = "pako deflate (from Nodeca project)";
    }, function(N, h, t) {
      var s = t(31);
      function u(G) {
        for (var Z = G.length; --Z >= 0; ) G[Z] = 0;
      }
      var P = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], c = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], n = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], a = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], i = new Array(576);
      u(i);
      var e = new Array(60);
      u(e);
      var k = new Array(512);
      u(k);
      var O = new Array(256);
      u(O);
      var m = new Array(29);
      u(m);
      var _, d, S, x = new Array(30);
      function A(G, Z, ut, pt, st) {
        this.static_tree = G, this.extra_bits = Z, this.extra_base = ut, this.elems = pt, this.max_length = st, this.has_stree = G && G.length;
      }
      function f(G, Z) {
        this.dyn_tree = G, this.max_code = 0, this.stat_desc = Z;
      }
      function E(G) {
        return G < 256 ? k[G] : k[256 + (G >>> 7)];
      }
      function w(G, Z) {
        G.pending_buf[G.pending++] = 255 & Z, G.pending_buf[G.pending++] = Z >>> 8 & 255;
      }
      function I(G, Z, ut) {
        G.bi_valid > 16 - ut ? (G.bi_buf |= Z << G.bi_valid & 65535, w(G, G.bi_buf), G.bi_buf = Z >> 16 - G.bi_valid, G.bi_valid += ut - 16) : (G.bi_buf |= Z << G.bi_valid & 65535, G.bi_valid += ut);
      }
      function T(G, Z, ut) {
        I(G, ut[2 * Z], ut[2 * Z + 1]);
      }
      function M(G, Z) {
        var ut = 0;
        do
          ut |= 1 & G, G >>>= 1, ut <<= 1;
        while (--Z > 0);
        return ut >>> 1;
      }
      function R(G, Z, ut) {
        var pt, st, mt = new Array(16), bt = 0;
        for (pt = 1; pt <= 15; pt++) mt[pt] = bt = bt + ut[pt - 1] << 1;
        for (st = 0; st <= Z; st++) {
          var wt = G[2 * st + 1];
          wt !== 0 && (G[2 * st] = M(mt[wt]++, wt));
        }
      }
      function U(G) {
        var Z;
        for (Z = 0; Z < 286; Z++) G.dyn_ltree[2 * Z] = 0;
        for (Z = 0; Z < 30; Z++) G.dyn_dtree[2 * Z] = 0;
        for (Z = 0; Z < 19; Z++) G.bl_tree[2 * Z] = 0;
        G.dyn_ltree[512] = 1, G.opt_len = G.static_len = 0, G.last_lit = G.matches = 0;
      }
      function z(G) {
        G.bi_valid > 8 ? w(G, G.bi_buf) : G.bi_valid > 0 && (G.pending_buf[G.pending++] = G.bi_buf), G.bi_buf = 0, G.bi_valid = 0;
      }
      function $(G, Z, ut, pt) {
        var st = 2 * Z, mt = 2 * ut;
        return G[st] < G[mt] || G[st] === G[mt] && pt[Z] <= pt[ut];
      }
      function H(G, Z, ut) {
        for (var pt = G.heap[ut], st = ut << 1; st <= G.heap_len && (st < G.heap_len && $(Z, G.heap[st + 1], G.heap[st], G.depth) && st++, !$(Z, pt, G.heap[st], G.depth)); ) G.heap[ut] = G.heap[st], ut = st, st <<= 1;
        G.heap[ut] = pt;
      }
      function nt(G, Z, ut) {
        var pt, st, mt, bt, wt = 0;
        if (G.last_lit !== 0) do
          pt = G.pending_buf[G.d_buf + 2 * wt] << 8 | G.pending_buf[G.d_buf + 2 * wt + 1], st = G.pending_buf[G.l_buf + wt], wt++, pt === 0 ? T(G, st, Z) : (T(G, (mt = O[st]) + 256 + 1, Z), (bt = P[mt]) !== 0 && I(G, st -= m[mt], bt), T(G, mt = E(--pt), ut), (bt = c[mt]) !== 0 && I(G, pt -= x[mt], bt));
        while (wt < G.last_lit);
        T(G, 256, Z);
      }
      function ot(G, Z) {
        var ut, pt, st, mt = Z.dyn_tree, bt = Z.stat_desc.static_tree, wt = Z.stat_desc.has_stree, C = Z.stat_desc.elems, F = -1;
        for (G.heap_len = 0, G.heap_max = 573, ut = 0; ut < C; ut++) mt[2 * ut] !== 0 ? (G.heap[++G.heap_len] = F = ut, G.depth[ut] = 0) : mt[2 * ut + 1] = 0;
        for (; G.heap_len < 2; ) mt[2 * (st = G.heap[++G.heap_len] = F < 2 ? ++F : 0)] = 1, G.depth[st] = 0, G.opt_len--, wt && (G.static_len -= bt[2 * st + 1]);
        for (Z.max_code = F, ut = G.heap_len >> 1; ut >= 1; ut--) H(G, mt, ut);
        st = C;
        do
          ut = G.heap[1], G.heap[1] = G.heap[G.heap_len--], H(G, mt, 1), pt = G.heap[1], G.heap[--G.heap_max] = ut, G.heap[--G.heap_max] = pt, mt[2 * st] = mt[2 * ut] + mt[2 * pt], G.depth[st] = (G.depth[ut] >= G.depth[pt] ? G.depth[ut] : G.depth[pt]) + 1, mt[2 * ut + 1] = mt[2 * pt + 1] = st, G.heap[1] = st++, H(G, mt, 1);
        while (G.heap_len >= 2);
        G.heap[--G.heap_max] = G.heap[1], function(L, K) {
          var X, rt, yt, kt, At, Tt, Et = K.dyn_tree, Wt = K.max_code, Vt = K.stat_desc.static_tree, re = K.stat_desc.has_stree, vt = K.stat_desc.extra_bits, Zt = K.stat_desc.extra_base, Dt = K.stat_desc.max_length, qt = 0;
          for (kt = 0; kt <= 15; kt++) L.bl_count[kt] = 0;
          for (Et[2 * L.heap[L.heap_max] + 1] = 0, X = L.heap_max + 1; X < 573; X++) (kt = Et[2 * Et[2 * (rt = L.heap[X]) + 1] + 1] + 1) > Dt && (kt = Dt, qt++), Et[2 * rt + 1] = kt, rt > Wt || (L.bl_count[kt]++, At = 0, rt >= Zt && (At = vt[rt - Zt]), Tt = Et[2 * rt], L.opt_len += Tt * (kt + At), re && (L.static_len += Tt * (Vt[2 * rt + 1] + At)));
          if (qt !== 0) {
            do {
              for (kt = Dt - 1; L.bl_count[kt] === 0; ) kt--;
              L.bl_count[kt]--, L.bl_count[kt + 1] += 2, L.bl_count[Dt]--, qt -= 2;
            } while (qt > 0);
            for (kt = Dt; kt !== 0; kt--) for (rt = L.bl_count[kt]; rt !== 0; ) (yt = L.heap[--X]) > Wt || (Et[2 * yt + 1] !== kt && (L.opt_len += (kt - Et[2 * yt + 1]) * Et[2 * yt], Et[2 * yt + 1] = kt), rt--);
          }
        }(G, Z), R(mt, F, G.bl_count);
      }
      function V(G, Z, ut) {
        var pt, st, mt = -1, bt = Z[1], wt = 0, C = 7, F = 4;
        for (bt === 0 && (C = 138, F = 3), Z[2 * (ut + 1) + 1] = 65535, pt = 0; pt <= ut; pt++) st = bt, bt = Z[2 * (pt + 1) + 1], ++wt < C && st === bt || (wt < F ? G.bl_tree[2 * st] += wt : st !== 0 ? (st !== mt && G.bl_tree[2 * st]++, G.bl_tree[32]++) : wt <= 10 ? G.bl_tree[34]++ : G.bl_tree[36]++, wt = 0, mt = st, bt === 0 ? (C = 138, F = 3) : st === bt ? (C = 6, F = 3) : (C = 7, F = 4));
      }
      function it(G, Z, ut) {
        var pt, st, mt = -1, bt = Z[1], wt = 0, C = 7, F = 4;
        for (bt === 0 && (C = 138, F = 3), pt = 0; pt <= ut; pt++) if (st = bt, bt = Z[2 * (pt + 1) + 1], !(++wt < C && st === bt)) {
          if (wt < F) do
            T(G, st, G.bl_tree);
          while (--wt != 0);
          else st !== 0 ? (st !== mt && (T(G, st, G.bl_tree), wt--), T(G, 16, G.bl_tree), I(G, wt - 3, 2)) : wt <= 10 ? (T(G, 17, G.bl_tree), I(G, wt - 3, 3)) : (T(G, 18, G.bl_tree), I(G, wt - 11, 7));
          wt = 0, mt = st, bt === 0 ? (C = 138, F = 3) : st === bt ? (C = 6, F = 3) : (C = 7, F = 4);
        }
      }
      u(x);
      var lt = !1;
      function dt(G, Z, ut, pt) {
        I(G, 0 + (pt ? 1 : 0), 3), function(st, mt, bt, wt) {
          z(st), w(st, bt), w(st, ~bt), s.arraySet(st.pending_buf, st.window, mt, bt, st.pending), st.pending += bt;
        }(G, Z, ut);
      }
      h._tr_init = function(G) {
        lt || (function() {
          var Z, ut, pt, st, mt, bt = new Array(16);
          for (pt = 0, st = 0; st < 28; st++) for (m[st] = pt, Z = 0; Z < 1 << P[st]; Z++) O[pt++] = st;
          for (O[pt - 1] = st, mt = 0, st = 0; st < 16; st++) for (x[st] = mt, Z = 0; Z < 1 << c[st]; Z++) k[mt++] = st;
          for (mt >>= 7; st < 30; st++) for (x[st] = mt << 7, Z = 0; Z < 1 << c[st] - 7; Z++) k[256 + mt++] = st;
          for (ut = 0; ut <= 15; ut++) bt[ut] = 0;
          for (Z = 0; Z <= 143; ) i[2 * Z + 1] = 8, Z++, bt[8]++;
          for (; Z <= 255; ) i[2 * Z + 1] = 9, Z++, bt[9]++;
          for (; Z <= 279; ) i[2 * Z + 1] = 7, Z++, bt[7]++;
          for (; Z <= 287; ) i[2 * Z + 1] = 8, Z++, bt[8]++;
          for (R(i, 287, bt), Z = 0; Z < 30; Z++) e[2 * Z + 1] = 5, e[2 * Z] = M(Z, 5);
          _ = new A(i, P, 257, 286, 15), d = new A(e, c, 0, 30, 15), S = new A(new Array(0), n, 0, 19, 7);
        }(), lt = !0), G.l_desc = new f(G.dyn_ltree, _), G.d_desc = new f(G.dyn_dtree, d), G.bl_desc = new f(G.bl_tree, S), G.bi_buf = 0, G.bi_valid = 0, U(G);
      }, h._tr_stored_block = dt, h._tr_flush_block = function(G, Z, ut, pt) {
        var st, mt, bt = 0;
        G.level > 0 ? (G.strm.data_type === 2 && (G.strm.data_type = function(wt) {
          var C, F = 4093624447;
          for (C = 0; C <= 31; C++, F >>>= 1) if (1 & F && wt.dyn_ltree[2 * C] !== 0) return 0;
          if (wt.dyn_ltree[18] !== 0 || wt.dyn_ltree[20] !== 0 || wt.dyn_ltree[26] !== 0) return 1;
          for (C = 32; C < 256; C++) if (wt.dyn_ltree[2 * C] !== 0) return 1;
          return 0;
        }(G)), ot(G, G.l_desc), ot(G, G.d_desc), bt = function(wt) {
          var C;
          for (V(wt, wt.dyn_ltree, wt.l_desc.max_code), V(wt, wt.dyn_dtree, wt.d_desc.max_code), ot(wt, wt.bl_desc), C = 18; C >= 3 && wt.bl_tree[2 * a[C] + 1] === 0; C--) ;
          return wt.opt_len += 3 * (C + 1) + 5 + 5 + 4, C;
        }(G), st = G.opt_len + 3 + 7 >>> 3, (mt = G.static_len + 3 + 7 >>> 3) <= st && (st = mt)) : st = mt = ut + 5, ut + 4 <= st && Z !== -1 ? dt(G, Z, ut, pt) : G.strategy === 4 || mt === st ? (I(G, 2 + (pt ? 1 : 0), 3), nt(G, i, e)) : (I(G, 4 + (pt ? 1 : 0), 3), function(wt, C, F, L) {
          var K;
          for (I(wt, C - 257, 5), I(wt, F - 1, 5), I(wt, L - 4, 4), K = 0; K < L; K++) I(wt, wt.bl_tree[2 * a[K] + 1], 3);
          it(wt, wt.dyn_ltree, C - 1), it(wt, wt.dyn_dtree, F - 1);
        }(G, G.l_desc.max_code + 1, G.d_desc.max_code + 1, bt + 1), nt(G, G.dyn_ltree, G.dyn_dtree)), U(G), pt && z(G);
      }, h._tr_tally = function(G, Z, ut) {
        return G.pending_buf[G.d_buf + 2 * G.last_lit] = Z >>> 8 & 255, G.pending_buf[G.d_buf + 2 * G.last_lit + 1] = 255 & Z, G.pending_buf[G.l_buf + G.last_lit] = 255 & ut, G.last_lit++, Z === 0 ? G.dyn_ltree[2 * ut]++ : (G.matches++, Z--, G.dyn_ltree[2 * (O[ut] + 256 + 1)]++, G.dyn_dtree[2 * E(Z)]++), G.last_lit === G.lit_bufsize - 1;
      }, h._tr_align = function(G) {
        I(G, 2, 3), T(G, 256, i), function(Z) {
          Z.bi_valid === 16 ? (w(Z, Z.bi_buf), Z.bi_buf = 0, Z.bi_valid = 0) : Z.bi_valid >= 8 && (Z.pending_buf[Z.pending++] = 255 & Z.bi_buf, Z.bi_buf >>= 8, Z.bi_valid -= 8);
        }(G);
      };
    }, function(N, h, t) {
      var s = t(154), u = t(31), P = t(122), c = t(124), n = t(96), a = t(123), i = t(157), e = Object.prototype.toString;
      function k(m) {
        if (!(this instanceof k)) return new k(m);
        this.options = u.assign({ chunkSize: 16384, windowBits: 0, to: "" }, m || {});
        var _ = this.options;
        _.raw && _.windowBits >= 0 && _.windowBits < 16 && (_.windowBits = -_.windowBits, _.windowBits === 0 && (_.windowBits = -15)), !(_.windowBits >= 0 && _.windowBits < 16) || m && m.windowBits || (_.windowBits += 32), _.windowBits > 15 && _.windowBits < 48 && (15 & _.windowBits) == 0 && (_.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new a(), this.strm.avail_out = 0;
        var d = s.inflateInit2(this.strm, _.windowBits);
        if (d !== c.Z_OK) throw new Error(n[d]);
        if (this.header = new i(), s.inflateGetHeader(this.strm, this.header), _.dictionary && (typeof _.dictionary == "string" ? _.dictionary = P.string2buf(_.dictionary) : e.call(_.dictionary) === "[object ArrayBuffer]" && (_.dictionary = new Uint8Array(_.dictionary)), _.raw && (d = s.inflateSetDictionary(this.strm, _.dictionary)) !== c.Z_OK)) throw new Error(n[d]);
      }
      function O(m, _) {
        var d = new k(_);
        if (d.push(m, !0), d.err) throw d.msg || n[d.err];
        return d.result;
      }
      k.prototype.push = function(m, _) {
        var d, S, x, A, f, E = this.strm, w = this.options.chunkSize, I = this.options.dictionary, T = !1;
        if (this.ended) return !1;
        S = _ === ~~_ ? _ : _ === !0 ? c.Z_FINISH : c.Z_NO_FLUSH, typeof m == "string" ? E.input = P.binstring2buf(m) : e.call(m) === "[object ArrayBuffer]" ? E.input = new Uint8Array(m) : E.input = m, E.next_in = 0, E.avail_in = E.input.length;
        do {
          if (E.avail_out === 0 && (E.output = new u.Buf8(w), E.next_out = 0, E.avail_out = w), (d = s.inflate(E, c.Z_NO_FLUSH)) === c.Z_NEED_DICT && I && (d = s.inflateSetDictionary(this.strm, I)), d === c.Z_BUF_ERROR && T === !0 && (d = c.Z_OK, T = !1), d !== c.Z_STREAM_END && d !== c.Z_OK) return this.onEnd(d), this.ended = !0, !1;
          E.next_out && (E.avail_out !== 0 && d !== c.Z_STREAM_END && (E.avail_in !== 0 || S !== c.Z_FINISH && S !== c.Z_SYNC_FLUSH) || (this.options.to === "string" ? (x = P.utf8border(E.output, E.next_out), A = E.next_out - x, f = P.buf2string(E.output, x), E.next_out = A, E.avail_out = w - A, A && u.arraySet(E.output, E.output, x, A, 0), this.onData(f)) : this.onData(u.shrinkBuf(E.output, E.next_out)))), E.avail_in === 0 && E.avail_out === 0 && (T = !0);
        } while ((E.avail_in > 0 || E.avail_out === 0) && d !== c.Z_STREAM_END);
        return d === c.Z_STREAM_END && (S = c.Z_FINISH), S === c.Z_FINISH ? (d = s.inflateEnd(this.strm), this.onEnd(d), this.ended = !0, d === c.Z_OK) : S !== c.Z_SYNC_FLUSH || (this.onEnd(c.Z_OK), E.avail_out = 0, !0);
      }, k.prototype.onData = function(m) {
        this.chunks.push(m);
      }, k.prototype.onEnd = function(m) {
        m === c.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = u.flattenChunks(this.chunks)), this.chunks = [], this.err = m, this.msg = this.strm.msg;
      }, h.Inflate = k, h.inflate = O, h.inflateRaw = function(m, _) {
        return (_ = _ || {}).raw = !0, O(m, _);
      }, h.ungzip = O;
    }, function(N, h, t) {
      var s = t(31), u = t(120), P = t(121), c = t(155), n = t(156);
      function a(f) {
        return (f >>> 24 & 255) + (f >>> 8 & 65280) + ((65280 & f) << 8) + ((255 & f) << 24);
      }
      function i() {
        this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new s.Buf16(320), this.work = new s.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
      }
      function e(f) {
        var E;
        return f && f.state ? (E = f.state, f.total_in = f.total_out = E.total = 0, f.msg = "", E.wrap && (f.adler = 1 & E.wrap), E.mode = 1, E.last = 0, E.havedict = 0, E.dmax = 32768, E.head = null, E.hold = 0, E.bits = 0, E.lencode = E.lendyn = new s.Buf32(852), E.distcode = E.distdyn = new s.Buf32(592), E.sane = 1, E.back = -1, 0) : -2;
      }
      function k(f) {
        var E;
        return f && f.state ? ((E = f.state).wsize = 0, E.whave = 0, E.wnext = 0, e(f)) : -2;
      }
      function O(f, E) {
        var w, I;
        return f && f.state ? (I = f.state, E < 0 ? (w = 0, E = -E) : (w = 1 + (E >> 4), E < 48 && (E &= 15)), E && (E < 8 || E > 15) ? -2 : (I.window !== null && I.wbits !== E && (I.window = null), I.wrap = w, I.wbits = E, k(f))) : -2;
      }
      function m(f, E) {
        var w, I;
        return f ? (I = new i(), f.state = I, I.window = null, (w = O(f, E)) !== 0 && (f.state = null), w) : -2;
      }
      var _, d, S = !0;
      function x(f) {
        if (S) {
          var E;
          for (_ = new s.Buf32(512), d = new s.Buf32(32), E = 0; E < 144; ) f.lens[E++] = 8;
          for (; E < 256; ) f.lens[E++] = 9;
          for (; E < 280; ) f.lens[E++] = 7;
          for (; E < 288; ) f.lens[E++] = 8;
          for (n(1, f.lens, 0, 288, _, 0, f.work, { bits: 9 }), E = 0; E < 32; ) f.lens[E++] = 5;
          n(2, f.lens, 0, 32, d, 0, f.work, { bits: 5 }), S = !1;
        }
        f.lencode = _, f.lenbits = 9, f.distcode = d, f.distbits = 5;
      }
      function A(f, E, w, I) {
        var T, M = f.state;
        return M.window === null && (M.wsize = 1 << M.wbits, M.wnext = 0, M.whave = 0, M.window = new s.Buf8(M.wsize)), I >= M.wsize ? (s.arraySet(M.window, E, w - M.wsize, M.wsize, 0), M.wnext = 0, M.whave = M.wsize) : ((T = M.wsize - M.wnext) > I && (T = I), s.arraySet(M.window, E, w - I, T, M.wnext), (I -= T) ? (s.arraySet(M.window, E, w - I, I, 0), M.wnext = I, M.whave = M.wsize) : (M.wnext += T, M.wnext === M.wsize && (M.wnext = 0), M.whave < M.wsize && (M.whave += T))), 0;
      }
      h.inflateReset = k, h.inflateReset2 = O, h.inflateResetKeep = e, h.inflateInit = function(f) {
        return m(f, 15);
      }, h.inflateInit2 = m, h.inflate = function(f, E) {
        var w, I, T, M, R, U, z, $, H, nt, ot, V, it, lt, dt, G, Z, ut, pt, st, mt, bt, wt, C, F = 0, L = new s.Buf8(4), K = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
        if (!f || !f.state || !f.output || !f.input && f.avail_in !== 0) return -2;
        (w = f.state).mode === 12 && (w.mode = 13), R = f.next_out, T = f.output, z = f.avail_out, M = f.next_in, I = f.input, U = f.avail_in, $ = w.hold, H = w.bits, nt = U, ot = z, bt = 0;
        t: for (; ; ) switch (w.mode) {
          case 1:
            if (w.wrap === 0) {
              w.mode = 13;
              break;
            }
            for (; H < 16; ) {
              if (U === 0) break t;
              U--, $ += I[M++] << H, H += 8;
            }
            if (2 & w.wrap && $ === 35615) {
              w.check = 0, L[0] = 255 & $, L[1] = $ >>> 8 & 255, w.check = P(w.check, L, 2, 0), $ = 0, H = 0, w.mode = 2;
              break;
            }
            if (w.flags = 0, w.head && (w.head.done = !1), !(1 & w.wrap) || (((255 & $) << 8) + ($ >> 8)) % 31) {
              f.msg = "incorrect header check", w.mode = 30;
              break;
            }
            if ((15 & $) != 8) {
              f.msg = "unknown compression method", w.mode = 30;
              break;
            }
            if (H -= 4, mt = 8 + (15 & ($ >>>= 4)), w.wbits === 0) w.wbits = mt;
            else if (mt > w.wbits) {
              f.msg = "invalid window size", w.mode = 30;
              break;
            }
            w.dmax = 1 << mt, f.adler = w.check = 1, w.mode = 512 & $ ? 10 : 12, $ = 0, H = 0;
            break;
          case 2:
            for (; H < 16; ) {
              if (U === 0) break t;
              U--, $ += I[M++] << H, H += 8;
            }
            if (w.flags = $, (255 & w.flags) != 8) {
              f.msg = "unknown compression method", w.mode = 30;
              break;
            }
            if (57344 & w.flags) {
              f.msg = "unknown header flags set", w.mode = 30;
              break;
            }
            w.head && (w.head.text = $ >> 8 & 1), 512 & w.flags && (L[0] = 255 & $, L[1] = $ >>> 8 & 255, w.check = P(w.check, L, 2, 0)), $ = 0, H = 0, w.mode = 3;
          case 3:
            for (; H < 32; ) {
              if (U === 0) break t;
              U--, $ += I[M++] << H, H += 8;
            }
            w.head && (w.head.time = $), 512 & w.flags && (L[0] = 255 & $, L[1] = $ >>> 8 & 255, L[2] = $ >>> 16 & 255, L[3] = $ >>> 24 & 255, w.check = P(w.check, L, 4, 0)), $ = 0, H = 0, w.mode = 4;
          case 4:
            for (; H < 16; ) {
              if (U === 0) break t;
              U--, $ += I[M++] << H, H += 8;
            }
            w.head && (w.head.xflags = 255 & $, w.head.os = $ >> 8), 512 & w.flags && (L[0] = 255 & $, L[1] = $ >>> 8 & 255, w.check = P(w.check, L, 2, 0)), $ = 0, H = 0, w.mode = 5;
          case 5:
            if (1024 & w.flags) {
              for (; H < 16; ) {
                if (U === 0) break t;
                U--, $ += I[M++] << H, H += 8;
              }
              w.length = $, w.head && (w.head.extra_len = $), 512 & w.flags && (L[0] = 255 & $, L[1] = $ >>> 8 & 255, w.check = P(w.check, L, 2, 0)), $ = 0, H = 0;
            } else w.head && (w.head.extra = null);
            w.mode = 6;
          case 6:
            if (1024 & w.flags && ((V = w.length) > U && (V = U), V && (w.head && (mt = w.head.extra_len - w.length, w.head.extra || (w.head.extra = new Array(w.head.extra_len)), s.arraySet(w.head.extra, I, M, V, mt)), 512 & w.flags && (w.check = P(w.check, I, V, M)), U -= V, M += V, w.length -= V), w.length)) break t;
            w.length = 0, w.mode = 7;
          case 7:
            if (2048 & w.flags) {
              if (U === 0) break t;
              V = 0;
              do
                mt = I[M + V++], w.head && mt && w.length < 65536 && (w.head.name += String.fromCharCode(mt));
              while (mt && V < U);
              if (512 & w.flags && (w.check = P(w.check, I, V, M)), U -= V, M += V, mt) break t;
            } else w.head && (w.head.name = null);
            w.length = 0, w.mode = 8;
          case 8:
            if (4096 & w.flags) {
              if (U === 0) break t;
              V = 0;
              do
                mt = I[M + V++], w.head && mt && w.length < 65536 && (w.head.comment += String.fromCharCode(mt));
              while (mt && V < U);
              if (512 & w.flags && (w.check = P(w.check, I, V, M)), U -= V, M += V, mt) break t;
            } else w.head && (w.head.comment = null);
            w.mode = 9;
          case 9:
            if (512 & w.flags) {
              for (; H < 16; ) {
                if (U === 0) break t;
                U--, $ += I[M++] << H, H += 8;
              }
              if ($ !== (65535 & w.check)) {
                f.msg = "header crc mismatch", w.mode = 30;
                break;
              }
              $ = 0, H = 0;
            }
            w.head && (w.head.hcrc = w.flags >> 9 & 1, w.head.done = !0), f.adler = w.check = 0, w.mode = 12;
            break;
          case 10:
            for (; H < 32; ) {
              if (U === 0) break t;
              U--, $ += I[M++] << H, H += 8;
            }
            f.adler = w.check = a($), $ = 0, H = 0, w.mode = 11;
          case 11:
            if (w.havedict === 0) return f.next_out = R, f.avail_out = z, f.next_in = M, f.avail_in = U, w.hold = $, w.bits = H, 2;
            f.adler = w.check = 1, w.mode = 12;
          case 12:
            if (E === 5 || E === 6) break t;
          case 13:
            if (w.last) {
              $ >>>= 7 & H, H -= 7 & H, w.mode = 27;
              break;
            }
            for (; H < 3; ) {
              if (U === 0) break t;
              U--, $ += I[M++] << H, H += 8;
            }
            switch (w.last = 1 & $, H -= 1, 3 & ($ >>>= 1)) {
              case 0:
                w.mode = 14;
                break;
              case 1:
                if (x(w), w.mode = 20, E === 6) {
                  $ >>>= 2, H -= 2;
                  break t;
                }
                break;
              case 2:
                w.mode = 17;
                break;
              case 3:
                f.msg = "invalid block type", w.mode = 30;
            }
            $ >>>= 2, H -= 2;
            break;
          case 14:
            for ($ >>>= 7 & H, H -= 7 & H; H < 32; ) {
              if (U === 0) break t;
              U--, $ += I[M++] << H, H += 8;
            }
            if ((65535 & $) != ($ >>> 16 ^ 65535)) {
              f.msg = "invalid stored block lengths", w.mode = 30;
              break;
            }
            if (w.length = 65535 & $, $ = 0, H = 0, w.mode = 15, E === 6) break t;
          case 15:
            w.mode = 16;
          case 16:
            if (V = w.length) {
              if (V > U && (V = U), V > z && (V = z), V === 0) break t;
              s.arraySet(T, I, M, V, R), U -= V, M += V, z -= V, R += V, w.length -= V;
              break;
            }
            w.mode = 12;
            break;
          case 17:
            for (; H < 14; ) {
              if (U === 0) break t;
              U--, $ += I[M++] << H, H += 8;
            }
            if (w.nlen = 257 + (31 & $), $ >>>= 5, H -= 5, w.ndist = 1 + (31 & $), $ >>>= 5, H -= 5, w.ncode = 4 + (15 & $), $ >>>= 4, H -= 4, w.nlen > 286 || w.ndist > 30) {
              f.msg = "too many length or distance symbols", w.mode = 30;
              break;
            }
            w.have = 0, w.mode = 18;
          case 18:
            for (; w.have < w.ncode; ) {
              for (; H < 3; ) {
                if (U === 0) break t;
                U--, $ += I[M++] << H, H += 8;
              }
              w.lens[K[w.have++]] = 7 & $, $ >>>= 3, H -= 3;
            }
            for (; w.have < 19; ) w.lens[K[w.have++]] = 0;
            if (w.lencode = w.lendyn, w.lenbits = 7, wt = { bits: w.lenbits }, bt = n(0, w.lens, 0, 19, w.lencode, 0, w.work, wt), w.lenbits = wt.bits, bt) {
              f.msg = "invalid code lengths set", w.mode = 30;
              break;
            }
            w.have = 0, w.mode = 19;
          case 19:
            for (; w.have < w.nlen + w.ndist; ) {
              for (; G = (F = w.lencode[$ & (1 << w.lenbits) - 1]) >>> 16 & 255, Z = 65535 & F, !((dt = F >>> 24) <= H); ) {
                if (U === 0) break t;
                U--, $ += I[M++] << H, H += 8;
              }
              if (Z < 16) $ >>>= dt, H -= dt, w.lens[w.have++] = Z;
              else {
                if (Z === 16) {
                  for (C = dt + 2; H < C; ) {
                    if (U === 0) break t;
                    U--, $ += I[M++] << H, H += 8;
                  }
                  if ($ >>>= dt, H -= dt, w.have === 0) {
                    f.msg = "invalid bit length repeat", w.mode = 30;
                    break;
                  }
                  mt = w.lens[w.have - 1], V = 3 + (3 & $), $ >>>= 2, H -= 2;
                } else if (Z === 17) {
                  for (C = dt + 3; H < C; ) {
                    if (U === 0) break t;
                    U--, $ += I[M++] << H, H += 8;
                  }
                  H -= dt, mt = 0, V = 3 + (7 & ($ >>>= dt)), $ >>>= 3, H -= 3;
                } else {
                  for (C = dt + 7; H < C; ) {
                    if (U === 0) break t;
                    U--, $ += I[M++] << H, H += 8;
                  }
                  H -= dt, mt = 0, V = 11 + (127 & ($ >>>= dt)), $ >>>= 7, H -= 7;
                }
                if (w.have + V > w.nlen + w.ndist) {
                  f.msg = "invalid bit length repeat", w.mode = 30;
                  break;
                }
                for (; V--; ) w.lens[w.have++] = mt;
              }
            }
            if (w.mode === 30) break;
            if (w.lens[256] === 0) {
              f.msg = "invalid code -- missing end-of-block", w.mode = 30;
              break;
            }
            if (w.lenbits = 9, wt = { bits: w.lenbits }, bt = n(1, w.lens, 0, w.nlen, w.lencode, 0, w.work, wt), w.lenbits = wt.bits, bt) {
              f.msg = "invalid literal/lengths set", w.mode = 30;
              break;
            }
            if (w.distbits = 6, w.distcode = w.distdyn, wt = { bits: w.distbits }, bt = n(2, w.lens, w.nlen, w.ndist, w.distcode, 0, w.work, wt), w.distbits = wt.bits, bt) {
              f.msg = "invalid distances set", w.mode = 30;
              break;
            }
            if (w.mode = 20, E === 6) break t;
          case 20:
            w.mode = 21;
          case 21:
            if (U >= 6 && z >= 258) {
              f.next_out = R, f.avail_out = z, f.next_in = M, f.avail_in = U, w.hold = $, w.bits = H, c(f, ot), R = f.next_out, T = f.output, z = f.avail_out, M = f.next_in, I = f.input, U = f.avail_in, $ = w.hold, H = w.bits, w.mode === 12 && (w.back = -1);
              break;
            }
            for (w.back = 0; G = (F = w.lencode[$ & (1 << w.lenbits) - 1]) >>> 16 & 255, Z = 65535 & F, !((dt = F >>> 24) <= H); ) {
              if (U === 0) break t;
              U--, $ += I[M++] << H, H += 8;
            }
            if (G && (240 & G) == 0) {
              for (ut = dt, pt = G, st = Z; G = (F = w.lencode[st + (($ & (1 << ut + pt) - 1) >> ut)]) >>> 16 & 255, Z = 65535 & F, !(ut + (dt = F >>> 24) <= H); ) {
                if (U === 0) break t;
                U--, $ += I[M++] << H, H += 8;
              }
              $ >>>= ut, H -= ut, w.back += ut;
            }
            if ($ >>>= dt, H -= dt, w.back += dt, w.length = Z, G === 0) {
              w.mode = 26;
              break;
            }
            if (32 & G) {
              w.back = -1, w.mode = 12;
              break;
            }
            if (64 & G) {
              f.msg = "invalid literal/length code", w.mode = 30;
              break;
            }
            w.extra = 15 & G, w.mode = 22;
          case 22:
            if (w.extra) {
              for (C = w.extra; H < C; ) {
                if (U === 0) break t;
                U--, $ += I[M++] << H, H += 8;
              }
              w.length += $ & (1 << w.extra) - 1, $ >>>= w.extra, H -= w.extra, w.back += w.extra;
            }
            w.was = w.length, w.mode = 23;
          case 23:
            for (; G = (F = w.distcode[$ & (1 << w.distbits) - 1]) >>> 16 & 255, Z = 65535 & F, !((dt = F >>> 24) <= H); ) {
              if (U === 0) break t;
              U--, $ += I[M++] << H, H += 8;
            }
            if ((240 & G) == 0) {
              for (ut = dt, pt = G, st = Z; G = (F = w.distcode[st + (($ & (1 << ut + pt) - 1) >> ut)]) >>> 16 & 255, Z = 65535 & F, !(ut + (dt = F >>> 24) <= H); ) {
                if (U === 0) break t;
                U--, $ += I[M++] << H, H += 8;
              }
              $ >>>= ut, H -= ut, w.back += ut;
            }
            if ($ >>>= dt, H -= dt, w.back += dt, 64 & G) {
              f.msg = "invalid distance code", w.mode = 30;
              break;
            }
            w.offset = Z, w.extra = 15 & G, w.mode = 24;
          case 24:
            if (w.extra) {
              for (C = w.extra; H < C; ) {
                if (U === 0) break t;
                U--, $ += I[M++] << H, H += 8;
              }
              w.offset += $ & (1 << w.extra) - 1, $ >>>= w.extra, H -= w.extra, w.back += w.extra;
            }
            if (w.offset > w.dmax) {
              f.msg = "invalid distance too far back", w.mode = 30;
              break;
            }
            w.mode = 25;
          case 25:
            if (z === 0) break t;
            if (V = ot - z, w.offset > V) {
              if ((V = w.offset - V) > w.whave && w.sane) {
                f.msg = "invalid distance too far back", w.mode = 30;
                break;
              }
              V > w.wnext ? (V -= w.wnext, it = w.wsize - V) : it = w.wnext - V, V > w.length && (V = w.length), lt = w.window;
            } else lt = T, it = R - w.offset, V = w.length;
            V > z && (V = z), z -= V, w.length -= V;
            do
              T[R++] = lt[it++];
            while (--V);
            w.length === 0 && (w.mode = 21);
            break;
          case 26:
            if (z === 0) break t;
            T[R++] = w.length, z--, w.mode = 21;
            break;
          case 27:
            if (w.wrap) {
              for (; H < 32; ) {
                if (U === 0) break t;
                U--, $ |= I[M++] << H, H += 8;
              }
              if (ot -= z, f.total_out += ot, w.total += ot, ot && (f.adler = w.check = w.flags ? P(w.check, T, ot, R - ot) : u(w.check, T, ot, R - ot)), ot = z, (w.flags ? $ : a($)) !== w.check) {
                f.msg = "incorrect data check", w.mode = 30;
                break;
              }
              $ = 0, H = 0;
            }
            w.mode = 28;
          case 28:
            if (w.wrap && w.flags) {
              for (; H < 32; ) {
                if (U === 0) break t;
                U--, $ += I[M++] << H, H += 8;
              }
              if ($ !== (4294967295 & w.total)) {
                f.msg = "incorrect length check", w.mode = 30;
                break;
              }
              $ = 0, H = 0;
            }
            w.mode = 29;
          case 29:
            bt = 1;
            break t;
          case 30:
            bt = -3;
            break t;
          case 31:
            return -4;
          case 32:
          default:
            return -2;
        }
        return f.next_out = R, f.avail_out = z, f.next_in = M, f.avail_in = U, w.hold = $, w.bits = H, (w.wsize || ot !== f.avail_out && w.mode < 30 && (w.mode < 27 || E !== 4)) && A(f, f.output, f.next_out, ot - f.avail_out) ? (w.mode = 31, -4) : (nt -= f.avail_in, ot -= f.avail_out, f.total_in += nt, f.total_out += ot, w.total += ot, w.wrap && ot && (f.adler = w.check = w.flags ? P(w.check, T, ot, f.next_out - ot) : u(w.check, T, ot, f.next_out - ot)), f.data_type = w.bits + (w.last ? 64 : 0) + (w.mode === 12 ? 128 : 0) + (w.mode === 20 || w.mode === 15 ? 256 : 0), (nt === 0 && ot === 0 || E === 4) && bt === 0 && (bt = -5), bt);
      }, h.inflateEnd = function(f) {
        if (!f || !f.state) return -2;
        var E = f.state;
        return E.window && (E.window = null), f.state = null, 0;
      }, h.inflateGetHeader = function(f, E) {
        var w;
        return f && f.state ? (2 & (w = f.state).wrap) == 0 ? -2 : (w.head = E, E.done = !1, 0) : -2;
      }, h.inflateSetDictionary = function(f, E) {
        var w, I = E.length;
        return f && f.state ? (w = f.state).wrap !== 0 && w.mode !== 11 ? -2 : w.mode === 11 && u(1, E, I, 0) !== w.check ? -3 : A(f, E, I, I) ? (w.mode = 31, -4) : (w.havedict = 1, 0) : -2;
      }, h.inflateInfo = "pako inflate (from Nodeca project)";
    }, function(N, h, t) {
      N.exports = function(s, u) {
        var P, c, n, a, i, e, k, O, m, _, d, S, x, A, f, E, w, I, T, M, R, U, z, $, H;
        P = s.state, c = s.next_in, $ = s.input, n = c + (s.avail_in - 5), a = s.next_out, H = s.output, i = a - (u - s.avail_out), e = a + (s.avail_out - 257), k = P.dmax, O = P.wsize, m = P.whave, _ = P.wnext, d = P.window, S = P.hold, x = P.bits, A = P.lencode, f = P.distcode, E = (1 << P.lenbits) - 1, w = (1 << P.distbits) - 1;
        t: do {
          x < 15 && (S += $[c++] << x, x += 8, S += $[c++] << x, x += 8), I = A[S & E];
          e: for (; ; ) {
            if (S >>>= T = I >>> 24, x -= T, (T = I >>> 16 & 255) === 0) H[a++] = 65535 & I;
            else {
              if (!(16 & T)) {
                if ((64 & T) == 0) {
                  I = A[(65535 & I) + (S & (1 << T) - 1)];
                  continue e;
                }
                if (32 & T) {
                  P.mode = 12;
                  break t;
                }
                s.msg = "invalid literal/length code", P.mode = 30;
                break t;
              }
              M = 65535 & I, (T &= 15) && (x < T && (S += $[c++] << x, x += 8), M += S & (1 << T) - 1, S >>>= T, x -= T), x < 15 && (S += $[c++] << x, x += 8, S += $[c++] << x, x += 8), I = f[S & w];
              r: for (; ; ) {
                if (S >>>= T = I >>> 24, x -= T, !(16 & (T = I >>> 16 & 255))) {
                  if ((64 & T) == 0) {
                    I = f[(65535 & I) + (S & (1 << T) - 1)];
                    continue r;
                  }
                  s.msg = "invalid distance code", P.mode = 30;
                  break t;
                }
                if (R = 65535 & I, x < (T &= 15) && (S += $[c++] << x, (x += 8) < T && (S += $[c++] << x, x += 8)), (R += S & (1 << T) - 1) > k) {
                  s.msg = "invalid distance too far back", P.mode = 30;
                  break t;
                }
                if (S >>>= T, x -= T, R > (T = a - i)) {
                  if ((T = R - T) > m && P.sane) {
                    s.msg = "invalid distance too far back", P.mode = 30;
                    break t;
                  }
                  if (U = 0, z = d, _ === 0) {
                    if (U += O - T, T < M) {
                      M -= T;
                      do
                        H[a++] = d[U++];
                      while (--T);
                      U = a - R, z = H;
                    }
                  } else if (_ < T) {
                    if (U += O + _ - T, (T -= _) < M) {
                      M -= T;
                      do
                        H[a++] = d[U++];
                      while (--T);
                      if (U = 0, _ < M) {
                        M -= T = _;
                        do
                          H[a++] = d[U++];
                        while (--T);
                        U = a - R, z = H;
                      }
                    }
                  } else if (U += _ - T, T < M) {
                    M -= T;
                    do
                      H[a++] = d[U++];
                    while (--T);
                    U = a - R, z = H;
                  }
                  for (; M > 2; ) H[a++] = z[U++], H[a++] = z[U++], H[a++] = z[U++], M -= 3;
                  M && (H[a++] = z[U++], M > 1 && (H[a++] = z[U++]));
                } else {
                  U = a - R;
                  do
                    H[a++] = H[U++], H[a++] = H[U++], H[a++] = H[U++], M -= 3;
                  while (M > 2);
                  M && (H[a++] = H[U++], M > 1 && (H[a++] = H[U++]));
                }
                break;
              }
            }
            break;
          }
        } while (c < n && a < e);
        c -= M = x >> 3, S &= (1 << (x -= M << 3)) - 1, s.next_in = c, s.next_out = a, s.avail_in = c < n ? n - c + 5 : 5 - (c - n), s.avail_out = a < e ? e - a + 257 : 257 - (a - e), P.hold = S, P.bits = x;
      };
    }, function(N, h, t) {
      var s = t(31), u = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], P = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], c = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], n = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
      N.exports = function(a, i, e, k, O, m, _, d) {
        var S, x, A, f, E, w, I, T, M, R = d.bits, U = 0, z = 0, $ = 0, H = 0, nt = 0, ot = 0, V = 0, it = 0, lt = 0, dt = 0, G = null, Z = 0, ut = new s.Buf16(16), pt = new s.Buf16(16), st = null, mt = 0;
        for (U = 0; U <= 15; U++) ut[U] = 0;
        for (z = 0; z < k; z++) ut[i[e + z]]++;
        for (nt = R, H = 15; H >= 1 && ut[H] === 0; H--) ;
        if (nt > H && (nt = H), H === 0) return O[m++] = 20971520, O[m++] = 20971520, d.bits = 1, 0;
        for ($ = 1; $ < H && ut[$] === 0; $++) ;
        for (nt < $ && (nt = $), it = 1, U = 1; U <= 15; U++) if (it <<= 1, (it -= ut[U]) < 0) return -1;
        if (it > 0 && (a === 0 || H !== 1)) return -1;
        for (pt[1] = 0, U = 1; U < 15; U++) pt[U + 1] = pt[U] + ut[U];
        for (z = 0; z < k; z++) i[e + z] !== 0 && (_[pt[i[e + z]]++] = z);
        if (a === 0 ? (G = st = _, w = 19) : a === 1 ? (G = u, Z -= 257, st = P, mt -= 257, w = 256) : (G = c, st = n, w = -1), dt = 0, z = 0, U = $, E = m, ot = nt, V = 0, A = -1, f = (lt = 1 << nt) - 1, a === 1 && lt > 852 || a === 2 && lt > 592) return 1;
        for (; ; ) {
          I = U - V, _[z] < w ? (T = 0, M = _[z]) : _[z] > w ? (T = st[mt + _[z]], M = G[Z + _[z]]) : (T = 96, M = 0), S = 1 << U - V, $ = x = 1 << ot;
          do
            O[E + (dt >> V) + (x -= S)] = I << 24 | T << 16 | M | 0;
          while (x !== 0);
          for (S = 1 << U - 1; dt & S; ) S >>= 1;
          if (S !== 0 ? (dt &= S - 1, dt += S) : dt = 0, z++, --ut[U] == 0) {
            if (U === H) break;
            U = i[e + _[z]];
          }
          if (U > nt && (dt & f) !== A) {
            for (V === 0 && (V = nt), E += $, it = 1 << (ot = U - V); ot + V < H && !((it -= ut[ot + V]) <= 0); ) ot++, it <<= 1;
            if (lt += 1 << ot, a === 1 && lt > 852 || a === 2 && lt > 592) return 1;
            O[A = dt & f] = nt << 24 | ot << 16 | E - m | 0;
          }
        }
        return dt !== 0 && (O[E + dt] = U - V << 24 | 64 << 16 | 0), d.bits = nt, 0;
      };
    }, function(N, h, t) {
      N.exports = function() {
        this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
      };
    }, function(N, h) {
      N.exports = function(t, s) {
        var u, P, c = t, n = s, a = c.length, i = n.length, e = !1, k = null, O = a + 1, m = [], _ = [], d = [], S = "", x = function(E, w, I) {
          return { x: E, y: w, k: I };
        }, A = function(E, w) {
          return { elem: E, t: w };
        }, f = function(E, w, I) {
          var T, M, R;
          for (T = w > I ? m[E - 1 + O] : m[E + 1 + O], M = (R = Math.max(w, I)) - E; M < a && R < i && c[M] === n[R]; ) ++M, ++R;
          return m[E + O] = _.length, _[_.length] = new x(M, R, T), R;
        };
        return a >= i && (u = c, P = a, c = n, n = u, a = i, i = P, e = !0, O = a + 1), { SES_DELETE: -1, SES_COMMON: 0, SES_ADD: 1, editdistance: function() {
          return k;
        }, getlcs: function() {
          return S;
        }, getses: function() {
          return d;
        }, compose: function() {
          var E, w, I, T, M, R, U, z;
          for (E = i - a, w = a + i + 3, I = {}, U = 0; U < w; ++U) I[U] = -1, m[U] = -1;
          T = -1;
          do {
            for (z = -++T; z <= E - 1; ++z) I[z + O] = f(z, I[z - 1 + O] + 1, I[z + 1 + O]);
            for (z = E + T; z >= E + 1; --z) I[z + O] = f(z, I[z - 1 + O] + 1, I[z + 1 + O]);
            I[E + O] = f(E, I[E - 1 + O] + 1, I[E + 1 + O]);
          } while (I[E + O] !== i);
          for (k = E + 2 * T, M = m[E + O], R = []; M !== -1; ) R[R.length] = new x(_[M].x, _[M].y, null), M = _[M].k;
          (function($) {
            var H, nt, ot;
            for (H = nt = 0, ot = $.length - 1; ot >= 0; --ot) for (; H < $[ot].x || nt < $[ot].y; ) $[ot].y - $[ot].x > nt - H ? (d[d.length] = new A(n[nt], e ? -1 : 1), ++nt) : $[ot].y - $[ot].x < nt - H ? (d[d.length] = new A(c[H], e ? 1 : -1), ++H) : (d[d.length] = new A(c[H], 0), S += c[H], ++H, ++nt);
          })(R);
        } };
      };
    }, function(N, h, t) {
      (function(s) {
        t.d(h, "a", function() {
          return a;
        });
        var u = t(165), P = t(0);
        function c(e, k, O, m, _, d, S) {
          try {
            var x = e[d](S), A = x.value;
          } catch (f) {
            return void O(f);
          }
          x.done ? k(A) : Promise.resolve(A).then(m, _);
        }
        function n(e) {
          return function() {
            var k = this, O = arguments;
            return new Promise(function(m, _) {
              var d = e.apply(k, O);
              function S(A) {
                c(d, m, _, S, x, "next", A);
              }
              function x(A) {
                c(d, m, _, S, x, "throw", A);
              }
              S(void 0);
            });
          };
        }
        function a(e) {
          return i.apply(this, arguments);
        }
        function i() {
          return (i = n(function* ({ object: e }) {
            try {
              Object(P.a)("object", e), e = typeof e == "string" ? s.from(e, "utf8") : s.from(e);
              const k = "blob", { oid: O, object: m } = yield Object(u.a)({ type: "blob", format: "content", object: e });
              return { oid: O, type: k, object: new Uint8Array(m), format: "wrapped" };
            } catch (k) {
              throw k.caller = "git.hashBlob", k;
            }
          })).apply(this, arguments);
        }
      }).call(this, t(10).Buffer);
    }, function(N, h, t) {
      (function(s) {
        t.d(h, "a", function() {
          return m;
        });
        var u = t(17), P = t(2), c = t(18), n = t(14), a = t(12), i = t(15), e = t(16);
        function k(d, S, x, A, f, E, w) {
          try {
            var I = d[E](w), T = I.value;
          } catch (M) {
            return void x(M);
          }
          I.done ? S(T) : Promise.resolve(T).then(A, f);
        }
        function O(d) {
          return function() {
            var S = this, x = arguments;
            return new Promise(function(A, f) {
              var E = d.apply(S, x);
              function w(T) {
                k(E, A, f, w, I, "next", T);
              }
              function I(T) {
                k(E, A, f, w, I, "throw", T);
              }
              w(void 0);
            });
          };
        }
        function m(d) {
          return _.apply(this, arguments);
        }
        function _() {
          return (_ = O(function* ({ fs: d, dir: S, gitdir: x = Object(e.join)(S, ".git"), type: A, object: f, format: E = "parsed", oid: w, encoding: I }) {
            try {
              const T = new P.a(d);
              if (E === "parsed") {
                switch (A) {
                  case "commit":
                    f = n.a.from(f).toObject();
                    break;
                  case "tree":
                    f = a.a.from(f).toObject();
                    break;
                  case "blob":
                    f = s.from(f, I);
                    break;
                  case "tag":
                    f = c.a.from(f).toObject();
                    break;
                  default:
                    throw new u.a(w || "", A, "blob|commit|tag|tree");
                }
                E = "content";
              }
              return w = yield Object(i.a)({ fs: T, gitdir: x, type: A, object: f, oid: w, format: E });
            } catch (T) {
              throw T.caller = "git.writeObject", T;
            }
          })).apply(this, arguments);
        }
      }).call(this, t(10).Buffer);
    }, function(N, h, t) {
      function s(f, E, w, I, T, M, R) {
        try {
          var U = f[M](R), z = U.value;
        } catch ($) {
          return void w($);
        }
        U.done ? E(z) : Promise.resolve(z).then(I, T);
      }
      function u(f) {
        return function() {
          var E = this, w = arguments;
          return new Promise(function(I, T) {
            var M = f.apply(E, w);
            function R(z) {
              s(M, I, T, R, U, "next", z);
            }
            function U(z) {
              s(M, I, T, R, U, "throw", z);
            }
            R(void 0);
          });
        };
      }
      function P(f) {
        return c.apply(this, arguments);
      }
      function c() {
        return (c = u(function* ({ fs: f, gitdir: E, oid: w }) {
          const I = `objects/${w.slice(0, 2)}/${w.slice(2)}`;
          return f.exists(`${E}/${I}`);
        })).apply(this, arguments);
      }
      var n = t(4), a = t(81), i = t(16);
      function e(f, E, w, I, T, M, R) {
        try {
          var U = f[M](R), z = U.value;
        } catch ($) {
          return void w($);
        }
        U.done ? E(z) : Promise.resolve(z).then(I, T);
      }
      function k(f) {
        return function() {
          var E = this, w = arguments;
          return new Promise(function(I, T) {
            var M = f.apply(E, w);
            function R(z) {
              e(M, I, T, R, U, "next", z);
            }
            function U(z) {
              e(M, I, T, R, U, "throw", z);
            }
            R(void 0);
          });
        };
      }
      function O(f) {
        return m.apply(this, arguments);
      }
      function m() {
        return (m = k(function* ({ fs: f, cache: E, gitdir: w, oid: I, getExternalRefDelta: T }) {
          let M = yield f.readdir(Object(i.join)(w, "objects/pack"));
          M = M.filter((R) => R.endsWith(".idx"));
          for (const R of M) {
            const U = `${w}/objects/pack/${R}`, z = yield Object(a.a)({ fs: f, cache: E, filename: U, getExternalRefDelta: T });
            if (z.error) throw new n.a(z.error);
            if (z.offsets.has(I)) return !0;
          }
          return !1;
        })).apply(this, arguments);
      }
      var _ = t(7);
      function d(f, E, w, I, T, M, R) {
        try {
          var U = f[M](R), z = U.value;
        } catch ($) {
          return void w($);
        }
        U.done ? E(z) : Promise.resolve(z).then(I, T);
      }
      function S(f) {
        return function() {
          var E = this, w = arguments;
          return new Promise(function(I, T) {
            var M = f.apply(E, w);
            function R(z) {
              d(M, I, T, R, U, "next", z);
            }
            function U(z) {
              d(M, I, T, R, U, "throw", z);
            }
            R(void 0);
          });
        };
      }
      function x(f) {
        return A.apply(this, arguments);
      }
      function A() {
        return (A = S(function* ({ fs: f, cache: E, gitdir: w, oid: I, format: T = "content" }) {
          const M = (U) => Object(_.a)({ fs: f, cache: E, gitdir: w, oid: U });
          let R = yield P({ fs: f, gitdir: w, oid: I });
          return R || (R = yield O({ fs: f, cache: E, gitdir: w, oid: I, getExternalRefDelta: M })), R;
        })).apply(this, arguments);
      }
      t.d(h, "a", function() {
        return x;
      });
    }, function(N, h, t) {
      (function(s) {
        t.d(h, "a", function() {
          return m;
        });
        var u = t(11), P = t(13), c = t(69), n = t(16), a = t(34), i = t(19), e = t(25);
        function k(_, d, S, x, A, f, E) {
          try {
            var w = _[f](E), I = w.value;
          } catch (T) {
            return void S(T);
          }
          w.done ? d(I) : Promise.resolve(I).then(x, A);
        }
        function O(_) {
          return function() {
            var d = this, S = arguments;
            return new Promise(function(x, A) {
              var f = _.apply(d, S);
              function E(I) {
                k(f, x, A, E, w, "next", I);
              }
              function w(I) {
                k(f, x, A, E, w, "throw", I);
              }
              E(void 0);
            });
          };
        }
        class m {
          constructor({ fs: d, dir: S, gitdir: x, cache: A }) {
            this.fs = d, this.cache = A, this.dir = S, this.gitdir = x;
            const f = this;
            this.ConstructEntry = class {
              constructor(E) {
                this._fullpath = E, this._type = !1, this._mode = !1, this._stat = !1, this._content = !1, this._oid = !1;
              }
              type() {
                var E = this;
                return O(function* () {
                  return f.type(E);
                })();
              }
              mode() {
                var E = this;
                return O(function* () {
                  return f.mode(E);
                })();
              }
              stat() {
                var E = this;
                return O(function* () {
                  return f.stat(E);
                })();
              }
              content() {
                var E = this;
                return O(function* () {
                  return f.content(E);
                })();
              }
              oid() {
                var E = this;
                return O(function* () {
                  return f.oid(E);
                })();
              }
            };
          }
          readdir(d) {
            var S = this;
            return O(function* () {
              const x = d._fullpath, { fs: A, dir: f } = S, E = yield A.readdir(Object(n.join)(f, x));
              return E === null ? null : E.map((w) => Object(n.join)(x, w));
            })();
          }
          type(d) {
            return O(function* () {
              return d._type === !1 && (yield d.stat()), d._type;
            })();
          }
          mode(d) {
            return O(function* () {
              return d._mode === !1 && (yield d.stat()), d._mode;
            })();
          }
          stat(d) {
            var S = this;
            return O(function* () {
              if (d._stat === !1) {
                const { fs: x, dir: A } = S;
                let f = yield x.lstat(`${A}/${d._fullpath}`);
                if (!f) throw new Error(`ENOENT: no such file or directory, lstat '${d._fullpath}'`);
                let E = f.isDirectory() ? "tree" : "blob";
                E !== "blob" || f.isFile() || f.isSymbolicLink() || (E = "special"), d._type = E, f = Object(a.a)(f), d._mode = f.mode, f.size === -1 && d._actualSize && (f.size = d._actualSize), d._stat = f;
              }
              return d._stat;
            })();
          }
          content(d) {
            var S = this;
            return O(function* () {
              if (d._content === !1) {
                const { fs: x, dir: A, gitdir: f } = S;
                if ((yield d.type()) === "tree") d._content = void 0;
                else {
                  const E = yield u.a.get({ fs: x, gitdir: f }), w = yield E.get("core.autocrlf"), I = yield x.read(`${A}/${d._fullpath}`, { autocrlf: w });
                  d._actualSize = I.length, d._stat && d._stat.size === -1 && (d._stat.size = d._actualSize), d._content = new Uint8Array(I);
                }
              }
              return d._content;
            })();
          }
          oid(d) {
            var S = this;
            return O(function* () {
              if (d._oid === !1) {
                const { fs: x, gitdir: A, cache: f } = S;
                let E;
                yield P.a.acquire({ fs: x, gitdir: A, cache: f }, function() {
                  var w = O(function* (I) {
                    const T = I.entriesMap.get(d._fullpath), M = yield d.stat(), R = yield u.a.get({ fs: x, gitdir: A }), U = yield R.get("core.filemode"), z = s === void 0 || s.platform !== "win32";
                    !T || Object(c.a)(M, T, U, z) ? (yield d.content()) === void 0 ? E = void 0 : (E = yield Object(i.a)(e.a.wrap({ type: "blob", object: yield d.content() })), !T || E !== T.oid || U && M.mode !== T.mode || !Object(c.a)(M, T, U, z) || I.insert({ filepath: d._fullpath, stats: M, oid: E })) : E = T.oid;
                  });
                  return function(I) {
                    return w.apply(this, arguments);
                  };
                }()), d._oid = E;
              }
              return d._oid;
            })();
          }
        }
      }).call(this, t(92));
    }, function(N, h, t) {
      (function(s) {
        t.d(h, "a", function() {
          return m;
        });
        var u = t(95), P = t(54), c = t(89), n = t(26), a = t(8), i = t(3), e = t(15);
        function k(d, S, x, A, f, E, w) {
          try {
            var I = d[E](w), T = I.value;
          } catch (M) {
            return void x(M);
          }
          I.done ? S(T) : Promise.resolve(T).then(A, f);
        }
        function O(d) {
          return function() {
            var S = this, x = arguments;
            return new Promise(function(A, f) {
              var E = d.apply(S, x);
              function w(T) {
                k(E, A, f, w, I, "next", T);
              }
              function I(T) {
                k(E, A, f, w, I, "throw", T);
              }
              w(void 0);
            });
          };
        }
        function m(d) {
          return _.apply(this, arguments);
        }
        function _() {
          return (_ = O(function* ({ fs: d, cache: S, onSign: x, gitdir: A, ref: f, oid: E, note: w, force: I, author: T, committer: M, signingKey: R }) {
            let U;
            try {
              U = yield i.a.resolve({ gitdir: A, fs: d, ref: f });
            } catch (nt) {
              if (!(nt instanceof a.a)) throw nt;
            }
            let z = (yield Object(P.a)({ fs: d, cache: S, gitdir: A, oid: U || "4b825dc642cb6eb9a060e54bf8d69288fbee4904" })).tree;
            if (I) z = z.filter((nt) => nt.path !== E);
            else for (const nt of z) if (nt.path === E) throw new n.a("note", E);
            typeof w == "string" && (w = s.from(w, "utf8"));
            const $ = yield Object(e.a)({ fs: d, gitdir: A, type: "blob", object: w, format: "content" });
            z.push({ mode: "100644", path: E, oid: $, type: "blob" });
            const H = yield Object(c.a)({ fs: d, gitdir: A, tree: z });
            return yield Object(u.a)({ fs: d, cache: S, onSign: x, gitdir: A, ref: f, tree: H, parent: U && [U], message: `Note added by 'isomorphic-git addNote'
`, author: T, committer: M, signingKey: R });
          })).apply(this, arguments);
        }
      }).call(this, t(10).Buffer);
    }, function(N, h, t) {
      function s(u) {
        return u.slice(0, 12).toString("hex") === "5041434b0000000200000000";
      }
      t.d(h, "a", function() {
        return s;
      });
    }, function(N, h, t) {
      t.d(h, "a", function() {
        return n;
      });
      var s = t(25), u = t(19);
      function P(i, e, k, O, m, _, d) {
        try {
          var S = i[_](d), x = S.value;
        } catch (A) {
          return void k(A);
        }
        S.done ? e(x) : Promise.resolve(x).then(O, m);
      }
      function c(i) {
        return function() {
          var e = this, k = arguments;
          return new Promise(function(O, m) {
            var _ = i.apply(e, k);
            function d(x) {
              P(_, O, m, d, S, "next", x);
            }
            function S(x) {
              P(_, O, m, d, S, "throw", x);
            }
            d(void 0);
          });
        };
      }
      function n(i) {
        return a.apply(this, arguments);
      }
      function a() {
        return (a = c(function* ({ type: i, object: e, format: k = "content", oid: O }) {
          return k !== "deflated" && (k !== "wrapped" && (e = s.a.wrap({ type: i, object: e })), O = yield Object(u.a)(e)), { oid: O, object: e };
        })).apply(this, arguments);
      }
    }, function(N, h, t) {
      (function(s) {
        t.d(h, "a", function() {
          return i;
        });
        var u = t(52), P = t(16), c = t(112);
        function n(k, O, m, _, d, S, x) {
          try {
            var A = k[S](x), f = A.value;
          } catch (E) {
            return void m(E);
          }
          A.done ? O(f) : Promise.resolve(f).then(_, d);
        }
        function a(k) {
          return function() {
            var O = this, m = arguments;
            return new Promise(function(_, d) {
              var S = k.apply(O, m);
              function x(f) {
                n(S, _, d, x, A, "next", f);
              }
              function A(f) {
                n(S, _, d, x, A, "throw", f);
              }
              x(void 0);
            });
          };
        }
        function i(k) {
          return e.apply(this, arguments);
        }
        function e() {
          return (e = a(function* ({ fs: k, cache: O, gitdir: m, oids: _, write: d }) {
            const S = yield Object(c.a)({ fs: k, cache: O, gitdir: m, oids: _ }), x = s.from(yield Object(u.a)(S)), A = `pack-${x.slice(-20).toString("hex")}.pack`;
            return d ? (yield k.write(Object(P.join)(m, `objects/pack/${A}`), x), { filename: A }) : { filename: A, packfile: new Uint8Array(x) };
          })).apply(this, arguments);
        }
      }).call(this, t(10).Buffer);
    }, function(N, h, t) {
      t.r(h);
      var s = t(13), u = t(38), P = t(107), c = t(4), n = t(34);
      function a(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function i(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              a(b, o, g, l, j, "next", p);
            }
            function j(p) {
              a(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      class e {
        constructor({ fs: v, gitdir: y, cache: o }) {
          this.treePromise = s.a.acquire({ fs: v, gitdir: y, cache: o }, function() {
            var b = i(function* (l) {
              return Object(P.a)(l.entries);
            });
            return function(l) {
              return b.apply(this, arguments);
            };
          }());
          const g = this;
          this.ConstructEntry = class {
            constructor(b) {
              this._fullpath = b, this._type = !1, this._mode = !1, this._stat = !1, this._oid = !1;
            }
            type() {
              var b = this;
              return i(function* () {
                return g.type(b);
              })();
            }
            mode() {
              var b = this;
              return i(function* () {
                return g.mode(b);
              })();
            }
            stat() {
              var b = this;
              return i(function* () {
                return g.stat(b);
              })();
            }
            content() {
              var b = this;
              return i(function* () {
                return g.content(b);
              })();
            }
            oid() {
              var b = this;
              return i(function* () {
                return g.oid(b);
              })();
            }
          };
        }
        readdir(v) {
          var y = this;
          return i(function* () {
            const o = v._fullpath, g = (yield y.treePromise).get(o);
            if (!g || g.type === "blob") return null;
            if (g.type !== "tree") throw new Error(`ENOTDIR: not a directory, scandir '${o}'`);
            const b = g.children.map((l) => l.fullpath);
            return b.sort(u.a), b;
          })();
        }
        type(v) {
          return i(function* () {
            return v._type === !1 && (yield v.stat()), v._type;
          })();
        }
        mode(v) {
          return i(function* () {
            return v._mode === !1 && (yield v.stat()), v._mode;
          })();
        }
        stat(v) {
          var y = this;
          return i(function* () {
            if (v._stat === !1) {
              const o = (yield y.treePromise).get(v._fullpath);
              if (!o) throw new Error(`ENOENT: no such file or directory, lstat '${v._fullpath}'`);
              const g = o.type === "tree" ? {} : Object(n.a)(o.metadata);
              v._type = o.type === "tree" ? "tree" : function(b) {
                switch (b) {
                  case 16384:
                    return "tree";
                  case 33188:
                  case 33261:
                  case 40960:
                    return "blob";
                  case 57344:
                    return "commit";
                }
                throw new c.a(`Unexpected GitTree entry mode: ${b.toString(8)}`);
              }(g.mode), v._mode = g.mode, o.type === "tree" ? v._stat = void 0 : v._stat = g;
            }
            return v._stat;
          })();
        }
        content(v) {
          return i(function* () {
          })();
        }
        oid(v) {
          var y = this;
          return i(function* () {
            if (v._oid === !1) {
              const o = (yield y.treePromise).get(v._fullpath);
              v._oid = o.metadata.oid;
            }
            return v._oid;
          })();
        }
      }
      var k = t(37);
      function O() {
        const r = /* @__PURE__ */ Object.create(null);
        return Object.defineProperty(r, k.a, { value: function({ fs: v, gitdir: y, cache: o }) {
          return new e({ fs: v, gitdir: y, cache: o });
        } }), Object.freeze(r), r;
      }
      var m = t(22), _ = t(162);
      function d() {
        const r = /* @__PURE__ */ Object.create(null);
        return Object.defineProperty(r, k.a, { value: function({ fs: v, dir: y, gitdir: o, cache: g }) {
          return new _.a({ fs: v, dir: y, gitdir: o, cache: g });
        } }), Object.freeze(r), r;
      }
      var S = t(30), x = t(104), A = t(2), f = t(0), E = t(16), w = t(53);
      function I(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function T(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              I(b, o, g, l, j, "next", p);
            }
            function j(p) {
              I(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function M(r) {
        return R.apply(this, arguments);
      }
      function R() {
        return (R = T(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), commit: o = "HEAD", cache: g = {} }) {
          try {
            Object(f.a)("fs", r), Object(f.a)("dir", v), Object(f.a)("gitdir", y);
            const l = new A.a(r), j = [Object(m.a)({ ref: o }), d(), O()];
            let p = [];
            yield s.a.acquire({ fs: l, gitdir: y, cache: g }, function() {
              var J = T(function* (et) {
                p = et.unmergedPaths;
              });
              return function(et) {
                return J.apply(this, arguments);
              };
            }());
            const q = yield Object(S.a)({ fs: l, cache: g, dir: v, gitdir: y, trees: j, map: (b = T(function* (J, [et, Q, ht]) {
              const ft = !(yield Object(w.a)(Q, ht)), gt = p.includes(J), _t = !(yield Object(w.a)(ht, et));
              if (ft || gt) return et ? { path: J, mode: yield et.mode(), oid: yield et.oid(), type: yield et.type(), content: yield et.content() } : void 0;
              if (_t) return !1;
              throw new x.a(J);
            }), function(J, et) {
              return b.apply(this, arguments);
            }) });
            yield s.a.acquire({ fs: l, gitdir: y, cache: g }, function() {
              var J = T(function* (et) {
                for (const Q of q) if (Q !== !1) if (Q) {
                  if (Q.type === "blob") {
                    const ht = new TextDecoder().decode(Q.content);
                    yield l.write(`${v}/${Q.path}`, ht, { mode: Q.mode }), et.insert({ filepath: Q.path, oid: Q.oid, stage: 0 });
                  }
                } else yield l.rmdir(`${v}/${Q.path}`, { recursive: !0 }), et.delete({ filepath: Q.path });
              });
              return function(et) {
                return J.apply(this, arguments);
              };
            }());
          } catch (l) {
            throw l.caller = "git.abortMerge", l;
          }
          var b;
        })).apply(this, arguments);
      }
      var U = t(103), z = t(8), $ = t(11), H = t(42), nt = t(15);
      function ot(r) {
        let v;
        for (; ~(v = r.indexOf(92)); ) r[v] = 47;
        return r;
      }
      function V(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function it(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              V(b, o, g, l, j, "next", p);
            }
            function j(p) {
              V(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function lt(r) {
        return dt.apply(this, arguments);
      }
      function dt() {
        return (dt = it(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), filepath: o, cache: g = {}, force: b = !1, parallel: l = !0 }) {
          try {
            Object(f.a)("fs", r), Object(f.a)("dir", v), Object(f.a)("gitdir", y), Object(f.a)("filepath", o);
            const j = new A.a(r);
            yield s.a.acquire({ fs: j, gitdir: y, cache: g }, function() {
              var p = it(function* (q) {
                return G({ dir: v, gitdir: y, fs: j, filepath: o, index: q, force: b, parallel: l });
              });
              return function(q) {
                return p.apply(this, arguments);
              };
            }());
          } catch (j) {
            throw j.caller = "git.add", j;
          }
        })).apply(this, arguments);
      }
      function G(r) {
        return Z.apply(this, arguments);
      }
      function Z() {
        return (Z = it(function* ({ dir: r, gitdir: v, fs: y, filepath: o, index: g, force: b, parallel: l }) {
          const j = (o = Array.isArray(o) ? o : [o]).map(function() {
            var J = it(function* (et) {
              if (!b && (yield H.a.isIgnored({ fs: y, dir: r, gitdir: v, filepath: et })))
                return;
              const Q = yield y.lstat(Object(E.join)(r, et));
              if (!Q) throw new z.a(et);
              if (Q.isDirectory()) {
                const ht = yield y.readdir(Object(E.join)(r, et));
                if (l) {
                  const ft = ht.map((gt) => G({ dir: r, gitdir: v, fs: y, filepath: [Object(E.join)(et, gt)], index: g, force: b, parallel: l }));
                  yield Promise.all(ft);
                } else for (const ft of ht) yield G({ dir: r, gitdir: v, fs: y, filepath: [Object(E.join)(et, ft)], index: g, force: b, parallel: l });
              } else {
                const ht = yield $.a.get({ fs: y, gitdir: v }), ft = yield ht.get("core.autocrlf"), gt = Q.isSymbolicLink() ? yield y.readlink(Object(E.join)(r, et)).then(ot) : yield y.read(Object(E.join)(r, et), { autocrlf: ft });
                if (gt === null) throw new z.a(et);
                const _t = yield Object(nt.a)({ fs: y, gitdir: v, type: "blob", object: gt });
                g.insert({ filepath: et, stats: Q, oid: _t });
              }
            });
            return function(et) {
              return J.apply(this, arguments);
            };
          }()), p = yield Promise.allSettled(j), q = p.filter((J) => J.status === "rejected").map((J) => J.reason);
          if (q.length > 1) throw new U.a(q);
          if (q.length === 1) throw q[0];
          return p.filter((J) => J.status === "fulfilled" && J.value).map((J) => J.value);
        })).apply(this, arguments);
      }
      var ut = t(163), pt = t(21), st = t(29), mt = t(43);
      function bt(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function wt(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              bt(b, o, g, l, j, "next", p);
            }
            function j(p) {
              bt(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function C(r) {
        return F.apply(this, arguments);
      }
      function F() {
        return (F = wt(function* ({ fs: r, onSign: v, dir: y, gitdir: o = Object(E.join)(y, ".git"), ref: g = "refs/notes/commits", oid: b, note: l, force: j, author: p, committer: q, signingKey: J, cache: et = {} }) {
          try {
            Object(f.a)("fs", r), Object(f.a)("gitdir", o), Object(f.a)("oid", b), Object(f.a)("note", l), J && Object(f.a)("onSign", v);
            const Q = new A.a(r), ht = yield Object(st.a)({ fs: Q, gitdir: o, author: p });
            if (!ht) throw new pt.a("author");
            const ft = yield Object(mt.a)({ fs: Q, gitdir: o, author: ht, committer: q });
            if (!ft) throw new pt.a("committer");
            return yield Object(ut.a)({ fs: new A.a(Q), cache: et, onSign: v, gitdir: o, ref: g, oid: b, note: l, force: j, author: ht, committer: ft, signingKey: J });
          } catch (Q) {
            throw Q.caller = "git.addNote", Q;
          }
        })).apply(this, arguments);
      }
      var L = t(45), K = t.n(L), X = t(26), rt = t(28);
      function yt(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function kt(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              yt(b, o, g, l, j, "next", p);
            }
            function j(p) {
              yt(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function At(r) {
        return Tt.apply(this, arguments);
      }
      function Tt() {
        return (Tt = kt(function* ({ fs: r, gitdir: v, remote: y, url: o, force: g }) {
          if (y !== K.a.clean(y)) throw new rt.a(y, K.a.clean(y));
          const b = yield $.a.get({ fs: r, gitdir: v });
          if (!g && (yield b.getSubsections("remote")).includes(y) && o !== (yield b.get(`remote.${y}.url`)))
            throw new X.a("remote", y);
          yield b.set(`remote.${y}.url`, o), yield b.set(`remote.${y}.fetch`, `+refs/heads/*:refs/remotes/${y}/*`), yield $.a.save({ fs: r, gitdir: v, config: b });
        })).apply(this, arguments);
      }
      function Et(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Wt(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Et(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Et(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Vt(r) {
        return re.apply(this, arguments);
      }
      function re() {
        return (re = Wt(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), remote: o, url: g, force: b = !1 }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("remote", o), Object(f.a)("url", g), yield At({ fs: new A.a(r), gitdir: y, remote: o, url: g, force: b });
          } catch (l) {
            throw l.caller = "git.addRemote", l;
          }
        })).apply(this, arguments);
      }
      var vt = t(3), Zt = t(18), Dt = t(7);
      function qt(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function pe(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              qt(b, o, g, l, j, "next", p);
            }
            function j(p) {
              qt(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function De(r) {
        return oe.apply(this, arguments);
      }
      function oe() {
        return (oe = pe(function* ({ fs: r, cache: v, onSign: y, gitdir: o, ref: g, tagger: b, message: l = g, gpgsig: j, object: p, signingKey: q, force: J = !1 }) {
          if (g = g.startsWith("refs/tags/") ? g : `refs/tags/${g}`, !J && (yield vt.a.exists({ fs: r, gitdir: o, ref: g }))) throw new X.a("tag", g);
          const et = yield vt.a.resolve({ fs: r, gitdir: o, ref: p || "HEAD" }), { type: Q } = yield Object(Dt.a)({ fs: r, cache: v, gitdir: o, oid: et });
          let ht = Zt.a.from({ object: et, type: Q, tag: g.replace("refs/tags/", ""), tagger: b, message: l, gpgsig: j });
          q && (ht = yield Zt.a.sign(ht, y, q));
          const ft = yield Object(nt.a)({ fs: r, gitdir: o, type: "tag", object: ht.toObject() });
          yield vt.a.writeRef({ fs: r, gitdir: o, ref: g, value: ft });
        })).apply(this, arguments);
      }
      function Me(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function W(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Me(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Me(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function B(r) {
        return D.apply(this, arguments);
      }
      function D() {
        return (D = W(function* ({ fs: r, onSign: v, dir: y, gitdir: o = Object(E.join)(y, ".git"), ref: g, tagger: b, message: l = g, gpgsig: j, object: p, signingKey: q, force: J = !1, cache: et = {} }) {
          try {
            Object(f.a)("fs", r), Object(f.a)("gitdir", o), Object(f.a)("ref", g), q && Object(f.a)("onSign", v);
            const Q = new A.a(r), ht = yield Object(st.a)({ fs: Q, gitdir: o, author: b });
            if (!ht) throw new pt.a("tagger");
            return yield De({ fs: Q, cache: et, onSign: v, gitdir: o, ref: g, tagger: ht, message: l, gpgsig: j, object: p, signingKey: q, force: J });
          } catch (Q) {
            throw Q.caller = "git.annotatedTag", Q;
          }
        })).apply(this, arguments);
      }
      function Y(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function tt(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Y(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Y(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function at(r) {
        return ct.apply(this, arguments);
      }
      function ct() {
        return (ct = tt(function* ({ fs: r, gitdir: v, ref: y, object: o, checkout: g = !1, force: b = !1 }) {
          if (y !== K.a.clean(y)) throw new rt.a(y, K.a.clean(y));
          const l = `refs/heads/${y}`;
          if (!b && (yield vt.a.exists({ fs: r, gitdir: v, ref: l })))
            throw new X.a("branch", y, !1);
          let j;
          try {
            j = yield vt.a.resolve({ fs: r, gitdir: v, ref: o || "HEAD" });
          } catch {
          }
          j && (yield vt.a.writeRef({ fs: r, gitdir: v, ref: l, value: j })), g && (yield vt.a.writeSymbolicRef({ fs: r, gitdir: v, ref: "HEAD", value: l }));
        })).apply(this, arguments);
      }
      function Bt(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function zt(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Bt(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Bt(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Ft(r) {
        return Ut.apply(this, arguments);
      }
      function Ut() {
        return (Ut = zt(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), ref: o, object: g, checkout: b = !1, force: l = !1 }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("ref", o), yield at({ fs: new A.a(r), gitdir: y, ref: o, object: g, checkout: b, force: l });
          } catch (j) {
            throw j.caller = "git.branch", j;
          }
        })).apply(this, arguments);
      }
      var xt = t(98), Kt = t(99), ae = t(114);
      const Jt = (r, v) => r === "." || v == null || v.length === 0 || v === "." || (v.length >= r.length ? v.startsWith(r) : r.startsWith(v));
      function _e(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function le(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              _e(b, o, g, l, j, "next", p);
            }
            function j(p) {
              _e(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Be(r) {
        return Vr.apply(this, arguments);
      }
      function Vr() {
        return (Vr = le(function* ({ fs: r, cache: v, onProgress: y, onPostCheckout: o, dir: g, gitdir: b, remote: l, ref: j, filepaths: p, noCheckout: q, noUpdateHead: J, dryRun: et, force: Q, track: ht = !0 }) {
          let ft, gt;
          if (o) try {
            ft = yield vt.a.resolve({ fs: r, gitdir: b, ref: "HEAD" });
          } catch {
            ft = "0000000000000000000000000000000000000000";
          }
          try {
            gt = yield vt.a.resolve({ fs: r, gitdir: b, ref: j });
          } catch (_t) {
            if (j === "HEAD") throw _t;
            const Pt = `${l}/${j}`;
            if (gt = yield vt.a.resolve({ fs: r, gitdir: b, ref: Pt }), ht) {
              const Ot = yield $.a.get({ fs: r, gitdir: b });
              yield Ot.set(`branch.${j}.remote`, l), yield Ot.set(`branch.${j}.merge`, `refs/heads/${j}`), yield $.a.save({ fs: r, gitdir: b, config: Ot });
            }
            yield vt.a.writeRef({ fs: r, gitdir: b, ref: `refs/heads/${j}`, value: gt });
          }
          if (!q) {
            let _t;
            try {
              _t = yield Gu({ fs: r, cache: v, onProgress: y, dir: g, gitdir: b, ref: j, force: Q, filepaths: p });
            } catch (jt) {
              throw jt instanceof z.a && jt.data.what === gt ? new Kt.a(j, gt) : jt;
            }
            const Pt = _t.filter(([jt]) => jt === "conflict").map(([jt, Ct]) => Ct);
            if (Pt.length > 0) throw new xt.a(Pt);
            const Ot = _t.filter(([jt]) => jt === "error").map(([jt, Ct]) => Ct);
            if (Ot.length > 0) throw new c.a(Ot.join(", "));
            if (et) return void (o && (yield o({ previousHead: ft, newHead: gt, type: p != null && p.length > 0 ? "file" : "branch" })));
            let It = 0;
            const $t = _t.length;
            yield s.a.acquire({ fs: r, gitdir: b, cache: v }, function() {
              var jt = le(function* (Ct) {
                yield Promise.all(_t.filter(([St]) => St === "delete" || St === "delete-index").map(function() {
                  var St = le(function* ([Mt, Lt]) {
                    const ee = `${g}/${Lt}`;
                    Mt === "delete" && (yield r.rm(ee)), Ct.delete({ filepath: Lt }), y && (yield y({ phase: "Updating workdir", loaded: ++It, total: $t }));
                  });
                  return function(Mt) {
                    return St.apply(this, arguments);
                  };
                }()));
              });
              return function(Ct) {
                return jt.apply(this, arguments);
              };
            }()), yield s.a.acquire({ fs: r, gitdir: b, cache: v }, function() {
              var jt = le(function* (Ct) {
                for (const [St, Mt] of _t) if (St === "rmdir" || St === "rmdir-index") {
                  const Lt = `${g}/${Mt}`;
                  try {
                    St === "rmdir-index" && Ct.delete({ filepath: Mt }), yield r.rmdir(Lt), y && (yield y({ phase: "Updating workdir", loaded: ++It, total: $t }));
                  } catch (ee) {
                    if (ee.code !== "ENOTEMPTY") throw ee;
                    console.log(`Did not delete ${Mt} because directory is not empty`);
                  }
                }
              });
              return function(Ct) {
                return jt.apply(this, arguments);
              };
            }()), yield Promise.all(_t.filter(([jt]) => jt === "mkdir" || jt === "mkdir-index").map(function() {
              var jt = le(function* ([Ct, St]) {
                const Mt = `${g}/${St}`;
                yield r.mkdir(Mt), y && (yield y({ phase: "Updating workdir", loaded: ++It, total: $t }));
              });
              return function(Ct) {
                return jt.apply(this, arguments);
              };
            }())), yield s.a.acquire({ fs: r, gitdir: b, cache: v }, function() {
              var jt = le(function* (Ct) {
                yield Promise.all(_t.filter(([St]) => St === "create" || St === "create-index" || St === "update" || St === "mkdir-index").map(function() {
                  var St = le(function* ([Mt, Lt, ee, ie, we]) {
                    const Se = `${g}/${Lt}`;
                    try {
                      if (Mt !== "create-index" && Mt !== "mkdir-index") {
                        const { object: Qe } = yield Object(Dt.a)({ fs: r, cache: v, gitdir: b, oid: ee });
                        if (we && (yield r.rm(Se)), ie === 33188) yield r.write(Se, Qe);
                        else if (ie === 33261) yield r.write(Se, Qe, { mode: 511 });
                        else {
                          if (ie !== 40960) throw new c.a(`Invalid mode 0o${ie.toString(8)} detected in blob ${ee}`);
                          yield r.writelink(Se, Qe);
                        }
                      }
                      const je = yield r.lstat(Se);
                      ie === 33261 && (je.mode = 493), Mt === "mkdir-index" && (je.mode = 57344), Ct.insert({ filepath: Lt, stats: je, oid: ee }), y && (yield y({ phase: "Updating workdir", loaded: ++It, total: $t }));
                    } catch (je) {
                      console.log(je);
                    }
                  });
                  return function(Mt) {
                    return St.apply(this, arguments);
                  };
                }()));
              });
              return function(Ct) {
                return jt.apply(this, arguments);
              };
            }()), o && (yield o({ previousHead: ft, newHead: gt, type: p != null && p.length > 0 ? "file" : "branch" }));
          }
          if (!J) {
            const _t = yield vt.a.expand({ fs: r, gitdir: b, ref: j });
            _t.startsWith("refs/heads") ? yield vt.a.writeSymbolicRef({ fs: r, gitdir: b, ref: "HEAD", value: _t }) : yield vt.a.writeRef({ fs: r, gitdir: b, ref: "HEAD", value: gt });
          }
        })).apply(this, arguments);
      }
      function Gu(r) {
        return Zr.apply(this, arguments);
      }
      function Zr() {
        return (Zr = le(function* ({ fs: r, cache: v, onProgress: y, dir: o, gitdir: g, ref: b, force: l, filepaths: j }) {
          let p = 0;
          return Object(S.a)({ fs: r, cache: v, dir: o, gitdir: g, trees: [Object(m.a)({ ref: b }), d(), O()], map: (J = le(function* (et, [Q, ht, ft]) {
            if (et !== ".") {
              if (j && !j.some((gt) => Jt(et, gt))) return null;
              switch (y && (yield y({ phase: "Analyzing workdir", loaded: ++p })), [!!ft, !!Q, !!ht].map(Number).join("")) {
                case "000":
                  return;
                case "001":
                  return l && j && j.includes(et) ? ["delete", et] : void 0;
                case "010":
                  switch (yield Q.type()) {
                    case "tree":
                      return ["mkdir", et];
                    case "blob":
                      return ["create", et, yield Q.oid(), yield Q.mode()];
                    case "commit":
                      return ["mkdir-index", et, yield Q.oid(), yield Q.mode()];
                    default:
                      return ["error", `new entry Unhandled type ${yield Q.type()}`];
                  }
                case "011":
                  switch (`${yield Q.type()}-${yield ht.type()}`) {
                    case "tree-tree":
                      return;
                    case "tree-blob":
                    case "blob-tree":
                      return ["conflict", et];
                    case "blob-blob":
                      return (yield Q.oid()) !== (yield ht.oid()) ? l ? ["update", et, yield Q.oid(), yield Q.mode(), (yield Q.mode()) !== (yield ht.mode())] : ["conflict", et] : (yield Q.mode()) !== (yield ht.mode()) ? l ? ["update", et, yield Q.oid(), yield Q.mode(), !0] : ["conflict", et] : ["create-index", et, yield Q.oid(), yield Q.mode()];
                    case "commit-tree":
                      return;
                    case "commit-blob":
                      return ["conflict", et];
                    default:
                      return ["error", `new entry Unhandled type ${Q.type}`];
                  }
                case "100":
                  return ["delete-index", et];
                case "101":
                  switch (yield ft.type()) {
                    case "tree":
                      return ["rmdir", et];
                    case "blob":
                      return (yield ft.oid()) !== (yield ht.oid()) ? l ? ["delete", et] : ["conflict", et] : ["delete", et];
                    case "commit":
                      return ["rmdir-index", et];
                    default:
                      return ["error", `delete entry Unhandled type ${yield ft.type()}`];
                  }
                case "110":
                case "111":
                  switch (`${yield ft.type()}-${yield Q.type()}`) {
                    case "tree-tree":
                      return;
                    case "blob-blob":
                      if ((yield ft.oid()) === (yield Q.oid()) && (yield ft.mode()) === (yield Q.mode()) && !l) return;
                      if (ht) {
                        if ((yield ht.oid()) !== (yield ft.oid()) && (yield ht.oid()) !== (yield Q.oid())) return l ? ["update", et, yield Q.oid(), yield Q.mode(), (yield Q.mode()) !== (yield ht.mode())] : ["conflict", et];
                      } else if (l) return ["update", et, yield Q.oid(), yield Q.mode(), (yield Q.mode()) !== (yield ft.mode())];
                      return (yield Q.mode()) !== (yield ft.mode()) ? ["update", et, yield Q.oid(), yield Q.mode(), !0] : (yield Q.oid()) !== (yield ft.oid()) ? ["update", et, yield Q.oid(), yield Q.mode(), !1] : void 0;
                    case "tree-blob":
                      return ["update-dir-to-blob", et, yield Q.oid()];
                    case "blob-tree":
                      return ["update-blob-to-tree", et];
                    case "commit-commit":
                      return ["mkdir-index", et, yield Q.oid(), yield Q.mode()];
                    default:
                      return ["error", `update entry Unhandled type ${yield ft.type()}-${yield Q.type()}`];
                  }
              }
            }
          }), function(et, Q) {
            return J.apply(this, arguments);
          }), reduce: (q = le(function* (et, Q) {
            return Q = Object(ae.a)(Q), et ? et && et[0] === "rmdir" ? (Q.push(et), Q) : (Q.unshift(et), Q) : Q;
          }), function(et, Q) {
            return q.apply(this, arguments);
          }) });
          var q, J;
        })).apply(this, arguments);
      }
      function Kr(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Yu(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Kr(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Kr(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function fr(r) {
        return Jr.apply(this, arguments);
      }
      function Jr() {
        return (Jr = Yu(function* ({ fs: r, onProgress: v, onPostCheckout: y, dir: o, gitdir: g = Object(E.join)(o, ".git"), remote: b = "origin", ref: l, filepaths: j, noCheckout: p = !1, noUpdateHead: q = l === void 0, dryRun: J = !1, force: et = !1, track: Q = !0, cache: ht = {} }) {
          try {
            Object(f.a)("fs", r), Object(f.a)("dir", o), Object(f.a)("gitdir", g);
            const ft = l || "HEAD";
            return yield Be({ fs: new A.a(r), cache: ht, onProgress: v, onPostCheckout: y, dir: o, gitdir: g, remote: b, ref: ft, filepaths: j, noCheckout: p, noUpdateHead: q, dryRun: J, force: et, track: Q });
          } catch (ft) {
            throw ft.caller = "git.checkout", ft;
          }
        })).apply(this, arguments);
      }
      var lr = t(118);
      function Xr(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Vu(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Xr(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Xr(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Qr(r) {
        return tn.apply(this, arguments);
      }
      function tn() {
        return (tn = Vu(function* ({ fs: r, bare: v = !1, dir: y, gitdir: o = v ? y : Object(E.join)(y, ".git"), defaultBranch: g = "master" }) {
          if (yield r.exists(o + "/config")) return;
          let b = ["hooks", "info", "objects/info", "objects/pack", "refs/heads", "refs/tags"];
          b = b.map((l) => o + "/" + l);
          for (const l of b) yield r.mkdir(l);
          yield r.write(o + "/config", `[core]
	repositoryformatversion = 0
	filemode = false
	bare = ${v}
` + (v ? "" : `	logallrefupdates = true
`) + `	symlinks = false
	ignorecase = true
`), yield r.write(o + "/HEAD", `ref: refs/heads/${g}
`);
        })).apply(this, arguments);
      }
      function en(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Zu(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              en(b, o, g, l, j, "next", p);
            }
            function j(p) {
              en(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Ku(r) {
        return rn.apply(this, arguments);
      }
      function rn() {
        return (rn = Zu(function* ({ fs: r, cache: v, http: y, onProgress: o, onMessage: g, onAuth: b, onAuthSuccess: l, onAuthFailure: j, onPostCheckout: p, dir: q, gitdir: J, url: et, corsProxy: Q, ref: ht, remote: ft, depth: gt, since: _t, exclude: Pt, relative: Ot, singleBranch: It, noCheckout: $t, noTags: jt, headers: Ct }) {
          try {
            if (yield Qr({ fs: r, gitdir: J }), yield At({ fs: r, gitdir: J, remote: ft, url: et, force: !1 }), Q) {
              const Lt = yield $.a.get({ fs: r, gitdir: J });
              yield Lt.set("http.corsProxy", Q), yield $.a.save({ fs: r, gitdir: J, config: Lt });
            }
            const { defaultBranch: St, fetchHead: Mt } = yield Object(lr.a)({ fs: r, cache: v, http: y, onProgress: o, onMessage: g, onAuth: b, onAuthSuccess: l, onAuthFailure: j, gitdir: J, ref: ht, remote: ft, corsProxy: Q, depth: gt, since: _t, exclude: Pt, relative: Ot, singleBranch: It, headers: Ct, tags: !jt });
            if (Mt === null) return;
            ht = (ht = ht || St).replace("refs/heads/", ""), yield Be({ fs: r, cache: v, onProgress: o, onPostCheckout: p, dir: q, gitdir: J, ref: ht, remote: ft, noCheckout: $t });
          } catch (St) {
            throw yield r.rmdir(J, { recursive: !0, maxRetries: 10 }).catch(() => {
            }), St;
          }
        })).apply(this, arguments);
      }
      function nn(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Ju(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              nn(b, o, g, l, j, "next", p);
            }
            function j(p) {
              nn(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function on(r) {
        return an.apply(this, arguments);
      }
      function an() {
        return (an = Ju(function* ({ fs: r, http: v, onProgress: y, onMessage: o, onAuth: g, onAuthSuccess: b, onAuthFailure: l, onPostCheckout: j, dir: p, gitdir: q = Object(E.join)(p, ".git"), url: J, corsProxy: et, ref: Q, remote: ht = "origin", depth: ft, since: gt, exclude: _t = [], relative: Pt = !1, singleBranch: Ot = !1, noCheckout: It = !1, noTags: $t = !1, headers: jt = {}, cache: Ct = {} }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("http", v), Object(f.a)("gitdir", q), It || Object(f.a)("dir", p), Object(f.a)("url", J), yield Ku({ fs: new A.a(r), cache: Ct, http: v, onProgress: y, onMessage: o, onAuth: g, onAuthSuccess: b, onAuthFailure: l, onPostCheckout: j, dir: p, gitdir: q, url: J, corsProxy: et, ref: Q, remote: ht, depth: ft, since: gt, exclude: _t, relative: Pt, singleBranch: Ot, noCheckout: It, noTags: $t, headers: jt });
          } catch (St) {
            throw St.caller = "git.clone", St;
          }
        })).apply(this, arguments);
      }
      var hr = t(95);
      function sn(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Xu(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              sn(b, o, g, l, j, "next", p);
            }
            function j(p) {
              sn(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function un(r) {
        return cn.apply(this, arguments);
      }
      function cn() {
        return (cn = Xu(function* ({ fs: r, onSign: v, dir: y, gitdir: o = Object(E.join)(y, ".git"), message: g, author: b, committer: l, signingKey: j, amend: p = !1, dryRun: q = !1, noUpdateBranch: J = !1, ref: et, parent: Q, tree: ht, cache: ft = {} }) {
          try {
            Object(f.a)("fs", r), p || Object(f.a)("message", g), j && Object(f.a)("onSign", v);
            const gt = new A.a(r);
            return yield Object(hr.a)({ fs: gt, cache: ft, onSign: v, gitdir: o, message: g, author: b, committer: l, signingKey: j, amend: p, dryRun: q, noUpdateBranch: J, ref: et, parent: Q, tree: ht });
          } catch (gt) {
            throw gt.caller = "git.commit", gt;
          }
        })).apply(this, arguments);
      }
      var Ie = t(35);
      function fn(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Qu(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              fn(b, o, g, l, j, "next", p);
            }
            function j(p) {
              fn(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function ln(r) {
        return hn.apply(this, arguments);
      }
      function hn() {
        return (hn = Qu(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), fullname: o = !1, test: g = !1 }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", y), yield Object(Ie.a)({ fs: new A.a(r), gitdir: y, fullname: o, test: g });
          } catch (b) {
            throw b.caller = "git.currentBranch", b;
          }
        })).apply(this, arguments);
      }
      var Ze = t(66);
      function dn(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function tc(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              dn(b, o, g, l, j, "next", p);
            }
            function j(p) {
              dn(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function ec(r) {
        return pn.apply(this, arguments);
      }
      function pn() {
        return (pn = tc(function* ({ fs: r, gitdir: v, ref: y }) {
          if (y = y.startsWith("refs/heads/") ? y : `refs/heads/${y}`, !(yield vt.a.exists({ fs: r, gitdir: v, ref: y }))) throw new z.a(y);
          const o = yield vt.a.expand({ fs: r, gitdir: v, ref: y });
          if (o === (yield Object(Ie.a)({ fs: r, gitdir: v, fullname: !0 }))) {
            const l = yield vt.a.resolve({ fs: r, gitdir: v, ref: o });
            yield vt.a.writeRef({ fs: r, gitdir: v, ref: "HEAD", value: l });
          }
          yield vt.a.deleteRef({ fs: r, gitdir: v, ref: o });
          const g = Object(Ze.a)(y), b = yield $.a.get({ fs: r, gitdir: v });
          yield b.deleteSection("branch", g), yield $.a.save({ fs: r, gitdir: v, config: b });
        })).apply(this, arguments);
      }
      function gn(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function rc(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              gn(b, o, g, l, j, "next", p);
            }
            function j(p) {
              gn(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function mn(r) {
        return yn.apply(this, arguments);
      }
      function yn() {
        return (yn = rc(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), ref: o }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("ref", o), yield ec({ fs: new A.a(r), gitdir: y, ref: o });
          } catch (g) {
            throw g.caller = "git.deleteBranch", g;
          }
        })).apply(this, arguments);
      }
      function wn(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function nc(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              wn(b, o, g, l, j, "next", p);
            }
            function j(p) {
              wn(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function vn(r) {
        return bn.apply(this, arguments);
      }
      function bn() {
        return (bn = nc(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), ref: o }) {
          try {
            Object(f.a)("fs", r), Object(f.a)("ref", o), yield vt.a.deleteRef({ fs: new A.a(r), gitdir: y, ref: o });
          } catch (g) {
            throw g.caller = "git.deleteRef", g;
          }
        })).apply(this, arguments);
      }
      function _n(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function ic(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              _n(b, o, g, l, j, "next", p);
            }
            function j(p) {
              _n(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function oc(r) {
        return kn.apply(this, arguments);
      }
      function kn() {
        return (kn = ic(function* ({ fs: r, gitdir: v, remote: y }) {
          const o = yield $.a.get({ fs: r, gitdir: v });
          yield o.deleteSection("remote", y), yield $.a.save({ fs: r, gitdir: v, config: o });
        })).apply(this, arguments);
      }
      function jn(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function ac(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              jn(b, o, g, l, j, "next", p);
            }
            function j(p) {
              jn(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function xn(r) {
        return On.apply(this, arguments);
      }
      function On() {
        return (On = ac(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), remote: o }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("remote", o), yield oc({ fs: new A.a(r), gitdir: y, remote: o });
          } catch (g) {
            throw g.caller = "git.deleteRemote", g;
          }
        })).apply(this, arguments);
      }
      function En(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function sc(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              En(b, o, g, l, j, "next", p);
            }
            function j(p) {
              En(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function uc(r) {
        return Pn.apply(this, arguments);
      }
      function Pn() {
        return (Pn = sc(function* ({ fs: r, gitdir: v, ref: y }) {
          y = y.startsWith("refs/tags/") ? y : `refs/tags/${y}`, yield vt.a.deleteRef({ fs: r, gitdir: v, ref: y });
        })).apply(this, arguments);
      }
      function Sn(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function cc(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Sn(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Sn(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Rn(r) {
        return An.apply(this, arguments);
      }
      function An() {
        return (An = cc(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), ref: o }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("ref", o), yield uc({ fs: new A.a(r), gitdir: y, ref: o });
          } catch (g) {
            throw g.caller = "git.deleteTag", g;
          }
        })).apply(this, arguments);
      }
      var fc = t(97);
      function Bn(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function lc(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Bn(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Bn(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function hc(r) {
        return In.apply(this, arguments);
      }
      function In() {
        return (In = lc(function* ({ fs: r, gitdir: v, oid: y }) {
          const o = y.slice(0, 2);
          return (yield r.readdir(`${v}/objects/${o}`)).map((g) => `${o}${g}`).filter((g) => g.startsWith(y));
        })).apply(this, arguments);
      }
      var dc = t(81);
      function Tn(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function pc(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Tn(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Tn(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function gc(r) {
        return $n.apply(this, arguments);
      }
      function $n() {
        return ($n = pc(function* ({ fs: r, cache: v, gitdir: y, oid: o, getExternalRefDelta: g }) {
          const b = [];
          let l = yield r.readdir(Object(E.join)(y, "objects/pack"));
          l = l.filter((j) => j.endsWith(".idx"));
          for (const j of l) {
            const p = `${y}/objects/pack/${j}`, q = yield Object(dc.a)({ fs: r, cache: v, filename: p, getExternalRefDelta: g });
            if (q.error) throw new c.a(q.error);
            for (const J of q.offsets.keys()) J.startsWith(o) && b.push(J);
          }
          return b;
        })).apply(this, arguments);
      }
      function Cn(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function mc(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Cn(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Cn(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function yc(r) {
        return Dn.apply(this, arguments);
      }
      function Dn() {
        return (Dn = mc(function* ({ fs: r, cache: v, gitdir: y, oid: o }) {
          const g = yield hc({ fs: r, gitdir: y, oid: o }), b = yield gc({ fs: r, cache: v, gitdir: y, oid: o, getExternalRefDelta: (l) => Object(Dt.a)({ fs: r, cache: v, gitdir: y, oid: l }) });
          for (const l of b) g.indexOf(l) === -1 && g.push(l);
          if (g.length === 1) return g[0];
          throw g.length > 1 ? new fc.a("oids", o, g) : new z.a(`an object matching "${o}"`);
        })).apply(this, arguments);
      }
      function Mn(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function wc(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Mn(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Mn(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Nn(r) {
        return Un.apply(this, arguments);
      }
      function Un() {
        return (Un = wc(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), oid: o, cache: g = {} }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("oid", o), yield yc({ fs: new A.a(r), cache: g, gitdir: y, oid: o });
          } catch (b) {
            throw b.caller = "git.expandOid", b;
          }
        })).apply(this, arguments);
      }
      function Fn(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function vc(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Fn(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Fn(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function zn(r) {
        return Ln.apply(this, arguments);
      }
      function Ln() {
        return (Ln = vc(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), ref: o }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("ref", o), yield vt.a.expand({ fs: new A.a(r), gitdir: y, ref: o });
          } catch (g) {
            throw g.caller = "git.expandRef", g;
          }
        })).apply(this, arguments);
      }
      var rr = t(14);
      function qn(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function bc(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              qn(b, o, g, l, j, "next", p);
            }
            function j(p) {
              qn(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function dr(r) {
        return Hn.apply(this, arguments);
      }
      function Hn() {
        return (Hn = bc(function* ({ fs: r, cache: v, gitdir: y, oids: o }) {
          const g = {}, b = o.length;
          let l = o.map((j, p) => ({ index: p, oid: j }));
          for (; l.length; ) {
            const j = /* @__PURE__ */ new Set();
            for (const q of l) {
              const { oid: J, index: et } = q;
              g[J] || (g[J] = /* @__PURE__ */ new Set()), g[J].add(et), g[J].size === b && j.add(J);
            }
            if (j.size > 0) return [...j];
            const p = /* @__PURE__ */ new Map();
            for (const q of l) {
              const { oid: J, index: et } = q;
              try {
                const { object: Q } = yield Object(Dt.a)({ fs: r, cache: v, gitdir: y, oid: J }), ht = rr.a.from(Q), { parent: ft } = ht.parseHeaders();
                for (const gt of ft) g[gt] && g[gt].has(et) || p.set(gt + ":" + et, { oid: gt, index: et });
              } catch {
              }
            }
            l = Array.from(p.values());
          }
          return [];
        })).apply(this, arguments);
      }
      var _c = t(100), kc = t(57), jc = t(56), xc = t(127);
      function Wn(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Gn(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Wn(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Wn(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Yn(r) {
        return Vn.apply(this, arguments);
      }
      function Vn() {
        return (Vn = Gn(function* ({ fs: r, cache: v, dir: y, gitdir: o, ours: g, theirs: b, fastForward: l = !0, fastForwardOnly: j = !1, dryRun: p = !1, noUpdateBranch: q = !1, abortOnConflict: J = !0, message: et, author: Q, committer: ht, signingKey: ft, onSign: gt, mergeDriver: _t }) {
          g === void 0 && (g = yield Object(Ie.a)({ fs: r, gitdir: o, fullname: !0 })), g = yield vt.a.expand({ fs: r, gitdir: o, ref: g }), b = yield vt.a.expand({ fs: r, gitdir: o, ref: b });
          const Pt = yield vt.a.resolve({ fs: r, gitdir: o, ref: g }), Ot = yield vt.a.resolve({ fs: r, gitdir: o, ref: b }), It = yield dr({ fs: r, cache: v, gitdir: o, oids: [Pt, Ot] });
          if (It.length !== 1) throw new jc.a();
          const $t = It[0];
          if ($t === Ot) return { oid: Pt, alreadyMerged: !0 };
          if (l && $t === Pt) return p || q || (yield vt.a.writeRef({ fs: r, gitdir: o, ref: g, value: Ot })), { oid: Ot, fastForward: !0 };
          {
            if (j) throw new _c.a();
            const jt = yield s.a.acquire({ fs: r, gitdir: o, cache: v, allowUnmerged: !1 }, function() {
              var Ct = Gn(function* (St) {
                return Object(xc.a)({ fs: r, cache: v, dir: y, gitdir: o, index: St, ourOid: Pt, theirOid: Ot, baseOid: $t, ourName: Object(Ze.a)(g), baseName: "base", theirName: Object(Ze.a)(b), dryRun: p, abortOnConflict: J, mergeDriver: _t });
              });
              return function(St) {
                return Ct.apply(this, arguments);
              };
            }());
            if (jt instanceof kc.a) throw jt;
            return et || (et = `Merge branch '${Object(Ze.a)(b)}' into ${Object(Ze.a)(g)}`), { oid: yield Object(hr.a)({ fs: r, cache: v, gitdir: o, message: et, ref: g, tree: jt, parent: [Pt, Ot], author: Q, committer: ht, signingKey: ft, onSign: gt, dryRun: p, noUpdateBranch: q }), tree: jt, mergeCommit: !0 };
          }
        })).apply(this, arguments);
      }
      var Te = t(24);
      function Zn(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Oc(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Zn(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Zn(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Kn(r) {
        return Jn.apply(this, arguments);
      }
      function Jn() {
        return (Jn = Oc(function* ({ fs: r, cache: v, http: y, onProgress: o, onMessage: g, onAuth: b, onAuthSuccess: l, onAuthFailure: j, dir: p, gitdir: q, ref: J, url: et, remote: Q, remoteRef: ht, prune: ft, pruneTags: gt, fastForward: _t, fastForwardOnly: Pt, corsProxy: Ot, singleBranch: It, headers: $t, author: jt, committer: Ct, signingKey: St }) {
          try {
            if (!J) {
              const ee = yield Object(Ie.a)({ fs: r, gitdir: q });
              if (!ee) throw new Te.a("ref");
              J = ee;
            }
            const { fetchHead: Mt, fetchHeadDescription: Lt } = yield Object(lr.a)({ fs: r, cache: v, http: y, onProgress: o, onMessage: g, onAuth: b, onAuthSuccess: l, onAuthFailure: j, gitdir: q, corsProxy: Ot, ref: J, url: et, remote: Q, remoteRef: ht, singleBranch: It, headers: $t, prune: ft, pruneTags: gt });
            yield Yn({ fs: r, cache: v, gitdir: q, ours: J, theirs: Mt, fastForward: _t, fastForwardOnly: Pt, message: `Merge ${Lt}`, author: jt, committer: Ct, signingKey: St, dryRun: !1, noUpdateBranch: !1 }), yield Be({ fs: r, cache: v, onProgress: o, dir: p, gitdir: q, ref: J, remote: Q, noCheckout: !1 });
          } catch (Mt) {
            throw Mt.caller = "git.pull", Mt;
          }
        })).apply(this, arguments);
      }
      function Xn(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Ec(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Xn(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Xn(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Qn(r) {
        return ti.apply(this, arguments);
      }
      function ti() {
        return (ti = Ec(function* ({ fs: r, http: v, onProgress: y, onMessage: o, onAuth: g, onAuthSuccess: b, onAuthFailure: l, dir: j, gitdir: p = Object(E.join)(j, ".git"), ref: q, url: J, remote: et, remoteRef: Q, corsProxy: ht, singleBranch: ft, headers: gt = {}, cache: _t = {} }) {
          try {
            Object(f.a)("fs", r), Object(f.a)("http", v), Object(f.a)("gitdir", p);
            const Pt = { name: "", email: "", timestamp: Date.now(), timezoneOffset: 0 };
            return yield Kn({ fs: new A.a(r), cache: _t, http: v, onProgress: y, onMessage: o, onAuth: g, onAuthSuccess: b, onAuthFailure: l, dir: j, gitdir: p, ref: q, url: J, remote: et, remoteRef: Q, fastForwardOnly: !0, corsProxy: ht, singleBranch: ft, headers: gt, author: Pt, committer: Pt });
          } catch (Pt) {
            throw Pt.caller = "git.fastForward", Pt;
          }
        })).apply(this, arguments);
      }
      function ei(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Pc(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              ei(b, o, g, l, j, "next", p);
            }
            function j(p) {
              ei(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function ri(r) {
        return ni.apply(this, arguments);
      }
      function ni() {
        return (ni = Pc(function* ({ fs: r, http: v, onProgress: y, onMessage: o, onAuth: g, onAuthSuccess: b, onAuthFailure: l, dir: j, gitdir: p = Object(E.join)(j, ".git"), ref: q, remote: J, remoteRef: et, url: Q, corsProxy: ht, depth: ft = null, since: gt = null, exclude: _t = [], relative: Pt = !1, tags: Ot = !1, singleBranch: It = !1, headers: $t = {}, prune: jt = !1, pruneTags: Ct = !1, cache: St = {} }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("http", v), Object(f.a)("gitdir", p), yield Object(lr.a)({ fs: new A.a(r), cache: St, http: v, onProgress: y, onMessage: o, onAuth: g, onAuthSuccess: b, onAuthFailure: l, gitdir: p, ref: q, remote: J, remoteRef: et, url: Q, corsProxy: ht, depth: ft, since: gt, exclude: _t, relative: Pt, tags: Ot, singleBranch: It, headers: $t, prune: jt, pruneTags: Ct });
          } catch (Mt) {
            throw Mt.caller = "git.fetch", Mt;
          }
        })).apply(this, arguments);
      }
      function ii(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Sc(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              ii(b, o, g, l, j, "next", p);
            }
            function j(p) {
              ii(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function oi(r) {
        return ai.apply(this, arguments);
      }
      function ai() {
        return (ai = Sc(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), oids: o, cache: g = {} }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("oids", o), yield dr({ fs: new A.a(r), cache: g, gitdir: y, oids: o });
          } catch (b) {
            throw b.caller = "git.findMergeBase", b;
          }
        })).apply(this, arguments);
      }
      var Rc = t(27);
      function si(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Ac(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              si(b, o, g, l, j, "next", p);
            }
            function j(p) {
              si(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function ui(r) {
        return ci.apply(this, arguments);
      }
      function ci() {
        return (ci = Ac(function* ({ fs: r, filepath: v }) {
          if (yield r.exists(Object(E.join)(v, ".git"))) return v;
          {
            const y = Object(Rc.a)(v);
            if (y === v) throw new z.a(`git root for ${v}`);
            return ui({ fs: r, filepath: y });
          }
        })).apply(this, arguments);
      }
      function fi(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Bc(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              fi(b, o, g, l, j, "next", p);
            }
            function j(p) {
              fi(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function li(r) {
        return hi.apply(this, arguments);
      }
      function hi() {
        return (hi = Bc(function* ({ fs: r, filepath: v }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("filepath", v), yield ui({ fs: new A.a(r), filepath: v });
          } catch (y) {
            throw y.caller = "git.findRoot", y;
          }
        })).apply(this, arguments);
      }
      var Ic = t(41);
      function di(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Tc(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              di(b, o, g, l, j, "next", p);
            }
            function j(p) {
              di(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function pi(r) {
        return gi.apply(this, arguments);
      }
      function gi() {
        return (gi = Tc(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), path: o }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("path", o), yield Object(Ic.a)({ fs: new A.a(r), gitdir: y, path: o });
          } catch (g) {
            throw g.caller = "git.getConfig", g;
          }
        })).apply(this, arguments);
      }
      function mi(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function $c(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              mi(b, o, g, l, j, "next", p);
            }
            function j(p) {
              mi(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Cc(r) {
        return yi.apply(this, arguments);
      }
      function yi() {
        return (yi = $c(function* ({ fs: r, gitdir: v, path: y }) {
          return (yield $.a.get({ fs: r, gitdir: v })).getall(y);
        })).apply(this, arguments);
      }
      function wi(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Dc(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              wi(b, o, g, l, j, "next", p);
            }
            function j(p) {
              wi(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function vi(r) {
        return bi.apply(this, arguments);
      }
      function bi() {
        return (bi = Dc(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), path: o }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("path", o), yield Cc({ fs: new A.a(r), gitdir: y, path: o });
          } catch (g) {
            throw g.caller = "git.getConfigAll", g;
          }
        })).apply(this, arguments);
      }
      var pr = t(63);
      function _i(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Mc(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              _i(b, o, g, l, j, "next", p);
            }
            function j(p) {
              _i(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function ki(r) {
        return ji.apply(this, arguments);
      }
      function ji() {
        return (ji = Mc(function* ({ http: r, onAuth: v, onAuthSuccess: y, onAuthFailure: o, corsProxy: g, url: b, headers: l = {}, forPush: j = !1 }) {
          try {
            Object(f.a)("http", r), Object(f.a)("url", b);
            const p = pr.a.getRemoteHelperFor({ url: b }), q = yield p.discover({ http: r, onAuth: v, onAuthSuccess: y, onAuthFailure: o, corsProxy: g, service: j ? "git-receive-pack" : "git-upload-pack", url: b, headers: l, protocolVersion: 1 }), J = { capabilities: [...q.capabilities] };
            for (const [et, Q] of q.refs) {
              const ht = et.split("/"), ft = ht.pop();
              let gt = J;
              for (const _t of ht) gt[_t] = gt[_t] || {}, gt = gt[_t];
              gt[ft] = Q;
            }
            for (const [et, Q] of q.symrefs) {
              const ht = et.split("/"), ft = ht.pop();
              let gt = J;
              for (const _t of ht) gt[_t] = gt[_t] || {}, gt = gt[_t];
              gt[ft] = Q;
            }
            return J;
          } catch (p) {
            throw p.caller = "git.getRemoteInfo", p;
          }
        })).apply(this, arguments);
      }
      function xi(r, v, y, o) {
        const g = [];
        for (const [b, l] of r.refs) {
          if (v && !b.startsWith(v)) continue;
          if (b.endsWith("^{}")) {
            if (o) {
              const p = b.replace("^{}", ""), q = g[g.length - 1], J = q.ref === p ? q : g.find((et) => et.ref === p);
              if (J === void 0) throw new Error("I did not expect this to happen");
              J.peeled = l;
            }
            continue;
          }
          const j = { ref: b, oid: l };
          y && r.symrefs.has(b) && (j.target = r.symrefs.get(b)), g.push(j);
        }
        return g;
      }
      function Oi(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Nc(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Oi(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Oi(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Ei(r) {
        return Pi.apply(this, arguments);
      }
      function Pi() {
        return (Pi = Nc(function* ({ http: r, onAuth: v, onAuthSuccess: y, onAuthFailure: o, corsProxy: g, url: b, headers: l = {}, forPush: j = !1, protocolVersion: p = 2 }) {
          try {
            Object(f.a)("http", r), Object(f.a)("url", b);
            const q = pr.a.getRemoteHelperFor({ url: b }), J = yield q.discover({ http: r, onAuth: v, onAuthSuccess: y, onAuthFailure: o, corsProxy: g, service: j ? "git-receive-pack" : "git-upload-pack", url: b, headers: l, protocolVersion: p });
            if (J.protocolVersion === 2) return { protocolVersion: J.protocolVersion, capabilities: J.capabilities2 };
            const et = {};
            for (const Q of J.capabilities) {
              const [ht, ft] = Q.split("=");
              et[ht] = ft || !0;
            }
            return { protocolVersion: 1, capabilities: et, refs: xi(J, void 0, !0, !0) };
          } catch (q) {
            throw q.caller = "git.getRemoteInfo2", q;
          }
        })).apply(this, arguments);
      }
      var Si = t(159), Uc = t(62);
      function Ri(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Fc(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Ri(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Ri(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function zc(r) {
        return Ai.apply(this, arguments);
      }
      function Ai() {
        return (Ai = Fc(function* ({ fs: r, cache: v, onProgress: y, dir: o, gitdir: g, filepath: b }) {
          try {
            b = Object(E.join)(o, b);
            const l = yield r.read(b), j = (q) => Object(Dt.a)({ fs: r, cache: v, gitdir: g, oid: q }), p = yield Uc.a.fromPack({ pack: l, getExternalRefDelta: j, onProgress: y });
            return yield r.write(b.replace(/\.pack$/, ".idx"), yield p.toBuffer()), { oids: [...p.hashes] };
          } catch (l) {
            throw l.caller = "git.indexPack", l;
          }
        })).apply(this, arguments);
      }
      function Bi(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Lc(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Bi(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Bi(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Ii(r) {
        return Ti.apply(this, arguments);
      }
      function Ti() {
        return (Ti = Lc(function* ({ fs: r, onProgress: v, dir: y, gitdir: o = Object(E.join)(y, ".git"), filepath: g, cache: b = {} }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("dir", y), Object(f.a)("gitdir", y), Object(f.a)("filepath", g), yield zc({ fs: new A.a(r), cache: b, onProgress: v, dir: y, gitdir: o, filepath: g });
          } catch (l) {
            throw l.caller = "git.indexPack", l;
          }
        })).apply(this, arguments);
      }
      function $i(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function qc(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              $i(b, o, g, l, j, "next", p);
            }
            function j(p) {
              $i(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Ci(r) {
        return Di.apply(this, arguments);
      }
      function Di() {
        return (Di = qc(function* ({ fs: r, bare: v = !1, dir: y, gitdir: o = v ? y : Object(E.join)(y, ".git"), defaultBranch: g = "master" }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", o), v || Object(f.a)("dir", y), yield Qr({ fs: new A.a(r), bare: v, dir: y, gitdir: o, defaultBranch: g });
          } catch (b) {
            throw b.caller = "git.init", b;
          }
        })).apply(this, arguments);
      }
      var Hc = t(102), Ke = t(17), Mi = t(44);
      function Ni(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Wc(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Ni(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Ni(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Ui(r) {
        return Fi.apply(this, arguments);
      }
      function Fi() {
        return (Fi = Wc(function* ({ fs: r, cache: v, gitdir: y, oid: o, ancestor: g, depth: b }) {
          const l = yield Mi.a.read({ fs: r, gitdir: y });
          if (!o) throw new Te.a("oid");
          if (!g) throw new Te.a("ancestor");
          if (o === g) return !1;
          const j = [o], p = /* @__PURE__ */ new Set();
          let q = 0;
          for (; j.length; ) {
            if (q++ === b) throw new Hc.a(b);
            const J = j.shift(), { type: et, object: Q } = yield Object(Dt.a)({ fs: r, cache: v, gitdir: y, oid: J });
            if (et !== "commit") throw new Ke.a(J, et, "commit");
            const ht = rr.a.from(Q).parse();
            for (const ft of ht.parent) if (ft === g) return !0;
            if (!l.has(J)) for (const ft of ht.parent) p.has(ft) || (j.push(ft), p.add(ft));
          }
          return !1;
        })).apply(this, arguments);
      }
      function zi(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Gc(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              zi(b, o, g, l, j, "next", p);
            }
            function j(p) {
              zi(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Li(r) {
        return qi.apply(this, arguments);
      }
      function qi() {
        return (qi = Gc(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), oid: o, ancestor: g, depth: b = -1, cache: l = {} }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("oid", o), Object(f.a)("ancestor", g), yield Ui({ fs: new A.a(r), cache: l, gitdir: y, oid: o, ancestor: g, depth: b });
          } catch (j) {
            throw j.caller = "git.isDescendent", j;
          }
        })).apply(this, arguments);
      }
      function Hi(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Yc(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Hi(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Hi(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Wi(r) {
        return Gi.apply(this, arguments);
      }
      function Gi() {
        return (Gi = Yc(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), filepath: o }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("dir", v), Object(f.a)("gitdir", y), Object(f.a)("filepath", o), H.a.isIgnored({ fs: new A.a(r), dir: v, gitdir: y, filepath: o });
          } catch (g) {
            throw g.caller = "git.isIgnored", g;
          }
        })).apply(this, arguments);
      }
      function Yi(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Vc(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Yi(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Yi(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Vi(r) {
        return Zi.apply(this, arguments);
      }
      function Zi() {
        return (Zi = Vc(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), remote: o }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", y), vt.a.listBranches({ fs: new A.a(r), gitdir: y, remote: o });
          } catch (g) {
            throw g.caller = "git.listBranches", g;
          }
        })).apply(this, arguments);
      }
      var Je = t(54);
      function Ki(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function gr(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Ki(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Ki(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Zc(r) {
        return Ji.apply(this, arguments);
      }
      function Ji() {
        return (Ji = gr(function* ({ fs: r, gitdir: v, ref: y, cache: o }) {
          if (y) {
            const g = yield vt.a.resolve({ gitdir: v, fs: r, ref: y }), b = [];
            return yield Xi({ fs: r, cache: o, gitdir: v, oid: g, filenames: b, prefix: "" }), b;
          }
          return s.a.acquire({ fs: r, gitdir: v, cache: o }, function() {
            var g = gr(function* (b) {
              return b.entries.map((l) => l.path);
            });
            return function(b) {
              return g.apply(this, arguments);
            };
          }());
        })).apply(this, arguments);
      }
      function Xi(r) {
        return Qi.apply(this, arguments);
      }
      function Qi() {
        return (Qi = gr(function* ({ fs: r, cache: v, gitdir: y, oid: o, filenames: g, prefix: b }) {
          const { tree: l } = yield Object(Je.a)({ fs: r, cache: v, gitdir: y, oid: o });
          for (const j of l) j.type === "tree" ? yield Xi({ fs: r, cache: v, gitdir: y, oid: j.oid, filenames: g, prefix: Object(E.join)(b, j.path) }) : g.push(Object(E.join)(b, j.path));
        })).apply(this, arguments);
      }
      function to(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Kc(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              to(b, o, g, l, j, "next", p);
            }
            function j(p) {
              to(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function eo(r) {
        return ro.apply(this, arguments);
      }
      function ro() {
        return (ro = Kc(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), ref: o, cache: g = {} }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", y), yield Zc({ fs: new A.a(r), cache: g, gitdir: y, ref: o });
          } catch (b) {
            throw b.caller = "git.listFiles", b;
          }
        })).apply(this, arguments);
      }
      function no(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Jc(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              no(b, o, g, l, j, "next", p);
            }
            function j(p) {
              no(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Xc(r) {
        return io.apply(this, arguments);
      }
      function io() {
        return (io = Jc(function* ({ fs: r, cache: v, gitdir: y, ref: o }) {
          let g;
          try {
            g = yield vt.a.resolve({ gitdir: y, fs: r, ref: o });
          } catch (b) {
            if (b instanceof z.a) return [];
          }
          return (yield Object(Je.a)({ fs: r, cache: v, gitdir: y, oid: g })).tree.map((b) => ({ target: b.path, note: b.oid }));
        })).apply(this, arguments);
      }
      function oo(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Qc(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              oo(b, o, g, l, j, "next", p);
            }
            function j(p) {
              oo(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function ao(r) {
        return so.apply(this, arguments);
      }
      function so() {
        return (so = Qc(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), ref: o = "refs/notes/commits", cache: g = {} }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("ref", o), yield Xc({ fs: new A.a(r), cache: g, gitdir: y, ref: o });
          } catch (b) {
            throw b.caller = "git.listNotes", b;
          }
        })).apply(this, arguments);
      }
      function uo(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function tf(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              uo(b, o, g, l, j, "next", p);
            }
            function j(p) {
              uo(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function co(r) {
        return fo.apply(this, arguments);
      }
      function fo() {
        return (fo = tf(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), filepath: o }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", y), vt.a.listRefs({ fs: new A.a(r), gitdir: y, filepath: o });
          } catch (g) {
            throw g.caller = "git.listRefs", g;
          }
        })).apply(this, arguments);
      }
      function lo(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function ho(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              lo(b, o, g, l, j, "next", p);
            }
            function j(p) {
              lo(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function ef(r) {
        return po.apply(this, arguments);
      }
      function po() {
        return (po = ho(function* ({ fs: r, gitdir: v }) {
          const y = yield $.a.get({ fs: r, gitdir: v }), o = yield y.getSubsections("remote");
          return Promise.all(o.map(function() {
            var g = ho(function* (b) {
              return { remote: b, url: yield y.get(`remote.${b}.url`) };
            });
            return function(b) {
              return g.apply(this, arguments);
            };
          }()));
        })).apply(this, arguments);
      }
      function go(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function rf(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              go(b, o, g, l, j, "next", p);
            }
            function j(p) {
              go(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function mo(r) {
        return yo.apply(this, arguments);
      }
      function yo() {
        return (yo = rf(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git") }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", y), yield ef({ fs: new A.a(r), gitdir: y });
          } catch (o) {
            throw o.caller = "git.listRemotes", o;
          }
        })).apply(this, arguments);
      }
      var wo = t(55), Ee = t(9);
      function vo(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function nf(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              vo(b, o, g, l, j, "next", p);
            }
            function j(p) {
              vo(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function of(r) {
        return bo.apply(this, arguments);
      }
      function bo() {
        return (bo = nf(function* (r) {
          const v = Ee.a.streamReader(r), y = [];
          let o;
          for (; o = yield v(), o !== !0; ) {
            if (o === null) continue;
            o = o.toString("utf8").replace(/\n$/, "");
            const [g, b, ...l] = o.split(" "), j = { ref: b, oid: g };
            for (const p of l) {
              const [q, J] = p.split(":");
              q === "symref-target" ? j.target = J : q === "peeled" && (j.peeled = J);
            }
            y.push(j);
          }
          return y;
        })).apply(this, arguments);
      }
      var mr = t(48);
      function _o(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function af(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              _o(b, o, g, l, j, "next", p);
            }
            function j(p) {
              _o(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function sf(r) {
        return ko.apply(this, arguments);
      }
      function ko() {
        return (ko = af(function* ({ prefix: r, symrefs: v, peelTags: y }) {
          const o = [];
          return o.push(Ee.a.encode(`command=ls-refs
`)), o.push(Ee.a.encode(`agent=${mr.a.agent}
`)), (y || v || r) && o.push(Ee.a.delim()), y && o.push(Ee.a.encode("peel")), v && o.push(Ee.a.encode("symrefs")), r && o.push(Ee.a.encode(`ref-prefix ${r}`)), o.push(Ee.a.flush()), o;
        })).apply(this, arguments);
      }
      function jo(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function uf(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              jo(b, o, g, l, j, "next", p);
            }
            function j(p) {
              jo(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function xo(r) {
        return Oo.apply(this, arguments);
      }
      function Oo() {
        return (Oo = uf(function* ({ http: r, onAuth: v, onAuthSuccess: y, onAuthFailure: o, corsProxy: g, url: b, headers: l = {}, forPush: j = !1, protocolVersion: p = 2, prefix: q, symrefs: J, peelTags: et }) {
          try {
            Object(f.a)("http", r), Object(f.a)("url", b);
            const Q = yield wo.a.discover({ http: r, onAuth: v, onAuthSuccess: y, onAuthFailure: o, corsProxy: g, service: j ? "git-receive-pack" : "git-upload-pack", url: b, headers: l, protocolVersion: p });
            if (Q.protocolVersion === 1) return xi(Q, q, J, et);
            const ht = yield sf({ prefix: q, symrefs: J, peelTags: et });
            return of((yield wo.a.connect({ http: r, auth: Q.auth, headers: l, corsProxy: g, service: j ? "git-receive-pack" : "git-upload-pack", url: b, body: ht })).body);
          } catch (Q) {
            throw Q.caller = "git.listServerRefs", Q;
          }
        })).apply(this, arguments);
      }
      function Eo(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function cf(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Eo(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Eo(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Po(r) {
        return So.apply(this, arguments);
      }
      function So() {
        return (So = cf(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git") }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", y), vt.a.listTags({ fs: new A.a(r), gitdir: y });
          } catch (o) {
            throw o.caller = "git.listTags", o;
          }
        })).apply(this, arguments);
      }
      var Xe = t(65);
      function ff(r, v) {
        return r.committer.timestamp - v.committer.timestamp;
      }
      var yr = t(12), lf = t(47);
      function Ro(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Ao(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Ro(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Ro(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      const hf = "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391";
      function Bo(r) {
        return Io.apply(this, arguments);
      }
      function Io() {
        return (Io = Ao(function* ({ fs: r, cache: v, gitdir: y, oid: o, fileId: g }) {
          if (g === hf) return;
          const b = o;
          let l;
          const j = yield Object(lf.a)({ fs: r, cache: v, gitdir: y, oid: o }), p = j.tree;
          return g === j.oid ? l = j.path : (l = yield To({ fs: r, cache: v, gitdir: y, tree: p, fileId: g, oid: b }), Array.isArray(l) && (l.length === 0 ? l = void 0 : l.length === 1 && (l = l[0]))), l;
        })).apply(this, arguments);
      }
      function To(r) {
        return $o.apply(this, arguments);
      }
      function $o() {
        return ($o = Ao(function* ({ fs: r, cache: v, gitdir: y, tree: o, fileId: g, oid: b, filepaths: l = [], parentPath: j = "" }) {
          const p = o.entries().map(function(q) {
            let J;
            return q.oid === g ? (J = Object(E.join)(j, q.path), l.push(J)) : q.type === "tree" && (J = Object(Dt.a)({ fs: r, cache: v, gitdir: y, oid: q.oid }).then(function({ object: et }) {
              return To({ fs: r, cache: v, gitdir: y, tree: yr.a.from(et), fileId: g, oid: b, filepaths: l, parentPath: Object(E.join)(j, q.path) });
            })), J;
          });
          return yield Promise.all(p), l;
        })).apply(this, arguments);
      }
      var nr = t(70);
      function Co(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function df(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Co(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Co(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function pf(r) {
        return Do.apply(this, arguments);
      }
      function Do() {
        return (Do = df(function* ({ fs: r, cache: v, gitdir: y, filepath: o, ref: g, depth: b, since: l, force: j, follow: p }) {
          const q = l === void 0 ? void 0 : Math.floor(l.valueOf() / 1e3), J = [], et = yield Mi.a.read({ fs: r, gitdir: y }), Q = yield vt.a.resolve({ fs: r, gitdir: y, ref: g }), ht = [yield Object(Xe.a)({ fs: r, cache: v, gitdir: y, oid: Q })];
          let ft, gt, _t;
          function Pt(Ot) {
            _t && o && J.push(Ot);
          }
          for (; ht.length > 0; ) {
            const Ot = ht.pop();
            if (q !== void 0 && Ot.commit.committer.timestamp <= q) break;
            if (o) {
              let It;
              try {
                It = yield Object(nr.a)({ fs: r, cache: v, gitdir: y, oid: Ot.commit.tree, filepath: o }), gt && ft !== It && J.push(gt), ft = It, gt = Ot, _t = !0;
              } catch ($t) {
                if (!($t instanceof z.a)) throw $t;
                {
                  let jt = p && ft;
                  if (jt && (jt = yield Bo({ fs: r, cache: v, gitdir: y, oid: Ot.commit.tree, fileId: ft }), jt)) if (Array.isArray(jt)) {
                    if (gt) {
                      const Ct = yield Bo({ fs: r, cache: v, gitdir: y, oid: gt.commit.tree, fileId: ft });
                      if (Array.isArray(Ct)) {
                        if (jt = jt.filter((St) => Ct.indexOf(St) === -1), jt.length !== 1) {
                          jt = !1, gt && J.push(gt);
                          break;
                        }
                        jt = jt[0], o = jt, gt && J.push(gt);
                      }
                    }
                  } else o = jt, gt && J.push(gt);
                  if (!jt) {
                    if (_t && ft && (J.push(gt), !j)) break;
                    if (!j && !p) throw $t;
                  }
                  gt = Ot, _t = !1;
                }
              }
            } else J.push(Ot);
            if (b !== void 0 && J.length === b) {
              Pt(Ot);
              break;
            }
            if (!et.has(Ot.oid)) for (const It of Ot.commit.parent) {
              const $t = yield Object(Xe.a)({ fs: r, cache: v, gitdir: y, oid: It });
              ht.map((jt) => jt.oid).includes($t.oid) || ht.push($t);
            }
            ht.length === 0 && Pt(Ot), ht.sort((It, $t) => ff(It.commit, $t.commit));
          }
          return J;
        })).apply(this, arguments);
      }
      function Mo(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function gf(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Mo(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Mo(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function No(r) {
        return Uo.apply(this, arguments);
      }
      function Uo() {
        return (Uo = gf(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), filepath: o, ref: g = "HEAD", depth: b, since: l, force: j, follow: p, cache: q = {} }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("ref", g), yield pf({ fs: new A.a(r), cache: q, gitdir: y, filepath: o, ref: g, depth: b, since: l, force: j, follow: p });
          } catch (J) {
            throw J.caller = "git.log", J;
          }
        })).apply(this, arguments);
      }
      function Fo(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function mf(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Fo(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Fo(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function zo(r) {
        return Lo.apply(this, arguments);
      }
      function Lo() {
        return (Lo = mf(function* ({ fs: r, onSign: v, dir: y, gitdir: o = Object(E.join)(y, ".git"), ours: g, theirs: b, fastForward: l = !0, fastForwardOnly: j = !1, dryRun: p = !1, noUpdateBranch: q = !1, abortOnConflict: J = !0, message: et, author: Q, committer: ht, signingKey: ft, cache: gt = {}, mergeDriver: _t }) {
          try {
            Object(f.a)("fs", r), ft && Object(f.a)("onSign", v);
            const Pt = new A.a(r), Ot = yield Object(st.a)({ fs: Pt, gitdir: o, author: Q });
            if (!(Ot || j && l)) throw new pt.a("author");
            const It = yield Object(mt.a)({ fs: Pt, gitdir: o, author: Ot, committer: ht });
            if (!(It || j && l)) throw new pt.a("committer");
            return yield Yn({ fs: Pt, cache: gt, dir: y, gitdir: o, ours: g, theirs: b, fastForward: l, fastForwardOnly: j, dryRun: p, noUpdateBranch: q, abortOnConflict: J, message: et, author: Ot, committer: It, signingKey: ft, onSign: v, mergeDriver: _t });
          } catch (Pt) {
            throw Pt.caller = "git.merge", Pt;
          }
        })).apply(this, arguments);
      }
      var yf = t(166);
      function qo(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function wf(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              qo(b, o, g, l, j, "next", p);
            }
            function j(p) {
              qo(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Ho(r) {
        return Wo.apply(this, arguments);
      }
      function Wo() {
        return (Wo = wf(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), oids: o, write: g = !1, cache: b = {} }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("oids", o), yield Object(yf.a)({ fs: new A.a(r), cache: b, gitdir: y, oids: o, write: g });
          } catch (l) {
            throw l.caller = "git.packObjects", l;
          }
        })).apply(this, arguments);
      }
      function Go(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function vf(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Go(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Go(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Yo(r) {
        return Vo.apply(this, arguments);
      }
      function Vo() {
        return (Vo = vf(function* ({ fs: r, http: v, onProgress: y, onMessage: o, onAuth: g, onAuthSuccess: b, onAuthFailure: l, dir: j, gitdir: p = Object(E.join)(j, ".git"), ref: q, url: J, remote: et, remoteRef: Q, prune: ht = !1, pruneTags: ft = !1, fastForward: gt = !0, fastForwardOnly: _t = !1, corsProxy: Pt, singleBranch: Ot, headers: It = {}, author: $t, committer: jt, signingKey: Ct, cache: St = {} }) {
          try {
            Object(f.a)("fs", r), Object(f.a)("gitdir", p);
            const Mt = new A.a(r), Lt = yield Object(st.a)({ fs: Mt, gitdir: p, author: $t });
            if (!Lt) throw new pt.a("author");
            const ee = yield Object(mt.a)({ fs: Mt, gitdir: p, author: Lt, committer: jt });
            if (!ee) throw new pt.a("committer");
            return yield Kn({ fs: Mt, cache: St, http: v, onProgress: y, onMessage: o, onAuth: g, onAuthSuccess: b, onAuthFailure: l, dir: j, gitdir: p, ref: q, url: J, remote: et, remoteRef: Q, fastForward: gt, fastForwardOnly: _t, corsProxy: Pt, singleBranch: Ot, headers: It, author: Lt, committer: ee, signingKey: Ct, prune: ht, pruneTags: ft });
          } catch (Mt) {
            throw Mt.caller = "git.pull", Mt;
          }
        })).apply(this, arguments);
      }
      var bf = t(128), wr = t(115), _f = t(112), kf = t(101), Zo = t(94), jf = t(58), xf = t(77), Of = t(141), Ef = t(39), Pf = t(142), Sf = t(130), Rf = t(129);
      function Ko(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Jo(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Ko(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Ko(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Af(r) {
        return Xo.apply(this, arguments);
      }
      function Xo() {
        return (Xo = Jo(function* ({ fs: r, cache: v, http: y, onProgress: o, onMessage: g, onAuth: b, onAuthSuccess: l, onAuthFailure: j, onPrePush: p, gitdir: q, ref: J, remoteRef: et, remote: Q, url: ht, force: ft = !1, delete: gt = !1, corsProxy: _t, headers: Pt = {} }) {
          const Ot = J || (yield Object(Ie.a)({ fs: r, gitdir: q }));
          if (Ot === void 0) throw new Te.a("ref");
          const It = yield $.a.get({ fs: r, gitdir: q });
          Q = Q || (yield It.get(`branch.${Ot}.pushRemote`)) || (yield It.get("remote.pushDefault")) || (yield It.get(`branch.${Ot}.remote`)) || "origin";
          const $t = ht || (yield It.get(`remote.${Q}.pushurl`)) || (yield It.get(`remote.${Q}.url`));
          if ($t === void 0) throw new Te.a("remote OR url");
          const jt = et || (yield It.get(`branch.${Ot}.merge`));
          if ($t === void 0) throw new Te.a("remoteRef");
          _t === void 0 && (_t = yield It.get("http.corsProxy"));
          const Ct = yield vt.a.expand({ fs: r, gitdir: q, ref: Ot }), St = gt ? "0000000000000000000000000000000000000000" : yield vt.a.resolve({ fs: r, gitdir: q, ref: Ct }), Mt = pr.a.getRemoteHelperFor({ url: $t }), Lt = yield Mt.discover({ http: y, onAuth: b, onAuthSuccess: l, onAuthFailure: j, corsProxy: _t, service: "git-receive-pack", url: $t, headers: Pt, protocolVersion: 1 }), ee = Lt.auth;
          let ie;
          if (jt) try {
            ie = yield vt.a.expandAgainstMap({ ref: jt, map: Lt.refs });
          } catch (ne) {
            if (!(ne instanceof z.a)) throw ne;
            ie = jt.startsWith("refs/") ? jt : `refs/heads/${jt}`;
          }
          else ie = Ct;
          const we = Lt.refs.get(ie) || "0000000000000000000000000000000000000000";
          if (p && !(yield p({ remote: Q, url: $t, localRef: { ref: gt ? "(delete)" : Ct, oid: St }, remoteRef: { ref: ie, oid: we } })))
            throw new jf.a();
          const Se = !Lt.capabilities.has("no-thin");
          let je = /* @__PURE__ */ new Set();
          if (!gt) {
            const ne = [...Lt.refs.values()];
            let Ae = /* @__PURE__ */ new Set();
            if (we !== "0000000000000000000000000000000000000000") {
              const Qt = yield dr({ fs: r, cache: v, gitdir: q, oids: [St, we] });
              for (const jr of Qt) ne.push(jr);
              Se && (Ae = yield Object(wr.a)({ fs: r, cache: v, gitdir: q, oids: Qt }));
            }
            if (!ne.includes(St)) {
              const Qt = yield Object(bf.a)({ fs: r, cache: v, gitdir: q, start: [St], finish: ne });
              je = yield Object(wr.a)({ fs: r, cache: v, gitdir: q, oids: Qt });
            }
            if (Se) {
              try {
                const Qt = yield vt.a.resolve({ fs: r, gitdir: q, ref: `refs/remotes/${Q}/HEAD`, depth: 2 }), { oid: jr } = yield vt.a.resolveAgainstMap({ ref: Qt.replace(`refs/remotes/${Q}/`, ""), fullref: Qt, map: Lt.refs }), Sl = [jr];
                for (const Rl of yield Object(wr.a)({ fs: r, cache: v, gitdir: q, oids: Sl })) Ae.add(Rl);
              } catch {
              }
              for (const Qt of Ae) je.delete(Qt);
            }
            if (St === we && (ft = !0), !ft) {
              if (Ct.startsWith("refs/tags") && we !== "0000000000000000000000000000000000000000") throw new Zo.a("tag-exists");
              if (St !== "0000000000000000000000000000000000000000" && we !== "0000000000000000000000000000000000000000" && !(yield Ui({ fs: r, cache: v, gitdir: q, oid: St, ancestor: we, depth: -1 }))) throw new Zo.a("not-fast-forward");
            }
          }
          const Qe = Object(Of.a)([...Lt.capabilities], ["report-status", "side-band-64k", `agent=${mr.a.agent}`]), xl = yield Object(Rf.a)({ capabilities: Qe, triplets: [{ oldoid: we, oid: St, fullRef: ie }] }), Ol = gt ? [] : yield Object(_f.a)({ fs: r, cache: v, gitdir: q, oids: [...je] }), kr = yield Mt.connect({ http: y, onProgress: o, corsProxy: _t, service: "git-receive-pack", url: $t, auth: ee, headers: Pt, body: [...xl, ...Ol] }), { packfile: El, progress: Pl } = yield xf.a.demux(kr.body);
          if (g) {
            const ne = Object(Pf.a)(Pl);
            Object(Ef.a)(ne, function() {
              var Ae = Jo(function* (Qt) {
                yield g(Qt);
              });
              return function(Qt) {
                return Ae.apply(this, arguments);
              };
            }());
          }
          const Re = yield Object(Sf.a)(El);
          if (kr.headers && (Re.headers = kr.headers), Q && Re.ok && Re.refs[ie].ok && !Ct.startsWith("refs/tags")) {
            const ne = `refs/remotes/${Q}/${ie.replace("refs/heads", "")}`;
            gt ? yield vt.a.deleteRef({ fs: r, gitdir: q, ref: ne }) : yield vt.a.writeRef({ fs: r, gitdir: q, ref: ne, value: St });
          }
          if (Re.ok && Object.values(Re.refs).every((ne) => ne.ok)) return Re;
          {
            const ne = Object.entries(Re.refs).filter(([Ae, Qt]) => !Qt.ok).map(([Ae, Qt]) => `
  - ${Ae}: ${Qt.error}`).join("");
            throw new kf.a(ne, Re);
          }
        })).apply(this, arguments);
      }
      function Qo(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Bf(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Qo(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Qo(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function ta(r) {
        return ea.apply(this, arguments);
      }
      function ea() {
        return (ea = Bf(function* ({ fs: r, http: v, onProgress: y, onMessage: o, onAuth: g, onAuthSuccess: b, onAuthFailure: l, onPrePush: j, dir: p, gitdir: q = Object(E.join)(p, ".git"), ref: J, remoteRef: et, remote: Q = "origin", url: ht, force: ft = !1, delete: gt = !1, corsProxy: _t, headers: Pt = {}, cache: Ot = {} }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("http", v), Object(f.a)("gitdir", q), yield Af({ fs: new A.a(r), cache: Ot, http: v, onProgress: y, onMessage: o, onAuth: g, onAuthSuccess: b, onAuthFailure: l, onPrePush: j, gitdir: q, ref: J, remoteRef: et, remote: Q, url: ht, force: ft, delete: gt, corsProxy: _t, headers: Pt });
          } catch (It) {
            throw It.caller = "git.push", It;
          }
        })).apply(this, arguments);
      }
      function ra(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function If(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              ra(b, o, g, l, j, "next", p);
            }
            function j(p) {
              ra(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function na(r) {
        return ia.apply(this, arguments);
      }
      function ia() {
        return (ia = If(function* ({ fs: r, cache: v, gitdir: y, oid: o }) {
          const { type: g, object: b } = yield Object(Dt.a)({ fs: r, cache: v, gitdir: y, oid: o });
          if (g === "tag") return na({ fs: r, cache: v, gitdir: y, oid: o = Zt.a.from(b).parse().object });
          if (g !== "blob") throw new Ke.a(o, g, "blob");
          return { oid: o, blob: new Uint8Array(b) };
        })).apply(this, arguments);
      }
      function oa(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Tf(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              oa(b, o, g, l, j, "next", p);
            }
            function j(p) {
              oa(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function aa(r) {
        return sa.apply(this, arguments);
      }
      function sa() {
        return (sa = Tf(function* ({ fs: r, cache: v, gitdir: y, oid: o, filepath: g }) {
          return g !== void 0 && (o = yield Object(nr.a)({ fs: r, cache: v, gitdir: y, oid: o, filepath: g })), yield na({ fs: r, cache: v, gitdir: y, oid: o });
        })).apply(this, arguments);
      }
      function ua(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function $f(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              ua(b, o, g, l, j, "next", p);
            }
            function j(p) {
              ua(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function ca(r) {
        return fa.apply(this, arguments);
      }
      function fa() {
        return (fa = $f(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), oid: o, filepath: g, cache: b = {} }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("oid", o), yield aa({ fs: new A.a(r), cache: b, gitdir: y, oid: o, filepath: g });
          } catch (l) {
            throw l.caller = "git.readBlob", l;
          }
        })).apply(this, arguments);
      }
      function la(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Cf(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              la(b, o, g, l, j, "next", p);
            }
            function j(p) {
              la(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function vr(r) {
        return ha.apply(this, arguments);
      }
      function ha() {
        return (ha = Cf(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), oid: o, cache: g = {} }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("oid", o), yield Object(Xe.a)({ fs: new A.a(r), cache: g, gitdir: y, oid: o });
          } catch (b) {
            throw b.caller = "git.readCommit", b;
          }
        })).apply(this, arguments);
      }
      function da(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Df(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              da(b, o, g, l, j, "next", p);
            }
            function j(p) {
              da(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Mf(r) {
        return pa.apply(this, arguments);
      }
      function pa() {
        return (pa = Df(function* ({ fs: r, cache: v, gitdir: y, ref: o = "refs/notes/commits", oid: g }) {
          const b = yield vt.a.resolve({ gitdir: y, fs: r, ref: o }), { blob: l } = yield aa({ fs: r, cache: v, gitdir: y, oid: b, filepath: g });
          return l;
        })).apply(this, arguments);
      }
      function ga(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Nf(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              ga(b, o, g, l, j, "next", p);
            }
            function j(p) {
              ga(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function ma(r) {
        return ya.apply(this, arguments);
      }
      function ya() {
        return (ya = Nf(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), ref: o = "refs/notes/commits", oid: g, cache: b = {} }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("ref", o), Object(f.a)("oid", g), yield Mf({ fs: new A.a(r), cache: b, gitdir: y, ref: o, oid: g });
          } catch (l) {
            throw l.caller = "git.readNote", l;
          }
        })).apply(this, arguments);
      }
      function wa(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Uf(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              wa(b, o, g, l, j, "next", p);
            }
            function j(p) {
              wa(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function va(r) {
        return ba.apply(this, arguments);
      }
      function ba() {
        return (ba = Uf(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), oid: o, format: g = "parsed", filepath: b, encoding: l, cache: j = {} }) {
          try {
            Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("oid", o);
            const p = new A.a(r);
            b !== void 0 && (o = yield Object(nr.a)({ fs: p, cache: j, gitdir: y, oid: o, filepath: b }));
            const q = g === "parsed" ? "content" : g, J = yield Object(Dt.a)({ fs: p, cache: j, gitdir: y, oid: o, format: q });
            if (J.oid = o, g === "parsed") switch (J.format = "parsed", J.type) {
              case "commit":
                J.object = rr.a.from(J.object).parse();
                break;
              case "tree":
                J.object = yr.a.from(J.object).entries();
                break;
              case "blob":
                l ? J.object = J.object.toString(l) : (J.object = new Uint8Array(J.object), J.format = "content");
                break;
              case "tag":
                J.object = Zt.a.from(J.object).parse();
                break;
              default:
                throw new Ke.a(J.oid, J.type, "blob|commit|tag|tree");
            }
            else J.format !== "deflated" && J.format !== "wrapped" || (J.type = J.format);
            return J;
          } catch (p) {
            throw p.caller = "git.readObject", p;
          }
        })).apply(this, arguments);
      }
      function _a(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Ff(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              _a(b, o, g, l, j, "next", p);
            }
            function j(p) {
              _a(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function zf(r) {
        return ka.apply(this, arguments);
      }
      function ka() {
        return (ka = Ff(function* ({ fs: r, cache: v, gitdir: y, oid: o }) {
          const { type: g, object: b } = yield Object(Dt.a)({ fs: r, cache: v, gitdir: y, oid: o, format: "content" });
          if (g !== "tag") throw new Ke.a(o, g, "tag");
          const l = Zt.a.from(b);
          return { oid: o, tag: l.parse(), payload: l.payload() };
        })).apply(this, arguments);
      }
      function ja(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Lf(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              ja(b, o, g, l, j, "next", p);
            }
            function j(p) {
              ja(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function xa(r) {
        return Oa.apply(this, arguments);
      }
      function Oa() {
        return (Oa = Lf(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), oid: o, cache: g = {} }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("oid", o), yield zf({ fs: new A.a(r), cache: g, gitdir: y, oid: o });
          } catch (b) {
            throw b.caller = "git.readTag", b;
          }
        })).apply(this, arguments);
      }
      function Ea(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function qf(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Ea(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Ea(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Pa(r) {
        return Sa.apply(this, arguments);
      }
      function Sa() {
        return (Sa = qf(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), oid: o, filepath: g, cache: b = {} }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("oid", o), yield Object(Je.a)({ fs: new A.a(r), cache: b, gitdir: y, oid: o, filepath: g });
          } catch (l) {
            throw l.caller = "git.readTree", l;
          }
        })).apply(this, arguments);
      }
      function Ra(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Aa(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Ra(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Ra(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Ba(r) {
        return Ia.apply(this, arguments);
      }
      function Ia() {
        return (Ia = Aa(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), filepath: o, cache: g = {} }) {
          try {
            Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("filepath", o), yield s.a.acquire({ fs: new A.a(r), gitdir: y, cache: g }, function() {
              var b = Aa(function* (l) {
                l.delete({ filepath: o });
              });
              return function(l) {
                return b.apply(this, arguments);
              };
            }());
          } catch (b) {
            throw b.caller = "git.remove", b;
          }
        })).apply(this, arguments);
      }
      var ir = t(89);
      function Ta(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Hf(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Ta(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Ta(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Wf(r) {
        return $a.apply(this, arguments);
      }
      function $a() {
        return ($a = Hf(function* ({ fs: r, cache: v, onSign: y, gitdir: o, ref: g = "refs/notes/commits", oid: b, author: l, committer: j, signingKey: p }) {
          let q;
          try {
            q = yield vt.a.resolve({ gitdir: o, fs: r, ref: g });
          } catch (Q) {
            if (!(Q instanceof z.a)) throw Q;
          }
          let J = (yield Object(Je.a)({ fs: r, gitdir: o, oid: q || "4b825dc642cb6eb9a060e54bf8d69288fbee4904" })).tree;
          J = J.filter((Q) => Q.path !== b);
          const et = yield Object(ir.a)({ fs: r, gitdir: o, tree: J });
          return yield Object(hr.a)({ fs: r, cache: v, onSign: y, gitdir: o, ref: g, tree: et, parent: q && [q], message: `Note removed by 'isomorphic-git removeNote'
`, author: l, committer: j, signingKey: p });
        })).apply(this, arguments);
      }
      function Ca(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Gf(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Ca(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Ca(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Da(r) {
        return Ma.apply(this, arguments);
      }
      function Ma() {
        return (Ma = Gf(function* ({ fs: r, onSign: v, dir: y, gitdir: o = Object(E.join)(y, ".git"), ref: g = "refs/notes/commits", oid: b, author: l, committer: j, signingKey: p, cache: q = {} }) {
          try {
            Object(f.a)("fs", r), Object(f.a)("gitdir", o), Object(f.a)("oid", b);
            const J = new A.a(r), et = yield Object(st.a)({ fs: J, gitdir: o, author: l });
            if (!et) throw new pt.a("author");
            const Q = yield Object(mt.a)({ fs: J, gitdir: o, author: et, committer: j });
            if (!Q) throw new pt.a("committer");
            return yield Wf({ fs: J, cache: q, onSign: v, gitdir: o, ref: g, oid: b, author: et, committer: Q, signingKey: p });
          } catch (J) {
            throw J.caller = "git.removeNote", J;
          }
        })).apply(this, arguments);
      }
      function Na(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Yf(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Na(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Na(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Vf(r) {
        return Ua.apply(this, arguments);
      }
      function Ua() {
        return (Ua = Yf(function* ({ fs: r, gitdir: v, oldref: y, ref: o, checkout: g = !1 }) {
          if (o !== K.a.clean(o)) throw new rt.a(o, K.a.clean(o));
          if (y !== K.a.clean(y)) throw new rt.a(y, K.a.clean(y));
          const b = `refs/heads/${y}`, l = `refs/heads/${o}`;
          if (yield vt.a.exists({ fs: r, gitdir: v, ref: l })) throw new X.a("branch", o, !1);
          const j = yield vt.a.resolve({ fs: r, gitdir: v, ref: b, depth: 1 });
          yield vt.a.writeRef({ fs: r, gitdir: v, ref: l, value: j }), yield vt.a.deleteRef({ fs: r, gitdir: v, ref: b });
          const p = yield Object(Ie.a)({ fs: r, gitdir: v, fullname: !0 });
          (g || p === b) && (yield vt.a.writeSymbolicRef({ fs: r, gitdir: v, ref: "HEAD", value: l }));
        })).apply(this, arguments);
      }
      function Fa(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Zf(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Fa(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Fa(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function za(r) {
        return La.apply(this, arguments);
      }
      function La() {
        return (La = Zf(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), ref: o, oldref: g, checkout: b = !1 }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("ref", o), Object(f.a)("oldref", g), yield Vf({ fs: new A.a(r), gitdir: y, ref: o, oldref: g, checkout: b });
          } catch (l) {
            throw l.caller = "git.renameBranch", l;
          }
        })).apply(this, arguments);
      }
      var Kf = t(25), Jf = t(19);
      function qa(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Xf(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              qa(b, o, g, l, j, "next", p);
            }
            function j(p) {
              qa(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Ha(r) {
        return Wa.apply(this, arguments);
      }
      function Wa() {
        return (Wa = Xf(function* ({ gitdir: r, type: v, object: y }) {
          return Object(Jf.a)(Kf.a.wrap({ type: v, object: y }));
        })).apply(this, arguments);
      }
      function Ga(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Ya(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Ga(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Ga(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Va(r) {
        return Za.apply(this, arguments);
      }
      function Za() {
        return (Za = Ya(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), filepath: o, ref: g, cache: b = {} }) {
          try {
            Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("filepath", o);
            const l = new A.a(r);
            let j, p;
            try {
              j = yield vt.a.resolve({ fs: l, gitdir: y, ref: g || "HEAD" });
            } catch (et) {
              if (g) throw et;
            }
            if (j) try {
              j = yield Object(nr.a)({ fs: l, cache: b, gitdir: y, oid: j, filepath: o });
            } catch {
              j = null;
            }
            let q = { ctime: /* @__PURE__ */ new Date(0), mtime: /* @__PURE__ */ new Date(0), dev: 0, ino: 0, mode: 0, uid: 0, gid: 0, size: 0 };
            const J = v && (yield l.read(Object(E.join)(v, o)));
            J && (p = yield Ha({ gitdir: y, type: "blob", object: J }), j === p && (q = yield l.lstat(Object(E.join)(v, o)))), yield s.a.acquire({ fs: l, gitdir: y, cache: b }, function() {
              var et = Ya(function* (Q) {
                Q.delete({ filepath: o }), j && Q.insert({ filepath: o, stats: q, oid: j });
              });
              return function(Q) {
                return et.apply(this, arguments);
              };
            }());
          } catch (l) {
            throw l.caller = "git.reset", l;
          }
        })).apply(this, arguments);
      }
      function Ka(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Qf(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Ka(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Ka(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Ja(r) {
        return Xa.apply(this, arguments);
      }
      function Xa() {
        return (Xa = Qf(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), ref: o, depth: g }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("ref", o), yield vt.a.resolve({ fs: new A.a(r), gitdir: y, ref: o, depth: g });
          } catch (b) {
            throw b.caller = "git.resolveRef", b;
          }
        })).apply(this, arguments);
      }
      function Qa(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function tl(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Qa(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Qa(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function ts(r) {
        return es.apply(this, arguments);
      }
      function es() {
        return (es = tl(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), path: o, value: g, append: b = !1 }) {
          try {
            Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("path", o);
            const l = new A.a(r), j = yield $.a.get({ fs: l, gitdir: y });
            b ? yield j.append(o, g) : yield j.set(o, g), yield $.a.save({ fs: l, gitdir: y, config: j });
          } catch (l) {
            throw l.caller = "git.setConfig", l;
          }
        })).apply(this, arguments);
      }
      function rs(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function el(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              rs(b, o, g, l, j, "next", p);
            }
            function j(p) {
              rs(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function ns(r) {
        return is.apply(this, arguments);
      }
      function is() {
        return (is = el(function* ({ fs: r, gitdir: v, commit: y }) {
          const o = rr.a.from(y).toObject();
          return yield Object(nt.a)({ fs: r, gitdir: v, type: "commit", object: o, format: "content" });
        })).apply(this, arguments);
      }
      class or {
        static get timezoneOffsetForRefLogEntry() {
          const v = (/* @__PURE__ */ new Date()).getTimezoneOffset(), y = Math.abs(Math.floor(v / 60)), o = Math.abs(v % 60).toString().padStart(2, "0");
          return `${v > 0 ? "-" : "+"}${y.toString().padStart(2, "0")}${o}`;
        }
        static createStashReflogEntry(v, y, o) {
          const g = v.name.replace(/\s/g, ""), b = Math.floor(Date.now() / 1e3), l = or.timezoneOffsetForRefLogEntry;
          return `0000000000000000000000000000000000000000 ${y} ${g} ${v.email} ${b} ${l}	${o}
`;
        }
        static getStashReflogEntry(v, y = !1) {
          return v.split(`
`).filter((o) => o).reverse().map((o, g) => y ? `stash@{${g}}: ${o.split("	")[1]}` : o);
        }
      }
      var rl = t(33), nl = t.n(rl), il = t(113);
      function os(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function se(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              os(b, o, g, l, j, "next", p);
            }
            function j(p) {
              os(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      const ol = { stage: O, workdir: d };
      let br;
      function Ne(r, v) {
        return as.apply(this, arguments);
      }
      function as() {
        return (as = se(function* (r, v) {
          return br === void 0 && (br = new nl.a()), br.acquire(r, v);
        })).apply(this, arguments);
      }
      function al(r, v, y, o) {
        return ss.apply(this, arguments);
      }
      function ss() {
        return (ss = se(function* (r, v, y, o, g = null) {
          const b = Object(E.join)(y, o), l = yield r.lstat(b);
          if (!l) throw new z.a(b);
          if (l.isDirectory()) throw new c.a(`${b}: file expected, but found directory`);
          const j = g ? yield Object(il.a)({ fs: r, gitdir: v, oid: g }) : void 0;
          let p = j ? g : void 0;
          return j || (yield Ne({ fs: r, gitdir: v, currentFilepath: b }, se(function* () {
            const q = l.isSymbolicLink() ? yield r.readlink(b).then(ot) : yield r.read(b);
            if (q === null) throw new z.a(b);
            p = yield Object(nt.a)({ fs: r, gitdir: v, type: "blob", object: q });
          }))), p;
        })).apply(this, arguments);
      }
      function sl(r) {
        return us.apply(this, arguments);
      }
      function us() {
        return (us = se(function* ({ fs: r, dir: v, gitdir: y, entries: o }) {
          function g(l) {
            return b.apply(this, arguments);
          }
          function b() {
            return (b = se(function* (l) {
              if (l.type === "tree") {
                if (!l.oid) {
                  const j = yield Promise.all(l.children.map(g));
                  l.oid = yield Object(ir.a)({ fs: r, gitdir: y, tree: j }), l.mode = 16384;
                }
              } else l.type === "blob" && (l.oid = yield al(r, y, v, l.path, l.oid), l.mode = 33188);
              return l.path = l.path.split("/").pop(), l;
            })).apply(this, arguments);
          }
          return Promise.all(o.map(g));
        })).apply(this, arguments);
      }
      function cs(r) {
        return fs.apply(this, arguments);
      }
      function fs() {
        return (fs = se(function* ({ fs: r, dir: v, gitdir: y, treePair: o }) {
          const g = o[1] === "stage", b = o.map((Q) => typeof Q == "string" ? ol[Q]() : Q), l = [], j = function() {
            var Q = se(function* (ht, [ft, gt]) {
              if (ht !== "." && !(yield H.a.isIgnored({ fs: r, dir: v, gitdir: y, filepath: ht }))) return gt ? ((!ft || (yield ft.oid()) !== (yield gt.oid()) && (yield gt.oid()) !== void 0) && l.push([ft, gt]), { mode: yield gt.mode(), path: ht, oid: yield gt.oid(), type: yield gt.type() }) : void 0;
            });
            return function(ht, ft) {
              return Q.apply(this, arguments);
            };
          }(), p = function() {
            var Q = se(function* (ht, ft) {
              return ft = ft.filter(Boolean), ht ? (ht.children = ft, ht) : ft.length > 0 ? ft : void 0;
            });
            return function(ht, ft) {
              return Q.apply(this, arguments);
            };
          }(), q = function() {
            var Q = se(function* (ht, ft) {
              const gt = [];
              for (const _t of ft) {
                const [Pt, Ot] = _t;
                g ? Ot && ((yield r.exists(`${v}/${Ot.toString()}`)) ? gt.push(_t) : l.push([null, Ot])) : Pt && (Ot ? gt.push(_t) : l.push([Pt, null]));
              }
              return gt.length ? Promise.all(gt.map(ht)) : [];
            });
            return function(ht, ft) {
              return Q.apply(this, arguments);
            };
          }(), J = yield Object(S.a)({ fs: r, cache: {}, dir: v, gitdir: y, trees: b, map: j, reduce: p, iterate: q });
          if (l.length === 0 || J.length === 0) return null;
          const et = (yield sl({ fs: r, dir: v, gitdir: y, entries: J })).filter(Boolean).map((Q) => ({ mode: Q.mode, path: Q.path, oid: Q.oid, type: Q.type }));
          return Object(ir.a)({ fs: r, gitdir: y, tree: et });
        })).apply(this, arguments);
      }
      function ul(r) {
        return ls.apply(this, arguments);
      }
      function ls() {
        return (ls = se(function* ({ fs: r, dir: v, gitdir: y, stashCommit: o, parentCommit: g, wasStaged: b }) {
          const l = [], j = [], p = yield Object(S.a)({ fs: r, cache: {}, dir: v, gitdir: y, trees: [Object(m.a)({ ref: g }), Object(m.a)({ ref: o })], map: (q = se(function* (J, [et, Q]) {
            if (J === "." || (yield H.a.isIgnored({ fs: r, dir: v, gitdir: y, filepath: J }))) return;
            const ht = Q ? yield Q.type() : yield et.type();
            if (ht !== "tree" && ht !== "blob") return;
            if (!Q && et) {
              const gt = ht === "tree" ? "rmdir" : "rm";
              return ht === "tree" && l.push(J), ht === "blob" && b && j.push({ filepath: J, oid: yield et.oid() }), { method: gt, filepath: J };
            }
            const ft = yield Q.oid();
            return et && (yield et.oid()) === ft ? void 0 : ht === "tree" ? { method: "mkdir", filepath: J } : (b && j.push({ filepath: J, oid: ft, stats: yield r.lstat(Object(E.join)(v, J)) }), { method: "write", filepath: J, oid: ft });
          }), function(J, et) {
            return q.apply(this, arguments);
          }) });
          var q;
          yield Ne({ fs: r, gitdir: y, dirRemoved: l, ops: p }, se(function* () {
            for (const J of p) {
              const et = Object(E.join)(v, J.filepath);
              switch (J.method) {
                case "rmdir":
                  yield r.rmdir(et);
                  break;
                case "mkdir":
                  yield r.mkdir(et);
                  break;
                case "rm":
                  yield r.rm(et);
                  break;
                case "write":
                  if (!l.some((Q) => et.startsWith(Q))) {
                    const { object: Q } = yield Object(Dt.a)({ fs: r, cache: {}, gitdir: y, oid: J.oid });
                    (yield r.exists(et)) && (yield r.rm(et)), yield r.write(et, Q);
                  }
              }
            }
          })), yield s.a.acquire({ fs: r, gitdir: y, cache: {} }, function() {
            var J = se(function* (et) {
              j.forEach(({ filepath: Q, stats: ht, oid: ft }) => {
                et.insert({ filepath: Q, stats: ht, oid: ft });
              });
            });
            return function(et) {
              return J.apply(this, arguments);
            };
          }());
        })).apply(this, arguments);
      }
      function hs(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Pe(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              hs(b, o, g, l, j, "next", p);
            }
            function j(p) {
              hs(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      class ke {
        constructor({ fs: v, dir: y, gitdir: o = Object(E.join)(y, ".git") }) {
          Object.assign(this, { fs: v, dir: y, gitdir: o, _author: null });
        }
        static get refStash() {
          return "refs/stash";
        }
        static get refLogsStash() {
          return "logs/refs/stash";
        }
        get refStashPath() {
          return Object(E.join)(this.gitdir, ke.refStash);
        }
        get refLogsStashPath() {
          return Object(E.join)(this.gitdir, ke.refLogsStash);
        }
        getAuthor() {
          var v = this;
          return Pe(function* () {
            if (!v._author && (v._author = yield Object(st.a)({ fs: v.fs, gitdir: v.gitdir, author: {} }), !v._author)) throw new pt.a("author");
            return v._author;
          })();
        }
        getStashSHA(v, y) {
          var o = this;
          return Pe(function* () {
            return (yield o.fs.exists(o.refStashPath)) ? (y || (yield o.readStashReflogs({ parsed: !1 })))[v].split(" ")[1] : null;
          })();
        }
        writeStashCommit({ message: v, tree: y, parent: o }) {
          var g = this;
          return Pe(function* () {
            return ns({ fs: g.fs, gitdir: g.gitdir, commit: { message: v, tree: y, parent: o, author: yield g.getAuthor(), committer: yield g.getAuthor() } });
          })();
        }
        readStashCommit(v) {
          var y = this;
          return Pe(function* () {
            const o = yield y.readStashReflogs({ parsed: !1 });
            if (v !== 0 && (v < 0 || v > o.length - 1)) throw new rt.a(`stash@${v}`, "number that is in range of [0, num of stash pushed]");
            const g = yield y.getStashSHA(v, o);
            return g ? Object(Xe.a)({ fs: y.fs, cache: {}, gitdir: y.gitdir, oid: g }) : {};
          })();
        }
        writeStashRef(v) {
          var y = this;
          return Pe(function* () {
            return vt.a.writeRef({ fs: y.fs, gitdir: y.gitdir, ref: ke.refStash, value: v });
          })();
        }
        writeStashReflogEntry({ stashCommit: v, message: y }) {
          var o = this;
          return Pe(function* () {
            const g = yield o.getAuthor(), b = or.createStashReflogEntry(g, v, y), l = o.refLogsStashPath;
            yield Ne({ filepath: l, entry: b }, Pe(function* () {
              const j = (yield o.fs.exists(l)) ? yield o.fs.read(l, "utf8") : "";
              yield o.fs.write(l, j + b, "utf8");
            }));
          })();
        }
        readStashReflogs({ parsed: v = !1 }) {
          var y = this;
          return Pe(function* () {
            if (!(yield y.fs.exists(y.refLogsStashPath))) return [];
            const o = (yield y.fs.read(y.refLogsStashPath)).toString();
            return or.getStashReflogEntry(o, v);
          })();
        }
      }
      function ds(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function ye(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              ds(b, o, g, l, j, "next", p);
            }
            function j(p) {
              ds(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function cl(r) {
        return ps.apply(this, arguments);
      }
      function ps() {
        return (ps = ye(function* ({ fs: r, dir: v, gitdir: y, message: o = "" }) {
          const g = new ke({ fs: r, dir: v, gitdir: y });
          yield g.getAuthor();
          const b = yield Object(Ie.a)({ fs: r, gitdir: y, fullname: !1 }), l = yield vt.a.resolve({ fs: r, gitdir: y, ref: "HEAD" }), j = (yield vr({ fs: r, dir: v, gitdir: y, oid: l })).commit.message, p = [l];
          let q = null, J = Object(m.a)({ ref: "HEAD" });
          const et = yield cs({ fs: r, dir: v, gitdir: y, treePair: [Object(m.a)({ ref: "HEAD" }), "stage"] });
          if (et) {
            const gt = yield g.writeStashCommit({ message: `stash-Index: WIP on ${b} - ${(/* @__PURE__ */ new Date()).toISOString()}`, tree: et, parent: p });
            p.push(gt), q = et, J = O();
          }
          const Q = yield cs({ fs: r, dir: v, gitdir: y, treePair: [J, "workdir"] });
          if (Q) {
            const gt = yield g.writeStashCommit({ message: `stash-WorkDir: WIP on ${b} - ${(/* @__PURE__ */ new Date()).toISOString()}`, tree: Q, parent: [p[p.length - 1]] });
            p.push(gt), q = Q;
          }
          if (!q || !et && !Q) throw new z.a("changes, nothing to stash");
          const ht = (o.trim() || `WIP on ${b}`) + `: ${l.substring(0, 7)} ${j}`, ft = yield g.writeStashCommit({ message: ht, tree: q, parent: p });
          return yield g.writeStashRef(ft), yield g.writeStashReflogEntry({ stashCommit: ft, message: ht }), yield fr({ fs: r, dir: v, gitdir: y, ref: b, track: !1, force: !0 }), ft;
        })).apply(this, arguments);
      }
      function gs(r) {
        return ms.apply(this, arguments);
      }
      function ms() {
        return (ms = ye(function* ({ fs: r, dir: v, gitdir: y, refIdx: o = 0 }) {
          const g = new ke({ fs: r, dir: v, gitdir: y }), b = yield g.readStashCommit(o), { parent: l = null } = b.commit ? b.commit : {};
          if (l && Array.isArray(l)) for (let j = 0; j < l.length - 1; j++) {
            const p = (yield Object(Xe.a)({ fs: r, cache: {}, gitdir: y, oid: l[j + 1] })).commit.message.startsWith("stash-Index");
            yield ul({ fs: r, dir: v, gitdir: y, stashCommit: l[j + 1], parentCommit: l[j], wasStaged: p });
          }
        })).apply(this, arguments);
      }
      function ys(r) {
        return ws.apply(this, arguments);
      }
      function ws() {
        return (ws = ye(function* ({ fs: r, dir: v, gitdir: y, refIdx: o = 0 }) {
          const g = new ke({ fs: r, dir: v, gitdir: y });
          if (!(yield g.readStashCommit(o)).commit) return;
          const b = g.refStashPath;
          yield Ne(b, ye(function* () {
            (yield r.exists(b)) && (yield r.rm(b));
          }));
          const l = yield g.readStashReflogs({ parsed: !1 });
          if (!l.length) return;
          l.splice(o, 1);
          const j = g.refLogsStashPath;
          yield Ne({ reflogEntries: l, stashReflogPath: j, stashMgr: g }, ye(function* () {
            if (l.length) {
              yield r.write(j, l.join(`
`), "utf8");
              const p = l[l.length - 1].split(" ")[1];
              yield g.writeStashRef(p);
            } else yield r.rm(j);
          }));
        })).apply(this, arguments);
      }
      function fl(r) {
        return vs.apply(this, arguments);
      }
      function vs() {
        return (vs = ye(function* ({ fs: r, dir: v, gitdir: y }) {
          return new ke({ fs: r, dir: v, gitdir: y }).readStashReflogs({ parsed: !0 });
        })).apply(this, arguments);
      }
      function ll(r) {
        return bs.apply(this, arguments);
      }
      function bs() {
        return (bs = ye(function* ({ fs: r, dir: v, gitdir: y }) {
          const o = new ke({ fs: r, dir: v, gitdir: y }), g = [o.refStashPath, o.refLogsStashPath];
          yield Ne(g, ye(function* () {
            yield Promise.all(g.map(function() {
              var b = ye(function* (l) {
                if (yield r.exists(l)) return r.rm(l);
              });
              return function(l) {
                return b.apply(this, arguments);
              };
            }()));
          }));
        })).apply(this, arguments);
      }
      function hl(r) {
        return _s.apply(this, arguments);
      }
      function _s() {
        return (_s = ye(function* ({ fs: r, dir: v, gitdir: y, refIdx: o = 0 }) {
          yield gs({ fs: r, dir: v, gitdir: y, refIdx: o }), yield ys({ fs: r, dir: v, gitdir: y, refIdx: o });
        })).apply(this, arguments);
      }
      function ks(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function js(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              ks(b, o, g, l, j, "next", p);
            }
            function j(p) {
              ks(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function xs(r) {
        return Os.apply(this, arguments);
      }
      function Os() {
        return (Os = js(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), op: o = "push", message: g = "", refIdx: b = 0 }) {
          Object(f.a)("fs", r), Object(f.a)("dir", v), Object(f.a)("gitdir", y), Object(f.a)("op", o);
          const l = { push: cl, apply: gs, drop: ys, list: fl, clear: ll, pop: hl }, j = ["apply", "drop", "pop"];
          try {
            const p = new A.a(r);
            ["refs", "logs", "logs/refs"].map((J) => Object(E.join)(y, J)).forEach(function() {
              var J = js(function* (et) {
                (yield p.exists(et)) || (yield p.mkdir(et));
              });
              return function(et) {
                return J.apply(this, arguments);
              };
            }());
            const q = l[o];
            if (q) {
              if (j.includes(o) && b < 0) throw new rt.a(`stash@${b}`, "number that is in range of [0, num of stash pushed]");
              return yield q({ fs: p, dir: v, gitdir: y, message: g, refIdx: b });
            }
            throw new Error(`To be implemented: ${o}`);
          } catch (p) {
            throw p.caller = "git.stash", p;
          }
        })).apply(this, arguments);
      }
      var dl = t(69);
      function Es(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Ue(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Es(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Es(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Ps(r) {
        return Ss.apply(this, arguments);
      }
      function Ss() {
        return (Ss = Ue(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), filepath: o, cache: g = {} }) {
          try {
            Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("filepath", o);
            const b = new A.a(r);
            if (yield H.a.isIgnored({ fs: b, gitdir: y, dir: v, filepath: o })) return "ignored";
            const l = yield pl({ fs: b, cache: g, gitdir: y }), j = yield Rs({ fs: b, cache: g, gitdir: y, tree: l, path: o }), p = yield s.a.acquire({ fs: b, gitdir: y, cache: g }, function() {
              var ft = Ue(function* (gt) {
                for (const _t of gt) if (_t.path === o) return _t;
                return null;
              });
              return function(gt) {
                return ft.apply(this, arguments);
              };
            }()), q = yield b.lstat(Object(E.join)(v, o)), J = j !== null, et = p !== null, Q = q !== null, ht = function() {
              var ft = Ue(function* () {
                if (et && !Object(dl.a)(p, q)) return p.oid;
                {
                  const gt = yield b.read(Object(E.join)(v, o)), _t = yield Ha({ gitdir: y, type: "blob", object: gt });
                  return et && p.oid === _t && q.size !== -1 && s.a.acquire({ fs: b, gitdir: y, cache: g }, function() {
                    var Pt = Ue(function* (Ot) {
                      Ot.insert({ filepath: o, stats: q, oid: _t });
                    });
                    return function(Ot) {
                      return Pt.apply(this, arguments);
                    };
                  }()), _t;
                }
              });
              return function() {
                return ft.apply(this, arguments);
              };
            }();
            if (!J && !Q && !et) return "absent";
            if (!J && !Q && et) return "*absent";
            if (!J && Q && !et) return "*added";
            if (!J && Q && et)
              return (yield ht()) === p.oid ? "added" : "*added";
            if (J && !Q && !et) return "deleted";
            if (J && !Q && et) return p.oid, "*deleted";
            if (J && Q && !et)
              return (yield ht()) === j ? "*undeleted" : "*undeletemodified";
            if (J && Q && et) {
              const ft = yield ht();
              return ft === j ? ft === p.oid ? "unmodified" : "*unmodified" : ft === p.oid ? "modified" : "*modified";
            }
          } catch (b) {
            throw b.caller = "git.status", b;
          }
        })).apply(this, arguments);
      }
      function Rs(r) {
        return As.apply(this, arguments);
      }
      function As() {
        return (As = Ue(function* ({ fs: r, cache: v, gitdir: y, tree: o, path: g }) {
          typeof g == "string" && (g = g.split("/"));
          const b = g.shift();
          for (const l of o) if (l.path === b) {
            if (g.length === 0) return l.oid;
            const { type: j, object: p } = yield Object(Dt.a)({ fs: r, cache: v, gitdir: y, oid: l.oid });
            if (j === "tree")
              return Rs({ fs: r, cache: v, gitdir: y, tree: yr.a.from(p), path: g });
            if (j === "blob") throw new Ke.a(l.oid, j, "blob", g.join("/"));
          }
          return null;
        })).apply(this, arguments);
      }
      function pl(r) {
        return Bs.apply(this, arguments);
      }
      function Bs() {
        return (Bs = Ue(function* ({ fs: r, cache: v, gitdir: y }) {
          let o;
          try {
            o = yield vt.a.resolve({ fs: r, gitdir: y, ref: "HEAD" });
          } catch (b) {
            if (b instanceof z.a) return [];
          }
          const { tree: g } = yield Object(Je.a)({ fs: r, cache: v, gitdir: y, oid: o });
          return g;
        })).apply(this, arguments);
      }
      function Is(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function Ts(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Is(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Is(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function $s(r) {
        return Cs.apply(this, arguments);
      }
      function Cs() {
        return (Cs = Ts(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), ref: o = "HEAD", filepaths: g = ["."], filter: b, cache: l = {}, ignored: j = !1 }) {
          try {
            Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("ref", o);
            const q = new A.a(r);
            return yield Object(S.a)({ fs: q, cache: l, dir: v, gitdir: y, trees: [Object(m.a)({ ref: o }), d(), O()], map: (p = Ts(function* (J, [et, Q, ht]) {
              if (!et && !ht && Q && !j && (yield H.a.isIgnored({ fs: q, dir: v, filepath: J })) || !g.some((St) => Jt(J, St))) return null;
              if (b && !b(J)) return;
              const [ft, gt, _t] = yield Promise.all([et && et.type(), Q && Q.type(), ht && ht.type()]), Pt = [ft, gt, _t].includes("blob");
              if ((ft === "tree" || ft === "special") && !Pt) return;
              if (ft === "commit") return null;
              if ((gt === "tree" || gt === "special") && !Pt) return;
              if (_t === "commit") return null;
              if ((_t === "tree" || _t === "special") && !Pt) return;
              const Ot = ft === "blob" ? yield et.oid() : void 0, It = _t === "blob" ? yield ht.oid() : void 0;
              let $t;
              ft !== "blob" && gt === "blob" && _t !== "blob" ? $t = "42" : gt === "blob" && ($t = yield Q.oid());
              const jt = [void 0, Ot, $t, It], Ct = jt.map((St) => jt.indexOf(St));
              return Ct.shift(), [J, ...Ct];
            }), function(J, et) {
              return p.apply(this, arguments);
            }) });
          } catch (q) {
            throw q.caller = "git.statusMatrix", q;
          }
          var p;
        })).apply(this, arguments);
      }
      function Ds(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function gl(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Ds(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Ds(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Ms(r) {
        return Ns.apply(this, arguments);
      }
      function Ns() {
        return (Ns = gl(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), ref: o, object: g, force: b = !1 }) {
          try {
            Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("ref", o);
            const l = new A.a(r);
            if (o === void 0) throw new Te.a("ref");
            o = o.startsWith("refs/tags/") ? o : `refs/tags/${o}`;
            const j = yield vt.a.resolve({ fs: l, gitdir: y, ref: g || "HEAD" });
            if (!b && (yield vt.a.exists({ fs: l, gitdir: y, ref: o }))) throw new X.a("tag", o);
            yield vt.a.writeRef({ fs: l, gitdir: y, ref: o, value: j });
          } catch (l) {
            throw l.caller = "git.tag", l;
          }
        })).apply(this, arguments);
      }
      var Us = t(60);
      function Fs(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function _r(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Fs(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Fs(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function zs(r) {
        return Ls.apply(this, arguments);
      }
      function Ls() {
        return (Ls = _r(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), cache: o = {}, filepath: g, oid: b, mode: l, add: j, remove: p, force: q }) {
          try {
            Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("filepath", g);
            const J = new A.a(r);
            if (p) return yield s.a.acquire({ fs: J, gitdir: y, cache: o }, function() {
              var Q = _r(function* (ht) {
                let ft;
                if (q || (ft = yield J.lstat(Object(E.join)(v, g)), !ft)) ht.has({ filepath: g }) && ht.delete({ filepath: g });
                else if (ft.isDirectory()) throw new Us.a("directory");
              });
              return function(ht) {
                return Q.apply(this, arguments);
              };
            }());
            let et;
            if (!b) {
              if (et = yield J.lstat(Object(E.join)(v, g)), !et) throw new z.a(`file at "${g}" on disk and "remove" not set`);
              if (et.isDirectory()) throw new Us.a("directory");
            }
            return yield s.a.acquire({ fs: J, gitdir: y, cache: o }, function() {
              var Q = _r(function* (ht) {
                if (!j && !ht.has({ filepath: g })) throw new z.a(`file at "${g}" in index and "add" not set`);
                let ft = { ctime: /* @__PURE__ */ new Date(0), mtime: /* @__PURE__ */ new Date(0), dev: 0, ino: 0, mode: l, uid: 0, gid: 0, size: 0 };
                if (!b) {
                  ft = et;
                  const gt = ft.isSymbolicLink() ? yield J.readlink(Object(E.join)(v, g)) : yield J.read(Object(E.join)(v, g));
                  b = yield Object(nt.a)({ fs: J, gitdir: y, type: "blob", format: "content", object: gt });
                }
                return ht.insert({ filepath: g, oid: b, stats: ft }), b;
              });
              return function(ht) {
                return Q.apply(this, arguments);
              };
            }());
          } catch (J) {
            throw J.caller = "git.updateIndex", J;
          }
        })).apply(this, arguments);
      }
      function qs() {
        try {
          return mr.a.version;
        } catch (r) {
          throw r.caller = "git.version", r;
        }
      }
      function Hs(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function ml(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Hs(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Hs(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Ws(r) {
        return Gs.apply(this, arguments);
      }
      function Gs() {
        return (Gs = ml(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), trees: o, map: g, reduce: b, iterate: l, cache: j = {} }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("trees", o), yield Object(S.a)({ fs: new A.a(r), cache: j, dir: v, gitdir: y, trees: o, map: g, reduce: b, iterate: l });
          } catch (p) {
            throw p.caller = "git.walk", p;
          }
        })).apply(this, arguments);
      }
      function Ys(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function yl(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Ys(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Ys(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Vs(r) {
        return Zs.apply(this, arguments);
      }
      function Zs() {
        return (Zs = yl(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), blob: o }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("blob", o), yield Object(nt.a)({ fs: new A.a(r), gitdir: y, type: "blob", object: o, format: "content" });
          } catch (g) {
            throw g.caller = "git.writeBlob", g;
          }
        })).apply(this, arguments);
      }
      function Ks(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function wl(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              Ks(b, o, g, l, j, "next", p);
            }
            function j(p) {
              Ks(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function Js(r) {
        return Xs.apply(this, arguments);
      }
      function Xs() {
        return (Xs = wl(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), commit: o }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("commit", o), yield ns({ fs: new A.a(r), gitdir: y, commit: o });
          } catch (g) {
            throw g.caller = "git.writeCommit", g;
          }
        })).apply(this, arguments);
      }
      var Qs = t(160);
      function tu(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function vl(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              tu(b, o, g, l, j, "next", p);
            }
            function j(p) {
              tu(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function eu(r) {
        return ru.apply(this, arguments);
      }
      function ru() {
        return (ru = vl(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), ref: o, value: g, force: b = !1, symbolic: l = !1 }) {
          try {
            Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("ref", o), Object(f.a)("value", g);
            const j = new A.a(r);
            if (o !== K.a.clean(o)) throw new rt.a(o, K.a.clean(o));
            if (!b && (yield vt.a.exists({ fs: j, gitdir: y, ref: o }))) throw new X.a("ref", o);
            l ? yield vt.a.writeSymbolicRef({ fs: j, gitdir: y, ref: o, value: g }) : (g = yield vt.a.resolve({ fs: j, gitdir: y, ref: g }), yield vt.a.writeRef({ fs: j, gitdir: y, ref: o, value: g }));
          } catch (j) {
            throw j.caller = "git.writeRef", j;
          }
        })).apply(this, arguments);
      }
      function nu(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function bl(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              nu(b, o, g, l, j, "next", p);
            }
            function j(p) {
              nu(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function _l(r) {
        return iu.apply(this, arguments);
      }
      function iu() {
        return (iu = bl(function* ({ fs: r, gitdir: v, tag: y }) {
          const o = Zt.a.from(y).toObject();
          return yield Object(nt.a)({ fs: r, gitdir: v, type: "tag", object: o, format: "content" });
        })).apply(this, arguments);
      }
      function ou(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function kl(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              ou(b, o, g, l, j, "next", p);
            }
            function j(p) {
              ou(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function au(r) {
        return su.apply(this, arguments);
      }
      function su() {
        return (su = kl(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), tag: o }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("tag", o), yield _l({ fs: new A.a(r), gitdir: y, tag: o });
          } catch (g) {
            throw g.caller = "git.writeTag", g;
          }
        })).apply(this, arguments);
      }
      function uu(r, v, y, o, g, b, l) {
        try {
          var j = r[b](l), p = j.value;
        } catch (q) {
          return void y(q);
        }
        j.done ? v(p) : Promise.resolve(p).then(o, g);
      }
      function jl(r) {
        return function() {
          var v = this, y = arguments;
          return new Promise(function(o, g) {
            var b = r.apply(v, y);
            function l(p) {
              uu(b, o, g, l, j, "next", p);
            }
            function j(p) {
              uu(b, o, g, l, j, "throw", p);
            }
            l(void 0);
          });
        };
      }
      function cu(r) {
        return fu.apply(this, arguments);
      }
      function fu() {
        return (fu = jl(function* ({ fs: r, dir: v, gitdir: y = Object(E.join)(v, ".git"), tree: o }) {
          try {
            return Object(f.a)("fs", r), Object(f.a)("gitdir", y), Object(f.a)("tree", o), yield Object(ir.a)({ fs: new A.a(r), gitdir: y, tree: o });
          } catch (g) {
            throw g.caller = "git.writeTree", g;
          }
        })).apply(this, arguments);
      }
      var lu = t(93);
      t.d(h, "Errors", function() {
        return lu;
      }), t.d(h, "STAGE", function() {
        return O;
      }), t.d(h, "TREE", function() {
        return m.a;
      }), t.d(h, "WORKDIR", function() {
        return d;
      }), t.d(h, "abortMerge", function() {
        return M;
      }), t.d(h, "add", function() {
        return lt;
      }), t.d(h, "addNote", function() {
        return C;
      }), t.d(h, "addRemote", function() {
        return Vt;
      }), t.d(h, "annotatedTag", function() {
        return B;
      }), t.d(h, "branch", function() {
        return Ft;
      }), t.d(h, "checkout", function() {
        return fr;
      }), t.d(h, "clone", function() {
        return on;
      }), t.d(h, "commit", function() {
        return un;
      }), t.d(h, "getConfig", function() {
        return pi;
      }), t.d(h, "getConfigAll", function() {
        return vi;
      }), t.d(h, "setConfig", function() {
        return ts;
      }), t.d(h, "currentBranch", function() {
        return ln;
      }), t.d(h, "deleteBranch", function() {
        return mn;
      }), t.d(h, "deleteRef", function() {
        return vn;
      }), t.d(h, "deleteRemote", function() {
        return xn;
      }), t.d(h, "deleteTag", function() {
        return Rn;
      }), t.d(h, "expandOid", function() {
        return Nn;
      }), t.d(h, "expandRef", function() {
        return zn;
      }), t.d(h, "fastForward", function() {
        return Qn;
      }), t.d(h, "fetch", function() {
        return ri;
      }), t.d(h, "findMergeBase", function() {
        return oi;
      }), t.d(h, "findRoot", function() {
        return li;
      }), t.d(h, "getRemoteInfo", function() {
        return ki;
      }), t.d(h, "getRemoteInfo2", function() {
        return Ei;
      }), t.d(h, "hashBlob", function() {
        return Si.a;
      }), t.d(h, "indexPack", function() {
        return Ii;
      }), t.d(h, "init", function() {
        return Ci;
      }), t.d(h, "isDescendent", function() {
        return Li;
      }), t.d(h, "isIgnored", function() {
        return Wi;
      }), t.d(h, "listBranches", function() {
        return Vi;
      }), t.d(h, "listFiles", function() {
        return eo;
      }), t.d(h, "listNotes", function() {
        return ao;
      }), t.d(h, "listRefs", function() {
        return co;
      }), t.d(h, "listRemotes", function() {
        return mo;
      }), t.d(h, "listServerRefs", function() {
        return xo;
      }), t.d(h, "listTags", function() {
        return Po;
      }), t.d(h, "log", function() {
        return No;
      }), t.d(h, "merge", function() {
        return zo;
      }), t.d(h, "packObjects", function() {
        return Ho;
      }), t.d(h, "pull", function() {
        return Yo;
      }), t.d(h, "push", function() {
        return ta;
      }), t.d(h, "readBlob", function() {
        return ca;
      }), t.d(h, "readCommit", function() {
        return vr;
      }), t.d(h, "readNote", function() {
        return ma;
      }), t.d(h, "readObject", function() {
        return va;
      }), t.d(h, "readTag", function() {
        return xa;
      }), t.d(h, "readTree", function() {
        return Pa;
      }), t.d(h, "remove", function() {
        return Ba;
      }), t.d(h, "removeNote", function() {
        return Da;
      }), t.d(h, "renameBranch", function() {
        return za;
      }), t.d(h, "resetIndex", function() {
        return Va;
      }), t.d(h, "updateIndex", function() {
        return zs;
      }), t.d(h, "resolveRef", function() {
        return Ja;
      }), t.d(h, "status", function() {
        return Ps;
      }), t.d(h, "statusMatrix", function() {
        return $s;
      }), t.d(h, "tag", function() {
        return Ms;
      }), t.d(h, "version", function() {
        return qs;
      }), t.d(h, "walk", function() {
        return Ws;
      }), t.d(h, "writeBlob", function() {
        return Vs;
      }), t.d(h, "writeCommit", function() {
        return Js;
      }), t.d(h, "writeObject", function() {
        return Qs.a;
      }), t.d(h, "writeRef", function() {
        return eu;
      }), t.d(h, "writeTag", function() {
        return au;
      }), t.d(h, "writeTree", function() {
        return cu;
      }), t.d(h, "stash", function() {
        return xs;
      }), h.default = { Errors: lu, STAGE: O, TREE: m.a, WORKDIR: d, add: lt, abortMerge: M, addNote: C, addRemote: Vt, annotatedTag: B, branch: Ft, checkout: fr, clone: on, commit: un, getConfig: pi, getConfigAll: vi, setConfig: ts, currentBranch: ln, deleteBranch: mn, deleteRef: vn, deleteRemote: xn, deleteTag: Rn, expandOid: Nn, expandRef: zn, fastForward: Qn, fetch: ri, findMergeBase: oi, findRoot: li, getRemoteInfo: ki, getRemoteInfo2: Ei, hashBlob: Si.a, indexPack: Ii, init: Ci, isDescendent: Li, isIgnored: Wi, listBranches: Vi, listFiles: eo, listNotes: ao, listRefs: co, listRemotes: mo, listServerRefs: xo, listTags: Po, log: No, merge: zo, packObjects: Ho, pull: Yo, push: ta, readBlob: ca, readCommit: vr, readNote: ma, readObject: va, readTag: xa, readTree: Pa, remove: Ba, removeNote: Da, renameBranch: za, resetIndex: Va, updateIndex: zs, resolveRef: Ja, status: Ps, statusMatrix: $s, tag: Ms, version: qs, walk: Ws, writeBlob: Vs, writeCommit: Js, writeObject: Qs.a, writeRef: eu, writeTag: au, writeTree: cu, stash: xs };
    }]);
  });
  (function(N, h) {
    typeof xe == "object" && typeof Le < "u" ? h(xe) : typeof define == "function" && define.amd ? define(["exports"], h) : h((N = N || self).GitHttp = {});
  })(void 0, function(N) {
    async function h(s) {
      const u = [];
      let P = 0;
      for await (const a of s)
        u.push(a), P += a.byteLength;
      const c = new Uint8Array(P);
      let n = 0;
      for (const a of u)
        c.set(a, n), n += a.byteLength;
      return c;
    }
    async function t({ onProgress: s, url: u, method: P = "GET", headers: c = {}, body: n }) {
      try {
        n && (n = await h(n));
        const a = {
          method: P,
          headers: {
            ...c,
            Connection: "keep-alive"
          },
          body: n
        }, i = await fetch(u, a);
        if (!i.ok)
          throw new Error(`HTTP error: ${i.status} ${i.statusText}`);
        const e = i.body?.getReader(), k = e ? {
          async *[Symbol.asyncIterator]() {
            let m = 0;
            for (; ; ) {
              const { done: _, value: d } = await e.read();
              if (_) break;
              m += d.byteLength, s && s(m), yield d;
            }
            e.releaseLock();
          }
        } : [new Uint8Array(await i.arrayBuffer())], O = {};
        for (const [m, _] of i.headers.entries())
          O[m] = _;
        return {
          url: i.url,
          method: i.method,
          statusCode: i.status,
          statusMessage: i.statusText,
          body: k,
          headers: O
        };
      } catch (a) {
        throw console.error("Request failed:", a), a;
      }
    }
    N.default = { request: t }, N.request = t, Object.defineProperty(N, "__esModule", { value: !0 });
  });
  const Bl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null
  }, Symbol.toStringTag, { value: "Module" }));
  (function(N, h) {
    typeof xe == "object" && typeof Le == "object" ? Le.exports = h() : typeof define == "function" && define.amd ? define([], h) : typeof xe == "object" ? xe.LightningFS = h() : N.LightningFS = h();
  })(self, function() {
    return function(N) {
      var h = {};
      function t(s) {
        if (h[s]) return h[s].exports;
        var u = h[s] = { i: s, l: !1, exports: {} };
        return N[s].call(u.exports, u, u.exports, t), u.l = !0, u.exports;
      }
      return t.m = N, t.c = h, t.d = function(s, u, P) {
        t.o(s, u) || Object.defineProperty(s, u, { enumerable: !0, get: P });
      }, t.r = function(s) {
        typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(s, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(s, "__esModule", { value: !0 });
      }, t.t = function(s, u) {
        if (1 & u && (s = t(s)), 8 & u || 4 & u && typeof s == "object" && s && s.__esModule) return s;
        var P = /* @__PURE__ */ Object.create(null);
        if (t.r(P), Object.defineProperty(P, "default", { enumerable: !0, value: s }), 2 & u && typeof s != "string") for (var c in s) t.d(P, c, function(n) {
          return s[n];
        }.bind(null, c));
        return P;
      }, t.n = function(s) {
        var u = s && s.__esModule ? function() {
          return s.default;
        } : function() {
          return s;
        };
        return t.d(u, "a", u), u;
      }, t.o = function(s, u) {
        return Object.prototype.hasOwnProperty.call(s, u);
      }, t.p = "", t(t.s = 3);
    }([function(N, h) {
      function t(c) {
        if (c.length === 0) return ".";
        let n = u(c);
        return n = n.reduce(P, []), s(...n);
      }
      function s(...c) {
        if (c.length === 0) return "";
        let n = c.join("/");
        return n = n.replace(/\/{2,}/g, "/");
      }
      function u(c) {
        if (c.length === 0) return [];
        if (c === "/") return ["/"];
        let n = c.split("/");
        return n[n.length - 1] === "" && n.pop(), c[0] === "/" ? n[0] = "/" : n[0] !== "." && n.unshift("."), n;
      }
      function P(c, n) {
        if (c.length === 0) return c.push(n), c;
        if (n === ".") return c;
        if (n === "..") {
          if (c.length === 1) {
            if (c[0] === "/") throw new Error("Unable to normalize path - traverses above root directory");
            if (c[0] === ".") return c.push(n), c;
          }
          return c[c.length - 1] === ".." ? (c.push(".."), c) : (c.pop(), c);
        }
        return c.push(n), c;
      }
      N.exports = { join: s, normalize: t, split: u, basename: function(c) {
        if (c === "/") throw new Error(`Cannot get basename of "${c}"`);
        const n = c.lastIndexOf("/");
        return n === -1 ? c : c.slice(n + 1);
      }, dirname: function(c) {
        const n = c.lastIndexOf("/");
        if (n === -1) throw new Error(`Cannot get dirname of "${c}"`);
        return n === 0 ? "/" : c.slice(0, n);
      }, resolve: function(...c) {
        let n = "";
        for (let a of c) n = a.startsWith("/") ? a : t(s(n, a));
        return n;
      } };
    }, function(N, h) {
      function t(a) {
        return class extends Error {
          constructor(...i) {
            super(...i), this.code = a, this.message ? this.message = a + ": " + this.message : this.message = a;
          }
        };
      }
      const s = t("EEXIST"), u = t("ENOENT"), P = t("ENOTDIR"), c = t("ENOTEMPTY"), n = t("ETIMEDOUT");
      N.exports = { EEXIST: s, ENOENT: u, ENOTDIR: P, ENOTEMPTY: c, ETIMEDOUT: n };
    }, function(N, h, t) {
      t.r(h), t.d(h, "Store", function() {
        return s;
      }), t.d(h, "get", function() {
        return c;
      }), t.d(h, "set", function() {
        return n;
      }), t.d(h, "update", function() {
        return a;
      }), t.d(h, "del", function() {
        return i;
      }), t.d(h, "clear", function() {
        return e;
      }), t.d(h, "keys", function() {
        return k;
      }), t.d(h, "close", function() {
        return O;
      });
      class s {
        constructor(_ = "keyval-store", d = "keyval") {
          this.storeName = d, this._dbName = _, this._storeName = d, this._init();
        }
        _init() {
          this._dbp || (this._dbp = new Promise((_, d) => {
            const S = indexedDB.open(this._dbName);
            S.onerror = () => d(S.error), S.onsuccess = () => _(S.result), S.onupgradeneeded = () => {
              S.result.createObjectStore(this._storeName);
            };
          }));
        }
        _withIDBStore(_, d) {
          return this._init(), this._dbp.then((S) => new Promise((x, A) => {
            const f = S.transaction(this.storeName, _);
            f.oncomplete = () => x(), f.onabort = f.onerror = () => A(f.error), d(f.objectStore(this.storeName));
          }));
        }
        _close() {
          return this._init(), this._dbp.then((_) => {
            _.close(), this._dbp = void 0;
          });
        }
      }
      let u;
      function P() {
        return u || (u = new s()), u;
      }
      function c(m, _ = P()) {
        let d;
        return _._withIDBStore("readwrite", (S) => {
          d = S.get(m);
        }).then(() => d.result);
      }
      function n(m, _, d = P()) {
        return d._withIDBStore("readwrite", (S) => {
          S.put(_, m);
        });
      }
      function a(m, _, d = P()) {
        return d._withIDBStore("readwrite", (S) => {
          const x = S.get(m);
          x.onsuccess = () => {
            S.put(_(x.result), m);
          };
        });
      }
      function i(m, _ = P()) {
        return _._withIDBStore("readwrite", (d) => {
          d.delete(m);
        });
      }
      function e(m = P()) {
        return m._withIDBStore("readwrite", (_) => {
          _.clear();
        });
      }
      function k(m = P()) {
        const _ = [];
        return m._withIDBStore("readwrite", (d) => {
          (d.openKeyCursor || d.openCursor).call(d).onsuccess = function() {
            this.result && (_.push(this.result.key), this.result.continue());
          };
        }).then(() => _);
      }
      function O(m = P()) {
        return m._close();
      }
    }, function(N, h, t) {
      const s = t(4), u = t(5);
      function P(c, n) {
        return typeof c == "function" && (n = c), [(...a) => n(null, ...a), n = s(n)];
      }
      N.exports = class {
        constructor(...c) {
          this.promises = new u(...c), this.init = this.init.bind(this), this.readFile = this.readFile.bind(this), this.writeFile = this.writeFile.bind(this), this.unlink = this.unlink.bind(this), this.readdir = this.readdir.bind(this), this.mkdir = this.mkdir.bind(this), this.rmdir = this.rmdir.bind(this), this.rename = this.rename.bind(this), this.stat = this.stat.bind(this), this.lstat = this.lstat.bind(this), this.readlink = this.readlink.bind(this), this.symlink = this.symlink.bind(this), this.backFile = this.backFile.bind(this), this.du = this.du.bind(this), this.flush = this.flush.bind(this);
        }
        init(c, n) {
          return this.promises.init(c, n);
        }
        readFile(c, n, a) {
          const [i, e] = P(n, a);
          this.promises.readFile(c, n).then(i).catch(e);
        }
        writeFile(c, n, a, i) {
          const [e, k] = P(a, i);
          this.promises.writeFile(c, n, a).then(e).catch(k);
        }
        unlink(c, n, a) {
          const [i, e] = P(n, a);
          this.promises.unlink(c, n).then(i).catch(e);
        }
        readdir(c, n, a) {
          const [i, e] = P(n, a);
          this.promises.readdir(c, n).then(i).catch(e);
        }
        mkdir(c, n, a) {
          const [i, e] = P(n, a);
          this.promises.mkdir(c, n).then(i).catch(e);
        }
        rmdir(c, n, a) {
          const [i, e] = P(n, a);
          this.promises.rmdir(c, n).then(i).catch(e);
        }
        rename(c, n, a) {
          const [i, e] = P(a);
          this.promises.rename(c, n).then(i).catch(e);
        }
        stat(c, n, a) {
          const [i, e] = P(n, a);
          this.promises.stat(c).then(i).catch(e);
        }
        lstat(c, n, a) {
          const [i, e] = P(n, a);
          this.promises.lstat(c).then(i).catch(e);
        }
        readlink(c, n, a) {
          const [i, e] = P(n, a);
          this.promises.readlink(c).then(i).catch(e);
        }
        symlink(c, n, a) {
          const [i, e] = P(a);
          this.promises.symlink(c, n).then(i).catch(e);
        }
        backFile(c, n, a) {
          const [i, e] = P(n, a);
          this.promises.backFile(c, n).then(i).catch(e);
        }
        du(c, n) {
          const [a, i] = P(n);
          this.promises.du(c).then(a).catch(i);
        }
        flush(c) {
          const [n, a] = P(c);
          this.promises.flush().then(n).catch(a);
        }
      };
    }, function(N, h) {
      N.exports = function(t) {
        var s, u;
        if (typeof t != "function") throw new Error("expected a function but got " + t);
        return function() {
          return s ? u : (s = !0, u = t.apply(this, arguments));
        };
      };
    }, function(N, h, t) {
      const s = t(6), u = t(16), P = t(0);
      function c(i, e, ...k) {
        return e !== void 0 && typeof e != "function" || (e = {}), typeof e == "string" && (e = { encoding: e }), [i = P.normalize(i), e, ...k];
      }
      function n(i, e, k, ...O) {
        return k !== void 0 && typeof k != "function" || (k = {}), typeof k == "string" && (k = { encoding: k }), [i = P.normalize(i), e, k, ...O];
      }
      function a(i, e, ...k) {
        return [P.normalize(i), P.normalize(e), ...k];
      }
      N.exports = class {
        constructor(i, e = {}) {
          this.init = this.init.bind(this), this.readFile = this._wrap(this.readFile, c, !1), this.writeFile = this._wrap(this.writeFile, n, !0), this.unlink = this._wrap(this.unlink, c, !0), this.readdir = this._wrap(this.readdir, c, !1), this.mkdir = this._wrap(this.mkdir, c, !0), this.rmdir = this._wrap(this.rmdir, c, !0), this.rename = this._wrap(this.rename, a, !0), this.stat = this._wrap(this.stat, c, !1), this.lstat = this._wrap(this.lstat, c, !1), this.readlink = this._wrap(this.readlink, c, !1), this.symlink = this._wrap(this.symlink, a, !0), this.backFile = this._wrap(this.backFile, c, !0), this.du = this._wrap(this.du, c, !1), this._deactivationPromise = null, this._deactivationTimeout = null, this._activationPromise = null, this._operations = /* @__PURE__ */ new Set(), i && this.init(i, e);
        }
        async init(...i) {
          return this._initPromiseResolve && await this._initPromise, this._initPromise = this._init(...i), this._initPromise;
        }
        async _init(i, e = {}) {
          await this._gracefulShutdown(), this._activationPromise && await this._deactivate(), this._backend && this._backend.destroy && await this._backend.destroy(), this._backend = e.backend || new s(), this._backend.init && await this._backend.init(i, e), this._initPromiseResolve && (this._initPromiseResolve(), this._initPromiseResolve = null), e.defer || this.stat("/");
        }
        async _gracefulShutdown() {
          this._operations.size > 0 && (this._isShuttingDown = !0, await new Promise((i) => this._gracefulShutdownResolve = i), this._isShuttingDown = !1, this._gracefulShutdownResolve = null);
        }
        _wrap(i, e, k) {
          return async (...O) => {
            O = e(...O);
            let m = { name: i.name, args: O };
            this._operations.add(m);
            try {
              return await this._activate(), await i.apply(this, O);
            } finally {
              this._operations.delete(m), k && this._backend.saveSuperblock(), this._operations.size === 0 && (this._deactivationTimeout || clearTimeout(this._deactivationTimeout), this._deactivationTimeout = setTimeout(this._deactivate.bind(this), 500));
            }
          };
        }
        async _activate() {
          this._initPromise || console.warn(new Error(`Attempted to use LightningFS ${this._name} before it was initialized.`)), await this._initPromise, this._deactivationTimeout && (clearTimeout(this._deactivationTimeout), this._deactivationTimeout = null), this._deactivationPromise && await this._deactivationPromise, this._deactivationPromise = null, this._activationPromise || (this._activationPromise = this._backend.activate ? this._backend.activate() : Promise.resolve()), await this._activationPromise;
        }
        async _deactivate() {
          return this._activationPromise && await this._activationPromise, this._deactivationPromise || (this._deactivationPromise = this._backend.deactivate ? this._backend.deactivate() : Promise.resolve()), this._activationPromise = null, this._gracefulShutdownResolve && this._gracefulShutdownResolve(), this._deactivationPromise;
        }
        async readFile(i, e) {
          return this._backend.readFile(i, e);
        }
        async writeFile(i, e, k) {
          return await this._backend.writeFile(i, e, k), null;
        }
        async unlink(i, e) {
          return await this._backend.unlink(i, e), null;
        }
        async readdir(i, e) {
          return this._backend.readdir(i, e);
        }
        async mkdir(i, e) {
          return await this._backend.mkdir(i, e), null;
        }
        async rmdir(i, e) {
          return await this._backend.rmdir(i, e), null;
        }
        async rename(i, e) {
          return await this._backend.rename(i, e), null;
        }
        async stat(i, e) {
          const k = await this._backend.stat(i, e);
          return new u(k);
        }
        async lstat(i, e) {
          const k = await this._backend.lstat(i, e);
          return new u(k);
        }
        async readlink(i, e) {
          return this._backend.readlink(i, e);
        }
        async symlink(i, e) {
          return await this._backend.symlink(i, e), null;
        }
        async backFile(i, e) {
          return await this._backend.backFile(i, e), null;
        }
        async du(i) {
          return this._backend.du(i);
        }
        async flush() {
          return this._backend.flush();
        }
      };
    }, function(N, h, t) {
      const { encode: s, decode: u } = t(7), P = t(10), c = t(11), { ENOENT: n, ENOTEMPTY: a, ETIMEDOUT: i } = t(1), e = t(12), k = t(13), O = t(14), m = t(15), _ = t(0);
      N.exports = class {
        constructor() {
          this.saveSuperblock = P(() => {
            this.flush();
          }, 500);
        }
        async init(d, { wipe: S, url: x, urlauto: A, fileDbName: f = d, db: E = null, fileStoreName: w = d + "_files", lockDbName: I = d + "_lock", lockStoreName: T = d + "_lock" } = {}) {
          this._name = d, this._idb = E || new e(f, w), this._mutex = navigator.locks ? new m(d) : new O(I, T), this._cache = new c(d), this._opts = { wipe: S, url: x }, this._needsWipe = !!S, x && (this._http = new k(x), this._urlauto = !!A);
        }
        async activate() {
          if (this._cache.activated) return;
          this._needsWipe && (this._needsWipe = !1, await this._idb.wipe(), await this._mutex.release({ force: !0 })), await this._mutex.has() || await this._mutex.wait();
          const d = await this._idb.loadSuperblock();
          if (d) this._cache.activate(d);
          else if (this._http) {
            const S = await this._http.loadSuperblock();
            this._cache.activate(S), await this._saveSuperblock();
          } else this._cache.activate();
          if (!await this._mutex.has()) throw new i();
        }
        async deactivate() {
          await this._mutex.has() && await this._saveSuperblock(), this._cache.deactivate();
          try {
            await this._mutex.release();
          } catch (d) {
            console.log(d);
          }
          await this._idb.close();
        }
        async _saveSuperblock() {
          this._cache.activated && (this._lastSavedAt = Date.now(), await this._idb.saveSuperblock(this._cache._root));
        }
        _writeStat(d, S, x) {
          let A = _.split(_.dirname(d)), f = A.shift();
          for (let E of A) {
            f = _.join(f, E);
            try {
              this._cache.mkdir(f, { mode: 511 });
            } catch {
            }
          }
          return this._cache.writeStat(d, S, x);
        }
        async readFile(d, S) {
          const { encoding: x } = S;
          if (x && x !== "utf8") throw new Error('Only "utf8" encoding is supported in readFile');
          let A = null, f = null;
          try {
            f = this._cache.stat(d), A = await this._idb.readFile(f.ino);
          } catch (E) {
            if (!this._urlauto) throw E;
          }
          if (!A && this._http) {
            let E = this._cache.lstat(d);
            for (; E.type === "symlink"; ) d = _.resolve(_.dirname(d), E.target), E = this._cache.lstat(d);
            A = await this._http.readFile(d);
          }
          if (A && (f && f.size == A.byteLength || (f = await this._writeStat(d, A.byteLength, { mode: f ? f.mode : 438 }), this.saveSuperblock()), x === "utf8" ? A = u(A) : A.toString = () => u(A)), !f) throw new n(d);
          return A;
        }
        async writeFile(d, S, x) {
          const { mode: A, encoding: f = "utf8" } = x;
          if (typeof S == "string") {
            if (f !== "utf8") throw new Error('Only "utf8" encoding is supported in writeFile');
            S = s(S);
          }
          const E = await this._cache.writeStat(d, S.byteLength, { mode: A });
          await this._idb.writeFile(E.ino, S);
        }
        async unlink(d, S) {
          const x = this._cache.lstat(d);
          this._cache.unlink(d), x.type !== "symlink" && await this._idb.unlink(x.ino);
        }
        readdir(d, S) {
          return this._cache.readdir(d);
        }
        mkdir(d, S) {
          const { mode: x = 511 } = S;
          this._cache.mkdir(d, { mode: x });
        }
        rmdir(d, S) {
          if (d === "/") throw new a();
          this._cache.rmdir(d);
        }
        rename(d, S) {
          this._cache.rename(d, S);
        }
        stat(d, S) {
          return this._cache.stat(d);
        }
        lstat(d, S) {
          return this._cache.lstat(d);
        }
        readlink(d, S) {
          return this._cache.readlink(d);
        }
        symlink(d, S) {
          this._cache.symlink(d, S);
        }
        async backFile(d, S) {
          let x = await this._http.sizeFile(d);
          await this._writeStat(d, x, S);
        }
        du(d) {
          return this._cache.du(d);
        }
        flush() {
          return this._saveSuperblock();
        }
      };
    }, function(N, h, t) {
      t(8), N.exports = { encode: (s) => new TextEncoder().encode(s), decode: (s) => new TextDecoder().decode(s) };
    }, function(N, h, t) {
      (function(s) {
        (function(u) {
          function P(n) {
            if ((n = n === void 0 ? "utf-8" : n) !== "utf-8") throw new RangeError("Failed to construct 'TextEncoder': The encoding label provided ('" + n + "') is invalid.");
          }
          function c(n, a) {
            if (a = a === void 0 ? { fatal: !1 } : a, (n = n === void 0 ? "utf-8" : n) !== "utf-8") throw new RangeError("Failed to construct 'TextDecoder': The encoding label provided ('" + n + "') is invalid.");
            if (a.fatal) throw Error("Failed to construct 'TextDecoder': the 'fatal' option is unsupported.");
          }
          if (u.TextEncoder && u.TextDecoder) return !1;
          Object.defineProperty(P.prototype, "encoding", { value: "utf-8" }), P.prototype.encode = function(n, a) {
            if ((a = a === void 0 ? { stream: !1 } : a).stream) throw Error("Failed to encode: the 'stream' option is unsupported.");
            a = 0;
            for (var i = n.length, e = 0, k = Math.max(32, i + (i >> 1) + 7), O = new Uint8Array(k >> 3 << 3); a < i; ) {
              var m = n.charCodeAt(a++);
              if (55296 <= m && 56319 >= m) {
                if (a < i) {
                  var _ = n.charCodeAt(a);
                  (64512 & _) == 56320 && (++a, m = ((1023 & m) << 10) + (1023 & _) + 65536);
                }
                if (55296 <= m && 56319 >= m) continue;
              }
              if (e + 4 > O.length && (k += 8, k = (k *= 1 + a / n.length * 2) >> 3 << 3, (_ = new Uint8Array(k)).set(O), O = _), (4294967168 & m) == 0) O[e++] = m;
              else {
                if ((4294965248 & m) == 0) O[e++] = m >> 6 & 31 | 192;
                else if ((4294901760 & m) == 0) O[e++] = m >> 12 & 15 | 224, O[e++] = m >> 6 & 63 | 128;
                else {
                  if ((4292870144 & m) != 0) continue;
                  O[e++] = m >> 18 & 7 | 240, O[e++] = m >> 12 & 63 | 128, O[e++] = m >> 6 & 63 | 128;
                }
                O[e++] = 63 & m | 128;
              }
            }
            return O.slice(0, e);
          }, Object.defineProperty(c.prototype, "encoding", { value: "utf-8" }), Object.defineProperty(c.prototype, "fatal", { value: !1 }), Object.defineProperty(c.prototype, "ignoreBOM", { value: !1 }), c.prototype.decode = function(n, a) {
            if ((a = a === void 0 ? { stream: !1 } : a).stream) throw Error("Failed to decode: the 'stream' option is unsupported.");
            a = 0;
            for (var i = (n = new Uint8Array(n)).length, e = []; a < i; ) {
              var k = n[a++];
              if (k === 0) break;
              if ((128 & k) == 0) e.push(k);
              else if ((224 & k) == 192) {
                var O = 63 & n[a++];
                e.push((31 & k) << 6 | O);
              } else if ((240 & k) == 224) {
                O = 63 & n[a++];
                var m = 63 & n[a++];
                e.push((31 & k) << 12 | O << 6 | m);
              } else (248 & k) == 240 && (65535 < (k = (7 & k) << 18 | (O = 63 & n[a++]) << 12 | (m = 63 & n[a++]) << 6 | 63 & n[a++]) && (k -= 65536, e.push(k >>> 10 & 1023 | 55296), k = 56320 | 1023 & k), e.push(k));
            }
            return String.fromCharCode.apply(null, e);
          }, u.TextEncoder = P, u.TextDecoder = c;
        })(typeof window < "u" ? window : s !== void 0 ? s : this);
      }).call(this, t(9));
    }, function(N, h) {
      var t;
      t = /* @__PURE__ */ function() {
        return this;
      }();
      try {
        t = t || new Function("return this")();
      } catch {
        typeof window == "object" && (t = window);
      }
      N.exports = t;
    }, function(N, h) {
      N.exports = function(t, s, u) {
        var P;
        return function() {
          if (!s) return t.apply(this, arguments);
          var c = this, n = arguments, a = u && !P;
          return clearTimeout(P), P = setTimeout(function() {
            if (P = null, !a) return t.apply(c, n);
          }, s), a ? t.apply(this, arguments) : void 0;
        };
      };
    }, function(N, h, t) {
      const s = t(0), { EEXIST: u, ENOENT: P, ENOTDIR: c, ENOTEMPTY: n } = t(1), a = 0;
      N.exports = class {
        constructor() {
        }
        _makeRoot(i = /* @__PURE__ */ new Map()) {
          return i.set(a, { mode: 511, type: "dir", size: 0, ino: 0, mtimeMs: Date.now() }), i;
        }
        activate(i = null) {
          this._root = i === null ? /* @__PURE__ */ new Map([["/", this._makeRoot()]]) : typeof i == "string" ? /* @__PURE__ */ new Map([["/", this._makeRoot(this.parse(i))]]) : i;
        }
        get activated() {
          return !!this._root;
        }
        deactivate() {
          this._root = void 0;
        }
        size() {
          return this._countInodes(this._root.get("/")) - 1;
        }
        _countInodes(i) {
          let e = 1;
          for (let [k, O] of i) k !== a && (e += this._countInodes(O));
          return e;
        }
        autoinc() {
          return this._maxInode(this._root.get("/")) + 1;
        }
        _maxInode(i) {
          let e = i.get(a).ino;
          for (let [k, O] of i) k !== a && (e = Math.max(e, this._maxInode(O)));
          return e;
        }
        print(i = this._root.get("/")) {
          let e = "";
          const k = (O, m) => {
            for (let [_, d] of O) {
              if (_ === 0) continue;
              let S = d.get(a), x = S.mode.toString(8);
              e += `${"	".repeat(m)}${_}	${x}`, S.type === "file" ? e += `	${S.size}	${S.mtimeMs}
` : (e += `
`, k(d, m + 1));
            }
          };
          return k(i, 0), e;
        }
        parse(i) {
          let e = 0;
          function k(d) {
            const S = ++e, x = d.length === 1 ? "dir" : "file";
            let [A, f, E] = d;
            return A = parseInt(A, 8), f = f ? parseInt(f) : 0, E = E ? parseInt(E) : Date.now(), /* @__PURE__ */ new Map([[a, { mode: A, type: x, size: f, mtimeMs: E, ino: S }]]);
          }
          let O = i.trim().split(`
`), m = this._makeRoot(), _ = [{ indent: -1, node: m }, { indent: 0, node: null }];
          for (let d of O) {
            let S = d.match(/^\t*/)[0].length;
            d = d.slice(S);
            let [x, ...A] = d.split("	"), f = k(A);
            if (S <= _[_.length - 1].indent) for (; S <= _[_.length - 1].indent; ) _.pop();
            _.push({ indent: S, node: f }), _[_.length - 2].node.set(x, f);
          }
          return m;
        }
        _lookup(i, e = !0) {
          let k = this._root, O = "/", m = s.split(i);
          for (let _ = 0; _ < m.length; ++_) {
            let d = m[_];
            if (!(k = k.get(d))) throw new P(i);
            if (e || _ < m.length - 1) {
              const S = k.get(a);
              if (S.type === "symlink") {
                let x = s.resolve(O, S.target);
                k = this._lookup(x);
              }
              O = O ? s.join(O, d) : d;
            }
          }
          return k;
        }
        mkdir(i, { mode: e }) {
          if (i === "/") throw new u();
          let k = this._lookup(s.dirname(i)), O = s.basename(i);
          if (k.has(O)) throw new u();
          let m = /* @__PURE__ */ new Map(), _ = { mode: e, type: "dir", size: 0, mtimeMs: Date.now(), ino: this.autoinc() };
          m.set(a, _), k.set(O, m);
        }
        rmdir(i) {
          let e = this._lookup(i);
          if (e.get(a).type !== "dir") throw new c();
          if (e.size > 1) throw new n();
          let k = this._lookup(s.dirname(i)), O = s.basename(i);
          k.delete(O);
        }
        readdir(i) {
          let e = this._lookup(i);
          if (e.get(a).type !== "dir") throw new c();
          return [...e.keys()].filter((k) => typeof k == "string");
        }
        writeStat(i, e, { mode: k }) {
          let O;
          try {
            let x = this.stat(i);
            k == null && (k = x.mode), O = x.ino;
          } catch {
          }
          k == null && (k = 438), O == null && (O = this.autoinc());
          let m = this._lookup(s.dirname(i)), _ = s.basename(i), d = { mode: k, type: "file", size: e, mtimeMs: Date.now(), ino: O }, S = /* @__PURE__ */ new Map();
          return S.set(a, d), m.set(_, S), d;
        }
        unlink(i) {
          let e = this._lookup(s.dirname(i)), k = s.basename(i);
          e.delete(k);
        }
        rename(i, e) {
          let k = s.basename(e), O = this._lookup(i);
          this._lookup(s.dirname(e)).set(k, O), this.unlink(i);
        }
        stat(i) {
          return this._lookup(i).get(a);
        }
        lstat(i) {
          return this._lookup(i, !1).get(a);
        }
        readlink(i) {
          return this._lookup(i, !1).get(a).target;
        }
        symlink(i, e) {
          let k, O;
          try {
            let x = this.stat(e);
            O === null && (O = x.mode), k = x.ino;
          } catch {
          }
          O == null && (O = 40960), k == null && (k = this.autoinc());
          let m = this._lookup(s.dirname(e)), _ = s.basename(e), d = { mode: O, type: "symlink", target: i, size: 0, mtimeMs: Date.now(), ino: k }, S = /* @__PURE__ */ new Map();
          return S.set(a, d), m.set(_, S), d;
        }
        _du(i) {
          let e = 0;
          for (const [k, O] of i.entries()) e += k === a ? O.size : this._du(O);
          return e;
        }
        du(i) {
          let e = this._lookup(i);
          return this._du(e);
        }
      };
    }, function(N, h, t) {
      const s = t(2);
      N.exports = class {
        constructor(u, P) {
          this._database = u, this._storename = P, this._store = new s.Store(this._database, this._storename);
        }
        saveSuperblock(u) {
          return s.set("!root", u, this._store);
        }
        loadSuperblock() {
          return s.get("!root", this._store);
        }
        readFile(u) {
          return s.get(u, this._store);
        }
        writeFile(u, P) {
          return s.set(u, P, this._store);
        }
        unlink(u) {
          return s.del(u, this._store);
        }
        wipe() {
          return s.clear(this._store);
        }
        close() {
          return s.close(this._store);
        }
      };
    }, function(N, h) {
      N.exports = class {
        constructor(t) {
          this._url = t;
        }
        loadSuperblock() {
          return fetch(this._url + "/.superblock.txt").then((t) => t.ok ? t.text() : null);
        }
        async readFile(t) {
          const s = await fetch(this._url + t);
          if (s.status === 200) return s.arrayBuffer();
          throw new Error("ENOENT");
        }
        async sizeFile(t) {
          const s = await fetch(this._url + t, { method: "HEAD" });
          if (s.status === 200) return s.headers.get("content-length");
          throw new Error("ENOENT");
        }
      };
    }, function(N, h, t) {
      const s = t(2), u = (P) => new Promise((c) => setTimeout(c, P));
      N.exports = class {
        constructor(P, c) {
          this._id = Math.random(), this._database = P, this._storename = c, this._store = new s.Store(this._database, this._storename), this._lock = null;
        }
        async has({ margin: P = 2e3 } = {}) {
          if (this._lock && this._lock.holder === this._id) {
            const c = Date.now();
            return this._lock.expires > c + P || await this.renew();
          }
          return !1;
        }
        async renew({ ttl: P = 5e3 } = {}) {
          let c;
          return await s.update("lock", (n) => {
            const a = Date.now() + P;
            return c = n && n.holder === this._id, this._lock = c ? { holder: this._id, expires: a } : n, this._lock;
          }, this._store), c;
        }
        async acquire({ ttl: P = 5e3 } = {}) {
          let c, n, a;
          if (await s.update("lock", (i) => {
            const e = Date.now(), k = e + P;
            return n = i && i.expires < e, c = i === void 0 || n, a = i && i.holder === this._id, this._lock = c ? { holder: this._id, expires: k } : i, this._lock;
          }, this._store), a) throw new Error("Mutex double-locked");
          return c;
        }
        async wait({ interval: P = 100, limit: c = 6e3, ttl: n } = {}) {
          for (; c--; ) {
            if (await this.acquire({ ttl: n })) return !0;
            await u(P);
          }
          throw new Error("Mutex timeout");
        }
        async release({ force: P = !1 } = {}) {
          let c, n, a;
          if (await s.update("lock", (i) => (c = P || i && i.holder === this._id, n = i === void 0, a = i && i.holder !== this._id, this._lock = c ? void 0 : i, this._lock), this._store), await s.close(this._store), !c && !P) {
            if (n) throw new Error("Mutex double-freed");
            if (a) throw new Error("Mutex lost ownership");
          }
          return c;
        }
      };
    }, function(N, h) {
      N.exports = class {
        constructor(t) {
          this._id = Math.random(), this._database = t, this._has = !1, this._release = null;
        }
        async has() {
          return this._has;
        }
        async acquire() {
          return new Promise((t) => {
            navigator.locks.request(this._database + "_lock", { ifAvailable: !0 }, (s) => (this._has = !!s, t(!!s), new Promise((u) => {
              this._release = u;
            })));
          });
        }
        async wait({ timeout: t = 6e5 } = {}) {
          return new Promise((s, u) => {
            const P = new AbortController();
            setTimeout(() => {
              P.abort(), u(new Error("Mutex timeout"));
            }, t), navigator.locks.request(this._database + "_lock", { signal: P.signal }, (c) => (this._has = !!c, s(!!c), new Promise((n) => {
              this._release = n;
            })));
          });
        }
        async release({ force: t = !1 } = {}) {
          this._has = !1, this._release ? this._release() : t && navigator.locks.request(this._database + "_lock", { steal: !0 }, (s) => !0);
        }
      };
    }, function(N, h) {
      N.exports = class {
        constructor(t) {
          this.type = t.type, this.mode = t.mode, this.size = t.size, this.ino = t.ino, this.mtimeMs = t.mtimeMs, this.ctimeMs = t.ctimeMs || t.mtimeMs, this.uid = 1, this.gid = 1, this.dev = 1;
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
    }]);
  });
  const Il = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null
  }, Symbol.toStringTag, { value: "Module" })), Au = new Lr(qr.logging.memoryBackendAMD);
  function $e(...N) {
    Au.consoleDotLog("[ SWUtils ]", ...N);
  }
  function ar(...N) {
    Au.consoleDotError("[ SWUtils ]", ...N);
  }
  class Tl {
    constructor() {
    }
    async fetchWithServiceWorker(h, t) {
      $e("Starting fetchWithServiceWorker with operation:", h, "and args:", t);
      try {
        const s = new URL("/git", self.location.origin).toString();
        $e("Constructed URL for fetch:", s);
        const u = {
          method: "POST",
          body: JSON.stringify({ operation: h, args: t }),
          headers: { "Content-Type": "application/json" }
        };
        $e("Request options:", u);
        const P = await fetch(s, u);
        $e("Fetch response received:", P);
        let c;
        try {
          c = await P.json(), $e("Parsed JSON response:", c);
        } catch (n) {
          throw ar("Error parsing JSON response:", n), new Error("Response is not valid JSON");
        }
        if (!P.ok) {
          let n = `Fetch failed with status: ${P.status}`;
          switch ($e("Response status is not OK:", P.status), P.status) {
            case 400:
              n = "Bad Request: The server could not understand the request.";
              break;
            case 401:
              n = "Unauthorized: Authentication is required or has failed.";
              break;
            case 403:
              n = "Forbidden: You do not have permission to access this resource.";
              break;
            case 404:
              n = "Not Found: The requested resource could not be found.";
              break;
            case 500:
              n = "Internal Server Error: The server encountered an error.";
              break;
            case 502:
              n = "Bad Gateway: The server received an invalid response from the upstream server.";
              break;
            case 503:
              n = "Service Unavailable: The server is currently unable to handle the request.";
              break;
            case 504:
              n = "Gateway Timeout: The server did not receive a timely response from the upstream server.";
              break;
            default:
              n = `Unexpected status code: ${P.status}`;
          }
          throw ar("Error message based on status code:", n), ar("Response details:", c.details), new Error(JSON.stringify(c.details));
        }
        return $e("Fetch completed successfully with response:", c), c;
      } catch (s) {
        throw ar("Fetch error:", s), s;
      }
    }
    async sendMessageToChannel(h, t = "worker-channel") {
      return new Promise((s) => {
        const u = new BroadcastChannel(t);
        u.onmessage = (P) => {
          P.data.operation === `${h.operation}` && (u.close(), s(P.data));
        }, u.postMessage(h);
      });
    }
  }
  const Bu = new Lr(qr.logging.memoryBackendES6);
  function te(...N) {
    Bu.consoleDotLog("[MemoryBackend ES6]", ...N);
  }
  function tr(...N) {
    Bu.consoleDotError("[MemoryBackend ES6]", ...N);
  }
  function $l() {
    return "tab-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
  }
  te("Loading memoryBackend module");
  class Cl {
    constructor(h = {}, t = "default") {
      this.dbName = t, this.options = h, this.deviceId = h.deviceId || $l(), this._files = /* @__PURE__ */ new Map(), this.versionVector = { [this.deviceId]: 0 }, this.swUtilsInstance = new Tl(), this.channel = null, this.isProcessing = !1, this.pendingUpdates = [], this.processingQueue = !1, this._initializeRoot(), this.options?.supportsServiceWorker && this.options?.useSW && this._setupReceiveChannel(), Promise.resolve().then(() => this._requestInitialSync()), te(`Initialized with dbName: ${this.dbName}, deviceId: ${this.deviceId}`);
    }
    _initializeRoot() {
      this._files.set("/", {
        type: "dir",
        mode: 511,
        size: 0,
        ino: "/",
        mtimeMs: Date.now(),
        ctimeMs: Date.now()
      });
    }
    _incrementVersionVector() {
      this.versionVector[this.deviceId] || (this.versionVector[this.deviceId] = 0), this.versionVector[this.deviceId]++;
    }
    _isNewerVersionVector(h) {
      let t = !1;
      for (const s in h) {
        const u = this.versionVector[s] || 0;
        h[s] > u && (t = !0);
      }
      return t;
    }
    _mergeVersionVector(h) {
      for (const t in h)
        (!this.versionVector[t] || h[t] > this.versionVector[t]) && (this.versionVector[t] = h[t]);
    }
    _requestInitialSync() {
      try {
        const h = new BroadcastChannel(`memory-backend-${this.dbName}`);
        h.postMessage({
          operation: "memorySyncRequest",
          data: {
            dbName: this.dbName,
            requesterVV: this.versionVector,
            requesterId: this.deviceId
          }
        }), h.close(), te("Initial sync request sent");
      } catch (h) {
        tr("Failed to send initial sync request:", h);
      }
    }
    async sendFilesToSW(h = null) {
      const t = {
        operation: "memorySync",
        data: {
          files: Array.from(this._files.entries()),
          dbName: this.dbName,
          versionVector: { ...this.versionVector },
          sender: this.deviceId,
          targetId: h
        }
      };
      if (this.isProcessing) {
        te("Queueing update due to ongoing processing"), this.pendingUpdates.push(t);
        return;
      }
      try {
        this.isProcessing = !0, te("Sending files to SW:", t);
        const s = new BroadcastChannel(`memory-backend-${this.dbName}`);
        s.postMessage(t), s.close(), te("Files sent to SW successfully"), await this._processPendingUpdates();
      } catch (s) {
        tr("Failed to send files to SW:", s);
      } finally {
        this.isProcessing = !1;
      }
    }
    async _processPendingUpdates() {
      if (!(this.processingQueue || this.pendingUpdates.length === 0)) {
        this.processingQueue = !0;
        try {
          for (; this.pendingUpdates.length > 0; ) {
            const h = this.pendingUpdates.shift();
            te("Processing queued update:", h);
            const t = new BroadcastChannel(`memory-backend-${this.dbName}`);
            t.postMessage(h), t.close();
          }
        } catch (h) {
          tr("Error processing queued updates:", h);
        } finally {
          this.processingQueue = !1;
        }
      }
    }
    _setupReceiveChannel() {
      try {
        const h = new BroadcastChannel(`memory-backend-${this.dbName}`);
        te("Listening for updates on:", h.name), this.channel = h, this.channel.onmessage = async (t) => {
          Promise.resolve().then(() => this._handleChannelMessage(t));
        }, this._requestInitialSync();
      } catch (h) {
        tr("BroadcastChannel init failed:", h);
      }
    }
    async _handleChannelMessage(h) {
      const { operation: t, data: s } = h.data || {};
      if (!s?.dbName || s.dbName !== this.dbName) return;
      if (t === "memorySyncRequest") {
        this._isNewerVersionVector(s.requesterVV) ? (te("Responding to sync request with newer data"), Promise.resolve().then(() => this.sendFilesToSW(s.requesterId))) : te("No newer data to send to requester");
        return;
      }
      if (t !== "memorySync") return;
      const u = s.versionVector;
      if (s.sender === this.deviceId) {
        te("Skipping own update");
        return;
      }
      if (s.targetId && s.targetId !== this.deviceId) {
        te("Message not meant for this tab. Ignoring.");
        return;
      }
      if (!this._isNewerVersionVector(u)) {
        te("Skipping received update - not newer than current", this.versionVector, u);
        return;
      }
      try {
        te("Applying update from channel:", s), this._files = new Map(s.files), this._mergeVersionVector(u), te("Memory updated from channel successfully");
      } catch (c) {
        tr("Failed to apply channel message:", c);
      }
    }
    async wipe() {
      te(`Wiping db: ${this.dbName}`), this._files.clear(), this._initializeRoot(), this.versionVector = { [this.deviceId]: 0 }, await this._handleFilesChange();
    }
    async _handleFilesChange() {
      this._incrementVersionVector(), this.options?.supportsServiceWorker && this.options?.useSW && await this.sendFilesToSW();
    }
    async readFile(h, t = {}) {
      if (te("this.files", this._files), !this._files.has(h))
        throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
      const s = this._files.get(h);
      if (s.type !== "file")
        throw Object.assign(new Error("EISDIR"), { code: "EISDIR" });
      return t.encoding === "utf8" ? new TextDecoder().decode(s.data) : s.data;
    }
    async writeFile(h, t, s = {}) {
      const u = typeof t == "string" ? new TextEncoder().encode(t) : t || new Uint8Array();
      this._files.set(h, {
        type: "file",
        mode: s.mode || 438,
        data: u,
        size: u.length,
        ino: h,
        mtimeMs: Date.now(),
        ctimeMs: Date.now()
      }), await this._handleFilesChange();
    }
    async unlink(h) {
      if (!this._files.has(h))
        throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
      this._files.delete(h), await this._handleFilesChange();
    }
    async readdir(h) {
      if (!this._files.has(h))
        throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
      if (this._files.get(h).type !== "dir")
        throw Object.assign(new Error("ENOTDIR"), { code: "ENOTDIR" });
      const s = /* @__PURE__ */ new Set(), u = h === "/" ? "/" : `${h}/`;
      for (const P of this._files.keys())
        if (P.startsWith(u) && P !== h) {
          const c = P.slice(u.length).split("/")[0];
          s.add(c);
        }
      return [...s];
    }
    async stat(h) {
      if (!this._files.has(h))
        throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
      return this._files.get(h);
    }
    async lstat(h) {
      return this.stat(h);
    }
    async mkdir(h) {
      const t = this._getParentDir(h);
      if (t !== "/" && !this._files.has(t))
        throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
      this._files.set(h, {
        type: "dir",
        mode: 511,
        size: 0,
        ino: h,
        mtimeMs: Date.now(),
        ctimeMs: Date.now()
      }), await this._handleFilesChange();
    }
    async rmdir(h) {
      const t = h === "/" ? "/" : h.replace(/\/+$/, "");
      if (!this._files.has(t))
        throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
      if (this._files.get(t).type !== "dir")
        throw Object.assign(new Error("ENOTDIR"), { code: "ENOTDIR" });
      for (const u of this._files.keys())
        if (u.startsWith(`${t}/`))
          throw Object.assign(new Error("ENOTEMPTY"), { code: "ENOTEMPTY" });
      this._files.delete(t), await this._handleFilesChange();
    }
    _getParentDir(h) {
      const t = h.lastIndexOf("/");
      return t <= 0 ? "/" : h.slice(0, t);
    }
    _getBaseName(h) {
      return h.slice(h.lastIndexOf("/") + 1);
    }
    async saveSuperblock() {
    }
    async loadSuperblock() {
    }
  }
  function Dl(N) {
    return N && N.__esModule && Object.prototype.hasOwnProperty.call(N, "default") ? N.default : N;
  }
  function Ml(N) {
    if (Object.prototype.hasOwnProperty.call(N, "__esModule")) return N;
    var h = N.default;
    if (typeof h == "function") {
      var t = function s() {
        return this instanceof s ? Reflect.construct(h, arguments, this.constructor) : h.apply(this, arguments);
      };
      t.prototype = h.prototype;
    } else t = {};
    return Object.defineProperty(t, "__esModule", { value: !0 }), Object.keys(N).forEach(function(s) {
      var u = Object.getOwnPropertyDescriptor(N, s);
      Object.defineProperty(t, s, u.get ? u : {
        enumerable: !0,
        get: function() {
          return N[s];
        }
      });
    }), t;
  }
  var xr, hu;
  function Nl() {
    if (hu) return xr;
    hu = 1, xr = N;
    function N(h) {
      var t, s;
      if (typeof h != "function")
        throw new Error("expected a function but got " + h);
      return function() {
        return t || (t = !0, s = h.apply(this, arguments)), s;
      };
    }
    return xr;
  }
  var Iu = {}, cr = {};
  cr.byteLength = zl;
  cr.toByteArray = ql;
  cr.fromByteArray = Gl;
  var ve = [], he = [], Ul = typeof Uint8Array < "u" ? Uint8Array : Array, Or = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (var Fe = 0, Fl = Or.length; Fe < Fl; ++Fe)
    ve[Fe] = Or[Fe], he[Or.charCodeAt(Fe)] = Fe;
  he[45] = 62;
  he[95] = 63;
  function Tu(N) {
    var h = N.length;
    if (h % 4 > 0)
      throw new Error("Invalid string. Length must be a multiple of 4");
    var t = N.indexOf("=");
    t === -1 && (t = h);
    var s = t === h ? 0 : 4 - t % 4;
    return [t, s];
  }
  function zl(N) {
    var h = Tu(N), t = h[0], s = h[1];
    return (t + s) * 3 / 4 - s;
  }
  function Ll(N, h, t) {
    return (h + t) * 3 / 4 - t;
  }
  function ql(N) {
    var h, t = Tu(N), s = t[0], u = t[1], P = new Ul(Ll(N, s, u)), c = 0, n = u > 0 ? s - 4 : s, a;
    for (a = 0; a < n; a += 4)
      h = he[N.charCodeAt(a)] << 18 | he[N.charCodeAt(a + 1)] << 12 | he[N.charCodeAt(a + 2)] << 6 | he[N.charCodeAt(a + 3)], P[c++] = h >> 16 & 255, P[c++] = h >> 8 & 255, P[c++] = h & 255;
    return u === 2 && (h = he[N.charCodeAt(a)] << 2 | he[N.charCodeAt(a + 1)] >> 4, P[c++] = h & 255), u === 1 && (h = he[N.charCodeAt(a)] << 10 | he[N.charCodeAt(a + 1)] << 4 | he[N.charCodeAt(a + 2)] >> 2, P[c++] = h >> 8 & 255, P[c++] = h & 255), P;
  }
  function Hl(N) {
    return ve[N >> 18 & 63] + ve[N >> 12 & 63] + ve[N >> 6 & 63] + ve[N & 63];
  }
  function Wl(N, h, t) {
    for (var s, u = [], P = h; P < t; P += 3)
      s = (N[P] << 16 & 16711680) + (N[P + 1] << 8 & 65280) + (N[P + 2] & 255), u.push(Hl(s));
    return u.join("");
  }
  function Gl(N) {
    for (var h, t = N.length, s = t % 3, u = [], P = 16383, c = 0, n = t - s; c < n; c += P)
      u.push(Wl(N, c, c + P > n ? n : c + P));
    return s === 1 ? (h = N[t - 1], u.push(
      ve[h >> 2] + ve[h << 4 & 63] + "=="
    )) : s === 2 && (h = (N[t - 2] << 8) + N[t - 1], u.push(
      ve[h >> 10] + ve[h >> 4 & 63] + ve[h << 2 & 63] + "="
    )), u.join("");
  }
  var Hr = {};
  /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
  Hr.read = function(N, h, t, s, u) {
    var P, c, n = u * 8 - s - 1, a = (1 << n) - 1, i = a >> 1, e = -7, k = t ? u - 1 : 0, O = t ? -1 : 1, m = N[h + k];
    for (k += O, P = m & (1 << -e) - 1, m >>= -e, e += n; e > 0; P = P * 256 + N[h + k], k += O, e -= 8)
      ;
    for (c = P & (1 << -e) - 1, P >>= -e, e += s; e > 0; c = c * 256 + N[h + k], k += O, e -= 8)
      ;
    if (P === 0)
      P = 1 - i;
    else {
      if (P === a)
        return c ? NaN : (m ? -1 : 1) * (1 / 0);
      c = c + Math.pow(2, s), P = P - i;
    }
    return (m ? -1 : 1) * c * Math.pow(2, P - s);
  };
  Hr.write = function(N, h, t, s, u, P) {
    var c, n, a, i = P * 8 - u - 1, e = (1 << i) - 1, k = e >> 1, O = u === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, m = s ? 0 : P - 1, _ = s ? 1 : -1, d = h < 0 || h === 0 && 1 / h < 0 ? 1 : 0;
    for (h = Math.abs(h), isNaN(h) || h === 1 / 0 ? (n = isNaN(h) ? 1 : 0, c = e) : (c = Math.floor(Math.log(h) / Math.LN2), h * (a = Math.pow(2, -c)) < 1 && (c--, a *= 2), c + k >= 1 ? h += O / a : h += O * Math.pow(2, 1 - k), h * a >= 2 && (c++, a /= 2), c + k >= e ? (n = 0, c = e) : c + k >= 1 ? (n = (h * a - 1) * Math.pow(2, u), c = c + k) : (n = h * Math.pow(2, k - 1) * Math.pow(2, u), c = 0)); u >= 8; N[t + m] = n & 255, m += _, n /= 256, u -= 8)
      ;
    for (c = c << u | n, i += u; i > 0; N[t + m] = c & 255, m += _, c /= 256, i -= 8)
      ;
    N[t + m - _] |= d * 128;
  };
  /*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   */
  (function(N) {
    const h = cr, t = Hr, s = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
    N.Buffer = e, N.SlowBuffer = w, N.INSPECT_MAX_BYTES = 50;
    const u = 2147483647;
    N.kMaxLength = u;
    const { Uint8Array: P, ArrayBuffer: c, SharedArrayBuffer: n } = globalThis;
    e.TYPED_ARRAY_SUPPORT = a(), !e.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
      "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
    );
    function a() {
      try {
        const W = new P(1), B = { foo: function() {
          return 42;
        } };
        return Object.setPrototypeOf(B, P.prototype), Object.setPrototypeOf(W, B), W.foo() === 42;
      } catch {
        return !1;
      }
    }
    Object.defineProperty(e.prototype, "parent", {
      enumerable: !0,
      get: function() {
        if (e.isBuffer(this))
          return this.buffer;
      }
    }), Object.defineProperty(e.prototype, "offset", {
      enumerable: !0,
      get: function() {
        if (e.isBuffer(this))
          return this.byteOffset;
      }
    });
    function i(W) {
      if (W > u)
        throw new RangeError('The value "' + W + '" is invalid for option "size"');
      const B = new P(W);
      return Object.setPrototypeOf(B, e.prototype), B;
    }
    function e(W, B, D) {
      if (typeof W == "number") {
        if (typeof B == "string")
          throw new TypeError(
            'The "string" argument must be of type string. Received type number'
          );
        return _(W);
      }
      return k(W, B, D);
    }
    e.poolSize = 8192;
    function k(W, B, D) {
      if (typeof W == "string")
        return d(W, B);
      if (c.isView(W))
        return x(W);
      if (W == null)
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof W
        );
      if (qt(W, c) || W && qt(W.buffer, c) || typeof n < "u" && (qt(W, n) || W && qt(W.buffer, n)))
        return A(W, B, D);
      if (typeof W == "number")
        throw new TypeError(
          'The "value" argument must not be of type number. Received type number'
        );
      const Y = W.valueOf && W.valueOf();
      if (Y != null && Y !== W)
        return e.from(Y, B, D);
      const tt = f(W);
      if (tt) return tt;
      if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof W[Symbol.toPrimitive] == "function")
        return e.from(W[Symbol.toPrimitive]("string"), B, D);
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof W
      );
    }
    e.from = function(W, B, D) {
      return k(W, B, D);
    }, Object.setPrototypeOf(e.prototype, P.prototype), Object.setPrototypeOf(e, P);
    function O(W) {
      if (typeof W != "number")
        throw new TypeError('"size" argument must be of type number');
      if (W < 0)
        throw new RangeError('The value "' + W + '" is invalid for option "size"');
    }
    function m(W, B, D) {
      return O(W), W <= 0 ? i(W) : B !== void 0 ? typeof D == "string" ? i(W).fill(B, D) : i(W).fill(B) : i(W);
    }
    e.alloc = function(W, B, D) {
      return m(W, B, D);
    };
    function _(W) {
      return O(W), i(W < 0 ? 0 : E(W) | 0);
    }
    e.allocUnsafe = function(W) {
      return _(W);
    }, e.allocUnsafeSlow = function(W) {
      return _(W);
    };
    function d(W, B) {
      if ((typeof B != "string" || B === "") && (B = "utf8"), !e.isEncoding(B))
        throw new TypeError("Unknown encoding: " + B);
      const D = I(W, B) | 0;
      let Y = i(D);
      const tt = Y.write(W, B);
      return tt !== D && (Y = Y.slice(0, tt)), Y;
    }
    function S(W) {
      const B = W.length < 0 ? 0 : E(W.length) | 0, D = i(B);
      for (let Y = 0; Y < B; Y += 1)
        D[Y] = W[Y] & 255;
      return D;
    }
    function x(W) {
      if (qt(W, P)) {
        const B = new P(W);
        return A(B.buffer, B.byteOffset, B.byteLength);
      }
      return S(W);
    }
    function A(W, B, D) {
      if (B < 0 || W.byteLength < B)
        throw new RangeError('"offset" is outside of buffer bounds');
      if (W.byteLength < B + (D || 0))
        throw new RangeError('"length" is outside of buffer bounds');
      let Y;
      return B === void 0 && D === void 0 ? Y = new P(W) : D === void 0 ? Y = new P(W, B) : Y = new P(W, B, D), Object.setPrototypeOf(Y, e.prototype), Y;
    }
    function f(W) {
      if (e.isBuffer(W)) {
        const B = E(W.length) | 0, D = i(B);
        return D.length === 0 || W.copy(D, 0, 0, B), D;
      }
      if (W.length !== void 0)
        return typeof W.length != "number" || pe(W.length) ? i(0) : S(W);
      if (W.type === "Buffer" && Array.isArray(W.data))
        return S(W.data);
    }
    function E(W) {
      if (W >= u)
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + u.toString(16) + " bytes");
      return W | 0;
    }
    function w(W) {
      return +W != W && (W = 0), e.alloc(+W);
    }
    e.isBuffer = function(B) {
      return B != null && B._isBuffer === !0 && B !== e.prototype;
    }, e.compare = function(B, D) {
      if (qt(B, P) && (B = e.from(B, B.offset, B.byteLength)), qt(D, P) && (D = e.from(D, D.offset, D.byteLength)), !e.isBuffer(B) || !e.isBuffer(D))
        throw new TypeError(
          'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
        );
      if (B === D) return 0;
      let Y = B.length, tt = D.length;
      for (let at = 0, ct = Math.min(Y, tt); at < ct; ++at)
        if (B[at] !== D[at]) {
          Y = B[at], tt = D[at];
          break;
        }
      return Y < tt ? -1 : tt < Y ? 1 : 0;
    }, e.isEncoding = function(B) {
      switch (String(B).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return !0;
        default:
          return !1;
      }
    }, e.concat = function(B, D) {
      if (!Array.isArray(B))
        throw new TypeError('"list" argument must be an Array of Buffers');
      if (B.length === 0)
        return e.alloc(0);
      let Y;
      if (D === void 0)
        for (D = 0, Y = 0; Y < B.length; ++Y)
          D += B[Y].length;
      const tt = e.allocUnsafe(D);
      let at = 0;
      for (Y = 0; Y < B.length; ++Y) {
        let ct = B[Y];
        if (qt(ct, P))
          at + ct.length > tt.length ? (e.isBuffer(ct) || (ct = e.from(ct)), ct.copy(tt, at)) : P.prototype.set.call(
            tt,
            ct,
            at
          );
        else if (e.isBuffer(ct))
          ct.copy(tt, at);
        else
          throw new TypeError('"list" argument must be an Array of Buffers');
        at += ct.length;
      }
      return tt;
    };
    function I(W, B) {
      if (e.isBuffer(W))
        return W.length;
      if (c.isView(W) || qt(W, c))
        return W.byteLength;
      if (typeof W != "string")
        throw new TypeError(
          'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof W
        );
      const D = W.length, Y = arguments.length > 2 && arguments[2] === !0;
      if (!Y && D === 0) return 0;
      let tt = !1;
      for (; ; )
        switch (B) {
          case "ascii":
          case "latin1":
          case "binary":
            return D;
          case "utf8":
          case "utf-8":
            return Vt(W).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return D * 2;
          case "hex":
            return D >>> 1;
          case "base64":
            return Zt(W).length;
          default:
            if (tt)
              return Y ? -1 : Vt(W).length;
            B = ("" + B).toLowerCase(), tt = !0;
        }
    }
    e.byteLength = I;
    function T(W, B, D) {
      let Y = !1;
      if ((B === void 0 || B < 0) && (B = 0), B > this.length || ((D === void 0 || D > this.length) && (D = this.length), D <= 0) || (D >>>= 0, B >>>= 0, D <= B))
        return "";
      for (W || (W = "utf8"); ; )
        switch (W) {
          case "hex":
            return ut(this, B, D);
          case "utf8":
          case "utf-8":
            return it(this, B, D);
          case "ascii":
            return G(this, B, D);
          case "latin1":
          case "binary":
            return Z(this, B, D);
          case "base64":
            return V(this, B, D);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return pt(this, B, D);
          default:
            if (Y) throw new TypeError("Unknown encoding: " + W);
            W = (W + "").toLowerCase(), Y = !0;
        }
    }
    e.prototype._isBuffer = !0;
    function M(W, B, D) {
      const Y = W[B];
      W[B] = W[D], W[D] = Y;
    }
    e.prototype.swap16 = function() {
      const B = this.length;
      if (B % 2 !== 0)
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      for (let D = 0; D < B; D += 2)
        M(this, D, D + 1);
      return this;
    }, e.prototype.swap32 = function() {
      const B = this.length;
      if (B % 4 !== 0)
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      for (let D = 0; D < B; D += 4)
        M(this, D, D + 3), M(this, D + 1, D + 2);
      return this;
    }, e.prototype.swap64 = function() {
      const B = this.length;
      if (B % 8 !== 0)
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      for (let D = 0; D < B; D += 8)
        M(this, D, D + 7), M(this, D + 1, D + 6), M(this, D + 2, D + 5), M(this, D + 3, D + 4);
      return this;
    }, e.prototype.toString = function() {
      const B = this.length;
      return B === 0 ? "" : arguments.length === 0 ? it(this, 0, B) : T.apply(this, arguments);
    }, e.prototype.toLocaleString = e.prototype.toString, e.prototype.equals = function(B) {
      if (!e.isBuffer(B)) throw new TypeError("Argument must be a Buffer");
      return this === B ? !0 : e.compare(this, B) === 0;
    }, e.prototype.inspect = function() {
      let B = "";
      const D = N.INSPECT_MAX_BYTES;
      return B = this.toString("hex", 0, D).replace(/(.{2})/g, "$1 ").trim(), this.length > D && (B += " ... "), "<Buffer " + B + ">";
    }, s && (e.prototype[s] = e.prototype.inspect), e.prototype.compare = function(B, D, Y, tt, at) {
      if (qt(B, P) && (B = e.from(B, B.offset, B.byteLength)), !e.isBuffer(B))
        throw new TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof B
        );
      if (D === void 0 && (D = 0), Y === void 0 && (Y = B ? B.length : 0), tt === void 0 && (tt = 0), at === void 0 && (at = this.length), D < 0 || Y > B.length || tt < 0 || at > this.length)
        throw new RangeError("out of range index");
      if (tt >= at && D >= Y)
        return 0;
      if (tt >= at)
        return -1;
      if (D >= Y)
        return 1;
      if (D >>>= 0, Y >>>= 0, tt >>>= 0, at >>>= 0, this === B) return 0;
      let ct = at - tt, Bt = Y - D;
      const zt = Math.min(ct, Bt), Ft = this.slice(tt, at), Ut = B.slice(D, Y);
      for (let xt = 0; xt < zt; ++xt)
        if (Ft[xt] !== Ut[xt]) {
          ct = Ft[xt], Bt = Ut[xt];
          break;
        }
      return ct < Bt ? -1 : Bt < ct ? 1 : 0;
    };
    function R(W, B, D, Y, tt) {
      if (W.length === 0) return -1;
      if (typeof D == "string" ? (Y = D, D = 0) : D > 2147483647 ? D = 2147483647 : D < -2147483648 && (D = -2147483648), D = +D, pe(D) && (D = tt ? 0 : W.length - 1), D < 0 && (D = W.length + D), D >= W.length) {
        if (tt) return -1;
        D = W.length - 1;
      } else if (D < 0)
        if (tt) D = 0;
        else return -1;
      if (typeof B == "string" && (B = e.from(B, Y)), e.isBuffer(B))
        return B.length === 0 ? -1 : U(W, B, D, Y, tt);
      if (typeof B == "number")
        return B = B & 255, typeof P.prototype.indexOf == "function" ? tt ? P.prototype.indexOf.call(W, B, D) : P.prototype.lastIndexOf.call(W, B, D) : U(W, [B], D, Y, tt);
      throw new TypeError("val must be string, number or Buffer");
    }
    function U(W, B, D, Y, tt) {
      let at = 1, ct = W.length, Bt = B.length;
      if (Y !== void 0 && (Y = String(Y).toLowerCase(), Y === "ucs2" || Y === "ucs-2" || Y === "utf16le" || Y === "utf-16le")) {
        if (W.length < 2 || B.length < 2)
          return -1;
        at = 2, ct /= 2, Bt /= 2, D /= 2;
      }
      function zt(Ut, xt) {
        return at === 1 ? Ut[xt] : Ut.readUInt16BE(xt * at);
      }
      let Ft;
      if (tt) {
        let Ut = -1;
        for (Ft = D; Ft < ct; Ft++)
          if (zt(W, Ft) === zt(B, Ut === -1 ? 0 : Ft - Ut)) {
            if (Ut === -1 && (Ut = Ft), Ft - Ut + 1 === Bt) return Ut * at;
          } else
            Ut !== -1 && (Ft -= Ft - Ut), Ut = -1;
      } else
        for (D + Bt > ct && (D = ct - Bt), Ft = D; Ft >= 0; Ft--) {
          let Ut = !0;
          for (let xt = 0; xt < Bt; xt++)
            if (zt(W, Ft + xt) !== zt(B, xt)) {
              Ut = !1;
              break;
            }
          if (Ut) return Ft;
        }
      return -1;
    }
    e.prototype.includes = function(B, D, Y) {
      return this.indexOf(B, D, Y) !== -1;
    }, e.prototype.indexOf = function(B, D, Y) {
      return R(this, B, D, Y, !0);
    }, e.prototype.lastIndexOf = function(B, D, Y) {
      return R(this, B, D, Y, !1);
    };
    function z(W, B, D, Y) {
      D = Number(D) || 0;
      const tt = W.length - D;
      Y ? (Y = Number(Y), Y > tt && (Y = tt)) : Y = tt;
      const at = B.length;
      Y > at / 2 && (Y = at / 2);
      let ct;
      for (ct = 0; ct < Y; ++ct) {
        const Bt = parseInt(B.substr(ct * 2, 2), 16);
        if (pe(Bt)) return ct;
        W[D + ct] = Bt;
      }
      return ct;
    }
    function $(W, B, D, Y) {
      return Dt(Vt(B, W.length - D), W, D, Y);
    }
    function H(W, B, D, Y) {
      return Dt(re(B), W, D, Y);
    }
    function nt(W, B, D, Y) {
      return Dt(Zt(B), W, D, Y);
    }
    function ot(W, B, D, Y) {
      return Dt(vt(B, W.length - D), W, D, Y);
    }
    e.prototype.write = function(B, D, Y, tt) {
      if (D === void 0)
        tt = "utf8", Y = this.length, D = 0;
      else if (Y === void 0 && typeof D == "string")
        tt = D, Y = this.length, D = 0;
      else if (isFinite(D))
        D = D >>> 0, isFinite(Y) ? (Y = Y >>> 0, tt === void 0 && (tt = "utf8")) : (tt = Y, Y = void 0);
      else
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      const at = this.length - D;
      if ((Y === void 0 || Y > at) && (Y = at), B.length > 0 && (Y < 0 || D < 0) || D > this.length)
        throw new RangeError("Attempt to write outside buffer bounds");
      tt || (tt = "utf8");
      let ct = !1;
      for (; ; )
        switch (tt) {
          case "hex":
            return z(this, B, D, Y);
          case "utf8":
          case "utf-8":
            return $(this, B, D, Y);
          case "ascii":
          case "latin1":
          case "binary":
            return H(this, B, D, Y);
          case "base64":
            return nt(this, B, D, Y);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return ot(this, B, D, Y);
          default:
            if (ct) throw new TypeError("Unknown encoding: " + tt);
            tt = ("" + tt).toLowerCase(), ct = !0;
        }
    }, e.prototype.toJSON = function() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function V(W, B, D) {
      return B === 0 && D === W.length ? h.fromByteArray(W) : h.fromByteArray(W.slice(B, D));
    }
    function it(W, B, D) {
      D = Math.min(W.length, D);
      const Y = [];
      let tt = B;
      for (; tt < D; ) {
        const at = W[tt];
        let ct = null, Bt = at > 239 ? 4 : at > 223 ? 3 : at > 191 ? 2 : 1;
        if (tt + Bt <= D) {
          let zt, Ft, Ut, xt;
          switch (Bt) {
            case 1:
              at < 128 && (ct = at);
              break;
            case 2:
              zt = W[tt + 1], (zt & 192) === 128 && (xt = (at & 31) << 6 | zt & 63, xt > 127 && (ct = xt));
              break;
            case 3:
              zt = W[tt + 1], Ft = W[tt + 2], (zt & 192) === 128 && (Ft & 192) === 128 && (xt = (at & 15) << 12 | (zt & 63) << 6 | Ft & 63, xt > 2047 && (xt < 55296 || xt > 57343) && (ct = xt));
              break;
            case 4:
              zt = W[tt + 1], Ft = W[tt + 2], Ut = W[tt + 3], (zt & 192) === 128 && (Ft & 192) === 128 && (Ut & 192) === 128 && (xt = (at & 15) << 18 | (zt & 63) << 12 | (Ft & 63) << 6 | Ut & 63, xt > 65535 && xt < 1114112 && (ct = xt));
          }
        }
        ct === null ? (ct = 65533, Bt = 1) : ct > 65535 && (ct -= 65536, Y.push(ct >>> 10 & 1023 | 55296), ct = 56320 | ct & 1023), Y.push(ct), tt += Bt;
      }
      return dt(Y);
    }
    const lt = 4096;
    function dt(W) {
      const B = W.length;
      if (B <= lt)
        return String.fromCharCode.apply(String, W);
      let D = "", Y = 0;
      for (; Y < B; )
        D += String.fromCharCode.apply(
          String,
          W.slice(Y, Y += lt)
        );
      return D;
    }
    function G(W, B, D) {
      let Y = "";
      D = Math.min(W.length, D);
      for (let tt = B; tt < D; ++tt)
        Y += String.fromCharCode(W[tt] & 127);
      return Y;
    }
    function Z(W, B, D) {
      let Y = "";
      D = Math.min(W.length, D);
      for (let tt = B; tt < D; ++tt)
        Y += String.fromCharCode(W[tt]);
      return Y;
    }
    function ut(W, B, D) {
      const Y = W.length;
      (!B || B < 0) && (B = 0), (!D || D < 0 || D > Y) && (D = Y);
      let tt = "";
      for (let at = B; at < D; ++at)
        tt += De[W[at]];
      return tt;
    }
    function pt(W, B, D) {
      const Y = W.slice(B, D);
      let tt = "";
      for (let at = 0; at < Y.length - 1; at += 2)
        tt += String.fromCharCode(Y[at] + Y[at + 1] * 256);
      return tt;
    }
    e.prototype.slice = function(B, D) {
      const Y = this.length;
      B = ~~B, D = D === void 0 ? Y : ~~D, B < 0 ? (B += Y, B < 0 && (B = 0)) : B > Y && (B = Y), D < 0 ? (D += Y, D < 0 && (D = 0)) : D > Y && (D = Y), D < B && (D = B);
      const tt = this.subarray(B, D);
      return Object.setPrototypeOf(tt, e.prototype), tt;
    };
    function st(W, B, D) {
      if (W % 1 !== 0 || W < 0) throw new RangeError("offset is not uint");
      if (W + B > D) throw new RangeError("Trying to access beyond buffer length");
    }
    e.prototype.readUintLE = e.prototype.readUIntLE = function(B, D, Y) {
      B = B >>> 0, D = D >>> 0, Y || st(B, D, this.length);
      let tt = this[B], at = 1, ct = 0;
      for (; ++ct < D && (at *= 256); )
        tt += this[B + ct] * at;
      return tt;
    }, e.prototype.readUintBE = e.prototype.readUIntBE = function(B, D, Y) {
      B = B >>> 0, D = D >>> 0, Y || st(B, D, this.length);
      let tt = this[B + --D], at = 1;
      for (; D > 0 && (at *= 256); )
        tt += this[B + --D] * at;
      return tt;
    }, e.prototype.readUint8 = e.prototype.readUInt8 = function(B, D) {
      return B = B >>> 0, D || st(B, 1, this.length), this[B];
    }, e.prototype.readUint16LE = e.prototype.readUInt16LE = function(B, D) {
      return B = B >>> 0, D || st(B, 2, this.length), this[B] | this[B + 1] << 8;
    }, e.prototype.readUint16BE = e.prototype.readUInt16BE = function(B, D) {
      return B = B >>> 0, D || st(B, 2, this.length), this[B] << 8 | this[B + 1];
    }, e.prototype.readUint32LE = e.prototype.readUInt32LE = function(B, D) {
      return B = B >>> 0, D || st(B, 4, this.length), (this[B] | this[B + 1] << 8 | this[B + 2] << 16) + this[B + 3] * 16777216;
    }, e.prototype.readUint32BE = e.prototype.readUInt32BE = function(B, D) {
      return B = B >>> 0, D || st(B, 4, this.length), this[B] * 16777216 + (this[B + 1] << 16 | this[B + 2] << 8 | this[B + 3]);
    }, e.prototype.readBigUInt64LE = oe(function(B) {
      B = B >>> 0, At(B, "offset");
      const D = this[B], Y = this[B + 7];
      (D === void 0 || Y === void 0) && Tt(B, this.length - 8);
      const tt = D + this[++B] * 2 ** 8 + this[++B] * 2 ** 16 + this[++B] * 2 ** 24, at = this[++B] + this[++B] * 2 ** 8 + this[++B] * 2 ** 16 + Y * 2 ** 24;
      return BigInt(tt) + (BigInt(at) << BigInt(32));
    }), e.prototype.readBigUInt64BE = oe(function(B) {
      B = B >>> 0, At(B, "offset");
      const D = this[B], Y = this[B + 7];
      (D === void 0 || Y === void 0) && Tt(B, this.length - 8);
      const tt = D * 2 ** 24 + this[++B] * 2 ** 16 + this[++B] * 2 ** 8 + this[++B], at = this[++B] * 2 ** 24 + this[++B] * 2 ** 16 + this[++B] * 2 ** 8 + Y;
      return (BigInt(tt) << BigInt(32)) + BigInt(at);
    }), e.prototype.readIntLE = function(B, D, Y) {
      B = B >>> 0, D = D >>> 0, Y || st(B, D, this.length);
      let tt = this[B], at = 1, ct = 0;
      for (; ++ct < D && (at *= 256); )
        tt += this[B + ct] * at;
      return at *= 128, tt >= at && (tt -= Math.pow(2, 8 * D)), tt;
    }, e.prototype.readIntBE = function(B, D, Y) {
      B = B >>> 0, D = D >>> 0, Y || st(B, D, this.length);
      let tt = D, at = 1, ct = this[B + --tt];
      for (; tt > 0 && (at *= 256); )
        ct += this[B + --tt] * at;
      return at *= 128, ct >= at && (ct -= Math.pow(2, 8 * D)), ct;
    }, e.prototype.readInt8 = function(B, D) {
      return B = B >>> 0, D || st(B, 1, this.length), this[B] & 128 ? (255 - this[B] + 1) * -1 : this[B];
    }, e.prototype.readInt16LE = function(B, D) {
      B = B >>> 0, D || st(B, 2, this.length);
      const Y = this[B] | this[B + 1] << 8;
      return Y & 32768 ? Y | 4294901760 : Y;
    }, e.prototype.readInt16BE = function(B, D) {
      B = B >>> 0, D || st(B, 2, this.length);
      const Y = this[B + 1] | this[B] << 8;
      return Y & 32768 ? Y | 4294901760 : Y;
    }, e.prototype.readInt32LE = function(B, D) {
      return B = B >>> 0, D || st(B, 4, this.length), this[B] | this[B + 1] << 8 | this[B + 2] << 16 | this[B + 3] << 24;
    }, e.prototype.readInt32BE = function(B, D) {
      return B = B >>> 0, D || st(B, 4, this.length), this[B] << 24 | this[B + 1] << 16 | this[B + 2] << 8 | this[B + 3];
    }, e.prototype.readBigInt64LE = oe(function(B) {
      B = B >>> 0, At(B, "offset");
      const D = this[B], Y = this[B + 7];
      (D === void 0 || Y === void 0) && Tt(B, this.length - 8);
      const tt = this[B + 4] + this[B + 5] * 2 ** 8 + this[B + 6] * 2 ** 16 + (Y << 24);
      return (BigInt(tt) << BigInt(32)) + BigInt(D + this[++B] * 2 ** 8 + this[++B] * 2 ** 16 + this[++B] * 2 ** 24);
    }), e.prototype.readBigInt64BE = oe(function(B) {
      B = B >>> 0, At(B, "offset");
      const D = this[B], Y = this[B + 7];
      (D === void 0 || Y === void 0) && Tt(B, this.length - 8);
      const tt = (D << 24) + // Overflow
      this[++B] * 2 ** 16 + this[++B] * 2 ** 8 + this[++B];
      return (BigInt(tt) << BigInt(32)) + BigInt(this[++B] * 2 ** 24 + this[++B] * 2 ** 16 + this[++B] * 2 ** 8 + Y);
    }), e.prototype.readFloatLE = function(B, D) {
      return B = B >>> 0, D || st(B, 4, this.length), t.read(this, B, !0, 23, 4);
    }, e.prototype.readFloatBE = function(B, D) {
      return B = B >>> 0, D || st(B, 4, this.length), t.read(this, B, !1, 23, 4);
    }, e.prototype.readDoubleLE = function(B, D) {
      return B = B >>> 0, D || st(B, 8, this.length), t.read(this, B, !0, 52, 8);
    }, e.prototype.readDoubleBE = function(B, D) {
      return B = B >>> 0, D || st(B, 8, this.length), t.read(this, B, !1, 52, 8);
    };
    function mt(W, B, D, Y, tt, at) {
      if (!e.isBuffer(W)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (B > tt || B < at) throw new RangeError('"value" argument is out of bounds');
      if (D + Y > W.length) throw new RangeError("Index out of range");
    }
    e.prototype.writeUintLE = e.prototype.writeUIntLE = function(B, D, Y, tt) {
      if (B = +B, D = D >>> 0, Y = Y >>> 0, !tt) {
        const Bt = Math.pow(2, 8 * Y) - 1;
        mt(this, B, D, Y, Bt, 0);
      }
      let at = 1, ct = 0;
      for (this[D] = B & 255; ++ct < Y && (at *= 256); )
        this[D + ct] = B / at & 255;
      return D + Y;
    }, e.prototype.writeUintBE = e.prototype.writeUIntBE = function(B, D, Y, tt) {
      if (B = +B, D = D >>> 0, Y = Y >>> 0, !tt) {
        const Bt = Math.pow(2, 8 * Y) - 1;
        mt(this, B, D, Y, Bt, 0);
      }
      let at = Y - 1, ct = 1;
      for (this[D + at] = B & 255; --at >= 0 && (ct *= 256); )
        this[D + at] = B / ct & 255;
      return D + Y;
    }, e.prototype.writeUint8 = e.prototype.writeUInt8 = function(B, D, Y) {
      return B = +B, D = D >>> 0, Y || mt(this, B, D, 1, 255, 0), this[D] = B & 255, D + 1;
    }, e.prototype.writeUint16LE = e.prototype.writeUInt16LE = function(B, D, Y) {
      return B = +B, D = D >>> 0, Y || mt(this, B, D, 2, 65535, 0), this[D] = B & 255, this[D + 1] = B >>> 8, D + 2;
    }, e.prototype.writeUint16BE = e.prototype.writeUInt16BE = function(B, D, Y) {
      return B = +B, D = D >>> 0, Y || mt(this, B, D, 2, 65535, 0), this[D] = B >>> 8, this[D + 1] = B & 255, D + 2;
    }, e.prototype.writeUint32LE = e.prototype.writeUInt32LE = function(B, D, Y) {
      return B = +B, D = D >>> 0, Y || mt(this, B, D, 4, 4294967295, 0), this[D + 3] = B >>> 24, this[D + 2] = B >>> 16, this[D + 1] = B >>> 8, this[D] = B & 255, D + 4;
    }, e.prototype.writeUint32BE = e.prototype.writeUInt32BE = function(B, D, Y) {
      return B = +B, D = D >>> 0, Y || mt(this, B, D, 4, 4294967295, 0), this[D] = B >>> 24, this[D + 1] = B >>> 16, this[D + 2] = B >>> 8, this[D + 3] = B & 255, D + 4;
    };
    function bt(W, B, D, Y, tt) {
      kt(B, Y, tt, W, D, 7);
      let at = Number(B & BigInt(4294967295));
      W[D++] = at, at = at >> 8, W[D++] = at, at = at >> 8, W[D++] = at, at = at >> 8, W[D++] = at;
      let ct = Number(B >> BigInt(32) & BigInt(4294967295));
      return W[D++] = ct, ct = ct >> 8, W[D++] = ct, ct = ct >> 8, W[D++] = ct, ct = ct >> 8, W[D++] = ct, D;
    }
    function wt(W, B, D, Y, tt) {
      kt(B, Y, tt, W, D, 7);
      let at = Number(B & BigInt(4294967295));
      W[D + 7] = at, at = at >> 8, W[D + 6] = at, at = at >> 8, W[D + 5] = at, at = at >> 8, W[D + 4] = at;
      let ct = Number(B >> BigInt(32) & BigInt(4294967295));
      return W[D + 3] = ct, ct = ct >> 8, W[D + 2] = ct, ct = ct >> 8, W[D + 1] = ct, ct = ct >> 8, W[D] = ct, D + 8;
    }
    e.prototype.writeBigUInt64LE = oe(function(B, D = 0) {
      return bt(this, B, D, BigInt(0), BigInt("0xffffffffffffffff"));
    }), e.prototype.writeBigUInt64BE = oe(function(B, D = 0) {
      return wt(this, B, D, BigInt(0), BigInt("0xffffffffffffffff"));
    }), e.prototype.writeIntLE = function(B, D, Y, tt) {
      if (B = +B, D = D >>> 0, !tt) {
        const zt = Math.pow(2, 8 * Y - 1);
        mt(this, B, D, Y, zt - 1, -zt);
      }
      let at = 0, ct = 1, Bt = 0;
      for (this[D] = B & 255; ++at < Y && (ct *= 256); )
        B < 0 && Bt === 0 && this[D + at - 1] !== 0 && (Bt = 1), this[D + at] = (B / ct >> 0) - Bt & 255;
      return D + Y;
    }, e.prototype.writeIntBE = function(B, D, Y, tt) {
      if (B = +B, D = D >>> 0, !tt) {
        const zt = Math.pow(2, 8 * Y - 1);
        mt(this, B, D, Y, zt - 1, -zt);
      }
      let at = Y - 1, ct = 1, Bt = 0;
      for (this[D + at] = B & 255; --at >= 0 && (ct *= 256); )
        B < 0 && Bt === 0 && this[D + at + 1] !== 0 && (Bt = 1), this[D + at] = (B / ct >> 0) - Bt & 255;
      return D + Y;
    }, e.prototype.writeInt8 = function(B, D, Y) {
      return B = +B, D = D >>> 0, Y || mt(this, B, D, 1, 127, -128), B < 0 && (B = 255 + B + 1), this[D] = B & 255, D + 1;
    }, e.prototype.writeInt16LE = function(B, D, Y) {
      return B = +B, D = D >>> 0, Y || mt(this, B, D, 2, 32767, -32768), this[D] = B & 255, this[D + 1] = B >>> 8, D + 2;
    }, e.prototype.writeInt16BE = function(B, D, Y) {
      return B = +B, D = D >>> 0, Y || mt(this, B, D, 2, 32767, -32768), this[D] = B >>> 8, this[D + 1] = B & 255, D + 2;
    }, e.prototype.writeInt32LE = function(B, D, Y) {
      return B = +B, D = D >>> 0, Y || mt(this, B, D, 4, 2147483647, -2147483648), this[D] = B & 255, this[D + 1] = B >>> 8, this[D + 2] = B >>> 16, this[D + 3] = B >>> 24, D + 4;
    }, e.prototype.writeInt32BE = function(B, D, Y) {
      return B = +B, D = D >>> 0, Y || mt(this, B, D, 4, 2147483647, -2147483648), B < 0 && (B = 4294967295 + B + 1), this[D] = B >>> 24, this[D + 1] = B >>> 16, this[D + 2] = B >>> 8, this[D + 3] = B & 255, D + 4;
    }, e.prototype.writeBigInt64LE = oe(function(B, D = 0) {
      return bt(this, B, D, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    }), e.prototype.writeBigInt64BE = oe(function(B, D = 0) {
      return wt(this, B, D, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    function C(W, B, D, Y, tt, at) {
      if (D + Y > W.length) throw new RangeError("Index out of range");
      if (D < 0) throw new RangeError("Index out of range");
    }
    function F(W, B, D, Y, tt) {
      return B = +B, D = D >>> 0, tt || C(W, B, D, 4), t.write(W, B, D, Y, 23, 4), D + 4;
    }
    e.prototype.writeFloatLE = function(B, D, Y) {
      return F(this, B, D, !0, Y);
    }, e.prototype.writeFloatBE = function(B, D, Y) {
      return F(this, B, D, !1, Y);
    };
    function L(W, B, D, Y, tt) {
      return B = +B, D = D >>> 0, tt || C(W, B, D, 8), t.write(W, B, D, Y, 52, 8), D + 8;
    }
    e.prototype.writeDoubleLE = function(B, D, Y) {
      return L(this, B, D, !0, Y);
    }, e.prototype.writeDoubleBE = function(B, D, Y) {
      return L(this, B, D, !1, Y);
    }, e.prototype.copy = function(B, D, Y, tt) {
      if (!e.isBuffer(B)) throw new TypeError("argument should be a Buffer");
      if (Y || (Y = 0), !tt && tt !== 0 && (tt = this.length), D >= B.length && (D = B.length), D || (D = 0), tt > 0 && tt < Y && (tt = Y), tt === Y || B.length === 0 || this.length === 0) return 0;
      if (D < 0)
        throw new RangeError("targetStart out of bounds");
      if (Y < 0 || Y >= this.length) throw new RangeError("Index out of range");
      if (tt < 0) throw new RangeError("sourceEnd out of bounds");
      tt > this.length && (tt = this.length), B.length - D < tt - Y && (tt = B.length - D + Y);
      const at = tt - Y;
      return this === B && typeof P.prototype.copyWithin == "function" ? this.copyWithin(D, Y, tt) : P.prototype.set.call(
        B,
        this.subarray(Y, tt),
        D
      ), at;
    }, e.prototype.fill = function(B, D, Y, tt) {
      if (typeof B == "string") {
        if (typeof D == "string" ? (tt = D, D = 0, Y = this.length) : typeof Y == "string" && (tt = Y, Y = this.length), tt !== void 0 && typeof tt != "string")
          throw new TypeError("encoding must be a string");
        if (typeof tt == "string" && !e.isEncoding(tt))
          throw new TypeError("Unknown encoding: " + tt);
        if (B.length === 1) {
          const ct = B.charCodeAt(0);
          (tt === "utf8" && ct < 128 || tt === "latin1") && (B = ct);
        }
      } else typeof B == "number" ? B = B & 255 : typeof B == "boolean" && (B = Number(B));
      if (D < 0 || this.length < D || this.length < Y)
        throw new RangeError("Out of range index");
      if (Y <= D)
        return this;
      D = D >>> 0, Y = Y === void 0 ? this.length : Y >>> 0, B || (B = 0);
      let at;
      if (typeof B == "number")
        for (at = D; at < Y; ++at)
          this[at] = B;
      else {
        const ct = e.isBuffer(B) ? B : e.from(B, tt), Bt = ct.length;
        if (Bt === 0)
          throw new TypeError('The value "' + B + '" is invalid for argument "value"');
        for (at = 0; at < Y - D; ++at)
          this[at + D] = ct[at % Bt];
      }
      return this;
    };
    const K = {};
    function X(W, B, D) {
      K[W] = class extends D {
        constructor() {
          super(), Object.defineProperty(this, "message", {
            value: B.apply(this, arguments),
            writable: !0,
            configurable: !0
          }), this.name = `${this.name} [${W}]`, this.stack, delete this.name;
        }
        get code() {
          return W;
        }
        set code(tt) {
          Object.defineProperty(this, "code", {
            configurable: !0,
            enumerable: !0,
            value: tt,
            writable: !0
          });
        }
        toString() {
          return `${this.name} [${W}]: ${this.message}`;
        }
      };
    }
    X(
      "ERR_BUFFER_OUT_OF_BOUNDS",
      function(W) {
        return W ? `${W} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
      },
      RangeError
    ), X(
      "ERR_INVALID_ARG_TYPE",
      function(W, B) {
        return `The "${W}" argument must be of type number. Received type ${typeof B}`;
      },
      TypeError
    ), X(
      "ERR_OUT_OF_RANGE",
      function(W, B, D) {
        let Y = `The value of "${W}" is out of range.`, tt = D;
        return Number.isInteger(D) && Math.abs(D) > 2 ** 32 ? tt = rt(String(D)) : typeof D == "bigint" && (tt = String(D), (D > BigInt(2) ** BigInt(32) || D < -(BigInt(2) ** BigInt(32))) && (tt = rt(tt)), tt += "n"), Y += ` It must be ${B}. Received ${tt}`, Y;
      },
      RangeError
    );
    function rt(W) {
      let B = "", D = W.length;
      const Y = W[0] === "-" ? 1 : 0;
      for (; D >= Y + 4; D -= 3)
        B = `_${W.slice(D - 3, D)}${B}`;
      return `${W.slice(0, D)}${B}`;
    }
    function yt(W, B, D) {
      At(B, "offset"), (W[B] === void 0 || W[B + D] === void 0) && Tt(B, W.length - (D + 1));
    }
    function kt(W, B, D, Y, tt, at) {
      if (W > D || W < B) {
        const ct = typeof B == "bigint" ? "n" : "";
        let Bt;
        throw B === 0 || B === BigInt(0) ? Bt = `>= 0${ct} and < 2${ct} ** ${(at + 1) * 8}${ct}` : Bt = `>= -(2${ct} ** ${(at + 1) * 8 - 1}${ct}) and < 2 ** ${(at + 1) * 8 - 1}${ct}`, new K.ERR_OUT_OF_RANGE("value", Bt, W);
      }
      yt(Y, tt, at);
    }
    function At(W, B) {
      if (typeof W != "number")
        throw new K.ERR_INVALID_ARG_TYPE(B, "number", W);
    }
    function Tt(W, B, D) {
      throw Math.floor(W) !== W ? (At(W, D), new K.ERR_OUT_OF_RANGE("offset", "an integer", W)) : B < 0 ? new K.ERR_BUFFER_OUT_OF_BOUNDS() : new K.ERR_OUT_OF_RANGE(
        "offset",
        `>= 0 and <= ${B}`,
        W
      );
    }
    const Et = /[^+/0-9A-Za-z-_]/g;
    function Wt(W) {
      if (W = W.split("=")[0], W = W.trim().replace(Et, ""), W.length < 2) return "";
      for (; W.length % 4 !== 0; )
        W = W + "=";
      return W;
    }
    function Vt(W, B) {
      B = B || 1 / 0;
      let D;
      const Y = W.length;
      let tt = null;
      const at = [];
      for (let ct = 0; ct < Y; ++ct) {
        if (D = W.charCodeAt(ct), D > 55295 && D < 57344) {
          if (!tt) {
            if (D > 56319) {
              (B -= 3) > -1 && at.push(239, 191, 189);
              continue;
            } else if (ct + 1 === Y) {
              (B -= 3) > -1 && at.push(239, 191, 189);
              continue;
            }
            tt = D;
            continue;
          }
          if (D < 56320) {
            (B -= 3) > -1 && at.push(239, 191, 189), tt = D;
            continue;
          }
          D = (tt - 55296 << 10 | D - 56320) + 65536;
        } else tt && (B -= 3) > -1 && at.push(239, 191, 189);
        if (tt = null, D < 128) {
          if ((B -= 1) < 0) break;
          at.push(D);
        } else if (D < 2048) {
          if ((B -= 2) < 0) break;
          at.push(
            D >> 6 | 192,
            D & 63 | 128
          );
        } else if (D < 65536) {
          if ((B -= 3) < 0) break;
          at.push(
            D >> 12 | 224,
            D >> 6 & 63 | 128,
            D & 63 | 128
          );
        } else if (D < 1114112) {
          if ((B -= 4) < 0) break;
          at.push(
            D >> 18 | 240,
            D >> 12 & 63 | 128,
            D >> 6 & 63 | 128,
            D & 63 | 128
          );
        } else
          throw new Error("Invalid code point");
      }
      return at;
    }
    function re(W) {
      const B = [];
      for (let D = 0; D < W.length; ++D)
        B.push(W.charCodeAt(D) & 255);
      return B;
    }
    function vt(W, B) {
      let D, Y, tt;
      const at = [];
      for (let ct = 0; ct < W.length && !((B -= 2) < 0); ++ct)
        D = W.charCodeAt(ct), Y = D >> 8, tt = D % 256, at.push(tt), at.push(Y);
      return at;
    }
    function Zt(W) {
      return h.toByteArray(Wt(W));
    }
    function Dt(W, B, D, Y) {
      let tt;
      for (tt = 0; tt < Y && !(tt + D >= B.length || tt >= W.length); ++tt)
        B[tt + D] = W[tt];
      return tt;
    }
    function qt(W, B) {
      return W instanceof B || W != null && W.constructor != null && W.constructor.name != null && W.constructor.name === B.name;
    }
    function pe(W) {
      return W !== W;
    }
    const De = function() {
      const W = "0123456789abcdef", B = new Array(256);
      for (let D = 0; D < 16; ++D) {
        const Y = D * 16;
        for (let tt = 0; tt < 16; ++tt)
          B[Y + tt] = W[D] + W[tt];
      }
      return B;
    }();
    function oe(W) {
      return typeof BigInt > "u" ? Me : W;
    }
    function Me() {
      throw new Error("BigInt not supported");
    }
  })(Iu);
  const ze = Iu.Buffer;
  var Er = {}, du;
  function Yl() {
    return du || (du = 1, function(N) {
      function h(x, A) {
        var f;
        return x instanceof ze ? f = x : f = ze.from(x.buffer, x.byteOffset, x.byteLength), f.toString(A);
      }
      var t = function(x) {
        return ze.from(x);
      };
      function s(x) {
        for (var A = 0, f = Math.min(256 * 256, x.length + 1), E = new Uint16Array(f), w = [], I = 0; ; ) {
          var T = A < x.length;
          if (!T || I >= f - 1) {
            var M = E.subarray(0, I), R = M;
            if (w.push(String.fromCharCode.apply(null, R)), !T) return w.join("");
            x = x.subarray(A), A = 0, I = 0;
          }
          var U = x[A++];
          if ((U & 128) === 0) E[I++] = U;
          else if ((U & 224) === 192) {
            var z = x[A++] & 63;
            E[I++] = (U & 31) << 6 | z;
          } else if ((U & 240) === 224) {
            var z = x[A++] & 63, $ = x[A++] & 63;
            E[I++] = (U & 31) << 12 | z << 6 | $;
          } else if ((U & 248) === 240) {
            var z = x[A++] & 63, $ = x[A++] & 63, H = x[A++] & 63, nt = (U & 7) << 18 | z << 12 | $ << 6 | H;
            nt > 65535 && (nt -= 65536, E[I++] = nt >>> 10 & 1023 | 55296, nt = 56320 | nt & 1023), E[I++] = nt;
          }
        }
      }
      function u(x) {
        for (var A = 0, f = x.length, E = 0, w = Math.max(32, f + (f >>> 1) + 7), I = new Uint8Array(w >>> 3 << 3); A < f; ) {
          var T = x.charCodeAt(A++);
          if (T >= 55296 && T <= 56319) {
            if (A < f) {
              var M = x.charCodeAt(A);
              (M & 64512) === 56320 && (++A, T = ((T & 1023) << 10) + (M & 1023) + 65536);
            }
            if (T >= 55296 && T <= 56319) continue;
          }
          if (E + 4 > I.length) {
            w += 8, w *= 1 + A / x.length * 2, w = w >>> 3 << 3;
            var R = new Uint8Array(w);
            R.set(I), I = R;
          }
          if ((T & 4294967168) === 0) {
            I[E++] = T;
            continue;
          } else if ((T & 4294965248) === 0) I[E++] = T >>> 6 & 31 | 192;
          else if ((T & 4294901760) === 0) I[E++] = T >>> 12 & 15 | 224, I[E++] = T >>> 6 & 63 | 128;
          else if ((T & 4292870144) === 0) I[E++] = T >>> 18 & 7 | 240, I[E++] = T >>> 12 & 63 | 128, I[E++] = T >>> 6 & 63 | 128;
          else continue;
          I[E++] = T & 63 | 128;
        }
        return I.slice ? I.slice(0, E) : I.subarray(0, E);
      }
      var P = "Failed to ", c = function(x, A, f) {
        if (x) throw new Error("".concat(P).concat(A, ": the '").concat(f, "' option is unsupported."));
      }, n = typeof ze == "function" && ze.from, a = n ? t : u;
      function i() {
        this.encoding = "utf-8";
      }
      i.prototype.encode = function(x, A) {
        return c(A && A.stream, "encode", "stream"), a(x);
      };
      function e(x) {
        var A;
        try {
          var f = new Blob([x], { type: "text/plain;charset=UTF-8" });
          A = URL.createObjectURL(f);
          var E = new XMLHttpRequest();
          return E.open("GET", A, !1), E.send(), E.responseText;
        } finally {
          A && URL.revokeObjectURL(A);
        }
      }
      var k = !n && typeof Blob == "function" && typeof URL == "function" && typeof URL.createObjectURL == "function", O = ["utf-8", "utf8", "unicode-1-1-utf-8"], m = s;
      n ? m = h : k && (m = function(x) {
        try {
          return e(x);
        } catch {
          return s(x);
        }
      });
      var _ = "construct 'TextDecoder'", d = "".concat(P, " ").concat(_, ": the ");
      function S(x, A) {
        c(A && A.fatal, _, "fatal"), x = x || "utf-8";
        var f;
        if (n ? f = ze.isEncoding(x) : f = O.indexOf(x.toLowerCase()) !== -1, !f) throw new RangeError("".concat(d, " encoding label provided ('").concat(x, "') is invalid."));
        this.encoding = x, this.fatal = !1, this.ignoreBOM = !1;
      }
      S.prototype.decode = function(x, A) {
        c(A && A.stream, "decode", "stream");
        var f;
        return x instanceof Uint8Array ? f = x : x.buffer instanceof ArrayBuffer ? f = new Uint8Array(x.buffer) : f = new Uint8Array(x), m(f, this.encoding);
      }, N.TextEncoder = N.TextEncoder || i, N.TextDecoder = N.TextDecoder || S;
    }(typeof window < "u" ? window : typeof globalThis < "u" ? globalThis : Er)), Er;
  }
  var Pr, pu;
  function Vl() {
    return pu || (pu = 1, Yl(), Pr = {
      encode: (N) => new TextEncoder().encode(N),
      decode: (N) => new TextDecoder().decode(N)
    }), Pr;
  }
  var Sr, gu;
  function Zl() {
    if (gu) return Sr;
    gu = 1, Sr = N;
    function N(h, t, s) {
      var u;
      return function() {
        if (!t)
          return h.apply(this, arguments);
        var P = this, c = arguments, n = s && !u;
        if (clearTimeout(u), u = setTimeout(function() {
          if (u = null, !n)
            return h.apply(P, c);
        }, t), n)
          return h.apply(this, arguments);
      };
    }
    return Sr;
  }
  var Rr, mu;
  function Wr() {
    if (mu) return Rr;
    mu = 1;
    function N(n) {
      if (n.length === 0)
        return ".";
      let a = s(n);
      return a = a.reduce(c, []), t(...a);
    }
    function h(...n) {
      let a = "";
      for (let i of n)
        i.startsWith("/") ? a = i : a = N(t(a, i));
      return a;
    }
    function t(...n) {
      if (n.length === 0) return "";
      let a = n.join("/");
      return a = a.replace(/\/{2,}/g, "/"), a;
    }
    function s(n) {
      if (n.length === 0) return [];
      if (n === "/") return ["/"];
      let a = n.split("/");
      return a[a.length - 1] === "" && a.pop(), n[0] === "/" ? a[0] = "/" : a[0] !== "." && a.unshift("."), a;
    }
    function u(n) {
      const a = n.lastIndexOf("/");
      if (a === -1) throw new Error(`Cannot get dirname of "${n}"`);
      return a === 0 ? "/" : n.slice(0, a);
    }
    function P(n) {
      if (n === "/") throw new Error(`Cannot get basename of "${n}"`);
      const a = n.lastIndexOf("/");
      return a === -1 ? n : n.slice(a + 1);
    }
    function c(n, a) {
      if (n.length === 0)
        return n.push(a), n;
      if (a === ".") return n;
      if (a === "..") {
        if (n.length === 1) {
          if (n[0] === "/")
            throw new Error("Unable to normalize path - traverses above root directory");
          if (n[0] === ".")
            return n.push(a), n;
        }
        return n[n.length - 1] === ".." ? (n.push(".."), n) : (n.pop(), n);
      }
      return n.push(a), n;
    }
    return Rr = {
      join: t,
      normalize: N,
      split: s,
      basename: P,
      dirname: u,
      resolve: h
    }, Rr;
  }
  var Ar, yu;
  function $u() {
    if (yu) return Ar;
    yu = 1;
    function N(c) {
      return class extends Error {
        constructor(...n) {
          super(...n), this.code = c, this.message ? this.message = c + ": " + this.message : this.message = c;
        }
      };
    }
    const h = N("EEXIST"), t = N("ENOENT"), s = N("ENOTDIR"), u = N("ENOTEMPTY"), P = N("ETIMEDOUT");
    return Ar = { EEXIST: h, ENOENT: t, ENOTDIR: s, ENOTEMPTY: u, ETIMEDOUT: P }, Ar;
  }
  var Br, wu;
  function Kl() {
    if (wu) return Br;
    wu = 1;
    const N = Wr(), { EEXIST: h, ENOENT: t, ENOTDIR: s, ENOTEMPTY: u } = $u(), P = 0;
    return Br = class {
      constructor() {
      }
      _makeRoot(n = /* @__PURE__ */ new Map()) {
        return n.set(P, { mode: 511, type: "dir", size: 0, ino: 0, mtimeMs: Date.now() }), n;
      }
      activate(n = null) {
        n === null ? this._root = /* @__PURE__ */ new Map([["/", this._makeRoot()]]) : typeof n == "string" ? this._root = /* @__PURE__ */ new Map([["/", this._makeRoot(this.parse(n))]]) : this._root = n;
      }
      get activated() {
        return !!this._root;
      }
      deactivate() {
        this._root = void 0;
      }
      size() {
        return this._countInodes(this._root.get("/")) - 1;
      }
      _countInodes(n) {
        let a = 1;
        for (let [i, e] of n)
          i !== P && (a += this._countInodes(e));
        return a;
      }
      autoinc() {
        return this._maxInode(this._root.get("/")) + 1;
      }
      _maxInode(n) {
        let a = n.get(P).ino;
        for (let [i, e] of n)
          i !== P && (a = Math.max(a, this._maxInode(e)));
        return a;
      }
      print(n = this._root.get("/")) {
        let a = "";
        const i = (e, k) => {
          for (let [O, m] of e) {
            if (O === 0) continue;
            let _ = m.get(P), d = _.mode.toString(8);
            a += `${"	".repeat(k)}${O}	${d}`, _.type === "file" ? a += `	${_.size}	${_.mtimeMs}
` : (a += `
`, i(m, k + 1));
          }
        };
        return i(n, 0), a;
      }
      parse(n) {
        let a = 0;
        function i(m) {
          const _ = ++a, d = m.length === 1 ? "dir" : "file";
          let [S, x, A] = m;
          return S = parseInt(S, 8), x = x ? parseInt(x) : 0, A = A ? parseInt(A) : Date.now(), /* @__PURE__ */ new Map([[P, { mode: S, type: d, size: x, mtimeMs: A, ino: _ }]]);
        }
        let e = n.trim().split(`
`), k = this._makeRoot(), O = [
          { indent: -1, node: k },
          { indent: 0, node: null }
        ];
        for (let m of e) {
          let d = m.match(/^\t*/)[0].length;
          m = m.slice(d);
          let [S, ...x] = m.split("	"), A = i(x);
          if (d <= O[O.length - 1].indent)
            for (; d <= O[O.length - 1].indent; )
              O.pop();
          O.push({ indent: d, node: A }), O[O.length - 2].node.set(S, A);
        }
        return k;
      }
      _lookup(n, a = !0) {
        let i = this._root, e = "/", k = N.split(n);
        for (let O = 0; O < k.length; ++O) {
          let m = k[O];
          if (i = i.get(m), !i) throw new t(n);
          if (a || O < k.length - 1) {
            const _ = i.get(P);
            if (_.type === "symlink") {
              let d = N.resolve(e, _.target);
              i = this._lookup(d);
            }
            e ? e = N.join(e, m) : e = m;
          }
        }
        return i;
      }
      mkdir(n, { mode: a }) {
        if (n === "/") throw new h();
        let i = this._lookup(N.dirname(n)), e = N.basename(n);
        if (i.has(e))
          throw new h();
        let k = /* @__PURE__ */ new Map(), O = {
          mode: a,
          type: "dir",
          size: 0,
          mtimeMs: Date.now(),
          ino: this.autoinc()
        };
        k.set(P, O), i.set(e, k);
      }
      rmdir(n) {
        let a = this._lookup(n);
        if (a.get(P).type !== "dir") throw new s();
        if (a.size > 1) throw new u();
        let i = this._lookup(N.dirname(n)), e = N.basename(n);
        i.delete(e);
      }
      readdir(n) {
        let a = this._lookup(n);
        if (a.get(P).type !== "dir") throw new s();
        return [...a.keys()].filter((i) => typeof i == "string");
      }
      writeStat(n, a, { mode: i }) {
        let e;
        try {
          let d = this.stat(n);
          i == null && (i = d.mode), e = d.ino;
        } catch {
        }
        i == null && (i = 438), e == null && (e = this.autoinc());
        let k = this._lookup(N.dirname(n)), O = N.basename(n), m = {
          mode: i,
          type: "file",
          size: a,
          mtimeMs: Date.now(),
          ino: e
        }, _ = /* @__PURE__ */ new Map();
        return _.set(P, m), k.set(O, _), m;
      }
      unlink(n) {
        let a = this._lookup(N.dirname(n)), i = N.basename(n);
        a.delete(i);
      }
      rename(n, a) {
        let i = N.basename(a), e = this._lookup(n);
        this._lookup(N.dirname(a)).set(i, e), this.unlink(n);
      }
      stat(n) {
        return this._lookup(n).get(P);
      }
      lstat(n) {
        return this._lookup(n, !1).get(P);
      }
      readlink(n) {
        return this._lookup(n, !1).get(P).target;
      }
      symlink(n, a) {
        let i, e;
        try {
          let d = this.stat(a);
          e === null && (e = d.mode), i = d.ino;
        } catch {
        }
        e == null && (e = 40960), i == null && (i = this.autoinc());
        let k = this._lookup(N.dirname(a)), O = N.basename(a), m = {
          mode: e,
          type: "symlink",
          target: n,
          size: 0,
          mtimeMs: Date.now(),
          ino: i
        }, _ = /* @__PURE__ */ new Map();
        return _.set(P, m), k.set(O, _), m;
      }
      _du(n) {
        let a = 0;
        for (const [i, e] of n.entries())
          i === P ? a += e.size : a += this._du(e);
        return a;
      }
      du(n) {
        let a = this._lookup(n);
        return this._du(a);
      }
    }, Br;
  }
  class Cu {
    constructor(h = "keyval-store", t = "keyval") {
      this.storeName = t, this._dbName = h, this._storeName = t, this._init();
    }
    _init() {
      this._dbp || (this._dbp = new Promise((h, t) => {
        const s = indexedDB.open(this._dbName);
        s.onerror = () => t(s.error), s.onsuccess = () => h(s.result), s.onupgradeneeded = () => {
          s.result.createObjectStore(this._storeName);
        };
      }));
    }
    _withIDBStore(h, t) {
      return this._init(), this._dbp.then((s) => new Promise((u, P) => {
        const c = s.transaction(this.storeName, h);
        c.oncomplete = () => u(), c.onabort = c.onerror = () => P(c.error), t(c.objectStore(this.storeName));
      }));
    }
    _close() {
      return this._init(), this._dbp.then((h) => {
        h.close(), this._dbp = void 0;
      });
    }
  }
  let Ir;
  function Ce() {
    return Ir || (Ir = new Cu()), Ir;
  }
  function Jl(N, h = Ce()) {
    let t;
    return h._withIDBStore("readwrite", (s) => {
      t = s.get(N);
    }).then(() => t.result);
  }
  function Xl(N, h, t = Ce()) {
    return t._withIDBStore("readwrite", (s) => {
      s.put(h, N);
    });
  }
  function Ql(N, h, t = Ce()) {
    return t._withIDBStore("readwrite", (s) => {
      const u = s.get(N);
      u.onsuccess = () => {
        s.put(h(u.result), N);
      };
    });
  }
  function th(N, h = Ce()) {
    return h._withIDBStore("readwrite", (t) => {
      t.delete(N);
    });
  }
  function eh(N = Ce()) {
    return N._withIDBStore("readwrite", (h) => {
      h.clear();
    });
  }
  function rh(N = Ce()) {
    const h = [];
    return N._withIDBStore("readwrite", (t) => {
      (t.openKeyCursor || t.openCursor).call(t).onsuccess = function() {
        this.result && (h.push(this.result.key), this.result.continue());
      };
    }).then(() => h);
  }
  function nh(N = Ce()) {
    return N._close();
  }
  const ih = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    Store: Cu,
    clear: eh,
    close: nh,
    del: th,
    get: Jl,
    keys: rh,
    set: Xl,
    update: Ql
  }, Symbol.toStringTag, { value: "Module" })), Du = /* @__PURE__ */ Ml(ih);
  var Tr, vu;
  function oh() {
    if (vu) return Tr;
    vu = 1;
    const N = Du;
    return Tr = class {
      constructor(t, s) {
        this._database = t, this._storename = s, this._store = new N.Store(this._database, this._storename);
      }
      saveSuperblock(t) {
        return N.set("!root", t, this._store);
      }
      loadSuperblock() {
        return N.get("!root", this._store);
      }
      readFile(t) {
        return N.get(t, this._store);
      }
      writeFile(t, s) {
        return N.set(t, s, this._store);
      }
      unlink(t) {
        return N.del(t, this._store);
      }
      wipe() {
        return N.clear(this._store);
      }
      close() {
        return N.close(this._store);
      }
    }, Tr;
  }
  var $r, bu;
  function ah() {
    return bu || (bu = 1, $r = class {
      constructor(h) {
        this._url = h;
      }
      loadSuperblock() {
        return fetch(this._url + "/.superblock.txt").then((h) => h.ok ? h.text() : null);
      }
      async readFile(h) {
        const t = await fetch(this._url + h);
        if (t.status === 200)
          return t.arrayBuffer();
        throw new Error("ENOENT");
      }
      async sizeFile(h) {
        const t = await fetch(this._url + h, { method: "HEAD" });
        if (t.status === 200)
          return t.headers.get("content-length");
        throw new Error("ENOENT");
      }
    }), $r;
  }
  var Cr, _u;
  function sh() {
    if (_u) return Cr;
    _u = 1;
    const N = Du, h = (t) => new Promise((s) => setTimeout(s, t));
    return Cr = class {
      constructor(s, u) {
        this._id = Math.random(), this._database = s, this._storename = u, this._store = new N.Store(this._database, this._storename), this._lock = null;
      }
      async has({ margin: s = 2e3 } = {}) {
        if (this._lock && this._lock.holder === this._id) {
          const u = Date.now();
          return this._lock.expires > u + s ? !0 : await this.renew();
        } else
          return !1;
      }
      // Returns true if successful
      async renew({ ttl: s = 5e3 } = {}) {
        let u;
        return await N.update("lock", (P) => {
          const n = Date.now() + s;
          return u = P && P.holder === this._id, this._lock = u ? { holder: this._id, expires: n } : P, this._lock;
        }, this._store), u;
      }
      // Returns true if successful
      async acquire({ ttl: s = 5e3 } = {}) {
        let u, P, c;
        if (await N.update("lock", (n) => {
          const a = Date.now(), i = a + s;
          return P = n && n.expires < a, u = n === void 0 || P, c = n && n.holder === this._id, this._lock = u ? { holder: this._id, expires: i } : n, this._lock;
        }, this._store), c)
          throw new Error("Mutex double-locked");
        return u;
      }
      // check at 10Hz, give up after 10 minutes
      async wait({ interval: s = 100, limit: u = 6e3, ttl: P } = {}) {
        for (; u--; ) {
          if (await this.acquire({ ttl: P })) return !0;
          await h(s);
        }
        throw new Error("Mutex timeout");
      }
      // Returns true if successful
      async release({ force: s = !1 } = {}) {
        let u, P, c;
        if (await N.update("lock", (n) => (u = s || n && n.holder === this._id, P = n === void 0, c = n && n.holder !== this._id, this._lock = u ? void 0 : n, this._lock), this._store), await N.close(this._store), !u && !s) {
          if (P) throw new Error("Mutex double-freed");
          if (c) throw new Error("Mutex lost ownership");
        }
        return u;
      }
    }, Cr;
  }
  var Dr, ku;
  function uh() {
    return ku || (ku = 1, Dr = class {
      constructor(h) {
        this._id = Math.random(), this._database = h, this._has = !1, this._release = null;
      }
      async has() {
        return this._has;
      }
      // Returns true if successful
      async acquire() {
        return new Promise((h) => {
          navigator.locks.request(this._database + "_lock", { ifAvailable: !0 }, (t) => (this._has = !!t, h(!!t), new Promise((s) => {
            this._release = s;
          })));
        });
      }
      // Returns true if successful, gives up after 10 minutes
      async wait({ timeout: h = 6e5 } = {}) {
        return new Promise((t, s) => {
          const u = new AbortController();
          setTimeout(() => {
            u.abort(), s(new Error("Mutex timeout"));
          }, h), navigator.locks.request(this._database + "_lock", { signal: u.signal }, (P) => (this._has = !!P, t(!!P), new Promise((c) => {
            this._release = c;
          })));
        });
      }
      // Returns true if successful
      async release({ force: h = !1 } = {}) {
        this._has = !1, this._release ? this._release() : h && navigator.locks.request(this._database + "_lock", { steal: !0 }, (t) => !0);
      }
    }), Dr;
  }
  var Mr, ju;
  function ch() {
    if (ju) return Mr;
    ju = 1;
    const { encode: N, decode: h } = Vl(), t = Zl(), s = Kl(), { ENOENT: u, ENOTEMPTY: P, ETIMEDOUT: c } = $u(), n = oh(), a = ah(), i = sh(), e = uh(), k = Wr();
    return Mr = class {
      constructor() {
        this.saveSuperblock = t(() => {
          this.flush();
        }, 500);
      }
      async init(m, {
        wipe: _,
        url: d,
        urlauto: S,
        fileDbName: x = m,
        db: A = null,
        fileStoreName: f = m + "_files",
        lockDbName: E = m + "_lock",
        lockStoreName: w = m + "_lock"
      } = {}) {
        this._name = m, this._idb = A || new n(x, f), this._mutex = navigator.locks ? new e(m) : new i(E, w), this._cache = new s(m), this._opts = { wipe: _, url: d }, this._needsWipe = !!_, d && (this._http = new a(d), this._urlauto = !!S);
      }
      async activate() {
        if (this._cache.activated) return;
        this._needsWipe && (this._needsWipe = !1, await this._idb.wipe(), await this._mutex.release({ force: !0 })), await this._mutex.has() || await this._mutex.wait();
        const m = await this._idb.loadSuperblock();
        if (m)
          this._cache.activate(m);
        else if (this._http) {
          const _ = await this._http.loadSuperblock();
          this._cache.activate(_), await this._saveSuperblock();
        } else
          this._cache.activate();
        if (!await this._mutex.has())
          throw new c();
      }
      async deactivate() {
        await this._mutex.has() && await this._saveSuperblock(), this._cache.deactivate();
        try {
          await this._mutex.release();
        } catch (m) {
          console.log(m);
        }
        await this._idb.close();
      }
      async _saveSuperblock() {
        this._cache.activated && (this._lastSavedAt = Date.now(), await this._idb.saveSuperblock(this._cache._root));
      }
      _writeStat(m, _, d) {
        let S = k.split(k.dirname(m)), x = S.shift();
        for (let A of S) {
          x = k.join(x, A);
          try {
            this._cache.mkdir(x, { mode: 511 });
          } catch {
          }
        }
        return this._cache.writeStat(m, _, d);
      }
      async readFile(m, _) {
        const { encoding: d } = _;
        if (d && d !== "utf8") throw new Error('Only "utf8" encoding is supported in readFile');
        let S = null, x = null;
        try {
          x = this._cache.stat(m), S = await this._idb.readFile(x.ino);
        } catch (A) {
          if (!this._urlauto) throw A;
        }
        if (!S && this._http) {
          let A = this._cache.lstat(m);
          for (; A.type === "symlink"; )
            m = k.resolve(k.dirname(m), A.target), A = this._cache.lstat(m);
          S = await this._http.readFile(m);
        }
        if (S && ((!x || x.size != S.byteLength) && (x = await this._writeStat(m, S.byteLength, { mode: x ? x.mode : 438 }), this.saveSuperblock()), d === "utf8" ? S = h(S) : S.toString = () => h(S)), !x) throw new u(m);
        return S;
      }
      async writeFile(m, _, d) {
        const { mode: S, encoding: x = "utf8" } = d;
        if (typeof _ == "string") {
          if (x !== "utf8")
            throw new Error('Only "utf8" encoding is supported in writeFile');
          _ = N(_);
        }
        const A = await this._cache.writeStat(m, _.byteLength, { mode: S });
        await this._idb.writeFile(A.ino, _);
      }
      async unlink(m, _) {
        const d = this._cache.lstat(m);
        this._cache.unlink(m), d.type !== "symlink" && await this._idb.unlink(d.ino);
      }
      readdir(m, _) {
        return this._cache.readdir(m);
      }
      mkdir(m, _) {
        const { mode: d = 511 } = _;
        this._cache.mkdir(m, { mode: d });
      }
      rmdir(m, _) {
        if (m === "/")
          throw new P();
        this._cache.rmdir(m);
      }
      rename(m, _) {
        this._cache.rename(m, _);
      }
      stat(m, _) {
        return this._cache.stat(m);
      }
      lstat(m, _) {
        return this._cache.lstat(m);
      }
      readlink(m, _) {
        return this._cache.readlink(m);
      }
      symlink(m, _) {
        this._cache.symlink(m, _);
      }
      async backFile(m, _) {
        let d = await this._http.sizeFile(m);
        await this._writeStat(m, d, _);
      }
      du(m) {
        return this._cache.du(m);
      }
      flush() {
        return this._saveSuperblock();
      }
    }, Mr;
  }
  var Nr, xu;
  function fh() {
    return xu || (xu = 1, Nr = class {
      constructor(h) {
        this.type = h.type, this.mode = h.mode, this.size = h.size, this.ino = h.ino, this.mtimeMs = h.mtimeMs, this.ctimeMs = h.ctimeMs || h.mtimeMs, this.uid = 1, this.gid = 1, this.dev = 1;
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
    }), Nr;
  }
  var Ur, Ou;
  function lh() {
    if (Ou) return Ur;
    Ou = 1;
    const N = ch(), h = fh(), t = Wr();
    function s(c, n, ...a) {
      return c = t.normalize(c), (typeof n > "u" || typeof n == "function") && (n = {}), typeof n == "string" && (n = {
        encoding: n
      }), [c, n, ...a];
    }
    function u(c, n, a, ...i) {
      return c = t.normalize(c), (typeof a > "u" || typeof a == "function") && (a = {}), typeof a == "string" && (a = {
        encoding: a
      }), [c, n, a, ...i];
    }
    function P(c, n, ...a) {
      return [t.normalize(c), t.normalize(n), ...a];
    }
    return Ur = class {
      constructor(n, a = {}) {
        this.init = this.init.bind(this), this.readFile = this._wrap(this.readFile, s, !1), this.writeFile = this._wrap(this.writeFile, u, !0), this.unlink = this._wrap(this.unlink, s, !0), this.readdir = this._wrap(this.readdir, s, !1), this.mkdir = this._wrap(this.mkdir, s, !0), this.rmdir = this._wrap(this.rmdir, s, !0), this.rename = this._wrap(this.rename, P, !0), this.stat = this._wrap(this.stat, s, !1), this.lstat = this._wrap(this.lstat, s, !1), this.readlink = this._wrap(this.readlink, s, !1), this.symlink = this._wrap(this.symlink, P, !0), this.backFile = this._wrap(this.backFile, s, !0), this.du = this._wrap(this.du, s, !1), this._deactivationPromise = null, this._deactivationTimeout = null, this._activationPromise = null, this._operations = /* @__PURE__ */ new Set(), n && this.init(n, a);
      }
      async init(...n) {
        return this._initPromiseResolve && await this._initPromise, this._initPromise = this._init(...n), this._initPromise;
      }
      async _init(n, a = {}) {
        await this._gracefulShutdown(), this._activationPromise && await this._deactivate(), this._backend && this._backend.destroy && await this._backend.destroy(), this._backend = a.backend || new N(), this._backend.init && await this._backend.init(n, a), this._initPromiseResolve && (this._initPromiseResolve(), this._initPromiseResolve = null), a.defer || this.stat("/");
      }
      async _gracefulShutdown() {
        this._operations.size > 0 && (this._isShuttingDown = !0, await new Promise((n) => this._gracefulShutdownResolve = n), this._isShuttingDown = !1, this._gracefulShutdownResolve = null);
      }
      _wrap(n, a, i) {
        return async (...e) => {
          e = a(...e);
          let k = {
            name: n.name,
            args: e
          };
          this._operations.add(k);
          try {
            return await this._activate(), await n.apply(this, e);
          } finally {
            this._operations.delete(k), i && this._backend.saveSuperblock(), this._operations.size === 0 && (this._deactivationTimeout || clearTimeout(this._deactivationTimeout), this._deactivationTimeout = setTimeout(this._deactivate.bind(this), 500));
          }
        };
      }
      async _activate() {
        this._initPromise || console.warn(new Error(`Attempted to use LightningFS ${this._name} before it was initialized.`)), await this._initPromise, this._deactivationTimeout && (clearTimeout(this._deactivationTimeout), this._deactivationTimeout = null), this._deactivationPromise && await this._deactivationPromise, this._deactivationPromise = null, this._activationPromise || (this._activationPromise = this._backend.activate ? this._backend.activate() : Promise.resolve()), await this._activationPromise;
      }
      async _deactivate() {
        return this._activationPromise && await this._activationPromise, this._deactivationPromise || (this._deactivationPromise = this._backend.deactivate ? this._backend.deactivate() : Promise.resolve()), this._activationPromise = null, this._gracefulShutdownResolve && this._gracefulShutdownResolve(), this._deactivationPromise;
      }
      async readFile(n, a) {
        return this._backend.readFile(n, a);
      }
      async writeFile(n, a, i) {
        return await this._backend.writeFile(n, a, i), null;
      }
      async unlink(n, a) {
        return await this._backend.unlink(n, a), null;
      }
      async readdir(n, a) {
        return this._backend.readdir(n, a);
      }
      async mkdir(n, a) {
        return await this._backend.mkdir(n, a), null;
      }
      async rmdir(n, a) {
        return await this._backend.rmdir(n, a), null;
      }
      async rename(n, a) {
        return await this._backend.rename(n, a), null;
      }
      async stat(n, a) {
        const i = await this._backend.stat(n, a);
        return new h(i);
      }
      async lstat(n, a) {
        const i = await this._backend.lstat(n, a);
        return new h(i);
      }
      async readlink(n, a) {
        return this._backend.readlink(n, a);
      }
      async symlink(n, a) {
        return await this._backend.symlink(n, a), null;
      }
      async backFile(n, a) {
        return await this._backend.backFile(n, a), null;
      }
      async du(n) {
        return this._backend.du(n);
      }
      async flush() {
        return this._backend.flush();
      }
    }, Ur;
  }
  var Fr, Eu;
  function hh() {
    if (Eu) return Fr;
    Eu = 1;
    const N = Nl(), h = lh();
    function t(s, u) {
      return typeof s == "function" && (u = s), u = N(u), [(...c) => u(null, ...c), u];
    }
    return Fr = class {
      constructor(...u) {
        this.promises = new h(...u), this.init = this.init.bind(this), this.readFile = this.readFile.bind(this), this.writeFile = this.writeFile.bind(this), this.unlink = this.unlink.bind(this), this.readdir = this.readdir.bind(this), this.mkdir = this.mkdir.bind(this), this.rmdir = this.rmdir.bind(this), this.rename = this.rename.bind(this), this.stat = this.stat.bind(this), this.lstat = this.lstat.bind(this), this.readlink = this.readlink.bind(this), this.symlink = this.symlink.bind(this), this.backFile = this.backFile.bind(this), this.du = this.du.bind(this), this.flush = this.flush.bind(this);
      }
      init(u, P) {
        return this.promises.init(u, P);
      }
      readFile(u, P, c) {
        const [n, a] = t(P, c);
        this.promises.readFile(u, P).then(n).catch(a);
      }
      writeFile(u, P, c, n) {
        const [a, i] = t(c, n);
        this.promises.writeFile(u, P, c).then(a).catch(i);
      }
      unlink(u, P, c) {
        const [n, a] = t(P, c);
        this.promises.unlink(u, P).then(n).catch(a);
      }
      readdir(u, P, c) {
        const [n, a] = t(P, c);
        this.promises.readdir(u, P).then(n).catch(a);
      }
      mkdir(u, P, c) {
        const [n, a] = t(P, c);
        this.promises.mkdir(u, P).then(n).catch(a);
      }
      rmdir(u, P, c) {
        const [n, a] = t(P, c);
        this.promises.rmdir(u, P).then(n).catch(a);
      }
      rename(u, P, c) {
        const [n, a] = t(c);
        this.promises.rename(u, P).then(n).catch(a);
      }
      stat(u, P, c) {
        const [n, a] = t(P, c);
        this.promises.stat(u).then(n).catch(a);
      }
      lstat(u, P, c) {
        const [n, a] = t(P, c);
        this.promises.lstat(u).then(n).catch(a);
      }
      readlink(u, P, c) {
        const [n, a] = t(P, c);
        this.promises.readlink(u).then(n).catch(a);
      }
      symlink(u, P, c) {
        const [n, a] = t(c);
        this.promises.symlink(u, P).then(n).catch(a);
      }
      backFile(u, P, c) {
        const [n, a] = t(P, c);
        this.promises.backFile(u, P).then(n).catch(a);
      }
      du(u, P) {
        const [c, n] = t(P);
        this.promises.du(u).then(c).catch(n);
      }
      flush(u) {
        const [P, c] = t(u);
        this.promises.flush().then(P).catch(c);
      }
    }, Fr;
  }
  var dh = hh();
  const Pu = /* @__PURE__ */ Dl(dh), Mu = new Lr(qr.logging.fsManagerES6);
  function ue(...N) {
    Mu.consoleDotLog("[fsManagerES6] ", ...N);
  }
  function sr(...N) {
    Mu.consoleDotError("[fsManagerES6] ", ...N);
  }
  ue("Loading fsmanagerES6.");
  class ph {
    constructor(h = {}) {
      this.fsInstances = /* @__PURE__ */ new Map(), this.initializationLocks = /* @__PURE__ */ new Map(), this.debug = !0, this.options = h;
    }
    _log(...h) {
      this.debug && ue("[fsManager]", ...h);
    }
    _error(...h) {
      sr("[fsManager]", ...h);
    }
    async initializeFS(h, t) {
      const s = `${h}-${t}`;
      this._log(`Initializing FS: ${s}`);
      try {
        if (ue("Initializing."), this.fsInstances.has(s))
          return this._log(`FS ${s} already exists`), this.fsInstances.get(s);
        let u;
        if (t === "memory") {
          ue(`Creating memory FS for ${s}`);
          const P = new Cl(this.options, h);
          ue(`Memory backend created for ${s}`), u = new Pu(h, { backend: P }), ue(`Memory FS created for ${s}`), this._log(`Created memory FS with backend for ${s}`);
        } else if (t === "idb")
          u = new Pu(h), this._log(`Created IDB FS for ${s}`);
        else
          throw new Error(`Unsupported FS type: ${t}`);
        return this.fsInstances.set(s, u), u;
      } catch (u) {
        throw this._error(`Failed to initialize ${s}:`, u), u;
      }
    }
    async getFS(h, t) {
      const s = `${h}-${t}`;
      if (this._log(`Requesting FS: ${s}`), this.initializationLocks.has(s))
        return this._log(`Waiting for existing initialization of ${s}`), this.initializationLocks.get(s);
      const u = (async () => {
        try {
          return this.fsInstances.has(s) ? this.fsInstances.get(s) : await this.initializeFS(h, t);
        } finally {
          this.initializationLocks.delete(s);
        }
      })();
      return this.initializationLocks.set(s, u), u;
    }
    async deleteFS(h, t) {
      const s = `${h}-${t}`;
      if (!this.fsInstances.has(s)) {
        console.warn(`File system ${s} does not exist. Nothing to delete.`);
        return;
      }
      if (t === "idb")
        try {
          await this.deleteIndexedDB(h), ue(`IndexedDB file system ${s} deleted successfully.`);
        } catch (u) {
          throw sr(`Error deleting IndexedDB file system ${s}:`, u), u;
        }
      else if (t === "memory")
        ue(`Memory file system ${s} deleted successfully.`);
      else
        throw new Error(`Unsupported file system type: ${t}`);
      this.fsInstances.delete(s);
    }
    async deleteIndexedDB(h) {
      return new Promise((t, s) => {
        const u = indexedDB.deleteDatabase(h);
        u.onsuccess = () => {
          ue(`Deleted database ${h} successfully`), t();
        }, u.onerror = (P) => {
          sr(`Error deleting database ${h}:`, P), s(P);
        }, u.onblocked = () => {
          console.warn(`Delete database ${h} blocked`);
        };
      });
    }
    async getFileStoreNames(h, t) {
      const s = `${h}-${t}`;
      if (!this.fsInstances.has(s))
        throw new Error(`File system ${s} not found. Call initializeFS first.`);
      if (t === "idb")
        try {
          const u = await this.getFileStoresFromDatabases();
          return ue(`File store names for ${s}:`, u), u;
        } catch (u) {
          throw sr(`Error retrieving file store names for ${s}:`, u), u;
        }
      else {
        if (t === "memory")
          return ue(`Memory file system ${s} does not have persistent file stores.`), [];
        throw new Error(`Unsupported file system type: ${t}`);
      }
    }
    async processDatabaseList(h) {
      const t = [];
      for (const s of h) {
        const u = typeof s == "string" ? s : s.name, c = (await this.openDatabase(u)).objectStoreNames, n = Array.from(c).filter((a) => a.startsWith("fs_")).map((a) => ({ database: u, fileStore: a }));
        t.push(...n);
      }
      return ue("Processing database list:", t), t;
    }
    async openDatabase(h) {
      return ue("Opening database:", h), new Promise((t, s) => {
        const u = indexedDB.open(h);
        u.onsuccess = (P) => {
          const c = P.target.result;
          t(c);
        }, u.onerror = (P) => {
          s(`Error opening database ${h}: ${P.target.error}`);
        };
      });
    }
    async getFileStoresFromDatabases() {
      return new Promise((h, t) => {
        const s = indexedDB.webkitGetDatabaseNames ? indexedDB.webkitGetDatabaseNames() : indexedDB.databases ? indexedDB.databases() : null;
        if (!s) {
          t("Your browser does not support retrieving a list of IndexedDB databases");
          return;
        }
        s instanceof Promise ? s.then((u) => {
          this.processDatabaseList(u).then((P) => h(P)).catch((P) => t(P));
        }).catch((u) => t(u)) : (s.onsuccess = async (u) => {
          const P = u.target.result;
          try {
            const c = await this.processDatabaseList(P);
            h(c);
          } catch (c) {
            t(c);
          }
        }, s.onerror = (u) => {
          t(`Error retrieving database list: ${u.target.error}`);
        });
      });
    }
  }
  const gh = self.__WB_MANIFEST;
  console.log("Service Worker loaded with manifest:", gh);
  let ge = "", me = "", ce = "/", er = 1, qe = Bl, Oe = "origin", Nt = "main", He = "http://localhost:9000", Gr = {}, ur = {}, Nu = 0, Xt, Gt = null, Yt = {
    cloneCount: 0,
    pushCount: 0,
    pullCount: 0,
    fetchCount: 0,
    ffCount: 0
  }, Yr = !0, be = {};
  const mh = new ph();
  function Rt(...N) {
    Yr && console.log(...N);
  }
  function Ht(...N) {
    Yr && (console.error(...N), console.trace());
  }
  const We = "cache-v1", yh = [], Su = new URL(self.registration.scope).pathname.split("/")[1], zr = Su ? `/${Su}/` : "/";
  self.addEventListener("install", (N) => {
    self.skipWaiting(), Rt("install"), N.waitUntil(
      caches.open(We).then((h) => (Rt("Opened cache"), h.addAll(yh))).catch((h) => {
        Ht("Failed to cache", h);
      })
    );
  });
  self.addEventListener("activate", (N) => (N.waitUntil(
    (async () => {
      ge = "", me = "", ce = "/", er = 1, Oe = "origin", Nt = "main", Gr = {}, ur = {}, Nu = 0, Gt = new Il("fs"), Yt = {
        cloneCount: 0,
        pushCount: 0,
        pullCount: 0,
        fetchCount: 0,
        ffCount: 0,
        listServerRefsCount: 0
      }, Yr = !0, be = {};
      const h = await caches.keys();
      await Promise.all(
        h.map((t) => {
          if (t !== We)
            return caches.delete(t);
        })
      );
    })()
  ), self.clients.claim()));
  self.addEventListener("message", (N) => {
    N.data.action === "skipWaiting" && self.skipWaiting();
  });
  self.broadcastChannelInitialized = !1;
  self.broadcastChannelInitialized || (Xt = new BroadcastChannel("worker-channel"), Xt.onmessage = async function(N) {
    const h = N.data;
    Rt(h);
    try {
      switch (h.operation) {
        case "setAuthParams":
          await vh(h.data);
          break;
        case "setDir":
          await bh(h.data);
          break;
        case "setRepoDir":
          await kh(h.data);
          break;
        case "setDepth":
          await jh(h.data);
          break;
        case "setRemote":
          await xh(h.data);
          break;
        case "setRef":
          await _h(h.data);
          break;
        case "setSettingsAddresses":
          await Oh(h.data);
          break;
        case "passFsArgs":
          await Eh(h.data);
          break;
        case "memorySync":
          await Ph(h.data);
          break;
        default:
          await wh(h);
          break;
      }
    } catch (t) {
      throw Ht(`${h.operation} failed`, t), new Error(t);
    }
  }, self.broadcastChannelInitialized = !0);
  async function wh(N) {
    Ht("Unhandled message operation:", N.operation);
  }
  async function vh(N) {
    ge !== N.username || me !== N.password ? (ge = N.username || "", me = N.password || "", Rt("handlesetauthparame: ", N), Xt.postMessage({ operation: "setAuthParams", success: !0 })) : Xt.postMessage({ operation: "setAuthParams", success: !0 });
  }
  async function bh(N) {
    ce !== N ? (ce = N, Xt.postMessage({ operation: "setDir", success: !0 })) : Xt.postMessage({ operation: "setDir", success: !0 });
  }
  async function _h(N) {
    Nt !== N ? (Nt = N, Xt.postMessage({ operation: "setRef", success: !0 })) : Xt.postMessage({ operation: "setRef", success: !0 });
  }
  async function kh(N) {
    ce !== N ? (ce = N, Xt.postMessage({ operation: "setRepoDir", success: !0 })) : Xt.postMessage({ operation: "setRepoDir", success: !0 });
  }
  async function jh(N) {
    er !== N ? (er = N, Xt.postMessage({ operation: "setDepth", success: !0 })) : Xt.postMessage({ operation: "setDepth", success: !0 });
  }
  async function xh(N) {
    Oe !== N ? (Oe = N, Xt.postMessage({ operation: "setRemote", success: !0 })) : Xt.postMessage({ operation: "setRemote", success: !0 });
  }
  async function Oh(N) {
    ur !== N ? (ur = N, Xt.postMessage({ operation: "setSettingsAddresses", success: !0 })) : Xt.postMessage({ operation: "setSettingsAddresses", success: !0 });
  }
  async function Eh(N) {
    try {
      be !== N ? (be = N, Rt("fsArgs", be), Gt = await mh.getFS(be.fsName, be.fsType), Xt.postMessage({ operation: "passFsArgs", success: !0 })) : Xt.postMessage({ operation: "passFsArgs", success: !0 });
    } catch (h) {
      Ht("some error happened in passFsArgs: ", h);
    }
  }
  async function Ph(N) {
    Rt("handle sync yoo hoo: ", N);
  }
  async function Sh(N) {
    try {
      Rt("pathname", N);
      const h = await Gt.promises.readFile(N, "utf8");
      if (h)
        return Rt("fetch content", h), h;
    } catch (h) {
      throw new Error("Unable to fetch file content: " + h);
    }
  }
  self.addEventListener("fetch", (N) => {
    try {
      const h = new URL(N.request.url);
      if (console.log(`Fetching: ${h.pathname}`), console.log("Service Worker scope:", self.registration.scope), console.log("Request URL path:", h.pathname), h.pathname.endsWith("/git")) {
        N.respondWith(
          Ah(N.request).catch((s) => (console.error("Error handling Git request:", s), new Response(
            JSON.stringify({ error: "Git request failed", details: s.message || s.toString() }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          )))
        );
        return;
      }
      const t = zr && h.pathname.startsWith(zr) ? h.pathname.slice(zr.length - 1) : h.pathname;
      if (console.log(`Extracted path: ${t}`), ur[t]) {
        console.log("Matched settings file path:", t), N.respondWith(
          Sh(t).then(
            (s) => new Response(s, {
              headers: { "Content-Type": "application/json" }
            })
          ).catch((s) => (console.error("Error reading file:", s), new Response(
            JSON.stringify({ error: "File not found or inaccessible", details: s.message || s.toString() }),
            { status: 404, headers: { "Content-Type": "application/json" } }
          )))
        );
        return;
      }
      N.respondWith(
        fetch(N.request).then((s) => s.ok ? s : (console.error("HTTP error response:", s.status), new Response(
          JSON.stringify({ error: "HTTP error", status: s.status }),
          { status: s.status, headers: { "Content-Type": "application/json" } }
        ))).catch((s) => (console.error("Network fetch failed:", s), new Response(
          JSON.stringify({ error: "Network error", details: s.message || s.toString() }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        )))
      );
    } catch (h) {
      console.error("Error in fetch handler:", h), N.respondWith(
        new Response(
          JSON.stringify({ error: "Unexpected error", details: h.message || h.toString() }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        )
      );
    }
  });
  class Rh {
    constructor() {
      this.queue = [], this.locked = !1;
    }
    async lock() {
      return new Promise((h) => {
        const t = () => {
          this.locked = !0, h();
        };
        this.locked ? this.queue.push(t) : t();
      });
    }
    unlock() {
      this.queue.length > 0 ? this.queue.shift()() : this.locked = !1;
    }
  }
  const fe = new Rh();
  async function Ah(N) {
    try {
      const h = await N.json().catch(() => {
        throw new Error("Invalid JSON in request body");
      }), { operation: t, args: s } = h;
      if (!t)
        return new Response(
          JSON.stringify({ error: "Missing operation field" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      let u;
      try {
        switch (t) {
          case "clone":
            u = await Fu(s);
            break;
          case "pull":
            u = await Lu(s);
            break;
          case "push":
            u = await Hu(s);
            break;
          case "fetch":
            u = await Wu(s);
            break;
          case "fastForward":
            u = await qu(s);
            break;
          case "listServerRefs":
            u = await Uu(s);
            break;
          default:
            return new Response(
              JSON.stringify({ error: "Invalid operation" }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }
      } catch (P) {
        return console.error(`Error executing ${t}:`, P), new Response(
          JSON.stringify({
            error: `Error executing ${t}`,
            details: P.message || P.toString()
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify(u),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (h) {
      return console.error("Error in handleGitRequest:", h), new Response(
        JSON.stringify({ error: "Unexpected error", details: h.message || h.toString() }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  async function Bh({ dir: N, ref: h, branch: t }) {
    var s = /^HEAD~([0-9]+)$/, u = h.match(s);
    if (u) {
      var P = +u[1], c = await (void 0)({ fs: Gt, dir: N, depth: P + 1 }), n = c.pop().oid;
      return new Promise((a, i) => {
        Gt.writeFile(N + `/.git/refs/heads/${t}`, n, (e) => {
          if (e)
            return i(e);
          Gt.unlink(N + "/.git/index", (k) => {
            if (k)
              return i(k);
            (void 0)({ dir: N, fs: Gt, ref: t, force: !0 }).then(a);
          });
        });
      });
    }
    return Promise.reject(`Wrong ref ${h}`);
  }
  async function Ge(N, h, t = 2) {
    let s = 0, u = 1e3;
    for (; s <= t; )
      try {
        return await N(h);
      } catch (P) {
        if (P.message.includes("Failed to fetch") || P.message.includes("CORS") || P.message.includes("HTTP Error")) {
          if (s++, s > t) throw new Error("Max retries reached for operation.");
          Rt(`Network error, Retrying operation in ${u / 1e3} seconds... (Attempt ${s})`), await new Promise((c) => setTimeout(c, u)), u *= 2;
        } else
          throw P;
      }
  }
  function Ye(N, h) {
    return !N && !h ? (Rt("No username or password provided. Returning empty headers."), {}) : {
      authorization: `Basic ${btoa(`${N}:${h}`)}`
    };
  }
  async function Uu(N) {
    return Rt("listServerRefs args", N), await Ge(async () => {
      Yt.listServerRefsCount++, await fe.lock();
      try {
        if (Rt("Entering listServerRefs function with arguments:", N), !N.url)
          throw new Error("URL parameter is required for listServerRefs");
        const h = await (void 0)({
          ...N,
          fs: Gt,
          http: qe,
          dir: ce,
          corsProxy: He,
          remote: N.remote || Oe,
          // Fallback to global remote
          headers: Ye(ge, me),
          onAuth() {
            return de.fill();
          },
          onAuthFailure() {
            return de.rejected();
          }
        });
        return Rt("ListServerRefs successful. Result:", h), { success: !0, refs: h };
      } catch (h) {
        if (h?.message?.includes("Could not find") && h?.code === "NotFoundError") {
          if (!await Ve(Uu, N, Yt.listServerRefsCount))
            throw h;
          return Yt.listServerRefsCount = 0, { success: !0, message: "listServerRefs was successful" };
        }
        return Ht("Error occurred during listServerRefs operation:", h), { success: !1, error: h.message };
      } finally {
        Rt("Exiting listServerRefs function."), fe.unlock();
      }
    }, N);
  }
  async function Fu(N) {
    return Rt("entering clone with : ", N), await Ge(async () => {
      Rt("Entering clone function with arguments:", N), Yt.cloneCount++;
      let h = {};
      await fe.lock();
      try {
        if (h = await Th(be.fsName), h)
          await $h(h), await Bh({ dir: ce, ref: "HEAD~1", branch: Nt }), await Ru("clone (from cache)", { fsName: be.fsName }), Rt("log", await Dh()), h = { isCacheUsed: !0, ref: Nt };
        else {
          const t = await (void 0)({
            ...N,
            fs: Gt,
            cache: Gr,
            http: qe,
            dir: ce,
            remote: Oe,
            ref: Nt,
            corsProxy: He,
            depth: er,
            headers: Ye(ge, me),
            onAuth() {
              return de.fill();
            },
            onAuthFailure() {
              return de.rejected();
            }
          });
          if (Nu) {
            const s = await zu();
            await Ih(be.fsName, s);
          }
          h = { isCacheUsed: !1, ref: Nt }, await Ru("clone", { fsName: be.fsName, result: t });
        }
        return { success: !0, message: "The repo has successfully cloned", data: h };
      } catch (t) {
        if (Ht("Clone failed with error:", t), t?.message?.includes("Could not find") && t?.code === "NotFoundError") {
          if (!await Ve(Fu, N, Yt.cloneCount))
            throw t;
          return Yt.cloneCount = 0, h = { isCacheUsed: !1, ref: Nt }, { success: !0, message: "The repo has successfully cloned", data: h };
        } else throw t?.response?.status === 500 ? (Ht("Server responded with 500 Internal Server Error"), new Error("Internal Server Error: The server encountered an error.")) : typeof t == "object" ? (Ht("Error properties:", Object.keys(t)), new Error(t || "An unknown error occurred during the clone operation")) : (Ht("Unknown error:", t), new Error("An unknown error occurred during the clone operation"));
      } finally {
        fe.unlock();
      }
    }, N);
  }
  async function Ih(N, h) {
    try {
      const t = await caches.open(We), s = {};
      Rt("fl", h);
      for (const [P, c] of Object.entries(h)) {
        Rt("fn, fp", P, c);
        const n = await Gt.promises.stat(c);
        if (n.isDirectory())
          s[c] = "";
        else if (n.isFile()) {
          const a = await Gt.promises.readFile(c, "utf8");
          s[c] = a;
        }
      }
      Rt("filesWithContent", s);
      const u = new Response(JSON.stringify(s), {
        headers: { "Content-Type": "application/json" }
      });
      await t.put(N, u), Rt("File list and contents cached successfully", u);
    } catch (t) {
      Ht("Error caching file list and contents:", t);
    }
  }
  async function zu(N = ce) {
    try {
      let h = N, t = await Gt.promises.readdir(N), s = {};
      Rt("files", t), s[N] = N;
      for (const u of t) {
        Rt("file", u);
        let P = h !== "/" ? `${h}/${u}` : `${h}${u}`;
        (await Gt.promises.lstat(P)).isDirectory() ? (Rt("fullPath", P), s = { ...s, ...await zu(P) }) : (Rt("result", s), s[P] = P);
      }
      return s;
    } catch (h) {
      throw Ht("Error listing files:", h), h;
    }
  }
  async function Th(N) {
    try {
      const t = await (await caches.open(We)).match(N);
      if (t) {
        const s = await t.json();
        return Rt("Files and contents fetched from cache:", s), s;
      } else
        return Rt("No cached file list found"), null;
    } catch (h) {
      return Ht("Error fetching cached file list and contents:", h), null;
    }
  }
  async function $h(N) {
    for (const [h, t] of Object.entries(N)) {
      const s = h.split("/").slice(0, -1).join("/");
      s && await Ch(Gt, s), t === "" ? (await Gt.promises.mkdir(h, { recursive: !0 }), Rt(`Directory created: ${h}`)) : await Gt.promises.writeFile(h, t);
    }
    Rt("All files and contents have been written to IndexedDB using LightningFS.");
  }
  async function Ch(N, h) {
    const t = h.split("/").filter((u) => u);
    let s = "";
    for (const u of t) {
      s += `/${u}`;
      try {
        await N.promises.mkdir(s), Rt(`Directory created: ${s}`);
      } catch (P) {
        if (P.code !== "EEXIST")
          throw Ht(`Error creating directory: ${s}`, P), P;
      }
    }
  }
  const de = {
    async fill() {
      return Rt("authenticate", ge, me), { username: ge, password: me };
    },
    async rejected() {
      const N = new Error("Authentication rejected");
      throw Rt("Authentication rejected", N), N;
    }
  };
  async function Lu(N) {
    return await Ge(async () => {
      Yt.pullCount++;
      let h = {};
      await fe.lock();
      try {
        if (Rt("Entering pull function with arguments:", N), !Nt)
          throw new Error("Reference (ref) is not defined.");
        Rt("Using reference (ref):", Nt);
        const t = await (void 0)({
          ...N,
          fs: Gt,
          http: qe,
          dir: ce,
          corsProxy: He,
          remote: Oe,
          remoteRef: Nt,
          fastForward: !0,
          forced: !0,
          singleBranch: !0,
          headers: Ye(ge, me),
          onAuth() {
            return de.fill();
          },
          onAuthFailure() {
            return de.rejected();
          }
        });
        return h = { ref: Nt }, Rt("Pull successful. Result:", t), { success: !0, message: t, data: h };
      } catch (t) {
        if (t?.message?.includes("Could not find") && t?.code === "NotFoundError") {
          if (!await Ve(Lu, N, Yt.pullCount))
            throw t;
          return Yt.pullCount = 0, h = { ref: Nt }, { success: !0, message: "pull was successful", data: h };
        }
        throw Ht("Error occurred during pull operation:", t), new Error(`Pull failed: ${t}`);
      } finally {
        Rt("Exiting pull function."), fe.unlock();
      }
    }, N);
  }
  async function qu(N) {
    return await Ge(async () => {
      Yt.ffCount++;
      let h = {};
      await fe.lock();
      try {
        if (Rt("Entering fastForward function with arguments:", N), !Nt)
          throw new Error("Reference (ref) is not defined.");
        const t = await (void 0)({
          ...N,
          fs: Gt,
          cache: Gr,
          http: qe,
          dir: ce,
          remote: Oe,
          corsProxy: He,
          ref: Nt,
          remoteref: Nt,
          forced: !0,
          singleBranch: !1,
          headers: Ye(ge, me),
          onAuth() {
            return de.fill();
          },
          onAuthFailure() {
            return de.rejected();
          }
        });
        return h = { ref: Nt }, Rt("FastForward pull successful. Result:", t), { success: !0, message: t, data: h };
      } catch (t) {
        if (t?.message?.includes("Could not find") && t?.code === "NotFoundError") {
          if (!await Ve(qu, N, Yt.ffCount))
            throw t;
          return Yt.ffCount = 0, h = { ref: Nt }, { success: !0, message: "FastForward was successful", data: h };
        }
        throw Ht("Error occurred during fastForward operation:", t), new Error(`FastForward pull failed: ${t}`);
      } finally {
        Rt("Exiting fastForward function."), fe.unlock();
      }
    }, N);
  }
  async function Hu(N) {
    return await Ge(async () => {
      Yt.pushCount++;
      let h = {};
      await fe.lock();
      try {
        if (Rt("Entering push function with arguments:", N), !Nt)
          throw new Error("Reference (ref) is not defined.");
        const t = await (void 0)({
          ...N,
          fs: Gt,
          http: qe,
          dir: ce,
          corsProxy: He,
          remote: Oe,
          ref: Nt,
          force: !0,
          headers: Ye(ge, me),
          onAuth() {
            return de.fill();
          },
          onAuthFailure() {
            return de.rejected();
          }
        });
        return h = { ref: Nt }, Rt("Push successful. Result:", t), { success: !0, message: "Push was successful", data: h };
      } catch (t) {
        if (t?.message?.includes("Could not find") && t?.code === "NotFoundError") {
          if (!await Ve(Hu, N, Yt.pushCount))
            throw t;
          return Yt.pushCount = 0, h = { ref: Nt }, { success: !0, message: "Push was successful", data: h };
        }
        Ht("Error occurred during push operation:", t);
      } finally {
        Rt("Exiting push function."), fe.unlock();
      }
    }, N);
  }
  async function Wu(N) {
    return await Ge(async () => {
      Yt.fetchCount++;
      let h = {};
      await fe.lock();
      try {
        if (Rt("Entering doFetch function with arguments:", N), !Nt)
          throw new Error("Reference (ref) is not defined.");
        const t = await (void 0)({
          ...N,
          fs: Gt,
          http: qe,
          dir: ce,
          corsProxy: He,
          ref: Nt,
          remote: Oe,
          depth: er,
          singleBranch: !1,
          tags: !1,
          headers: Ye(ge, me),
          onAuth() {
            return de.fill();
          },
          onAuthFailure() {
            return de.rejected();
          }
        });
        return h = { ref: Nt }, Rt("Fetch successful. Result:", t), { success: !0, message: "Fetch was successful", data: h };
      } catch (t) {
        if (t?.message?.includes("Could not find") && t?.code === "NotFoundError") {
          if (!await Ve(Wu, N, Yt.fetchCount))
            throw t;
          return Yt.fetchCount = 0, h = { ref: Nt }, { success: !0, message: "The repo has successfully cloned", data: h };
        }
        throw Ht("Error occurred during fetch operation:", t), new Error(`Fetch failed: ${t}`);
      } finally {
        Rt("Exiting doFetch function."), fe.unlock();
      }
    }, N);
  }
  async function Ru(N, h) {
    try {
      const t = await caches.open(We);
      let s = await caches.match("log"), u = s ? await s.json() : [];
      const P = (/* @__PURE__ */ new Date()).toISOString(), c = { action: N, data: h, timestamp: P };
      u.push(c);
      let n = new Blob([JSON.stringify(u)]).size;
      const a = 5 * 1024;
      for (; n > a; )
        u.shift(), n = new Blob([JSON.stringify(u)]).size;
      const i = new Response(JSON.stringify(u), { headers: { "Content-Type": "application/json" } });
      await t.put("log", i), Rt(`Logged action: ${N} at ${P}`, c);
    } catch (t) {
      Ht("Error logging data to cache:", t);
    }
  }
  async function Dh() {
    try {
      const h = await (await caches.open(We)).match("log");
      if (h) {
        const t = await h.json();
        return Rt("Retrieved logs from cache:", t), t;
      } else
        return Rt("No logs found in cache."), [];
    } catch (N) {
      return Ht("Error retrieving logs from cache:", N), [];
    }
  }
  async function Ve(N, h, t) {
    Rt(`Attempt ${t + 1}: Branch "${Nt}" not found. Attempting to checkout to the other branch.`);
    try {
      if (t < 2)
        return fe.unlock(), Nt = Nt === "main" ? "master" : Nt === "master" ? "main" : void 0, Nt === void 0 ? (Ht("No default branch name found, you should set it manually!"), !1) : await N(h, t + 1);
      throw Ht("Exceeded the maximum number of retries. Please check the branch name manually."), Yt = {
        cloneCount: 0,
        pushCount: 0,
        pullCount: 0,
        fetchCount: 0,
        ffCount: 0
      }, new Error("Exceeded the maximum number of retries.");
    } catch (s) {
      throw Ht(`Checkout to branch "${Nt}" failed:`, s), s;
    }
  }
});
export default Mh();
//# sourceMappingURL=service-worker.js.map
