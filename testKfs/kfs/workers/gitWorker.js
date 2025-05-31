var tr = function(t) {
  var e = this;
  this.rpc_counter = 0, this.channel = t, this.foreign = /* @__PURE__ */ new Map(), this.local = /* @__PURE__ */ new Map(), this.calls = /* @__PURE__ */ new Map(), this.queue = [], this.connectionEstablished = !1, this.channel.addEventListener("message", function(r) {
    var i = r.data;
    if (i && typeof i == "object") switch (i.type) {
      case "MP_INIT":
        return e.onInit(i);
      case "MP_SET":
        return e.onSet(i);
      case "MP_CALL":
        return e.onCall(i);
      case "MP_RETURN":
        return e.onReturn(i);
    }
  }), this.channel.postMessage({ type: "MP_INIT", id: 1, reply: !0 });
};
tr.prototype.onInit = function(t) {
  this.connectionEstablished = !0;
  var e = this.queue;
  this.queue = [];
  for (var r = 0, i = e; r < i.length; r += 1)
    this.channel.postMessage(i[r]);
  t.reply && this.channel.postMessage({ type: "MP_INIT", reply: !1 });
}, tr.prototype.onSet = function(t) {
  for (var e = this, r = {}, i = t.object, n = function() {
    var l = o[a], f = !t.void.includes(l);
    r[l] = function() {
      for (var u = [], m = arguments.length; m--; ) u[m] = arguments[m];
      return e.rpc_counter = (e.rpc_counter + 1) % Number.MAX_SAFE_INTEGER, new Promise(function(g, y) {
        e.postMessage({ type: "MP_CALL", object: i, method: l, id: e.rpc_counter, args: u, reply: f }), f ? e.calls.set(e.rpc_counter, { resolve: g, reject: y }) : g();
      });
    };
  }, a = 0, o = t.methods; a < o.length; a += 1) n();
  var s = this.foreign.get(t.object);
  this.foreign.set(t.object, r), typeof s == "function" && s(r);
}, tr.prototype.onCall = function(t) {
  var e = this, r = this.local.get(t.object);
  r && r[t.method].apply(r, t.args).then(function(i) {
    return t.reply && e.channel.postMessage({ type: "MP_RETURN", id: t.id, result: i });
  }).catch(function(i) {
    return e.channel.postMessage({ type: "MP_RETURN", id: t.id, error: i.message });
  });
}, tr.prototype.onReturn = function(t) {
  if (this.calls.has(t.id)) {
    var e = this.calls.get(t.id), r = e.resolve, i = e.reject;
    this.calls.clear(t.id), t.error ? i(t.error) : r(t.result);
  }
}, tr.prototype.postMessage = function(t) {
  this.connectionEstablished ? this.channel.postMessage(t) : this.queue.push(t);
}, tr.prototype.set = function(t, e, r) {
  r === void 0 && (r = {}), this.local.set(t, e);
  var i = Object.entries(e).filter(function(n) {
    return typeof n[1] == "function";
  }).map(function(n) {
    return n[0];
  });
  this.postMessage({ type: "MP_SET", object: t, methods: i, void: r.void || [] });
}, tr.prototype.get = function(t) {
  return new Promise(function(e, r) {
    var i = this;
    return this.foreign.has(t) ? e(this.foreign.get(t)) : e(new Promise(function(n, a) {
      return i.foreign.set(t, n);
    }));
  }.bind(this));
};
function Ic(t) {
  var e = new tr(t);
  Object.defineProperties(this, { get: { writable: !1, configurable: !1, value: e.get.bind(e) }, set: { writable: !1, configurable: !1, value: e.set.bind(e) } });
}
var Uo = {}, Li = {};
Li.byteLength = $c;
Li.toByteArray = Ac;
Li.fromByteArray = Cc;
var Lt = [], Tt = [], Rc = typeof Uint8Array < "u" ? Uint8Array : Array, Vi = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Er = 0, Tc = Vi.length; Er < Tc; ++Er)
  Lt[Er] = Vi[Er], Tt[Vi.charCodeAt(Er)] = Er;
Tt[45] = 62;
Tt[95] = 63;
function Po(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var r = t.indexOf("=");
  r === -1 && (r = e);
  var i = r === e ? 0 : 4 - r % 4;
  return [r, i];
}
function $c(t) {
  var e = Po(t), r = e[0], i = e[1];
  return (r + i) * 3 / 4 - i;
}
function Bc(t, e, r) {
  return (e + r) * 3 / 4 - r;
}
function Ac(t) {
  var e, r = Po(t), i = r[0], n = r[1], a = new Rc(Bc(t, i, n)), o = 0, s = n > 0 ? i - 4 : i, l;
  for (l = 0; l < s; l += 4)
    e = Tt[t.charCodeAt(l)] << 18 | Tt[t.charCodeAt(l + 1)] << 12 | Tt[t.charCodeAt(l + 2)] << 6 | Tt[t.charCodeAt(l + 3)], a[o++] = e >> 16 & 255, a[o++] = e >> 8 & 255, a[o++] = e & 255;
  return n === 2 && (e = Tt[t.charCodeAt(l)] << 2 | Tt[t.charCodeAt(l + 1)] >> 4, a[o++] = e & 255), n === 1 && (e = Tt[t.charCodeAt(l)] << 10 | Tt[t.charCodeAt(l + 1)] << 4 | Tt[t.charCodeAt(l + 2)] >> 2, a[o++] = e >> 8 & 255, a[o++] = e & 255), a;
}
function Dc(t) {
  return Lt[t >> 18 & 63] + Lt[t >> 12 & 63] + Lt[t >> 6 & 63] + Lt[t & 63];
}
function Oc(t, e, r) {
  for (var i, n = [], a = e; a < r; a += 3)
    i = (t[a] << 16 & 16711680) + (t[a + 1] << 8 & 65280) + (t[a + 2] & 255), n.push(Dc(i));
  return n.join("");
}
function Cc(t) {
  for (var e, r = t.length, i = r % 3, n = [], a = 16383, o = 0, s = r - i; o < s; o += a)
    n.push(Oc(t, o, o + a > s ? s : o + a));
  return i === 1 ? (e = t[r - 1], n.push(
    Lt[e >> 2] + Lt[e << 4 & 63] + "=="
  )) : i === 2 && (e = (t[r - 2] << 8) + t[r - 1], n.push(
    Lt[e >> 10] + Lt[e >> 4 & 63] + Lt[e << 2 & 63] + "="
  )), n.join("");
}
var na = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
na.read = function(t, e, r, i, n) {
  var a, o, s = n * 8 - i - 1, l = (1 << s) - 1, f = l >> 1, u = -7, m = r ? n - 1 : 0, g = r ? -1 : 1, y = t[e + m];
  for (m += g, a = y & (1 << -u) - 1, y >>= -u, u += s; u > 0; a = a * 256 + t[e + m], m += g, u -= 8)
    ;
  for (o = a & (1 << -u) - 1, a >>= -u, u += i; u > 0; o = o * 256 + t[e + m], m += g, u -= 8)
    ;
  if (a === 0)
    a = 1 - f;
  else {
    if (a === l)
      return o ? NaN : (y ? -1 : 1) * (1 / 0);
    o = o + Math.pow(2, i), a = a - f;
  }
  return (y ? -1 : 1) * o * Math.pow(2, a - i);
};
na.write = function(t, e, r, i, n, a) {
  var o, s, l, f = a * 8 - n - 1, u = (1 << f) - 1, m = u >> 1, g = n === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, y = i ? 0 : a - 1, E = i ? 1 : -1, A = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0;
  for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (s = isNaN(e) ? 1 : 0, o = u) : (o = Math.floor(Math.log(e) / Math.LN2), e * (l = Math.pow(2, -o)) < 1 && (o--, l *= 2), o + m >= 1 ? e += g / l : e += g * Math.pow(2, 1 - m), e * l >= 2 && (o++, l /= 2), o + m >= u ? (s = 0, o = u) : o + m >= 1 ? (s = (e * l - 1) * Math.pow(2, n), o = o + m) : (s = e * Math.pow(2, m - 1) * Math.pow(2, n), o = 0)); n >= 8; t[r + y] = s & 255, y += E, s /= 256, n -= 8)
    ;
  for (o = o << n | s, f += n; f > 0; t[r + y] = o & 255, y += E, o /= 256, f -= 8)
    ;
  t[r + y - E] |= A * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(t) {
  const e = Li, r = na, i = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  t.Buffer = u, t.SlowBuffer = U, t.INSPECT_MAX_BYTES = 50;
  const n = 2147483647;
  t.kMaxLength = n;
  const { Uint8Array: a, ArrayBuffer: o, SharedArrayBuffer: s } = globalThis;
  u.TYPED_ARRAY_SUPPORT = l(), !u.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function l() {
    try {
      const k = new a(1), c = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(c, a.prototype), Object.setPrototypeOf(k, c), k.foo() === 42;
    } catch {
      return !1;
    }
  }
  Object.defineProperty(u.prototype, "parent", {
    enumerable: !0,
    get: function() {
      if (u.isBuffer(this))
        return this.buffer;
    }
  }), Object.defineProperty(u.prototype, "offset", {
    enumerable: !0,
    get: function() {
      if (u.isBuffer(this))
        return this.byteOffset;
    }
  });
  function f(k) {
    if (k > n)
      throw new RangeError('The value "' + k + '" is invalid for option "size"');
    const c = new a(k);
    return Object.setPrototypeOf(c, u.prototype), c;
  }
  function u(k, c, d) {
    if (typeof k == "number") {
      if (typeof c == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return E(k);
    }
    return m(k, c, d);
  }
  u.poolSize = 8192;
  function m(k, c, d) {
    if (typeof k == "string")
      return A(k, c);
    if (o.isView(k))
      return I(k);
    if (k == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof k
      );
    if (Ze(k, o) || k && Ze(k.buffer, o) || typeof s < "u" && (Ze(k, s) || k && Ze(k.buffer, s)))
      return R(k, c, d);
    if (typeof k == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const v = k.valueOf && k.valueOf();
    if (v != null && v !== k)
      return u.from(v, c, d);
    const C = D(k);
    if (C) return C;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof k[Symbol.toPrimitive] == "function")
      return u.from(k[Symbol.toPrimitive]("string"), c, d);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof k
    );
  }
  u.from = function(k, c, d) {
    return m(k, c, d);
  }, Object.setPrototypeOf(u.prototype, a.prototype), Object.setPrototypeOf(u, a);
  function g(k) {
    if (typeof k != "number")
      throw new TypeError('"size" argument must be of type number');
    if (k < 0)
      throw new RangeError('The value "' + k + '" is invalid for option "size"');
  }
  function y(k, c, d) {
    return g(k), k <= 0 ? f(k) : c !== void 0 ? typeof d == "string" ? f(k).fill(c, d) : f(k).fill(c) : f(k);
  }
  u.alloc = function(k, c, d) {
    return y(k, c, d);
  };
  function E(k) {
    return g(k), f(k < 0 ? 0 : L(k) | 0);
  }
  u.allocUnsafe = function(k) {
    return E(k);
  }, u.allocUnsafeSlow = function(k) {
    return E(k);
  };
  function A(k, c) {
    if ((typeof c != "string" || c === "") && (c = "utf8"), !u.isEncoding(c))
      throw new TypeError("Unknown encoding: " + c);
    const d = M(k, c) | 0;
    let v = f(d);
    const C = v.write(k, c);
    return C !== d && (v = v.slice(0, C)), v;
  }
  function T(k) {
    const c = k.length < 0 ? 0 : L(k.length) | 0, d = f(c);
    for (let v = 0; v < c; v += 1)
      d[v] = k[v] & 255;
    return d;
  }
  function I(k) {
    if (Ze(k, a)) {
      const c = new a(k);
      return R(c.buffer, c.byteOffset, c.byteLength);
    }
    return T(k);
  }
  function R(k, c, d) {
    if (c < 0 || k.byteLength < c)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (k.byteLength < c + (d || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let v;
    return c === void 0 && d === void 0 ? v = new a(k) : d === void 0 ? v = new a(k, c) : v = new a(k, c, d), Object.setPrototypeOf(v, u.prototype), v;
  }
  function D(k) {
    if (u.isBuffer(k)) {
      const c = L(k.length) | 0, d = f(c);
      return d.length === 0 || k.copy(d, 0, 0, c), d;
    }
    if (k.length !== void 0)
      return typeof k.length != "number" || vt(k.length) ? f(0) : T(k);
    if (k.type === "Buffer" && Array.isArray(k.data))
      return T(k.data);
  }
  function L(k) {
    if (k >= n)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + n.toString(16) + " bytes");
    return k | 0;
  }
  function U(k) {
    return +k != k && (k = 0), u.alloc(+k);
  }
  u.isBuffer = function(c) {
    return c != null && c._isBuffer === !0 && c !== u.prototype;
  }, u.compare = function(c, d) {
    if (Ze(c, a) && (c = u.from(c, c.offset, c.byteLength)), Ze(d, a) && (d = u.from(d, d.offset, d.byteLength)), !u.isBuffer(c) || !u.isBuffer(d))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (c === d) return 0;
    let v = c.length, C = d.length;
    for (let x = 0, N = Math.min(v, C); x < N; ++x)
      if (c[x] !== d[x]) {
        v = c[x], C = d[x];
        break;
      }
    return v < C ? -1 : C < v ? 1 : 0;
  }, u.isEncoding = function(c) {
    switch (String(c).toLowerCase()) {
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
  }, u.concat = function(c, d) {
    if (!Array.isArray(c))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (c.length === 0)
      return u.alloc(0);
    let v;
    if (d === void 0)
      for (d = 0, v = 0; v < c.length; ++v)
        d += c[v].length;
    const C = u.allocUnsafe(d);
    let x = 0;
    for (v = 0; v < c.length; ++v) {
      let N = c[v];
      if (Ze(N, a))
        x + N.length > C.length ? (u.isBuffer(N) || (N = u.from(N)), N.copy(C, x)) : a.prototype.set.call(
          C,
          N,
          x
        );
      else if (u.isBuffer(N))
        N.copy(C, x);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      x += N.length;
    }
    return C;
  };
  function M(k, c) {
    if (u.isBuffer(k))
      return k.length;
    if (o.isView(k) || Ze(k, o))
      return k.byteLength;
    if (typeof k != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof k
      );
    const d = k.length, v = arguments.length > 2 && arguments[2] === !0;
    if (!v && d === 0) return 0;
    let C = !1;
    for (; ; )
      switch (c) {
        case "ascii":
        case "latin1":
        case "binary":
          return d;
        case "utf8":
        case "utf-8":
          return St(k).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return d * 2;
        case "hex":
          return d >>> 1;
        case "base64":
          return Xe(k).length;
        default:
          if (C)
            return v ? -1 : St(k).length;
          c = ("" + c).toLowerCase(), C = !0;
      }
  }
  u.byteLength = M;
  function B(k, c, d) {
    let v = !1;
    if ((c === void 0 || c < 0) && (c = 0), c > this.length || ((d === void 0 || d > this.length) && (d = this.length), d <= 0) || (d >>>= 0, c >>>= 0, d <= c))
      return "";
    for (k || (k = "utf8"); ; )
      switch (k) {
        case "hex":
          return be(this, c, d);
        case "utf8":
        case "utf-8":
          return X(this, c, d);
        case "ascii":
          return Se(this, c, d);
        case "latin1":
        case "binary":
          return Te(this, c, d);
        case "base64":
          return ie(this, c, d);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Ae(this, c, d);
        default:
          if (v) throw new TypeError("Unknown encoding: " + k);
          k = (k + "").toLowerCase(), v = !0;
      }
  }
  u.prototype._isBuffer = !0;
  function O(k, c, d) {
    const v = k[c];
    k[c] = k[d], k[d] = v;
  }
  u.prototype.swap16 = function() {
    const c = this.length;
    if (c % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let d = 0; d < c; d += 2)
      O(this, d, d + 1);
    return this;
  }, u.prototype.swap32 = function() {
    const c = this.length;
    if (c % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let d = 0; d < c; d += 4)
      O(this, d, d + 3), O(this, d + 1, d + 2);
    return this;
  }, u.prototype.swap64 = function() {
    const c = this.length;
    if (c % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let d = 0; d < c; d += 8)
      O(this, d, d + 7), O(this, d + 1, d + 6), O(this, d + 2, d + 5), O(this, d + 3, d + 4);
    return this;
  }, u.prototype.toString = function() {
    const c = this.length;
    return c === 0 ? "" : arguments.length === 0 ? X(this, 0, c) : B.apply(this, arguments);
  }, u.prototype.toLocaleString = u.prototype.toString, u.prototype.equals = function(c) {
    if (!u.isBuffer(c)) throw new TypeError("Argument must be a Buffer");
    return this === c ? !0 : u.compare(this, c) === 0;
  }, u.prototype.inspect = function() {
    let c = "";
    const d = t.INSPECT_MAX_BYTES;
    return c = this.toString("hex", 0, d).replace(/(.{2})/g, "$1 ").trim(), this.length > d && (c += " ... "), "<Buffer " + c + ">";
  }, i && (u.prototype[i] = u.prototype.inspect), u.prototype.compare = function(c, d, v, C, x) {
    if (Ze(c, a) && (c = u.from(c, c.offset, c.byteLength)), !u.isBuffer(c))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof c
      );
    if (d === void 0 && (d = 0), v === void 0 && (v = c ? c.length : 0), C === void 0 && (C = 0), x === void 0 && (x = this.length), d < 0 || v > c.length || C < 0 || x > this.length)
      throw new RangeError("out of range index");
    if (C >= x && d >= v)
      return 0;
    if (C >= x)
      return -1;
    if (d >= v)
      return 1;
    if (d >>>= 0, v >>>= 0, C >>>= 0, x >>>= 0, this === c) return 0;
    let N = x - C, b = v - d;
    const Q = Math.min(N, b), le = this.slice(C, x), h = c.slice(d, v);
    for (let q = 0; q < Q; ++q)
      if (le[q] !== h[q]) {
        N = le[q], b = h[q];
        break;
      }
    return N < b ? -1 : b < N ? 1 : 0;
  };
  function W(k, c, d, v, C) {
    if (k.length === 0) return -1;
    if (typeof d == "string" ? (v = d, d = 0) : d > 2147483647 ? d = 2147483647 : d < -2147483648 && (d = -2147483648), d = +d, vt(d) && (d = C ? 0 : k.length - 1), d < 0 && (d = k.length + d), d >= k.length) {
      if (C) return -1;
      d = k.length - 1;
    } else if (d < 0)
      if (C) d = 0;
      else return -1;
    if (typeof c == "string" && (c = u.from(c, v)), u.isBuffer(c))
      return c.length === 0 ? -1 : z(k, c, d, v, C);
    if (typeof c == "number")
      return c = c & 255, typeof a.prototype.indexOf == "function" ? C ? a.prototype.indexOf.call(k, c, d) : a.prototype.lastIndexOf.call(k, c, d) : z(k, [c], d, v, C);
    throw new TypeError("val must be string, number or Buffer");
  }
  function z(k, c, d, v, C) {
    let x = 1, N = k.length, b = c.length;
    if (v !== void 0 && (v = String(v).toLowerCase(), v === "ucs2" || v === "ucs-2" || v === "utf16le" || v === "utf-16le")) {
      if (k.length < 2 || c.length < 2)
        return -1;
      x = 2, N /= 2, b /= 2, d /= 2;
    }
    function Q(h, q) {
      return x === 1 ? h[q] : h.readUInt16BE(q * x);
    }
    let le;
    if (C) {
      let h = -1;
      for (le = d; le < N; le++)
        if (Q(k, le) === Q(c, h === -1 ? 0 : le - h)) {
          if (h === -1 && (h = le), le - h + 1 === b) return h * x;
        } else
          h !== -1 && (le -= le - h), h = -1;
    } else
      for (d + b > N && (d = N - b), le = d; le >= 0; le--) {
        let h = !0;
        for (let q = 0; q < b; q++)
          if (Q(k, le + q) !== Q(c, q)) {
            h = !1;
            break;
          }
        if (h) return le;
      }
    return -1;
  }
  u.prototype.includes = function(c, d, v) {
    return this.indexOf(c, d, v) !== -1;
  }, u.prototype.indexOf = function(c, d, v) {
    return W(this, c, d, v, !0);
  }, u.prototype.lastIndexOf = function(c, d, v) {
    return W(this, c, d, v, !1);
  };
  function Y(k, c, d, v) {
    d = Number(d) || 0;
    const C = k.length - d;
    v ? (v = Number(v), v > C && (v = C)) : v = C;
    const x = c.length;
    v > x / 2 && (v = x / 2);
    let N;
    for (N = 0; N < v; ++N) {
      const b = parseInt(c.substr(N * 2, 2), 16);
      if (vt(b)) return N;
      k[d + N] = b;
    }
    return N;
  }
  function F(k, c, d, v) {
    return ut(St(c, k.length - d), k, d, v);
  }
  function J(k, c, d, v) {
    return ut(xt(c), k, d, v);
  }
  function se(k, c, d, v) {
    return ut(Xe(c), k, d, v);
  }
  function _e(k, c, d, v) {
    return ut(Ne(c, k.length - d), k, d, v);
  }
  u.prototype.write = function(c, d, v, C) {
    if (d === void 0)
      C = "utf8", v = this.length, d = 0;
    else if (v === void 0 && typeof d == "string")
      C = d, v = this.length, d = 0;
    else if (isFinite(d))
      d = d >>> 0, isFinite(v) ? (v = v >>> 0, C === void 0 && (C = "utf8")) : (C = v, v = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    const x = this.length - d;
    if ((v === void 0 || v > x) && (v = x), c.length > 0 && (v < 0 || d < 0) || d > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    C || (C = "utf8");
    let N = !1;
    for (; ; )
      switch (C) {
        case "hex":
          return Y(this, c, d, v);
        case "utf8":
        case "utf-8":
          return F(this, c, d, v);
        case "ascii":
        case "latin1":
        case "binary":
          return J(this, c, d, v);
        case "base64":
          return se(this, c, d, v);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return _e(this, c, d, v);
        default:
          if (N) throw new TypeError("Unknown encoding: " + C);
          C = ("" + C).toLowerCase(), N = !0;
      }
  }, u.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function ie(k, c, d) {
    return c === 0 && d === k.length ? e.fromByteArray(k) : e.fromByteArray(k.slice(c, d));
  }
  function X(k, c, d) {
    d = Math.min(k.length, d);
    const v = [];
    let C = c;
    for (; C < d; ) {
      const x = k[C];
      let N = null, b = x > 239 ? 4 : x > 223 ? 3 : x > 191 ? 2 : 1;
      if (C + b <= d) {
        let Q, le, h, q;
        switch (b) {
          case 1:
            x < 128 && (N = x);
            break;
          case 2:
            Q = k[C + 1], (Q & 192) === 128 && (q = (x & 31) << 6 | Q & 63, q > 127 && (N = q));
            break;
          case 3:
            Q = k[C + 1], le = k[C + 2], (Q & 192) === 128 && (le & 192) === 128 && (q = (x & 15) << 12 | (Q & 63) << 6 | le & 63, q > 2047 && (q < 55296 || q > 57343) && (N = q));
            break;
          case 4:
            Q = k[C + 1], le = k[C + 2], h = k[C + 3], (Q & 192) === 128 && (le & 192) === 128 && (h & 192) === 128 && (q = (x & 15) << 18 | (Q & 63) << 12 | (le & 63) << 6 | h & 63, q > 65535 && q < 1114112 && (N = q));
        }
      }
      N === null ? (N = 65533, b = 1) : N > 65535 && (N -= 65536, v.push(N >>> 10 & 1023 | 55296), N = 56320 | N & 1023), v.push(N), C += b;
    }
    return de(v);
  }
  const ne = 4096;
  function de(k) {
    const c = k.length;
    if (c <= ne)
      return String.fromCharCode.apply(String, k);
    let d = "", v = 0;
    for (; v < c; )
      d += String.fromCharCode.apply(
        String,
        k.slice(v, v += ne)
      );
    return d;
  }
  function Se(k, c, d) {
    let v = "";
    d = Math.min(k.length, d);
    for (let C = c; C < d; ++C)
      v += String.fromCharCode(k[C] & 127);
    return v;
  }
  function Te(k, c, d) {
    let v = "";
    d = Math.min(k.length, d);
    for (let C = c; C < d; ++C)
      v += String.fromCharCode(k[C]);
    return v;
  }
  function be(k, c, d) {
    const v = k.length;
    (!c || c < 0) && (c = 0), (!d || d < 0 || d > v) && (d = v);
    let C = "";
    for (let x = c; x < d; ++x)
      C += Et[k[x]];
    return C;
  }
  function Ae(k, c, d) {
    const v = k.slice(c, d);
    let C = "";
    for (let x = 0; x < v.length - 1; x += 2)
      C += String.fromCharCode(v[x] + v[x + 1] * 256);
    return C;
  }
  u.prototype.slice = function(c, d) {
    const v = this.length;
    c = ~~c, d = d === void 0 ? v : ~~d, c < 0 ? (c += v, c < 0 && (c = 0)) : c > v && (c = v), d < 0 ? (d += v, d < 0 && (d = 0)) : d > v && (d = v), d < c && (d = c);
    const C = this.subarray(c, d);
    return Object.setPrototypeOf(C, u.prototype), C;
  };
  function ye(k, c, d) {
    if (k % 1 !== 0 || k < 0) throw new RangeError("offset is not uint");
    if (k + c > d) throw new RangeError("Trying to access beyond buffer length");
  }
  u.prototype.readUintLE = u.prototype.readUIntLE = function(c, d, v) {
    c = c >>> 0, d = d >>> 0, v || ye(c, d, this.length);
    let C = this[c], x = 1, N = 0;
    for (; ++N < d && (x *= 256); )
      C += this[c + N] * x;
    return C;
  }, u.prototype.readUintBE = u.prototype.readUIntBE = function(c, d, v) {
    c = c >>> 0, d = d >>> 0, v || ye(c, d, this.length);
    let C = this[c + --d], x = 1;
    for (; d > 0 && (x *= 256); )
      C += this[c + --d] * x;
    return C;
  }, u.prototype.readUint8 = u.prototype.readUInt8 = function(c, d) {
    return c = c >>> 0, d || ye(c, 1, this.length), this[c];
  }, u.prototype.readUint16LE = u.prototype.readUInt16LE = function(c, d) {
    return c = c >>> 0, d || ye(c, 2, this.length), this[c] | this[c + 1] << 8;
  }, u.prototype.readUint16BE = u.prototype.readUInt16BE = function(c, d) {
    return c = c >>> 0, d || ye(c, 2, this.length), this[c] << 8 | this[c + 1];
  }, u.prototype.readUint32LE = u.prototype.readUInt32LE = function(c, d) {
    return c = c >>> 0, d || ye(c, 4, this.length), (this[c] | this[c + 1] << 8 | this[c + 2] << 16) + this[c + 3] * 16777216;
  }, u.prototype.readUint32BE = u.prototype.readUInt32BE = function(c, d) {
    return c = c >>> 0, d || ye(c, 4, this.length), this[c] * 16777216 + (this[c + 1] << 16 | this[c + 2] << 8 | this[c + 3]);
  }, u.prototype.readBigUInt64LE = Pe(function(c) {
    c = c >>> 0, ze(c, "offset");
    const d = this[c], v = this[c + 7];
    (d === void 0 || v === void 0) && Ce(c, this.length - 8);
    const C = d + this[++c] * 2 ** 8 + this[++c] * 2 ** 16 + this[++c] * 2 ** 24, x = this[++c] + this[++c] * 2 ** 8 + this[++c] * 2 ** 16 + v * 2 ** 24;
    return BigInt(C) + (BigInt(x) << BigInt(32));
  }), u.prototype.readBigUInt64BE = Pe(function(c) {
    c = c >>> 0, ze(c, "offset");
    const d = this[c], v = this[c + 7];
    (d === void 0 || v === void 0) && Ce(c, this.length - 8);
    const C = d * 2 ** 24 + this[++c] * 2 ** 16 + this[++c] * 2 ** 8 + this[++c], x = this[++c] * 2 ** 24 + this[++c] * 2 ** 16 + this[++c] * 2 ** 8 + v;
    return (BigInt(C) << BigInt(32)) + BigInt(x);
  }), u.prototype.readIntLE = function(c, d, v) {
    c = c >>> 0, d = d >>> 0, v || ye(c, d, this.length);
    let C = this[c], x = 1, N = 0;
    for (; ++N < d && (x *= 256); )
      C += this[c + N] * x;
    return x *= 128, C >= x && (C -= Math.pow(2, 8 * d)), C;
  }, u.prototype.readIntBE = function(c, d, v) {
    c = c >>> 0, d = d >>> 0, v || ye(c, d, this.length);
    let C = d, x = 1, N = this[c + --C];
    for (; C > 0 && (x *= 256); )
      N += this[c + --C] * x;
    return x *= 128, N >= x && (N -= Math.pow(2, 8 * d)), N;
  }, u.prototype.readInt8 = function(c, d) {
    return c = c >>> 0, d || ye(c, 1, this.length), this[c] & 128 ? (255 - this[c] + 1) * -1 : this[c];
  }, u.prototype.readInt16LE = function(c, d) {
    c = c >>> 0, d || ye(c, 2, this.length);
    const v = this[c] | this[c + 1] << 8;
    return v & 32768 ? v | 4294901760 : v;
  }, u.prototype.readInt16BE = function(c, d) {
    c = c >>> 0, d || ye(c, 2, this.length);
    const v = this[c + 1] | this[c] << 8;
    return v & 32768 ? v | 4294901760 : v;
  }, u.prototype.readInt32LE = function(c, d) {
    return c = c >>> 0, d || ye(c, 4, this.length), this[c] | this[c + 1] << 8 | this[c + 2] << 16 | this[c + 3] << 24;
  }, u.prototype.readInt32BE = function(c, d) {
    return c = c >>> 0, d || ye(c, 4, this.length), this[c] << 24 | this[c + 1] << 16 | this[c + 2] << 8 | this[c + 3];
  }, u.prototype.readBigInt64LE = Pe(function(c) {
    c = c >>> 0, ze(c, "offset");
    const d = this[c], v = this[c + 7];
    (d === void 0 || v === void 0) && Ce(c, this.length - 8);
    const C = this[c + 4] + this[c + 5] * 2 ** 8 + this[c + 6] * 2 ** 16 + (v << 24);
    return (BigInt(C) << BigInt(32)) + BigInt(d + this[++c] * 2 ** 8 + this[++c] * 2 ** 16 + this[++c] * 2 ** 24);
  }), u.prototype.readBigInt64BE = Pe(function(c) {
    c = c >>> 0, ze(c, "offset");
    const d = this[c], v = this[c + 7];
    (d === void 0 || v === void 0) && Ce(c, this.length - 8);
    const C = (d << 24) + // Overflow
    this[++c] * 2 ** 16 + this[++c] * 2 ** 8 + this[++c];
    return (BigInt(C) << BigInt(32)) + BigInt(this[++c] * 2 ** 24 + this[++c] * 2 ** 16 + this[++c] * 2 ** 8 + v);
  }), u.prototype.readFloatLE = function(c, d) {
    return c = c >>> 0, d || ye(c, 4, this.length), r.read(this, c, !0, 23, 4);
  }, u.prototype.readFloatBE = function(c, d) {
    return c = c >>> 0, d || ye(c, 4, this.length), r.read(this, c, !1, 23, 4);
  }, u.prototype.readDoubleLE = function(c, d) {
    return c = c >>> 0, d || ye(c, 8, this.length), r.read(this, c, !0, 52, 8);
  }, u.prototype.readDoubleBE = function(c, d) {
    return c = c >>> 0, d || ye(c, 8, this.length), r.read(this, c, !1, 52, 8);
  };
  function $e(k, c, d, v, C, x) {
    if (!u.isBuffer(k)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (c > C || c < x) throw new RangeError('"value" argument is out of bounds');
    if (d + v > k.length) throw new RangeError("Index out of range");
  }
  u.prototype.writeUintLE = u.prototype.writeUIntLE = function(c, d, v, C) {
    if (c = +c, d = d >>> 0, v = v >>> 0, !C) {
      const b = Math.pow(2, 8 * v) - 1;
      $e(this, c, d, v, b, 0);
    }
    let x = 1, N = 0;
    for (this[d] = c & 255; ++N < v && (x *= 256); )
      this[d + N] = c / x & 255;
    return d + v;
  }, u.prototype.writeUintBE = u.prototype.writeUIntBE = function(c, d, v, C) {
    if (c = +c, d = d >>> 0, v = v >>> 0, !C) {
      const b = Math.pow(2, 8 * v) - 1;
      $e(this, c, d, v, b, 0);
    }
    let x = v - 1, N = 1;
    for (this[d + x] = c & 255; --x >= 0 && (N *= 256); )
      this[d + x] = c / N & 255;
    return d + v;
  }, u.prototype.writeUint8 = u.prototype.writeUInt8 = function(c, d, v) {
    return c = +c, d = d >>> 0, v || $e(this, c, d, 1, 255, 0), this[d] = c & 255, d + 1;
  }, u.prototype.writeUint16LE = u.prototype.writeUInt16LE = function(c, d, v) {
    return c = +c, d = d >>> 0, v || $e(this, c, d, 2, 65535, 0), this[d] = c & 255, this[d + 1] = c >>> 8, d + 2;
  }, u.prototype.writeUint16BE = u.prototype.writeUInt16BE = function(c, d, v) {
    return c = +c, d = d >>> 0, v || $e(this, c, d, 2, 65535, 0), this[d] = c >>> 8, this[d + 1] = c & 255, d + 2;
  }, u.prototype.writeUint32LE = u.prototype.writeUInt32LE = function(c, d, v) {
    return c = +c, d = d >>> 0, v || $e(this, c, d, 4, 4294967295, 0), this[d + 3] = c >>> 24, this[d + 2] = c >>> 16, this[d + 1] = c >>> 8, this[d] = c & 255, d + 4;
  }, u.prototype.writeUint32BE = u.prototype.writeUInt32BE = function(c, d, v) {
    return c = +c, d = d >>> 0, v || $e(this, c, d, 4, 4294967295, 0), this[d] = c >>> 24, this[d + 1] = c >>> 16, this[d + 2] = c >>> 8, this[d + 3] = c & 255, d + 4;
  };
  function ke(k, c, d, v, C) {
    Me(c, v, C, k, d, 7);
    let x = Number(c & BigInt(4294967295));
    k[d++] = x, x = x >> 8, k[d++] = x, x = x >> 8, k[d++] = x, x = x >> 8, k[d++] = x;
    let N = Number(c >> BigInt(32) & BigInt(4294967295));
    return k[d++] = N, N = N >> 8, k[d++] = N, N = N >> 8, k[d++] = N, N = N >> 8, k[d++] = N, d;
  }
  function Ee(k, c, d, v, C) {
    Me(c, v, C, k, d, 7);
    let x = Number(c & BigInt(4294967295));
    k[d + 7] = x, x = x >> 8, k[d + 6] = x, x = x >> 8, k[d + 5] = x, x = x >> 8, k[d + 4] = x;
    let N = Number(c >> BigInt(32) & BigInt(4294967295));
    return k[d + 3] = N, N = N >> 8, k[d + 2] = N, N = N >> 8, k[d + 1] = N, N = N >> 8, k[d] = N, d + 8;
  }
  u.prototype.writeBigUInt64LE = Pe(function(c, d = 0) {
    return ke(this, c, d, BigInt(0), BigInt("0xffffffffffffffff"));
  }), u.prototype.writeBigUInt64BE = Pe(function(c, d = 0) {
    return Ee(this, c, d, BigInt(0), BigInt("0xffffffffffffffff"));
  }), u.prototype.writeIntLE = function(c, d, v, C) {
    if (c = +c, d = d >>> 0, !C) {
      const Q = Math.pow(2, 8 * v - 1);
      $e(this, c, d, v, Q - 1, -Q);
    }
    let x = 0, N = 1, b = 0;
    for (this[d] = c & 255; ++x < v && (N *= 256); )
      c < 0 && b === 0 && this[d + x - 1] !== 0 && (b = 1), this[d + x] = (c / N >> 0) - b & 255;
    return d + v;
  }, u.prototype.writeIntBE = function(c, d, v, C) {
    if (c = +c, d = d >>> 0, !C) {
      const Q = Math.pow(2, 8 * v - 1);
      $e(this, c, d, v, Q - 1, -Q);
    }
    let x = v - 1, N = 1, b = 0;
    for (this[d + x] = c & 255; --x >= 0 && (N *= 256); )
      c < 0 && b === 0 && this[d + x + 1] !== 0 && (b = 1), this[d + x] = (c / N >> 0) - b & 255;
    return d + v;
  }, u.prototype.writeInt8 = function(c, d, v) {
    return c = +c, d = d >>> 0, v || $e(this, c, d, 1, 127, -128), c < 0 && (c = 255 + c + 1), this[d] = c & 255, d + 1;
  }, u.prototype.writeInt16LE = function(c, d, v) {
    return c = +c, d = d >>> 0, v || $e(this, c, d, 2, 32767, -32768), this[d] = c & 255, this[d + 1] = c >>> 8, d + 2;
  }, u.prototype.writeInt16BE = function(c, d, v) {
    return c = +c, d = d >>> 0, v || $e(this, c, d, 2, 32767, -32768), this[d] = c >>> 8, this[d + 1] = c & 255, d + 2;
  }, u.prototype.writeInt32LE = function(c, d, v) {
    return c = +c, d = d >>> 0, v || $e(this, c, d, 4, 2147483647, -2147483648), this[d] = c & 255, this[d + 1] = c >>> 8, this[d + 2] = c >>> 16, this[d + 3] = c >>> 24, d + 4;
  }, u.prototype.writeInt32BE = function(c, d, v) {
    return c = +c, d = d >>> 0, v || $e(this, c, d, 4, 2147483647, -2147483648), c < 0 && (c = 4294967295 + c + 1), this[d] = c >>> 24, this[d + 1] = c >>> 16, this[d + 2] = c >>> 8, this[d + 3] = c & 255, d + 4;
  }, u.prototype.writeBigInt64LE = Pe(function(c, d = 0) {
    return ke(this, c, d, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), u.prototype.writeBigInt64BE = Pe(function(c, d = 0) {
    return Ee(this, c, d, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function De(k, c, d, v, C, x) {
    if (d + v > k.length) throw new RangeError("Index out of range");
    if (d < 0) throw new RangeError("Index out of range");
  }
  function qe(k, c, d, v, C) {
    return c = +c, d = d >>> 0, C || De(k, c, d, 4), r.write(k, c, d, v, 23, 4), d + 4;
  }
  u.prototype.writeFloatLE = function(c, d, v) {
    return qe(this, c, d, !0, v);
  }, u.prototype.writeFloatBE = function(c, d, v) {
    return qe(this, c, d, !1, v);
  };
  function rt(k, c, d, v, C) {
    return c = +c, d = d >>> 0, C || De(k, c, d, 8), r.write(k, c, d, v, 52, 8), d + 8;
  }
  u.prototype.writeDoubleLE = function(c, d, v) {
    return rt(this, c, d, !0, v);
  }, u.prototype.writeDoubleBE = function(c, d, v) {
    return rt(this, c, d, !1, v);
  }, u.prototype.copy = function(c, d, v, C) {
    if (!u.isBuffer(c)) throw new TypeError("argument should be a Buffer");
    if (v || (v = 0), !C && C !== 0 && (C = this.length), d >= c.length && (d = c.length), d || (d = 0), C > 0 && C < v && (C = v), C === v || c.length === 0 || this.length === 0) return 0;
    if (d < 0)
      throw new RangeError("targetStart out of bounds");
    if (v < 0 || v >= this.length) throw new RangeError("Index out of range");
    if (C < 0) throw new RangeError("sourceEnd out of bounds");
    C > this.length && (C = this.length), c.length - d < C - v && (C = c.length - d + v);
    const x = C - v;
    return this === c && typeof a.prototype.copyWithin == "function" ? this.copyWithin(d, v, C) : a.prototype.set.call(
      c,
      this.subarray(v, C),
      d
    ), x;
  }, u.prototype.fill = function(c, d, v, C) {
    if (typeof c == "string") {
      if (typeof d == "string" ? (C = d, d = 0, v = this.length) : typeof v == "string" && (C = v, v = this.length), C !== void 0 && typeof C != "string")
        throw new TypeError("encoding must be a string");
      if (typeof C == "string" && !u.isEncoding(C))
        throw new TypeError("Unknown encoding: " + C);
      if (c.length === 1) {
        const N = c.charCodeAt(0);
        (C === "utf8" && N < 128 || C === "latin1") && (c = N);
      }
    } else typeof c == "number" ? c = c & 255 : typeof c == "boolean" && (c = Number(c));
    if (d < 0 || this.length < d || this.length < v)
      throw new RangeError("Out of range index");
    if (v <= d)
      return this;
    d = d >>> 0, v = v === void 0 ? this.length : v >>> 0, c || (c = 0);
    let x;
    if (typeof c == "number")
      for (x = d; x < v; ++x)
        this[x] = c;
    else {
      const N = u.isBuffer(c) ? c : u.from(c, C), b = N.length;
      if (b === 0)
        throw new TypeError('The value "' + c + '" is invalid for argument "value"');
      for (x = 0; x < v - d; ++x)
        this[x + d] = N[x % b];
    }
    return this;
  };
  const je = {};
  function we(k, c, d) {
    je[k] = class extends d {
      constructor() {
        super(), Object.defineProperty(this, "message", {
          value: c.apply(this, arguments),
          writable: !0,
          configurable: !0
        }), this.name = `${this.name} [${k}]`, this.stack, delete this.name;
      }
      get code() {
        return k;
      }
      set code(C) {
        Object.defineProperty(this, "code", {
          configurable: !0,
          enumerable: !0,
          value: C,
          writable: !0
        });
      }
      toString() {
        return `${this.name} [${k}]: ${this.message}`;
      }
    };
  }
  we(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function(k) {
      return k ? `${k} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    },
    RangeError
  ), we(
    "ERR_INVALID_ARG_TYPE",
    function(k, c) {
      return `The "${k}" argument must be of type number. Received type ${typeof c}`;
    },
    TypeError
  ), we(
    "ERR_OUT_OF_RANGE",
    function(k, c, d) {
      let v = `The value of "${k}" is out of range.`, C = d;
      return Number.isInteger(d) && Math.abs(d) > 2 ** 32 ? C = Oe(String(d)) : typeof d == "bigint" && (C = String(d), (d > BigInt(2) ** BigInt(32) || d < -(BigInt(2) ** BigInt(32))) && (C = Oe(C)), C += "n"), v += ` It must be ${c}. Received ${C}`, v;
    },
    RangeError
  );
  function Oe(k) {
    let c = "", d = k.length;
    const v = k[0] === "-" ? 1 : 0;
    for (; d >= v + 4; d -= 3)
      c = `_${k.slice(d - 3, d)}${c}`;
    return `${k.slice(0, d)}${c}`;
  }
  function Ve(k, c, d) {
    ze(c, "offset"), (k[c] === void 0 || k[c + d] === void 0) && Ce(c, k.length - (d + 1));
  }
  function Me(k, c, d, v, C, x) {
    if (k > d || k < c) {
      const N = typeof c == "bigint" ? "n" : "";
      let b;
      throw c === 0 || c === BigInt(0) ? b = `>= 0${N} and < 2${N} ** ${(x + 1) * 8}${N}` : b = `>= -(2${N} ** ${(x + 1) * 8 - 1}${N}) and < 2 ** ${(x + 1) * 8 - 1}${N}`, new je.ERR_OUT_OF_RANGE("value", b, k);
    }
    Ve(v, C, x);
  }
  function ze(k, c) {
    if (typeof k != "number")
      throw new je.ERR_INVALID_ARG_TYPE(c, "number", k);
  }
  function Ce(k, c, d) {
    throw Math.floor(k) !== k ? (ze(k, d), new je.ERR_OUT_OF_RANGE("offset", "an integer", k)) : c < 0 ? new je.ERR_BUFFER_OUT_OF_BOUNDS() : new je.ERR_OUT_OF_RANGE(
      "offset",
      `>= 0 and <= ${c}`,
      k
    );
  }
  const xe = /[^+/0-9A-Za-z-_]/g;
  function lt(k) {
    if (k = k.split("=")[0], k = k.trim().replace(xe, ""), k.length < 2) return "";
    for (; k.length % 4 !== 0; )
      k = k + "=";
    return k;
  }
  function St(k, c) {
    c = c || 1 / 0;
    let d;
    const v = k.length;
    let C = null;
    const x = [];
    for (let N = 0; N < v; ++N) {
      if (d = k.charCodeAt(N), d > 55295 && d < 57344) {
        if (!C) {
          if (d > 56319) {
            (c -= 3) > -1 && x.push(239, 191, 189);
            continue;
          } else if (N + 1 === v) {
            (c -= 3) > -1 && x.push(239, 191, 189);
            continue;
          }
          C = d;
          continue;
        }
        if (d < 56320) {
          (c -= 3) > -1 && x.push(239, 191, 189), C = d;
          continue;
        }
        d = (C - 55296 << 10 | d - 56320) + 65536;
      } else C && (c -= 3) > -1 && x.push(239, 191, 189);
      if (C = null, d < 128) {
        if ((c -= 1) < 0) break;
        x.push(d);
      } else if (d < 2048) {
        if ((c -= 2) < 0) break;
        x.push(
          d >> 6 | 192,
          d & 63 | 128
        );
      } else if (d < 65536) {
        if ((c -= 3) < 0) break;
        x.push(
          d >> 12 | 224,
          d >> 6 & 63 | 128,
          d & 63 | 128
        );
      } else if (d < 1114112) {
        if ((c -= 4) < 0) break;
        x.push(
          d >> 18 | 240,
          d >> 12 & 63 | 128,
          d >> 6 & 63 | 128,
          d & 63 | 128
        );
      } else
        throw new Error("Invalid code point");
    }
    return x;
  }
  function xt(k) {
    const c = [];
    for (let d = 0; d < k.length; ++d)
      c.push(k.charCodeAt(d) & 255);
    return c;
  }
  function Ne(k, c) {
    let d, v, C;
    const x = [];
    for (let N = 0; N < k.length && !((c -= 2) < 0); ++N)
      d = k.charCodeAt(N), v = d >> 8, C = d % 256, x.push(C), x.push(v);
    return x;
  }
  function Xe(k) {
    return e.toByteArray(lt(k));
  }
  function ut(k, c, d, v) {
    let C;
    for (C = 0; C < v && !(C + d >= c.length || C >= k.length); ++C)
      c[C + d] = k[C];
    return C;
  }
  function Ze(k, c) {
    return k instanceof c || k != null && k.constructor != null && k.constructor.name != null && k.constructor.name === c.name;
  }
  function vt(k) {
    return k !== k;
  }
  const Et = function() {
    const k = "0123456789abcdef", c = new Array(256);
    for (let d = 0; d < 16; ++d) {
      const v = d * 16;
      for (let C = 0; C < 16; ++C)
        c[v + C] = k[d] + k[C];
    }
    return c;
  }();
  function Pe(k) {
    return typeof BigInt > "u" ? nt : k;
  }
  function nt() {
    throw new Error("BigInt not supported");
  }
})(Uo);
const fe = Uo.Buffer;
function Fc(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var Lo = { exports: {} }, tt = Lo.exports = {}, Ut, Pt;
function Zn() {
  throw new Error("setTimeout has not been defined");
}
function Vn() {
  throw new Error("clearTimeout has not been defined");
}
(function() {
  try {
    typeof setTimeout == "function" ? Ut = setTimeout : Ut = Zn;
  } catch {
    Ut = Zn;
  }
  try {
    typeof clearTimeout == "function" ? Pt = clearTimeout : Pt = Vn;
  } catch {
    Pt = Vn;
  }
})();
function jo(t) {
  if (Ut === setTimeout)
    return setTimeout(t, 0);
  if ((Ut === Zn || !Ut) && setTimeout)
    return Ut = setTimeout, setTimeout(t, 0);
  try {
    return Ut(t, 0);
  } catch {
    try {
      return Ut.call(null, t, 0);
    } catch {
      return Ut.call(this, t, 0);
    }
  }
}
function Nc(t) {
  if (Pt === clearTimeout)
    return clearTimeout(t);
  if ((Pt === Vn || !Pt) && clearTimeout)
    return Pt = clearTimeout, clearTimeout(t);
  try {
    return Pt(t);
  } catch {
    try {
      return Pt.call(null, t);
    } catch {
      return Pt.call(this, t);
    }
  }
}
var Vt = [], xr = !1, mr, Ti = -1;
function Mc() {
  !xr || !mr || (xr = !1, mr.length ? Vt = mr.concat(Vt) : Ti = -1, Vt.length && zo());
}
function zo() {
  if (!xr) {
    var t = jo(Mc);
    xr = !0;
    for (var e = Vt.length; e; ) {
      for (mr = Vt, Vt = []; ++Ti < e; )
        mr && mr[Ti].run();
      Ti = -1, e = Vt.length;
    }
    mr = null, xr = !1, Nc(t);
  }
}
tt.nextTick = function(t) {
  var e = new Array(arguments.length - 1);
  if (arguments.length > 1)
    for (var r = 1; r < arguments.length; r++)
      e[r - 1] = arguments[r];
  Vt.push(new Ho(t, e)), Vt.length === 1 && !xr && jo(zo);
};
function Ho(t, e) {
  this.fun = t, this.array = e;
}
Ho.prototype.run = function() {
  this.fun.apply(null, this.array);
};
tt.title = "browser";
tt.browser = !0;
tt.env = {};
tt.argv = [];
tt.version = "";
tt.versions = {};
function Jt() {
}
tt.on = Jt;
tt.addListener = Jt;
tt.once = Jt;
tt.off = Jt;
tt.removeListener = Jt;
tt.removeAllListeners = Jt;
tt.emit = Jt;
tt.prependListener = Jt;
tt.prependOnceListener = Jt;
tt.listeners = function(t) {
  return [];
};
tt.binding = function(t) {
  throw new Error("process.binding is not supported");
};
tt.cwd = function() {
  return "/";
};
tt.chdir = function(t) {
  throw new Error("process.chdir is not supported");
};
tt.umask = function() {
  return 0;
};
var Uc = Lo.exports;
const gt = /* @__PURE__ */ Fc(Uc);
function Qt(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Pc(t) {
  if (Object.prototype.hasOwnProperty.call(t, "__esModule")) return t;
  var e = t.default;
  if (typeof e == "function") {
    var r = function i() {
      return this instanceof i ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    r.prototype = e.prototype;
  } else r = {};
  return Object.defineProperty(r, "__esModule", { value: !0 }), Object.keys(t).forEach(function(i) {
    var n = Object.getOwnPropertyDescriptor(t, i);
    Object.defineProperty(r, i, n.get ? n : {
      enumerable: !0,
      get: function() {
        return t[i];
      }
    });
  }), r;
}
var Xi, ba;
function Lc() {
  if (ba) return Xi;
  ba = 1;
  var t = function(e) {
    if (e = e || {}, this.Promise = e.Promise || Promise, this.queues = /* @__PURE__ */ Object.create(null), this.domainReentrant = e.domainReentrant || !1, this.domainReentrant) {
      if (typeof gt > "u" || typeof gt.domain > "u")
        throw new Error(
          "Domain-reentrant locks require `process.domain` to exist. Please flip `opts.domainReentrant = false`, use a NodeJS version that still implements Domain, or install a browser polyfill."
        );
      this.domains = /* @__PURE__ */ Object.create(null);
    }
    this.timeout = e.timeout || t.DEFAULT_TIMEOUT, this.maxOccupationTime = e.maxOccupationTime || t.DEFAULT_MAX_OCCUPATION_TIME, this.maxExecutionTime = e.maxExecutionTime || t.DEFAULT_MAX_EXECUTION_TIME, e.maxPending === 1 / 0 || Number.isInteger(e.maxPending) && e.maxPending >= 0 ? this.maxPending = e.maxPending : this.maxPending = t.DEFAULT_MAX_PENDING;
  };
  return t.DEFAULT_TIMEOUT = 0, t.DEFAULT_MAX_OCCUPATION_TIME = 0, t.DEFAULT_MAX_EXECUTION_TIME = 0, t.DEFAULT_MAX_PENDING = 1e3, t.prototype.acquire = function(e, r, i, n) {
    if (Array.isArray(e))
      return this._acquireBatch(e, r, i, n);
    if (typeof r != "function")
      throw new Error("You must pass a function to execute");
    var a = null, o = null, s = null;
    typeof i != "function" && (n = i, i = null, s = new this.Promise(function(D, L) {
      a = D, o = L;
    })), n = n || {};
    var l = !1, f = null, u = null, m = null, g = this, y = function(D, L, U) {
      u && (clearTimeout(u), u = null), m && (clearTimeout(m), m = null), D && (g.queues[e] && g.queues[e].length === 0 && delete g.queues[e], g.domainReentrant && delete g.domains[e]), l || (s ? L ? o(L) : a(U) : typeof i == "function" && i(L, U), l = !0), D && g.queues[e] && g.queues[e].length > 0 && g.queues[e].shift()();
    }, E = function(D) {
      if (l)
        return y(D);
      f && (clearTimeout(f), f = null), g.domainReentrant && D && (g.domains[e] = gt.domain);
      var L = n.maxExecutionTime || g.maxExecutionTime;
      if (L && (m = setTimeout(function() {
        g.queues[e] && y(D, new Error("Maximum execution time is exceeded " + e));
      }, L)), r.length === 1) {
        var U = !1;
        try {
          r(function(M, B) {
            U || (U = !0, y(D, M, B));
          });
        } catch (M) {
          U || (U = !0, y(D, M));
        }
      } else
        g._promiseTry(function() {
          return r();
        }).then(function(M) {
          y(D, void 0, M);
        }, function(M) {
          y(D, M);
        });
    };
    g.domainReentrant && gt.domain && (E = gt.domain.bind(E));
    var A = n.maxPending || g.maxPending;
    if (!g.queues[e])
      g.queues[e] = [], E(!0);
    else if (g.domainReentrant && gt.domain && gt.domain === g.domains[e])
      E(!1);
    else if (g.queues[e].length >= A)
      y(!1, new Error("Too many pending tasks in queue " + e));
    else {
      var T = function() {
        E(!0);
      };
      n.skipQueue ? g.queues[e].unshift(T) : g.queues[e].push(T);
      var I = n.timeout || g.timeout;
      I && (f = setTimeout(function() {
        f = null, y(!1, new Error("async-lock timed out in queue " + e));
      }, I));
    }
    var R = n.maxOccupationTime || g.maxOccupationTime;
    if (R && (u = setTimeout(function() {
      g.queues[e] && y(!1, new Error("Maximum occupation time is exceeded in queue " + e));
    }, R)), s)
      return s;
  }, t.prototype._acquireBatch = function(e, r, i, n) {
    typeof i != "function" && (n = i, i = null);
    var a = this, o = function(l, f) {
      return function(u) {
        a.acquire(l, f, u, n);
      };
    }, s = e.reduceRight(function(l, f) {
      return o(f, l);
    }, r);
    if (typeof i == "function")
      s(i);
    else
      return new this.Promise(function(l, f) {
        s.length === 1 ? s(function(u, m) {
          u ? f(u) : l(m);
        }) : l(s());
      });
  }, t.prototype.isBusy = function(e) {
    return e ? !!this.queues[e] : Object.keys(this.queues).length > 0;
  }, t.prototype._promiseTry = function(e) {
    try {
      return this.Promise.resolve(e());
    } catch (r) {
      return this.Promise.reject(r);
    }
  }, Xi = t, Xi;
}
var Yi, va;
function jc() {
  return va || (va = 1, Yi = Lc()), Yi;
}
var zc = jc(), Xr = /* @__PURE__ */ Qt(zc), Ei = { exports: {} }, Ea;
function Hc() {
  return Ea || (Ea = 1, typeof Object.create == "function" ? Ei.exports = function(e, r) {
    r && (e.super_ = r, e.prototype = Object.create(r.prototype, {
      constructor: {
        value: e,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }));
  } : Ei.exports = function(e, r) {
    if (r) {
      e.super_ = r;
      var i = function() {
      };
      i.prototype = r.prototype, e.prototype = new i(), e.prototype.constructor = e;
    }
  }), Ei.exports;
}
var ki = { exports: {} }, Ki = {}, ka;
function Wc() {
  return ka || (ka = 1, function(t) {
    Object.defineProperties(t, { __esModule: { value: !0 }, [Symbol.toStringTag]: { value: "Module" } });
    var e = {}, r = {};
    r.byteLength = u, r.toByteArray = g, r.fromByteArray = A;
    for (var i = [], n = [], a = typeof Uint8Array < "u" ? Uint8Array : Array, o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", s = 0, l = o.length; s < l; ++s)
      i[s] = o[s], n[o.charCodeAt(s)] = s;
    n[45] = 62, n[95] = 63;
    function f(R) {
      var D = R.length;
      if (D % 4 > 0)
        throw new Error("Invalid string. Length must be a multiple of 4");
      var L = R.indexOf("=");
      L === -1 && (L = D);
      var U = L === D ? 0 : 4 - L % 4;
      return [L, U];
    }
    function u(R) {
      var D = f(R), L = D[0], U = D[1];
      return (L + U) * 3 / 4 - U;
    }
    function m(R, D, L) {
      return (D + L) * 3 / 4 - L;
    }
    function g(R) {
      var D, L = f(R), U = L[0], M = L[1], B = new a(m(R, U, M)), O = 0, W = M > 0 ? U - 4 : U, z;
      for (z = 0; z < W; z += 4)
        D = n[R.charCodeAt(z)] << 18 | n[R.charCodeAt(z + 1)] << 12 | n[R.charCodeAt(z + 2)] << 6 | n[R.charCodeAt(z + 3)], B[O++] = D >> 16 & 255, B[O++] = D >> 8 & 255, B[O++] = D & 255;
      return M === 2 && (D = n[R.charCodeAt(z)] << 2 | n[R.charCodeAt(z + 1)] >> 4, B[O++] = D & 255), M === 1 && (D = n[R.charCodeAt(z)] << 10 | n[R.charCodeAt(z + 1)] << 4 | n[R.charCodeAt(z + 2)] >> 2, B[O++] = D >> 8 & 255, B[O++] = D & 255), B;
    }
    function y(R) {
      return i[R >> 18 & 63] + i[R >> 12 & 63] + i[R >> 6 & 63] + i[R & 63];
    }
    function E(R, D, L) {
      for (var U, M = [], B = D; B < L; B += 3)
        U = (R[B] << 16 & 16711680) + (R[B + 1] << 8 & 65280) + (R[B + 2] & 255), M.push(y(U));
      return M.join("");
    }
    function A(R) {
      for (var D, L = R.length, U = L % 3, M = [], B = 16383, O = 0, W = L - U; O < W; O += B)
        M.push(E(R, O, O + B > W ? W : O + B));
      return U === 1 ? (D = R[L - 1], M.push(
        i[D >> 2] + i[D << 4 & 63] + "=="
      )) : U === 2 && (D = (R[L - 2] << 8) + R[L - 1], M.push(
        i[D >> 10] + i[D >> 4 & 63] + i[D << 2 & 63] + "="
      )), M.join("");
    }
    var T = {};
    /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
    T.read = function(R, D, L, U, M) {
      var B, O, W = M * 8 - U - 1, z = (1 << W) - 1, Y = z >> 1, F = -7, J = L ? M - 1 : 0, se = L ? -1 : 1, _e = R[D + J];
      for (J += se, B = _e & (1 << -F) - 1, _e >>= -F, F += W; F > 0; B = B * 256 + R[D + J], J += se, F -= 8)
        ;
      for (O = B & (1 << -F) - 1, B >>= -F, F += U; F > 0; O = O * 256 + R[D + J], J += se, F -= 8)
        ;
      if (B === 0)
        B = 1 - Y;
      else {
        if (B === z)
          return O ? NaN : (_e ? -1 : 1) * (1 / 0);
        O = O + Math.pow(2, U), B = B - Y;
      }
      return (_e ? -1 : 1) * O * Math.pow(2, B - U);
    }, T.write = function(R, D, L, U, M, B) {
      var O, W, z, Y = B * 8 - M - 1, F = (1 << Y) - 1, J = F >> 1, se = M === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, _e = U ? 0 : B - 1, ie = U ? 1 : -1, X = D < 0 || D === 0 && 1 / D < 0 ? 1 : 0;
      for (D = Math.abs(D), isNaN(D) || D === 1 / 0 ? (W = isNaN(D) ? 1 : 0, O = F) : (O = Math.floor(Math.log(D) / Math.LN2), D * (z = Math.pow(2, -O)) < 1 && (O--, z *= 2), O + J >= 1 ? D += se / z : D += se * Math.pow(2, 1 - J), D * z >= 2 && (O++, z /= 2), O + J >= F ? (W = 0, O = F) : O + J >= 1 ? (W = (D * z - 1) * Math.pow(2, M), O = O + J) : (W = D * Math.pow(2, J - 1) * Math.pow(2, M), O = 0)); M >= 8; R[L + _e] = W & 255, _e += ie, W /= 256, M -= 8)
        ;
      for (O = O << M | W, Y += M; Y > 0; R[L + _e] = O & 255, _e += ie, O /= 256, Y -= 8)
        ;
      R[L + _e - ie] |= X * 128;
    };
    /*!
     * The buffer module from node.js, for the browser.
     *
     * @author   Feross Aboukhadijeh <https://feross.org>
     * @license  MIT
     */
    (function(R) {
      const D = r, L = T, U = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
      R.Buffer = F, R.SlowBuffer = Ae, R.INSPECT_MAX_BYTES = 50;
      const M = 2147483647;
      R.kMaxLength = M;
      const { Uint8Array: B, ArrayBuffer: O, SharedArrayBuffer: W } = globalThis;
      F.TYPED_ARRAY_SUPPORT = z(), !F.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
        "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
      );
      function z() {
        try {
          const _ = new B(1), w = { foo: function() {
            return 42;
          } };
          return Object.setPrototypeOf(w, B.prototype), Object.setPrototypeOf(_, w), _.foo() === 42;
        } catch {
          return !1;
        }
      }
      Object.defineProperty(F.prototype, "parent", {
        enumerable: !0,
        get: function() {
          if (F.isBuffer(this))
            return this.buffer;
        }
      }), Object.defineProperty(F.prototype, "offset", {
        enumerable: !0,
        get: function() {
          if (F.isBuffer(this))
            return this.byteOffset;
        }
      });
      function Y(_) {
        if (_ > M)
          throw new RangeError('The value "' + _ + '" is invalid for option "size"');
        const w = new B(_);
        return Object.setPrototypeOf(w, F.prototype), w;
      }
      function F(_, w, p) {
        if (typeof _ == "number") {
          if (typeof w == "string")
            throw new TypeError(
              'The "string" argument must be of type string. Received type number'
            );
          return ie(_);
        }
        return J(_, w, p);
      }
      F.poolSize = 8192;
      function J(_, w, p) {
        if (typeof _ == "string")
          return X(_, w);
        if (O.isView(_))
          return de(_);
        if (_ == null)
          throw new TypeError(
            "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof _
          );
        if (S(_, O) || _ && S(_.buffer, O) || typeof W < "u" && (S(_, W) || _ && S(_.buffer, W)))
          return Se(_, w, p);
        if (typeof _ == "number")
          throw new TypeError(
            'The "value" argument must not be of type number. Received type number'
          );
        const $ = _.valueOf && _.valueOf();
        if ($ != null && $ !== _)
          return F.from($, w, p);
        const P = Te(_);
        if (P) return P;
        if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof _[Symbol.toPrimitive] == "function")
          return F.from(_[Symbol.toPrimitive]("string"), w, p);
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof _
        );
      }
      F.from = function(_, w, p) {
        return J(_, w, p);
      }, Object.setPrototypeOf(F.prototype, B.prototype), Object.setPrototypeOf(F, B);
      function se(_) {
        if (typeof _ != "number")
          throw new TypeError('"size" argument must be of type number');
        if (_ < 0)
          throw new RangeError('The value "' + _ + '" is invalid for option "size"');
      }
      function _e(_, w, p) {
        return se(_), _ <= 0 ? Y(_) : w !== void 0 ? typeof p == "string" ? Y(_).fill(w, p) : Y(_).fill(w) : Y(_);
      }
      F.alloc = function(_, w, p) {
        return _e(_, w, p);
      };
      function ie(_) {
        return se(_), Y(_ < 0 ? 0 : be(_) | 0);
      }
      F.allocUnsafe = function(_) {
        return ie(_);
      }, F.allocUnsafeSlow = function(_) {
        return ie(_);
      };
      function X(_, w) {
        if ((typeof w != "string" || w === "") && (w = "utf8"), !F.isEncoding(w))
          throw new TypeError("Unknown encoding: " + w);
        const p = ye(_, w) | 0;
        let $ = Y(p);
        const P = $.write(_, w);
        return P !== p && ($ = $.slice(0, P)), $;
      }
      function ne(_) {
        const w = _.length < 0 ? 0 : be(_.length) | 0, p = Y(w);
        for (let $ = 0; $ < w; $ += 1)
          p[$] = _[$] & 255;
        return p;
      }
      function de(_) {
        if (S(_, B)) {
          const w = new B(_);
          return Se(w.buffer, w.byteOffset, w.byteLength);
        }
        return ne(_);
      }
      function Se(_, w, p) {
        if (w < 0 || _.byteLength < w)
          throw new RangeError('"offset" is outside of buffer bounds');
        if (_.byteLength < w + (p || 0))
          throw new RangeError('"length" is outside of buffer bounds');
        let $;
        return w === void 0 && p === void 0 ? $ = new B(_) : p === void 0 ? $ = new B(_, w) : $ = new B(_, w, p), Object.setPrototypeOf($, F.prototype), $;
      }
      function Te(_) {
        if (F.isBuffer(_)) {
          const w = be(_.length) | 0, p = Y(w);
          return p.length === 0 || _.copy(p, 0, 0, w), p;
        }
        if (_.length !== void 0)
          return typeof _.length != "number" || j(_.length) ? Y(0) : ne(_);
        if (_.type === "Buffer" && Array.isArray(_.data))
          return ne(_.data);
      }
      function be(_) {
        if (_ >= M)
          throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + M.toString(16) + " bytes");
        return _ | 0;
      }
      function Ae(_) {
        return +_ != _ && (_ = 0), F.alloc(+_);
      }
      F.isBuffer = function(w) {
        return w != null && w._isBuffer === !0 && w !== F.prototype;
      }, F.compare = function(w, p) {
        if (S(w, B) && (w = F.from(w, w.offset, w.byteLength)), S(p, B) && (p = F.from(p, p.offset, p.byteLength)), !F.isBuffer(w) || !F.isBuffer(p))
          throw new TypeError(
            'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
          );
        if (w === p) return 0;
        let $ = w.length, P = p.length;
        for (let G = 0, K = Math.min($, P); G < K; ++G)
          if (w[G] !== p[G]) {
            $ = w[G], P = p[G];
            break;
          }
        return $ < P ? -1 : P < $ ? 1 : 0;
      }, F.isEncoding = function(w) {
        switch (String(w).toLowerCase()) {
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
      }, F.concat = function(w, p) {
        if (!Array.isArray(w))
          throw new TypeError('"list" argument must be an Array of Buffers');
        if (w.length === 0)
          return F.alloc(0);
        let $;
        if (p === void 0)
          for (p = 0, $ = 0; $ < w.length; ++$)
            p += w[$].length;
        const P = F.allocUnsafe(p);
        let G = 0;
        for ($ = 0; $ < w.length; ++$) {
          let K = w[$];
          if (S(K, B))
            G + K.length > P.length ? (F.isBuffer(K) || (K = F.from(K)), K.copy(P, G)) : B.prototype.set.call(
              P,
              K,
              G
            );
          else if (F.isBuffer(K))
            K.copy(P, G);
          else
            throw new TypeError('"list" argument must be an Array of Buffers');
          G += K.length;
        }
        return P;
      };
      function ye(_, w) {
        if (F.isBuffer(_))
          return _.length;
        if (O.isView(_) || S(_, O))
          return _.byteLength;
        if (typeof _ != "string")
          throw new TypeError(
            'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof _
          );
        const p = _.length, $ = arguments.length > 2 && arguments[2] === !0;
        if (!$ && p === 0) return 0;
        let P = !1;
        for (; ; )
          switch (w) {
            case "ascii":
            case "latin1":
            case "binary":
              return p;
            case "utf8":
            case "utf-8":
              return Q(_).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return p * 2;
            case "hex":
              return p >>> 1;
            case "base64":
              return q(_).length;
            default:
              if (P)
                return $ ? -1 : Q(_).length;
              w = ("" + w).toLowerCase(), P = !0;
          }
      }
      F.byteLength = ye;
      function $e(_, w, p) {
        let $ = !1;
        if ((w === void 0 || w < 0) && (w = 0), w > this.length || ((p === void 0 || p > this.length) && (p = this.length), p <= 0) || (p >>>= 0, w >>>= 0, p <= w))
          return "";
        for (_ || (_ = "utf8"); ; )
          switch (_) {
            case "hex":
              return St(this, w, p);
            case "utf8":
            case "utf-8":
              return Me(this, w, p);
            case "ascii":
              return xe(this, w, p);
            case "latin1":
            case "binary":
              return lt(this, w, p);
            case "base64":
              return Ve(this, w, p);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return xt(this, w, p);
            default:
              if ($) throw new TypeError("Unknown encoding: " + _);
              _ = (_ + "").toLowerCase(), $ = !0;
          }
      }
      F.prototype._isBuffer = !0;
      function ke(_, w, p) {
        const $ = _[w];
        _[w] = _[p], _[p] = $;
      }
      F.prototype.swap16 = function() {
        const w = this.length;
        if (w % 2 !== 0)
          throw new RangeError("Buffer size must be a multiple of 16-bits");
        for (let p = 0; p < w; p += 2)
          ke(this, p, p + 1);
        return this;
      }, F.prototype.swap32 = function() {
        const w = this.length;
        if (w % 4 !== 0)
          throw new RangeError("Buffer size must be a multiple of 32-bits");
        for (let p = 0; p < w; p += 4)
          ke(this, p, p + 3), ke(this, p + 1, p + 2);
        return this;
      }, F.prototype.swap64 = function() {
        const w = this.length;
        if (w % 8 !== 0)
          throw new RangeError("Buffer size must be a multiple of 64-bits");
        for (let p = 0; p < w; p += 8)
          ke(this, p, p + 7), ke(this, p + 1, p + 6), ke(this, p + 2, p + 5), ke(this, p + 3, p + 4);
        return this;
      }, F.prototype.toString = function() {
        const w = this.length;
        return w === 0 ? "" : arguments.length === 0 ? Me(this, 0, w) : $e.apply(this, arguments);
      }, F.prototype.toLocaleString = F.prototype.toString, F.prototype.equals = function(w) {
        if (!F.isBuffer(w)) throw new TypeError("Argument must be a Buffer");
        return this === w ? !0 : F.compare(this, w) === 0;
      }, F.prototype.inspect = function() {
        let w = "";
        const p = R.INSPECT_MAX_BYTES;
        return w = this.toString("hex", 0, p).replace(/(.{2})/g, "$1 ").trim(), this.length > p && (w += " ... "), "<Buffer " + w + ">";
      }, U && (F.prototype[U] = F.prototype.inspect), F.prototype.compare = function(w, p, $, P, G) {
        if (S(w, B) && (w = F.from(w, w.offset, w.byteLength)), !F.isBuffer(w))
          throw new TypeError(
            'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof w
          );
        if (p === void 0 && (p = 0), $ === void 0 && ($ = w ? w.length : 0), P === void 0 && (P = 0), G === void 0 && (G = this.length), p < 0 || $ > w.length || P < 0 || G > this.length)
          throw new RangeError("out of range index");
        if (P >= G && p >= $)
          return 0;
        if (P >= G)
          return -1;
        if (p >= $)
          return 1;
        if (p >>>= 0, $ >>>= 0, P >>>= 0, G >>>= 0, this === w) return 0;
        let K = G - P, ve = $ - p;
        const He = Math.min(K, ve), Ue = this.slice(P, G), Ie = w.slice(p, $);
        for (let Be = 0; Be < He; ++Be)
          if (Ue[Be] !== Ie[Be]) {
            K = Ue[Be], ve = Ie[Be];
            break;
          }
        return K < ve ? -1 : ve < K ? 1 : 0;
      };
      function Ee(_, w, p, $, P) {
        if (_.length === 0) return -1;
        if (typeof p == "string" ? ($ = p, p = 0) : p > 2147483647 ? p = 2147483647 : p < -2147483648 && (p = -2147483648), p = +p, j(p) && (p = P ? 0 : _.length - 1), p < 0 && (p = _.length + p), p >= _.length) {
          if (P) return -1;
          p = _.length - 1;
        } else if (p < 0)
          if (P) p = 0;
          else return -1;
        if (typeof w == "string" && (w = F.from(w, $)), F.isBuffer(w))
          return w.length === 0 ? -1 : De(_, w, p, $, P);
        if (typeof w == "number")
          return w = w & 255, typeof B.prototype.indexOf == "function" ? P ? B.prototype.indexOf.call(_, w, p) : B.prototype.lastIndexOf.call(_, w, p) : De(_, [w], p, $, P);
        throw new TypeError("val must be string, number or Buffer");
      }
      function De(_, w, p, $, P) {
        let G = 1, K = _.length, ve = w.length;
        if ($ !== void 0 && ($ = String($).toLowerCase(), $ === "ucs2" || $ === "ucs-2" || $ === "utf16le" || $ === "utf-16le")) {
          if (_.length < 2 || w.length < 2)
            return -1;
          G = 2, K /= 2, ve /= 2, p /= 2;
        }
        function He(Ie, Be) {
          return G === 1 ? Ie[Be] : Ie.readUInt16BE(Be * G);
        }
        let Ue;
        if (P) {
          let Ie = -1;
          for (Ue = p; Ue < K; Ue++)
            if (He(_, Ue) === He(w, Ie === -1 ? 0 : Ue - Ie)) {
              if (Ie === -1 && (Ie = Ue), Ue - Ie + 1 === ve) return Ie * G;
            } else
              Ie !== -1 && (Ue -= Ue - Ie), Ie = -1;
        } else
          for (p + ve > K && (p = K - ve), Ue = p; Ue >= 0; Ue--) {
            let Ie = !0;
            for (let Be = 0; Be < ve; Be++)
              if (He(_, Ue + Be) !== He(w, Be)) {
                Ie = !1;
                break;
              }
            if (Ie) return Ue;
          }
        return -1;
      }
      F.prototype.includes = function(w, p, $) {
        return this.indexOf(w, p, $) !== -1;
      }, F.prototype.indexOf = function(w, p, $) {
        return Ee(this, w, p, $, !0);
      }, F.prototype.lastIndexOf = function(w, p, $) {
        return Ee(this, w, p, $, !1);
      };
      function qe(_, w, p, $) {
        p = Number(p) || 0;
        const P = _.length - p;
        $ ? ($ = Number($), $ > P && ($ = P)) : $ = P;
        const G = w.length;
        $ > G / 2 && ($ = G / 2);
        let K;
        for (K = 0; K < $; ++K) {
          const ve = parseInt(w.substr(K * 2, 2), 16);
          if (j(ve)) return K;
          _[p + K] = ve;
        }
        return K;
      }
      function rt(_, w, p, $) {
        return V(Q(w, _.length - p), _, p, $);
      }
      function je(_, w, p, $) {
        return V(le(w), _, p, $);
      }
      function we(_, w, p, $) {
        return V(q(w), _, p, $);
      }
      function Oe(_, w, p, $) {
        return V(h(w, _.length - p), _, p, $);
      }
      F.prototype.write = function(w, p, $, P) {
        if (p === void 0)
          P = "utf8", $ = this.length, p = 0;
        else if ($ === void 0 && typeof p == "string")
          P = p, $ = this.length, p = 0;
        else if (isFinite(p))
          p = p >>> 0, isFinite($) ? ($ = $ >>> 0, P === void 0 && (P = "utf8")) : (P = $, $ = void 0);
        else
          throw new Error(
            "Buffer.write(string, encoding, offset[, length]) is no longer supported"
          );
        const G = this.length - p;
        if (($ === void 0 || $ > G) && ($ = G), w.length > 0 && ($ < 0 || p < 0) || p > this.length)
          throw new RangeError("Attempt to write outside buffer bounds");
        P || (P = "utf8");
        let K = !1;
        for (; ; )
          switch (P) {
            case "hex":
              return qe(this, w, p, $);
            case "utf8":
            case "utf-8":
              return rt(this, w, p, $);
            case "ascii":
            case "latin1":
            case "binary":
              return je(this, w, p, $);
            case "base64":
              return we(this, w, p, $);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return Oe(this, w, p, $);
            default:
              if (K) throw new TypeError("Unknown encoding: " + P);
              P = ("" + P).toLowerCase(), K = !0;
          }
      }, F.prototype.toJSON = function() {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };
      function Ve(_, w, p) {
        return w === 0 && p === _.length ? D.fromByteArray(_) : D.fromByteArray(_.slice(w, p));
      }
      function Me(_, w, p) {
        p = Math.min(_.length, p);
        const $ = [];
        let P = w;
        for (; P < p; ) {
          const G = _[P];
          let K = null, ve = G > 239 ? 4 : G > 223 ? 3 : G > 191 ? 2 : 1;
          if (P + ve <= p) {
            let He, Ue, Ie, Be;
            switch (ve) {
              case 1:
                G < 128 && (K = G);
                break;
              case 2:
                He = _[P + 1], (He & 192) === 128 && (Be = (G & 31) << 6 | He & 63, Be > 127 && (K = Be));
                break;
              case 3:
                He = _[P + 1], Ue = _[P + 2], (He & 192) === 128 && (Ue & 192) === 128 && (Be = (G & 15) << 12 | (He & 63) << 6 | Ue & 63, Be > 2047 && (Be < 55296 || Be > 57343) && (K = Be));
                break;
              case 4:
                He = _[P + 1], Ue = _[P + 2], Ie = _[P + 3], (He & 192) === 128 && (Ue & 192) === 128 && (Ie & 192) === 128 && (Be = (G & 15) << 18 | (He & 63) << 12 | (Ue & 63) << 6 | Ie & 63, Be > 65535 && Be < 1114112 && (K = Be));
            }
          }
          K === null ? (K = 65533, ve = 1) : K > 65535 && (K -= 65536, $.push(K >>> 10 & 1023 | 55296), K = 56320 | K & 1023), $.push(K), P += ve;
        }
        return Ce($);
      }
      const ze = 4096;
      function Ce(_) {
        const w = _.length;
        if (w <= ze)
          return String.fromCharCode.apply(String, _);
        let p = "", $ = 0;
        for (; $ < w; )
          p += String.fromCharCode.apply(
            String,
            _.slice($, $ += ze)
          );
        return p;
      }
      function xe(_, w, p) {
        let $ = "";
        p = Math.min(_.length, p);
        for (let P = w; P < p; ++P)
          $ += String.fromCharCode(_[P] & 127);
        return $;
      }
      function lt(_, w, p) {
        let $ = "";
        p = Math.min(_.length, p);
        for (let P = w; P < p; ++P)
          $ += String.fromCharCode(_[P]);
        return $;
      }
      function St(_, w, p) {
        const $ = _.length;
        (!w || w < 0) && (w = 0), (!p || p < 0 || p > $) && (p = $);
        let P = "";
        for (let G = w; G < p; ++G)
          P += Z[_[G]];
        return P;
      }
      function xt(_, w, p) {
        const $ = _.slice(w, p);
        let P = "";
        for (let G = 0; G < $.length - 1; G += 2)
          P += String.fromCharCode($[G] + $[G + 1] * 256);
        return P;
      }
      F.prototype.slice = function(w, p) {
        const $ = this.length;
        w = ~~w, p = p === void 0 ? $ : ~~p, w < 0 ? (w += $, w < 0 && (w = 0)) : w > $ && (w = $), p < 0 ? (p += $, p < 0 && (p = 0)) : p > $ && (p = $), p < w && (p = w);
        const P = this.subarray(w, p);
        return Object.setPrototypeOf(P, F.prototype), P;
      };
      function Ne(_, w, p) {
        if (_ % 1 !== 0 || _ < 0) throw new RangeError("offset is not uint");
        if (_ + w > p) throw new RangeError("Trying to access beyond buffer length");
      }
      F.prototype.readUintLE = F.prototype.readUIntLE = function(w, p, $) {
        w = w >>> 0, p = p >>> 0, $ || Ne(w, p, this.length);
        let P = this[w], G = 1, K = 0;
        for (; ++K < p && (G *= 256); )
          P += this[w + K] * G;
        return P;
      }, F.prototype.readUintBE = F.prototype.readUIntBE = function(w, p, $) {
        w = w >>> 0, p = p >>> 0, $ || Ne(w, p, this.length);
        let P = this[w + --p], G = 1;
        for (; p > 0 && (G *= 256); )
          P += this[w + --p] * G;
        return P;
      }, F.prototype.readUint8 = F.prototype.readUInt8 = function(w, p) {
        return w = w >>> 0, p || Ne(w, 1, this.length), this[w];
      }, F.prototype.readUint16LE = F.prototype.readUInt16LE = function(w, p) {
        return w = w >>> 0, p || Ne(w, 2, this.length), this[w] | this[w + 1] << 8;
      }, F.prototype.readUint16BE = F.prototype.readUInt16BE = function(w, p) {
        return w = w >>> 0, p || Ne(w, 2, this.length), this[w] << 8 | this[w + 1];
      }, F.prototype.readUint32LE = F.prototype.readUInt32LE = function(w, p) {
        return w = w >>> 0, p || Ne(w, 4, this.length), (this[w] | this[w + 1] << 8 | this[w + 2] << 16) + this[w + 3] * 16777216;
      }, F.prototype.readUint32BE = F.prototype.readUInt32BE = function(w, p) {
        return w = w >>> 0, p || Ne(w, 4, this.length), this[w] * 16777216 + (this[w + 1] << 16 | this[w + 2] << 8 | this[w + 3]);
      }, F.prototype.readBigUInt64LE = he(function(w) {
        w = w >>> 0, C(w, "offset");
        const p = this[w], $ = this[w + 7];
        (p === void 0 || $ === void 0) && x(w, this.length - 8);
        const P = p + this[++w] * 2 ** 8 + this[++w] * 2 ** 16 + this[++w] * 2 ** 24, G = this[++w] + this[++w] * 2 ** 8 + this[++w] * 2 ** 16 + $ * 2 ** 24;
        return BigInt(P) + (BigInt(G) << BigInt(32));
      }), F.prototype.readBigUInt64BE = he(function(w) {
        w = w >>> 0, C(w, "offset");
        const p = this[w], $ = this[w + 7];
        (p === void 0 || $ === void 0) && x(w, this.length - 8);
        const P = p * 2 ** 24 + this[++w] * 2 ** 16 + this[++w] * 2 ** 8 + this[++w], G = this[++w] * 2 ** 24 + this[++w] * 2 ** 16 + this[++w] * 2 ** 8 + $;
        return (BigInt(P) << BigInt(32)) + BigInt(G);
      }), F.prototype.readIntLE = function(w, p, $) {
        w = w >>> 0, p = p >>> 0, $ || Ne(w, p, this.length);
        let P = this[w], G = 1, K = 0;
        for (; ++K < p && (G *= 256); )
          P += this[w + K] * G;
        return G *= 128, P >= G && (P -= Math.pow(2, 8 * p)), P;
      }, F.prototype.readIntBE = function(w, p, $) {
        w = w >>> 0, p = p >>> 0, $ || Ne(w, p, this.length);
        let P = p, G = 1, K = this[w + --P];
        for (; P > 0 && (G *= 256); )
          K += this[w + --P] * G;
        return G *= 128, K >= G && (K -= Math.pow(2, 8 * p)), K;
      }, F.prototype.readInt8 = function(w, p) {
        return w = w >>> 0, p || Ne(w, 1, this.length), this[w] & 128 ? (255 - this[w] + 1) * -1 : this[w];
      }, F.prototype.readInt16LE = function(w, p) {
        w = w >>> 0, p || Ne(w, 2, this.length);
        const $ = this[w] | this[w + 1] << 8;
        return $ & 32768 ? $ | 4294901760 : $;
      }, F.prototype.readInt16BE = function(w, p) {
        w = w >>> 0, p || Ne(w, 2, this.length);
        const $ = this[w + 1] | this[w] << 8;
        return $ & 32768 ? $ | 4294901760 : $;
      }, F.prototype.readInt32LE = function(w, p) {
        return w = w >>> 0, p || Ne(w, 4, this.length), this[w] | this[w + 1] << 8 | this[w + 2] << 16 | this[w + 3] << 24;
      }, F.prototype.readInt32BE = function(w, p) {
        return w = w >>> 0, p || Ne(w, 4, this.length), this[w] << 24 | this[w + 1] << 16 | this[w + 2] << 8 | this[w + 3];
      }, F.prototype.readBigInt64LE = he(function(w) {
        w = w >>> 0, C(w, "offset");
        const p = this[w], $ = this[w + 7];
        (p === void 0 || $ === void 0) && x(w, this.length - 8);
        const P = this[w + 4] + this[w + 5] * 2 ** 8 + this[w + 6] * 2 ** 16 + ($ << 24);
        return (BigInt(P) << BigInt(32)) + BigInt(p + this[++w] * 2 ** 8 + this[++w] * 2 ** 16 + this[++w] * 2 ** 24);
      }), F.prototype.readBigInt64BE = he(function(w) {
        w = w >>> 0, C(w, "offset");
        const p = this[w], $ = this[w + 7];
        (p === void 0 || $ === void 0) && x(w, this.length - 8);
        const P = (p << 24) + // Overflow
        this[++w] * 2 ** 16 + this[++w] * 2 ** 8 + this[++w];
        return (BigInt(P) << BigInt(32)) + BigInt(this[++w] * 2 ** 24 + this[++w] * 2 ** 16 + this[++w] * 2 ** 8 + $);
      }), F.prototype.readFloatLE = function(w, p) {
        return w = w >>> 0, p || Ne(w, 4, this.length), L.read(this, w, !0, 23, 4);
      }, F.prototype.readFloatBE = function(w, p) {
        return w = w >>> 0, p || Ne(w, 4, this.length), L.read(this, w, !1, 23, 4);
      }, F.prototype.readDoubleLE = function(w, p) {
        return w = w >>> 0, p || Ne(w, 8, this.length), L.read(this, w, !0, 52, 8);
      }, F.prototype.readDoubleBE = function(w, p) {
        return w = w >>> 0, p || Ne(w, 8, this.length), L.read(this, w, !1, 52, 8);
      };
      function Xe(_, w, p, $, P, G) {
        if (!F.isBuffer(_)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (w > P || w < G) throw new RangeError('"value" argument is out of bounds');
        if (p + $ > _.length) throw new RangeError("Index out of range");
      }
      F.prototype.writeUintLE = F.prototype.writeUIntLE = function(w, p, $, P) {
        if (w = +w, p = p >>> 0, $ = $ >>> 0, !P) {
          const ve = Math.pow(2, 8 * $) - 1;
          Xe(this, w, p, $, ve, 0);
        }
        let G = 1, K = 0;
        for (this[p] = w & 255; ++K < $ && (G *= 256); )
          this[p + K] = w / G & 255;
        return p + $;
      }, F.prototype.writeUintBE = F.prototype.writeUIntBE = function(w, p, $, P) {
        if (w = +w, p = p >>> 0, $ = $ >>> 0, !P) {
          const ve = Math.pow(2, 8 * $) - 1;
          Xe(this, w, p, $, ve, 0);
        }
        let G = $ - 1, K = 1;
        for (this[p + G] = w & 255; --G >= 0 && (K *= 256); )
          this[p + G] = w / K & 255;
        return p + $;
      }, F.prototype.writeUint8 = F.prototype.writeUInt8 = function(w, p, $) {
        return w = +w, p = p >>> 0, $ || Xe(this, w, p, 1, 255, 0), this[p] = w & 255, p + 1;
      }, F.prototype.writeUint16LE = F.prototype.writeUInt16LE = function(w, p, $) {
        return w = +w, p = p >>> 0, $ || Xe(this, w, p, 2, 65535, 0), this[p] = w & 255, this[p + 1] = w >>> 8, p + 2;
      }, F.prototype.writeUint16BE = F.prototype.writeUInt16BE = function(w, p, $) {
        return w = +w, p = p >>> 0, $ || Xe(this, w, p, 2, 65535, 0), this[p] = w >>> 8, this[p + 1] = w & 255, p + 2;
      }, F.prototype.writeUint32LE = F.prototype.writeUInt32LE = function(w, p, $) {
        return w = +w, p = p >>> 0, $ || Xe(this, w, p, 4, 4294967295, 0), this[p + 3] = w >>> 24, this[p + 2] = w >>> 16, this[p + 1] = w >>> 8, this[p] = w & 255, p + 4;
      }, F.prototype.writeUint32BE = F.prototype.writeUInt32BE = function(w, p, $) {
        return w = +w, p = p >>> 0, $ || Xe(this, w, p, 4, 4294967295, 0), this[p] = w >>> 24, this[p + 1] = w >>> 16, this[p + 2] = w >>> 8, this[p + 3] = w & 255, p + 4;
      };
      function ut(_, w, p, $, P) {
        v(w, $, P, _, p, 7);
        let G = Number(w & BigInt(4294967295));
        _[p++] = G, G = G >> 8, _[p++] = G, G = G >> 8, _[p++] = G, G = G >> 8, _[p++] = G;
        let K = Number(w >> BigInt(32) & BigInt(4294967295));
        return _[p++] = K, K = K >> 8, _[p++] = K, K = K >> 8, _[p++] = K, K = K >> 8, _[p++] = K, p;
      }
      function Ze(_, w, p, $, P) {
        v(w, $, P, _, p, 7);
        let G = Number(w & BigInt(4294967295));
        _[p + 7] = G, G = G >> 8, _[p + 6] = G, G = G >> 8, _[p + 5] = G, G = G >> 8, _[p + 4] = G;
        let K = Number(w >> BigInt(32) & BigInt(4294967295));
        return _[p + 3] = K, K = K >> 8, _[p + 2] = K, K = K >> 8, _[p + 1] = K, K = K >> 8, _[p] = K, p + 8;
      }
      F.prototype.writeBigUInt64LE = he(function(w, p = 0) {
        return ut(this, w, p, BigInt(0), BigInt("0xffffffffffffffff"));
      }), F.prototype.writeBigUInt64BE = he(function(w, p = 0) {
        return Ze(this, w, p, BigInt(0), BigInt("0xffffffffffffffff"));
      }), F.prototype.writeIntLE = function(w, p, $, P) {
        if (w = +w, p = p >>> 0, !P) {
          const He = Math.pow(2, 8 * $ - 1);
          Xe(this, w, p, $, He - 1, -He);
        }
        let G = 0, K = 1, ve = 0;
        for (this[p] = w & 255; ++G < $ && (K *= 256); )
          w < 0 && ve === 0 && this[p + G - 1] !== 0 && (ve = 1), this[p + G] = (w / K >> 0) - ve & 255;
        return p + $;
      }, F.prototype.writeIntBE = function(w, p, $, P) {
        if (w = +w, p = p >>> 0, !P) {
          const He = Math.pow(2, 8 * $ - 1);
          Xe(this, w, p, $, He - 1, -He);
        }
        let G = $ - 1, K = 1, ve = 0;
        for (this[p + G] = w & 255; --G >= 0 && (K *= 256); )
          w < 0 && ve === 0 && this[p + G + 1] !== 0 && (ve = 1), this[p + G] = (w / K >> 0) - ve & 255;
        return p + $;
      }, F.prototype.writeInt8 = function(w, p, $) {
        return w = +w, p = p >>> 0, $ || Xe(this, w, p, 1, 127, -128), w < 0 && (w = 255 + w + 1), this[p] = w & 255, p + 1;
      }, F.prototype.writeInt16LE = function(w, p, $) {
        return w = +w, p = p >>> 0, $ || Xe(this, w, p, 2, 32767, -32768), this[p] = w & 255, this[p + 1] = w >>> 8, p + 2;
      }, F.prototype.writeInt16BE = function(w, p, $) {
        return w = +w, p = p >>> 0, $ || Xe(this, w, p, 2, 32767, -32768), this[p] = w >>> 8, this[p + 1] = w & 255, p + 2;
      }, F.prototype.writeInt32LE = function(w, p, $) {
        return w = +w, p = p >>> 0, $ || Xe(this, w, p, 4, 2147483647, -2147483648), this[p] = w & 255, this[p + 1] = w >>> 8, this[p + 2] = w >>> 16, this[p + 3] = w >>> 24, p + 4;
      }, F.prototype.writeInt32BE = function(w, p, $) {
        return w = +w, p = p >>> 0, $ || Xe(this, w, p, 4, 2147483647, -2147483648), w < 0 && (w = 4294967295 + w + 1), this[p] = w >>> 24, this[p + 1] = w >>> 16, this[p + 2] = w >>> 8, this[p + 3] = w & 255, p + 4;
      }, F.prototype.writeBigInt64LE = he(function(w, p = 0) {
        return ut(this, w, p, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      }), F.prototype.writeBigInt64BE = he(function(w, p = 0) {
        return Ze(this, w, p, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      function vt(_, w, p, $, P, G) {
        if (p + $ > _.length) throw new RangeError("Index out of range");
        if (p < 0) throw new RangeError("Index out of range");
      }
      function Et(_, w, p, $, P) {
        return w = +w, p = p >>> 0, P || vt(_, w, p, 4), L.write(_, w, p, $, 23, 4), p + 4;
      }
      F.prototype.writeFloatLE = function(w, p, $) {
        return Et(this, w, p, !0, $);
      }, F.prototype.writeFloatBE = function(w, p, $) {
        return Et(this, w, p, !1, $);
      };
      function Pe(_, w, p, $, P) {
        return w = +w, p = p >>> 0, P || vt(_, w, p, 8), L.write(_, w, p, $, 52, 8), p + 8;
      }
      F.prototype.writeDoubleLE = function(w, p, $) {
        return Pe(this, w, p, !0, $);
      }, F.prototype.writeDoubleBE = function(w, p, $) {
        return Pe(this, w, p, !1, $);
      }, F.prototype.copy = function(w, p, $, P) {
        if (!F.isBuffer(w)) throw new TypeError("argument should be a Buffer");
        if ($ || ($ = 0), !P && P !== 0 && (P = this.length), p >= w.length && (p = w.length), p || (p = 0), P > 0 && P < $ && (P = $), P === $ || w.length === 0 || this.length === 0) return 0;
        if (p < 0)
          throw new RangeError("targetStart out of bounds");
        if ($ < 0 || $ >= this.length) throw new RangeError("Index out of range");
        if (P < 0) throw new RangeError("sourceEnd out of bounds");
        P > this.length && (P = this.length), w.length - p < P - $ && (P = w.length - p + $);
        const G = P - $;
        return this === w && typeof B.prototype.copyWithin == "function" ? this.copyWithin(p, $, P) : B.prototype.set.call(
          w,
          this.subarray($, P),
          p
        ), G;
      }, F.prototype.fill = function(w, p, $, P) {
        if (typeof w == "string") {
          if (typeof p == "string" ? (P = p, p = 0, $ = this.length) : typeof $ == "string" && (P = $, $ = this.length), P !== void 0 && typeof P != "string")
            throw new TypeError("encoding must be a string");
          if (typeof P == "string" && !F.isEncoding(P))
            throw new TypeError("Unknown encoding: " + P);
          if (w.length === 1) {
            const K = w.charCodeAt(0);
            (P === "utf8" && K < 128 || P === "latin1") && (w = K);
          }
        } else typeof w == "number" ? w = w & 255 : typeof w == "boolean" && (w = Number(w));
        if (p < 0 || this.length < p || this.length < $)
          throw new RangeError("Out of range index");
        if ($ <= p)
          return this;
        p = p >>> 0, $ = $ === void 0 ? this.length : $ >>> 0, w || (w = 0);
        let G;
        if (typeof w == "number")
          for (G = p; G < $; ++G)
            this[G] = w;
        else {
          const K = F.isBuffer(w) ? w : F.from(w, P), ve = K.length;
          if (ve === 0)
            throw new TypeError('The value "' + w + '" is invalid for argument "value"');
          for (G = 0; G < $ - p; ++G)
            this[G + p] = K[G % ve];
        }
        return this;
      };
      const nt = {};
      function k(_, w, p) {
        nt[_] = class extends p {
          constructor() {
            super(), Object.defineProperty(this, "message", {
              value: w.apply(this, arguments),
              writable: !0,
              configurable: !0
            }), this.name = `${this.name} [${_}]`, this.stack, delete this.name;
          }
          get code() {
            return _;
          }
          set code(P) {
            Object.defineProperty(this, "code", {
              configurable: !0,
              enumerable: !0,
              value: P,
              writable: !0
            });
          }
          toString() {
            return `${this.name} [${_}]: ${this.message}`;
          }
        };
      }
      k(
        "ERR_BUFFER_OUT_OF_BOUNDS",
        function(_) {
          return _ ? `${_} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
        },
        RangeError
      ), k(
        "ERR_INVALID_ARG_TYPE",
        function(_, w) {
          return `The "${_}" argument must be of type number. Received type ${typeof w}`;
        },
        TypeError
      ), k(
        "ERR_OUT_OF_RANGE",
        function(_, w, p) {
          let $ = `The value of "${_}" is out of range.`, P = p;
          return Number.isInteger(p) && Math.abs(p) > 2 ** 32 ? P = c(String(p)) : typeof p == "bigint" && (P = String(p), (p > BigInt(2) ** BigInt(32) || p < -(BigInt(2) ** BigInt(32))) && (P = c(P)), P += "n"), $ += ` It must be ${w}. Received ${P}`, $;
        },
        RangeError
      );
      function c(_) {
        let w = "", p = _.length;
        const $ = _[0] === "-" ? 1 : 0;
        for (; p >= $ + 4; p -= 3)
          w = `_${_.slice(p - 3, p)}${w}`;
        return `${_.slice(0, p)}${w}`;
      }
      function d(_, w, p) {
        C(w, "offset"), (_[w] === void 0 || _[w + p] === void 0) && x(w, _.length - (p + 1));
      }
      function v(_, w, p, $, P, G) {
        if (_ > p || _ < w) {
          const K = typeof w == "bigint" ? "n" : "";
          let ve;
          throw w === 0 || w === BigInt(0) ? ve = `>= 0${K} and < 2${K} ** ${(G + 1) * 8}${K}` : ve = `>= -(2${K} ** ${(G + 1) * 8 - 1}${K}) and < 2 ** ${(G + 1) * 8 - 1}${K}`, new nt.ERR_OUT_OF_RANGE("value", ve, _);
        }
        d($, P, G);
      }
      function C(_, w) {
        if (typeof _ != "number")
          throw new nt.ERR_INVALID_ARG_TYPE(w, "number", _);
      }
      function x(_, w, p) {
        throw Math.floor(_) !== _ ? (C(_, p), new nt.ERR_OUT_OF_RANGE("offset", "an integer", _)) : w < 0 ? new nt.ERR_BUFFER_OUT_OF_BOUNDS() : new nt.ERR_OUT_OF_RANGE(
          "offset",
          `>= 0 and <= ${w}`,
          _
        );
      }
      const N = /[^+/0-9A-Za-z-_]/g;
      function b(_) {
        if (_ = _.split("=")[0], _ = _.trim().replace(N, ""), _.length < 2) return "";
        for (; _.length % 4 !== 0; )
          _ = _ + "=";
        return _;
      }
      function Q(_, w) {
        w = w || 1 / 0;
        let p;
        const $ = _.length;
        let P = null;
        const G = [];
        for (let K = 0; K < $; ++K) {
          if (p = _.charCodeAt(K), p > 55295 && p < 57344) {
            if (!P) {
              if (p > 56319) {
                (w -= 3) > -1 && G.push(239, 191, 189);
                continue;
              } else if (K + 1 === $) {
                (w -= 3) > -1 && G.push(239, 191, 189);
                continue;
              }
              P = p;
              continue;
            }
            if (p < 56320) {
              (w -= 3) > -1 && G.push(239, 191, 189), P = p;
              continue;
            }
            p = (P - 55296 << 10 | p - 56320) + 65536;
          } else P && (w -= 3) > -1 && G.push(239, 191, 189);
          if (P = null, p < 128) {
            if ((w -= 1) < 0) break;
            G.push(p);
          } else if (p < 2048) {
            if ((w -= 2) < 0) break;
            G.push(
              p >> 6 | 192,
              p & 63 | 128
            );
          } else if (p < 65536) {
            if ((w -= 3) < 0) break;
            G.push(
              p >> 12 | 224,
              p >> 6 & 63 | 128,
              p & 63 | 128
            );
          } else if (p < 1114112) {
            if ((w -= 4) < 0) break;
            G.push(
              p >> 18 | 240,
              p >> 12 & 63 | 128,
              p >> 6 & 63 | 128,
              p & 63 | 128
            );
          } else
            throw new Error("Invalid code point");
        }
        return G;
      }
      function le(_) {
        const w = [];
        for (let p = 0; p < _.length; ++p)
          w.push(_.charCodeAt(p) & 255);
        return w;
      }
      function h(_, w) {
        let p, $, P;
        const G = [];
        for (let K = 0; K < _.length && !((w -= 2) < 0); ++K)
          p = _.charCodeAt(K), $ = p >> 8, P = p % 256, G.push(P), G.push($);
        return G;
      }
      function q(_) {
        return D.toByteArray(b(_));
      }
      function V(_, w, p, $) {
        let P;
        for (P = 0; P < $ && !(P + p >= w.length || P >= _.length); ++P)
          w[P + p] = _[P];
        return P;
      }
      function S(_, w) {
        return _ instanceof w || _ != null && _.constructor != null && _.constructor.name != null && _.constructor.name === w.name;
      }
      function j(_) {
        return _ !== _;
      }
      const Z = function() {
        const _ = "0123456789abcdef", w = new Array(256);
        for (let p = 0; p < 16; ++p) {
          const $ = p * 16;
          for (let P = 0; P < 16; ++P)
            w[$ + P] = _[p] + _[P];
        }
        return w;
      }();
      function he(_) {
        return typeof BigInt > "u" ? ue : _;
      }
      function ue() {
        throw new Error("BigInt not supported");
      }
    })(e);
    const I = e.Buffer;
    t.Blob = e.Blob, t.BlobOptions = e.BlobOptions, t.Buffer = e.Buffer, t.File = e.File, t.FileOptions = e.FileOptions, t.INSPECT_MAX_BYTES = e.INSPECT_MAX_BYTES, t.SlowBuffer = e.SlowBuffer, t.TranscodeEncoding = e.TranscodeEncoding, t.atob = e.atob, t.btoa = e.btoa, t.constants = e.constants, t.default = I, t.isAscii = e.isAscii, t.isUtf8 = e.isUtf8, t.kMaxLength = e.kMaxLength, t.kStringMaxLength = e.kStringMaxLength, t.resolveObjectURL = e.resolveObjectURL, t.transcode = e.transcode;
  }(Ki)), Ki;
}
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
var Sa;
function Wo() {
  return Sa || (Sa = 1, function(t, e) {
    var r = Wc(), i = r.Buffer;
    function n(o, s) {
      for (var l in o)
        s[l] = o[l];
    }
    i.from && i.alloc && i.allocUnsafe && i.allocUnsafeSlow ? t.exports = r : (n(r, e), e.Buffer = a);
    function a(o, s, l) {
      return i(o, s, l);
    }
    a.prototype = Object.create(i.prototype), n(i, a), a.from = function(o, s, l) {
      if (typeof o == "number")
        throw new TypeError("Argument must not be a number");
      return i(o, s, l);
    }, a.alloc = function(o, s, l) {
      if (typeof o != "number")
        throw new TypeError("Argument must be a number");
      var f = i(o);
      return s !== void 0 ? typeof l == "string" ? f.fill(s, l) : f.fill(s) : f.fill(0), f;
    }, a.allocUnsafe = function(o) {
      if (typeof o != "number")
        throw new TypeError("Argument must be a number");
      return i(o);
    }, a.allocUnsafeSlow = function(o) {
      if (typeof o != "number")
        throw new TypeError("Argument must be a number");
      return r.SlowBuffer(o);
    };
  }(ki, ki.exports)), ki.exports;
}
var Ji, xa;
function qc() {
  if (xa) return Ji;
  xa = 1;
  var t = Wo().Buffer;
  function e(r, i) {
    this._block = t.alloc(r), this._finalSize = i, this._blockSize = r, this._len = 0;
  }
  return e.prototype.update = function(r, i) {
    typeof r == "string" && (i = i || "utf8", r = t.from(r, i));
    for (var n = this._block, a = this._blockSize, o = r.length, s = this._len, l = 0; l < o; ) {
      for (var f = s % a, u = Math.min(o - l, a - f), m = 0; m < u; m++)
        n[f + m] = r[l + m];
      s += u, l += u, s % a === 0 && this._update(n);
    }
    return this._len += o, this;
  }, e.prototype.digest = function(r) {
    var i = this._len % this._blockSize;
    this._block[i] = 128, this._block.fill(0, i + 1), i >= this._finalSize && (this._update(this._block), this._block.fill(0));
    var n = this._len * 8;
    if (n <= 4294967295)
      this._block.writeUInt32BE(n, this._blockSize - 4);
    else {
      var a = (n & 4294967295) >>> 0, o = (n - a) / 4294967296;
      this._block.writeUInt32BE(o, this._blockSize - 8), this._block.writeUInt32BE(a, this._blockSize - 4);
    }
    this._update(this._block);
    var s = this._hash();
    return r ? s.toString(r) : s;
  }, e.prototype._update = function() {
    throw new Error("_update must be implemented by subclass");
  }, Ji = e, Ji;
}
var Qi, Ia;
function Gc() {
  if (Ia) return Qi;
  Ia = 1;
  var t = Hc(), e = qc(), r = Wo().Buffer, i = [
    1518500249,
    1859775393,
    -1894007588,
    -899497514
  ], n = new Array(80);
  function a() {
    this.init(), this._w = n, e.call(this, 64, 56);
  }
  t(a, e), a.prototype.init = function() {
    return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
  };
  function o(u) {
    return u << 1 | u >>> 31;
  }
  function s(u) {
    return u << 5 | u >>> 27;
  }
  function l(u) {
    return u << 30 | u >>> 2;
  }
  function f(u, m, g, y) {
    return u === 0 ? m & g | ~m & y : u === 2 ? m & g | m & y | g & y : m ^ g ^ y;
  }
  return a.prototype._update = function(u) {
    for (var m = this._w, g = this._a | 0, y = this._b | 0, E = this._c | 0, A = this._d | 0, T = this._e | 0, I = 0; I < 16; ++I) m[I] = u.readInt32BE(I * 4);
    for (; I < 80; ++I) m[I] = o(m[I - 3] ^ m[I - 8] ^ m[I - 14] ^ m[I - 16]);
    for (var R = 0; R < 80; ++R) {
      var D = ~~(R / 20), L = s(g) + f(D, y, E, A) + T + m[R] + i[D] | 0;
      T = A, A = E, E = l(y), y = g, g = L;
    }
    this._a = g + this._a | 0, this._b = y + this._b | 0, this._c = E + this._c | 0, this._d = A + this._d | 0, this._e = T + this._e | 0;
  }, a.prototype._hash = function() {
    var u = r.allocUnsafe(20);
    return u.writeInt32BE(this._a | 0, 0), u.writeInt32BE(this._b | 0, 4), u.writeInt32BE(this._c | 0, 8), u.writeInt32BE(this._d | 0, 12), u.writeInt32BE(this._e | 0, 16), u;
  }, Qi = a, Qi;
}
var Zc = Gc(), qo = /* @__PURE__ */ Qt(Zc), en, Ra;
function Vc() {
  if (Ra) return en;
  Ra = 1;
  function t(n) {
    if (typeof n != "string")
      throw new TypeError("Path must be a string. Received " + JSON.stringify(n));
  }
  function e(n, a) {
    for (var o = "", s = 0, l = -1, f = 0, u, m = 0; m <= n.length; ++m) {
      if (m < n.length)
        u = n.charCodeAt(m);
      else {
        if (u === 47)
          break;
        u = 47;
      }
      if (u === 47) {
        if (!(l === m - 1 || f === 1)) if (l !== m - 1 && f === 2) {
          if (o.length < 2 || s !== 2 || o.charCodeAt(o.length - 1) !== 46 || o.charCodeAt(o.length - 2) !== 46) {
            if (o.length > 2) {
              var g = o.lastIndexOf("/");
              if (g !== o.length - 1) {
                g === -1 ? (o = "", s = 0) : (o = o.slice(0, g), s = o.length - 1 - o.lastIndexOf("/")), l = m, f = 0;
                continue;
              }
            } else if (o.length === 2 || o.length === 1) {
              o = "", s = 0, l = m, f = 0;
              continue;
            }
          }
          a && (o.length > 0 ? o += "/.." : o = "..", s = 2);
        } else
          o.length > 0 ? o += "/" + n.slice(l + 1, m) : o = n.slice(l + 1, m), s = m - l - 1;
        l = m, f = 0;
      } else u === 46 && f !== -1 ? ++f : f = -1;
    }
    return o;
  }
  function r(n, a) {
    var o = a.dir || a.root, s = a.base || (a.name || "") + (a.ext || "");
    return o ? o === a.root ? o + s : o + n + s : s;
  }
  var i = {
    // path.resolve([from ...], to)
    resolve: function() {
      for (var a = "", o = !1, s, l = arguments.length - 1; l >= -1 && !o; l--) {
        var f;
        l >= 0 ? f = arguments[l] : (s === void 0 && (s = gt.cwd()), f = s), t(f), f.length !== 0 && (a = f + "/" + a, o = f.charCodeAt(0) === 47);
      }
      return a = e(a, !o), o ? a.length > 0 ? "/" + a : "/" : a.length > 0 ? a : ".";
    },
    normalize: function(a) {
      if (t(a), a.length === 0) return ".";
      var o = a.charCodeAt(0) === 47, s = a.charCodeAt(a.length - 1) === 47;
      return a = e(a, !o), a.length === 0 && !o && (a = "."), a.length > 0 && s && (a += "/"), o ? "/" + a : a;
    },
    isAbsolute: function(a) {
      return t(a), a.length > 0 && a.charCodeAt(0) === 47;
    },
    join: function() {
      if (arguments.length === 0)
        return ".";
      for (var a, o = 0; o < arguments.length; ++o) {
        var s = arguments[o];
        t(s), s.length > 0 && (a === void 0 ? a = s : a += "/" + s);
      }
      return a === void 0 ? "." : i.normalize(a);
    },
    relative: function(a, o) {
      if (t(a), t(o), a === o || (a = i.resolve(a), o = i.resolve(o), a === o)) return "";
      for (var s = 1; s < a.length && a.charCodeAt(s) === 47; ++s)
        ;
      for (var l = a.length, f = l - s, u = 1; u < o.length && o.charCodeAt(u) === 47; ++u)
        ;
      for (var m = o.length, g = m - u, y = f < g ? f : g, E = -1, A = 0; A <= y; ++A) {
        if (A === y) {
          if (g > y) {
            if (o.charCodeAt(u + A) === 47)
              return o.slice(u + A + 1);
            if (A === 0)
              return o.slice(u + A);
          } else f > y && (a.charCodeAt(s + A) === 47 ? E = A : A === 0 && (E = 0));
          break;
        }
        var T = a.charCodeAt(s + A), I = o.charCodeAt(u + A);
        if (T !== I)
          break;
        T === 47 && (E = A);
      }
      var R = "";
      for (A = s + E + 1; A <= l; ++A)
        (A === l || a.charCodeAt(A) === 47) && (R.length === 0 ? R += ".." : R += "/..");
      return R.length > 0 ? R + o.slice(u + E) : (u += E, o.charCodeAt(u) === 47 && ++u, o.slice(u));
    },
    _makeLong: function(a) {
      return a;
    },
    dirname: function(a) {
      if (t(a), a.length === 0) return ".";
      for (var o = a.charCodeAt(0), s = o === 47, l = -1, f = !0, u = a.length - 1; u >= 1; --u)
        if (o = a.charCodeAt(u), o === 47) {
          if (!f) {
            l = u;
            break;
          }
        } else
          f = !1;
      return l === -1 ? s ? "/" : "." : s && l === 1 ? "//" : a.slice(0, l);
    },
    basename: function(a, o) {
      if (o !== void 0 && typeof o != "string") throw new TypeError('"ext" argument must be a string');
      t(a);
      var s = 0, l = -1, f = !0, u;
      if (o !== void 0 && o.length > 0 && o.length <= a.length) {
        if (o.length === a.length && o === a) return "";
        var m = o.length - 1, g = -1;
        for (u = a.length - 1; u >= 0; --u) {
          var y = a.charCodeAt(u);
          if (y === 47) {
            if (!f) {
              s = u + 1;
              break;
            }
          } else
            g === -1 && (f = !1, g = u + 1), m >= 0 && (y === o.charCodeAt(m) ? --m === -1 && (l = u) : (m = -1, l = g));
        }
        return s === l ? l = g : l === -1 && (l = a.length), a.slice(s, l);
      } else {
        for (u = a.length - 1; u >= 0; --u)
          if (a.charCodeAt(u) === 47) {
            if (!f) {
              s = u + 1;
              break;
            }
          } else l === -1 && (f = !1, l = u + 1);
        return l === -1 ? "" : a.slice(s, l);
      }
    },
    extname: function(a) {
      t(a);
      for (var o = -1, s = 0, l = -1, f = !0, u = 0, m = a.length - 1; m >= 0; --m) {
        var g = a.charCodeAt(m);
        if (g === 47) {
          if (!f) {
            s = m + 1;
            break;
          }
          continue;
        }
        l === -1 && (f = !1, l = m + 1), g === 46 ? o === -1 ? o = m : u !== 1 && (u = 1) : o !== -1 && (u = -1);
      }
      return o === -1 || l === -1 || // We saw a non-dot character immediately before the dot
      u === 0 || // The (right-most) trimmed path component is exactly '..'
      u === 1 && o === l - 1 && o === s + 1 ? "" : a.slice(o, l);
    },
    format: function(a) {
      if (a === null || typeof a != "object")
        throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof a);
      return r("/", a);
    },
    parse: function(a) {
      t(a);
      var o = { root: "", dir: "", base: "", ext: "", name: "" };
      if (a.length === 0) return o;
      var s = a.charCodeAt(0), l = s === 47, f;
      l ? (o.root = "/", f = 1) : f = 0;
      for (var u = -1, m = 0, g = -1, y = !0, E = a.length - 1, A = 0; E >= f; --E) {
        if (s = a.charCodeAt(E), s === 47) {
          if (!y) {
            m = E + 1;
            break;
          }
          continue;
        }
        g === -1 && (y = !1, g = E + 1), s === 46 ? u === -1 ? u = E : A !== 1 && (A = 1) : u !== -1 && (A = -1);
      }
      return u === -1 || g === -1 || // We saw a non-dot character immediately before the dot
      A === 0 || // The (right-most) trimmed path component is exactly '..'
      A === 1 && u === g - 1 && u === m + 1 ? g !== -1 && (m === 0 && l ? o.base = o.name = a.slice(1, g) : o.base = o.name = a.slice(m, g)) : (m === 0 && l ? (o.name = a.slice(1, u), o.base = a.slice(1, g)) : (o.name = a.slice(m, u), o.base = a.slice(m, g)), o.ext = a.slice(u, g)), m > 0 ? o.dir = a.slice(0, m - 1) : l && (o.dir = "/"), o;
    },
    sep: "/",
    delimiter: ":",
    win32: null,
    posix: null
  };
  return i.posix = i, en = i, en;
}
var te = Vc(), tn = {};
/*! crc32.js (C) 2014-present SheetJS -- http://sheetjs.com */
var Ta;
function Xc() {
  return Ta || (Ta = 1, function(t) {
    (function(e) {
      e(typeof DO_NOT_EXPORT_CRC > "u" ? t : {});
    })(function(e) {
      e.version = "1.2.2";
      function r() {
        for (var O = 0, W = new Array(256), z = 0; z != 256; ++z)
          O = z, O = O & 1 ? -306674912 ^ O >>> 1 : O >>> 1, O = O & 1 ? -306674912 ^ O >>> 1 : O >>> 1, O = O & 1 ? -306674912 ^ O >>> 1 : O >>> 1, O = O & 1 ? -306674912 ^ O >>> 1 : O >>> 1, O = O & 1 ? -306674912 ^ O >>> 1 : O >>> 1, O = O & 1 ? -306674912 ^ O >>> 1 : O >>> 1, O = O & 1 ? -306674912 ^ O >>> 1 : O >>> 1, O = O & 1 ? -306674912 ^ O >>> 1 : O >>> 1, W[z] = O;
        return typeof Int32Array < "u" ? new Int32Array(W) : W;
      }
      var i = r();
      function n(O) {
        var W = 0, z = 0, Y = 0, F = typeof Int32Array < "u" ? new Int32Array(4096) : new Array(4096);
        for (Y = 0; Y != 256; ++Y) F[Y] = O[Y];
        for (Y = 0; Y != 256; ++Y)
          for (z = O[Y], W = 256 + Y; W < 4096; W += 256) z = F[W] = z >>> 8 ^ O[z & 255];
        var J = [];
        for (Y = 1; Y != 16; ++Y) J[Y - 1] = typeof Int32Array < "u" ? F.subarray(Y * 256, Y * 256 + 256) : F.slice(Y * 256, Y * 256 + 256);
        return J;
      }
      var a = n(i), o = a[0], s = a[1], l = a[2], f = a[3], u = a[4], m = a[5], g = a[6], y = a[7], E = a[8], A = a[9], T = a[10], I = a[11], R = a[12], D = a[13], L = a[14];
      function U(O, W) {
        for (var z = W ^ -1, Y = 0, F = O.length; Y < F; ) z = z >>> 8 ^ i[(z ^ O.charCodeAt(Y++)) & 255];
        return ~z;
      }
      function M(O, W) {
        for (var z = W ^ -1, Y = O.length - 15, F = 0; F < Y; ) z = L[O[F++] ^ z & 255] ^ D[O[F++] ^ z >> 8 & 255] ^ R[O[F++] ^ z >> 16 & 255] ^ I[O[F++] ^ z >>> 24] ^ T[O[F++]] ^ A[O[F++]] ^ E[O[F++]] ^ y[O[F++]] ^ g[O[F++]] ^ m[O[F++]] ^ u[O[F++]] ^ f[O[F++]] ^ l[O[F++]] ^ s[O[F++]] ^ o[O[F++]] ^ i[O[F++]];
        for (Y += 15; F < Y; ) z = z >>> 8 ^ i[(z ^ O[F++]) & 255];
        return ~z;
      }
      function B(O, W) {
        for (var z = W ^ -1, Y = 0, F = O.length, J = 0, se = 0; Y < F; )
          J = O.charCodeAt(Y++), J < 128 ? z = z >>> 8 ^ i[(z ^ J) & 255] : J < 2048 ? (z = z >>> 8 ^ i[(z ^ (192 | J >> 6 & 31)) & 255], z = z >>> 8 ^ i[(z ^ (128 | J & 63)) & 255]) : J >= 55296 && J < 57344 ? (J = (J & 1023) + 64, se = O.charCodeAt(Y++) & 1023, z = z >>> 8 ^ i[(z ^ (240 | J >> 8 & 7)) & 255], z = z >>> 8 ^ i[(z ^ (128 | J >> 2 & 63)) & 255], z = z >>> 8 ^ i[(z ^ (128 | se >> 6 & 15 | (J & 3) << 4)) & 255], z = z >>> 8 ^ i[(z ^ (128 | se & 63)) & 255]) : (z = z >>> 8 ^ i[(z ^ (224 | J >> 12 & 15)) & 255], z = z >>> 8 ^ i[(z ^ (128 | J >> 6 & 63)) & 255], z = z >>> 8 ^ i[(z ^ (128 | J & 63)) & 255]);
        return ~z;
      }
      e.table = i, e.bstr = U, e.buf = M, e.str = B;
    });
  }(tn)), tn;
}
var Yc = Xc(), Kc = /* @__PURE__ */ Qt(Yc), rn = {}, $a;
function sr() {
  return $a || ($a = 1, function(t) {
    var e = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
    function r(a, o) {
      return Object.prototype.hasOwnProperty.call(a, o);
    }
    t.assign = function(a) {
      for (var o = Array.prototype.slice.call(arguments, 1); o.length; ) {
        var s = o.shift();
        if (s) {
          if (typeof s != "object")
            throw new TypeError(s + "must be non-object");
          for (var l in s)
            r(s, l) && (a[l] = s[l]);
        }
      }
      return a;
    }, t.shrinkBuf = function(a, o) {
      return a.length === o ? a : a.subarray ? a.subarray(0, o) : (a.length = o, a);
    };
    var i = {
      arraySet: function(a, o, s, l, f) {
        if (o.subarray && a.subarray) {
          a.set(o.subarray(s, s + l), f);
          return;
        }
        for (var u = 0; u < l; u++)
          a[f + u] = o[s + u];
      },
      // Join array of chunks to single array.
      flattenChunks: function(a) {
        var o, s, l, f, u, m;
        for (l = 0, o = 0, s = a.length; o < s; o++)
          l += a[o].length;
        for (m = new Uint8Array(l), f = 0, o = 0, s = a.length; o < s; o++)
          u = a[o], m.set(u, f), f += u.length;
        return m;
      }
    }, n = {
      arraySet: function(a, o, s, l, f) {
        for (var u = 0; u < l; u++)
          a[f + u] = o[s + u];
      },
      // Join array of chunks to single array.
      flattenChunks: function(a) {
        return [].concat.apply([], a);
      }
    };
    t.setTyped = function(a) {
      a ? (t.Buf8 = Uint8Array, t.Buf16 = Uint16Array, t.Buf32 = Int32Array, t.assign(t, i)) : (t.Buf8 = Array, t.Buf16 = Array, t.Buf32 = Array, t.assign(t, n));
    }, t.setTyped(e);
  }(rn)), rn;
}
var kr = {}, Dt = {}, ur = {}, Ba;
function Jc() {
  if (Ba) return ur;
  Ba = 1;
  var t = sr(), e = 4, r = 0, i = 1, n = 2;
  function a(c) {
    for (var d = c.length; --d >= 0; )
      c[d] = 0;
  }
  var o = 0, s = 1, l = 2, f = 3, u = 258, m = 29, g = 256, y = g + 1 + m, E = 30, A = 19, T = 2 * y + 1, I = 15, R = 16, D = 7, L = 256, U = 16, M = 17, B = 18, O = (
    /* extra bits for each length code */
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]
  ), W = (
    /* extra bits for each distance code */
    [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]
  ), z = (
    /* extra bits for each bit length code */
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]
  ), Y = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], F = 512, J = new Array((y + 2) * 2);
  a(J);
  var se = new Array(E * 2);
  a(se);
  var _e = new Array(F);
  a(_e);
  var ie = new Array(u - f + 1);
  a(ie);
  var X = new Array(m);
  a(X);
  var ne = new Array(E);
  a(ne);
  function de(c, d, v, C, x) {
    this.static_tree = c, this.extra_bits = d, this.extra_base = v, this.elems = C, this.max_length = x, this.has_stree = c && c.length;
  }
  var Se, Te, be;
  function Ae(c, d) {
    this.dyn_tree = c, this.max_code = 0, this.stat_desc = d;
  }
  function ye(c) {
    return c < 256 ? _e[c] : _e[256 + (c >>> 7)];
  }
  function $e(c, d) {
    c.pending_buf[c.pending++] = d & 255, c.pending_buf[c.pending++] = d >>> 8 & 255;
  }
  function ke(c, d, v) {
    c.bi_valid > R - v ? (c.bi_buf |= d << c.bi_valid & 65535, $e(c, c.bi_buf), c.bi_buf = d >> R - c.bi_valid, c.bi_valid += v - R) : (c.bi_buf |= d << c.bi_valid & 65535, c.bi_valid += v);
  }
  function Ee(c, d, v) {
    ke(
      c,
      v[d * 2],
      v[d * 2 + 1]
      /*.Len*/
    );
  }
  function De(c, d) {
    var v = 0;
    do
      v |= c & 1, c >>>= 1, v <<= 1;
    while (--d > 0);
    return v >>> 1;
  }
  function qe(c) {
    c.bi_valid === 16 ? ($e(c, c.bi_buf), c.bi_buf = 0, c.bi_valid = 0) : c.bi_valid >= 8 && (c.pending_buf[c.pending++] = c.bi_buf & 255, c.bi_buf >>= 8, c.bi_valid -= 8);
  }
  function rt(c, d) {
    var v = d.dyn_tree, C = d.max_code, x = d.stat_desc.static_tree, N = d.stat_desc.has_stree, b = d.stat_desc.extra_bits, Q = d.stat_desc.extra_base, le = d.stat_desc.max_length, h, q, V, S, j, Z, he = 0;
    for (S = 0; S <= I; S++)
      c.bl_count[S] = 0;
    for (v[c.heap[c.heap_max] * 2 + 1] = 0, h = c.heap_max + 1; h < T; h++)
      q = c.heap[h], S = v[v[q * 2 + 1] * 2 + 1] + 1, S > le && (S = le, he++), v[q * 2 + 1] = S, !(q > C) && (c.bl_count[S]++, j = 0, q >= Q && (j = b[q - Q]), Z = v[q * 2], c.opt_len += Z * (S + j), N && (c.static_len += Z * (x[q * 2 + 1] + j)));
    if (he !== 0) {
      do {
        for (S = le - 1; c.bl_count[S] === 0; )
          S--;
        c.bl_count[S]--, c.bl_count[S + 1] += 2, c.bl_count[le]--, he -= 2;
      } while (he > 0);
      for (S = le; S !== 0; S--)
        for (q = c.bl_count[S]; q !== 0; )
          V = c.heap[--h], !(V > C) && (v[V * 2 + 1] !== S && (c.opt_len += (S - v[V * 2 + 1]) * v[V * 2], v[V * 2 + 1] = S), q--);
    }
  }
  function je(c, d, v) {
    var C = new Array(I + 1), x = 0, N, b;
    for (N = 1; N <= I; N++)
      C[N] = x = x + v[N - 1] << 1;
    for (b = 0; b <= d; b++) {
      var Q = c[b * 2 + 1];
      Q !== 0 && (c[b * 2] = De(C[Q]++, Q));
    }
  }
  function we() {
    var c, d, v, C, x, N = new Array(I + 1);
    for (v = 0, C = 0; C < m - 1; C++)
      for (X[C] = v, c = 0; c < 1 << O[C]; c++)
        ie[v++] = C;
    for (ie[v - 1] = C, x = 0, C = 0; C < 16; C++)
      for (ne[C] = x, c = 0; c < 1 << W[C]; c++)
        _e[x++] = C;
    for (x >>= 7; C < E; C++)
      for (ne[C] = x << 7, c = 0; c < 1 << W[C] - 7; c++)
        _e[256 + x++] = C;
    for (d = 0; d <= I; d++)
      N[d] = 0;
    for (c = 0; c <= 143; )
      J[c * 2 + 1] = 8, c++, N[8]++;
    for (; c <= 255; )
      J[c * 2 + 1] = 9, c++, N[9]++;
    for (; c <= 279; )
      J[c * 2 + 1] = 7, c++, N[7]++;
    for (; c <= 287; )
      J[c * 2 + 1] = 8, c++, N[8]++;
    for (je(J, y + 1, N), c = 0; c < E; c++)
      se[c * 2 + 1] = 5, se[c * 2] = De(c, 5);
    Se = new de(J, O, g + 1, y, I), Te = new de(se, W, 0, E, I), be = new de(new Array(0), z, 0, A, D);
  }
  function Oe(c) {
    var d;
    for (d = 0; d < y; d++)
      c.dyn_ltree[d * 2] = 0;
    for (d = 0; d < E; d++)
      c.dyn_dtree[d * 2] = 0;
    for (d = 0; d < A; d++)
      c.bl_tree[d * 2] = 0;
    c.dyn_ltree[L * 2] = 1, c.opt_len = c.static_len = 0, c.last_lit = c.matches = 0;
  }
  function Ve(c) {
    c.bi_valid > 8 ? $e(c, c.bi_buf) : c.bi_valid > 0 && (c.pending_buf[c.pending++] = c.bi_buf), c.bi_buf = 0, c.bi_valid = 0;
  }
  function Me(c, d, v, C) {
    Ve(c), $e(c, v), $e(c, ~v), t.arraySet(c.pending_buf, c.window, d, v, c.pending), c.pending += v;
  }
  function ze(c, d, v, C) {
    var x = d * 2, N = v * 2;
    return c[x] < c[N] || c[x] === c[N] && C[d] <= C[v];
  }
  function Ce(c, d, v) {
    for (var C = c.heap[v], x = v << 1; x <= c.heap_len && (x < c.heap_len && ze(d, c.heap[x + 1], c.heap[x], c.depth) && x++, !ze(d, C, c.heap[x], c.depth)); )
      c.heap[v] = c.heap[x], v = x, x <<= 1;
    c.heap[v] = C;
  }
  function xe(c, d, v) {
    var C, x, N = 0, b, Q;
    if (c.last_lit !== 0)
      do
        C = c.pending_buf[c.d_buf + N * 2] << 8 | c.pending_buf[c.d_buf + N * 2 + 1], x = c.pending_buf[c.l_buf + N], N++, C === 0 ? Ee(c, x, d) : (b = ie[x], Ee(c, b + g + 1, d), Q = O[b], Q !== 0 && (x -= X[b], ke(c, x, Q)), C--, b = ye(C), Ee(c, b, v), Q = W[b], Q !== 0 && (C -= ne[b], ke(c, C, Q)));
      while (N < c.last_lit);
    Ee(c, L, d);
  }
  function lt(c, d) {
    var v = d.dyn_tree, C = d.stat_desc.static_tree, x = d.stat_desc.has_stree, N = d.stat_desc.elems, b, Q, le = -1, h;
    for (c.heap_len = 0, c.heap_max = T, b = 0; b < N; b++)
      v[b * 2] !== 0 ? (c.heap[++c.heap_len] = le = b, c.depth[b] = 0) : v[b * 2 + 1] = 0;
    for (; c.heap_len < 2; )
      h = c.heap[++c.heap_len] = le < 2 ? ++le : 0, v[h * 2] = 1, c.depth[h] = 0, c.opt_len--, x && (c.static_len -= C[h * 2 + 1]);
    for (d.max_code = le, b = c.heap_len >> 1; b >= 1; b--)
      Ce(c, v, b);
    h = N;
    do
      b = c.heap[
        1
        /*SMALLEST*/
      ], c.heap[
        1
        /*SMALLEST*/
      ] = c.heap[c.heap_len--], Ce(
        c,
        v,
        1
        /*SMALLEST*/
      ), Q = c.heap[
        1
        /*SMALLEST*/
      ], c.heap[--c.heap_max] = b, c.heap[--c.heap_max] = Q, v[h * 2] = v[b * 2] + v[Q * 2], c.depth[h] = (c.depth[b] >= c.depth[Q] ? c.depth[b] : c.depth[Q]) + 1, v[b * 2 + 1] = v[Q * 2 + 1] = h, c.heap[
        1
        /*SMALLEST*/
      ] = h++, Ce(
        c,
        v,
        1
        /*SMALLEST*/
      );
    while (c.heap_len >= 2);
    c.heap[--c.heap_max] = c.heap[
      1
      /*SMALLEST*/
    ], rt(c, d), je(v, le, c.bl_count);
  }
  function St(c, d, v) {
    var C, x = -1, N, b = d[0 * 2 + 1], Q = 0, le = 7, h = 4;
    for (b === 0 && (le = 138, h = 3), d[(v + 1) * 2 + 1] = 65535, C = 0; C <= v; C++)
      N = b, b = d[(C + 1) * 2 + 1], !(++Q < le && N === b) && (Q < h ? c.bl_tree[N * 2] += Q : N !== 0 ? (N !== x && c.bl_tree[N * 2]++, c.bl_tree[U * 2]++) : Q <= 10 ? c.bl_tree[M * 2]++ : c.bl_tree[B * 2]++, Q = 0, x = N, b === 0 ? (le = 138, h = 3) : N === b ? (le = 6, h = 3) : (le = 7, h = 4));
  }
  function xt(c, d, v) {
    var C, x = -1, N, b = d[0 * 2 + 1], Q = 0, le = 7, h = 4;
    for (b === 0 && (le = 138, h = 3), C = 0; C <= v; C++)
      if (N = b, b = d[(C + 1) * 2 + 1], !(++Q < le && N === b)) {
        if (Q < h)
          do
            Ee(c, N, c.bl_tree);
          while (--Q !== 0);
        else N !== 0 ? (N !== x && (Ee(c, N, c.bl_tree), Q--), Ee(c, U, c.bl_tree), ke(c, Q - 3, 2)) : Q <= 10 ? (Ee(c, M, c.bl_tree), ke(c, Q - 3, 3)) : (Ee(c, B, c.bl_tree), ke(c, Q - 11, 7));
        Q = 0, x = N, b === 0 ? (le = 138, h = 3) : N === b ? (le = 6, h = 3) : (le = 7, h = 4);
      }
  }
  function Ne(c) {
    var d;
    for (St(c, c.dyn_ltree, c.l_desc.max_code), St(c, c.dyn_dtree, c.d_desc.max_code), lt(c, c.bl_desc), d = A - 1; d >= 3 && c.bl_tree[Y[d] * 2 + 1] === 0; d--)
      ;
    return c.opt_len += 3 * (d + 1) + 5 + 5 + 4, d;
  }
  function Xe(c, d, v, C) {
    var x;
    for (ke(c, d - 257, 5), ke(c, v - 1, 5), ke(c, C - 4, 4), x = 0; x < C; x++)
      ke(c, c.bl_tree[Y[x] * 2 + 1], 3);
    xt(c, c.dyn_ltree, d - 1), xt(c, c.dyn_dtree, v - 1);
  }
  function ut(c) {
    var d = 4093624447, v;
    for (v = 0; v <= 31; v++, d >>>= 1)
      if (d & 1 && c.dyn_ltree[v * 2] !== 0)
        return r;
    if (c.dyn_ltree[9 * 2] !== 0 || c.dyn_ltree[10 * 2] !== 0 || c.dyn_ltree[13 * 2] !== 0)
      return i;
    for (v = 32; v < g; v++)
      if (c.dyn_ltree[v * 2] !== 0)
        return i;
    return r;
  }
  var Ze = !1;
  function vt(c) {
    Ze || (we(), Ze = !0), c.l_desc = new Ae(c.dyn_ltree, Se), c.d_desc = new Ae(c.dyn_dtree, Te), c.bl_desc = new Ae(c.bl_tree, be), c.bi_buf = 0, c.bi_valid = 0, Oe(c);
  }
  function Et(c, d, v, C) {
    ke(c, (o << 1) + (C ? 1 : 0), 3), Me(c, d, v);
  }
  function Pe(c) {
    ke(c, s << 1, 3), Ee(c, L, J), qe(c);
  }
  function nt(c, d, v, C) {
    var x, N, b = 0;
    c.level > 0 ? (c.strm.data_type === n && (c.strm.data_type = ut(c)), lt(c, c.l_desc), lt(c, c.d_desc), b = Ne(c), x = c.opt_len + 3 + 7 >>> 3, N = c.static_len + 3 + 7 >>> 3, N <= x && (x = N)) : x = N = v + 5, v + 4 <= x && d !== -1 ? Et(c, d, v, C) : c.strategy === e || N === x ? (ke(c, (s << 1) + (C ? 1 : 0), 3), xe(c, J, se)) : (ke(c, (l << 1) + (C ? 1 : 0), 3), Xe(c, c.l_desc.max_code + 1, c.d_desc.max_code + 1, b + 1), xe(c, c.dyn_ltree, c.dyn_dtree)), Oe(c), C && Ve(c);
  }
  function k(c, d, v) {
    return c.pending_buf[c.d_buf + c.last_lit * 2] = d >>> 8 & 255, c.pending_buf[c.d_buf + c.last_lit * 2 + 1] = d & 255, c.pending_buf[c.l_buf + c.last_lit] = v & 255, c.last_lit++, d === 0 ? c.dyn_ltree[v * 2]++ : (c.matches++, d--, c.dyn_ltree[(ie[v] + g + 1) * 2]++, c.dyn_dtree[ye(d) * 2]++), c.last_lit === c.lit_bufsize - 1;
  }
  return ur._tr_init = vt, ur._tr_stored_block = Et, ur._tr_flush_block = nt, ur._tr_tally = k, ur._tr_align = Pe, ur;
}
var nn, Aa;
function Go() {
  if (Aa) return nn;
  Aa = 1;
  function t(e, r, i, n) {
    for (var a = e & 65535 | 0, o = e >>> 16 & 65535 | 0, s = 0; i !== 0; ) {
      s = i > 2e3 ? 2e3 : i, i -= s;
      do
        a = a + r[n++] | 0, o = o + a | 0;
      while (--s);
      a %= 65521, o %= 65521;
    }
    return a | o << 16 | 0;
  }
  return nn = t, nn;
}
var an, Da;
function Zo() {
  if (Da) return an;
  Da = 1;
  function t() {
    for (var i, n = [], a = 0; a < 256; a++) {
      i = a;
      for (var o = 0; o < 8; o++)
        i = i & 1 ? 3988292384 ^ i >>> 1 : i >>> 1;
      n[a] = i;
    }
    return n;
  }
  var e = t();
  function r(i, n, a, o) {
    var s = e, l = o + a;
    i ^= -1;
    for (var f = o; f < l; f++)
      i = i >>> 8 ^ s[(i ^ n[f]) & 255];
    return i ^ -1;
  }
  return an = r, an;
}
var on, Oa;
function aa() {
  return Oa || (Oa = 1, on = {
    2: "need dictionary",
    /* Z_NEED_DICT       2  */
    1: "stream end",
    /* Z_STREAM_END      1  */
    0: "",
    /* Z_OK              0  */
    "-1": "file error",
    /* Z_ERRNO         (-1) */
    "-2": "stream error",
    /* Z_STREAM_ERROR  (-2) */
    "-3": "data error",
    /* Z_DATA_ERROR    (-3) */
    "-4": "insufficient memory",
    /* Z_MEM_ERROR     (-4) */
    "-5": "buffer error",
    /* Z_BUF_ERROR     (-5) */
    "-6": "incompatible version"
    /* Z_VERSION_ERROR (-6) */
  }), on;
}
var Ca;
function Qc() {
  if (Ca) return Dt;
  Ca = 1;
  var t = sr(), e = Jc(), r = Go(), i = Zo(), n = aa(), a = 0, o = 1, s = 3, l = 4, f = 5, u = 0, m = 1, g = -2, y = -3, E = -5, A = -1, T = 1, I = 2, R = 3, D = 4, L = 0, U = 2, M = 8, B = 9, O = 15, W = 8, z = 29, Y = 256, F = Y + 1 + z, J = 30, se = 19, _e = 2 * F + 1, ie = 15, X = 3, ne = 258, de = ne + X + 1, Se = 32, Te = 42, be = 69, Ae = 73, ye = 91, $e = 103, ke = 113, Ee = 666, De = 1, qe = 2, rt = 3, je = 4, we = 3;
  function Oe(h, q) {
    return h.msg = n[q], q;
  }
  function Ve(h) {
    return (h << 1) - (h > 4 ? 9 : 0);
  }
  function Me(h) {
    for (var q = h.length; --q >= 0; )
      h[q] = 0;
  }
  function ze(h) {
    var q = h.state, V = q.pending;
    V > h.avail_out && (V = h.avail_out), V !== 0 && (t.arraySet(h.output, q.pending_buf, q.pending_out, V, h.next_out), h.next_out += V, q.pending_out += V, h.total_out += V, h.avail_out -= V, q.pending -= V, q.pending === 0 && (q.pending_out = 0));
  }
  function Ce(h, q) {
    e._tr_flush_block(h, h.block_start >= 0 ? h.block_start : -1, h.strstart - h.block_start, q), h.block_start = h.strstart, ze(h.strm);
  }
  function xe(h, q) {
    h.pending_buf[h.pending++] = q;
  }
  function lt(h, q) {
    h.pending_buf[h.pending++] = q >>> 8 & 255, h.pending_buf[h.pending++] = q & 255;
  }
  function St(h, q, V, S) {
    var j = h.avail_in;
    return j > S && (j = S), j === 0 ? 0 : (h.avail_in -= j, t.arraySet(q, h.input, h.next_in, j, V), h.state.wrap === 1 ? h.adler = r(h.adler, q, j, V) : h.state.wrap === 2 && (h.adler = i(h.adler, q, j, V)), h.next_in += j, h.total_in += j, j);
  }
  function xt(h, q) {
    var V = h.max_chain_length, S = h.strstart, j, Z, he = h.prev_length, ue = h.nice_match, _ = h.strstart > h.w_size - de ? h.strstart - (h.w_size - de) : 0, w = h.window, p = h.w_mask, $ = h.prev, P = h.strstart + ne, G = w[S + he - 1], K = w[S + he];
    h.prev_length >= h.good_match && (V >>= 2), ue > h.lookahead && (ue = h.lookahead);
    do
      if (j = q, !(w[j + he] !== K || w[j + he - 1] !== G || w[j] !== w[S] || w[++j] !== w[S + 1])) {
        S += 2, j++;
        do
          ;
        while (w[++S] === w[++j] && w[++S] === w[++j] && w[++S] === w[++j] && w[++S] === w[++j] && w[++S] === w[++j] && w[++S] === w[++j] && w[++S] === w[++j] && w[++S] === w[++j] && S < P);
        if (Z = ne - (P - S), S = P - ne, Z > he) {
          if (h.match_start = q, he = Z, Z >= ue)
            break;
          G = w[S + he - 1], K = w[S + he];
        }
      }
    while ((q = $[q & p]) > _ && --V !== 0);
    return he <= h.lookahead ? he : h.lookahead;
  }
  function Ne(h) {
    var q = h.w_size, V, S, j, Z, he;
    do {
      if (Z = h.window_size - h.lookahead - h.strstart, h.strstart >= q + (q - de)) {
        t.arraySet(h.window, h.window, q, q, 0), h.match_start -= q, h.strstart -= q, h.block_start -= q, S = h.hash_size, V = S;
        do
          j = h.head[--V], h.head[V] = j >= q ? j - q : 0;
        while (--S);
        S = q, V = S;
        do
          j = h.prev[--V], h.prev[V] = j >= q ? j - q : 0;
        while (--S);
        Z += q;
      }
      if (h.strm.avail_in === 0)
        break;
      if (S = St(h.strm, h.window, h.strstart + h.lookahead, Z), h.lookahead += S, h.lookahead + h.insert >= X)
        for (he = h.strstart - h.insert, h.ins_h = h.window[he], h.ins_h = (h.ins_h << h.hash_shift ^ h.window[he + 1]) & h.hash_mask; h.insert && (h.ins_h = (h.ins_h << h.hash_shift ^ h.window[he + X - 1]) & h.hash_mask, h.prev[he & h.w_mask] = h.head[h.ins_h], h.head[h.ins_h] = he, he++, h.insert--, !(h.lookahead + h.insert < X)); )
          ;
    } while (h.lookahead < de && h.strm.avail_in !== 0);
  }
  function Xe(h, q) {
    var V = 65535;
    for (V > h.pending_buf_size - 5 && (V = h.pending_buf_size - 5); ; ) {
      if (h.lookahead <= 1) {
        if (Ne(h), h.lookahead === 0 && q === a)
          return De;
        if (h.lookahead === 0)
          break;
      }
      h.strstart += h.lookahead, h.lookahead = 0;
      var S = h.block_start + V;
      if ((h.strstart === 0 || h.strstart >= S) && (h.lookahead = h.strstart - S, h.strstart = S, Ce(h, !1), h.strm.avail_out === 0) || h.strstart - h.block_start >= h.w_size - de && (Ce(h, !1), h.strm.avail_out === 0))
        return De;
    }
    return h.insert = 0, q === l ? (Ce(h, !0), h.strm.avail_out === 0 ? rt : je) : (h.strstart > h.block_start && (Ce(h, !1), h.strm.avail_out === 0), De);
  }
  function ut(h, q) {
    for (var V, S; ; ) {
      if (h.lookahead < de) {
        if (Ne(h), h.lookahead < de && q === a)
          return De;
        if (h.lookahead === 0)
          break;
      }
      if (V = 0, h.lookahead >= X && (h.ins_h = (h.ins_h << h.hash_shift ^ h.window[h.strstart + X - 1]) & h.hash_mask, V = h.prev[h.strstart & h.w_mask] = h.head[h.ins_h], h.head[h.ins_h] = h.strstart), V !== 0 && h.strstart - V <= h.w_size - de && (h.match_length = xt(h, V)), h.match_length >= X)
        if (S = e._tr_tally(h, h.strstart - h.match_start, h.match_length - X), h.lookahead -= h.match_length, h.match_length <= h.max_lazy_match && h.lookahead >= X) {
          h.match_length--;
          do
            h.strstart++, h.ins_h = (h.ins_h << h.hash_shift ^ h.window[h.strstart + X - 1]) & h.hash_mask, V = h.prev[h.strstart & h.w_mask] = h.head[h.ins_h], h.head[h.ins_h] = h.strstart;
          while (--h.match_length !== 0);
          h.strstart++;
        } else
          h.strstart += h.match_length, h.match_length = 0, h.ins_h = h.window[h.strstart], h.ins_h = (h.ins_h << h.hash_shift ^ h.window[h.strstart + 1]) & h.hash_mask;
      else
        S = e._tr_tally(h, 0, h.window[h.strstart]), h.lookahead--, h.strstart++;
      if (S && (Ce(h, !1), h.strm.avail_out === 0))
        return De;
    }
    return h.insert = h.strstart < X - 1 ? h.strstart : X - 1, q === l ? (Ce(h, !0), h.strm.avail_out === 0 ? rt : je) : h.last_lit && (Ce(h, !1), h.strm.avail_out === 0) ? De : qe;
  }
  function Ze(h, q) {
    for (var V, S, j; ; ) {
      if (h.lookahead < de) {
        if (Ne(h), h.lookahead < de && q === a)
          return De;
        if (h.lookahead === 0)
          break;
      }
      if (V = 0, h.lookahead >= X && (h.ins_h = (h.ins_h << h.hash_shift ^ h.window[h.strstart + X - 1]) & h.hash_mask, V = h.prev[h.strstart & h.w_mask] = h.head[h.ins_h], h.head[h.ins_h] = h.strstart), h.prev_length = h.match_length, h.prev_match = h.match_start, h.match_length = X - 1, V !== 0 && h.prev_length < h.max_lazy_match && h.strstart - V <= h.w_size - de && (h.match_length = xt(h, V), h.match_length <= 5 && (h.strategy === T || h.match_length === X && h.strstart - h.match_start > 4096) && (h.match_length = X - 1)), h.prev_length >= X && h.match_length <= h.prev_length) {
        j = h.strstart + h.lookahead - X, S = e._tr_tally(h, h.strstart - 1 - h.prev_match, h.prev_length - X), h.lookahead -= h.prev_length - 1, h.prev_length -= 2;
        do
          ++h.strstart <= j && (h.ins_h = (h.ins_h << h.hash_shift ^ h.window[h.strstart + X - 1]) & h.hash_mask, V = h.prev[h.strstart & h.w_mask] = h.head[h.ins_h], h.head[h.ins_h] = h.strstart);
        while (--h.prev_length !== 0);
        if (h.match_available = 0, h.match_length = X - 1, h.strstart++, S && (Ce(h, !1), h.strm.avail_out === 0))
          return De;
      } else if (h.match_available) {
        if (S = e._tr_tally(h, 0, h.window[h.strstart - 1]), S && Ce(h, !1), h.strstart++, h.lookahead--, h.strm.avail_out === 0)
          return De;
      } else
        h.match_available = 1, h.strstart++, h.lookahead--;
    }
    return h.match_available && (S = e._tr_tally(h, 0, h.window[h.strstart - 1]), h.match_available = 0), h.insert = h.strstart < X - 1 ? h.strstart : X - 1, q === l ? (Ce(h, !0), h.strm.avail_out === 0 ? rt : je) : h.last_lit && (Ce(h, !1), h.strm.avail_out === 0) ? De : qe;
  }
  function vt(h, q) {
    for (var V, S, j, Z, he = h.window; ; ) {
      if (h.lookahead <= ne) {
        if (Ne(h), h.lookahead <= ne && q === a)
          return De;
        if (h.lookahead === 0)
          break;
      }
      if (h.match_length = 0, h.lookahead >= X && h.strstart > 0 && (j = h.strstart - 1, S = he[j], S === he[++j] && S === he[++j] && S === he[++j])) {
        Z = h.strstart + ne;
        do
          ;
        while (S === he[++j] && S === he[++j] && S === he[++j] && S === he[++j] && S === he[++j] && S === he[++j] && S === he[++j] && S === he[++j] && j < Z);
        h.match_length = ne - (Z - j), h.match_length > h.lookahead && (h.match_length = h.lookahead);
      }
      if (h.match_length >= X ? (V = e._tr_tally(h, 1, h.match_length - X), h.lookahead -= h.match_length, h.strstart += h.match_length, h.match_length = 0) : (V = e._tr_tally(h, 0, h.window[h.strstart]), h.lookahead--, h.strstart++), V && (Ce(h, !1), h.strm.avail_out === 0))
        return De;
    }
    return h.insert = 0, q === l ? (Ce(h, !0), h.strm.avail_out === 0 ? rt : je) : h.last_lit && (Ce(h, !1), h.strm.avail_out === 0) ? De : qe;
  }
  function Et(h, q) {
    for (var V; ; ) {
      if (h.lookahead === 0 && (Ne(h), h.lookahead === 0)) {
        if (q === a)
          return De;
        break;
      }
      if (h.match_length = 0, V = e._tr_tally(h, 0, h.window[h.strstart]), h.lookahead--, h.strstart++, V && (Ce(h, !1), h.strm.avail_out === 0))
        return De;
    }
    return h.insert = 0, q === l ? (Ce(h, !0), h.strm.avail_out === 0 ? rt : je) : h.last_lit && (Ce(h, !1), h.strm.avail_out === 0) ? De : qe;
  }
  function Pe(h, q, V, S, j) {
    this.good_length = h, this.max_lazy = q, this.nice_length = V, this.max_chain = S, this.func = j;
  }
  var nt;
  nt = [
    /*      good lazy nice chain */
    new Pe(0, 0, 0, 0, Xe),
    /* 0 store only */
    new Pe(4, 4, 8, 4, ut),
    /* 1 max speed, no lazy matches */
    new Pe(4, 5, 16, 8, ut),
    /* 2 */
    new Pe(4, 6, 32, 32, ut),
    /* 3 */
    new Pe(4, 4, 16, 16, Ze),
    /* 4 lazy matches */
    new Pe(8, 16, 32, 32, Ze),
    /* 5 */
    new Pe(8, 16, 128, 128, Ze),
    /* 6 */
    new Pe(8, 32, 128, 256, Ze),
    /* 7 */
    new Pe(32, 128, 258, 1024, Ze),
    /* 8 */
    new Pe(32, 258, 258, 4096, Ze)
    /* 9 max compression */
  ];
  function k(h) {
    h.window_size = 2 * h.w_size, Me(h.head), h.max_lazy_match = nt[h.level].max_lazy, h.good_match = nt[h.level].good_length, h.nice_match = nt[h.level].nice_length, h.max_chain_length = nt[h.level].max_chain, h.strstart = 0, h.block_start = 0, h.lookahead = 0, h.insert = 0, h.match_length = h.prev_length = X - 1, h.match_available = 0, h.ins_h = 0;
  }
  function c() {
    this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = M, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new t.Buf16(_e * 2), this.dyn_dtree = new t.Buf16((2 * J + 1) * 2), this.bl_tree = new t.Buf16((2 * se + 1) * 2), Me(this.dyn_ltree), Me(this.dyn_dtree), Me(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new t.Buf16(ie + 1), this.heap = new t.Buf16(2 * F + 1), Me(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new t.Buf16(2 * F + 1), Me(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
  }
  function d(h) {
    var q;
    return !h || !h.state ? Oe(h, g) : (h.total_in = h.total_out = 0, h.data_type = U, q = h.state, q.pending = 0, q.pending_out = 0, q.wrap < 0 && (q.wrap = -q.wrap), q.status = q.wrap ? Te : ke, h.adler = q.wrap === 2 ? 0 : 1, q.last_flush = a, e._tr_init(q), u);
  }
  function v(h) {
    var q = d(h);
    return q === u && k(h.state), q;
  }
  function C(h, q) {
    return !h || !h.state || h.state.wrap !== 2 ? g : (h.state.gzhead = q, u);
  }
  function x(h, q, V, S, j, Z) {
    if (!h)
      return g;
    var he = 1;
    if (q === A && (q = 6), S < 0 ? (he = 0, S = -S) : S > 15 && (he = 2, S -= 16), j < 1 || j > B || V !== M || S < 8 || S > 15 || q < 0 || q > 9 || Z < 0 || Z > D)
      return Oe(h, g);
    S === 8 && (S = 9);
    var ue = new c();
    return h.state = ue, ue.strm = h, ue.wrap = he, ue.gzhead = null, ue.w_bits = S, ue.w_size = 1 << ue.w_bits, ue.w_mask = ue.w_size - 1, ue.hash_bits = j + 7, ue.hash_size = 1 << ue.hash_bits, ue.hash_mask = ue.hash_size - 1, ue.hash_shift = ~~((ue.hash_bits + X - 1) / X), ue.window = new t.Buf8(ue.w_size * 2), ue.head = new t.Buf16(ue.hash_size), ue.prev = new t.Buf16(ue.w_size), ue.lit_bufsize = 1 << j + 6, ue.pending_buf_size = ue.lit_bufsize * 4, ue.pending_buf = new t.Buf8(ue.pending_buf_size), ue.d_buf = 1 * ue.lit_bufsize, ue.l_buf = 3 * ue.lit_bufsize, ue.level = q, ue.strategy = Z, ue.method = V, v(h);
  }
  function N(h, q) {
    return x(h, q, M, O, W, L);
  }
  function b(h, q) {
    var V, S, j, Z;
    if (!h || !h.state || q > f || q < 0)
      return h ? Oe(h, g) : g;
    if (S = h.state, !h.output || !h.input && h.avail_in !== 0 || S.status === Ee && q !== l)
      return Oe(h, h.avail_out === 0 ? E : g);
    if (S.strm = h, V = S.last_flush, S.last_flush = q, S.status === Te)
      if (S.wrap === 2)
        h.adler = 0, xe(S, 31), xe(S, 139), xe(S, 8), S.gzhead ? (xe(
          S,
          (S.gzhead.text ? 1 : 0) + (S.gzhead.hcrc ? 2 : 0) + (S.gzhead.extra ? 4 : 0) + (S.gzhead.name ? 8 : 0) + (S.gzhead.comment ? 16 : 0)
        ), xe(S, S.gzhead.time & 255), xe(S, S.gzhead.time >> 8 & 255), xe(S, S.gzhead.time >> 16 & 255), xe(S, S.gzhead.time >> 24 & 255), xe(S, S.level === 9 ? 2 : S.strategy >= I || S.level < 2 ? 4 : 0), xe(S, S.gzhead.os & 255), S.gzhead.extra && S.gzhead.extra.length && (xe(S, S.gzhead.extra.length & 255), xe(S, S.gzhead.extra.length >> 8 & 255)), S.gzhead.hcrc && (h.adler = i(h.adler, S.pending_buf, S.pending, 0)), S.gzindex = 0, S.status = be) : (xe(S, 0), xe(S, 0), xe(S, 0), xe(S, 0), xe(S, 0), xe(S, S.level === 9 ? 2 : S.strategy >= I || S.level < 2 ? 4 : 0), xe(S, we), S.status = ke);
      else {
        var he = M + (S.w_bits - 8 << 4) << 8, ue = -1;
        S.strategy >= I || S.level < 2 ? ue = 0 : S.level < 6 ? ue = 1 : S.level === 6 ? ue = 2 : ue = 3, he |= ue << 6, S.strstart !== 0 && (he |= Se), he += 31 - he % 31, S.status = ke, lt(S, he), S.strstart !== 0 && (lt(S, h.adler >>> 16), lt(S, h.adler & 65535)), h.adler = 1;
      }
    if (S.status === be)
      if (S.gzhead.extra) {
        for (j = S.pending; S.gzindex < (S.gzhead.extra.length & 65535) && !(S.pending === S.pending_buf_size && (S.gzhead.hcrc && S.pending > j && (h.adler = i(h.adler, S.pending_buf, S.pending - j, j)), ze(h), j = S.pending, S.pending === S.pending_buf_size)); )
          xe(S, S.gzhead.extra[S.gzindex] & 255), S.gzindex++;
        S.gzhead.hcrc && S.pending > j && (h.adler = i(h.adler, S.pending_buf, S.pending - j, j)), S.gzindex === S.gzhead.extra.length && (S.gzindex = 0, S.status = Ae);
      } else
        S.status = Ae;
    if (S.status === Ae)
      if (S.gzhead.name) {
        j = S.pending;
        do {
          if (S.pending === S.pending_buf_size && (S.gzhead.hcrc && S.pending > j && (h.adler = i(h.adler, S.pending_buf, S.pending - j, j)), ze(h), j = S.pending, S.pending === S.pending_buf_size)) {
            Z = 1;
            break;
          }
          S.gzindex < S.gzhead.name.length ? Z = S.gzhead.name.charCodeAt(S.gzindex++) & 255 : Z = 0, xe(S, Z);
        } while (Z !== 0);
        S.gzhead.hcrc && S.pending > j && (h.adler = i(h.adler, S.pending_buf, S.pending - j, j)), Z === 0 && (S.gzindex = 0, S.status = ye);
      } else
        S.status = ye;
    if (S.status === ye)
      if (S.gzhead.comment) {
        j = S.pending;
        do {
          if (S.pending === S.pending_buf_size && (S.gzhead.hcrc && S.pending > j && (h.adler = i(h.adler, S.pending_buf, S.pending - j, j)), ze(h), j = S.pending, S.pending === S.pending_buf_size)) {
            Z = 1;
            break;
          }
          S.gzindex < S.gzhead.comment.length ? Z = S.gzhead.comment.charCodeAt(S.gzindex++) & 255 : Z = 0, xe(S, Z);
        } while (Z !== 0);
        S.gzhead.hcrc && S.pending > j && (h.adler = i(h.adler, S.pending_buf, S.pending - j, j)), Z === 0 && (S.status = $e);
      } else
        S.status = $e;
    if (S.status === $e && (S.gzhead.hcrc ? (S.pending + 2 > S.pending_buf_size && ze(h), S.pending + 2 <= S.pending_buf_size && (xe(S, h.adler & 255), xe(S, h.adler >> 8 & 255), h.adler = 0, S.status = ke)) : S.status = ke), S.pending !== 0) {
      if (ze(h), h.avail_out === 0)
        return S.last_flush = -1, u;
    } else if (h.avail_in === 0 && Ve(q) <= Ve(V) && q !== l)
      return Oe(h, E);
    if (S.status === Ee && h.avail_in !== 0)
      return Oe(h, E);
    if (h.avail_in !== 0 || S.lookahead !== 0 || q !== a && S.status !== Ee) {
      var _ = S.strategy === I ? Et(S, q) : S.strategy === R ? vt(S, q) : nt[S.level].func(S, q);
      if ((_ === rt || _ === je) && (S.status = Ee), _ === De || _ === rt)
        return h.avail_out === 0 && (S.last_flush = -1), u;
      if (_ === qe && (q === o ? e._tr_align(S) : q !== f && (e._tr_stored_block(S, 0, 0, !1), q === s && (Me(S.head), S.lookahead === 0 && (S.strstart = 0, S.block_start = 0, S.insert = 0))), ze(h), h.avail_out === 0))
        return S.last_flush = -1, u;
    }
    return q !== l ? u : S.wrap <= 0 ? m : (S.wrap === 2 ? (xe(S, h.adler & 255), xe(S, h.adler >> 8 & 255), xe(S, h.adler >> 16 & 255), xe(S, h.adler >> 24 & 255), xe(S, h.total_in & 255), xe(S, h.total_in >> 8 & 255), xe(S, h.total_in >> 16 & 255), xe(S, h.total_in >> 24 & 255)) : (lt(S, h.adler >>> 16), lt(S, h.adler & 65535)), ze(h), S.wrap > 0 && (S.wrap = -S.wrap), S.pending !== 0 ? u : m);
  }
  function Q(h) {
    var q;
    return !h || !h.state ? g : (q = h.state.status, q !== Te && q !== be && q !== Ae && q !== ye && q !== $e && q !== ke && q !== Ee ? Oe(h, g) : (h.state = null, q === ke ? Oe(h, y) : u));
  }
  function le(h, q) {
    var V = q.length, S, j, Z, he, ue, _, w, p;
    if (!h || !h.state || (S = h.state, he = S.wrap, he === 2 || he === 1 && S.status !== Te || S.lookahead))
      return g;
    for (he === 1 && (h.adler = r(h.adler, q, V, 0)), S.wrap = 0, V >= S.w_size && (he === 0 && (Me(S.head), S.strstart = 0, S.block_start = 0, S.insert = 0), p = new t.Buf8(S.w_size), t.arraySet(p, q, V - S.w_size, S.w_size, 0), q = p, V = S.w_size), ue = h.avail_in, _ = h.next_in, w = h.input, h.avail_in = V, h.next_in = 0, h.input = q, Ne(S); S.lookahead >= X; ) {
      j = S.strstart, Z = S.lookahead - (X - 1);
      do
        S.ins_h = (S.ins_h << S.hash_shift ^ S.window[j + X - 1]) & S.hash_mask, S.prev[j & S.w_mask] = S.head[S.ins_h], S.head[S.ins_h] = j, j++;
      while (--Z);
      S.strstart = j, S.lookahead = X - 1, Ne(S);
    }
    return S.strstart += S.lookahead, S.block_start = S.strstart, S.insert = S.lookahead, S.lookahead = 0, S.match_length = S.prev_length = X - 1, S.match_available = 0, h.next_in = _, h.input = w, h.avail_in = ue, S.wrap = he, u;
  }
  return Dt.deflateInit = N, Dt.deflateInit2 = x, Dt.deflateReset = v, Dt.deflateResetKeep = d, Dt.deflateSetHeader = C, Dt.deflate = b, Dt.deflateEnd = Q, Dt.deflateSetDictionary = le, Dt.deflateInfo = "pako deflate (from Nodeca project)", Dt;
}
var fr = {}, Fa;
function Vo() {
  if (Fa) return fr;
  Fa = 1;
  var t = sr(), e = !0, r = !0;
  try {
    String.fromCharCode.apply(null, [0]);
  } catch {
    e = !1;
  }
  try {
    String.fromCharCode.apply(null, new Uint8Array(1));
  } catch {
    r = !1;
  }
  for (var i = new t.Buf8(256), n = 0; n < 256; n++)
    i[n] = n >= 252 ? 6 : n >= 248 ? 5 : n >= 240 ? 4 : n >= 224 ? 3 : n >= 192 ? 2 : 1;
  i[254] = i[254] = 1, fr.string2buf = function(o) {
    var s, l, f, u, m, g = o.length, y = 0;
    for (u = 0; u < g; u++)
      l = o.charCodeAt(u), (l & 64512) === 55296 && u + 1 < g && (f = o.charCodeAt(u + 1), (f & 64512) === 56320 && (l = 65536 + (l - 55296 << 10) + (f - 56320), u++)), y += l < 128 ? 1 : l < 2048 ? 2 : l < 65536 ? 3 : 4;
    for (s = new t.Buf8(y), m = 0, u = 0; m < y; u++)
      l = o.charCodeAt(u), (l & 64512) === 55296 && u + 1 < g && (f = o.charCodeAt(u + 1), (f & 64512) === 56320 && (l = 65536 + (l - 55296 << 10) + (f - 56320), u++)), l < 128 ? s[m++] = l : l < 2048 ? (s[m++] = 192 | l >>> 6, s[m++] = 128 | l & 63) : l < 65536 ? (s[m++] = 224 | l >>> 12, s[m++] = 128 | l >>> 6 & 63, s[m++] = 128 | l & 63) : (s[m++] = 240 | l >>> 18, s[m++] = 128 | l >>> 12 & 63, s[m++] = 128 | l >>> 6 & 63, s[m++] = 128 | l & 63);
    return s;
  };
  function a(o, s) {
    if (s < 65534 && (o.subarray && r || !o.subarray && e))
      return String.fromCharCode.apply(null, t.shrinkBuf(o, s));
    for (var l = "", f = 0; f < s; f++)
      l += String.fromCharCode(o[f]);
    return l;
  }
  return fr.buf2binstring = function(o) {
    return a(o, o.length);
  }, fr.binstring2buf = function(o) {
    for (var s = new t.Buf8(o.length), l = 0, f = s.length; l < f; l++)
      s[l] = o.charCodeAt(l);
    return s;
  }, fr.buf2string = function(o, s) {
    var l, f, u, m, g = s || o.length, y = new Array(g * 2);
    for (f = 0, l = 0; l < g; ) {
      if (u = o[l++], u < 128) {
        y[f++] = u;
        continue;
      }
      if (m = i[u], m > 4) {
        y[f++] = 65533, l += m - 1;
        continue;
      }
      for (u &= m === 2 ? 31 : m === 3 ? 15 : 7; m > 1 && l < g; )
        u = u << 6 | o[l++] & 63, m--;
      if (m > 1) {
        y[f++] = 65533;
        continue;
      }
      u < 65536 ? y[f++] = u : (u -= 65536, y[f++] = 55296 | u >> 10 & 1023, y[f++] = 56320 | u & 1023);
    }
    return a(y, f);
  }, fr.utf8border = function(o, s) {
    var l;
    for (s = s || o.length, s > o.length && (s = o.length), l = s - 1; l >= 0 && (o[l] & 192) === 128; )
      l--;
    return l < 0 || l === 0 ? s : l + i[o[l]] > s ? l : s;
  }, fr;
}
var sn, Na;
function Xo() {
  if (Na) return sn;
  Na = 1;
  function t() {
    this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
  }
  return sn = t, sn;
}
var Ma;
function el() {
  if (Ma) return kr;
  Ma = 1;
  var t = Qc(), e = sr(), r = Vo(), i = aa(), n = Xo(), a = Object.prototype.toString, o = 0, s = 4, l = 0, f = 1, u = 2, m = -1, g = 0, y = 8;
  function E(R) {
    if (!(this instanceof E)) return new E(R);
    this.options = e.assign({
      level: m,
      method: y,
      chunkSize: 16384,
      windowBits: 15,
      memLevel: 8,
      strategy: g,
      to: ""
    }, R || {});
    var D = this.options;
    D.raw && D.windowBits > 0 ? D.windowBits = -D.windowBits : D.gzip && D.windowBits > 0 && D.windowBits < 16 && (D.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new n(), this.strm.avail_out = 0;
    var L = t.deflateInit2(
      this.strm,
      D.level,
      D.method,
      D.windowBits,
      D.memLevel,
      D.strategy
    );
    if (L !== l)
      throw new Error(i[L]);
    if (D.header && t.deflateSetHeader(this.strm, D.header), D.dictionary) {
      var U;
      if (typeof D.dictionary == "string" ? U = r.string2buf(D.dictionary) : a.call(D.dictionary) === "[object ArrayBuffer]" ? U = new Uint8Array(D.dictionary) : U = D.dictionary, L = t.deflateSetDictionary(this.strm, U), L !== l)
        throw new Error(i[L]);
      this._dict_set = !0;
    }
  }
  E.prototype.push = function(R, D) {
    var L = this.strm, U = this.options.chunkSize, M, B;
    if (this.ended)
      return !1;
    B = D === ~~D ? D : D === !0 ? s : o, typeof R == "string" ? L.input = r.string2buf(R) : a.call(R) === "[object ArrayBuffer]" ? L.input = new Uint8Array(R) : L.input = R, L.next_in = 0, L.avail_in = L.input.length;
    do {
      if (L.avail_out === 0 && (L.output = new e.Buf8(U), L.next_out = 0, L.avail_out = U), M = t.deflate(L, B), M !== f && M !== l)
        return this.onEnd(M), this.ended = !0, !1;
      (L.avail_out === 0 || L.avail_in === 0 && (B === s || B === u)) && (this.options.to === "string" ? this.onData(r.buf2binstring(e.shrinkBuf(L.output, L.next_out))) : this.onData(e.shrinkBuf(L.output, L.next_out)));
    } while ((L.avail_in > 0 || L.avail_out === 0) && M !== f);
    return B === s ? (M = t.deflateEnd(this.strm), this.onEnd(M), this.ended = !0, M === l) : (B === u && (this.onEnd(l), L.avail_out = 0), !0);
  }, E.prototype.onData = function(R) {
    this.chunks.push(R);
  }, E.prototype.onEnd = function(R) {
    R === l && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = e.flattenChunks(this.chunks)), this.chunks = [], this.err = R, this.msg = this.strm.msg;
  };
  function A(R, D) {
    var L = new E(D);
    if (L.push(R, !0), L.err)
      throw L.msg || i[L.err];
    return L.result;
  }
  function T(R, D) {
    return D = D || {}, D.raw = !0, A(R, D);
  }
  function I(R, D) {
    return D = D || {}, D.gzip = !0, A(R, D);
  }
  return kr.Deflate = E, kr.deflate = A, kr.deflateRaw = T, kr.gzip = I, kr;
}
var Sr = {}, It = {}, cn, Ua;
function tl() {
  if (Ua) return cn;
  Ua = 1;
  var t = 30, e = 12;
  return cn = function(i, n) {
    var a, o, s, l, f, u, m, g, y, E, A, T, I, R, D, L, U, M, B, O, W, z, Y, F, J;
    a = i.state, o = i.next_in, F = i.input, s = o + (i.avail_in - 5), l = i.next_out, J = i.output, f = l - (n - i.avail_out), u = l + (i.avail_out - 257), m = a.dmax, g = a.wsize, y = a.whave, E = a.wnext, A = a.window, T = a.hold, I = a.bits, R = a.lencode, D = a.distcode, L = (1 << a.lenbits) - 1, U = (1 << a.distbits) - 1;
    e:
      do {
        I < 15 && (T += F[o++] << I, I += 8, T += F[o++] << I, I += 8), M = R[T & L];
        t:
          for (; ; ) {
            if (B = M >>> 24, T >>>= B, I -= B, B = M >>> 16 & 255, B === 0)
              J[l++] = M & 65535;
            else if (B & 16) {
              O = M & 65535, B &= 15, B && (I < B && (T += F[o++] << I, I += 8), O += T & (1 << B) - 1, T >>>= B, I -= B), I < 15 && (T += F[o++] << I, I += 8, T += F[o++] << I, I += 8), M = D[T & U];
              r:
                for (; ; ) {
                  if (B = M >>> 24, T >>>= B, I -= B, B = M >>> 16 & 255, B & 16) {
                    if (W = M & 65535, B &= 15, I < B && (T += F[o++] << I, I += 8, I < B && (T += F[o++] << I, I += 8)), W += T & (1 << B) - 1, W > m) {
                      i.msg = "invalid distance too far back", a.mode = t;
                      break e;
                    }
                    if (T >>>= B, I -= B, B = l - f, W > B) {
                      if (B = W - B, B > y && a.sane) {
                        i.msg = "invalid distance too far back", a.mode = t;
                        break e;
                      }
                      if (z = 0, Y = A, E === 0) {
                        if (z += g - B, B < O) {
                          O -= B;
                          do
                            J[l++] = A[z++];
                          while (--B);
                          z = l - W, Y = J;
                        }
                      } else if (E < B) {
                        if (z += g + E - B, B -= E, B < O) {
                          O -= B;
                          do
                            J[l++] = A[z++];
                          while (--B);
                          if (z = 0, E < O) {
                            B = E, O -= B;
                            do
                              J[l++] = A[z++];
                            while (--B);
                            z = l - W, Y = J;
                          }
                        }
                      } else if (z += E - B, B < O) {
                        O -= B;
                        do
                          J[l++] = A[z++];
                        while (--B);
                        z = l - W, Y = J;
                      }
                      for (; O > 2; )
                        J[l++] = Y[z++], J[l++] = Y[z++], J[l++] = Y[z++], O -= 3;
                      O && (J[l++] = Y[z++], O > 1 && (J[l++] = Y[z++]));
                    } else {
                      z = l - W;
                      do
                        J[l++] = J[z++], J[l++] = J[z++], J[l++] = J[z++], O -= 3;
                      while (O > 2);
                      O && (J[l++] = J[z++], O > 1 && (J[l++] = J[z++]));
                    }
                  } else if ((B & 64) === 0) {
                    M = D[(M & 65535) + (T & (1 << B) - 1)];
                    continue r;
                  } else {
                    i.msg = "invalid distance code", a.mode = t;
                    break e;
                  }
                  break;
                }
            } else if ((B & 64) === 0) {
              M = R[(M & 65535) + (T & (1 << B) - 1)];
              continue t;
            } else if (B & 32) {
              a.mode = e;
              break e;
            } else {
              i.msg = "invalid literal/length code", a.mode = t;
              break e;
            }
            break;
          }
      } while (o < s && l < u);
    O = I >> 3, o -= O, I -= O << 3, T &= (1 << I) - 1, i.next_in = o, i.next_out = l, i.avail_in = o < s ? 5 + (s - o) : 5 - (o - s), i.avail_out = l < u ? 257 + (u - l) : 257 - (l - u), a.hold = T, a.bits = I;
  }, cn;
}
var ln, Pa;
function rl() {
  if (Pa) return ln;
  Pa = 1;
  var t = sr(), e = 15, r = 852, i = 592, n = 0, a = 1, o = 2, s = [
    /* Length codes 257..285 base */
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    13,
    15,
    17,
    19,
    23,
    27,
    31,
    35,
    43,
    51,
    59,
    67,
    83,
    99,
    115,
    131,
    163,
    195,
    227,
    258,
    0,
    0
  ], l = [
    /* Length codes 257..285 extra */
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    17,
    17,
    17,
    17,
    18,
    18,
    18,
    18,
    19,
    19,
    19,
    19,
    20,
    20,
    20,
    20,
    21,
    21,
    21,
    21,
    16,
    72,
    78
  ], f = [
    /* Distance codes 0..29 base */
    1,
    2,
    3,
    4,
    5,
    7,
    9,
    13,
    17,
    25,
    33,
    49,
    65,
    97,
    129,
    193,
    257,
    385,
    513,
    769,
    1025,
    1537,
    2049,
    3073,
    4097,
    6145,
    8193,
    12289,
    16385,
    24577,
    0,
    0
  ], u = [
    /* Distance codes 0..29 extra */
    16,
    16,
    16,
    16,
    17,
    17,
    18,
    18,
    19,
    19,
    20,
    20,
    21,
    21,
    22,
    22,
    23,
    23,
    24,
    24,
    25,
    25,
    26,
    26,
    27,
    27,
    28,
    28,
    29,
    29,
    64,
    64
  ];
  return ln = function(g, y, E, A, T, I, R, D) {
    var L = D.bits, U = 0, M = 0, B = 0, O = 0, W = 0, z = 0, Y = 0, F = 0, J = 0, se = 0, _e, ie, X, ne, de, Se = null, Te = 0, be, Ae = new t.Buf16(e + 1), ye = new t.Buf16(e + 1), $e = null, ke = 0, Ee, De, qe;
    for (U = 0; U <= e; U++)
      Ae[U] = 0;
    for (M = 0; M < A; M++)
      Ae[y[E + M]]++;
    for (W = L, O = e; O >= 1 && Ae[O] === 0; O--)
      ;
    if (W > O && (W = O), O === 0)
      return T[I++] = 1 << 24 | 64 << 16 | 0, T[I++] = 1 << 24 | 64 << 16 | 0, D.bits = 1, 0;
    for (B = 1; B < O && Ae[B] === 0; B++)
      ;
    for (W < B && (W = B), F = 1, U = 1; U <= e; U++)
      if (F <<= 1, F -= Ae[U], F < 0)
        return -1;
    if (F > 0 && (g === n || O !== 1))
      return -1;
    for (ye[1] = 0, U = 1; U < e; U++)
      ye[U + 1] = ye[U] + Ae[U];
    for (M = 0; M < A; M++)
      y[E + M] !== 0 && (R[ye[y[E + M]]++] = M);
    if (g === n ? (Se = $e = R, be = 19) : g === a ? (Se = s, Te -= 257, $e = l, ke -= 257, be = 256) : (Se = f, $e = u, be = -1), se = 0, M = 0, U = B, de = I, z = W, Y = 0, X = -1, J = 1 << W, ne = J - 1, g === a && J > r || g === o && J > i)
      return 1;
    for (; ; ) {
      Ee = U - Y, R[M] < be ? (De = 0, qe = R[M]) : R[M] > be ? (De = $e[ke + R[M]], qe = Se[Te + R[M]]) : (De = 96, qe = 0), _e = 1 << U - Y, ie = 1 << z, B = ie;
      do
        ie -= _e, T[de + (se >> Y) + ie] = Ee << 24 | De << 16 | qe | 0;
      while (ie !== 0);
      for (_e = 1 << U - 1; se & _e; )
        _e >>= 1;
      if (_e !== 0 ? (se &= _e - 1, se += _e) : se = 0, M++, --Ae[U] === 0) {
        if (U === O)
          break;
        U = y[E + R[M]];
      }
      if (U > W && (se & ne) !== X) {
        for (Y === 0 && (Y = W), de += B, z = U - Y, F = 1 << z; z + Y < O && (F -= Ae[z + Y], !(F <= 0)); )
          z++, F <<= 1;
        if (J += 1 << z, g === a && J > r || g === o && J > i)
          return 1;
        X = se & ne, T[X] = W << 24 | z << 16 | de - I | 0;
      }
    }
    return se !== 0 && (T[de + se] = U - Y << 24 | 64 << 16 | 0), D.bits = W, 0;
  }, ln;
}
var La;
function il() {
  if (La) return It;
  La = 1;
  var t = sr(), e = Go(), r = Zo(), i = tl(), n = rl(), a = 0, o = 1, s = 2, l = 4, f = 5, u = 6, m = 0, g = 1, y = 2, E = -2, A = -3, T = -4, I = -5, R = 8, D = 1, L = 2, U = 3, M = 4, B = 5, O = 6, W = 7, z = 8, Y = 9, F = 10, J = 11, se = 12, _e = 13, ie = 14, X = 15, ne = 16, de = 17, Se = 18, Te = 19, be = 20, Ae = 21, ye = 22, $e = 23, ke = 24, Ee = 25, De = 26, qe = 27, rt = 28, je = 29, we = 30, Oe = 31, Ve = 32, Me = 852, ze = 592, Ce = 15, xe = Ce;
  function lt(x) {
    return (x >>> 24 & 255) + (x >>> 8 & 65280) + ((x & 65280) << 8) + ((x & 255) << 24);
  }
  function St() {
    this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new t.Buf16(320), this.work = new t.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
  }
  function xt(x) {
    var N;
    return !x || !x.state ? E : (N = x.state, x.total_in = x.total_out = N.total = 0, x.msg = "", N.wrap && (x.adler = N.wrap & 1), N.mode = D, N.last = 0, N.havedict = 0, N.dmax = 32768, N.head = null, N.hold = 0, N.bits = 0, N.lencode = N.lendyn = new t.Buf32(Me), N.distcode = N.distdyn = new t.Buf32(ze), N.sane = 1, N.back = -1, m);
  }
  function Ne(x) {
    var N;
    return !x || !x.state ? E : (N = x.state, N.wsize = 0, N.whave = 0, N.wnext = 0, xt(x));
  }
  function Xe(x, N) {
    var b, Q;
    return !x || !x.state || (Q = x.state, N < 0 ? (b = 0, N = -N) : (b = (N >> 4) + 1, N < 48 && (N &= 15)), N && (N < 8 || N > 15)) ? E : (Q.window !== null && Q.wbits !== N && (Q.window = null), Q.wrap = b, Q.wbits = N, Ne(x));
  }
  function ut(x, N) {
    var b, Q;
    return x ? (Q = new St(), x.state = Q, Q.window = null, b = Xe(x, N), b !== m && (x.state = null), b) : E;
  }
  function Ze(x) {
    return ut(x, xe);
  }
  var vt = !0, Et, Pe;
  function nt(x) {
    if (vt) {
      var N;
      for (Et = new t.Buf32(512), Pe = new t.Buf32(32), N = 0; N < 144; )
        x.lens[N++] = 8;
      for (; N < 256; )
        x.lens[N++] = 9;
      for (; N < 280; )
        x.lens[N++] = 7;
      for (; N < 288; )
        x.lens[N++] = 8;
      for (n(o, x.lens, 0, 288, Et, 0, x.work, { bits: 9 }), N = 0; N < 32; )
        x.lens[N++] = 5;
      n(s, x.lens, 0, 32, Pe, 0, x.work, { bits: 5 }), vt = !1;
    }
    x.lencode = Et, x.lenbits = 9, x.distcode = Pe, x.distbits = 5;
  }
  function k(x, N, b, Q) {
    var le, h = x.state;
    return h.window === null && (h.wsize = 1 << h.wbits, h.wnext = 0, h.whave = 0, h.window = new t.Buf8(h.wsize)), Q >= h.wsize ? (t.arraySet(h.window, N, b - h.wsize, h.wsize, 0), h.wnext = 0, h.whave = h.wsize) : (le = h.wsize - h.wnext, le > Q && (le = Q), t.arraySet(h.window, N, b - Q, le, h.wnext), Q -= le, Q ? (t.arraySet(h.window, N, b - Q, Q, 0), h.wnext = Q, h.whave = h.wsize) : (h.wnext += le, h.wnext === h.wsize && (h.wnext = 0), h.whave < h.wsize && (h.whave += le))), 0;
  }
  function c(x, N) {
    var b, Q, le, h, q, V, S, j, Z, he, ue, _, w, p, $ = 0, P, G, K, ve, He, Ue, Ie, Be, st = new t.Buf8(4), Gt, Nt, _a = (
      /* permutation of code lengths */
      [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
    );
    if (!x || !x.state || !x.output || !x.input && x.avail_in !== 0)
      return E;
    b = x.state, b.mode === se && (b.mode = _e), q = x.next_out, le = x.output, S = x.avail_out, h = x.next_in, Q = x.input, V = x.avail_in, j = b.hold, Z = b.bits, he = V, ue = S, Be = m;
    e:
      for (; ; )
        switch (b.mode) {
          case D:
            if (b.wrap === 0) {
              b.mode = _e;
              break;
            }
            for (; Z < 16; ) {
              if (V === 0)
                break e;
              V--, j += Q[h++] << Z, Z += 8;
            }
            if (b.wrap & 2 && j === 35615) {
              b.check = 0, st[0] = j & 255, st[1] = j >>> 8 & 255, b.check = r(b.check, st, 2, 0), j = 0, Z = 0, b.mode = L;
              break;
            }
            if (b.flags = 0, b.head && (b.head.done = !1), !(b.wrap & 1) || /* check if zlib header allowed */
            (((j & 255) << 8) + (j >> 8)) % 31) {
              x.msg = "incorrect header check", b.mode = we;
              break;
            }
            if ((j & 15) !== R) {
              x.msg = "unknown compression method", b.mode = we;
              break;
            }
            if (j >>>= 4, Z -= 4, Ie = (j & 15) + 8, b.wbits === 0)
              b.wbits = Ie;
            else if (Ie > b.wbits) {
              x.msg = "invalid window size", b.mode = we;
              break;
            }
            b.dmax = 1 << Ie, x.adler = b.check = 1, b.mode = j & 512 ? F : se, j = 0, Z = 0;
            break;
          case L:
            for (; Z < 16; ) {
              if (V === 0)
                break e;
              V--, j += Q[h++] << Z, Z += 8;
            }
            if (b.flags = j, (b.flags & 255) !== R) {
              x.msg = "unknown compression method", b.mode = we;
              break;
            }
            if (b.flags & 57344) {
              x.msg = "unknown header flags set", b.mode = we;
              break;
            }
            b.head && (b.head.text = j >> 8 & 1), b.flags & 512 && (st[0] = j & 255, st[1] = j >>> 8 & 255, b.check = r(b.check, st, 2, 0)), j = 0, Z = 0, b.mode = U;
          /* falls through */
          case U:
            for (; Z < 32; ) {
              if (V === 0)
                break e;
              V--, j += Q[h++] << Z, Z += 8;
            }
            b.head && (b.head.time = j), b.flags & 512 && (st[0] = j & 255, st[1] = j >>> 8 & 255, st[2] = j >>> 16 & 255, st[3] = j >>> 24 & 255, b.check = r(b.check, st, 4, 0)), j = 0, Z = 0, b.mode = M;
          /* falls through */
          case M:
            for (; Z < 16; ) {
              if (V === 0)
                break e;
              V--, j += Q[h++] << Z, Z += 8;
            }
            b.head && (b.head.xflags = j & 255, b.head.os = j >> 8), b.flags & 512 && (st[0] = j & 255, st[1] = j >>> 8 & 255, b.check = r(b.check, st, 2, 0)), j = 0, Z = 0, b.mode = B;
          /* falls through */
          case B:
            if (b.flags & 1024) {
              for (; Z < 16; ) {
                if (V === 0)
                  break e;
                V--, j += Q[h++] << Z, Z += 8;
              }
              b.length = j, b.head && (b.head.extra_len = j), b.flags & 512 && (st[0] = j & 255, st[1] = j >>> 8 & 255, b.check = r(b.check, st, 2, 0)), j = 0, Z = 0;
            } else b.head && (b.head.extra = null);
            b.mode = O;
          /* falls through */
          case O:
            if (b.flags & 1024 && (_ = b.length, _ > V && (_ = V), _ && (b.head && (Ie = b.head.extra_len - b.length, b.head.extra || (b.head.extra = new Array(b.head.extra_len)), t.arraySet(
              b.head.extra,
              Q,
              h,
              // extra field is limited to 65536 bytes
              // - no need for additional size check
              _,
              /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
              Ie
            )), b.flags & 512 && (b.check = r(b.check, Q, _, h)), V -= _, h += _, b.length -= _), b.length))
              break e;
            b.length = 0, b.mode = W;
          /* falls through */
          case W:
            if (b.flags & 2048) {
              if (V === 0)
                break e;
              _ = 0;
              do
                Ie = Q[h + _++], b.head && Ie && b.length < 65536 && (b.head.name += String.fromCharCode(Ie));
              while (Ie && _ < V);
              if (b.flags & 512 && (b.check = r(b.check, Q, _, h)), V -= _, h += _, Ie)
                break e;
            } else b.head && (b.head.name = null);
            b.length = 0, b.mode = z;
          /* falls through */
          case z:
            if (b.flags & 4096) {
              if (V === 0)
                break e;
              _ = 0;
              do
                Ie = Q[h + _++], b.head && Ie && b.length < 65536 && (b.head.comment += String.fromCharCode(Ie));
              while (Ie && _ < V);
              if (b.flags & 512 && (b.check = r(b.check, Q, _, h)), V -= _, h += _, Ie)
                break e;
            } else b.head && (b.head.comment = null);
            b.mode = Y;
          /* falls through */
          case Y:
            if (b.flags & 512) {
              for (; Z < 16; ) {
                if (V === 0)
                  break e;
                V--, j += Q[h++] << Z, Z += 8;
              }
              if (j !== (b.check & 65535)) {
                x.msg = "header crc mismatch", b.mode = we;
                break;
              }
              j = 0, Z = 0;
            }
            b.head && (b.head.hcrc = b.flags >> 9 & 1, b.head.done = !0), x.adler = b.check = 0, b.mode = se;
            break;
          case F:
            for (; Z < 32; ) {
              if (V === 0)
                break e;
              V--, j += Q[h++] << Z, Z += 8;
            }
            x.adler = b.check = lt(j), j = 0, Z = 0, b.mode = J;
          /* falls through */
          case J:
            if (b.havedict === 0)
              return x.next_out = q, x.avail_out = S, x.next_in = h, x.avail_in = V, b.hold = j, b.bits = Z, y;
            x.adler = b.check = 1, b.mode = se;
          /* falls through */
          case se:
            if (N === f || N === u)
              break e;
          /* falls through */
          case _e:
            if (b.last) {
              j >>>= Z & 7, Z -= Z & 7, b.mode = qe;
              break;
            }
            for (; Z < 3; ) {
              if (V === 0)
                break e;
              V--, j += Q[h++] << Z, Z += 8;
            }
            switch (b.last = j & 1, j >>>= 1, Z -= 1, j & 3) {
              case 0:
                b.mode = ie;
                break;
              case 1:
                if (nt(b), b.mode = be, N === u) {
                  j >>>= 2, Z -= 2;
                  break e;
                }
                break;
              case 2:
                b.mode = de;
                break;
              case 3:
                x.msg = "invalid block type", b.mode = we;
            }
            j >>>= 2, Z -= 2;
            break;
          case ie:
            for (j >>>= Z & 7, Z -= Z & 7; Z < 32; ) {
              if (V === 0)
                break e;
              V--, j += Q[h++] << Z, Z += 8;
            }
            if ((j & 65535) !== (j >>> 16 ^ 65535)) {
              x.msg = "invalid stored block lengths", b.mode = we;
              break;
            }
            if (b.length = j & 65535, j = 0, Z = 0, b.mode = X, N === u)
              break e;
          /* falls through */
          case X:
            b.mode = ne;
          /* falls through */
          case ne:
            if (_ = b.length, _) {
              if (_ > V && (_ = V), _ > S && (_ = S), _ === 0)
                break e;
              t.arraySet(le, Q, h, _, q), V -= _, h += _, S -= _, q += _, b.length -= _;
              break;
            }
            b.mode = se;
            break;
          case de:
            for (; Z < 14; ) {
              if (V === 0)
                break e;
              V--, j += Q[h++] << Z, Z += 8;
            }
            if (b.nlen = (j & 31) + 257, j >>>= 5, Z -= 5, b.ndist = (j & 31) + 1, j >>>= 5, Z -= 5, b.ncode = (j & 15) + 4, j >>>= 4, Z -= 4, b.nlen > 286 || b.ndist > 30) {
              x.msg = "too many length or distance symbols", b.mode = we;
              break;
            }
            b.have = 0, b.mode = Se;
          /* falls through */
          case Se:
            for (; b.have < b.ncode; ) {
              for (; Z < 3; ) {
                if (V === 0)
                  break e;
                V--, j += Q[h++] << Z, Z += 8;
              }
              b.lens[_a[b.have++]] = j & 7, j >>>= 3, Z -= 3;
            }
            for (; b.have < 19; )
              b.lens[_a[b.have++]] = 0;
            if (b.lencode = b.lendyn, b.lenbits = 7, Gt = { bits: b.lenbits }, Be = n(a, b.lens, 0, 19, b.lencode, 0, b.work, Gt), b.lenbits = Gt.bits, Be) {
              x.msg = "invalid code lengths set", b.mode = we;
              break;
            }
            b.have = 0, b.mode = Te;
          /* falls through */
          case Te:
            for (; b.have < b.nlen + b.ndist; ) {
              for (; $ = b.lencode[j & (1 << b.lenbits) - 1], P = $ >>> 24, G = $ >>> 16 & 255, K = $ & 65535, !(P <= Z); ) {
                if (V === 0)
                  break e;
                V--, j += Q[h++] << Z, Z += 8;
              }
              if (K < 16)
                j >>>= P, Z -= P, b.lens[b.have++] = K;
              else {
                if (K === 16) {
                  for (Nt = P + 2; Z < Nt; ) {
                    if (V === 0)
                      break e;
                    V--, j += Q[h++] << Z, Z += 8;
                  }
                  if (j >>>= P, Z -= P, b.have === 0) {
                    x.msg = "invalid bit length repeat", b.mode = we;
                    break;
                  }
                  Ie = b.lens[b.have - 1], _ = 3 + (j & 3), j >>>= 2, Z -= 2;
                } else if (K === 17) {
                  for (Nt = P + 3; Z < Nt; ) {
                    if (V === 0)
                      break e;
                    V--, j += Q[h++] << Z, Z += 8;
                  }
                  j >>>= P, Z -= P, Ie = 0, _ = 3 + (j & 7), j >>>= 3, Z -= 3;
                } else {
                  for (Nt = P + 7; Z < Nt; ) {
                    if (V === 0)
                      break e;
                    V--, j += Q[h++] << Z, Z += 8;
                  }
                  j >>>= P, Z -= P, Ie = 0, _ = 11 + (j & 127), j >>>= 7, Z -= 7;
                }
                if (b.have + _ > b.nlen + b.ndist) {
                  x.msg = "invalid bit length repeat", b.mode = we;
                  break;
                }
                for (; _--; )
                  b.lens[b.have++] = Ie;
              }
            }
            if (b.mode === we)
              break;
            if (b.lens[256] === 0) {
              x.msg = "invalid code -- missing end-of-block", b.mode = we;
              break;
            }
            if (b.lenbits = 9, Gt = { bits: b.lenbits }, Be = n(o, b.lens, 0, b.nlen, b.lencode, 0, b.work, Gt), b.lenbits = Gt.bits, Be) {
              x.msg = "invalid literal/lengths set", b.mode = we;
              break;
            }
            if (b.distbits = 6, b.distcode = b.distdyn, Gt = { bits: b.distbits }, Be = n(s, b.lens, b.nlen, b.ndist, b.distcode, 0, b.work, Gt), b.distbits = Gt.bits, Be) {
              x.msg = "invalid distances set", b.mode = we;
              break;
            }
            if (b.mode = be, N === u)
              break e;
          /* falls through */
          case be:
            b.mode = Ae;
          /* falls through */
          case Ae:
            if (V >= 6 && S >= 258) {
              x.next_out = q, x.avail_out = S, x.next_in = h, x.avail_in = V, b.hold = j, b.bits = Z, i(x, ue), q = x.next_out, le = x.output, S = x.avail_out, h = x.next_in, Q = x.input, V = x.avail_in, j = b.hold, Z = b.bits, b.mode === se && (b.back = -1);
              break;
            }
            for (b.back = 0; $ = b.lencode[j & (1 << b.lenbits) - 1], P = $ >>> 24, G = $ >>> 16 & 255, K = $ & 65535, !(P <= Z); ) {
              if (V === 0)
                break e;
              V--, j += Q[h++] << Z, Z += 8;
            }
            if (G && (G & 240) === 0) {
              for (ve = P, He = G, Ue = K; $ = b.lencode[Ue + ((j & (1 << ve + He) - 1) >> ve)], P = $ >>> 24, G = $ >>> 16 & 255, K = $ & 65535, !(ve + P <= Z); ) {
                if (V === 0)
                  break e;
                V--, j += Q[h++] << Z, Z += 8;
              }
              j >>>= ve, Z -= ve, b.back += ve;
            }
            if (j >>>= P, Z -= P, b.back += P, b.length = K, G === 0) {
              b.mode = De;
              break;
            }
            if (G & 32) {
              b.back = -1, b.mode = se;
              break;
            }
            if (G & 64) {
              x.msg = "invalid literal/length code", b.mode = we;
              break;
            }
            b.extra = G & 15, b.mode = ye;
          /* falls through */
          case ye:
            if (b.extra) {
              for (Nt = b.extra; Z < Nt; ) {
                if (V === 0)
                  break e;
                V--, j += Q[h++] << Z, Z += 8;
              }
              b.length += j & (1 << b.extra) - 1, j >>>= b.extra, Z -= b.extra, b.back += b.extra;
            }
            b.was = b.length, b.mode = $e;
          /* falls through */
          case $e:
            for (; $ = b.distcode[j & (1 << b.distbits) - 1], P = $ >>> 24, G = $ >>> 16 & 255, K = $ & 65535, !(P <= Z); ) {
              if (V === 0)
                break e;
              V--, j += Q[h++] << Z, Z += 8;
            }
            if ((G & 240) === 0) {
              for (ve = P, He = G, Ue = K; $ = b.distcode[Ue + ((j & (1 << ve + He) - 1) >> ve)], P = $ >>> 24, G = $ >>> 16 & 255, K = $ & 65535, !(ve + P <= Z); ) {
                if (V === 0)
                  break e;
                V--, j += Q[h++] << Z, Z += 8;
              }
              j >>>= ve, Z -= ve, b.back += ve;
            }
            if (j >>>= P, Z -= P, b.back += P, G & 64) {
              x.msg = "invalid distance code", b.mode = we;
              break;
            }
            b.offset = K, b.extra = G & 15, b.mode = ke;
          /* falls through */
          case ke:
            if (b.extra) {
              for (Nt = b.extra; Z < Nt; ) {
                if (V === 0)
                  break e;
                V--, j += Q[h++] << Z, Z += 8;
              }
              b.offset += j & (1 << b.extra) - 1, j >>>= b.extra, Z -= b.extra, b.back += b.extra;
            }
            if (b.offset > b.dmax) {
              x.msg = "invalid distance too far back", b.mode = we;
              break;
            }
            b.mode = Ee;
          /* falls through */
          case Ee:
            if (S === 0)
              break e;
            if (_ = ue - S, b.offset > _) {
              if (_ = b.offset - _, _ > b.whave && b.sane) {
                x.msg = "invalid distance too far back", b.mode = we;
                break;
              }
              _ > b.wnext ? (_ -= b.wnext, w = b.wsize - _) : w = b.wnext - _, _ > b.length && (_ = b.length), p = b.window;
            } else
              p = le, w = q - b.offset, _ = b.length;
            _ > S && (_ = S), S -= _, b.length -= _;
            do
              le[q++] = p[w++];
            while (--_);
            b.length === 0 && (b.mode = Ae);
            break;
          case De:
            if (S === 0)
              break e;
            le[q++] = b.length, S--, b.mode = Ae;
            break;
          case qe:
            if (b.wrap) {
              for (; Z < 32; ) {
                if (V === 0)
                  break e;
                V--, j |= Q[h++] << Z, Z += 8;
              }
              if (ue -= S, x.total_out += ue, b.total += ue, ue && (x.adler = b.check = /*UPDATE(state.check, put - _out, _out);*/
              b.flags ? r(b.check, le, ue, q - ue) : e(b.check, le, ue, q - ue)), ue = S, (b.flags ? j : lt(j)) !== b.check) {
                x.msg = "incorrect data check", b.mode = we;
                break;
              }
              j = 0, Z = 0;
            }
            b.mode = rt;
          /* falls through */
          case rt:
            if (b.wrap && b.flags) {
              for (; Z < 32; ) {
                if (V === 0)
                  break e;
                V--, j += Q[h++] << Z, Z += 8;
              }
              if (j !== (b.total & 4294967295)) {
                x.msg = "incorrect length check", b.mode = we;
                break;
              }
              j = 0, Z = 0;
            }
            b.mode = je;
          /* falls through */
          case je:
            Be = g;
            break e;
          case we:
            Be = A;
            break e;
          case Oe:
            return T;
          case Ve:
          /* falls through */
          default:
            return E;
        }
    return x.next_out = q, x.avail_out = S, x.next_in = h, x.avail_in = V, b.hold = j, b.bits = Z, (b.wsize || ue !== x.avail_out && b.mode < we && (b.mode < qe || N !== l)) && k(x, x.output, x.next_out, ue - x.avail_out), he -= x.avail_in, ue -= x.avail_out, x.total_in += he, x.total_out += ue, b.total += ue, b.wrap && ue && (x.adler = b.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
    b.flags ? r(b.check, le, ue, x.next_out - ue) : e(b.check, le, ue, x.next_out - ue)), x.data_type = b.bits + (b.last ? 64 : 0) + (b.mode === se ? 128 : 0) + (b.mode === be || b.mode === X ? 256 : 0), (he === 0 && ue === 0 || N === l) && Be === m && (Be = I), Be;
  }
  function d(x) {
    if (!x || !x.state)
      return E;
    var N = x.state;
    return N.window && (N.window = null), x.state = null, m;
  }
  function v(x, N) {
    var b;
    return !x || !x.state || (b = x.state, (b.wrap & 2) === 0) ? E : (b.head = N, N.done = !1, m);
  }
  function C(x, N) {
    var b = N.length, Q, le, h;
    return !x || !x.state || (Q = x.state, Q.wrap !== 0 && Q.mode !== J) ? E : Q.mode === J && (le = 1, le = e(le, N, b, 0), le !== Q.check) ? A : (h = k(x, N, b, b), h ? (Q.mode = Oe, T) : (Q.havedict = 1, m));
  }
  return It.inflateReset = Ne, It.inflateReset2 = Xe, It.inflateResetKeep = xt, It.inflateInit = Ze, It.inflateInit2 = ut, It.inflate = c, It.inflateEnd = d, It.inflateGetHeader = v, It.inflateSetDictionary = C, It.inflateInfo = "pako inflate (from Nodeca project)", It;
}
var un, ja;
function Yo() {
  return ja || (ja = 1, un = {
    /* Allowed flush values; see deflate() and inflate() below for details */
    Z_NO_FLUSH: 0,
    Z_PARTIAL_FLUSH: 1,
    Z_SYNC_FLUSH: 2,
    Z_FULL_FLUSH: 3,
    Z_FINISH: 4,
    Z_BLOCK: 5,
    Z_TREES: 6,
    /* Return codes for the compression/decompression functions. Negative values
    * are errors, positive values are used for special but normal events.
    */
    Z_OK: 0,
    Z_STREAM_END: 1,
    Z_NEED_DICT: 2,
    Z_ERRNO: -1,
    Z_STREAM_ERROR: -2,
    Z_DATA_ERROR: -3,
    //Z_MEM_ERROR:     -4,
    Z_BUF_ERROR: -5,
    //Z_VERSION_ERROR: -6,
    /* compression levels */
    Z_NO_COMPRESSION: 0,
    Z_BEST_SPEED: 1,
    Z_BEST_COMPRESSION: 9,
    Z_DEFAULT_COMPRESSION: -1,
    Z_FILTERED: 1,
    Z_HUFFMAN_ONLY: 2,
    Z_RLE: 3,
    Z_FIXED: 4,
    Z_DEFAULT_STRATEGY: 0,
    /* Possible values of the data_type field (though see inflate()) */
    Z_BINARY: 0,
    Z_TEXT: 1,
    //Z_ASCII:                1, // = Z_TEXT (deprecated)
    Z_UNKNOWN: 2,
    /* The deflate compression method */
    Z_DEFLATED: 8
    //Z_NULL:                 null // Use -1 or null inline, depending on var type
  }), un;
}
var fn, za;
function nl() {
  if (za) return fn;
  za = 1;
  function t() {
    this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
  }
  return fn = t, fn;
}
var Ha;
function al() {
  if (Ha) return Sr;
  Ha = 1;
  var t = il(), e = sr(), r = Vo(), i = Yo(), n = aa(), a = Xo(), o = nl(), s = Object.prototype.toString;
  function l(m) {
    if (!(this instanceof l)) return new l(m);
    this.options = e.assign({
      chunkSize: 16384,
      windowBits: 0,
      to: ""
    }, m || {});
    var g = this.options;
    g.raw && g.windowBits >= 0 && g.windowBits < 16 && (g.windowBits = -g.windowBits, g.windowBits === 0 && (g.windowBits = -15)), g.windowBits >= 0 && g.windowBits < 16 && !(m && m.windowBits) && (g.windowBits += 32), g.windowBits > 15 && g.windowBits < 48 && (g.windowBits & 15) === 0 && (g.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new a(), this.strm.avail_out = 0;
    var y = t.inflateInit2(
      this.strm,
      g.windowBits
    );
    if (y !== i.Z_OK)
      throw new Error(n[y]);
    if (this.header = new o(), t.inflateGetHeader(this.strm, this.header), g.dictionary && (typeof g.dictionary == "string" ? g.dictionary = r.string2buf(g.dictionary) : s.call(g.dictionary) === "[object ArrayBuffer]" && (g.dictionary = new Uint8Array(g.dictionary)), g.raw && (y = t.inflateSetDictionary(this.strm, g.dictionary), y !== i.Z_OK)))
      throw new Error(n[y]);
  }
  l.prototype.push = function(m, g) {
    var y = this.strm, E = this.options.chunkSize, A = this.options.dictionary, T, I, R, D, L, U = !1;
    if (this.ended)
      return !1;
    I = g === ~~g ? g : g === !0 ? i.Z_FINISH : i.Z_NO_FLUSH, typeof m == "string" ? y.input = r.binstring2buf(m) : s.call(m) === "[object ArrayBuffer]" ? y.input = new Uint8Array(m) : y.input = m, y.next_in = 0, y.avail_in = y.input.length;
    do {
      if (y.avail_out === 0 && (y.output = new e.Buf8(E), y.next_out = 0, y.avail_out = E), T = t.inflate(y, i.Z_NO_FLUSH), T === i.Z_NEED_DICT && A && (T = t.inflateSetDictionary(this.strm, A)), T === i.Z_BUF_ERROR && U === !0 && (T = i.Z_OK, U = !1), T !== i.Z_STREAM_END && T !== i.Z_OK)
        return this.onEnd(T), this.ended = !0, !1;
      y.next_out && (y.avail_out === 0 || T === i.Z_STREAM_END || y.avail_in === 0 && (I === i.Z_FINISH || I === i.Z_SYNC_FLUSH)) && (this.options.to === "string" ? (R = r.utf8border(y.output, y.next_out), D = y.next_out - R, L = r.buf2string(y.output, R), y.next_out = D, y.avail_out = E - D, D && e.arraySet(y.output, y.output, R, D, 0), this.onData(L)) : this.onData(e.shrinkBuf(y.output, y.next_out))), y.avail_in === 0 && y.avail_out === 0 && (U = !0);
    } while ((y.avail_in > 0 || y.avail_out === 0) && T !== i.Z_STREAM_END);
    return T === i.Z_STREAM_END && (I = i.Z_FINISH), I === i.Z_FINISH ? (T = t.inflateEnd(this.strm), this.onEnd(T), this.ended = !0, T === i.Z_OK) : (I === i.Z_SYNC_FLUSH && (this.onEnd(i.Z_OK), y.avail_out = 0), !0);
  }, l.prototype.onData = function(m) {
    this.chunks.push(m);
  }, l.prototype.onEnd = function(m) {
    m === i.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = e.flattenChunks(this.chunks)), this.chunks = [], this.err = m, this.msg = this.strm.msg;
  };
  function f(m, g) {
    var y = new l(g);
    if (y.push(m, !0), y.err)
      throw y.msg || n[y.err];
    return y.result;
  }
  function u(m, g) {
    return g = g || {}, g.raw = !0, f(m, g);
  }
  return Sr.Inflate = l, Sr.inflate = f, Sr.inflateRaw = u, Sr.ungzip = f, Sr;
}
var hn, Wa;
function ol() {
  if (Wa) return hn;
  Wa = 1;
  var t = sr().assign, e = el(), r = al(), i = Yo(), n = {};
  return t(n, e, r, i), hn = n, hn;
}
var sl = ol(), oa = /* @__PURE__ */ Qt(sl), dn, qa;
function cl() {
  if (qa) return dn;
  qa = 1;
  const t = (e, r) => function(...i) {
    const n = r.promiseModule;
    return new n((a, o) => {
      r.multiArgs ? i.push((...s) => {
        r.errorFirst ? s[0] ? o(s) : (s.shift(), a(s)) : a(s);
      }) : r.errorFirst ? i.push((s, l) => {
        s ? o(s) : a(l);
      }) : i.push(a), e.apply(this, i);
    });
  };
  return dn = (e, r) => {
    r = Object.assign({
      exclude: [/.+(Sync|Stream)$/],
      errorFirst: !0,
      promiseModule: Promise
    }, r);
    const i = typeof e;
    if (!(e !== null && (i === "object" || i === "function")))
      throw new TypeError(`Expected \`input\` to be a \`Function\` or \`Object\`, got \`${e === null ? "null" : i}\``);
    const n = (o) => {
      const s = (l) => typeof l == "string" ? o === l : l.test(o);
      return r.include ? r.include.some(s) : !r.exclude.some(s);
    };
    let a;
    i === "function" ? a = function(...o) {
      return r.excludeMain ? e(...o) : t(e, r).apply(this, o);
    } : a = Object.create(Object.getPrototypeOf(e));
    for (const o in e) {
      const s = e[o];
      a[o] = typeof s == "function" && n(o) ? t(s, r) : s;
    }
    return a;
  }, dn;
}
var ll = cl(), wn = /* @__PURE__ */ Qt(ll), pn, Ga;
function ul() {
  if (Ga) return pn;
  Ga = 1;
  function t(ie) {
    return Array.isArray(ie) ? ie : [ie];
  }
  const e = "", r = " ", i = "\\", n = /^\s+$/, a = /(?:[^\\]|^)\\$/, o = /^\\!/, s = /^\\#/, l = /\r?\n/g, f = /^\.*\/|^\.+$/, u = "/";
  let m = "node-ignore";
  typeof Symbol < "u" && (m = Symbol.for("node-ignore"));
  const g = m, y = (ie, X, ne) => Object.defineProperty(ie, X, { value: ne }), E = /([0-z])-([0-z])/g, A = () => !1, T = (ie) => ie.replace(
    E,
    (X, ne, de) => ne.charCodeAt(0) <= de.charCodeAt(0) ? X : e
  ), I = (ie) => {
    const { length: X } = ie;
    return ie.slice(0, X - X % 2);
  }, R = [
    [
      // remove BOM
      // TODO:
      // Other similar zero-width characters?
      /^\uFEFF/,
      () => e
    ],
    // > Trailing spaces are ignored unless they are quoted with backslash ("\")
    [
      // (a\ ) -> (a )
      // (a  ) -> (a)
      // (a ) -> (a)
      // (a \ ) -> (a  )
      /((?:\\\\)*?)(\\?\s+)$/,
      (ie, X, ne) => X + (ne.indexOf("\\") === 0 ? r : e)
    ],
    // replace (\ ) with ' '
    // (\ ) -> ' '
    // (\\ ) -> '\\ '
    // (\\\ ) -> '\\ '
    [
      /(\\+?)\s/g,
      (ie, X) => {
        const { length: ne } = X;
        return X.slice(0, ne - ne % 2) + r;
      }
    ],
    // Escape metacharacters
    // which is written down by users but means special for regular expressions.
    // > There are 12 characters with special meanings:
    // > - the backslash \,
    // > - the caret ^,
    // > - the dollar sign $,
    // > - the period or dot .,
    // > - the vertical bar or pipe symbol |,
    // > - the question mark ?,
    // > - the asterisk or star *,
    // > - the plus sign +,
    // > - the opening parenthesis (,
    // > - the closing parenthesis ),
    // > - and the opening square bracket [,
    // > - the opening curly brace {,
    // > These special characters are often called "metacharacters".
    [
      /[\\$.|*+(){^]/g,
      (ie) => `\\${ie}`
    ],
    [
      // > a question mark (?) matches a single character
      /(?!\\)\?/g,
      () => "[^/]"
    ],
    // leading slash
    [
      // > A leading slash matches the beginning of the pathname.
      // > For example, "/*.c" matches "cat-file.c" but not "mozilla-sha1/sha1.c".
      // A leading slash matches the beginning of the pathname
      /^\//,
      () => "^"
    ],
    // replace special metacharacter slash after the leading slash
    [
      /\//g,
      () => "\\/"
    ],
    [
      // > A leading "**" followed by a slash means match in all directories.
      // > For example, "**/foo" matches file or directory "foo" anywhere,
      // > the same as pattern "foo".
      // > "**/foo/bar" matches file or directory "bar" anywhere that is directly
      // >   under directory "foo".
      // Notice that the '*'s have been replaced as '\\*'
      /^\^*\\\*\\\*\\\//,
      // '**/foo' <-> 'foo'
      () => "^(?:.*\\/)?"
    ],
    // starting
    [
      // there will be no leading '/'
      //   (which has been replaced by section "leading slash")
      // If starts with '**', adding a '^' to the regular expression also works
      /^(?=[^^])/,
      function() {
        return /\/(?!$)/.test(this) ? "^" : "(?:^|\\/)";
      }
    ],
    // two globstars
    [
      // Use lookahead assertions so that we could match more than one `'/**'`
      /\\\/\\\*\\\*(?=\\\/|$)/g,
      // Zero, one or several directories
      // should not use '*', or it will be replaced by the next replacer
      // Check if it is not the last `'/**'`
      (ie, X, ne) => X + 6 < ne.length ? "(?:\\/[^\\/]+)*" : "\\/.+"
    ],
    // normal intermediate wildcards
    [
      // Never replace escaped '*'
      // ignore rule '\*' will match the path '*'
      // 'abc.*/' -> go
      // 'abc.*'  -> skip this rule,
      //    coz trailing single wildcard will be handed by [trailing wildcard]
      /(^|[^\\]+)(\\\*)+(?=.+)/g,
      // '*.js' matches '.js'
      // '*.js' doesn't match 'abc'
      (ie, X, ne) => {
        const de = ne.replace(/\\\*/g, "[^\\/]*");
        return X + de;
      }
    ],
    [
      // unescape, revert step 3 except for back slash
      // For example, if a user escape a '\\*',
      // after step 3, the result will be '\\\\\\*'
      /\\\\\\(?=[$.|*+(){^])/g,
      () => i
    ],
    [
      // '\\\\' -> '\\'
      /\\\\/g,
      () => i
    ],
    [
      // > The range notation, e.g. [a-zA-Z],
      // > can be used to match one of the characters in a range.
      // `\` is escaped by step 3
      /(\\)?\[([^\]/]*?)(\\*)($|\])/g,
      (ie, X, ne, de, Se) => X === i ? `\\[${ne}${I(de)}${Se}` : Se === "]" && de.length % 2 === 0 ? `[${T(ne)}${de}]` : "[]"
    ],
    // ending
    [
      // 'js' will not match 'js.'
      // 'ab' will not match 'abc'
      /(?:[^*])$/,
      // WTF!
      // https://git-scm.com/docs/gitignore
      // changes in [2.22.1](https://git-scm.com/docs/gitignore/2.22.1)
      // which re-fixes #24, #38
      // > If there is a separator at the end of the pattern then the pattern
      // > will only match directories, otherwise the pattern can match both
      // > files and directories.
      // 'js*' will not match 'a.js'
      // 'js/' will not match 'a.js'
      // 'js' will match 'a.js' and 'a.js/'
      (ie) => /\/$/.test(ie) ? `${ie}$` : `${ie}(?=$|\\/$)`
    ],
    // trailing wildcard
    [
      /(\^|\\\/)?\\\*$/,
      (ie, X) => `${X ? `${X}[^/]+` : "[^/]*"}(?=$|\\/$)`
    ]
  ], D = /* @__PURE__ */ Object.create(null), L = (ie, X) => {
    let ne = D[ie];
    return ne || (ne = R.reduce(
      (de, [Se, Te]) => de.replace(Se, Te.bind(ie)),
      ie
    ), D[ie] = ne), X ? new RegExp(ne, "i") : new RegExp(ne);
  }, U = (ie) => typeof ie == "string", M = (ie) => ie && U(ie) && !n.test(ie) && !a.test(ie) && ie.indexOf("#") !== 0, B = (ie) => ie.split(l);
  class O {
    constructor(X, ne, de, Se) {
      this.origin = X, this.pattern = ne, this.negative = de, this.regex = Se;
    }
  }
  const W = (ie, X) => {
    const ne = ie;
    let de = !1;
    ie.indexOf("!") === 0 && (de = !0, ie = ie.substr(1)), ie = ie.replace(o, "!").replace(s, "#");
    const Se = L(ie, X);
    return new O(
      ne,
      ie,
      de,
      Se
    );
  }, z = (ie, X) => {
    throw new X(ie);
  }, Y = (ie, X, ne) => U(ie) ? ie ? Y.isNotRelative(ie) ? ne(
    `path should be a \`path.relative()\`d string, but got "${X}"`,
    RangeError
  ) : !0 : ne("path must not be empty", TypeError) : ne(
    `path must be a string, but got \`${X}\``,
    TypeError
  ), F = (ie) => f.test(ie);
  Y.isNotRelative = F, Y.convert = (ie) => ie;
  class J {
    constructor({
      ignorecase: X = !0,
      ignoreCase: ne = X,
      allowRelativePaths: de = !1
    } = {}) {
      y(this, g, !0), this._rules = [], this._ignoreCase = ne, this._allowRelativePaths = de, this._initCache();
    }
    _initCache() {
      this._ignoreCache = /* @__PURE__ */ Object.create(null), this._testCache = /* @__PURE__ */ Object.create(null);
    }
    _addPattern(X) {
      if (X && X[g]) {
        this._rules = this._rules.concat(X._rules), this._added = !0;
        return;
      }
      if (M(X)) {
        const ne = W(X, this._ignoreCase);
        this._added = !0, this._rules.push(ne);
      }
    }
    // @param {Array<string> | string | Ignore} pattern
    add(X) {
      return this._added = !1, t(
        U(X) ? B(X) : X
      ).forEach(this._addPattern, this), this._added && this._initCache(), this;
    }
    // legacy
    addPattern(X) {
      return this.add(X);
    }
    //          |           ignored : unignored
    // negative |   0:0   |   0:1   |   1:0   |   1:1
    // -------- | ------- | ------- | ------- | --------
    //     0    |  TEST   |  TEST   |  SKIP   |    X
    //     1    |  TESTIF |  SKIP   |  TEST   |    X
    // - SKIP: always skip
    // - TEST: always test
    // - TESTIF: only test if checkUnignored
    // - X: that never happen
    // @param {boolean} whether should check if the path is unignored,
    //   setting `checkUnignored` to `false` could reduce additional
    //   path matching.
    // @returns {TestResult} true if a file is ignored
    _testOne(X, ne) {
      let de = !1, Se = !1;
      return this._rules.forEach((Te) => {
        const { negative: be } = Te;
        if (Se === be && de !== Se || be && !de && !Se && !ne)
          return;
        Te.regex.test(X) && (de = !be, Se = be);
      }), {
        ignored: de,
        unignored: Se
      };
    }
    // @returns {TestResult}
    _test(X, ne, de, Se) {
      const Te = X && Y.convert(X);
      return Y(
        Te,
        X,
        this._allowRelativePaths ? A : z
      ), this._t(Te, ne, de, Se);
    }
    _t(X, ne, de, Se) {
      if (X in ne)
        return ne[X];
      if (Se || (Se = X.split(u)), Se.pop(), !Se.length)
        return ne[X] = this._testOne(X, de);
      const Te = this._t(
        Se.join(u) + u,
        ne,
        de,
        Se
      );
      return ne[X] = Te.ignored ? Te : this._testOne(X, de);
    }
    ignores(X) {
      return this._test(X, this._ignoreCache, !1).ignored;
    }
    createFilter() {
      return (X) => !this.ignores(X);
    }
    filter(X) {
      return t(X).filter(this.createFilter());
    }
    // @returns {TestResult}
    test(X) {
      return this._test(X, this._testCache, !0);
    }
  }
  const se = (ie) => new J(ie), _e = (ie) => Y(ie && Y.convert(ie), ie, A);
  if (se.isPathValid = _e, se.default = se, pn = se, // Detect `process` so that it can run in browsers.
  typeof gt < "u" && (gt.env && gt.env.IGNORE_TEST_WIN32 || gt.platform === "win32")) {
    const ie = (ne) => /^\\\\\?\\/.test(ne) || /["<>|\u0000-\u001F]+/u.test(ne) ? ne : ne.replace(/\\/g, "/");
    Y.convert = ie;
    const X = /^[a-z]:\//i;
    Y.isNotRelative = (ne) => X.test(ne) || F(ne);
  }
  return pn;
}
var fl = ul(), hl = /* @__PURE__ */ Qt(fl), mn, Za;
function dl() {
  if (Za) return mn;
  Za = 1;
  function t(i) {
    return i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function e(i, n, a) {
    return n = n instanceof RegExp ? n : new RegExp(t(n), "g"), i.replace(n, a);
  }
  var r = {
    clean: function(n) {
      if (typeof n != "string")
        throw new Error("Expected a string, received: " + n);
      return n = e(n, "./", "/"), n = e(n, "..", "."), n = e(n, " ", "-"), n = e(n, /^[~^:?*\\\-]/g, ""), n = e(n, /[~^:?*\\]/g, "-"), n = e(n, /[~^:?*\\\-]$/g, ""), n = e(n, "@{", "-"), n = e(n, /\.$/g, ""), n = e(n, /\/$/g, ""), n = e(n, /\.lock$/g, ""), n;
    }
  };
  return mn = r, mn;
}
var wl = dl(), zt = /* @__PURE__ */ Qt(wl), gn, Va;
function pl() {
  return Va || (Va = 1, gn = function(t, e) {
    var r = t, i = e, n = r.length, a = i.length, o = !1, s = null, l = n + 1, f = [], u = [], m = [], g = "", y = -1, E = 0, A = 1, T, I, R = function() {
      n >= a && (T = r, I = n, r = i, i = T, n = a, a = I, o = !0, l = n + 1);
    }, D = function(B, O, W) {
      return {
        x: B,
        y: O,
        k: W
      };
    }, L = function(B, O) {
      return {
        elem: B,
        t: O
      };
    }, U = function(B, O, W) {
      var z, Y, F;
      for (O > W ? z = f[B - 1 + l] : z = f[B + 1 + l], F = Math.max(O, W), Y = F - B; Y < n && F < a && r[Y] === i[F]; )
        ++Y, ++F;
      return f[B + l] = u.length, u[u.length] = new D(Y, F, z), F;
    }, M = function(B) {
      var O, W, z;
      for (O = W = 0, z = B.length - 1; z >= 0; --z)
        for (; O < B[z].x || W < B[z].y; )
          B[z].y - B[z].x > W - O ? (o ? m[m.length] = new L(i[W], y) : m[m.length] = new L(i[W], A), ++W) : B[z].y - B[z].x < W - O ? (o ? m[m.length] = new L(r[O], A) : m[m.length] = new L(r[O], y), ++O) : (m[m.length] = new L(r[O], E), g += r[O], ++O, ++W);
    };
    return R(), {
      SES_DELETE: -1,
      SES_COMMON: 0,
      SES_ADD: 1,
      editdistance: function() {
        return s;
      },
      getlcs: function() {
        return g;
      },
      getses: function() {
        return m;
      },
      compose: function() {
        var B, O, W, z, Y, F, J, se;
        for (B = a - n, O = n + a + 3, W = {}, J = 0; J < O; ++J)
          W[J] = -1, f[J] = -1;
        z = -1;
        do {
          for (++z, se = -z; se <= B - 1; ++se)
            W[se + l] = U(se, W[se - 1 + l] + 1, W[se + 1 + l]);
          for (se = B + z; se >= B + 1; --se)
            W[se + l] = U(se, W[se - 1 + l] + 1, W[se + 1 + l]);
          W[B + l] = U(B, W[B - 1 + l] + 1, W[B + 1 + l]);
        } while (W[B + l] !== a);
        for (s = B + 2 * z, Y = f[B + l], F = []; Y !== -1; )
          F[F.length] = new D(u[Y].x, u[Y].y, null), Y = u[Y].k;
        M(F);
      }
    };
  }), gn;
}
var yn, Xa;
function ml() {
  if (Xa) return yn;
  Xa = 1;
  var t = pl();
  function e(a, o) {
    var s = new t(a, o);
    s.compose();
    for (var l = s.getses(), f, u, m = a.length - 1, g = o.length - 1, y = l.length - 1; y >= 0; --y)
      l[y].t === s.SES_COMMON ? (u ? (u.chain = {
        file1index: m,
        file2index: g,
        chain: null
      }, u = u.chain) : (f = {
        file1index: m,
        file2index: g,
        chain: null
      }, u = f), m--, g--) : l[y].t === s.SES_DELETE ? m-- : l[y].t === s.SES_ADD && g--;
    var E = {
      file1index: -1,
      file2index: -1,
      chain: null
    };
    return u ? (u.chain = E, f) : E;
  }
  function r(a, o) {
    for (var s = [], l = a.length, f = o.length, u = e(a, o); u !== null; u = u.chain) {
      var m = l - u.file1index - 1, g = f - u.file2index - 1;
      l = u.file1index, f = u.file2index, (m || g) && s.push({
        file1: [l + 1, m],
        file2: [f + 1, g]
      });
    }
    return s.reverse(), s;
  }
  function i(a, o, s) {
    var l, f = r(o, a), u = r(o, s), m = [];
    function g(ne, de) {
      m.push([ne.file1[0], de, ne.file1[1], ne.file2[0], ne.file2[1]]);
    }
    for (l = 0; l < f.length; l++)
      g(f[l], 0);
    for (l = 0; l < u.length; l++)
      g(u[l], 2);
    m.sort(function(ne, de) {
      return ne[0] - de[0];
    });
    var y = [], E = 0;
    function A(ne) {
      ne > E && (y.push([1, E, ne - E]), E = ne);
    }
    for (var T = 0; T < m.length; T++) {
      for (var I = T, R = m[T], D = R[0], L = D + R[2]; T < m.length - 1; ) {
        var U = m[T + 1], M = U[0];
        if (M > L) break;
        L = Math.max(L, M + U[2]), T++;
      }
      if (A(D), I == T)
        R[4] > 0 && y.push([R[1], R[3], R[4]]);
      else {
        var B = {
          0: [a.length, -1, o.length, -1],
          2: [s.length, -1, o.length, -1]
        };
        for (l = I; l <= T; l++) {
          R = m[l];
          var O = R[1], W = B[O], z = R[0], Y = z + R[2], F = R[3], J = F + R[4];
          W[0] = Math.min(F, W[0]), W[1] = Math.max(J, W[1]), W[2] = Math.min(z, W[2]), W[3] = Math.max(Y, W[3]);
        }
        var se = B[0][0] + (D - B[0][2]), _e = B[0][1] + (L - B[0][3]), ie = B[2][0] + (D - B[2][2]), X = B[2][1] + (L - B[2][3]);
        y.push([
          -1,
          se,
          _e - se,
          D,
          L - D,
          ie,
          X - ie
        ]);
      }
      E = L;
    }
    return A(o.length), y;
  }
  function n(a, o, s) {
    var l = [], f = [a, o, s], u = i(a, o, s), m = [];
    function g() {
      m.length && l.push({
        ok: m
      }), m = [];
    }
    function y(R) {
      for (var D = 0; D < R.length; D++)
        m.push(R[D]);
    }
    function E(R) {
      if (R[2] != R[6]) return !0;
      for (var D = R[1], L = R[5], U = 0; U < R[2]; U++)
        if (a[U + D] != s[U + L]) return !0;
      return !1;
    }
    for (var A = 0; A < u.length; A++) {
      var T = u[A], I = T[0];
      I == -1 ? E(T) ? (g(), l.push({
        conflict: {
          a: a.slice(T[1], T[1] + T[2]),
          aIndex: T[1],
          o: o.slice(T[3], T[3] + T[4]),
          oIndex: T[3],
          b: s.slice(T[5], T[5] + T[6]),
          bIndex: T[5]
        }
      })) : y(f[0].slice(T[1], T[1] + T[2])) : y(f[I].slice(T[1], T[1] + T[2]));
    }
    return g(), l;
  }
  return yn = n, yn;
}
var gl = ml(), yl = /* @__PURE__ */ Qt(gl);
class Fe extends Error {
  constructor(e) {
    super(e), this.caller = "";
  }
  toJSON() {
    return {
      code: this.code,
      data: this.data,
      caller: this.caller,
      message: this.message,
      stack: this.stack
    };
  }
  fromJSON(e) {
    const r = new Fe(e.message);
    return r.code = e.code, r.data = e.data, r.caller = e.caller, r.stack = e.stack, r;
  }
  get isIsomorphicGitError() {
    return !0;
  }
}
class Qr extends Fe {
  /**
   * @param {Array<string>} filepaths
   */
  constructor(e) {
    super(
      `Modifying the index is not possible because you have unmerged files: ${e.toString}. Fix them up in the work tree, and then use 'git add/rm as appropriate to mark resolution and make a commit.`
    ), this.code = this.name = Qr.code, this.data = { filepaths: e };
  }
}
Qr.code = "UnmergedPathsError";
class Re extends Fe {
  /**
   * @param {string} message
   */
  constructor(e) {
    super(
      `An internal error caused this command to fail. Please file a bug report at https://github.com/isomorphic-git/isomorphic-git/issues with this error message: ${e}`
    ), this.code = this.name = Re.code, this.data = { message: e };
  }
}
Re.code = "InternalError";
class Fr extends Fe {
  /**
   * @param {string} filepath
   */
  constructor(e) {
    super(`The filepath "${e}" contains unsafe character sequences`), this.code = this.name = Fr.code, this.data = { filepath: e };
  }
}
Fr.code = "UnsafeFilepathError";
class jt {
  constructor(e) {
    this.buffer = e, this._start = 0;
  }
  eof() {
    return this._start >= this.buffer.length;
  }
  tell() {
    return this._start;
  }
  seek(e) {
    this._start = e;
  }
  slice(e) {
    const r = this.buffer.slice(this._start, this._start + e);
    return this._start += e, r;
  }
  toString(e, r) {
    const i = this.buffer.toString(e, this._start, this._start + r);
    return this._start += r, i;
  }
  write(e, r, i) {
    const n = this.buffer.write(e, this._start, r, i);
    return this._start += r, n;
  }
  copy(e, r, i) {
    const n = e.copy(this.buffer, this._start, r, i);
    return this._start += n, n;
  }
  readUInt8() {
    const e = this.buffer.readUInt8(this._start);
    return this._start += 1, e;
  }
  writeUInt8(e) {
    const r = this.buffer.writeUInt8(e, this._start);
    return this._start += 1, r;
  }
  readUInt16BE() {
    const e = this.buffer.readUInt16BE(this._start);
    return this._start += 2, e;
  }
  writeUInt16BE(e) {
    const r = this.buffer.writeUInt16BE(e, this._start);
    return this._start += 2, r;
  }
  readUInt32BE() {
    const e = this.buffer.readUInt32BE(this._start);
    return this._start += 4, e;
  }
  writeUInt32BE(e) {
    const r = this.buffer.writeUInt32BE(e, this._start);
    return this._start += 4, r;
  }
}
function ji(t, e) {
  return -(t < e) || +(t > e);
}
function Ko(t, e) {
  return ji(t.path, e.path);
}
function Jo(t) {
  let e = t > 0 ? t >> 12 : 0;
  e !== 4 && e !== 8 && e !== 10 && e !== 14 && (e = 8);
  let r = t & 511;
  return r & 73 ? r = 493 : r = 420, e !== 8 && (r = 0), (e << 12) + r;
}
const Mt = 2 ** 32;
function Ya(t, e, r, i) {
  if (t !== void 0 && e !== void 0)
    return [t, e];
  r === void 0 && (r = i.valueOf());
  const n = Math.floor(r / 1e3), a = (r - n * 1e3) * 1e6;
  return [n, a];
}
function Ir(t) {
  const [e, r] = Ya(
    t.ctimeSeconds,
    t.ctimeNanoseconds,
    t.ctimeMs,
    t.ctime
  ), [i, n] = Ya(
    t.mtimeSeconds,
    t.mtimeNanoseconds,
    t.mtimeMs,
    t.mtime
  );
  return {
    ctimeSeconds: e % Mt,
    ctimeNanoseconds: r % Mt,
    mtimeSeconds: i % Mt,
    mtimeNanoseconds: n % Mt,
    dev: t.dev % Mt,
    ino: t.ino % Mt,
    mode: Jo(t.mode % Mt),
    uid: t.uid % Mt,
    gid: t.gid % Mt,
    // size of -1 happens over a BrowserFS HTTP Backend that doesn't serve Content-Length headers
    // (like the Karma webserver) because BrowserFS HTTP Backend uses HTTP HEAD requests to do fs.stat
    size: t.size > -1 ? t.size % Mt : 0
  };
}
function _l(t) {
  let e = "";
  for (const r of new Uint8Array(t))
    r < 16 && (e += "0"), e += r.toString(16);
  return e;
}
let _n = null;
async function Yt(t) {
  return _n === null && (_n = await vl()), _n ? Qo(t) : bl(t);
}
function bl(t) {
  return new qo().update(t).digest("hex");
}
async function Qo(t) {
  const e = await crypto.subtle.digest("SHA-1", t);
  return _l(e);
}
async function vl() {
  try {
    if (await Qo(new Uint8Array([])) === "da39a3ee5e6b4b0d3255bfef95601890afd80709") return !0;
  } catch {
  }
  return !1;
}
function El(t) {
  return {
    assumeValid: !!(t & 32768),
    extended: !!(t & 16384),
    stage: (t & 12288) >> 12,
    nameLength: t & 4095
  };
}
function kl(t) {
  const e = t.flags;
  return e.extended = !1, e.nameLength = Math.min(fe.from(t.path).length, 4095), (e.assumeValid ? 32768 : 0) + (e.extended ? 16384 : 0) + ((e.stage & 3) << 12) + (e.nameLength & 4095);
}
class pr {
  /*::
   _entries: Map<string, CacheEntry>
   _dirty: boolean // Used to determine if index needs to be saved to filesystem
   */
  constructor(e, r) {
    this._dirty = !1, this._unmergedPaths = r || /* @__PURE__ */ new Set(), this._entries = e || /* @__PURE__ */ new Map();
  }
  _addEntry(e) {
    if (e.flags.stage === 0)
      e.stages = [e], this._entries.set(e.path, e), this._unmergedPaths.delete(e.path);
    else {
      let r = this._entries.get(e.path);
      r || (this._entries.set(e.path, e), r = e), r.stages[e.flags.stage] = e, this._unmergedPaths.add(e.path);
    }
  }
  static async from(e) {
    if (fe.isBuffer(e))
      return pr.fromBuffer(e);
    if (e === null)
      return new pr(null);
    throw new Re("invalid type passed to GitIndex.from");
  }
  static async fromBuffer(e) {
    if (e.length === 0)
      throw new Re("Index file is empty (.git/index)");
    const r = new pr(), i = new jt(e), n = i.toString("utf8", 4);
    if (n !== "DIRC")
      throw new Re(`Invalid dircache magic file number: ${n}`);
    const a = await Yt(e.slice(0, -20)), o = e.slice(-20).toString("hex");
    if (o !== a)
      throw new Re(
        `Invalid checksum in GitIndex buffer: expected ${o} but saw ${a}`
      );
    const s = i.readUInt32BE();
    if (s !== 2)
      throw new Re(`Unsupported dircache version: ${s}`);
    const l = i.readUInt32BE();
    let f = 0;
    for (; !i.eof() && f < l; ) {
      const u = {};
      u.ctimeSeconds = i.readUInt32BE(), u.ctimeNanoseconds = i.readUInt32BE(), u.mtimeSeconds = i.readUInt32BE(), u.mtimeNanoseconds = i.readUInt32BE(), u.dev = i.readUInt32BE(), u.ino = i.readUInt32BE(), u.mode = i.readUInt32BE(), u.uid = i.readUInt32BE(), u.gid = i.readUInt32BE(), u.size = i.readUInt32BE(), u.oid = i.slice(20).toString("hex");
      const m = i.readUInt16BE();
      u.flags = El(m);
      const g = e.indexOf(0, i.tell() + 1) - i.tell();
      if (g < 1)
        throw new Re(`Got a path length of: ${g}`);
      if (u.path = i.toString("utf8", g), u.path.includes("..\\") || u.path.includes("../"))
        throw new Fr(u.path);
      let y = 8 - (i.tell() - 12) % 8;
      for (y === 0 && (y = 8); y--; ) {
        const E = i.readUInt8();
        if (E !== 0)
          throw new Re(
            `Expected 1-8 null characters but got '${E}' after ${u.path}`
          );
        if (i.eof())
          throw new Re("Unexpected end of file");
      }
      u.stages = [], r._addEntry(u), f++;
    }
    return r;
  }
  get unmergedPaths() {
    return [...this._unmergedPaths];
  }
  get entries() {
    return [...this._entries.values()].sort(Ko);
  }
  get entriesMap() {
    return this._entries;
  }
  get entriesFlat() {
    return [...this.entries].flatMap((e) => e.stages.length > 1 ? e.stages.filter((r) => r) : e);
  }
  *[Symbol.iterator]() {
    for (const e of this.entries)
      yield e;
  }
  insert({ filepath: e, stats: r, oid: i, stage: n = 0 }) {
    r || (r = {
      ctimeSeconds: 0,
      ctimeNanoseconds: 0,
      mtimeSeconds: 0,
      mtimeNanoseconds: 0,
      dev: 0,
      ino: 0,
      mode: 0,
      uid: 0,
      gid: 0,
      size: 0
    }), r = Ir(r);
    const a = fe.from(e), o = {
      ctimeSeconds: r.ctimeSeconds,
      ctimeNanoseconds: r.ctimeNanoseconds,
      mtimeSeconds: r.mtimeSeconds,
      mtimeNanoseconds: r.mtimeNanoseconds,
      dev: r.dev,
      ino: r.ino,
      // We provide a fallback value for `mode` here because not all fs
      // implementations assign it, but we use it in GitTree.
      // '100644' is for a "regular non-executable file"
      mode: r.mode || 33188,
      uid: r.uid,
      gid: r.gid,
      size: r.size,
      path: e,
      oid: i,
      flags: {
        assumeValid: !1,
        extended: !1,
        stage: n,
        nameLength: a.length < 4095 ? a.length : 4095
      },
      stages: []
    };
    this._addEntry(o), this._dirty = !0;
  }
  delete({ filepath: e }) {
    if (this._entries.has(e))
      this._entries.delete(e);
    else
      for (const r of this._entries.keys())
        r.startsWith(e + "/") && this._entries.delete(r);
    this._unmergedPaths.has(e) && this._unmergedPaths.delete(e), this._dirty = !0;
  }
  clear() {
    this._entries.clear(), this._dirty = !0;
  }
  has({ filepath: e }) {
    return this._entries.has(e);
  }
  render() {
    return this.entries.map((e) => `${e.mode.toString(8)} ${e.oid}    ${e.path}`).join(`
`);
  }
  static async _entryToBuffer(e) {
    const r = fe.from(e.path), i = Math.ceil((62 + r.length + 1) / 8) * 8, n = fe.alloc(i), a = new jt(n), o = Ir(e);
    return a.writeUInt32BE(o.ctimeSeconds), a.writeUInt32BE(o.ctimeNanoseconds), a.writeUInt32BE(o.mtimeSeconds), a.writeUInt32BE(o.mtimeNanoseconds), a.writeUInt32BE(o.dev), a.writeUInt32BE(o.ino), a.writeUInt32BE(o.mode), a.writeUInt32BE(o.uid), a.writeUInt32BE(o.gid), a.writeUInt32BE(o.size), a.write(e.oid, 20, "hex"), a.writeUInt16BE(kl(e)), a.write(e.path, r.length, "utf8"), n;
  }
  async toObject() {
    const e = fe.alloc(12), r = new jt(e);
    r.write("DIRC", 4, "utf8"), r.writeUInt32BE(2), r.writeUInt32BE(this.entriesFlat.length);
    let i = [];
    for (const s of this.entries)
      if (i.push(pr._entryToBuffer(s)), s.stages.length > 1)
        for (const l of s.stages)
          l && l !== s && i.push(pr._entryToBuffer(l));
    i = await Promise.all(i);
    const n = fe.concat(i), a = fe.concat([e, n]), o = await Yt(a);
    return fe.concat([a, fe.from(o, "hex")]);
  }
}
function Bi(t, e, r = !0, i = !0) {
  const n = Ir(t), a = Ir(e);
  return r && n.mode !== a.mode || n.mtimeSeconds !== a.mtimeSeconds || n.ctimeSeconds !== a.ctimeSeconds || n.uid !== a.uid || n.gid !== a.gid || i && n.ino !== a.ino || n.size !== a.size;
}
let bn = null;
const vn = Symbol("IndexCache");
function Sl() {
  return {
    map: /* @__PURE__ */ new Map(),
    stats: /* @__PURE__ */ new Map()
  };
}
async function xl(t, e, r) {
  const [i, n] = await Promise.all([
    t.lstat(e),
    t.read(e)
  ]), a = await pr.from(n);
  r.map.set(e, a), r.stats.set(e, i);
}
async function Il(t, e, r) {
  const i = r.stats.get(e);
  if (i === void 0) return !0;
  if (i === null) return !1;
  const n = await t.lstat(e);
  return n === null ? !1 : Bi(i, n);
}
class ot {
  /**
   *
   * @param {object} opts
   * @param {import('../models/FileSystem.js').FileSystem} opts.fs
   * @param {string} opts.gitdir
   * @param {object} opts.cache
   * @param {bool} opts.allowUnmerged
   * @param {function(GitIndex): any} closure
   */
  static async acquire({ fs: e, gitdir: r, cache: i, allowUnmerged: n = !0 }, a) {
    i[vn] || (i[vn] = Sl());
    const o = `${r}/index`;
    bn === null && (bn = new Xr({ maxPending: 1 / 0 }));
    let s, l = [];
    return await bn.acquire(o, async () => {
      const f = i[vn];
      await Il(e, o, f) && await xl(e, o, f);
      const u = f.map.get(o);
      if (l = u.unmergedPaths, l.length && !n)
        throw new Qr(l);
      if (s = await a(u), u._dirty) {
        const m = await u.toObject();
        await e.write(o, m), f.stats.set(o, await e.lstat(o)), u._dirty = !1;
      }
    }), s;
  }
}
function Ai(t) {
  const e = Math.max(t.lastIndexOf("/"), t.lastIndexOf("\\"));
  return e > -1 && (t = t.slice(e + 1)), t;
}
function Rr(t) {
  const e = Math.max(t.lastIndexOf("/"), t.lastIndexOf("\\"));
  return e === -1 ? "." : e === 0 ? "/" : t.slice(0, e);
}
function es(t) {
  const e = /* @__PURE__ */ new Map(), r = function(n) {
    if (!e.has(n)) {
      const a = {
        type: "tree",
        fullpath: n,
        basename: Ai(n),
        metadata: {},
        children: []
      };
      e.set(n, a), a.parent = r(Rr(n)), a.parent && a.parent !== a && a.parent.children.push(a);
    }
    return e.get(n);
  }, i = function(n, a) {
    if (!e.has(n)) {
      const o = {
        type: "blob",
        fullpath: n,
        basename: Ai(n),
        metadata: a,
        // This recursively generates any missing parent folders.
        parent: r(Rr(n)),
        children: []
      };
      o.parent && o.parent.children.push(o), e.set(n, o);
    }
    return e.get(n);
  };
  r(".");
  for (const n of t)
    i(n.path, n);
  return e;
}
function Rl(t) {
  switch (t) {
    case 16384:
      return "tree";
    case 33188:
      return "blob";
    case 33261:
      return "blob";
    case 40960:
      return "blob";
    case 57344:
      return "commit";
  }
  throw new Re(`Unexpected GitTree entry mode: ${t.toString(8)}`);
}
class Tl {
  constructor({ fs: e, gitdir: r, cache: i }) {
    this.treePromise = ot.acquire(
      { fs: e, gitdir: r, cache: i },
      async function(a) {
        return es(a.entries);
      }
    );
    const n = this;
    this.ConstructEntry = class {
      constructor(o) {
        this._fullpath = o, this._type = !1, this._mode = !1, this._stat = !1, this._oid = !1;
      }
      async type() {
        return n.type(this);
      }
      async mode() {
        return n.mode(this);
      }
      async stat() {
        return n.stat(this);
      }
      async content() {
        return n.content(this);
      }
      async oid() {
        return n.oid(this);
      }
    };
  }
  async readdir(e) {
    const r = e._fullpath, n = (await this.treePromise).get(r);
    if (!n || n.type === "blob") return null;
    if (n.type !== "tree")
      throw new Error(`ENOTDIR: not a directory, scandir '${r}'`);
    const a = n.children.map((o) => o.fullpath);
    return a.sort(ji), a;
  }
  async type(e) {
    return e._type === !1 && await e.stat(), e._type;
  }
  async mode(e) {
    return e._mode === !1 && await e.stat(), e._mode;
  }
  async stat(e) {
    if (e._stat === !1) {
      const i = (await this.treePromise).get(e._fullpath);
      if (!i)
        throw new Error(
          `ENOENT: no such file or directory, lstat '${e._fullpath}'`
        );
      const n = i.type === "tree" ? {} : Ir(i.metadata);
      e._type = i.type === "tree" ? "tree" : Rl(n.mode), e._mode = n.mode, i.type === "tree" ? e._stat = void 0 : e._stat = n;
    }
    return e._stat;
  }
  async content(e) {
  }
  async oid(e) {
    if (e._oid === !1) {
      const i = (await this.treePromise).get(e._fullpath);
      e._oid = i.metadata.oid;
    }
    return e._oid;
  }
}
const zi = Symbol("GitWalkSymbol");
function Nr() {
  const t = /* @__PURE__ */ Object.create(null);
  return Object.defineProperty(t, zi, {
    value: function({ fs: e, gitdir: r, cache: i }) {
      return new Tl({ fs: e, gitdir: r, cache: i });
    }
  }), Object.freeze(t), t;
}
class Le extends Fe {
  /**
   * @param {string} what
   */
  constructor(e) {
    super(`Could not find ${e}.`), this.code = this.name = Le.code, this.data = { what: e };
  }
}
Le.code = "NotFoundError";
class pt extends Fe {
  /**
   * @param {string} oid
   * @param {'blob'|'commit'|'tag'|'tree'} actual
   * @param {'blob'|'commit'|'tag'|'tree'} expected
   * @param {string} [filepath]
   */
  constructor(e, r, i, n) {
    super(
      `Object ${e} ${n ? `at ${n}` : ""}was anticipated to be a ${i} but it is a ${r}.`
    ), this.code = this.name = pt.code, this.data = { oid: e, actual: r, expected: i, filepath: n };
  }
}
pt.code = "ObjectTypeError";
class ir extends Fe {
  /**
   * @param {string} value
   */
  constructor(e) {
    super(`Expected a 40-char hex object id but saw "${e}".`), this.code = this.name = ir.code, this.data = { value: e };
  }
}
ir.code = "InvalidOidError";
class ei extends Fe {
  /**
   * @param {string} remote
   */
  constructor(e) {
    super(`Could not find a fetch refspec for remote "${e}". Make sure the config file has an entry like the following:
[remote "${e}"]
	fetch = +refs/heads/*:refs/remotes/origin/*
`), this.code = this.name = ei.code, this.data = { remote: e };
  }
}
ei.code = "NoRefspecError";
class Di {
  constructor(e) {
    if (this.refs = /* @__PURE__ */ new Map(), this.parsedConfig = [], e) {
      let r = null;
      this.parsedConfig = e.trim().split(`
`).map((i) => {
        if (/^\s*#/.test(i))
          return { line: i, comment: !0 };
        const n = i.indexOf(" ");
        if (i.startsWith("^")) {
          const a = i.slice(1);
          return this.refs.set(r + "^{}", a), { line: i, ref: r, peeled: a };
        } else {
          const a = i.slice(0, n);
          return r = i.slice(n + 1), this.refs.set(r, a), { line: i, ref: r, oid: a };
        }
      });
    }
    return this;
  }
  static from(e) {
    return new Di(e);
  }
  delete(e) {
    this.parsedConfig = this.parsedConfig.filter((r) => r.ref !== e), this.refs.delete(e);
  }
  toString() {
    return this.parsedConfig.map(({ line: e }) => e).join(`
`) + `
`;
  }
}
class Oi {
  constructor({ remotePath: e, localPath: r, force: i, matchPrefix: n }) {
    Object.assign(this, {
      remotePath: e,
      localPath: r,
      force: i,
      matchPrefix: n
    });
  }
  static from(e) {
    const [
      r,
      i,
      n,
      a,
      o
    ] = e.match(/^(\+?)(.*?)(\*?):(.*?)(\*?)$/).slice(1), s = r === "+", l = n === "*";
    if (l !== (o === "*"))
      throw new Re("Invalid refspec");
    return new Oi({
      remotePath: i,
      localPath: a,
      force: s,
      matchPrefix: l
    });
  }
  translate(e) {
    if (this.matchPrefix) {
      if (e.startsWith(this.remotePath))
        return this.localPath + e.replace(this.remotePath, "");
    } else if (e === this.remotePath) return this.localPath;
    return null;
  }
  reverseTranslate(e) {
    if (this.matchPrefix) {
      if (e.startsWith(this.localPath))
        return this.remotePath + e.replace(this.localPath, "");
    } else if (e === this.localPath) return this.remotePath;
    return null;
  }
}
class sa {
  constructor(e = []) {
    this.rules = e;
  }
  static from(e) {
    const r = [];
    for (const i of e)
      r.push(Oi.from(i));
    return new sa(r);
  }
  add(e) {
    const r = Oi.from(e);
    this.rules.push(r);
  }
  translate(e) {
    const r = [];
    for (const i of this.rules)
      for (const n of e) {
        const a = i.translate(n);
        a && r.push([n, a]);
      }
    return r;
  }
  translateOne(e) {
    let r = null;
    for (const i of this.rules) {
      const n = i.translate(e);
      n && (r = n);
    }
    return r;
  }
  localNamespaces() {
    return this.rules.filter((e) => e.matchPrefix).map((e) => e.localPath.replace(/\/$/, ""));
  }
}
function $l(t, e) {
  const r = t.replace(/\^\{\}$/, ""), i = e.replace(/\^\{\}$/, ""), n = -(r < i) || +(r > i);
  return n === 0 ? t.endsWith("^{}") ? 1 : -1 : n;
}
const Bl = (t) => {
  if (typeof t == "number")
    return t;
  t = t.toLowerCase();
  let e = parseInt(t);
  return t.endsWith("k") && (e *= 1024), t.endsWith("m") && (e *= 1024 * 1024), t.endsWith("g") && (e *= 1024 * 1024 * 1024), e;
}, Gr = (t) => {
  if (typeof t == "boolean")
    return t;
  if (t = t.trim().toLowerCase(), t === "true" || t === "yes" || t === "on") return !0;
  if (t === "false" || t === "no" || t === "off") return !1;
  throw Error(
    `Expected 'true', 'false', 'yes', 'no', 'on', or 'off', but got ${t}`
  );
}, Ka = {
  core: {
    filemode: Gr,
    bare: Gr,
    logallrefupdates: Gr,
    symlinks: Gr,
    ignorecase: Gr,
    bigFileThreshold: Bl
  }
}, Al = /^\[([A-Za-z0-9-.]+)(?: "(.*)")?\]$/, Dl = /^[A-Za-z0-9-.]+$/, Ol = /^([A-Za-z][A-Za-z-]*)(?: *= *(.*))?$/, Cl = /^[A-Za-z][A-Za-z-]*$/, Fl = /^(.*?)( *[#;].*)$/, Nl = (t) => {
  const e = Al.exec(t);
  if (e != null) {
    const [r, i] = e.slice(1);
    return [r, i];
  }
  return null;
}, Ml = (t) => {
  const e = Ol.exec(t);
  if (e != null) {
    const [r, i = "true"] = e.slice(1), n = Ul(i), a = Pl(n);
    return [r, a];
  }
  return null;
}, Ul = (t) => {
  const e = Fl.exec(t);
  if (e == null)
    return t;
  const [r, i] = e.slice(1);
  return Ja(r) && Ja(i) ? `${r}${i}` : r;
}, Ja = (t) => (t.match(/(?:^|[^\\])"/g) || []).length % 2 !== 0, Pl = (t) => t.split("").reduce((e, r, i, n) => {
  const a = r === '"' && n[i - 1] !== "\\", o = r === "\\" && n[i + 1] === '"';
  return a || o ? e : e + r;
}, ""), Qa = (t) => t != null ? t.toLowerCase() : null, Xn = (t, e, r) => [Qa(t), e, Qa(r)].filter((i) => i != null).join("."), eo = (t) => {
  const e = t.split("."), r = e.shift(), i = e.pop(), n = e.length ? e.join(".") : void 0;
  return {
    section: r,
    subsection: n,
    name: i,
    path: Xn(r, n, i),
    sectionPath: Xn(r, n, null),
    isSection: !!r
  };
}, Ll = (t, e) => t.reduce((r, i, n) => e(i) ? n : r, -1);
class ca {
  constructor(e) {
    let r = null, i = null;
    this.parsedConfig = e ? e.split(`
`).map((n) => {
      let a = null, o = null;
      const s = n.trim(), l = Nl(s), f = l != null;
      if (f)
        [r, i] = l;
      else {
        const m = Ml(s);
        m != null && ([a, o] = m);
      }
      const u = Xn(r, i, a);
      return { line: n, isSection: f, section: r, subsection: i, name: a, value: o, path: u };
    }) : [];
  }
  static from(e) {
    return new ca(e);
  }
  async get(e, r = !1) {
    const i = eo(e).path, n = this.parsedConfig.filter((a) => a.path === i).map(({ section: a, name: o, value: s }) => {
      const l = Ka[a] && Ka[a][o];
      return l ? l(s) : s;
    });
    return r ? n : n.pop();
  }
  async getall(e) {
    return this.get(e, !0);
  }
  async getSubsections(e) {
    return this.parsedConfig.filter((r) => r.isSection && r.section === e).map((r) => r.subsection);
  }
  async deleteSection(e, r) {
    this.parsedConfig = this.parsedConfig.filter(
      (i) => !(i.section === e && i.subsection === r)
    );
  }
  async append(e, r) {
    return this.set(e, r, !0);
  }
  async set(e, r, i = !1) {
    const {
      section: n,
      subsection: a,
      name: o,
      path: s,
      sectionPath: l,
      isSection: f
    } = eo(e), u = Ll(
      this.parsedConfig,
      (m) => m.path === s
    );
    if (r == null)
      u !== -1 && this.parsedConfig.splice(u, 1);
    else if (u !== -1) {
      const m = this.parsedConfig[u], g = Object.assign({}, m, {
        name: o,
        value: r,
        modified: !0
      });
      i ? this.parsedConfig.splice(u + 1, 0, g) : this.parsedConfig[u] = g;
    } else {
      const m = this.parsedConfig.findIndex(
        (y) => y.path === l
      ), g = {
        section: n,
        subsection: a,
        name: o,
        value: r,
        modified: !0,
        path: s
      };
      if (Dl.test(n) && Cl.test(o))
        if (m >= 0)
          this.parsedConfig.splice(m + 1, 0, g);
        else {
          const y = {
            isSection: f,
            section: n,
            subsection: a,
            modified: !0,
            path: l
          };
          this.parsedConfig.push(y, g);
        }
    }
  }
  toString() {
    return this.parsedConfig.map(({ line: e, section: r, subsection: i, name: n, value: a, modified: o = !1 }) => o ? n != null && a != null ? typeof a == "string" && /[#;]/.test(a) ? `	${n} = "${a}"` : `	${n} = ${a}` : i != null ? `[${r} "${i}"]` : `[${r}]` : e).join(`
`);
  }
}
class it {
  static async get({ fs: e, gitdir: r }) {
    const i = await e.read(`${r}/config`, { encoding: "utf8" });
    return ca.from(i);
  }
  static async save({ fs: e, gitdir: r, config: i }) {
    await e.write(`${r}/config`, i.toString(), {
      encoding: "utf8"
    });
  }
}
const Si = (t) => [
  `${t}`,
  `refs/${t}`,
  `refs/tags/${t}`,
  `refs/heads/${t}`,
  `refs/remotes/${t}`,
  `refs/remotes/${t}/HEAD`
], jl = ["config", "description", "index", "shallow", "commondir"];
let En;
async function er(t, e) {
  return En === void 0 && (En = new Xr()), En.acquire(t, e);
}
class ae {
  static async updateRemoteRefs({
    fs: e,
    gitdir: r,
    remote: i,
    refs: n,
    symrefs: a,
    tags: o,
    refspecs: s = void 0,
    prune: l = !1,
    pruneTags: f = !1
  }) {
    for (const T of n.values())
      if (!T.match(/[0-9a-f]{40}/))
        throw new ir(T);
    const u = await it.get({ fs: e, gitdir: r });
    if (!s) {
      if (s = await u.getall(`remote.${i}.fetch`), s.length === 0)
        throw new ei(i);
      s.unshift(`+HEAD:refs/remotes/${i}/HEAD`);
    }
    const m = sa.from(s), g = /* @__PURE__ */ new Map();
    if (f) {
      const T = await ae.listRefs({
        fs: e,
        gitdir: r,
        filepath: "refs/tags"
      });
      await ae.deleteRefs({
        fs: e,
        gitdir: r,
        refs: T.map((I) => `refs/tags/${I}`)
      });
    }
    if (o) {
      for (const T of n.keys())
        if (T.startsWith("refs/tags") && !T.endsWith("^{}") && !await ae.exists({ fs: e, gitdir: r, ref: T })) {
          const I = n.get(T);
          g.set(T, I);
        }
    }
    const y = m.translate([...n.keys()]);
    for (const [T, I] of y) {
      const R = n.get(T);
      g.set(I, R);
    }
    const E = m.translate([...a.keys()]);
    for (const [T, I] of E) {
      const R = a.get(T), D = m.translateOne(R);
      D && g.set(I, `ref: ${D}`);
    }
    const A = [];
    if (l) {
      for (const T of m.localNamespaces()) {
        const I = (await ae.listRefs({
          fs: e,
          gitdir: r,
          filepath: T
        })).map((R) => `${T}/${R}`);
        for (const R of I)
          g.has(R) || A.push(R);
      }
      A.length > 0 && await ae.deleteRefs({ fs: e, gitdir: r, refs: A });
    }
    for (const [T, I] of g)
      await er(
        T,
        async () => e.write(te.join(r, T), `${I.trim()}
`, "utf8")
      );
    return { pruned: A };
  }
  // TODO: make this less crude?
  static async writeRef({ fs: e, gitdir: r, ref: i, value: n }) {
    if (!n.match(/[0-9a-f]{40}/))
      throw new ir(n);
    await er(
      i,
      async () => e.write(te.join(r, i), `${n.trim()}
`, "utf8")
    );
  }
  static async writeSymbolicRef({ fs: e, gitdir: r, ref: i, value: n }) {
    await er(
      i,
      async () => e.write(te.join(r, i), `ref: ${n.trim()}
`, "utf8")
    );
  }
  static async deleteRef({ fs: e, gitdir: r, ref: i }) {
    return ae.deleteRefs({ fs: e, gitdir: r, refs: [i] });
  }
  static async deleteRefs({ fs: e, gitdir: r, refs: i }) {
    await Promise.all(i.map((s) => e.rm(te.join(r, s))));
    let n = await er(
      "packed-refs",
      async () => e.read(`${r}/packed-refs`, { encoding: "utf8" })
    );
    const a = Di.from(n), o = a.refs.size;
    for (const s of i)
      a.refs.has(s) && a.delete(s);
    a.refs.size < o && (n = a.toString(), await er(
      "packed-refs",
      async () => e.write(`${r}/packed-refs`, n, { encoding: "utf8" })
    ));
  }
  /**
   * @param {object} args
   * @param {import('../models/FileSystem.js').FileSystem} args.fs
   * @param {string} args.gitdir
   * @param {string} args.ref
   * @param {number} [args.depth]
   * @returns {Promise<string>}
   */
  static async resolve({ fs: e, gitdir: r, ref: i, depth: n = void 0 }) {
    if (n !== void 0 && (n--, n === -1))
      return i;
    if (i.startsWith("ref: "))
      return i = i.slice(5), ae.resolve({ fs: e, gitdir: r, ref: i, depth: n });
    if (i.length === 40 && /[0-9a-f]{40}/.test(i))
      return i;
    const a = await ae.packedRefs({ fs: e, gitdir: r }), o = Si(i).filter((s) => !jl.includes(s));
    for (const s of o) {
      const l = await er(
        s,
        async () => await e.read(`${r}/${s}`, { encoding: "utf8" }) || a.get(s)
      );
      if (l)
        return ae.resolve({ fs: e, gitdir: r, ref: l.trim(), depth: n });
    }
    throw new Le(i);
  }
  static async exists({ fs: e, gitdir: r, ref: i }) {
    try {
      return await ae.expand({ fs: e, gitdir: r, ref: i }), !0;
    } catch {
      return !1;
    }
  }
  static async expand({ fs: e, gitdir: r, ref: i }) {
    if (i.length === 40 && /[0-9a-f]{40}/.test(i))
      return i;
    const n = await ae.packedRefs({ fs: e, gitdir: r }), a = Si(i);
    for (const o of a)
      if (await er(
        o,
        async () => e.exists(`${r}/${o}`)
      ) || n.has(o)) return o;
    throw new Le(i);
  }
  static async expandAgainstMap({ ref: e, map: r }) {
    const i = Si(e);
    for (const n of i)
      if (await r.has(n)) return n;
    throw new Le(e);
  }
  static resolveAgainstMap({ ref: e, fullref: r = e, depth: i = void 0, map: n }) {
    if (i !== void 0 && (i--, i === -1))
      return { fullref: r, oid: e };
    if (e.startsWith("ref: "))
      return e = e.slice(5), ae.resolveAgainstMap({ ref: e, fullref: r, depth: i, map: n });
    if (e.length === 40 && /[0-9a-f]{40}/.test(e))
      return { fullref: r, oid: e };
    const a = Si(e);
    for (const o of a) {
      const s = n.get(o);
      if (s)
        return ae.resolveAgainstMap({
          ref: s.trim(),
          fullref: o,
          depth: i,
          map: n
        });
    }
    throw new Le(e);
  }
  static async packedRefs({ fs: e, gitdir: r }) {
    const i = await er(
      "packed-refs",
      async () => e.read(`${r}/packed-refs`, { encoding: "utf8" })
    );
    return Di.from(i).refs;
  }
  // List all the refs that match the `filepath` prefix
  static async listRefs({ fs: e, gitdir: r, filepath: i }) {
    const n = ae.packedRefs({ fs: e, gitdir: r });
    let a = null;
    try {
      a = await e.readdirDeep(`${r}/${i}`), a = a.map((o) => o.replace(`${r}/${i}/`, ""));
    } catch {
      a = [];
    }
    for (let o of (await n).keys())
      o.startsWith(i) && (o = o.replace(i + "/", ""), a.includes(o) || a.push(o));
    return a.sort($l), a;
  }
  static async listBranches({ fs: e, gitdir: r, remote: i }) {
    return i ? ae.listRefs({
      fs: e,
      gitdir: r,
      filepath: `refs/remotes/${i}`
    }) : ae.listRefs({ fs: e, gitdir: r, filepath: "refs/heads" });
  }
  static async listTags({ fs: e, gitdir: r }) {
    return (await ae.listRefs({
      fs: e,
      gitdir: r,
      filepath: "refs/tags"
    })).filter((n) => !n.endsWith("^{}"));
  }
}
function zl(t, e) {
  return ji(to(t), to(e));
}
function to(t) {
  return t.mode === "040000" ? t.path + "/" : t.path;
}
function ts(t) {
  switch (t) {
    case "040000":
      return "tree";
    case "100644":
      return "blob";
    case "100755":
      return "blob";
    case "120000":
      return "blob";
    case "160000":
      return "commit";
  }
  throw new Re(`Unexpected GitTree entry mode: ${t}`);
}
function Hl(t) {
  const e = [];
  let r = 0;
  for (; r < t.length; ) {
    const i = t.indexOf(32, r);
    if (i === -1)
      throw new Re(
        `GitTree: Error parsing buffer at byte location ${r}: Could not find the next space character.`
      );
    const n = t.indexOf(0, r);
    if (n === -1)
      throw new Re(
        `GitTree: Error parsing buffer at byte location ${r}: Could not find the next null character.`
      );
    let a = t.slice(r, i).toString("utf8");
    a === "40000" && (a = "040000");
    const o = ts(a), s = t.slice(i + 1, n).toString("utf8");
    if (s.includes("\\") || s.includes("/"))
      throw new Fr(s);
    const l = t.slice(n + 1, n + 21).toString("hex");
    r = n + 21, e.push({ mode: a, path: s, oid: l, type: o });
  }
  return e;
}
function Wl(t) {
  if (typeof t == "number" && (t = t.toString(8)), t.match(/^0?4.*/)) return "040000";
  if (t.match(/^1006.*/)) return "100644";
  if (t.match(/^1007.*/)) return "100755";
  if (t.match(/^120.*/)) return "120000";
  if (t.match(/^160.*/)) return "160000";
  throw new Re(`Could not understand file mode: ${t}`);
}
function ql(t) {
  return !t.oid && t.sha && (t.oid = t.sha), t.mode = Wl(t.mode), t.type || (t.type = ts(t.mode)), t;
}
class _t {
  constructor(e) {
    if (fe.isBuffer(e))
      this._entries = Hl(e);
    else if (Array.isArray(e))
      this._entries = e.map(ql);
    else
      throw new Re("invalid type passed to GitTree constructor");
    this._entries.sort(Ko);
  }
  static from(e) {
    return new _t(e);
  }
  render() {
    return this._entries.map((e) => `${e.mode} ${e.type} ${e.oid}    ${e.path}`).join(`
`);
  }
  toObject() {
    const e = [...this._entries];
    return e.sort(zl), fe.concat(
      e.map((r) => {
        const i = fe.from(r.mode.replace(/^0/, "")), n = fe.from(" "), a = fe.from(r.path, "utf8"), o = fe.from([0]), s = fe.from(r.oid, "hex");
        return fe.concat([i, n, a, o, s]);
      })
    );
  }
  /**
   * @returns {TreeEntry[]}
   */
  entries() {
    return this._entries;
  }
  *[Symbol.iterator]() {
    for (const e of this._entries)
      yield e;
  }
}
class Mr {
  static wrap({ type: e, object: r }) {
    return fe.concat([
      fe.from(`${e} ${r.byteLength.toString()}\0`),
      fe.from(r)
    ]);
  }
  static unwrap(e) {
    const r = e.indexOf(32), i = e.indexOf(0), n = e.slice(0, r).toString("utf8"), a = e.slice(r + 1, i).toString("utf8"), o = e.length - (i + 1);
    if (parseInt(a) !== o)
      throw new Re(
        `Length mismatch: expected ${a} bytes but got ${o} instead.`
      );
    return {
      type: n,
      object: fe.from(e.slice(i + 1))
    };
  }
}
async function rs({ fs: t, gitdir: e, oid: r }) {
  const i = `objects/${r.slice(0, 2)}/${r.slice(2)}`, n = await t.read(`${e}/${i}`);
  return n ? { object: n, format: "deflated", source: i } : null;
}
function Gl(t, e) {
  const r = new jt(t), i = ro(r);
  if (i !== e.byteLength)
    throw new Re(
      `applyDelta expected source buffer to be ${i} bytes but the provided buffer was ${e.length} bytes`
    );
  const n = ro(r);
  let a;
  const o = no(r, e);
  if (o.byteLength === n)
    a = o;
  else {
    a = fe.alloc(n);
    const s = new jt(a);
    for (s.copy(o); !r.eof(); )
      s.copy(no(r, e));
    const l = s.tell();
    if (n !== l)
      throw new Re(
        `applyDelta expected target buffer to be ${n} bytes but the resulting buffer was ${l} bytes`
      );
  }
  return a;
}
function ro(t) {
  let e = 0, r = 0, i = null;
  do
    i = t.readUInt8(), e |= (i & 127) << r, r += 7;
  while (i & 128);
  return e;
}
function io(t, e, r) {
  let i = 0, n = 0;
  for (; r--; )
    e & 1 && (i |= t.readUInt8() << n), e >>= 1, n += 8;
  return i;
}
function no(t, e) {
  const r = t.readUInt8(), i = 128, n = 15, a = 112;
  if (r & i) {
    const o = io(t, r & n, 4);
    let s = io(t, (r & a) >> 4, 3);
    return s === 0 && (s = 65536), e.slice(o, o + s);
  } else
    return t.slice(r);
}
function Zl(t) {
  let e = [t];
  return {
    next() {
      return Promise.resolve({ done: e.length === 0, value: e.pop() });
    },
    return() {
      return e = [], {};
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
function is(t) {
  return t[Symbol.asyncIterator] ? t[Symbol.asyncIterator]() : t[Symbol.iterator] ? t[Symbol.iterator]() : t.next ? t : Zl(t);
}
class ns {
  constructor(e) {
    if (typeof fe > "u")
      throw new Error("Missing Buffer dependency");
    this.stream = is(e), this.buffer = null, this.cursor = 0, this.undoCursor = 0, this.started = !1, this._ended = !1, this._discardedBytes = 0;
  }
  eof() {
    return this._ended && this.cursor === this.buffer.length;
  }
  tell() {
    return this._discardedBytes + this.cursor;
  }
  async byte() {
    if (!this.eof() && (this.started || await this._init(), !(this.cursor === this.buffer.length && (await this._loadnext(), this._ended))))
      return this._moveCursor(1), this.buffer[this.undoCursor];
  }
  async chunk() {
    if (!this.eof() && (this.started || await this._init(), !(this.cursor === this.buffer.length && (await this._loadnext(), this._ended))))
      return this._moveCursor(this.buffer.length), this.buffer.slice(this.undoCursor, this.cursor);
  }
  async read(e) {
    if (!this.eof())
      return this.started || await this._init(), this.cursor + e > this.buffer.length && (this._trim(), await this._accumulate(e)), this._moveCursor(e), this.buffer.slice(this.undoCursor, this.cursor);
  }
  async skip(e) {
    this.eof() || (this.started || await this._init(), this.cursor + e > this.buffer.length && (this._trim(), await this._accumulate(e)), this._moveCursor(e));
  }
  async undo() {
    this.cursor = this.undoCursor;
  }
  async _next() {
    this.started = !0;
    let { done: e, value: r } = await this.stream.next();
    return e && (this._ended = !0, !r) ? fe.alloc(0) : (r && (r = fe.from(r)), r);
  }
  _trim() {
    this.buffer = this.buffer.slice(this.undoCursor), this.cursor -= this.undoCursor, this._discardedBytes += this.undoCursor, this.undoCursor = 0;
  }
  _moveCursor(e) {
    this.undoCursor = this.cursor, this.cursor += e, this.cursor > this.buffer.length && (this.cursor = this.buffer.length);
  }
  async _accumulate(e) {
    if (this._ended) return;
    const r = [this.buffer];
    for (; this.cursor + e > Vl(r); ) {
      const i = await this._next();
      if (this._ended) break;
      r.push(i);
    }
    this.buffer = fe.concat(r);
  }
  async _loadnext() {
    this._discardedBytes += this.buffer.length, this.undoCursor = 0, this.cursor = 0, this.buffer = await this._next();
  }
  async _init() {
    this.buffer = await this._next();
  }
}
function Vl(t) {
  return t.reduce((e, r) => e + r.length, 0);
}
async function Xl(t, e) {
  const r = new ns(t);
  let i = await r.read(4);
  if (i = i.toString("utf8"), i !== "PACK")
    throw new Re(`Invalid PACK header '${i}'`);
  let n = await r.read(4);
  if (n = n.readUInt32BE(0), n !== 2)
    throw new Re(`Invalid packfile version: ${n}`);
  let a = await r.read(4);
  if (a = a.readUInt32BE(0), !(a < 1))
    for (; !r.eof() && a--; ) {
      const o = r.tell(), { type: s, length: l, ofs: f, reference: u } = await Yl(r), m = new oa.Inflate();
      for (; !m.result; ) {
        const g = await r.chunk();
        if (!g) break;
        if (m.push(g, !1), m.err)
          throw new Re(`Pako error: ${m.msg}`);
        if (m.result) {
          if (m.result.length !== l)
            throw new Re(
              "Inflated object size is different from that stated in packfile."
            );
          await r.undo(), await r.read(g.length - m.strm.avail_in);
          const y = r.tell();
          await e({
            data: m.result,
            type: s,
            num: a,
            offset: o,
            end: y,
            reference: u,
            ofs: f
          });
        }
      }
    }
}
async function Yl(t) {
  let e = await t.byte();
  const r = e >> 4 & 7;
  let i = e & 15;
  if (e & 128) {
    let o = 4;
    do
      e = await t.byte(), i |= (e & 127) << o, o += 7;
    while (e & 128);
  }
  let n, a;
  if (r === 6) {
    let o = 0;
    n = 0;
    const s = [];
    do
      e = await t.byte(), n |= (e & 127) << o, o += 7, s.push(e);
    while (e & 128);
    a = fe.from(s);
  }
  return r === 7 && (a = await t.read(20)), { type: r, length: i, ofs: n, reference: a };
}
async function as(t) {
  return oa.inflate(t);
}
function Kl(t) {
  const e = [];
  let r = 0, i = 0;
  do {
    r = t.readUInt8();
    const n = r & 127;
    e.push(n), i = r & 128;
  } while (i);
  return e.reduce((n, a) => n + 1 << 7 | a, -1);
}
function Jl(t, e) {
  let r = e, i = 4, n = null;
  do
    n = t.readUInt8(), r |= (n & 127) << i, i += 7;
  while (n & 128);
  return r;
}
class Tr {
  constructor(e) {
    Object.assign(this, e), this.offsetCache = {};
  }
  static async fromIdx({ idx: e, getExternalRefDelta: r }) {
    const i = new jt(e);
    if (i.slice(4).toString("hex") !== "ff744f63")
      return;
    const a = i.readUInt32BE();
    if (a !== 2)
      throw new Re(
        `Unable to read version ${a} packfile IDX. (Only version 2 supported)`
      );
    if (e.byteLength > 2048 * 1024 * 1024)
      throw new Re(
        "To keep implementation simple, I haven't implemented the layer 5 feature needed to support packfiles > 2GB in size."
      );
    i.seek(i.tell() + 4 * 255);
    const o = i.readUInt32BE(), s = [];
    for (let u = 0; u < o; u++) {
      const m = i.slice(20).toString("hex");
      s[u] = m;
    }
    i.seek(i.tell() + 4 * o);
    const l = /* @__PURE__ */ new Map();
    for (let u = 0; u < o; u++)
      l.set(s[u], i.readUInt32BE());
    const f = i.slice(20).toString("hex");
    return new Tr({
      hashes: s,
      crcs: {},
      offsets: l,
      packfileSha: f,
      getExternalRefDelta: r
    });
  }
  static async fromPack({ pack: e, getExternalRefDelta: r, onProgress: i }) {
    const n = {
      1: "commit",
      2: "tree",
      3: "blob",
      4: "tag",
      6: "ofs-delta",
      7: "ref-delta"
    }, a = {}, o = e.slice(-20).toString("hex"), s = [], l = {}, f = /* @__PURE__ */ new Map();
    let u = null, m = null;
    await Xl([e], async ({ data: T, type: I, reference: R, offset: D, num: L }) => {
      u === null && (u = L);
      const U = Math.floor(
        (u - L) * 100 / u
      );
      U !== m && i && await i({
        phase: "Receiving objects",
        loaded: u - L,
        total: u
      }), m = U, I = n[I], ["commit", "tree", "blob", "tag"].includes(I) ? a[D] = {
        type: I,
        offset: D
      } : I === "ofs-delta" ? a[D] = {
        type: I,
        offset: D
      } : I === "ref-delta" && (a[D] = {
        type: I,
        offset: D
      });
    });
    const g = Object.keys(a).map(Number);
    for (const [T, I] of g.entries()) {
      const R = T + 1 === g.length ? e.byteLength - 20 : g[T + 1], D = a[I], L = Kc.buf(e.slice(I, R)) >>> 0;
      D.end = R, D.crc = L;
    }
    const y = new Tr({
      pack: Promise.resolve(e),
      packfileSha: o,
      crcs: l,
      hashes: s,
      offsets: f,
      getExternalRefDelta: r
    });
    m = null;
    let E = 0;
    const A = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let T in a) {
      T = Number(T);
      const I = Math.floor(E * 100 / u);
      I !== m && i && await i({
        phase: "Resolving deltas",
        loaded: E,
        total: u
      }), E++, m = I;
      const R = a[T];
      if (!R.oid)
        try {
          y.readDepth = 0, y.externalReadDepth = 0;
          const { type: D, object: L } = await y.readSlice({ start: T });
          A[y.readDepth] += 1;
          const U = await Yt(Mr.wrap({ type: D, object: L }));
          R.oid = U, s.push(U), f.set(U, T), l[U] = R.crc;
        } catch {
          continue;
        }
    }
    return s.sort(), y;
  }
  async toBuffer() {
    const e = [], r = (f, u) => {
      e.push(fe.from(f, u));
    };
    r("ff744f63", "hex"), r("00000002", "hex");
    const i = new jt(fe.alloc(256 * 4));
    for (let f = 0; f < 256; f++) {
      let u = 0;
      for (const m of this.hashes)
        parseInt(m.slice(0, 2), 16) <= f && u++;
      i.writeUInt32BE(u);
    }
    e.push(i.buffer);
    for (const f of this.hashes)
      r(f, "hex");
    const n = new jt(fe.alloc(this.hashes.length * 4));
    for (const f of this.hashes)
      n.writeUInt32BE(this.crcs[f]);
    e.push(n.buffer);
    const a = new jt(fe.alloc(this.hashes.length * 4));
    for (const f of this.hashes)
      a.writeUInt32BE(this.offsets.get(f));
    e.push(a.buffer), r(this.packfileSha, "hex");
    const o = fe.concat(e), s = await Yt(o), l = fe.alloc(20);
    return l.write(s, "hex"), fe.concat([o, l]);
  }
  async load({ pack: e }) {
    this.pack = e;
  }
  async unload() {
    this.pack = null;
  }
  async read({ oid: e }) {
    if (!this.offsets.get(e)) {
      if (this.getExternalRefDelta)
        return this.externalReadDepth++, this.getExternalRefDelta(e);
      throw new Re(`Could not read object ${e} from packfile`);
    }
    const r = this.offsets.get(e);
    return this.readSlice({ start: r });
  }
  async readSlice({ start: e }) {
    if (this.offsetCache[e])
      return Object.assign({}, this.offsetCache[e]);
    this.readDepth++;
    const r = {
      16: "commit",
      32: "tree",
      48: "blob",
      64: "tag",
      96: "ofs_delta",
      112: "ref_delta"
    };
    if (!this.pack)
      throw new Re(
        "Tried to read from a GitPackIndex with no packfile loaded into memory"
      );
    const i = (await this.pack).slice(e), n = new jt(i), a = n.readUInt8(), o = a & 112;
    let s = r[o];
    if (s === void 0)
      throw new Re("Unrecognized type: 0b" + o.toString(2));
    const l = a & 15;
    let f = l;
    a & 128 && (f = Jl(n, l));
    let m = null, g = null;
    if (s === "ofs_delta") {
      const E = Kl(n), A = e - E;
      ({ object: m, type: s } = await this.readSlice({ start: A }));
    }
    if (s === "ref_delta") {
      const E = n.slice(20).toString("hex");
      ({ object: m, type: s } = await this.read({ oid: E }));
    }
    const y = i.slice(n.tell());
    if (g = fe.from(await as(y)), g.byteLength !== f)
      throw new Re(
        `Packfile told us object would have length ${f} but it had length ${g.byteLength}`
      );
    return m && (g = fe.from(Gl(g, m))), this.readDepth > 3 && (this.offsetCache[e] = { type: s, object: g }), { type: s, format: "content", object: g };
  }
}
const xi = Symbol("PackfileCache");
async function Ql({
  fs: t,
  filename: e,
  getExternalRefDelta: r,
  emitter: i,
  emitterPrefix: n
}) {
  const a = await t.read(e);
  return Tr.fromIdx({ idx: a, getExternalRefDelta: r });
}
function la({
  fs: t,
  cache: e,
  filename: r,
  getExternalRefDelta: i,
  emitter: n,
  emitterPrefix: a
}) {
  e[xi] || (e[xi] = /* @__PURE__ */ new Map());
  let o = e[xi].get(r);
  return o || (o = Ql({
    fs: t,
    filename: r,
    getExternalRefDelta: i,
    emitter: n,
    emitterPrefix: a
  }), e[xi].set(r, o)), o;
}
async function eu({
  fs: t,
  cache: e,
  gitdir: r,
  oid: i,
  format: n = "content",
  getExternalRefDelta: a
}) {
  let o = await t.readdir(te.join(r, "objects/pack"));
  o = o.filter((s) => s.endsWith(".idx"));
  for (const s of o) {
    const l = `${r}/objects/pack/${s}`, f = await la({
      fs: t,
      cache: e,
      filename: l,
      getExternalRefDelta: a
    });
    if (f.error) throw new Re(f.error);
    if (f.offsets.has(i)) {
      if (!f.pack) {
        const m = l.replace(/idx$/, "pack");
        f.pack = t.read(m);
      }
      const u = await f.read({ oid: i, getExternalRefDelta: a });
      return u.format = "content", u.source = `objects/pack/${s.replace(/idx$/, "pack")}`, u;
    }
  }
  return null;
}
async function Je({
  fs: t,
  cache: e,
  gitdir: r,
  oid: i,
  format: n = "content"
}) {
  const a = (u) => Je({ fs: t, cache: e, gitdir: r, oid: u });
  let o;
  if (i === "4b825dc642cb6eb9a060e54bf8d69288fbee4904" && (o = { format: "wrapped", object: fe.from("tree 0\0") }), o || (o = await rs({ fs: t, gitdir: r, oid: i })), !o) {
    if (o = await eu({
      fs: t,
      cache: e,
      gitdir: r,
      oid: i,
      getExternalRefDelta: a
    }), !o)
      throw new Le(i);
    return o;
  }
  if (n === "deflated" || (o.format === "deflated" && (o.object = fe.from(await as(o.object)), o.format = "wrapped"), n === "wrapped"))
    return o;
  const s = await Yt(o.object);
  if (s !== i)
    throw new Re(
      `SHA check failed! Expected ${i}, computed ${s}`
    );
  const { object: l, type: f } = Mr.unwrap(o.object);
  if (o.type = f, o.object = l, o.format = "content", n === "content")
    return o;
  throw new Re(`invalid requested format "${n}"`);
}
class Ft extends Fe {
  /**
   * @param {'note'|'remote'|'tag'|'branch'} noun
   * @param {string} where
   * @param {boolean} canForce
   */
  constructor(e, r, i = !0) {
    super(
      `Failed to create ${e} at ${r} because it already exists.${i ? ` (Hint: use 'force: true' parameter to overwrite existing ${e}.)` : ""}`
    ), this.code = this.name = Ft.code, this.data = { noun: e, where: r, canForce: i };
  }
}
Ft.code = "AlreadyExistsError";
class ti extends Fe {
  /**
   * @param {'oids'|'refs'} nouns
   * @param {string} short
   * @param {string[]} matches
   */
  constructor(e, r, i) {
    super(
      `Found multiple ${e} matching "${r}" (${i.join(
        ", "
      )}). Use a longer abbreviation length to disambiguate them.`
    ), this.code = this.name = ti.code, this.data = { nouns: e, short: r, matches: i };
  }
}
ti.code = "AmbiguousError";
class ri extends Fe {
  /**
   * @param {string[]} filepaths
   */
  constructor(e) {
    super(
      `Your local changes to the following files would be overwritten by checkout: ${e.join(
        ", "
      )}`
    ), this.code = this.name = ri.code, this.data = { filepaths: e };
  }
}
ri.code = "CheckoutConflictError";
class ii extends Fe {
  /**
   * @param {string} ref
   * @param {string} oid
   */
  constructor(e, r) {
    super(
      `Failed to checkout "${e}" because commit ${r} is not available locally. Do a git fetch to make the branch available locally.`
    ), this.code = this.name = ii.code, this.data = { ref: e, oid: r };
  }
}
ii.code = "CommitNotFetchedError";
class ni extends Fe {
  constructor() {
    super("Empty response from git server."), this.code = this.name = ni.code, this.data = {};
  }
}
ni.code = "EmptyServerResponseError";
class ai extends Fe {
  constructor() {
    super("A simple fast-forward merge was not possible."), this.code = this.name = ai.code, this.data = {};
  }
}
ai.code = "FastForwardError";
class oi extends Fe {
  /**
   * @param {string} prettyDetails
   * @param {PushResult} result
   */
  constructor(e, r) {
    super(`One or more branches were not updated: ${e}`), this.code = this.name = oi.code, this.data = { prettyDetails: e, result: r };
  }
}
oi.code = "GitPushError";
class $r extends Fe {
  /**
   * @param {number} statusCode
   * @param {string} statusMessage
   * @param {string} response
   */
  constructor(e, r, i) {
    super(`HTTP Error: ${e} ${r}`), this.code = this.name = $r.code, this.data = { statusCode: e, statusMessage: r, response: i };
  }
}
$r.code = "HttpError";
class nr extends Fe {
  /**
   * @param {'leading-slash'|'trailing-slash'|'directory'} [reason]
   */
  constructor(e) {
    let r = "invalid filepath";
    e === "leading-slash" || e === "trailing-slash" ? r = '"filepath" parameter should not include leading or trailing directory separators because these can cause problems on some platforms.' : e === "directory" && (r = '"filepath" should not be a directory.'), super(r), this.code = this.name = nr.code, this.data = { reason: e };
  }
}
nr.code = "InvalidFilepathError";
class Ct extends Fe {
  /**
   * @param {string} ref
   * @param {string} suggestion
   * @param {boolean} canForce
   */
  constructor(e, r) {
    super(
      `"${e}" would be an invalid git reference. (Hint: a valid alternative would be "${r}".)`
    ), this.code = this.name = Ct.code, this.data = { ref: e, suggestion: r };
  }
}
Ct.code = "InvalidRefNameError";
class si extends Fe {
  /**
   * @param {number} depth
   */
  constructor(e) {
    super(`Maximum search depth of ${e} exceeded.`), this.code = this.name = si.code, this.data = { depth: e };
  }
}
si.code = "MaxDepthError";
class Ur extends Fe {
  constructor() {
    super("Merges with conflicts are not supported yet."), this.code = this.name = Ur.code, this.data = {};
  }
}
Ur.code = "MergeNotSupportedError";
class Pr extends Fe {
  /**
   * @param {Array<string>} filepaths
   * @param {Array<string>} bothModified
   * @param {Array<string>} deleteByUs
   * @param {Array<string>} deleteByTheirs
   */
  constructor(e, r, i, n) {
    super(
      `Automatic merge failed with one or more merge conflicts in the following files: ${e.toString()}. Fix conflicts then commit the result.`
    ), this.code = this.name = Pr.code, this.data = { filepaths: e, bothModified: r, deleteByUs: i, deleteByTheirs: n };
  }
}
Pr.code = "MergeConflictError";
class ft extends Fe {
  /**
   * @param {'author'|'committer'|'tagger'} role
   */
  constructor(e) {
    super(
      `No name was provided for ${e} in the argument or in the .git/config file.`
    ), this.code = this.name = ft.code, this.data = { role: e };
  }
}
ft.code = "MissingNameError";
class yt extends Fe {
  /**
   * @param {string} parameter
   */
  constructor(e) {
    super(
      `The function requires a "${e}" parameter but none was provided.`
    ), this.code = this.name = yt.code, this.data = { parameter: e };
  }
}
yt.code = "MissingParameterError";
class ci extends Fe {
  /**
   * @param {Error[]} errors
   * @param {string} message
   */
  constructor(e) {
    super(
      'There are multiple errors that were thrown by the method. Please refer to the "errors" property to see more'
    ), this.code = this.name = ci.code, this.data = { errors: e }, this.errors = e;
  }
}
ci.code = "MultipleGitError";
class _r extends Fe {
  /**
   * @param {string} expected
   * @param {string} actual
   */
  constructor(e, r) {
    super(`Expected "${e}" but received "${r}".`), this.code = this.name = _r.code, this.data = { expected: e, actual: r };
  }
}
_r.code = "ParseError";
class Br extends Fe {
  /**
   * @param {'not-fast-forward'|'tag-exists'} reason
   */
  constructor(e) {
    let r = "";
    e === "not-fast-forward" ? r = " because it was not a simple fast-forward" : e === "tag-exists" && (r = " because tag already exists"), super(`Push rejected${r}. Use "force: true" to override.`), this.code = this.name = Br.code, this.data = { reason: e };
  }
}
Br.code = "PushRejectedError";
class rr extends Fe {
  /**
   * @param {'shallow'|'deepen-since'|'deepen-not'|'deepen-relative'} capability
   * @param {'depth'|'since'|'exclude'|'relative'} parameter
   */
  constructor(e, r) {
    super(
      `Remote does not support the "${e}" so the "${r}" parameter cannot be used.`
    ), this.code = this.name = rr.code, this.data = { capability: e, parameter: r };
  }
}
rr.code = "RemoteCapabilityError";
class li extends Fe {
  /**
   * @param {string} preview
   * @param {string} response
   */
  constructor(e, r) {
    super(
      `Remote did not reply using the "smart" HTTP protocol. Expected "001e# service=git-upload-pack" but received: ${e}`
    ), this.code = this.name = li.code, this.data = { preview: e, response: r };
  }
}
li.code = "SmartHttpError";
class ui extends Fe {
  /**
   * @param {string} url
   * @param {string} transport
   * @param {string} [suggestion]
   */
  constructor(e, r, i) {
    super(
      `Git remote "${e}" uses an unrecognized transport protocol: "${r}"`
    ), this.code = this.name = ui.code, this.data = { url: e, transport: r, suggestion: i };
  }
}
ui.code = "UnknownTransportError";
class fi extends Fe {
  /**
   * @param {string} url
   */
  constructor(e) {
    super(`Cannot parse remote URL: "${e}"`), this.code = this.name = fi.code, this.data = { url: e };
  }
}
fi.code = "UrlParseError";
class Lr extends Fe {
  constructor() {
    super("The operation was canceled."), this.code = this.name = Lr.code, this.data = {};
  }
}
Lr.code = "UserCanceledError";
class hi extends Fe {
  /**
   * @param {Array<string>} filepaths
   */
  constructor(e) {
    super(
      `Could not merge index: Entry for '${e}' is not up to date. Either reset the index entry to HEAD, or stage your unstaged changes.`
    ), this.code = this.name = hi.code, this.data = { filepath: e };
  }
}
hi.code = "IndexResetError";
class di extends Fe {
  /**
   * @param {string} ref
   */
  constructor(e) {
    super(
      `"${e}" does not point to any commit. You're maybe working on a repository with no commits yet. `
    ), this.code = this.name = di.code, this.data = { ref: e };
  }
}
di.code = "NoCommitError";
var tu = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  AlreadyExistsError: Ft,
  AmbiguousError: ti,
  CheckoutConflictError: ri,
  CommitNotFetchedError: ii,
  EmptyServerResponseError: ni,
  FastForwardError: ai,
  GitPushError: oi,
  HttpError: $r,
  InternalError: Re,
  InvalidFilepathError: nr,
  InvalidOidError: ir,
  InvalidRefNameError: Ct,
  MaxDepthError: si,
  MergeNotSupportedError: Ur,
  MergeConflictError: Pr,
  MissingNameError: ft,
  MissingParameterError: yt,
  MultipleGitError: ci,
  NoRefspecError: ei,
  NotFoundError: Le,
  ObjectTypeError: pt,
  ParseError: _r,
  PushRejectedError: Br,
  RemoteCapabilityError: rr,
  SmartHttpError: li,
  UnknownTransportError: ui,
  UnsafeFilepathError: Fr,
  UrlParseError: fi,
  UserCanceledError: Lr,
  UnmergedPathsError: Qr,
  IndexResetError: hi,
  NoCommitError: di
});
function Yn({ name: t, email: e, timestamp: r, timezoneOffset: i }) {
  return i = ru(i), `${t} <${e}> ${r} ${i}`;
}
function ru(t) {
  const e = iu(nu(t));
  t = Math.abs(t);
  const r = Math.floor(t / 60);
  t -= r * 60;
  let i = String(r), n = String(t);
  return i.length < 2 && (i = "0" + i), n.length < 2 && (n = "0" + n), (e === -1 ? "-" : "+") + i + n;
}
function iu(t) {
  return Math.sign(t) || (Object.is(t, -0) ? -1 : 1);
}
function nu(t) {
  return t === 0 ? t : -t;
}
function Zt(t) {
  return t = t.replace(/\r/g, ""), t = t.replace(/^\n+/, ""), t = t.replace(/\n+$/, "") + `
`, t;
}
function Ci(t) {
  const [, e, r, i, n] = t.match(
    /^(.*) <(.*)> (.*) (.*)$/
  );
  return {
    name: e,
    email: r,
    timestamp: Number(i),
    timezoneOffset: au(n)
  };
}
function au(t) {
  let [, e, r, i] = t.match(/(\+|-)(\d\d)(\d\d)/);
  return i = (e === "+" ? 1 : -1) * (Number(r) * 60 + Number(i)), ou(i);
}
function ou(t) {
  return t === 0 ? t : -t;
}
class wt {
  constructor(e) {
    if (typeof e == "string")
      this._tag = e;
    else if (fe.isBuffer(e))
      this._tag = e.toString("utf8");
    else if (typeof e == "object")
      this._tag = wt.render(e);
    else
      throw new Re(
        "invalid type passed to GitAnnotatedTag constructor"
      );
  }
  static from(e) {
    return new wt(e);
  }
  static render(e) {
    return `object ${e.object}
type ${e.type}
tag ${e.tag}
tagger ${Yn(e.tagger)}

${e.message}
${e.gpgsig ? e.gpgsig : ""}`;
  }
  justHeaders() {
    return this._tag.slice(0, this._tag.indexOf(`

`));
  }
  message() {
    const e = this.withoutSignature();
    return e.slice(e.indexOf(`

`) + 2);
  }
  parse() {
    return Object.assign(this.headers(), {
      message: this.message(),
      gpgsig: this.gpgsig()
    });
  }
  render() {
    return this._tag;
  }
  headers() {
    const e = this.justHeaders().split(`
`), r = [];
    for (const n of e)
      n[0] === " " ? r[r.length - 1] += `
` + n.slice(1) : r.push(n);
    const i = {};
    for (const n of r) {
      const a = n.slice(0, n.indexOf(" ")), o = n.slice(n.indexOf(" ") + 1);
      Array.isArray(i[a]) ? i[a].push(o) : i[a] = o;
    }
    return i.tagger && (i.tagger = Ci(i.tagger)), i.committer && (i.committer = Ci(i.committer)), i;
  }
  withoutSignature() {
    const e = Zt(this._tag);
    return e.indexOf(`
-----BEGIN PGP SIGNATURE-----`) === -1 ? e : e.slice(0, e.lastIndexOf(`
-----BEGIN PGP SIGNATURE-----`));
  }
  gpgsig() {
    if (this._tag.indexOf(`
-----BEGIN PGP SIGNATURE-----`) === -1) return;
    const e = this._tag.slice(
      this._tag.indexOf("-----BEGIN PGP SIGNATURE-----"),
      this._tag.indexOf("-----END PGP SIGNATURE-----") + 27
    );
    return Zt(e);
  }
  payload() {
    return this.withoutSignature() + `
`;
  }
  toObject() {
    return fe.from(this._tag, "utf8");
  }
  static async sign(e, r, i) {
    const n = e.payload();
    let { signature: a } = await r({ payload: n, secretKey: i });
    a = Zt(a);
    const o = n + a;
    return wt.from(o);
  }
}
function kn(t) {
  return t.trim().split(`
`).map((e) => " " + e).join(`
`) + `
`;
}
function su(t) {
  return t.split(`
`).map((e) => e.replace(/^ /, "")).join(`
`);
}
class Ye {
  constructor(e) {
    if (typeof e == "string")
      this._commit = e;
    else if (fe.isBuffer(e))
      this._commit = e.toString("utf8");
    else if (typeof e == "object")
      this._commit = Ye.render(e);
    else
      throw new Re("invalid type passed to GitCommit constructor");
  }
  static fromPayloadSignature({ payload: e, signature: r }) {
    const i = Ye.justHeaders(e), n = Ye.justMessage(e), a = Zt(
      i + `
gpgsig` + kn(r) + `
` + n
    );
    return new Ye(a);
  }
  static from(e) {
    return new Ye(e);
  }
  toObject() {
    return fe.from(this._commit, "utf8");
  }
  // Todo: allow setting the headers and message
  headers() {
    return this.parseHeaders();
  }
  // Todo: allow setting the headers and message
  message() {
    return Ye.justMessage(this._commit);
  }
  parse() {
    return Object.assign({ message: this.message() }, this.headers());
  }
  static justMessage(e) {
    return Zt(e.slice(e.indexOf(`

`) + 2));
  }
  static justHeaders(e) {
    return e.slice(0, e.indexOf(`

`));
  }
  parseHeaders() {
    const e = Ye.justHeaders(this._commit).split(`
`), r = [];
    for (const n of e)
      n[0] === " " ? r[r.length - 1] += `
` + n.slice(1) : r.push(n);
    const i = {
      parent: []
    };
    for (const n of r) {
      const a = n.slice(0, n.indexOf(" ")), o = n.slice(n.indexOf(" ") + 1);
      Array.isArray(i[a]) ? i[a].push(o) : i[a] = o;
    }
    return i.author && (i.author = Ci(i.author)), i.committer && (i.committer = Ci(i.committer)), i;
  }
  static renderHeaders(e) {
    let r = "";
    if (e.tree ? r += `tree ${e.tree}
` : r += `tree 4b825dc642cb6eb9a060e54bf8d69288fbee4904
`, e.parent) {
      if (e.parent.length === void 0)
        throw new Re("commit 'parent' property should be an array");
      for (const a of e.parent)
        r += `parent ${a}
`;
    }
    const i = e.author;
    r += `author ${Yn(i)}
`;
    const n = e.committer || e.author;
    return r += `committer ${Yn(n)}
`, e.gpgsig && (r += "gpgsig" + kn(e.gpgsig)), r;
  }
  static render(e) {
    return Ye.renderHeaders(e) + `
` + Zt(e.message);
  }
  render() {
    return this._commit;
  }
  withoutSignature() {
    const e = Zt(this._commit);
    if (e.indexOf(`
gpgsig`) === -1) return e;
    const r = e.slice(0, e.indexOf(`
gpgsig`)), i = e.slice(
      e.indexOf(`-----END PGP SIGNATURE-----
`) + 28
    );
    return Zt(r + `
` + i);
  }
  isolateSignature() {
    const e = this._commit.slice(
      this._commit.indexOf("-----BEGIN PGP SIGNATURE-----"),
      this._commit.indexOf("-----END PGP SIGNATURE-----") + 27
    );
    return su(e);
  }
  static async sign(e, r, i) {
    const n = e.withoutSignature(), a = Ye.justMessage(e._commit);
    let { signature: o } = await r({ payload: n, secretKey: i });
    o = Zt(o);
    const l = Ye.justHeaders(e._commit) + `
gpgsig` + kn(o) + `
` + a;
    return Ye.from(l);
  }
}
async function Ar({ fs: t, cache: e, gitdir: r, oid: i }) {
  if (i === "4b825dc642cb6eb9a060e54bf8d69288fbee4904")
    return { tree: _t.from([]), oid: i };
  const { type: n, object: a } = await Je({ fs: t, cache: e, gitdir: r, oid: i });
  if (n === "tag")
    return i = wt.from(a).parse().object, Ar({ fs: t, cache: e, gitdir: r, oid: i });
  if (n === "commit")
    return i = Ye.from(a).parse().tree, Ar({ fs: t, cache: e, gitdir: r, oid: i });
  if (n !== "tree")
    throw new pt(i, n, "tree");
  return { tree: _t.from(a), oid: i };
}
class cu {
  constructor({ fs: e, gitdir: r, ref: i, cache: n }) {
    this.fs = e, this.cache = n, this.gitdir = r, this.mapPromise = (async () => {
      const o = /* @__PURE__ */ new Map();
      let s;
      try {
        s = await ae.resolve({ fs: e, gitdir: r, ref: i });
      } catch (f) {
        f instanceof Le && (s = "4b825dc642cb6eb9a060e54bf8d69288fbee4904");
      }
      const l = await Ar({ fs: e, cache: this.cache, gitdir: r, oid: s });
      return l.type = "tree", l.mode = "40000", o.set(".", l), o;
    })();
    const a = this;
    this.ConstructEntry = class {
      constructor(s) {
        this._fullpath = s, this._type = !1, this._mode = !1, this._stat = !1, this._content = !1, this._oid = !1;
      }
      async type() {
        return a.type(this);
      }
      async mode() {
        return a.mode(this);
      }
      async stat() {
        return a.stat(this);
      }
      async content() {
        return a.content(this);
      }
      async oid() {
        return a.oid(this);
      }
    };
  }
  async readdir(e) {
    const r = e._fullpath, { fs: i, cache: n, gitdir: a } = this, o = await this.mapPromise, s = o.get(r);
    if (!s) throw new Error(`No obj for ${r}`);
    const l = s.oid;
    if (!l) throw new Error(`No oid for obj ${JSON.stringify(s)}`);
    if (s.type !== "tree")
      return null;
    const { type: f, object: u } = await Je({ fs: i, cache: n, gitdir: a, oid: l });
    if (f !== s.type)
      throw new pt(l, f, s.type);
    const m = _t.from(u);
    for (const g of m)
      o.set(te.join(r, g.path), g);
    return m.entries().map((g) => te.join(r, g.path));
  }
  async type(e) {
    if (e._type === !1) {
      const r = await this.mapPromise, { type: i } = r.get(e._fullpath);
      e._type = i;
    }
    return e._type;
  }
  async mode(e) {
    if (e._mode === !1) {
      const r = await this.mapPromise, { mode: i } = r.get(e._fullpath);
      e._mode = Jo(parseInt(i, 8));
    }
    return e._mode;
  }
  async stat(e) {
  }
  async content(e) {
    if (e._content === !1) {
      const r = await this.mapPromise, { fs: i, cache: n, gitdir: a } = this, s = r.get(e._fullpath).oid, { type: l, object: f } = await Je({ fs: i, cache: n, gitdir: a, oid: s });
      l !== "blob" ? e._content = void 0 : e._content = new Uint8Array(f);
    }
    return e._content;
  }
  async oid(e) {
    if (e._oid === !1) {
      const i = (await this.mapPromise).get(e._fullpath);
      e._oid = i.oid;
    }
    return e._oid;
  }
}
function $t({ ref: t = "HEAD" } = {}) {
  const e = /* @__PURE__ */ Object.create(null);
  return Object.defineProperty(e, zi, {
    value: function({ fs: r, gitdir: i, cache: n }) {
      return new cu({ fs: r, gitdir: i, ref: t, cache: n });
    }
  }), Object.freeze(e), e;
}
class lu {
  constructor({ fs: e, dir: r, gitdir: i, cache: n }) {
    this.fs = e, this.cache = n, this.dir = r, this.gitdir = i, this.config = null;
    const a = this;
    this.ConstructEntry = class {
      constructor(s) {
        this._fullpath = s, this._type = !1, this._mode = !1, this._stat = !1, this._content = !1, this._oid = !1;
      }
      async type() {
        return a.type(this);
      }
      async mode() {
        return a.mode(this);
      }
      async stat() {
        return a.stat(this);
      }
      async content() {
        return a.content(this);
      }
      async oid() {
        return a.oid(this);
      }
    };
  }
  async readdir(e) {
    const r = e._fullpath, { fs: i, dir: n } = this, a = await i.readdir(te.join(n, r));
    return a === null ? null : a.map((o) => te.join(r, o));
  }
  async type(e) {
    return e._type === !1 && await e.stat(), e._type;
  }
  async mode(e) {
    return e._mode === !1 && await e.stat(), e._mode;
  }
  async stat(e) {
    if (e._stat === !1) {
      const { fs: r, dir: i } = this;
      let n = await r.lstat(`${i}/${e._fullpath}`);
      if (!n)
        throw new Error(
          `ENOENT: no such file or directory, lstat '${e._fullpath}'`
        );
      let a = n.isDirectory() ? "tree" : "blob";
      a === "blob" && !n.isFile() && !n.isSymbolicLink() && (a = "special"), e._type = a, n = Ir(n), e._mode = n.mode, n.size === -1 && e._actualSize && (n.size = e._actualSize), e._stat = n;
    }
    return e._stat;
  }
  async content(e) {
    if (e._content === !1) {
      const { fs: r, dir: i, gitdir: n } = this;
      if (await e.type() === "tree")
        e._content = void 0;
      else {
        const o = await (await this._getGitConfig(r, n)).get("core.autocrlf"), s = await r.read(`${i}/${e._fullpath}`, { autocrlf: o });
        e._actualSize = s.length, e._stat && e._stat.size === -1 && (e._stat.size = e._actualSize), e._content = new Uint8Array(s);
      }
    }
    return e._content;
  }
  async oid(e) {
    if (e._oid === !1) {
      const r = this, { fs: i, gitdir: n, cache: a } = this;
      let o;
      await ot.acquire({ fs: i, gitdir: n, cache: a }, async function(s) {
        const l = s.entriesMap.get(e._fullpath), f = await e.stat(), m = await (await r._getGitConfig(i, n)).get("core.filemode"), g = typeof gt < "u" ? gt.platform !== "win32" : !0;
        if (!l || Bi(f, l, m, g)) {
          const y = await e.content();
          y === void 0 ? o = void 0 : (o = await Yt(
            Mr.wrap({ type: "blob", object: y })
          ), l && o === l.oid && (!m || f.mode === l.mode) && Bi(f, l, m, g) && s.insert({
            filepath: e._fullpath,
            stats: f,
            oid: o
          }));
        } else
          o = l.oid;
      }), e._oid = o;
    }
    return e._oid;
  }
  async _getGitConfig(e, r) {
    return this.config ? this.config : (this.config = await it.get({ fs: e, gitdir: r }), this.config);
  }
}
function wi() {
  const t = /* @__PURE__ */ Object.create(null);
  return Object.defineProperty(t, zi, {
    value: function({ fs: e, dir: r, gitdir: i, cache: n }) {
      return new lu({ fs: e, dir: r, gitdir: i, cache: n });
    }
  }), Object.freeze(t), t;
}
function uu(t, e) {
  const r = e - t;
  return Array.from({ length: r }, (i, n) => t + n);
}
const os = typeof Array.prototype.flat > "u" ? (t) => t.reduce((e, r) => e.concat(r), []) : (t) => t.flat();
class fu {
  constructor() {
    this.value = null;
  }
  consider(e) {
    e != null && (this.value === null ? this.value = e : e < this.value && (this.value = e));
  }
  reset() {
    this.value = null;
  }
}
function* hu(t) {
  const e = new fu();
  let r;
  const i = [], n = t.length;
  for (let a = 0; a < n; a++)
    i[a] = t[a].next().value, i[a] !== void 0 && e.consider(i[a]);
  if (e.value !== null)
    for (; ; ) {
      const a = [];
      r = e.value, e.reset();
      for (let o = 0; o < n; o++)
        i[o] !== void 0 && i[o] === r ? (a[o] = i[o], i[o] = t[o].next().value) : a[o] = null, i[o] !== void 0 && e.consider(i[o]);
      if (yield a, e.value === null) return;
    }
}
async function ar({
  fs: t,
  cache: e,
  dir: r,
  gitdir: i,
  trees: n,
  // @ts-ignore
  map: a = async (l, f) => f,
  // The default reducer is a flatmap that filters out undefineds.
  reduce: o = async (l, f) => {
    const u = os(f);
    return l !== void 0 && u.unshift(l), u;
  },
  // The default iterate function walks all children concurrently
  iterate: s = (l, f) => Promise.all([...f].map(l))
}) {
  const l = n.map(
    (y) => y[zi]({ fs: t, dir: r, gitdir: i, cache: e })
  ), f = new Array(l.length).fill("."), u = uu(0, l.length), m = async (y) => {
    u.map((T) => {
      const I = y[T];
      y[T] = I && new l[T].ConstructEntry(I);
    });
    const A = (await Promise.all(
      u.map((T) => {
        const I = y[T];
        return I ? l[T].readdir(I) : [];
      })
    )).map((T) => (T === null ? [] : T)[Symbol.iterator]());
    return {
      entries: y,
      children: hu(A)
    };
  }, g = async (y) => {
    const { entries: E, children: A } = await m(y), T = E.find((R) => R && R._fullpath)._fullpath, I = await a(T, E);
    if (I !== null) {
      let R = await s(g, A);
      return R = R.filter((D) => D !== void 0), o(I, R);
    }
  };
  return g(f);
}
async function Kn(t, e) {
  const r = await t.readdir(e);
  r == null ? await t.rm(e) : r.length ? await Promise.all(
    r.map((i) => {
      const n = te.join(e, i);
      return t.lstat(n).then((a) => {
        if (a)
          return a.isDirectory() ? Kn(t, n) : t.rm(n);
      });
    })
  ).then(() => t.rmdir(e)) : await t.rmdir(e);
}
function du(t) {
  return wu(t) && ao(t.then) && ao(t.catch);
}
function wu(t) {
  return t && typeof t == "object";
}
function ao(t) {
  return typeof t == "function";
}
function oo(t) {
  return du(((r) => {
    try {
      return r.readFile().catch((i) => i);
    } catch (i) {
      return i;
    }
  })(t));
}
const so = [
  "readFile",
  "writeFile",
  "mkdir",
  "rmdir",
  "unlink",
  "stat",
  "lstat",
  "readdir",
  "readlink",
  "symlink"
];
function co(t, e) {
  if (oo(e))
    for (const r of so)
      t[`_${r}`] = e[r].bind(e);
  else
    for (const r of so)
      t[`_${r}`] = wn(e[r].bind(e));
  oo(e) ? e.rm ? t._rm = e.rm.bind(e) : e.rmdir.length > 1 ? t._rm = e.rmdir.bind(e) : t._rm = Kn.bind(null, t) : e.rm ? t._rm = wn(e.rm.bind(e)) : e.rmdir.length > 2 ? t._rm = wn(e.rmdir.bind(e)) : t._rm = Kn.bind(null, t);
}
class me {
  constructor(e) {
    if (typeof e._original_unwrapped_fs < "u") return e;
    const r = Object.getOwnPropertyDescriptor(e, "promises");
    r && r.enumerable ? co(this, e.promises) : co(this, e), this._original_unwrapped_fs = e;
  }
  /**
   * Return true if a file exists, false if it doesn't exist.
   * Rethrows errors that aren't related to file existence.
   */
  async exists(e, r = {}) {
    try {
      return await this._stat(e), !0;
    } catch (i) {
      if (i.code === "ENOENT" || i.code === "ENOTDIR" || (i.code || "").includes("ENS"))
        return !1;
      throw console.log('Unhandled error in "FileSystem.exists()" function', i), i;
    }
  }
  /**
   * Return the contents of a file if it exists, otherwise returns null.
   *
   * @param {string} filepath
   * @param {object} [options]
   *
   * @returns {Promise<Buffer|string|null>}
   */
  async read(e, r = {}) {
    try {
      let i = await this._readFile(e, r);
      if (r.autocrlf === "true")
        try {
          i = new TextDecoder("utf8", { fatal: !0 }).decode(i), i = i.replace(/\r\n/g, `
`), i = new TextEncoder().encode(i);
        } catch {
        }
      return typeof i != "string" && (i = fe.from(i)), i;
    } catch {
      return null;
    }
  }
  /**
   * Write a file (creating missing directories if need be) without throwing errors.
   *
   * @param {string} filepath
   * @param {Buffer|Uint8Array|string} contents
   * @param {object|string} [options]
   */
  async write(e, r, i = {}) {
    try {
      await this._writeFile(e, r, i);
      return;
    } catch {
      await this.mkdir(Rr(e)), await this._writeFile(e, r, i);
    }
  }
  /**
   * Make a directory (or series of nested directories) without throwing an error if it already exists.
   */
  async mkdir(e, r = !1) {
    try {
      await this._mkdir(e);
      return;
    } catch (i) {
      if (i === null || i.code === "EEXIST") return;
      if (r) throw i;
      if (i.code === "ENOENT") {
        const n = Rr(e);
        if (n === "." || n === "/" || n === e) throw i;
        await this.mkdir(n), await this.mkdir(e, !0);
      }
    }
  }
  /**
   * Delete a file without throwing an error if it is already deleted.
   */
  async rm(e) {
    try {
      await this._unlink(e);
    } catch (r) {
      if (r.code !== "ENOENT") throw r;
    }
  }
  /**
   * Delete a directory without throwing an error if it is already deleted.
   */
  async rmdir(e, r) {
    try {
      r && r.recursive ? await this._rm(e, r) : await this._rmdir(e);
    } catch (i) {
      if (i.code !== "ENOENT") throw i;
    }
  }
  /**
   * Read a directory without throwing an error is the directory doesn't exist
   */
  async readdir(e) {
    try {
      const r = await this._readdir(e);
      return r.sort(ji), r;
    } catch (r) {
      return r.code === "ENOTDIR" ? null : [];
    }
  }
  /**
   * Return a flast list of all the files nested inside a directory
   *
   * Based on an elegant concurrent recursive solution from SO
   * https://stackoverflow.com/a/45130990/2168416
   */
  async readdirDeep(e) {
    const r = await this._readdir(e);
    return (await Promise.all(
      r.map(async (n) => {
        const a = e + "/" + n;
        return (await this._stat(a)).isDirectory() ? this.readdirDeep(a) : a;
      })
    )).reduce((n, a) => n.concat(a), []);
  }
  /**
   * Return the Stats of a file/symlink if it exists, otherwise returns null.
   * Rethrows errors that aren't related to file existence.
   */
  async lstat(e) {
    try {
      return await this._lstat(e);
    } catch (r) {
      if (r.code === "ENOENT" || (r.code || "").includes("ENS"))
        return null;
      throw r;
    }
  }
  /**
   * Reads the contents of a symlink if it exists, otherwise returns null.
   * Rethrows errors that aren't related to file existence.
   */
  async readlink(e, r = { encoding: "buffer" }) {
    try {
      const i = await this._readlink(e, r);
      return fe.isBuffer(i) ? i : fe.from(i);
    } catch (i) {
      if (i.code === "ENOENT" || (i.code || "").includes("ENS"))
        return null;
      throw i;
    }
  }
  /**
   * Write the contents of buffer to a symlink.
   */
  async writelink(e, r) {
    return this._symlink(r.toString("utf8"), e);
  }
}
function H(t, e) {
  if (e === void 0)
    throw new yt(t);
}
async function Fi(t, e) {
  return !t && !e ? !1 : t && !e || !t && e ? !0 : !(await t.type() === "tree" && await e.type() === "tree" || await t.type() === await e.type() && await t.mode() === await e.mode() && await t.oid() === await e.oid());
}
async function pu({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  commit: i = "HEAD",
  cache: n = {}
}) {
  try {
    H("fs", t), H("dir", e), H("gitdir", r);
    const a = new me(t), o = [$t({ ref: i }), wi(), Nr()];
    let s = [];
    await ot.acquire({ fs: a, gitdir: r, cache: n }, async function(f) {
      s = f.unmergedPaths;
    });
    const l = await ar({
      fs: a,
      cache: n,
      dir: e,
      gitdir: r,
      trees: o,
      map: async function(f, [u, m, g]) {
        const y = !await Fi(m, g), E = s.includes(f), A = !await Fi(g, u);
        if (y || E)
          return u ? {
            path: f,
            mode: await u.mode(),
            oid: await u.oid(),
            type: await u.type(),
            content: await u.content()
          } : void 0;
        if (A) return !1;
        throw new hi(f);
      }
    });
    await ot.acquire({ fs: a, gitdir: r, cache: n }, async function(f) {
      for (const u of l)
        if (u !== !1) {
          if (!u) {
            await a.rmdir(`${e}/${u.path}`, { recursive: !0 }), f.delete({ filepath: u.path });
            continue;
          }
          if (u.type === "blob") {
            const m = new TextDecoder().decode(u.content);
            await a.write(`${e}/${u.path}`, m, { mode: u.mode }), f.insert({
              filepath: u.path,
              oid: u.oid,
              stage: 0
            });
          }
        }
    });
  } catch (a) {
    throw a.caller = "git.abortMerge", a;
  }
}
class jr {
  static async isIgnored({ fs: e, dir: r, gitdir: i = te.join(r, ".git"), filepath: n }) {
    if (Ai(n) === ".git") return !0;
    if (n === ".") return !1;
    let a = "";
    const o = te.join(i, "info", "exclude");
    await e.exists(o) && (a = await e.read(o, "utf8"));
    const s = [
      {
        gitignore: te.join(r, ".gitignore"),
        filepath: n
      }
    ], l = n.split("/").filter(Boolean);
    for (let u = 1; u < l.length; u++) {
      const m = l.slice(0, u).join("/"), g = l.slice(u).join("/");
      s.push({
        gitignore: te.join(r, m, ".gitignore"),
        filepath: g
      });
    }
    let f = !1;
    for (const u of s) {
      let m;
      try {
        m = await e.read(u.gitignore, "utf8");
      } catch (E) {
        if (E.code === "NOENT") continue;
      }
      const g = hl().add(a);
      g.add(m);
      const y = Rr(u.filepath);
      if (y !== "." && g.ignores(y)) return !0;
      f ? f = !g.test(u.filepath).unignored : f = g.test(u.filepath).ignored;
    }
    return f;
  }
}
async function mu({ fs: t, gitdir: e, object: r, format: i, oid: n }) {
  const a = `objects/${n.slice(0, 2)}/${n.slice(2)}`, o = `${e}/${a}`;
  await t.exists(o) || await t.write(o, r);
}
let Sn = null;
async function ss(t) {
  return Sn === null && (Sn = yu()), Sn ? gu(t) : oa.deflate(t);
}
async function gu(t) {
  const e = new CompressionStream("deflate"), r = new Blob([t]).stream().pipeThrough(e);
  return new Uint8Array(await new Response(r).arrayBuffer());
}
function yu() {
  try {
    return new CompressionStream("deflate").writable.close(), new Blob([]).stream().cancel(), !0;
  } catch {
    return !1;
  }
}
async function bt({
  fs: t,
  gitdir: e,
  type: r,
  object: i,
  format: n = "content",
  oid: a = void 0,
  dryRun: o = !1
}) {
  return n !== "deflated" && (n !== "wrapped" && (i = Mr.wrap({ type: r, object: i })), a = await Yt(i), i = fe.from(await ss(i))), o || await mu({ fs: t, gitdir: e, object: i, format: "deflated", oid: a }), a;
}
function cs(t) {
  let e;
  for (; ~(e = t.indexOf(92)); ) t[e] = 47;
  return t;
}
async function _u({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  filepath: i,
  cache: n = {},
  force: a = !1,
  parallel: o = !0
}) {
  try {
    H("fs", t), H("dir", e), H("gitdir", r), H("filepath", i);
    const s = new me(t);
    await ot.acquire({ fs: s, gitdir: r, cache: n }, async (l) => {
      const u = await (await it.get({ fs: s, gitdir: r })).get("core.autocrlf");
      return Jn({
        dir: e,
        gitdir: r,
        fs: s,
        filepath: i,
        index: l,
        force: a,
        parallel: o,
        autocrlf: u
      });
    });
  } catch (s) {
    throw s.caller = "git.add", s;
  }
}
async function Jn({
  dir: t,
  gitdir: e,
  fs: r,
  filepath: i,
  index: n,
  force: a,
  parallel: o,
  autocrlf: s
}) {
  i = Array.isArray(i) ? i : [i];
  const l = i.map(async (g) => {
    if (!a && await jr.isIgnored({
      fs: r,
      dir: t,
      gitdir: e,
      filepath: g
    }))
      return;
    const y = await r.lstat(te.join(t, g));
    if (!y) throw new Le(g);
    if (y.isDirectory()) {
      const E = await r.readdir(te.join(t, g));
      if (o) {
        const A = E.map(
          (T) => Jn({
            dir: t,
            gitdir: e,
            fs: r,
            filepath: [te.join(g, T)],
            index: n,
            force: a,
            parallel: o,
            autocrlf: s
          })
        );
        await Promise.all(A);
      } else
        for (const A of E)
          await Jn({
            dir: t,
            gitdir: e,
            fs: r,
            filepath: [te.join(g, A)],
            index: n,
            force: a,
            parallel: o,
            autocrlf: s
          });
    } else {
      const E = y.isSymbolicLink() ? await r.readlink(te.join(t, g)).then(cs) : await r.read(te.join(t, g), { autocrlf: s });
      if (E === null) throw new Le(g);
      const A = await bt({ fs: r, gitdir: e, type: "blob", object: E });
      n.insert({ filepath: g, stats: y, oid: A });
    }
  }), f = await Promise.allSettled(l), u = f.filter((g) => g.status === "rejected").map((g) => g.reason);
  if (u.length > 1)
    throw new ci(u);
  if (u.length === 1)
    throw u[0];
  return f.filter((g) => g.status === "fulfilled" && g.value).map((g) => g.value);
}
async function Yr({ fs: t, gitdir: e, path: r }) {
  return (await it.get({ fs: t, gitdir: e })).get(r);
}
function ls(t, ...e) {
  for (const r of e)
    if (r)
      for (const i of Object.keys(r)) {
        const n = r[i];
        n !== void 0 && (t[i] = n);
      }
  return t;
}
async function or({ fs: t, gitdir: e, author: r, commit: i }) {
  const n = Math.floor(Date.now() / 1e3), a = {
    name: await Yr({ fs: t, gitdir: e, path: "user.name" }),
    email: await Yr({ fs: t, gitdir: e, path: "user.email" }) || "",
    // author.email is allowed to be empty string
    timestamp: n,
    timezoneOffset: new Date(n * 1e3).getTimezoneOffset()
  }, o = ls(
    {},
    a,
    i ? i.author : void 0,
    r
  );
  if (o.name !== void 0)
    return o;
}
async function Dr({
  fs: t,
  gitdir: e,
  author: r,
  committer: i,
  commit: n
}) {
  const a = Math.floor(Date.now() / 1e3), o = {
    name: await Yr({ fs: t, gitdir: e, path: "user.name" }),
    email: await Yr({ fs: t, gitdir: e, path: "user.email" }) || "",
    // committer.email is allowed to be empty string
    timestamp: a,
    timezoneOffset: new Date(a * 1e3).getTimezoneOffset()
  }, s = ls(
    {},
    o,
    n ? n.committer : void 0,
    r,
    i
  );
  if (s.name !== void 0)
    return s;
}
async function us({ fs: t, cache: e, gitdir: r, oid: i }) {
  const { type: n, object: a } = await Je({ fs: t, cache: e, gitdir: r, oid: i });
  if (n === "tag")
    return i = wt.from(a).parse().object, us({ fs: t, cache: e, gitdir: r, oid: i });
  if (n !== "commit")
    throw new pt(i, n, "commit");
  return { commit: Ye.from(a), oid: i };
}
async function Or({ fs: t, cache: e, gitdir: r, oid: i }) {
  const { commit: n, oid: a } = await us({
    fs: t,
    cache: e,
    gitdir: r,
    oid: i
  });
  return {
    oid: a,
    commit: n.parse(),
    payload: n.withoutSignature()
  };
}
async function Hi({
  fs: t,
  cache: e,
  onSign: r,
  gitdir: i,
  message: n,
  author: a,
  committer: o,
  signingKey: s,
  amend: l = !1,
  dryRun: f = !1,
  noUpdateBranch: u = !1,
  ref: m,
  parent: g,
  tree: y
}) {
  let E = !1;
  m || (m = await ae.resolve({
    fs: t,
    gitdir: i,
    ref: "HEAD",
    depth: 2
  }));
  let A, T;
  try {
    A = await ae.resolve({
      fs: t,
      gitdir: i,
      ref: m
    }), T = await Or({ fs: t, gitdir: i, oid: A, cache: {} });
  } catch {
    E = !0;
  }
  if (l && E)
    throw new di(m);
  const I = l ? await or({
    fs: t,
    gitdir: i,
    author: a,
    commit: T.commit
  }) : await or({ fs: t, gitdir: i, author: a });
  if (!I) throw new ft("author");
  const R = l ? await Dr({
    fs: t,
    gitdir: i,
    author: I,
    committer: o,
    commit: T.commit
  }) : await Dr({
    fs: t,
    gitdir: i,
    author: I,
    committer: o
  });
  if (!R) throw new ft("committer");
  return ot.acquire(
    { fs: t, gitdir: i, cache: e, allowUnmerged: !1 },
    async function(D) {
      const U = es(D.entries).get(".");
      if (y || (y = await fs({ fs: t, gitdir: i, inode: U, dryRun: f })), g ? g = await Promise.all(
        g.map((O) => ae.resolve({ fs: t, gitdir: i, ref: O }))
      ) : l ? g = T.commit.parent : g = A ? [A] : [], !n)
        if (l)
          n = T.commit.message;
        else
          throw new yt("message");
      let M = Ye.from({
        tree: y,
        parent: g,
        author: I,
        committer: R,
        message: n
      });
      s && (M = await Ye.sign(M, r, s));
      const B = await bt({
        fs: t,
        gitdir: i,
        type: "commit",
        object: M.toObject(),
        dryRun: f
      });
      return !u && !f && await ae.writeRef({
        fs: t,
        gitdir: i,
        ref: m,
        value: B
      }), B;
    }
  );
}
async function fs({ fs: t, gitdir: e, inode: r, dryRun: i }) {
  const n = r.children;
  for (const l of n)
    l.type === "tree" && (l.metadata.mode = "040000", l.metadata.oid = await fs({ fs: t, gitdir: e, inode: l, dryRun: i }));
  const a = n.map((l) => ({
    mode: l.metadata.mode,
    path: l.basename,
    oid: l.metadata.oid,
    type: l.type
  })), o = _t.from(a);
  return await bt({
    fs: t,
    gitdir: e,
    type: "tree",
    object: o.toObject(),
    dryRun: i
  });
}
async function pi({ fs: t, cache: e, gitdir: r, oid: i, filepath: n }) {
  if (n.startsWith("/"))
    throw new nr("leading-slash");
  if (n.endsWith("/"))
    throw new nr("trailing-slash");
  const a = i, o = await Ar({ fs: t, cache: e, gitdir: r, oid: i }), s = o.tree;
  if (n === "")
    i = o.oid;
  else {
    const l = n.split("/");
    i = await hs({
      fs: t,
      cache: e,
      gitdir: r,
      tree: s,
      pathArray: l,
      oid: a,
      filepath: n
    });
  }
  return i;
}
async function hs({
  fs: t,
  cache: e,
  gitdir: r,
  tree: i,
  pathArray: n,
  oid: a,
  filepath: o
}) {
  const s = n.shift();
  for (const l of i)
    if (l.path === s) {
      if (n.length === 0)
        return l.oid;
      {
        const { type: f, object: u } = await Je({
          fs: t,
          cache: e,
          gitdir: r,
          oid: l.oid
        });
        if (f !== "tree")
          throw new pt(a, f, "tree", o);
        return i = _t.from(u), hs({
          fs: t,
          cache: e,
          gitdir: r,
          tree: i,
          pathArray: n,
          oid: a,
          filepath: o
        });
      }
    }
  throw new Le(`file or directory found at "${a}:${o}"`);
}
async function zr({
  fs: t,
  cache: e,
  gitdir: r,
  oid: i,
  filepath: n = void 0
}) {
  n !== void 0 && (i = await pi({ fs: t, cache: e, gitdir: r, oid: i, filepath: n }));
  const { tree: a, oid: o } = await Ar({ fs: t, cache: e, gitdir: r, oid: i });
  return {
    oid: o,
    tree: a.entries()
  };
}
async function mi({ fs: t, gitdir: e, tree: r }) {
  const i = _t.from(r).toObject();
  return await bt({
    fs: t,
    gitdir: e,
    type: "tree",
    object: i,
    format: "content"
  });
}
async function bu({
  fs: t,
  cache: e,
  onSign: r,
  gitdir: i,
  ref: n,
  oid: a,
  note: o,
  force: s,
  author: l,
  committer: f,
  signingKey: u
}) {
  let m;
  try {
    m = await ae.resolve({ gitdir: i, fs: t, ref: n });
  } catch (I) {
    if (!(I instanceof Le))
      throw I;
  }
  let y = (await zr({
    fs: t,
    cache: e,
    gitdir: i,
    oid: m || "4b825dc642cb6eb9a060e54bf8d69288fbee4904"
  })).tree;
  if (s)
    y = y.filter((I) => I.path !== a);
  else
    for (const I of y)
      if (I.path === a)
        throw new Ft("note", a);
  typeof o == "string" && (o = fe.from(o, "utf8"));
  const E = await bt({
    fs: t,
    gitdir: i,
    type: "blob",
    object: o,
    format: "content"
  });
  y.push({ mode: "100644", path: a, oid: E, type: "blob" });
  const A = await mi({
    fs: t,
    gitdir: i,
    tree: y
  });
  return await Hi({
    fs: t,
    cache: e,
    onSign: r,
    gitdir: i,
    ref: n,
    tree: A,
    parent: m && [m],
    message: `Note added by 'isomorphic-git addNote'
`,
    author: l,
    committer: f,
    signingKey: u
  });
}
async function vu({
  fs: t,
  onSign: e,
  dir: r,
  gitdir: i = te.join(r, ".git"),
  ref: n = "refs/notes/commits",
  oid: a,
  note: o,
  force: s,
  author: l,
  committer: f,
  signingKey: u,
  cache: m = {}
}) {
  try {
    H("fs", t), H("gitdir", i), H("oid", a), H("note", o), u && H("onSign", e);
    const g = new me(t), y = await or({ fs: g, gitdir: i, author: l });
    if (!y) throw new ft("author");
    const E = await Dr({
      fs: g,
      gitdir: i,
      author: y,
      committer: f
    });
    if (!E) throw new ft("committer");
    return await bu({
      fs: new me(g),
      cache: m,
      onSign: e,
      gitdir: i,
      ref: n,
      oid: a,
      note: o,
      force: s,
      author: y,
      committer: E,
      signingKey: u
    });
  } catch (g) {
    throw g.caller = "git.addNote", g;
  }
}
async function ds({ fs: t, gitdir: e, remote: r, url: i, force: n }) {
  if (r !== zt.clean(r))
    throw new Ct(r, zt.clean(r));
  const a = await it.get({ fs: t, gitdir: e });
  if (!n && (await a.getSubsections("remote")).includes(r) && i !== await a.get(`remote.${r}.url`))
    throw new Ft("remote", r);
  await a.set(`remote.${r}.url`, i), await a.set(
    `remote.${r}.fetch`,
    `+refs/heads/*:refs/remotes/${r}/*`
  ), await it.save({ fs: t, gitdir: e, config: a });
}
async function Eu({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  remote: i,
  url: n,
  force: a = !1
}) {
  try {
    return H("fs", t), H("gitdir", r), H("remote", i), H("url", n), await ds({
      fs: new me(t),
      gitdir: r,
      remote: i,
      url: n,
      force: a
    });
  } catch (o) {
    throw o.caller = "git.addRemote", o;
  }
}
async function ku({
  fs: t,
  cache: e,
  onSign: r,
  gitdir: i,
  ref: n,
  tagger: a,
  message: o = n,
  gpgsig: s,
  object: l,
  signingKey: f,
  force: u = !1
}) {
  if (n = n.startsWith("refs/tags/") ? n : `refs/tags/${n}`, !u && await ae.exists({ fs: t, gitdir: i, ref: n }))
    throw new Ft("tag", n);
  const m = await ae.resolve({
    fs: t,
    gitdir: i,
    ref: l || "HEAD"
  }), { type: g } = await Je({ fs: t, cache: e, gitdir: i, oid: m });
  let y = wt.from({
    object: m,
    type: g,
    tag: n.replace("refs/tags/", ""),
    tagger: a,
    message: o,
    gpgsig: s
  });
  f && (y = await wt.sign(y, r, f));
  const E = await bt({
    fs: t,
    gitdir: i,
    type: "tag",
    object: y.toObject()
  });
  await ae.writeRef({ fs: t, gitdir: i, ref: n, value: E });
}
async function Su({
  fs: t,
  onSign: e,
  dir: r,
  gitdir: i = te.join(r, ".git"),
  ref: n,
  tagger: a,
  message: o = n,
  gpgsig: s,
  object: l,
  signingKey: f,
  force: u = !1,
  cache: m = {}
}) {
  try {
    H("fs", t), H("gitdir", i), H("ref", n), f && H("onSign", e);
    const g = new me(t), y = await or({ fs: g, gitdir: i, author: a });
    if (!y) throw new ft("tagger");
    return await ku({
      fs: g,
      cache: m,
      onSign: e,
      gitdir: i,
      ref: n,
      tagger: y,
      message: o,
      gpgsig: s,
      object: l,
      signingKey: f,
      force: u
    });
  } catch (g) {
    throw g.caller = "git.annotatedTag", g;
  }
}
async function xu({
  fs: t,
  gitdir: e,
  ref: r,
  object: i,
  checkout: n = !1,
  force: a = !1
}) {
  if (r !== zt.clean(r))
    throw new Ct(r, zt.clean(r));
  const o = `refs/heads/${r}`;
  if (!a && await ae.exists({ fs: t, gitdir: e, ref: o }))
    throw new Ft("branch", r, !1);
  let s;
  try {
    s = await ae.resolve({ fs: t, gitdir: e, ref: i || "HEAD" });
  } catch {
  }
  s && await ae.writeRef({ fs: t, gitdir: e, ref: o, value: s }), n && await ae.writeSymbolicRef({
    fs: t,
    gitdir: e,
    ref: "HEAD",
    value: o
  });
}
async function Iu({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  ref: i,
  object: n,
  checkout: a = !1,
  force: o = !1
}) {
  try {
    return H("fs", t), H("gitdir", r), H("ref", i), await xu({
      fs: new me(t),
      gitdir: r,
      ref: i,
      object: n,
      checkout: a,
      force: o
    });
  } catch (s) {
    throw s.caller = "git.branch", s;
  }
}
const ws = (t, e) => t === "." || e == null || e.length === 0 || e === "." ? !0 : e.length >= t.length ? e.startsWith(t) : t.startsWith(e);
async function ua({
  fs: t,
  cache: e,
  onProgress: r,
  onPostCheckout: i,
  dir: n,
  gitdir: a,
  remote: o,
  ref: s,
  filepaths: l,
  noCheckout: f,
  noUpdateHead: u,
  dryRun: m,
  force: g,
  track: y = !0
}) {
  let E;
  if (i)
    try {
      E = await ae.resolve({ fs: t, gitdir: a, ref: "HEAD" });
    } catch {
      E = "0000000000000000000000000000000000000000";
    }
  let A;
  try {
    A = await ae.resolve({ fs: t, gitdir: a, ref: s });
  } catch (T) {
    if (s === "HEAD") throw T;
    const I = `${o}/${s}`;
    if (A = await ae.resolve({
      fs: t,
      gitdir: a,
      ref: I
    }), y) {
      const R = await it.get({ fs: t, gitdir: a });
      await R.set(`branch.${s}.remote`, o), await R.set(`branch.${s}.merge`, `refs/heads/${s}`), await it.save({ fs: t, gitdir: a, config: R });
    }
    await ae.writeRef({
      fs: t,
      gitdir: a,
      ref: `refs/heads/${s}`,
      value: A
    });
  }
  if (!f) {
    let T;
    try {
      T = await Ru({
        fs: t,
        cache: e,
        onProgress: r,
        dir: n,
        gitdir: a,
        ref: s,
        force: g,
        filepaths: l
      });
    } catch (U) {
      throw U instanceof Le && U.data.what === A ? new ii(s, A) : U;
    }
    const I = T.filter(([U]) => U === "conflict").map(([U, M]) => M);
    if (I.length > 0)
      throw new ri(I);
    const R = T.filter(([U]) => U === "error").map(([U, M]) => M);
    if (R.length > 0)
      throw new Re(R.join(", "));
    if (m) {
      i && await i({
        previousHead: E,
        newHead: A,
        type: l != null && l.length > 0 ? "file" : "branch"
      });
      return;
    }
    let D = 0;
    const L = T.length;
    await ot.acquire({ fs: t, gitdir: a, cache: e }, async function(U) {
      await Promise.all(
        T.filter(
          ([M]) => M === "delete" || M === "delete-index"
        ).map(async function([M, B]) {
          const O = `${n}/${B}`;
          M === "delete" && await t.rm(O), U.delete({ filepath: B }), r && await r({
            phase: "Updating workdir",
            loaded: ++D,
            total: L
          });
        })
      );
    }), await ot.acquire({ fs: t, gitdir: a, cache: e }, async function(U) {
      for (const [M, B] of T)
        if (M === "rmdir" || M === "rmdir-index") {
          const O = `${n}/${B}`;
          try {
            M === "rmdir-index" && U.delete({ filepath: B }), await t.rmdir(O), r && await r({
              phase: "Updating workdir",
              loaded: ++D,
              total: L
            });
          } catch (W) {
            if (W.code === "ENOTEMPTY")
              console.log(
                `Did not delete ${B} because directory is not empty`
              );
            else
              throw W;
          }
        }
    }), await Promise.all(
      T.filter(([U]) => U === "mkdir" || U === "mkdir-index").map(async function([U, M]) {
        const B = `${n}/${M}`;
        await t.mkdir(B), r && await r({
          phase: "Updating workdir",
          loaded: ++D,
          total: L
        });
      })
    ), await ot.acquire({ fs: t, gitdir: a, cache: e }, async function(U) {
      await Promise.all(
        T.filter(
          ([M]) => M === "create" || M === "create-index" || M === "update" || M === "mkdir-index"
        ).map(async function([M, B, O, W, z]) {
          const Y = `${n}/${B}`;
          try {
            if (M !== "create-index" && M !== "mkdir-index") {
              const { object: J } = await Je({ fs: t, cache: e, gitdir: a, oid: O });
              if (z && await t.rm(Y), W === 33188)
                await t.write(Y, J);
              else if (W === 33261)
                await t.write(Y, J, { mode: 511 });
              else if (W === 40960)
                await t.writelink(Y, J);
              else
                throw new Re(
                  `Invalid mode 0o${W.toString(8)} detected in blob ${O}`
                );
            }
            const F = await t.lstat(Y);
            W === 33261 && (F.mode = 493), M === "mkdir-index" && (F.mode = 57344), U.insert({
              filepath: B,
              stats: F,
              oid: O
            }), r && await r({
              phase: "Updating workdir",
              loaded: ++D,
              total: L
            });
          } catch (F) {
            console.log(F);
          }
        })
      );
    }), i && await i({
      previousHead: E,
      newHead: A,
      type: l != null && l.length > 0 ? "file" : "branch"
    });
  }
  if (!u) {
    const T = await ae.expand({ fs: t, gitdir: a, ref: s });
    T.startsWith("refs/heads") ? await ae.writeSymbolicRef({
      fs: t,
      gitdir: a,
      ref: "HEAD",
      value: T
    }) : await ae.writeRef({ fs: t, gitdir: a, ref: "HEAD", value: A });
  }
}
async function Ru({
  fs: t,
  cache: e,
  onProgress: r,
  dir: i,
  gitdir: n,
  ref: a,
  force: o,
  filepaths: s
}) {
  let l = 0;
  return ar({
    fs: t,
    cache: e,
    dir: i,
    gitdir: n,
    trees: [$t({ ref: a }), wi(), Nr()],
    map: async function(f, [u, m, g]) {
      if (f === ".") return;
      if (s && !s.some((E) => ws(f, E)))
        return null;
      switch (r && await r({ phase: "Analyzing workdir", loaded: ++l }), [!!g, !!u, !!m].map(Number).join("")) {
        // Impossible case.
        case "000":
          return;
        // Ignore workdir files that are not tracked and not part of the new commit.
        case "001":
          return o && s && s.includes(f) ? ["delete", f] : void 0;
        // New entries
        case "010":
          switch (await u.type()) {
            case "tree":
              return ["mkdir", f];
            case "blob":
              return [
                "create",
                f,
                await u.oid(),
                await u.mode()
              ];
            case "commit":
              return [
                "mkdir-index",
                f,
                await u.oid(),
                await u.mode()
              ];
            default:
              return [
                "error",
                `new entry Unhandled type ${await u.type()}`
              ];
          }
        // New entries but there is already something in the workdir there.
        case "011":
          switch (`${await u.type()}-${await m.type()}`) {
            case "tree-tree":
              return;
            case "tree-blob":
            case "blob-tree":
              return ["conflict", f];
            case "blob-blob":
              return await u.oid() !== await m.oid() ? o ? [
                "update",
                f,
                await u.oid(),
                await u.mode(),
                await u.mode() !== await m.mode()
              ] : ["conflict", f] : await u.mode() !== await m.mode() ? o ? [
                "update",
                f,
                await u.oid(),
                await u.mode(),
                !0
              ] : ["conflict", f] : [
                "create-index",
                f,
                await u.oid(),
                await u.mode()
              ];
            case "commit-tree":
              return;
            case "commit-blob":
              return ["conflict", f];
            default:
              return ["error", `new entry Unhandled type ${u.type}`];
          }
        // Something in stage but not in the commit OR the workdir.
        // Note: I verified this behavior against canonical git.
        case "100":
          return ["delete-index", f];
        // Deleted entries
        // TODO: How to handle if stage type and workdir type mismatch?
        case "101":
          switch (await g.type()) {
            case "tree":
              return ["rmdir", f];
            case "blob":
              return await g.oid() !== await m.oid() ? o ? ["delete", f] : ["conflict", f] : ["delete", f];
            case "commit":
              return ["rmdir-index", f];
            default:
              return [
                "error",
                `delete entry Unhandled type ${await g.type()}`
              ];
          }
        /* eslint-disable no-fallthrough */
        // File missing from workdir
        case "110":
        // Possibly modified entries
        case "111":
          switch (`${await g.type()}-${await u.type()}`) {
            case "tree-tree":
              return;
            case "blob-blob": {
              if (await g.oid() === await u.oid() && await g.mode() === await u.mode() && !o)
                return;
              if (m) {
                if (await m.oid() !== await g.oid() && await m.oid() !== await u.oid())
                  return o ? [
                    "update",
                    f,
                    await u.oid(),
                    await u.mode(),
                    await u.mode() !== await m.mode()
                  ] : ["conflict", f];
              } else if (o)
                return [
                  "update",
                  f,
                  await u.oid(),
                  await u.mode(),
                  await u.mode() !== await g.mode()
                ];
              return await u.mode() !== await g.mode() ? [
                "update",
                f,
                await u.oid(),
                await u.mode(),
                !0
              ] : await u.oid() !== await g.oid() ? [
                "update",
                f,
                await u.oid(),
                await u.mode(),
                !1
              ] : void 0;
            }
            case "tree-blob":
              return ["update-dir-to-blob", f, await u.oid()];
            case "blob-tree":
              return ["update-blob-to-tree", f];
            case "commit-commit":
              return [
                "mkdir-index",
                f,
                await u.oid(),
                await u.mode()
              ];
            default:
              return [
                "error",
                `update entry Unhandled type ${await g.type()}-${await u.type()}`
              ];
          }
      }
    },
    // Modify the default flat mapping
    reduce: async function(f, u) {
      return u = os(u), f ? f && f[0] === "rmdir" ? (u.push(f), u) : (u.unshift(f), u) : u;
    }
  });
}
async function ps({
  fs: t,
  onProgress: e,
  onPostCheckout: r,
  dir: i,
  gitdir: n = te.join(i, ".git"),
  remote: a = "origin",
  ref: o,
  filepaths: s,
  noCheckout: l = !1,
  noUpdateHead: f = o === void 0,
  dryRun: u = !1,
  force: m = !1,
  track: g = !0,
  cache: y = {}
}) {
  try {
    H("fs", t), H("dir", i), H("gitdir", n);
    const E = o || "HEAD";
    return await ua({
      fs: new me(t),
      cache: y,
      onProgress: e,
      onPostCheckout: r,
      dir: i,
      gitdir: n,
      remote: a,
      ref: E,
      filepaths: s,
      noCheckout: l,
      noUpdateHead: f,
      dryRun: u,
      force: m,
      track: g
    });
  } catch (E) {
    throw E.caller = "git.checkout", E;
  }
}
const Tu = new RegExp("^refs/(heads/|tags/|remotes/)?(.*)");
function gr(t) {
  const e = Tu.exec(t);
  return e ? e[1] === "remotes/" && t.endsWith("/HEAD") ? e[2].slice(0, -5) : e[2] : t;
}
async function cr({
  fs: t,
  gitdir: e,
  fullname: r = !1,
  test: i = !1
}) {
  const n = await ae.resolve({
    fs: t,
    gitdir: e,
    ref: "HEAD",
    depth: 2
  });
  if (i)
    try {
      await ae.resolve({ fs: t, gitdir: e, ref: n });
    } catch {
      return;
    }
  if (n.startsWith("refs/"))
    return r ? n : gr(n);
}
function $u(t) {
  return t = t.replace(/^git@([^:]+):/, "https://$1/"), t = t.replace(/^ssh:\/\//, "https://"), t;
}
function ms({ username: t = "", password: e = "" }) {
  return `Basic ${fe.from(`${t}:${e}`).toString("base64")}`;
}
async function gi(t, e) {
  const r = is(t);
  for (; ; ) {
    const { value: i, done: n } = await r.next();
    if (i && await e(i), n) break;
  }
  r.return && r.return();
}
async function Ni(t) {
  let e = 0;
  const r = [];
  await gi(t, (a) => {
    r.push(a), e += a.byteLength;
  });
  const i = new Uint8Array(e);
  let n = 0;
  for (const a of r)
    i.set(a, n), n += a.byteLength;
  return i;
}
function lo(t) {
  let e = t.match(/^https?:\/\/([^/]+)@/);
  if (e == null) return { url: t, auth: {} };
  e = e[1];
  const [r, i] = e.split(":");
  return t = t.replace(`${e}@`, ""), { url: t, auth: { username: r, password: i } };
}
function Qn(t, e) {
  const r = e.toString(16);
  return "0".repeat(t - r.length) + r;
}
class Qe {
  static flush() {
    return fe.from("0000", "utf8");
  }
  static delim() {
    return fe.from("0001", "utf8");
  }
  static encode(e) {
    typeof e == "string" && (e = fe.from(e));
    const r = e.length + 4, i = Qn(4, r);
    return fe.concat([fe.from(i, "utf8"), e]);
  }
  static streamReader(e) {
    const r = new ns(e);
    return async function() {
      try {
        let n = await r.read(4);
        if (n == null) return !0;
        if (n = parseInt(n.toString("utf8"), 16), n === 0 || n === 1) return null;
        const a = await r.read(n - 4);
        return a ?? !0;
      } catch (n) {
        return e.error = n, !0;
      }
    };
  }
}
async function uo(t) {
  const e = {};
  let r;
  for (; r = await t(), r !== !0; ) {
    if (r === null) continue;
    r = r.toString("utf8").replace(/\n$/, "");
    const i = r.indexOf("=");
    if (i > -1) {
      const n = r.slice(0, i), a = r.slice(i + 1);
      e[n] = a;
    } else
      e[r] = !0;
  }
  return { protocolVersion: 2, capabilities2: e };
}
async function fo(t, { service: e }) {
  const r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), a = Qe.streamReader(t);
  let o = await a();
  for (; o === null; ) o = await a();
  if (o === !0) throw new ni();
  if (o.includes("version 2"))
    return uo(a);
  if (o.toString("utf8").replace(/\n$/, "") !== `# service=${e}`)
    throw new _r(`# service=${e}\\n`, o.toString("utf8"));
  let s = await a();
  for (; s === null; ) s = await a();
  if (s === !0) return { capabilities: r, refs: i, symrefs: n };
  if (s = s.toString("utf8"), s.includes("version 2"))
    return uo(a);
  const [l, f] = xn(s, "\0", "\\x00");
  if (f.split(" ").map((u) => r.add(u)), l !== "0000000000000000000000000000000000000000 capabilities^{}") {
    const [u, m] = xn(l, " ", " ");
    for (i.set(m, u); ; ) {
      const g = await a();
      if (g === !0) break;
      if (g !== null) {
        const [y, E] = xn(g.toString("utf8"), " ", " ");
        i.set(E, y);
      }
    }
  }
  for (const u of r)
    if (u.startsWith("symref=")) {
      const m = u.match(/symref=([^:]+):(.*)/);
      m.length === 3 && n.set(m[1], m[2]);
    }
  return { protocolVersion: 1, capabilities: r, refs: i, symrefs: n };
}
function xn(t, e, r) {
  const i = t.trim().split(e);
  if (i.length !== 2)
    throw new _r(
      `Two strings separated by '${r}'`,
      t.toString("utf8")
    );
  return i;
}
const ho = (t, e) => t.endsWith("?") ? `${t}${e}` : `${t}/${e.replace(/^https?:\/\//, "")}`, wo = (t, e) => {
  (e.username || e.password) && (t.Authorization = ms(e)), e.headers && Object.assign(t, e.headers);
}, In = async (t) => {
  try {
    const e = fe.from(await Ni(t.body)), r = e.toString("utf8");
    return { preview: r.length < 256 ? r : r.slice(0, 256) + "...", response: r, data: e };
  } catch {
    return {};
  }
};
class Mi {
  static async capabilities() {
    return ["discover", "connect"];
  }
  /**
   * @param {Object} args
   * @param {HttpClient} args.http
   * @param {ProgressCallback} [args.onProgress]
   * @param {AuthCallback} [args.onAuth]
   * @param {AuthFailureCallback} [args.onAuthFailure]
   * @param {AuthSuccessCallback} [args.onAuthSuccess]
   * @param {string} [args.corsProxy]
   * @param {string} args.service
   * @param {string} args.url
   * @param {Object<string, string>} args.headers
   * @param {1 | 2} args.protocolVersion - Git Protocol Version
   */
  static async discover({
    http: e,
    onProgress: r,
    onAuth: i,
    onAuthSuccess: n,
    onAuthFailure: a,
    corsProxy: o,
    service: s,
    url: l,
    headers: f,
    protocolVersion: u
  }) {
    let { url: m, auth: g } = lo(l);
    const y = o ? ho(o, m) : m;
    (g.username || g.password) && (f.Authorization = ms(g)), u === 2 && (f["Git-Protocol"] = "version=2");
    let E, A, T = !1;
    do
      if (E = await e.request({
        onProgress: r,
        method: "GET",
        url: `${y}/info/refs?service=${s}`,
        headers: f
      }), A = !1, E.statusCode === 401 || E.statusCode === 203) {
        const I = T ? a : i;
        if (I) {
          if (g = await I(m, {
            ...g,
            headers: { ...f }
          }), g && g.cancel)
            throw new Lr();
          g && (wo(f, g), T = !0, A = !0);
        }
      } else E.statusCode === 200 && T && n && await n(m, g);
    while (A);
    if (E.statusCode !== 200) {
      const { response: I } = await In(E);
      throw new $r(E.statusCode, E.statusMessage, I);
    }
    if (E.headers["content-type"] === `application/x-${s}-advertisement`) {
      const I = await fo(E.body, { service: s });
      return I.auth = g, I;
    } else {
      const { preview: I, response: R, data: D } = await In(E);
      try {
        const L = await fo([D], { service: s });
        return L.auth = g, L;
      } catch {
        throw new li(I, R);
      }
    }
  }
  /**
   * @param {Object} args
   * @param {HttpClient} args.http
   * @param {ProgressCallback} [args.onProgress]
   * @param {string} [args.corsProxy]
   * @param {string} args.service
   * @param {string} args.url
   * @param {Object<string, string>} [args.headers]
   * @param {any} args.body
   * @param {any} args.auth
   */
  static async connect({
    http: e,
    onProgress: r,
    corsProxy: i,
    service: n,
    url: a,
    auth: o,
    body: s,
    headers: l
  }) {
    const f = lo(a);
    f && (a = f.url), i && (a = ho(i, a)), l["content-type"] = `application/x-${n}-request`, l.accept = `application/x-${n}-result`, wo(l, o);
    const u = await e.request({
      onProgress: r,
      method: "POST",
      url: `${a}/${n}`,
      body: s,
      headers: l
    });
    if (u.statusCode !== 200) {
      const { response: m } = In(u);
      throw new $r(u.statusCode, u.statusMessage, m);
    }
    return u;
  }
}
function Bu({ url: t }) {
  if (t.startsWith("git@"))
    return {
      transport: "ssh",
      address: t
    };
  const e = t.match(/(\w+)(:\/\/|::)(.*)/);
  if (e !== null) {
    if (e[2] === "://")
      return {
        transport: e[1],
        address: e[0]
      };
    if (e[2] === "::")
      return {
        transport: e[1],
        address: e[3]
      };
  }
}
class Wi {
  static getRemoteHelperFor({ url: e }) {
    const r = /* @__PURE__ */ new Map();
    r.set("http", Mi), r.set("https", Mi);
    const i = Bu({ url: e });
    if (!i)
      throw new fi(e);
    if (r.has(i.transport))
      return r.get(i.transport);
    throw new ui(
      e,
      i.transport,
      i.transport === "ssh" ? $u(e) : void 0
    );
  }
}
let hr = null;
class Kr {
  static async read({ fs: e, gitdir: r }) {
    hr === null && (hr = new Xr());
    const i = te.join(r, "shallow"), n = /* @__PURE__ */ new Set();
    return await hr.acquire(i, async function() {
      const a = await e.read(i, { encoding: "utf8" });
      if (a === null || a.trim() === "") return n;
      a.trim().split(`
`).map((o) => n.add(o));
    }), n;
  }
  static async write({ fs: e, gitdir: r, oids: i }) {
    hr === null && (hr = new Xr());
    const n = te.join(r, "shallow");
    if (i.size > 0) {
      const a = [...i].join(`
`) + `
`;
      await hr.acquire(n, async function() {
        await e.write(n, a, {
          encoding: "utf8"
        });
      });
    } else
      await hr.acquire(n, async function() {
        await e.rm(n);
      });
  }
}
async function Au({ fs: t, gitdir: e, oid: r }) {
  const i = `objects/${r.slice(0, 2)}/${r.slice(2)}`;
  return t.exists(`${e}/${i}`);
}
async function Du({
  fs: t,
  cache: e,
  gitdir: r,
  oid: i,
  getExternalRefDelta: n
}) {
  let a = await t.readdir(te.join(r, "objects/pack"));
  a = a.filter((o) => o.endsWith(".idx"));
  for (const o of a) {
    const s = `${r}/objects/pack/${o}`, l = await la({
      fs: t,
      cache: e,
      filename: s,
      getExternalRefDelta: n
    });
    if (l.error) throw new Re(l.error);
    if (l.offsets.has(i))
      return !0;
  }
  return !1;
}
async function po({
  fs: t,
  cache: e,
  gitdir: r,
  oid: i,
  format: n = "content"
}) {
  const a = (s) => Je({ fs: t, cache: e, gitdir: r, oid: s });
  let o = await Au({ fs: t, gitdir: r, oid: i });
  return o || (o = await Du({
    fs: t,
    cache: e,
    gitdir: r,
    oid: i,
    getExternalRefDelta: a
  })), o;
}
function Ou(t) {
  const n = "5041434b" + "00000002" + "00000000";
  return t.slice(0, 12).toString("hex") === n;
}
function gs(t, e) {
  const r = t.map((i) => i.split("=", 1)[0]);
  return e.filter((i) => {
    const n = i.split("=", 1)[0];
    return r.includes(n);
  });
}
const qi = {
  name: "isomorphic-git",
  version: "1.30.1",
  agent: "git/isomorphic-git@1.30.1"
};
class $i {
  constructor() {
    this._queue = [];
  }
  write(e) {
    if (this._ended)
      throw Error("You cannot write to a FIFO that has already been ended!");
    if (this._waiting) {
      const r = this._waiting;
      this._waiting = null, r({ value: e });
    } else
      this._queue.push(e);
  }
  end() {
    if (this._ended = !0, this._waiting) {
      const e = this._waiting;
      this._waiting = null, e({ done: !0 });
    }
  }
  destroy(e) {
    this.error = e, this.end();
  }
  async next() {
    if (this._queue.length > 0)
      return { value: this._queue.shift() };
    if (this._ended)
      return { done: !0 };
    if (this._waiting)
      throw Error(
        "You cannot call read until the previous call to read has returned!"
      );
    return new Promise((e) => {
      this._waiting = e;
    });
  }
}
function Cu(t) {
  const e = t.indexOf("\r"), r = t.indexOf(`
`);
  return e === -1 && r === -1 ? -1 : e === -1 ? r + 1 : r === -1 ? e + 1 : r === e + 1 ? r + 1 : Math.min(e, r) + 1;
}
function ys(t) {
  const e = new $i();
  let r = "";
  return (async () => (await gi(t, (i) => {
    for (i = i.toString("utf8"), r += i; ; ) {
      const n = Cu(r);
      if (n === -1) break;
      e.write(r.slice(0, n)), r = r.slice(n);
    }
  }), r.length > 0 && e.write(r), e.end()))(), e;
}
class _s {
  static demux(e) {
    const r = Qe.streamReader(e), i = new $i(), n = new $i(), a = new $i(), o = async function() {
      const s = await r();
      if (s === null) return o();
      if (s === !0) {
        i.end(), a.end(), e.error ? n.destroy(e.error) : n.end();
        return;
      }
      switch (s[0]) {
        case 1: {
          n.write(s.slice(1));
          break;
        }
        case 2: {
          a.write(s.slice(1));
          break;
        }
        case 3: {
          const l = s.slice(1);
          a.write(l), i.end(), a.end(), n.destroy(new Error(l.toString("utf8")));
          return;
        }
        default:
          i.write(s);
      }
      o();
    };
    return o(), {
      packetlines: i,
      packfile: n,
      progress: a
    };
  }
  // static mux ({
  //   protocol, // 'side-band' or 'side-band-64k'
  //   packetlines,
  //   packfile,
  //   progress,
  //   error
  // }) {
  //   const MAX_PACKET_LENGTH = protocol === 'side-band-64k' ? 999 : 65519
  //   let output = new PassThrough()
  //   packetlines.on('data', data => {
  //     if (data === null) {
  //       output.write(GitPktLine.flush())
  //     } else {
  //       output.write(GitPktLine.encode(data))
  //     }
  //   })
  //   let packfileWasEmpty = true
  //   let packfileEnded = false
  //   let progressEnded = false
  //   let errorEnded = false
  //   let goodbye = Buffer.concat([
  //     GitPktLine.encode(Buffer.from('010A', 'hex')),
  //     GitPktLine.flush()
  //   ])
  //   packfile
  //     .on('data', data => {
  //       packfileWasEmpty = false
  //       const buffers = splitBuffer(data, MAX_PACKET_LENGTH)
  //       for (const buffer of buffers) {
  //         output.write(
  //           GitPktLine.encode(Buffer.concat([Buffer.from('01', 'hex'), buffer]))
  //         )
  //       }
  //     })
  //     .on('end', () => {
  //       packfileEnded = true
  //       if (!packfileWasEmpty) output.write(goodbye)
  //       if (progressEnded && errorEnded) output.end()
  //     })
  //   progress
  //     .on('data', data => {
  //       const buffers = splitBuffer(data, MAX_PACKET_LENGTH)
  //       for (const buffer of buffers) {
  //         output.write(
  //           GitPktLine.encode(Buffer.concat([Buffer.from('02', 'hex'), buffer]))
  //         )
  //       }
  //     })
  //     .on('end', () => {
  //       progressEnded = true
  //       if (packfileEnded && errorEnded) output.end()
  //     })
  //   error
  //     .on('data', data => {
  //       const buffers = splitBuffer(data, MAX_PACKET_LENGTH)
  //       for (const buffer of buffers) {
  //         output.write(
  //           GitPktLine.encode(Buffer.concat([Buffer.from('03', 'hex'), buffer]))
  //         )
  //       }
  //     })
  //     .on('end', () => {
  //       errorEnded = true
  //       if (progressEnded && packfileEnded) output.end()
  //     })
  //   return output
  // }
}
async function Fu(t) {
  const { packetlines: e, packfile: r, progress: i } = _s.demux(t), n = [], a = [], o = [];
  let s = !1, l = !1;
  return new Promise((f, u) => {
    gi(e, (m) => {
      const g = m.toString("utf8").trim();
      if (g.startsWith("shallow")) {
        const y = g.slice(-41).trim();
        y.length !== 40 && u(new ir(y)), n.push(y);
      } else if (g.startsWith("unshallow")) {
        const y = g.slice(-41).trim();
        y.length !== 40 && u(new ir(y)), a.push(y);
      } else if (g.startsWith("ACK")) {
        const [, y, E] = g.split(" ");
        o.push({ oid: y, status: E }), E || (l = !0);
      } else g.startsWith("NAK") ? (s = !0, l = !0) : (l = !0, s = !0);
      l && (t.error ? u(t.error) : f({ shallows: n, unshallows: a, acks: o, nak: s, packfile: r, progress: i }));
    }).finally(() => {
      l || (t.error ? u(t.error) : f({ shallows: n, unshallows: a, acks: o, nak: s, packfile: r, progress: i }));
    });
  });
}
function Nu({
  capabilities: t = [],
  wants: e = [],
  haves: r = [],
  shallows: i = [],
  depth: n = null,
  since: a = null,
  exclude: o = []
}) {
  const s = [];
  e = [...new Set(e)];
  let l = ` ${t.join(" ")}`;
  for (const f of e)
    s.push(Qe.encode(`want ${f}${l}
`)), l = "";
  for (const f of i)
    s.push(Qe.encode(`shallow ${f}
`));
  n !== null && s.push(Qe.encode(`deepen ${n}
`)), a !== null && s.push(
    Qe.encode(`deepen-since ${Math.floor(a.valueOf() / 1e3)}
`)
  );
  for (const f of o)
    s.push(Qe.encode(`deepen-not ${f}
`));
  s.push(Qe.flush());
  for (const f of r)
    s.push(Qe.encode(`have ${f}
`));
  return s.push(Qe.encode(`done
`)), s;
}
async function fa({
  fs: t,
  cache: e,
  http: r,
  onProgress: i,
  onMessage: n,
  onAuth: a,
  onAuthSuccess: o,
  onAuthFailure: s,
  gitdir: l,
  ref: f,
  remoteRef: u,
  remote: m,
  url: g,
  corsProxy: y,
  depth: E = null,
  since: A = null,
  exclude: T = [],
  relative: I = !1,
  tags: R = !1,
  singleBranch: D = !1,
  headers: L = {},
  prune: U = !1,
  pruneTags: M = !1
}) {
  const B = f || await cr({ fs: t, gitdir: l, test: !0 }), O = await it.get({ fs: t, gitdir: l }), W = m || B && await O.get(`branch.${B}.remote`) || "origin", z = g || await O.get(`remote.${W}.url`);
  if (typeof z > "u")
    throw new yt("remote OR url");
  const Y = u || B && await O.get(`branch.${B}.merge`) || f || "HEAD";
  y === void 0 && (y = await O.get("http.corsProxy"));
  const F = Wi.getRemoteHelperFor({ url: z }), J = await F.discover({
    http: r,
    onAuth: a,
    onAuthSuccess: o,
    onAuthFailure: s,
    corsProxy: y,
    service: "git-upload-pack",
    url: z,
    headers: L,
    protocolVersion: 1
  }), se = J.auth, _e = J.refs;
  if (_e.size === 0)
    return {
      defaultBranch: null,
      fetchHead: null,
      fetchHeadDescription: null
    };
  if (E !== null && !J.capabilities.has("shallow"))
    throw new rr("shallow", "depth");
  if (A !== null && !J.capabilities.has("deepen-since"))
    throw new rr("deepen-since", "since");
  if (T.length > 0 && !J.capabilities.has("deepen-not"))
    throw new rr("deepen-not", "exclude");
  if (I === !0 && !J.capabilities.has("deepen-relative"))
    throw new rr("deepen-relative", "relative");
  const { oid: ie, fullref: X } = ae.resolveAgainstMap({
    ref: Y,
    map: _e
  });
  for (const we of _e.keys())
    we === X || we === "HEAD" || we.startsWith("refs/heads/") || R && we.startsWith("refs/tags/") || _e.delete(we);
  const ne = gs(
    [...J.capabilities],
    [
      "multi_ack_detailed",
      "no-done",
      "side-band-64k",
      // Note: I removed 'thin-pack' option since our code doesn't "fatten" packfiles,
      // which is necessary for compatibility with git. It was the cause of mysterious
      // 'fatal: pack has [x] unresolved deltas' errors that plagued us for some time.
      // isomorphic-git is perfectly happy with thin packfiles in .git/objects/pack but
      // canonical git it turns out is NOT.
      "ofs-delta",
      `agent=${qi.agent}`
    ]
  );
  I && ne.push("deepen-relative");
  const de = D ? [ie] : _e.values(), Se = D ? [B] : await ae.listRefs({
    fs: t,
    gitdir: l,
    filepath: "refs"
  });
  let Te = [];
  for (let we of Se)
    try {
      we = await ae.expand({ fs: t, gitdir: l, ref: we });
      const Oe = await ae.resolve({ fs: t, gitdir: l, ref: we });
      await po({ fs: t, cache: e, gitdir: l, oid: Oe }) && Te.push(Oe);
    } catch {
    }
  Te = [...new Set(Te)];
  const be = await Kr.read({ fs: t, gitdir: l }), Ae = J.capabilities.has("shallow") ? [...be] : [], ye = Nu({
    capabilities: ne,
    wants: de,
    haves: Te,
    shallows: Ae,
    depth: E,
    since: A,
    exclude: T
  }), $e = fe.from(await Ni(ye)), ke = await F.connect({
    http: r,
    onProgress: i,
    corsProxy: y,
    service: "git-upload-pack",
    url: z,
    auth: se,
    body: [$e],
    headers: L
  }), Ee = await Fu(ke.body);
  ke.headers && (Ee.headers = ke.headers);
  for (const we of Ee.shallows)
    if (!be.has(we))
      try {
        const { object: Oe } = await Je({ fs: t, cache: e, gitdir: l, oid: we }), Ve = new Ye(Oe), Me = await Promise.all(
          Ve.headers().parent.map((Ce) => po({ fs: t, cache: e, gitdir: l, oid: Ce }))
        );
        Me.length === 0 || Me.every((Ce) => Ce) || be.add(we);
      } catch {
        be.add(we);
      }
  for (const we of Ee.unshallows)
    be.delete(we);
  if (await Kr.write({ fs: t, gitdir: l, oids: be }), D) {
    const we = /* @__PURE__ */ new Map([[X, ie]]), Oe = /* @__PURE__ */ new Map();
    let Ve = 10, Me = X;
    for (; Ve--; ) {
      const xe = J.symrefs.get(Me);
      if (xe === void 0) break;
      Oe.set(Me, xe), Me = xe;
    }
    const ze = _e.get(Me);
    ze && we.set(Me, ze);
    const { pruned: Ce } = await ae.updateRemoteRefs({
      fs: t,
      gitdir: l,
      remote: W,
      refs: we,
      symrefs: Oe,
      tags: R,
      prune: U
    });
    U && (Ee.pruned = Ce);
  } else {
    const { pruned: we } = await ae.updateRemoteRefs({
      fs: t,
      gitdir: l,
      remote: W,
      refs: _e,
      symrefs: J.symrefs,
      tags: R,
      prune: U,
      pruneTags: M
    });
    U && (Ee.pruned = we);
  }
  if (Ee.HEAD = J.symrefs.get("HEAD"), Ee.HEAD === void 0) {
    const { oid: we } = ae.resolveAgainstMap({
      ref: "HEAD",
      map: _e
    });
    for (const [Oe, Ve] of _e.entries())
      if (Oe !== "HEAD" && Ve === we) {
        Ee.HEAD = Oe;
        break;
      }
  }
  const De = X.startsWith("refs/tags") ? "tag" : "branch";
  if (Ee.FETCH_HEAD = {
    oid: ie,
    description: `${De} '${gr(X)}' of ${z}`
  }, i || n) {
    const we = ys(Ee.progress);
    gi(we, async (Oe) => {
      if (n && await n(Oe), i) {
        const Ve = Oe.match(/([^:]*).*\((\d+?)\/(\d+?)\)/);
        Ve && await i({
          phase: Ve[1].trim(),
          loaded: parseInt(Ve[2], 10),
          total: parseInt(Ve[3], 10)
        });
      }
    });
  }
  const qe = fe.from(await Ni(Ee.packfile));
  if (ke.body.error) throw ke.body.error;
  const rt = qe.slice(-20).toString("hex"), je = {
    defaultBranch: Ee.HEAD,
    fetchHead: Ee.FETCH_HEAD.oid,
    fetchHeadDescription: Ee.FETCH_HEAD.description
  };
  if (Ee.headers && (je.headers = Ee.headers), U && (je.pruned = Ee.pruned), rt !== "" && !Ou(qe)) {
    je.packfile = `objects/pack/pack-${rt}.pack`;
    const we = te.join(l, je.packfile);
    await t.write(we, qe);
    const Oe = (Me) => Je({ fs: t, cache: e, gitdir: l, oid: Me }), Ve = await Tr.fromPack({
      pack: qe,
      getExternalRefDelta: Oe,
      onProgress: i
    });
    await t.write(we.replace(/\.pack$/, ".idx"), await Ve.toBuffer());
  }
  return je;
}
async function bs({
  fs: t,
  bare: e = !1,
  dir: r,
  gitdir: i = e ? r : te.join(r, ".git"),
  defaultBranch: n = "master"
}) {
  if (await t.exists(i + "/config")) return;
  let a = [
    "hooks",
    "info",
    "objects/info",
    "objects/pack",
    "refs/heads",
    "refs/tags"
  ];
  a = a.map((o) => i + "/" + o);
  for (const o of a)
    await t.mkdir(o);
  await t.write(
    i + "/config",
    `[core]
	repositoryformatversion = 0
	filemode = false
	bare = ${e}
` + (e ? "" : `	logallrefupdates = true
`) + `	symlinks = false
	ignorecase = true
`
  ), await t.write(i + "/HEAD", `ref: refs/heads/${n}
`);
}
async function Mu({
  fs: t,
  cache: e,
  http: r,
  onProgress: i,
  onMessage: n,
  onAuth: a,
  onAuthSuccess: o,
  onAuthFailure: s,
  onPostCheckout: l,
  dir: f,
  gitdir: u,
  url: m,
  corsProxy: g,
  ref: y,
  remote: E,
  depth: A,
  since: T,
  exclude: I,
  relative: R,
  singleBranch: D,
  noCheckout: L,
  noTags: U,
  headers: M
}) {
  try {
    if (await bs({ fs: t, gitdir: u }), await ds({ fs: t, gitdir: u, remote: E, url: m, force: !1 }), g) {
      const W = await it.get({ fs: t, gitdir: u });
      await W.set("http.corsProxy", g), await it.save({ fs: t, gitdir: u, config: W });
    }
    const { defaultBranch: B, fetchHead: O } = await fa({
      fs: t,
      cache: e,
      http: r,
      onProgress: i,
      onMessage: n,
      onAuth: a,
      onAuthSuccess: o,
      onAuthFailure: s,
      gitdir: u,
      ref: y,
      remote: E,
      corsProxy: g,
      depth: A,
      since: T,
      exclude: I,
      relative: R,
      singleBranch: D,
      headers: M,
      tags: !U
    });
    if (O === null) return;
    y = y || B, y = y.replace("refs/heads/", ""), await ua({
      fs: t,
      cache: e,
      onProgress: i,
      onPostCheckout: l,
      dir: f,
      gitdir: u,
      ref: y,
      remote: E,
      noCheckout: L
    });
  } catch (B) {
    throw await t.rmdir(u, { recursive: !0, maxRetries: 10 }).catch(() => {
    }), B;
  }
}
async function Uu({
  fs: t,
  http: e,
  onProgress: r,
  onMessage: i,
  onAuth: n,
  onAuthSuccess: a,
  onAuthFailure: o,
  onPostCheckout: s,
  dir: l,
  gitdir: f = te.join(l, ".git"),
  url: u,
  corsProxy: m = void 0,
  ref: g = void 0,
  remote: y = "origin",
  depth: E = void 0,
  since: A = void 0,
  exclude: T = [],
  relative: I = !1,
  singleBranch: R = !1,
  noCheckout: D = !1,
  noTags: L = !1,
  headers: U = {},
  cache: M = {}
}) {
  try {
    return H("fs", t), H("http", e), H("gitdir", f), D || H("dir", l), H("url", u), await Mu({
      fs: new me(t),
      cache: M,
      http: e,
      onProgress: r,
      onMessage: i,
      onAuth: n,
      onAuthSuccess: a,
      onAuthFailure: o,
      onPostCheckout: s,
      dir: l,
      gitdir: f,
      url: u,
      corsProxy: m,
      ref: g,
      remote: y,
      depth: E,
      since: A,
      exclude: T,
      relative: I,
      singleBranch: R,
      noCheckout: D,
      noTags: L,
      headers: U
    });
  } catch (B) {
    throw B.caller = "git.clone", B;
  }
}
async function Pu({
  fs: t,
  onSign: e,
  dir: r,
  gitdir: i = te.join(r, ".git"),
  message: n,
  author: a,
  committer: o,
  signingKey: s,
  amend: l = !1,
  dryRun: f = !1,
  noUpdateBranch: u = !1,
  ref: m,
  parent: g,
  tree: y,
  cache: E = {}
}) {
  try {
    H("fs", t), l || H("message", n), s && H("onSign", e);
    const A = new me(t);
    return await Hi({
      fs: A,
      cache: E,
      onSign: e,
      gitdir: i,
      message: n,
      author: a,
      committer: o,
      signingKey: s,
      amend: l,
      dryRun: f,
      noUpdateBranch: u,
      ref: m,
      parent: g,
      tree: y
    });
  } catch (A) {
    throw A.caller = "git.commit", A;
  }
}
async function Lu({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  fullname: i = !1,
  test: n = !1
}) {
  try {
    return H("fs", t), H("gitdir", r), await cr({
      fs: new me(t),
      gitdir: r,
      fullname: i,
      test: n
    });
  } catch (a) {
    throw a.caller = "git.currentBranch", a;
  }
}
async function ju({ fs: t, gitdir: e, ref: r }) {
  if (r = r.startsWith("refs/heads/") ? r : `refs/heads/${r}`, !await ae.exists({ fs: t, gitdir: e, ref: r }))
    throw new Le(r);
  const n = await ae.expand({ fs: t, gitdir: e, ref: r }), a = await cr({ fs: t, gitdir: e, fullname: !0 });
  if (n === a) {
    const l = await ae.resolve({ fs: t, gitdir: e, ref: n });
    await ae.writeRef({ fs: t, gitdir: e, ref: "HEAD", value: l });
  }
  await ae.deleteRef({ fs: t, gitdir: e, ref: n });
  const o = gr(r), s = await it.get({ fs: t, gitdir: e });
  await s.deleteSection("branch", o), await it.save({ fs: t, gitdir: e, config: s });
}
async function zu({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  ref: i
}) {
  try {
    return H("fs", t), H("ref", i), await ju({
      fs: new me(t),
      gitdir: r,
      ref: i
    });
  } catch (n) {
    throw n.caller = "git.deleteBranch", n;
  }
}
async function Hu({ fs: t, dir: e, gitdir: r = te.join(e, ".git"), ref: i }) {
  try {
    H("fs", t), H("ref", i), await ae.deleteRef({ fs: new me(t), gitdir: r, ref: i });
  } catch (n) {
    throw n.caller = "git.deleteRef", n;
  }
}
async function Wu({ fs: t, gitdir: e, remote: r }) {
  const i = await it.get({ fs: t, gitdir: e });
  await i.deleteSection("remote", r), await it.save({ fs: t, gitdir: e, config: i });
}
async function qu({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  remote: i
}) {
  try {
    return H("fs", t), H("remote", i), await Wu({
      fs: new me(t),
      gitdir: r,
      remote: i
    });
  } catch (n) {
    throw n.caller = "git.deleteRemote", n;
  }
}
async function Gu({ fs: t, gitdir: e, ref: r }) {
  r = r.startsWith("refs/tags/") ? r : `refs/tags/${r}`, await ae.deleteRef({ fs: t, gitdir: e, ref: r });
}
async function Zu({ fs: t, dir: e, gitdir: r = te.join(e, ".git"), ref: i }) {
  try {
    return H("fs", t), H("ref", i), await Gu({
      fs: new me(t),
      gitdir: r,
      ref: i
    });
  } catch (n) {
    throw n.caller = "git.deleteTag", n;
  }
}
async function Vu({ fs: t, gitdir: e, oid: r }) {
  const i = r.slice(0, 2);
  return (await t.readdir(`${e}/objects/${i}`)).map((a) => `${i}${a}`).filter((a) => a.startsWith(r));
}
async function Xu({
  fs: t,
  cache: e,
  gitdir: r,
  oid: i,
  getExternalRefDelta: n
}) {
  const a = [];
  let o = await t.readdir(te.join(r, "objects/pack"));
  o = o.filter((s) => s.endsWith(".idx"));
  for (const s of o) {
    const l = `${r}/objects/pack/${s}`, f = await la({
      fs: t,
      cache: e,
      filename: l,
      getExternalRefDelta: n
    });
    if (f.error) throw new Re(f.error);
    for (const u of f.offsets.keys())
      u.startsWith(i) && a.push(u);
  }
  return a;
}
async function Yu({ fs: t, cache: e, gitdir: r, oid: i }) {
  const n = (s) => Je({ fs: t, cache: e, gitdir: r, oid: s }), a = await Vu({ fs: t, gitdir: r, oid: i }), o = await Xu({
    fs: t,
    cache: e,
    gitdir: r,
    oid: i,
    getExternalRefDelta: n
  });
  for (const s of o)
    a.indexOf(s) === -1 && a.push(s);
  if (a.length === 1)
    return a[0];
  throw a.length > 1 ? new ti("oids", i, a) : new Le(`an object matching "${i}"`);
}
async function Ku({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  oid: i,
  cache: n = {}
}) {
  try {
    return H("fs", t), H("gitdir", r), H("oid", i), await Yu({
      fs: new me(t),
      cache: n,
      gitdir: r,
      oid: i
    });
  } catch (a) {
    throw a.caller = "git.expandOid", a;
  }
}
async function Ju({ fs: t, dir: e, gitdir: r = te.join(e, ".git"), ref: i }) {
  try {
    return H("fs", t), H("gitdir", r), H("ref", i), await ae.expand({
      fs: new me(t),
      gitdir: r,
      ref: i
    });
  } catch (n) {
    throw n.caller = "git.expandRef", n;
  }
}
async function ha({ fs: t, cache: e, gitdir: r, oids: i }) {
  const n = {}, a = i.length;
  let o = i.map((s, l) => ({ index: l, oid: s }));
  for (; o.length; ) {
    const s = /* @__PURE__ */ new Set();
    for (const { oid: f, index: u } of o)
      n[f] || (n[f] = /* @__PURE__ */ new Set()), n[f].add(u), n[f].size === a && s.add(f);
    if (s.size > 0)
      return [...s];
    const l = /* @__PURE__ */ new Map();
    for (const { oid: f, index: u } of o)
      try {
        const { object: m } = await Je({ fs: t, cache: e, gitdir: r, oid: f }), g = Ye.from(m), { parent: y } = g.parseHeaders();
        for (const E of y)
          (!n[E] || !n[E].has(u)) && l.set(E + ":" + u, { oid: E, index: u });
      } catch {
      }
    o = Array.from(l.values());
  }
  return [];
}
const Rn = /^.*(\r?\n|$)/gm;
function Qu({ branches: t, contents: e }) {
  const r = t[1], i = t[2], n = e[0], a = e[1], o = e[2], s = a.match(Rn), l = n.match(Rn), f = o.match(Rn), u = yl(s, l, f), m = 7;
  let g = "", y = !0;
  for (const E of u)
    E.ok && (g += E.ok.join("")), E.conflict && (y = !1, g += `${"<".repeat(m)} ${r}
`, g += E.conflict.a.join(""), g += `${"=".repeat(m)}
`, g += E.conflict.b.join(""), g += `${">".repeat(m)} ${i}
`);
  return { cleanMerge: y, mergedText: g };
}
async function ef({
  fs: t,
  cache: e,
  dir: r,
  gitdir: i = te.join(r, ".git"),
  index: n,
  ourOid: a,
  baseOid: o,
  theirOid: s,
  ourName: l = "ours",
  baseName: f = "base",
  theirName: u = "theirs",
  dryRun: m = !1,
  abortOnConflict: g = !0,
  mergeDriver: y
}) {
  const E = $t({ ref: a }), A = $t({ ref: o }), T = $t({ ref: s }), I = [], R = [], D = [], L = [], U = await ar({
    fs: t,
    cache: e,
    dir: r,
    gitdir: i,
    trees: [E, A, T],
    map: async function(M, [B, O, W]) {
      const z = Ai(M), Y = await Fi(B, O), F = await Fi(W, O);
      switch (`${Y}-${F}`) {
        case "false-false":
          return {
            mode: await O.mode(),
            path: z,
            oid: await O.oid(),
            type: await O.type()
          };
        case "false-true":
          return W ? {
            mode: await W.mode(),
            path: z,
            oid: await W.oid(),
            type: await W.type()
          } : void 0;
        case "true-false":
          return B ? {
            mode: await B.mode(),
            path: z,
            oid: await B.oid(),
            type: await B.type()
          } : void 0;
        case "true-true": {
          if (B && O && W && await B.type() === "blob" && await O.type() === "blob" && await W.type() === "blob")
            return tf({
              fs: t,
              gitdir: i,
              path: z,
              ours: B,
              base: O,
              theirs: W,
              ourName: l,
              baseName: f,
              theirName: u,
              mergeDriver: y
            }).then(async (J) => {
              if (J.cleanMerge)
                g || n.insert({ filepath: M, oid: J.mergeResult.oid, stage: 0 });
              else if (I.push(M), R.push(M), !g) {
                const se = await O.oid(), _e = await B.oid(), ie = await W.oid();
                n.delete({ filepath: M }), n.insert({ filepath: M, oid: se, stage: 1 }), n.insert({ filepath: M, oid: _e, stage: 2 }), n.insert({ filepath: M, oid: ie, stage: 3 });
              }
              return J.mergeResult;
            });
          if (O && !B && W && await O.type() === "blob" && await W.type() === "blob") {
            if (I.push(M), D.push(M), !g) {
              const J = await O.oid(), se = await W.oid();
              n.delete({ filepath: M }), n.insert({ filepath: M, oid: J, stage: 1 }), n.insert({ filepath: M, oid: se, stage: 3 });
            }
            return {
              mode: await W.mode(),
              oid: await W.oid(),
              type: "blob",
              path: z
            };
          }
          if (O && B && !W && await O.type() === "blob" && await B.type() === "blob") {
            if (I.push(M), L.push(M), !g) {
              const J = await O.oid(), se = await B.oid();
              n.delete({ filepath: M }), n.insert({ filepath: M, oid: J, stage: 1 }), n.insert({ filepath: M, oid: se, stage: 2 });
            }
            return {
              mode: await B.mode(),
              oid: await B.oid(),
              type: "blob",
              path: z
            };
          }
          if (O && !B && !W && await O.type() === "blob")
            return;
          throw new Ur();
        }
      }
    },
    /**
     * @param {TreeEntry} [parent]
     * @param {Array<TreeEntry>} children
     */
    reduce: I.length !== 0 && (!r || g) ? void 0 : async (M, B) => {
      const O = B.filter(Boolean);
      if (M && !(M && M.type === "tree" && O.length === 0)) {
        if (O.length > 0) {
          const z = new _t(O).toObject(), Y = await bt({
            fs: t,
            gitdir: i,
            type: "tree",
            object: z,
            dryRun: m
          });
          M.oid = Y;
        }
        return M;
      }
    }
  });
  return I.length !== 0 ? (r && !g && await ar({
    fs: t,
    cache: e,
    dir: r,
    gitdir: i,
    trees: [$t({ ref: U.oid })],
    map: async function(M, [B]) {
      const O = `${r}/${M}`;
      if (await B.type() === "blob") {
        const W = await B.mode(), z = new TextDecoder().decode(await B.content());
        await t.write(O, z, { mode: W });
      }
      return !0;
    }
  }), new Pr(
    I,
    R,
    D,
    L
  )) : U.oid;
}
async function tf({
  fs: t,
  gitdir: e,
  path: r,
  ours: i,
  base: n,
  theirs: a,
  ourName: o,
  theirName: s,
  baseName: l,
  dryRun: f,
  mergeDriver: u = Qu
}) {
  const m = "blob", g = await n.mode() === await i.mode() ? await a.mode() : await i.mode();
  if (await i.oid() === await a.oid())
    return {
      cleanMerge: !0,
      mergeResult: { mode: g, path: r, oid: await i.oid(), type: m }
    };
  if (await i.oid() === await n.oid())
    return {
      cleanMerge: !0,
      mergeResult: { mode: g, path: r, oid: await a.oid(), type: m }
    };
  if (await a.oid() === await n.oid())
    return {
      cleanMerge: !0,
      mergeResult: { mode: g, path: r, oid: await i.oid(), type: m }
    };
  const y = fe.from(await i.content()).toString("utf8"), E = fe.from(await n.content()).toString("utf8"), A = fe.from(await a.content()).toString("utf8"), { mergedText: T, cleanMerge: I } = await u({
    branches: [l, o, s],
    contents: [E, y, A],
    path: r
  }), R = await bt({
    fs: t,
    gitdir: e,
    type: "blob",
    object: fe.from(T, "utf8"),
    dryRun: f
  });
  return { cleanMerge: I, mergeResult: { mode: g, path: r, oid: R, type: m } };
}
async function vs({
  fs: t,
  cache: e,
  dir: r,
  gitdir: i,
  ours: n,
  theirs: a,
  fastForward: o = !0,
  fastForwardOnly: s = !1,
  dryRun: l = !1,
  noUpdateBranch: f = !1,
  abortOnConflict: u = !0,
  message: m,
  author: g,
  committer: y,
  signingKey: E,
  onSign: A,
  mergeDriver: T
}) {
  n === void 0 && (n = await cr({ fs: t, gitdir: i, fullname: !0 })), n = await ae.expand({
    fs: t,
    gitdir: i,
    ref: n
  }), a = await ae.expand({
    fs: t,
    gitdir: i,
    ref: a
  });
  const I = await ae.resolve({
    fs: t,
    gitdir: i,
    ref: n
  }), R = await ae.resolve({
    fs: t,
    gitdir: i,
    ref: a
  }), D = await ha({
    fs: t,
    cache: e,
    gitdir: i,
    oids: [I, R]
  });
  if (D.length !== 1)
    throw new Ur();
  const L = D[0];
  if (L === R)
    return {
      oid: I,
      alreadyMerged: !0
    };
  if (o && L === I)
    return !l && !f && await ae.writeRef({ fs: t, gitdir: i, ref: n, value: R }), {
      oid: R,
      fastForward: !0
    };
  {
    if (s)
      throw new ai();
    const U = await ot.acquire(
      { fs: t, gitdir: i, cache: e, allowUnmerged: !1 },
      async (B) => ef({
        fs: t,
        cache: e,
        dir: r,
        gitdir: i,
        index: B,
        ourOid: I,
        theirOid: R,
        baseOid: L,
        ourName: gr(n),
        baseName: "base",
        theirName: gr(a),
        dryRun: l,
        abortOnConflict: u,
        mergeDriver: T
      })
    );
    if (U instanceof Pr) throw U;
    return m || (m = `Merge branch '${gr(a)}' into ${gr(
      n
    )}`), {
      oid: await Hi({
        fs: t,
        cache: e,
        gitdir: i,
        message: m,
        ref: n,
        tree: U,
        parent: [I, R],
        author: g,
        committer: y,
        signingKey: E,
        onSign: A,
        dryRun: l,
        noUpdateBranch: f
      }),
      tree: U,
      mergeCommit: !0
    };
  }
}
async function Es({
  fs: t,
  cache: e,
  http: r,
  onProgress: i,
  onMessage: n,
  onAuth: a,
  onAuthSuccess: o,
  onAuthFailure: s,
  dir: l,
  gitdir: f,
  ref: u,
  url: m,
  remote: g,
  remoteRef: y,
  prune: E,
  pruneTags: A,
  fastForward: T,
  fastForwardOnly: I,
  corsProxy: R,
  singleBranch: D,
  headers: L,
  author: U,
  committer: M,
  signingKey: B
}) {
  try {
    if (!u) {
      const z = await cr({ fs: t, gitdir: f });
      if (!z)
        throw new yt("ref");
      u = z;
    }
    const { fetchHead: O, fetchHeadDescription: W } = await fa({
      fs: t,
      cache: e,
      http: r,
      onProgress: i,
      onMessage: n,
      onAuth: a,
      onAuthSuccess: o,
      onAuthFailure: s,
      gitdir: f,
      corsProxy: R,
      ref: u,
      url: m,
      remote: g,
      remoteRef: y,
      singleBranch: D,
      headers: L,
      prune: E,
      pruneTags: A
    });
    await vs({
      fs: t,
      cache: e,
      gitdir: f,
      ours: u,
      theirs: O,
      fastForward: T,
      fastForwardOnly: I,
      message: `Merge ${W}`,
      author: U,
      committer: M,
      signingKey: B,
      dryRun: !1,
      noUpdateBranch: !1
    }), await ua({
      fs: t,
      cache: e,
      onProgress: i,
      dir: l,
      gitdir: f,
      ref: u,
      remote: g,
      noCheckout: !1
    });
  } catch (O) {
    throw O.caller = "git.pull", O;
  }
}
async function rf({
  fs: t,
  http: e,
  onProgress: r,
  onMessage: i,
  onAuth: n,
  onAuthSuccess: a,
  onAuthFailure: o,
  dir: s,
  gitdir: l = te.join(s, ".git"),
  ref: f,
  url: u,
  remote: m,
  remoteRef: g,
  corsProxy: y,
  singleBranch: E,
  headers: A = {},
  cache: T = {}
}) {
  try {
    H("fs", t), H("http", e), H("gitdir", l);
    const I = {
      name: "",
      email: "",
      timestamp: Date.now(),
      timezoneOffset: 0
    };
    return await Es({
      fs: new me(t),
      cache: T,
      http: e,
      onProgress: r,
      onMessage: i,
      onAuth: n,
      onAuthSuccess: a,
      onAuthFailure: o,
      dir: s,
      gitdir: l,
      ref: f,
      url: u,
      remote: m,
      remoteRef: g,
      fastForwardOnly: !0,
      corsProxy: y,
      singleBranch: E,
      headers: A,
      author: I,
      committer: I
    });
  } catch (I) {
    throw I.caller = "git.fastForward", I;
  }
}
async function nf({
  fs: t,
  http: e,
  onProgress: r,
  onMessage: i,
  onAuth: n,
  onAuthSuccess: a,
  onAuthFailure: o,
  dir: s,
  gitdir: l = te.join(s, ".git"),
  ref: f,
  remote: u,
  remoteRef: m,
  url: g,
  corsProxy: y,
  depth: E = null,
  since: A = null,
  exclude: T = [],
  relative: I = !1,
  tags: R = !1,
  singleBranch: D = !1,
  headers: L = {},
  prune: U = !1,
  pruneTags: M = !1,
  cache: B = {}
}) {
  try {
    return H("fs", t), H("http", e), H("gitdir", l), await fa({
      fs: new me(t),
      cache: B,
      http: e,
      onProgress: r,
      onMessage: i,
      onAuth: n,
      onAuthSuccess: a,
      onAuthFailure: o,
      gitdir: l,
      ref: f,
      remote: u,
      remoteRef: m,
      url: g,
      corsProxy: y,
      depth: E,
      since: A,
      exclude: T,
      relative: I,
      tags: R,
      singleBranch: D,
      headers: L,
      prune: U,
      pruneTags: M
    });
  } catch (O) {
    throw O.caller = "git.fetch", O;
  }
}
async function af({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  oids: i,
  cache: n = {}
}) {
  try {
    return H("fs", t), H("gitdir", r), H("oids", i), await ha({
      fs: new me(t),
      cache: n,
      gitdir: r,
      oids: i
    });
  } catch (a) {
    throw a.caller = "git.findMergeBase", a;
  }
}
async function ks({ fs: t, filepath: e }) {
  if (await t.exists(te.join(e, ".git")))
    return e;
  {
    const r = Rr(e);
    if (r === e)
      throw new Le(`git root for ${e}`);
    return ks({ fs: t, filepath: r });
  }
}
async function of({ fs: t, filepath: e }) {
  try {
    return H("fs", t), H("filepath", e), await ks({ fs: new me(t), filepath: e });
  } catch (r) {
    throw r.caller = "git.findRoot", r;
  }
}
async function sf({ fs: t, dir: e, gitdir: r = te.join(e, ".git"), path: i }) {
  try {
    return H("fs", t), H("gitdir", r), H("path", i), await Yr({
      fs: new me(t),
      gitdir: r,
      path: i
    });
  } catch (n) {
    throw n.caller = "git.getConfig", n;
  }
}
async function cf({ fs: t, gitdir: e, path: r }) {
  return (await it.get({ fs: t, gitdir: e })).getall(r);
}
async function lf({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  path: i
}) {
  try {
    return H("fs", t), H("gitdir", r), H("path", i), await cf({
      fs: new me(t),
      gitdir: r,
      path: i
    });
  } catch (n) {
    throw n.caller = "git.getConfigAll", n;
  }
}
async function uf({
  http: t,
  onAuth: e,
  onAuthSuccess: r,
  onAuthFailure: i,
  corsProxy: n,
  url: a,
  headers: o = {},
  forPush: s = !1
}) {
  try {
    H("http", t), H("url", a);
    const f = await Wi.getRemoteHelperFor({ url: a }).discover({
      http: t,
      onAuth: e,
      onAuthSuccess: r,
      onAuthFailure: i,
      corsProxy: n,
      service: s ? "git-receive-pack" : "git-upload-pack",
      url: a,
      headers: o,
      protocolVersion: 1
    }), u = {
      capabilities: [...f.capabilities]
    };
    for (const [m, g] of f.refs) {
      const y = m.split("/"), E = y.pop();
      let A = u;
      for (const T of y)
        A[T] = A[T] || {}, A = A[T];
      A[E] = g;
    }
    for (const [m, g] of f.symrefs) {
      const y = m.split("/"), E = y.pop();
      let A = u;
      for (const T of y)
        A[T] = A[T] || {}, A = A[T];
      A[E] = g;
    }
    return u;
  } catch (l) {
    throw l.caller = "git.getRemoteInfo", l;
  }
}
function Ss(t, e, r, i) {
  const n = [];
  for (const [a, o] of t.refs) {
    if (e && !a.startsWith(e)) continue;
    if (a.endsWith("^{}")) {
      if (i) {
        const l = a.replace("^{}", ""), f = n[n.length - 1], u = f.ref === l ? f : n.find((m) => m.ref === l);
        if (u === void 0)
          throw new Error("I did not expect this to happen");
        u.peeled = o;
      }
      continue;
    }
    const s = { ref: a, oid: o };
    r && t.symrefs.has(a) && (s.target = t.symrefs.get(a)), n.push(s);
  }
  return n;
}
async function ff({
  http: t,
  onAuth: e,
  onAuthSuccess: r,
  onAuthFailure: i,
  corsProxy: n,
  url: a,
  headers: o = {},
  forPush: s = !1,
  protocolVersion: l = 2
}) {
  try {
    H("http", t), H("url", a);
    const u = await Wi.getRemoteHelperFor({ url: a }).discover({
      http: t,
      onAuth: e,
      onAuthSuccess: r,
      onAuthFailure: i,
      corsProxy: n,
      service: s ? "git-receive-pack" : "git-upload-pack",
      url: a,
      headers: o,
      protocolVersion: l
    });
    if (u.protocolVersion === 2)
      return {
        protocolVersion: u.protocolVersion,
        capabilities: u.capabilities2
      };
    const m = {};
    for (const g of u.capabilities) {
      const [y, E] = g.split("=");
      E ? m[y] = E : m[y] = !0;
    }
    return {
      protocolVersion: 1,
      capabilities: m,
      refs: Ss(u, void 0, !0, !0)
    };
  } catch (f) {
    throw f.caller = "git.getRemoteInfo2", f;
  }
}
async function hf({
  type: t,
  object: e,
  format: r = "content",
  oid: i = void 0
}) {
  return r !== "deflated" && (r !== "wrapped" && (e = Mr.wrap({ type: t, object: e })), i = await Yt(e)), { oid: i, object: e };
}
async function df({ object: t }) {
  try {
    H("object", t), typeof t == "string" ? t = fe.from(t, "utf8") : t = fe.from(t);
    const e = "blob", { oid: r, object: i } = await hf({
      type: "blob",
      format: "content",
      object: t
    });
    return { oid: r, type: e, object: new Uint8Array(i), format: "wrapped" };
  } catch (e) {
    throw e.caller = "git.hashBlob", e;
  }
}
async function wf({
  fs: t,
  cache: e,
  onProgress: r,
  dir: i,
  gitdir: n,
  filepath: a
}) {
  try {
    a = te.join(i, a);
    const o = await t.read(a), s = (f) => Je({ fs: t, cache: e, gitdir: n, oid: f }), l = await Tr.fromPack({
      pack: o,
      getExternalRefDelta: s,
      onProgress: r
    });
    return await t.write(a.replace(/\.pack$/, ".idx"), await l.toBuffer()), {
      oids: [...l.hashes]
    };
  } catch (o) {
    throw o.caller = "git.indexPack", o;
  }
}
async function pf({
  fs: t,
  onProgress: e,
  dir: r,
  gitdir: i = te.join(r, ".git"),
  filepath: n,
  cache: a = {}
}) {
  try {
    return H("fs", t), H("dir", r), H("gitdir", r), H("filepath", n), await wf({
      fs: new me(t),
      cache: a,
      onProgress: e,
      dir: r,
      gitdir: i,
      filepath: n
    });
  } catch (o) {
    throw o.caller = "git.indexPack", o;
  }
}
async function mf({
  fs: t,
  bare: e = !1,
  dir: r,
  gitdir: i = e ? r : te.join(r, ".git"),
  defaultBranch: n = "master"
}) {
  try {
    return H("fs", t), H("gitdir", i), e || H("dir", r), await bs({
      fs: new me(t),
      bare: e,
      dir: r,
      gitdir: i,
      defaultBranch: n
    });
  } catch (a) {
    throw a.caller = "git.init", a;
  }
}
async function xs({
  fs: t,
  cache: e,
  gitdir: r,
  oid: i,
  ancestor: n,
  depth: a
}) {
  const o = await Kr.read({ fs: t, gitdir: r });
  if (!i)
    throw new yt("oid");
  if (!n)
    throw new yt("ancestor");
  if (i === n) return !1;
  const s = [i], l = /* @__PURE__ */ new Set();
  let f = 0;
  for (; s.length; ) {
    if (f++ === a)
      throw new si(a);
    const u = s.shift(), { type: m, object: g } = await Je({
      fs: t,
      cache: e,
      gitdir: r,
      oid: u
    });
    if (m !== "commit")
      throw new pt(u, m, "commit");
    const y = Ye.from(g).parse();
    for (const E of y.parent)
      if (E === n) return !0;
    if (!o.has(u))
      for (const E of y.parent)
        l.has(E) || (s.push(E), l.add(E));
  }
  return !1;
}
async function gf({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  oid: i,
  ancestor: n,
  depth: a = -1,
  cache: o = {}
}) {
  try {
    return H("fs", t), H("gitdir", r), H("oid", i), H("ancestor", n), await xs({
      fs: new me(t),
      cache: o,
      gitdir: r,
      oid: i,
      ancestor: n,
      depth: a
    });
  } catch (s) {
    throw s.caller = "git.isDescendent", s;
  }
}
async function yf({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  filepath: i
}) {
  try {
    return H("fs", t), H("dir", e), H("gitdir", r), H("filepath", i), jr.isIgnored({
      fs: new me(t),
      dir: e,
      gitdir: r,
      filepath: i
    });
  } catch (n) {
    throw n.caller = "git.isIgnored", n;
  }
}
async function _f({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  remote: i
}) {
  try {
    return H("fs", t), H("gitdir", r), ae.listBranches({
      fs: new me(t),
      gitdir: r,
      remote: i
    });
  } catch (n) {
    throw n.caller = "git.listBranches", n;
  }
}
async function bf({ fs: t, gitdir: e, ref: r, cache: i }) {
  if (r) {
    const n = await ae.resolve({ gitdir: e, fs: t, ref: r }), a = [];
    return await Is({
      fs: t,
      cache: i,
      gitdir: e,
      oid: n,
      filenames: a,
      prefix: ""
    }), a;
  } else
    return ot.acquire({ fs: t, gitdir: e, cache: i }, async function(n) {
      return n.entries.map((a) => a.path);
    });
}
async function Is({
  fs: t,
  cache: e,
  gitdir: r,
  oid: i,
  filenames: n,
  prefix: a
}) {
  const { tree: o } = await zr({ fs: t, cache: e, gitdir: r, oid: i });
  for (const s of o)
    s.type === "tree" ? await Is({
      fs: t,
      cache: e,
      gitdir: r,
      oid: s.oid,
      filenames: n,
      prefix: te.join(a, s.path)
    }) : n.push(te.join(a, s.path));
}
async function vf({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  ref: i,
  cache: n = {}
}) {
  try {
    return H("fs", t), H("gitdir", r), await bf({
      fs: new me(t),
      cache: n,
      gitdir: r,
      ref: i
    });
  } catch (a) {
    throw a.caller = "git.listFiles", a;
  }
}
async function Ef({ fs: t, cache: e, gitdir: r, ref: i }) {
  let n;
  try {
    n = await ae.resolve({ gitdir: r, fs: t, ref: i });
  } catch (s) {
    if (s instanceof Le)
      return [];
  }
  return (await zr({
    fs: t,
    cache: e,
    gitdir: r,
    oid: n
  })).tree.map((s) => ({
    target: s.path,
    note: s.oid
  }));
}
async function kf({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  ref: i = "refs/notes/commits",
  cache: n = {}
}) {
  try {
    return H("fs", t), H("gitdir", r), H("ref", i), await Ef({
      fs: new me(t),
      cache: n,
      gitdir: r,
      ref: i
    });
  } catch (a) {
    throw a.caller = "git.listNotes", a;
  }
}
async function Sf({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  filepath: i
}) {
  try {
    return H("fs", t), H("gitdir", r), ae.listRefs({ fs: new me(t), gitdir: r, filepath: i });
  } catch (n) {
    throw n.caller = "git.listRefs", n;
  }
}
async function xf({ fs: t, gitdir: e }) {
  const r = await it.get({ fs: t, gitdir: e }), i = await r.getSubsections("remote");
  return Promise.all(
    i.map(async (a) => {
      const o = await r.get(`remote.${a}.url`);
      return { remote: a, url: o };
    })
  );
}
async function If({ fs: t, dir: e, gitdir: r = te.join(e, ".git") }) {
  try {
    return H("fs", t), H("gitdir", r), await xf({
      fs: new me(t),
      gitdir: r
    });
  } catch (i) {
    throw i.caller = "git.listRemotes", i;
  }
}
async function Rf(t) {
  const e = Qe.streamReader(t), r = [];
  let i;
  for (; i = await e(), i !== !0; ) {
    if (i === null) continue;
    i = i.toString("utf8").replace(/\n$/, "");
    const [n, a, ...o] = i.split(" "), s = { ref: a, oid: n };
    for (const l of o) {
      const [f, u] = l.split(":");
      f === "symref-target" ? s.target = u : f === "peeled" && (s.peeled = u);
    }
    r.push(s);
  }
  return r;
}
async function Tf({ prefix: t, symrefs: e, peelTags: r }) {
  const i = [];
  return i.push(Qe.encode(`command=ls-refs
`)), i.push(Qe.encode(`agent=${qi.agent}
`)), (r || e || t) && i.push(Qe.delim()), r && i.push(Qe.encode("peel")), e && i.push(Qe.encode("symrefs")), t && i.push(Qe.encode(`ref-prefix ${t}`)), i.push(Qe.flush()), i;
}
async function $f({
  http: t,
  onAuth: e,
  onAuthSuccess: r,
  onAuthFailure: i,
  corsProxy: n,
  url: a,
  headers: o = {},
  forPush: s = !1,
  protocolVersion: l = 2,
  prefix: f,
  symrefs: u,
  peelTags: m
}) {
  try {
    H("http", t), H("url", a);
    const g = await Mi.discover({
      http: t,
      onAuth: e,
      onAuthSuccess: r,
      onAuthFailure: i,
      corsProxy: n,
      service: s ? "git-receive-pack" : "git-upload-pack",
      url: a,
      headers: o,
      protocolVersion: l
    });
    if (g.protocolVersion === 1)
      return Ss(g, f, u, m);
    const y = await Tf({ prefix: f, symrefs: u, peelTags: m }), E = await Mi.connect({
      http: t,
      auth: g.auth,
      headers: o,
      corsProxy: n,
      service: s ? "git-receive-pack" : "git-upload-pack",
      url: a,
      body: y
    });
    return Rf(E.body);
  } catch (g) {
    throw g.caller = "git.listServerRefs", g;
  }
}
async function Bf({ fs: t, dir: e, gitdir: r = te.join(e, ".git") }) {
  try {
    return H("fs", t), H("gitdir", r), ae.listTags({ fs: new me(t), gitdir: r });
  } catch (i) {
    throw i.caller = "git.listTags", i;
  }
}
function Af(t, e) {
  return t.committer.timestamp - e.committer.timestamp;
}
const Df = "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391";
async function mo({ fs: t, cache: e, gitdir: r, oid: i, fileId: n }) {
  if (n === Df) return;
  const a = i;
  let o;
  const s = await Ar({ fs: t, cache: e, gitdir: r, oid: i }), l = s.tree;
  return n === s.oid ? o = s.path : (o = await Rs({
    fs: t,
    cache: e,
    gitdir: r,
    tree: l,
    fileId: n,
    oid: a
  }), Array.isArray(o) && (o.length === 0 ? o = void 0 : o.length === 1 && (o = o[0]))), o;
}
async function Rs({
  fs: t,
  cache: e,
  gitdir: r,
  tree: i,
  fileId: n,
  oid: a,
  filepaths: o = [],
  parentPath: s = ""
}) {
  const l = i.entries().map(function(f) {
    let u;
    return f.oid === n ? (u = te.join(s, f.path), o.push(u)) : f.type === "tree" && (u = Je({
      fs: t,
      cache: e,
      gitdir: r,
      oid: f.oid
    }).then(function({ object: m }) {
      return Rs({
        fs: t,
        cache: e,
        gitdir: r,
        tree: _t.from(m),
        fileId: n,
        oid: a,
        filepaths: o,
        parentPath: te.join(s, f.path)
      });
    })), u;
  });
  return await Promise.all(l), o;
}
async function Of({
  fs: t,
  cache: e,
  gitdir: r,
  filepath: i,
  ref: n,
  depth: a,
  since: o,
  force: s,
  follow: l
}) {
  const f = typeof o > "u" ? void 0 : Math.floor(o.valueOf() / 1e3), u = [], m = await Kr.read({ fs: t, gitdir: r }), g = await ae.resolve({ fs: t, gitdir: r, ref: n }), y = [await Or({ fs: t, cache: e, gitdir: r, oid: g })];
  let E, A, T;
  function I(R) {
    T && i && u.push(R);
  }
  for (; y.length > 0; ) {
    const R = y.pop();
    if (f !== void 0 && R.commit.committer.timestamp <= f)
      break;
    if (i) {
      let D;
      try {
        D = await pi({
          fs: t,
          cache: e,
          gitdir: r,
          oid: R.commit.tree,
          filepath: i
        }), A && E !== D && u.push(A), E = D, A = R, T = !0;
      } catch (L) {
        if (L instanceof Le) {
          let U = l && E;
          if (U && (U = await mo({
            fs: t,
            cache: e,
            gitdir: r,
            oid: R.commit.tree,
            fileId: E
          }), U))
            if (Array.isArray(U)) {
              if (A) {
                const M = await mo({
                  fs: t,
                  cache: e,
                  gitdir: r,
                  oid: A.commit.tree,
                  fileId: E
                });
                if (Array.isArray(M))
                  if (U = U.filter((B) => M.indexOf(B) === -1), U.length === 1)
                    U = U[0], i = U, A && u.push(A);
                  else {
                    U = !1, A && u.push(A);
                    break;
                  }
              }
            } else
              i = U, A && u.push(A);
          if (!U) {
            if (T && E && (u.push(A), !s))
              break;
            if (!s && !l) throw L;
          }
          A = R, T = !1;
        } else throw L;
      }
    } else
      u.push(R);
    if (a !== void 0 && u.length === a) {
      I(R);
      break;
    }
    if (!m.has(R.oid))
      for (const D of R.commit.parent) {
        const L = await Or({ fs: t, cache: e, gitdir: r, oid: D });
        y.map((U) => U.oid).includes(L.oid) || y.push(L);
      }
    y.length === 0 && I(R), y.sort((D, L) => Af(D.commit, L.commit));
  }
  return u;
}
async function Cf({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  filepath: i,
  ref: n = "HEAD",
  depth: a,
  since: o,
  // Date
  force: s,
  follow: l,
  cache: f = {}
}) {
  try {
    return H("fs", t), H("gitdir", r), H("ref", n), await Of({
      fs: new me(t),
      cache: f,
      gitdir: r,
      filepath: i,
      ref: n,
      depth: a,
      since: o,
      force: s,
      follow: l
    });
  } catch (u) {
    throw u.caller = "git.log", u;
  }
}
async function Ff({
  fs: t,
  onSign: e,
  dir: r,
  gitdir: i = te.join(r, ".git"),
  ours: n,
  theirs: a,
  fastForward: o = !0,
  fastForwardOnly: s = !1,
  dryRun: l = !1,
  noUpdateBranch: f = !1,
  abortOnConflict: u = !0,
  message: m,
  author: g,
  committer: y,
  signingKey: E,
  cache: A = {},
  mergeDriver: T
}) {
  try {
    H("fs", t), E && H("onSign", e);
    const I = new me(t), R = await or({ fs: I, gitdir: i, author: g });
    if (!R && (!s || !o))
      throw new ft("author");
    const D = await Dr({
      fs: I,
      gitdir: i,
      author: R,
      committer: y
    });
    if (!D && (!s || !o))
      throw new ft("committer");
    return await vs({
      fs: I,
      cache: A,
      dir: r,
      gitdir: i,
      ours: n,
      theirs: a,
      fastForward: o,
      fastForwardOnly: s,
      dryRun: l,
      noUpdateBranch: f,
      abortOnConflict: u,
      message: m,
      author: R,
      committer: D,
      signingKey: E,
      onSign: e,
      mergeDriver: T
    });
  } catch (I) {
    throw I.caller = "git.merge", I;
  }
}
const Nf = {
  commit: 16,
  tree: 32,
  blob: 48,
  tag: 64,
  ofs_delta: 96,
  ref_delta: 112
};
async function Ts({
  fs: t,
  cache: e,
  dir: r,
  gitdir: i = te.join(r, ".git"),
  oids: n
}) {
  const a = new qo(), o = [];
  function s(u, m) {
    const g = fe.from(u, m);
    o.push(g), a.update(g);
  }
  async function l({ stype: u, object: m }) {
    const g = Nf[u];
    let y = m.length, E = y > 15 ? 128 : 0;
    const A = y & 15;
    y = y >>> 4;
    let T = (E | g | A).toString(16);
    for (s(T, "hex"); E; )
      E = y > 127 ? 128 : 0, T = E | y & 127, s(Qn(2, T), "hex"), y = y >>> 7;
    s(fe.from(await ss(m)));
  }
  s("PACK"), s("00000002", "hex"), s(Qn(8, n.length), "hex");
  for (const u of n) {
    const { type: m, object: g } = await Je({ fs: t, cache: e, gitdir: i, oid: u });
    await l({ object: g, stype: m });
  }
  const f = a.digest();
  return o.push(f), o;
}
async function Mf({ fs: t, cache: e, gitdir: r, oids: i, write: n }) {
  const a = await Ts({ fs: t, cache: e, gitdir: r, oids: i }), o = fe.from(await Ni(a)), l = `pack-${o.slice(-20).toString("hex")}.pack`;
  return n ? (await t.write(te.join(r, `objects/pack/${l}`), o), { filename: l }) : {
    filename: l,
    packfile: new Uint8Array(o)
  };
}
async function Uf({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  oids: i,
  write: n = !1,
  cache: a = {}
}) {
  try {
    return H("fs", t), H("gitdir", r), H("oids", i), await Mf({
      fs: new me(t),
      cache: a,
      gitdir: r,
      oids: i,
      write: n
    });
  } catch (o) {
    throw o.caller = "git.packObjects", o;
  }
}
async function Pf({
  fs: t,
  http: e,
  onProgress: r,
  onMessage: i,
  onAuth: n,
  onAuthSuccess: a,
  onAuthFailure: o,
  dir: s,
  gitdir: l = te.join(s, ".git"),
  ref: f,
  url: u,
  remote: m,
  remoteRef: g,
  prune: y = !1,
  pruneTags: E = !1,
  fastForward: A = !0,
  fastForwardOnly: T = !1,
  corsProxy: I,
  singleBranch: R,
  headers: D = {},
  author: L,
  committer: U,
  signingKey: M,
  cache: B = {}
}) {
  try {
    H("fs", t), H("gitdir", l);
    const O = new me(t), W = await or({ fs: O, gitdir: l, author: L });
    if (!W) throw new ft("author");
    const z = await Dr({
      fs: O,
      gitdir: l,
      author: W,
      committer: U
    });
    if (!z) throw new ft("committer");
    return await Es({
      fs: O,
      cache: B,
      http: e,
      onProgress: r,
      onMessage: i,
      onAuth: n,
      onAuthSuccess: a,
      onAuthFailure: o,
      dir: s,
      gitdir: l,
      ref: f,
      url: u,
      remote: m,
      remoteRef: g,
      fastForward: A,
      fastForwardOnly: T,
      corsProxy: I,
      singleBranch: R,
      headers: D,
      author: W,
      committer: z,
      signingKey: M,
      prune: y,
      pruneTags: E
    });
  } catch (O) {
    throw O.caller = "git.pull", O;
  }
}
async function Lf({
  fs: t,
  cache: e,
  dir: r,
  gitdir: i = te.join(r, ".git"),
  start: n,
  finish: a
}) {
  const o = await Kr.read({ fs: t, gitdir: i }), s = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set();
  for (const m of n)
    s.add(await ae.resolve({ fs: t, gitdir: i, ref: m }));
  for (const m of a)
    try {
      const g = await ae.resolve({ fs: t, gitdir: i, ref: m });
      l.add(g);
    } catch {
    }
  const f = /* @__PURE__ */ new Set();
  async function u(m) {
    f.add(m);
    const { type: g, object: y } = await Je({ fs: t, cache: e, gitdir: i, oid: m });
    if (g === "tag") {
      const A = wt.from(y).headers().object;
      return u(A);
    }
    if (g !== "commit")
      throw new pt(m, g, "commit");
    if (!o.has(m)) {
      const A = Ye.from(y).headers().parent;
      for (m of A)
        !l.has(m) && !f.has(m) && await u(m);
    }
  }
  for (const m of s)
    await u(m);
  return f;
}
async function Tn({
  fs: t,
  cache: e,
  dir: r,
  gitdir: i = te.join(r, ".git"),
  oids: n
}) {
  const a = /* @__PURE__ */ new Set();
  async function o(s) {
    if (a.has(s)) return;
    a.add(s);
    const { type: l, object: f } = await Je({ fs: t, cache: e, gitdir: i, oid: s });
    if (l === "tag") {
      const m = wt.from(f).headers().object;
      await o(m);
    } else if (l === "commit") {
      const m = Ye.from(f).headers().tree;
      await o(m);
    } else if (l === "tree") {
      const u = _t.from(f);
      for (const m of u)
        m.type === "blob" && a.add(m.oid), m.type === "tree" && await o(m.oid);
    }
  }
  for (const s of n)
    await o(s);
  return a;
}
async function jf(t) {
  const e = {};
  let r = "";
  const i = Qe.streamReader(t);
  let n = await i();
  for (; n !== !0; )
    n !== null && (r += n.toString("utf8") + `
`), n = await i();
  const a = r.toString("utf8").split(`
`);
  if (n = a.shift(), !n.startsWith("unpack "))
    throw new _r('unpack ok" or "unpack [error message]', n);
  e.ok = n === "unpack ok", e.ok || (e.error = n.slice(7)), e.refs = {};
  for (const o of a) {
    if (o.trim() === "") continue;
    const s = o.slice(0, 2), l = o.slice(3);
    let f = l.indexOf(" ");
    f === -1 && (f = l.length);
    const u = l.slice(0, f), m = l.slice(f + 1);
    e.refs[u] = {
      ok: s === "ok",
      error: m
    };
  }
  return e;
}
async function zf({
  capabilities: t = [],
  triplets: e = []
}) {
  const r = [];
  let i = `\0 ${t.join(" ")}`;
  for (const n of e)
    r.push(
      Qe.encode(
        `${n.oldoid} ${n.oid} ${n.fullRef}${i}
`
      )
    ), i = "";
  return r.push(Qe.flush()), r;
}
async function Hf({
  fs: t,
  cache: e,
  http: r,
  onProgress: i,
  onMessage: n,
  onAuth: a,
  onAuthSuccess: o,
  onAuthFailure: s,
  onPrePush: l,
  gitdir: f,
  ref: u,
  remoteRef: m,
  remote: g,
  url: y,
  force: E = !1,
  delete: A = !1,
  corsProxy: T,
  headers: I = {}
}) {
  const R = u || await cr({ fs: t, gitdir: f });
  if (typeof R > "u")
    throw new yt("ref");
  const D = await it.get({ fs: t, gitdir: f });
  g = g || await D.get(`branch.${R}.pushRemote`) || await D.get("remote.pushDefault") || await D.get(`branch.${R}.remote`) || "origin";
  const L = y || await D.get(`remote.${g}.pushurl`) || await D.get(`remote.${g}.url`);
  if (typeof L > "u")
    throw new yt("remote OR url");
  const U = m || await D.get(`branch.${R}.merge`);
  if (typeof L > "u")
    throw new yt("remoteRef");
  T === void 0 && (T = await D.get("http.corsProxy"));
  const M = await ae.expand({ fs: t, gitdir: f, ref: R }), B = A ? "0000000000000000000000000000000000000000" : await ae.resolve({ fs: t, gitdir: f, ref: M }), O = Wi.getRemoteHelperFor({ url: L }), W = await O.discover({
    http: r,
    onAuth: a,
    onAuthSuccess: o,
    onAuthFailure: s,
    corsProxy: T,
    service: "git-receive-pack",
    url: L,
    headers: I,
    protocolVersion: 1
  }), z = W.auth;
  let Y;
  if (!U)
    Y = M;
  else
    try {
      Y = await ae.expandAgainstMap({
        ref: U,
        map: W.refs
      });
    } catch (be) {
      if (be instanceof Le)
        Y = U.startsWith("refs/") ? U : `refs/heads/${U}`;
      else
        throw be;
    }
  const F = W.refs.get(Y) || "0000000000000000000000000000000000000000";
  if (l && !await l({
    remote: g,
    url: L,
    localRef: { ref: A ? "(delete)" : M, oid: B },
    remoteRef: { ref: Y, oid: F }
  }))
    throw new Lr();
  const J = !W.capabilities.has("no-thin");
  let se = /* @__PURE__ */ new Set();
  if (!A) {
    const be = [...W.refs.values()];
    let Ae = /* @__PURE__ */ new Set();
    if (F !== "0000000000000000000000000000000000000000") {
      const ye = await ha({
        fs: t,
        cache: e,
        gitdir: f,
        oids: [B, F]
      });
      for (const $e of ye) be.push($e);
      J && (Ae = await Tn({ fs: t, cache: e, gitdir: f, oids: ye }));
    }
    if (!be.includes(B)) {
      const ye = await Lf({
        fs: t,
        cache: e,
        gitdir: f,
        start: [B],
        finish: be
      });
      se = await Tn({ fs: t, cache: e, gitdir: f, oids: ye });
    }
    if (J) {
      try {
        const ye = await ae.resolve({
          fs: t,
          gitdir: f,
          ref: `refs/remotes/${g}/HEAD`,
          depth: 2
        }), { oid: $e } = await ae.resolveAgainstMap({
          ref: ye.replace(`refs/remotes/${g}/`, ""),
          fullref: ye,
          map: W.refs
        }), ke = [$e];
        for (const Ee of await Tn({ fs: t, cache: e, gitdir: f, oids: ke }))
          Ae.add(Ee);
      } catch {
      }
      for (const ye of Ae)
        se.delete(ye);
    }
    if (B === F && (E = !0), !E) {
      if (M.startsWith("refs/tags") && F !== "0000000000000000000000000000000000000000")
        throw new Br("tag-exists");
      if (B !== "0000000000000000000000000000000000000000" && F !== "0000000000000000000000000000000000000000" && !await xs({
        fs: t,
        cache: e,
        gitdir: f,
        oid: B,
        ancestor: F,
        depth: -1
      }))
        throw new Br("not-fast-forward");
    }
  }
  const _e = gs(
    [...W.capabilities],
    ["report-status", "side-band-64k", `agent=${qi.agent}`]
  ), ie = await zf({
    capabilities: _e,
    triplets: [{ oldoid: F, oid: B, fullRef: Y }]
  }), X = A ? [] : await Ts({
    fs: t,
    cache: e,
    gitdir: f,
    oids: [...se]
  }), ne = await O.connect({
    http: r,
    onProgress: i,
    corsProxy: T,
    service: "git-receive-pack",
    url: L,
    auth: z,
    headers: I,
    body: [...ie, ...X]
  }), { packfile: de, progress: Se } = await _s.demux(ne.body);
  if (n) {
    const be = ys(Se);
    gi(be, async (Ae) => {
      await n(Ae);
    });
  }
  const Te = await jf(de);
  if (ne.headers && (Te.headers = ne.headers), g && Te.ok && Te.refs[Y].ok && !M.startsWith("refs/tags")) {
    const be = `refs/remotes/${g}/${Y.replace(
      "refs/heads",
      ""
    )}`;
    A ? await ae.deleteRef({ fs: t, gitdir: f, ref: be }) : await ae.writeRef({ fs: t, gitdir: f, ref: be, value: B });
  }
  if (Te.ok && Object.values(Te.refs).every((be) => be.ok))
    return Te;
  {
    const be = Object.entries(Te.refs).filter(([Ae, ye]) => !ye.ok).map(([Ae, ye]) => `
  - ${Ae}: ${ye.error}`).join("");
    throw new oi(be, Te);
  }
}
async function Wf({
  fs: t,
  http: e,
  onProgress: r,
  onMessage: i,
  onAuth: n,
  onAuthSuccess: a,
  onAuthFailure: o,
  onPrePush: s,
  dir: l,
  gitdir: f = te.join(l, ".git"),
  ref: u,
  remoteRef: m,
  remote: g = "origin",
  url: y,
  force: E = !1,
  delete: A = !1,
  corsProxy: T,
  headers: I = {},
  cache: R = {}
}) {
  try {
    return H("fs", t), H("http", e), H("gitdir", f), await Hf({
      fs: new me(t),
      cache: R,
      http: e,
      onProgress: r,
      onMessage: i,
      onAuth: n,
      onAuthSuccess: a,
      onAuthFailure: o,
      onPrePush: s,
      gitdir: f,
      ref: u,
      remoteRef: m,
      remote: g,
      url: y,
      force: E,
      delete: A,
      corsProxy: T,
      headers: I
    });
  } catch (D) {
    throw D.caller = "git.push", D;
  }
}
async function $s({ fs: t, cache: e, gitdir: r, oid: i }) {
  const { type: n, object: a } = await Je({ fs: t, cache: e, gitdir: r, oid: i });
  if (n === "tag")
    return i = wt.from(a).parse().object, $s({ fs: t, cache: e, gitdir: r, oid: i });
  if (n !== "blob")
    throw new pt(i, n, "blob");
  return { oid: i, blob: new Uint8Array(a) };
}
async function Bs({
  fs: t,
  cache: e,
  gitdir: r,
  oid: i,
  filepath: n = void 0
}) {
  return n !== void 0 && (i = await pi({ fs: t, cache: e, gitdir: r, oid: i, filepath: n })), await $s({
    fs: t,
    cache: e,
    gitdir: r,
    oid: i
  });
}
async function qf({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  oid: i,
  filepath: n,
  cache: a = {}
}) {
  try {
    return H("fs", t), H("gitdir", r), H("oid", i), await Bs({
      fs: new me(t),
      cache: a,
      gitdir: r,
      oid: i,
      filepath: n
    });
  } catch (o) {
    throw o.caller = "git.readBlob", o;
  }
}
async function As({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  oid: i,
  cache: n = {}
}) {
  try {
    return H("fs", t), H("gitdir", r), H("oid", i), await Or({
      fs: new me(t),
      cache: n,
      gitdir: r,
      oid: i
    });
  } catch (a) {
    throw a.caller = "git.readCommit", a;
  }
}
async function Gf({
  fs: t,
  cache: e,
  gitdir: r,
  ref: i = "refs/notes/commits",
  oid: n
}) {
  const a = await ae.resolve({ gitdir: r, fs: t, ref: i }), { blob: o } = await Bs({
    fs: t,
    cache: e,
    gitdir: r,
    oid: a,
    filepath: n
  });
  return o;
}
async function Zf({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  ref: i = "refs/notes/commits",
  oid: n,
  cache: a = {}
}) {
  try {
    return H("fs", t), H("gitdir", r), H("ref", i), H("oid", n), await Gf({
      fs: new me(t),
      cache: a,
      gitdir: r,
      ref: i,
      oid: n
    });
  } catch (o) {
    throw o.caller = "git.readNote", o;
  }
}
async function Vf({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  oid: i,
  format: n = "parsed",
  filepath: a = void 0,
  encoding: o = void 0,
  cache: s = {}
}) {
  try {
    H("fs", t), H("gitdir", r), H("oid", i);
    const l = new me(t);
    a !== void 0 && (i = await pi({
      fs: l,
      cache: s,
      gitdir: r,
      oid: i,
      filepath: a
    }));
    const u = await Je({
      fs: l,
      cache: s,
      gitdir: r,
      oid: i,
      format: n === "parsed" ? "content" : n
    });
    if (u.oid = i, n === "parsed")
      switch (u.format = "parsed", u.type) {
        case "commit":
          u.object = Ye.from(u.object).parse();
          break;
        case "tree":
          u.object = _t.from(u.object).entries();
          break;
        case "blob":
          o ? u.object = u.object.toString(o) : (u.object = new Uint8Array(u.object), u.format = "content");
          break;
        case "tag":
          u.object = wt.from(u.object).parse();
          break;
        default:
          throw new pt(
            u.oid,
            u.type,
            "blob|commit|tag|tree"
          );
      }
    else (u.format === "deflated" || u.format === "wrapped") && (u.type = u.format);
    return u;
  } catch (l) {
    throw l.caller = "git.readObject", l;
  }
}
async function Xf({ fs: t, cache: e, gitdir: r, oid: i }) {
  const { type: n, object: a } = await Je({
    fs: t,
    cache: e,
    gitdir: r,
    oid: i,
    format: "content"
  });
  if (n !== "tag")
    throw new pt(i, n, "tag");
  const o = wt.from(a);
  return {
    oid: i,
    tag: o.parse(),
    payload: o.payload()
  };
}
async function Yf({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  oid: i,
  cache: n = {}
}) {
  try {
    return H("fs", t), H("gitdir", r), H("oid", i), await Xf({
      fs: new me(t),
      cache: n,
      gitdir: r,
      oid: i
    });
  } catch (a) {
    throw a.caller = "git.readTag", a;
  }
}
async function Kf({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  oid: i,
  filepath: n = void 0,
  cache: a = {}
}) {
  try {
    return H("fs", t), H("gitdir", r), H("oid", i), await zr({
      fs: new me(t),
      cache: a,
      gitdir: r,
      oid: i,
      filepath: n
    });
  } catch (o) {
    throw o.caller = "git.readTree", o;
  }
}
async function Jf({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  filepath: i,
  cache: n = {}
}) {
  try {
    H("fs", t), H("gitdir", r), H("filepath", i), await ot.acquire(
      { fs: new me(t), gitdir: r, cache: n },
      async function(a) {
        a.delete({ filepath: i });
      }
    );
  } catch (a) {
    throw a.caller = "git.remove", a;
  }
}
async function Qf({
  fs: t,
  cache: e,
  onSign: r,
  gitdir: i,
  ref: n = "refs/notes/commits",
  oid: a,
  author: o,
  committer: s,
  signingKey: l
}) {
  let f;
  try {
    f = await ae.resolve({ gitdir: i, fs: t, ref: n });
  } catch (E) {
    if (!(E instanceof Le))
      throw E;
  }
  let m = (await zr({
    fs: t,
    gitdir: i,
    oid: f || "4b825dc642cb6eb9a060e54bf8d69288fbee4904"
  })).tree;
  m = m.filter((E) => E.path !== a);
  const g = await mi({
    fs: t,
    gitdir: i,
    tree: m
  });
  return await Hi({
    fs: t,
    cache: e,
    onSign: r,
    gitdir: i,
    ref: n,
    tree: g,
    parent: f && [f],
    message: `Note removed by 'isomorphic-git removeNote'
`,
    author: o,
    committer: s,
    signingKey: l
  });
}
async function eh({
  fs: t,
  onSign: e,
  dir: r,
  gitdir: i = te.join(r, ".git"),
  ref: n = "refs/notes/commits",
  oid: a,
  author: o,
  committer: s,
  signingKey: l,
  cache: f = {}
}) {
  try {
    H("fs", t), H("gitdir", i), H("oid", a);
    const u = new me(t), m = await or({ fs: u, gitdir: i, author: o });
    if (!m) throw new ft("author");
    const g = await Dr({
      fs: u,
      gitdir: i,
      author: m,
      committer: s
    });
    if (!g) throw new ft("committer");
    return await Qf({
      fs: u,
      cache: f,
      onSign: e,
      gitdir: i,
      ref: n,
      oid: a,
      author: m,
      committer: g,
      signingKey: l
    });
  } catch (u) {
    throw u.caller = "git.removeNote", u;
  }
}
async function th({
  fs: t,
  gitdir: e,
  oldref: r,
  ref: i,
  checkout: n = !1
}) {
  if (i !== zt.clean(i))
    throw new Ct(i, zt.clean(i));
  if (r !== zt.clean(r))
    throw new Ct(r, zt.clean(r));
  const a = `refs/heads/${r}`, o = `refs/heads/${i}`;
  if (await ae.exists({ fs: t, gitdir: e, ref: o }))
    throw new Ft("branch", i, !1);
  const l = await ae.resolve({
    fs: t,
    gitdir: e,
    ref: a,
    depth: 1
  });
  await ae.writeRef({ fs: t, gitdir: e, ref: o, value: l }), await ae.deleteRef({ fs: t, gitdir: e, ref: a });
  const u = await cr({
    fs: t,
    gitdir: e,
    fullname: !0
  }) === a;
  (n || u) && await ae.writeSymbolicRef({
    fs: t,
    gitdir: e,
    ref: "HEAD",
    value: o
  });
}
async function rh({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  ref: i,
  oldref: n,
  checkout: a = !1
}) {
  try {
    return H("fs", t), H("gitdir", r), H("ref", i), H("oldref", n), await th({
      fs: new me(t),
      gitdir: r,
      ref: i,
      oldref: n,
      checkout: a
    });
  } catch (o) {
    throw o.caller = "git.renameBranch", o;
  }
}
async function Ds({ gitdir: t, type: e, object: r }) {
  return Yt(Mr.wrap({ type: e, object: r }));
}
async function ih({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  filepath: i,
  ref: n,
  cache: a = {}
}) {
  try {
    H("fs", t), H("gitdir", r), H("filepath", i);
    const o = new me(t);
    let s, l;
    try {
      s = await ae.resolve({ fs: o, gitdir: r, ref: n || "HEAD" });
    } catch (m) {
      if (n)
        throw m;
    }
    if (s)
      try {
        s = await pi({
          fs: o,
          cache: a,
          gitdir: r,
          oid: s,
          filepath: i
        });
      } catch {
        s = null;
      }
    let f = {
      ctime: /* @__PURE__ */ new Date(0),
      mtime: /* @__PURE__ */ new Date(0),
      dev: 0,
      ino: 0,
      mode: 0,
      uid: 0,
      gid: 0,
      size: 0
    };
    const u = e && await o.read(te.join(e, i));
    u && (l = await Ds({
      gitdir: r,
      type: "blob",
      object: u
    }), s === l && (f = await o.lstat(te.join(e, i)))), await ot.acquire({ fs: o, gitdir: r, cache: a }, async function(m) {
      m.delete({ filepath: i }), s && m.insert({ filepath: i, stats: f, oid: s });
    });
  } catch (o) {
    throw o.caller = "git.reset", o;
  }
}
async function nh({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  ref: i,
  depth: n
}) {
  try {
    return H("fs", t), H("gitdir", r), H("ref", i), await ae.resolve({
      fs: new me(t),
      gitdir: r,
      ref: i,
      depth: n
    });
  } catch (a) {
    throw a.caller = "git.resolveRef", a;
  }
}
async function ah({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  path: i,
  value: n,
  append: a = !1
}) {
  try {
    H("fs", t), H("gitdir", r), H("path", i);
    const o = new me(t), s = await it.get({ fs: o, gitdir: r });
    a ? await s.append(i, n) : await s.set(i, n), await it.save({ fs: o, gitdir: r, config: s });
  } catch (o) {
    throw o.caller = "git.setConfig", o;
  }
}
async function Os({ fs: t, gitdir: e, commit: r }) {
  const i = Ye.from(r).toObject();
  return await bt({
    fs: t,
    gitdir: e,
    type: "commit",
    object: i,
    format: "content"
  });
}
class Ui {
  // constructor removed
  static get timezoneOffsetForRefLogEntry() {
    const e = (/* @__PURE__ */ new Date()).getTimezoneOffset(), r = Math.abs(Math.floor(e / 60)), i = Math.abs(e % 60).toString().padStart(2, "0");
    return `${e > 0 ? "-" : "+"}${r.toString().padStart(2, "0")}${i}`;
  }
  static createStashReflogEntry(e, r, i) {
    const n = e.name.replace(/\s/g, ""), a = "0000000000000000000000000000000000000000", o = Math.floor(Date.now() / 1e3), s = Ui.timezoneOffsetForRefLogEntry;
    return `${a} ${r} ${n} ${e.email} ${o} ${s}	${i}
`;
  }
  static getStashReflogEntry(e, r = !1) {
    return e.split(`
`).filter((a) => a).reverse().map(
      (a, o) => r ? `stash@{${o}}: ${a.split("	")[1]}` : a
    );
  }
}
const oh = {
  stage: Nr,
  workdir: wi
};
let $n;
async function Cr(t, e) {
  return $n === void 0 && ($n = new Xr()), $n.acquire(t, e);
}
async function sh(t, e, r, i, n = null) {
  const a = te.join(r, i), o = await t.lstat(a);
  if (!o) throw new Le(a);
  if (o.isDirectory())
    throw new Re(
      `${a}: file expected, but found directory`
    );
  const s = n ? await rs({ fs: t, gitdir: e, oid: n }) : void 0;
  let l = s ? n : void 0;
  return s || await Cr({ fs: t, gitdir: e, currentFilepath: a }, async () => {
    const f = o.isSymbolicLink() ? await t.readlink(a).then(cs) : await t.read(a);
    if (f === null) throw new Le(a);
    l = await bt({ fs: t, gitdir: e, type: "blob", object: f });
  }), l;
}
async function ch({ fs: t, dir: e, gitdir: r, entries: i }) {
  async function n(a) {
    if (a.type === "tree") {
      if (!a.oid) {
        const o = await Promise.all(a.children.map(n));
        a.oid = await mi({
          fs: t,
          gitdir: r,
          tree: o
        }), a.mode = 16384;
      }
    } else a.type === "blob" && (a.oid = await sh(
      t,
      r,
      e,
      a.path,
      a.oid
    ), a.mode = 33188);
    return a.path = a.path.split("/").pop(), a;
  }
  return Promise.all(i.map(n));
}
async function go({
  fs: t,
  dir: e,
  gitdir: r,
  treePair: i
  // [TREE({ ref: 'HEAD' }), 'STAGE'] would be the equivalent of `git write-tree`
}) {
  const n = i[1] === "stage", a = i.map((y) => typeof y == "string" ? oh[y]() : y), o = [], u = await ar({
    fs: t,
    cache: {},
    dir: e,
    gitdir: r,
    trees: a,
    map: async (y, [E, A]) => {
      if (!(y === "." || await jr.isIgnored({ fs: t, dir: e, gitdir: r, filepath: y })) && A)
        return (!E || await E.oid() !== await A.oid() && await A.oid() !== void 0) && o.push([E, A]), {
          mode: await A.mode(),
          path: y,
          oid: await A.oid(),
          type: await A.type()
        };
    },
    reduce: async (y, E) => (E = E.filter(Boolean), y ? (y.children = E, y) : E.length > 0 ? E : void 0),
    iterate: async (y, E) => {
      const A = [];
      for (const T of E) {
        const [I, R] = T;
        n ? R && (await t.exists(`${e}/${R.toString()}`) ? A.push(T) : o.push([null, R])) : I && (R ? A.push(T) : o.push([I, null]));
      }
      return A.length ? Promise.all(A.map(y)) : [];
    }
  });
  if (o.length === 0 || u.length === 0)
    return null;
  const g = (await ch({
    fs: t,
    dir: e,
    gitdir: r,
    entries: u
  })).filter(Boolean).map((y) => ({
    mode: y.mode,
    path: y.path,
    oid: y.oid,
    type: y.type
  }));
  return mi({ fs: t, gitdir: r, tree: g });
}
async function lh({
  fs: t,
  dir: e,
  gitdir: r,
  stashCommit: i,
  parentCommit: n,
  wasStaged: a
}) {
  const o = [], s = [], l = await ar({
    fs: t,
    cache: {},
    dir: e,
    gitdir: r,
    trees: [$t({ ref: n }), $t({ ref: i })],
    map: async (f, [u, m]) => {
      if (f === "." || await jr.isIgnored({ fs: t, dir: e, gitdir: r, filepath: f }))
        return;
      const g = m ? await m.type() : await u.type();
      if (g !== "tree" && g !== "blob")
        return;
      if (!m && u) {
        const E = g === "tree" ? "rmdir" : "rm";
        return g === "tree" && o.push(f), g === "blob" && a && s.push({ filepath: f, oid: await u.oid() }), { method: E, filepath: f };
      }
      const y = await m.oid();
      if (!u || await u.oid() !== y)
        return g === "tree" ? { method: "mkdir", filepath: f } : (a && s.push({
          filepath: f,
          oid: y,
          stats: await t.lstat(te.join(e, f))
        }), {
          method: "write",
          filepath: f,
          oid: y
        });
    }
  });
  await Cr({ fs: t, gitdir: r, dirRemoved: o, ops: l }, async () => {
    for (const f of l) {
      const u = te.join(e, f.filepath);
      switch (f.method) {
        case "rmdir":
          await t.rmdir(u);
          break;
        case "mkdir":
          await t.mkdir(u);
          break;
        case "rm":
          await t.rm(u);
          break;
        case "write":
          if (!o.some(
            (m) => u.startsWith(m)
          )) {
            const { object: m } = await Je({
              fs: t,
              cache: {},
              gitdir: r,
              oid: f.oid
            });
            await t.exists(u) && await t.rm(u), await t.write(u, m);
          }
          break;
      }
    }
  }), await ot.acquire({ fs: t, gitdir: r, cache: {} }, async (f) => {
    s.forEach(({ filepath: u, stats: m, oid: g }) => {
      f.insert({ filepath: u, stats: m, oid: g });
    });
  });
}
class Xt {
  constructor({ fs: e, dir: r, gitdir: i = te.join(r, ".git") }) {
    Object.assign(this, {
      fs: e,
      dir: r,
      gitdir: i,
      _author: null
    });
  }
  static get refStash() {
    return "refs/stash";
  }
  static get refLogsStash() {
    return "logs/refs/stash";
  }
  get refStashPath() {
    return te.join(this.gitdir, Xt.refStash);
  }
  get refLogsStashPath() {
    return te.join(this.gitdir, Xt.refLogsStash);
  }
  async getAuthor() {
    if (!this._author && (this._author = await or({
      fs: this.fs,
      gitdir: this.gitdir,
      author: {}
    }), !this._author))
      throw new ft("author");
    return this._author;
  }
  async getStashSHA(e, r) {
    return await this.fs.exists(this.refStashPath) ? (r || await this.readStashReflogs({ parsed: !1 }))[e].split(" ")[1] : null;
  }
  async writeStashCommit({ message: e, tree: r, parent: i }) {
    return Os({
      fs: this.fs,
      gitdir: this.gitdir,
      commit: {
        message: e,
        tree: r,
        parent: i,
        author: await this.getAuthor(),
        committer: await this.getAuthor()
      }
    });
  }
  async readStashCommit(e) {
    const r = await this.readStashReflogs({ parsed: !1 });
    if (e !== 0 && (e < 0 || e > r.length - 1))
      throw new Ct(
        `stash@${e}`,
        "number that is in range of [0, num of stash pushed]"
      );
    const i = await this.getStashSHA(e, r);
    return i ? Or({
      fs: this.fs,
      cache: {},
      gitdir: this.gitdir,
      oid: i
    }) : {};
  }
  async writeStashRef(e) {
    return ae.writeRef({
      fs: this.fs,
      gitdir: this.gitdir,
      ref: Xt.refStash,
      value: e
    });
  }
  async writeStashReflogEntry({ stashCommit: e, message: r }) {
    const i = await this.getAuthor(), n = Ui.createStashReflogEntry(
      i,
      e,
      r
    ), a = this.refLogsStashPath;
    await Cr({ filepath: a, entry: n }, async () => {
      const o = await this.fs.exists(a) ? await this.fs.read(a, "utf8") : "";
      await this.fs.write(a, o + n, "utf8");
    });
  }
  async readStashReflogs({ parsed: e = !1 }) {
    if (!await this.fs.exists(this.refLogsStashPath))
      return [];
    const i = (await this.fs.read(this.refLogsStashPath)).toString();
    return Ui.getStashReflogEntry(i, e);
  }
}
async function uh({ fs: t, dir: e, gitdir: r, message: i = "" }) {
  const n = new Xt({ fs: t, dir: e, gitdir: r });
  await n.getAuthor();
  const a = await cr({
    fs: t,
    gitdir: r,
    fullname: !1
  }), o = await ae.resolve({
    fs: t,
    gitdir: r,
    ref: "HEAD"
  }), l = (await As({ fs: t, dir: e, gitdir: r, oid: o })).commit.message, f = [o];
  let u = null, m = $t({ ref: "HEAD" });
  const g = await go({
    fs: t,
    dir: e,
    gitdir: r,
    treePair: [$t({ ref: "HEAD" }), "stage"]
  });
  if (g) {
    const T = await n.writeStashCommit({
      message: `stash-Index: WIP on ${a} - ${(/* @__PURE__ */ new Date()).toISOString()}`,
      tree: g,
      // stashCommitTree
      parent: f
    });
    f.push(T), u = g, m = Nr();
  }
  const y = await go({
    fs: t,
    dir: e,
    gitdir: r,
    treePair: [m, "workdir"]
  });
  if (y) {
    const T = await n.writeStashCommit({
      message: `stash-WorkDir: WIP on ${a} - ${(/* @__PURE__ */ new Date()).toISOString()}`,
      tree: y,
      parent: [f[f.length - 1]]
    });
    f.push(T), u = y;
  }
  if (!u || !g && !y)
    throw new Le("changes, nothing to stash");
  const E = (i.trim() || `WIP on ${a}`) + `: ${o.substring(0, 7)} ${l}`, A = await n.writeStashCommit({
    message: E,
    tree: u,
    parent: f
  });
  return await n.writeStashRef(A), await n.writeStashReflogEntry({
    stashCommit: A,
    message: E
  }), await ps({
    fs: t,
    dir: e,
    gitdir: r,
    ref: a,
    track: !1,
    force: !0
    // force checkout to discard changes
  }), A;
}
async function Cs({ fs: t, dir: e, gitdir: r, refIdx: i = 0 }) {
  const a = await new Xt({ fs: t, dir: e, gitdir: r }).readStashCommit(i), { parent: o = null } = a.commit ? a.commit : {};
  if (!(!o || !Array.isArray(o)))
    for (let s = 0; s < o.length - 1; s++) {
      const f = (await Or({
        fs: t,
        cache: {},
        gitdir: r,
        oid: o[s + 1]
      })).commit.message.startsWith("stash-Index");
      await lh({
        fs: t,
        dir: e,
        gitdir: r,
        stashCommit: o[s + 1],
        parentCommit: o[s],
        wasStaged: f
      });
    }
}
async function Fs({ fs: t, dir: e, gitdir: r, refIdx: i = 0 }) {
  const n = new Xt({ fs: t, dir: e, gitdir: r });
  if (!(await n.readStashCommit(i)).commit)
    return;
  const o = n.refStashPath;
  await Cr(o, async () => {
    await t.exists(o) && await t.rm(o);
  });
  const s = await n.readStashReflogs({ parsed: !1 });
  if (!s.length)
    return;
  s.splice(i, 1);
  const l = n.refLogsStashPath;
  await Cr({ reflogEntries: s, stashReflogPath: l, stashMgr: n }, async () => {
    if (s.length) {
      await t.write(l, s.join(`
`), "utf8");
      const f = s[s.length - 1].split(
        " "
      )[1];
      await n.writeStashRef(f);
    } else
      await t.rm(l);
  });
}
async function fh({ fs: t, dir: e, gitdir: r }) {
  return new Xt({ fs: t, dir: e, gitdir: r }).readStashReflogs({ parsed: !0 });
}
async function hh({ fs: t, dir: e, gitdir: r }) {
  const i = new Xt({ fs: t, dir: e, gitdir: r }), n = [i.refStashPath, i.refLogsStashPath];
  await Cr(n, async () => {
    await Promise.all(
      n.map(async (a) => {
        if (await t.exists(a))
          return t.rm(a);
      })
    );
  });
}
async function dh({ fs: t, dir: e, gitdir: r, refIdx: i = 0 }) {
  await Cs({ fs: t, dir: e, gitdir: r, refIdx: i }), await Fs({ fs: t, dir: e, gitdir: r, refIdx: i });
}
async function wh({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  op: i = "push",
  message: n = "",
  refIdx: a = 0
}) {
  H("fs", t), H("dir", e), H("gitdir", r), H("op", i);
  const o = {
    push: uh,
    apply: Cs,
    drop: Fs,
    list: fh,
    clear: hh,
    pop: dh
  }, s = ["apply", "drop", "pop"];
  try {
    const l = new me(t);
    ["refs", "logs", "logs/refs"].map((m) => te.join(r, m)).forEach(async (m) => {
      await l.exists(m) || await l.mkdir(m);
    });
    const u = o[i];
    if (u) {
      if (s.includes(i) && a < 0)
        throw new Ct(
          `stash@${a}`,
          "number that is in range of [0, num of stash pushed]"
        );
      return await u({ fs: l, dir: e, gitdir: r, message: n, refIdx: a });
    }
    throw new Error(`To be implemented: ${i}`);
  } catch (l) {
    throw l.caller = "git.stash", l;
  }
}
async function ph({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  filepath: i,
  cache: n = {}
}) {
  try {
    H("fs", t), H("gitdir", r), H("filepath", i);
    const a = new me(t);
    if (await jr.isIgnored({
      fs: a,
      gitdir: r,
      dir: e,
      filepath: i
    }))
      return "ignored";
    const s = await mh({ fs: a, cache: n, gitdir: r }), l = await Ns({
      fs: a,
      cache: n,
      gitdir: r,
      tree: s,
      path: i
    }), f = await ot.acquire(
      { fs: a, gitdir: r, cache: n },
      async function(A) {
        for (const T of A)
          if (T.path === i) return T;
        return null;
      }
    ), u = await a.lstat(te.join(e, i)), m = l !== null, g = f !== null, y = u !== null, E = async () => {
      if (g && !Bi(f, u))
        return f.oid;
      {
        const A = await a.read(te.join(e, i)), T = await Ds({
          gitdir: r,
          type: "blob",
          object: A
        });
        return g && f.oid === T && u.size !== -1 && ot.acquire({ fs: a, gitdir: r, cache: n }, async function(I) {
          I.insert({ filepath: i, stats: u, oid: T });
        }), T;
      }
    };
    if (!m && !y && !g) return "absent";
    if (!m && !y && g) return "*absent";
    if (!m && y && !g) return "*added";
    if (!m && y && g)
      return await E() === f.oid ? "added" : "*added";
    if (m && !y && !g) return "deleted";
    if (m && !y && g)
      return l === f.oid, "*deleted";
    if (m && y && !g)
      return await E() === l ? "*undeleted" : "*undeletemodified";
    if (m && y && g) {
      const A = await E();
      return A === l ? A === f.oid ? "unmodified" : "*unmodified" : A === f.oid ? "modified" : "*modified";
    }
  } catch (a) {
    throw a.caller = "git.status", a;
  }
}
async function Ns({ fs: t, cache: e, gitdir: r, tree: i, path: n }) {
  typeof n == "string" && (n = n.split("/"));
  const a = n.shift();
  for (const o of i)
    if (o.path === a) {
      if (n.length === 0)
        return o.oid;
      const { type: s, object: l } = await Je({
        fs: t,
        cache: e,
        gitdir: r,
        oid: o.oid
      });
      if (s === "tree") {
        const f = _t.from(l);
        return Ns({ fs: t, cache: e, gitdir: r, tree: f, path: n });
      }
      if (s === "blob")
        throw new pt(o.oid, s, "blob", n.join("/"));
    }
  return null;
}
async function mh({ fs: t, cache: e, gitdir: r }) {
  let i;
  try {
    i = await ae.resolve({ fs: t, gitdir: r, ref: "HEAD" });
  } catch (a) {
    if (a instanceof Le)
      return [];
  }
  const { tree: n } = await zr({ fs: t, cache: e, gitdir: r, oid: i });
  return n;
}
async function gh({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  ref: i = "HEAD",
  filepaths: n = ["."],
  filter: a,
  cache: o = {},
  ignored: s = !1
}) {
  try {
    H("fs", t), H("gitdir", r), H("ref", i);
    const l = new me(t);
    return await ar({
      fs: l,
      cache: o,
      dir: e,
      gitdir: r,
      trees: [$t({ ref: i }), wi(), Nr()],
      map: async function(f, [u, m, g]) {
        if (!u && !g && m && !s && await jr.isIgnored({
          fs: l,
          dir: e,
          filepath: f
        }) || !n.some((M) => ws(f, M)))
          return null;
        if (a && !a(f))
          return;
        const [y, E, A] = await Promise.all([
          u && u.type(),
          m && m.type(),
          g && g.type()
        ]), T = [y, E, A].includes("blob");
        if ((y === "tree" || y === "special") && !T) return;
        if (y === "commit") return null;
        if ((E === "tree" || E === "special") && !T)
          return;
        if (A === "commit") return null;
        if ((A === "tree" || A === "special") && !T) return;
        const I = y === "blob" ? await u.oid() : void 0, R = A === "blob" ? await g.oid() : void 0;
        let D;
        y !== "blob" && E === "blob" && A !== "blob" ? D = "42" : E === "blob" && (D = await m.oid());
        const L = [void 0, I, D, R], U = L.map((M) => L.indexOf(M));
        return U.shift(), [f, ...U];
      }
    });
  } catch (l) {
    throw l.caller = "git.statusMatrix", l;
  }
}
async function yh({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  ref: i,
  object: n,
  force: a = !1
}) {
  try {
    H("fs", t), H("gitdir", r), H("ref", i);
    const o = new me(t);
    if (i === void 0)
      throw new yt("ref");
    i = i.startsWith("refs/tags/") ? i : `refs/tags/${i}`;
    const s = await ae.resolve({
      fs: o,
      gitdir: r,
      ref: n || "HEAD"
    });
    if (!a && await ae.exists({ fs: o, gitdir: r, ref: i }))
      throw new Ft("tag", i);
    await ae.writeRef({ fs: o, gitdir: r, ref: i, value: s });
  } catch (o) {
    throw o.caller = "git.tag", o;
  }
}
async function _h({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  cache: i = {},
  filepath: n,
  oid: a,
  mode: o,
  add: s,
  remove: l,
  force: f
}) {
  try {
    H("fs", t), H("gitdir", r), H("filepath", n);
    const u = new me(t);
    if (l)
      return await ot.acquire(
        { fs: u, gitdir: r, cache: i },
        async function(g) {
          if (!f) {
            const y = await u.lstat(te.join(e, n));
            if (y) {
              if (y.isDirectory())
                throw new nr("directory");
              return;
            }
          }
          g.has({ filepath: n }) && g.delete({
            filepath: n
          });
        }
      );
    let m;
    if (!a) {
      if (m = await u.lstat(te.join(e, n)), !m)
        throw new Le(
          `file at "${n}" on disk and "remove" not set`
        );
      if (m.isDirectory())
        throw new nr("directory");
    }
    return await ot.acquire({ fs: u, gitdir: r, cache: i }, async function(g) {
      if (!s && !g.has({ filepath: n }))
        throw new Le(
          `file at "${n}" in index and "add" not set`
        );
      let y;
      if (a)
        y = {
          ctime: /* @__PURE__ */ new Date(0),
          mtime: /* @__PURE__ */ new Date(0),
          dev: 0,
          ino: 0,
          mode: o,
          uid: 0,
          gid: 0,
          size: 0
        };
      else {
        y = m;
        const E = y.isSymbolicLink() ? await u.readlink(te.join(e, n)) : await u.read(te.join(e, n));
        a = await bt({
          fs: u,
          gitdir: r,
          type: "blob",
          format: "content",
          object: E
        });
      }
      return g.insert({
        filepath: n,
        oid: a,
        stats: y
      }), a;
    });
  } catch (u) {
    throw u.caller = "git.updateIndex", u;
  }
}
function bh() {
  try {
    return qi.version;
  } catch (t) {
    throw t.caller = "git.version", t;
  }
}
async function vh({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  trees: i,
  map: n,
  reduce: a,
  iterate: o,
  cache: s = {}
}) {
  try {
    return H("fs", t), H("gitdir", r), H("trees", i), await ar({
      fs: new me(t),
      cache: s,
      dir: e,
      gitdir: r,
      trees: i,
      map: n,
      reduce: a,
      iterate: o
    });
  } catch (l) {
    throw l.caller = "git.walk", l;
  }
}
async function Eh({ fs: t, dir: e, gitdir: r = te.join(e, ".git"), blob: i }) {
  try {
    return H("fs", t), H("gitdir", r), H("blob", i), await bt({
      fs: new me(t),
      gitdir: r,
      type: "blob",
      object: i,
      format: "content"
    });
  } catch (n) {
    throw n.caller = "git.writeBlob", n;
  }
}
async function kh({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  commit: i
}) {
  try {
    return H("fs", t), H("gitdir", r), H("commit", i), await Os({
      fs: new me(t),
      gitdir: r,
      commit: i
    });
  } catch (n) {
    throw n.caller = "git.writeCommit", n;
  }
}
async function Sh({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  type: i,
  object: n,
  format: a = "parsed",
  oid: o,
  encoding: s = void 0
}) {
  try {
    const l = new me(t);
    if (a === "parsed") {
      switch (i) {
        case "commit":
          n = Ye.from(n).toObject();
          break;
        case "tree":
          n = _t.from(n).toObject();
          break;
        case "blob":
          n = fe.from(n, s);
          break;
        case "tag":
          n = wt.from(n).toObject();
          break;
        default:
          throw new pt(o || "", i, "blob|commit|tag|tree");
      }
      a = "content";
    }
    return o = await bt({
      fs: l,
      gitdir: r,
      type: i,
      object: n,
      oid: o,
      format: a
    }), o;
  } catch (l) {
    throw l.caller = "git.writeObject", l;
  }
}
async function xh({
  fs: t,
  dir: e,
  gitdir: r = te.join(e, ".git"),
  ref: i,
  value: n,
  force: a = !1,
  symbolic: o = !1
}) {
  try {
    H("fs", t), H("gitdir", r), H("ref", i), H("value", n);
    const s = new me(t);
    if (i !== zt.clean(i))
      throw new Ct(i, zt.clean(i));
    if (!a && await ae.exists({ fs: s, gitdir: r, ref: i }))
      throw new Ft("ref", i);
    o ? await ae.writeSymbolicRef({
      fs: s,
      gitdir: r,
      ref: i,
      value: n
    }) : (n = await ae.resolve({
      fs: s,
      gitdir: r,
      ref: n
    }), await ae.writeRef({
      fs: s,
      gitdir: r,
      ref: i,
      value: n
    }));
  } catch (s) {
    throw s.caller = "git.writeRef", s;
  }
}
async function Ih({ fs: t, gitdir: e, tag: r }) {
  const i = wt.from(r).toObject();
  return await bt({
    fs: t,
    gitdir: e,
    type: "tag",
    object: i,
    format: "content"
  });
}
async function Rh({ fs: t, dir: e, gitdir: r = te.join(e, ".git"), tag: i }) {
  try {
    return H("fs", t), H("gitdir", r), H("tag", i), await Ih({
      fs: new me(t),
      gitdir: r,
      tag: i
    });
  } catch (n) {
    throw n.caller = "git.writeTag", n;
  }
}
async function Th({ fs: t, dir: e, gitdir: r = te.join(e, ".git"), tree: i }) {
  try {
    return H("fs", t), H("gitdir", r), H("tree", i), await mi({
      fs: new me(t),
      gitdir: r,
      tree: i
    });
  } catch (n) {
    throw n.caller = "git.writeTree", n;
  }
}
var re = {
  Errors: tu,
  STAGE: Nr,
  TREE: $t,
  WORKDIR: wi,
  add: _u,
  abortMerge: pu,
  addNote: vu,
  addRemote: Eu,
  annotatedTag: Su,
  branch: Iu,
  checkout: ps,
  clone: Uu,
  commit: Pu,
  getConfig: sf,
  getConfigAll: lf,
  setConfig: ah,
  currentBranch: Lu,
  deleteBranch: zu,
  deleteRef: Hu,
  deleteRemote: qu,
  deleteTag: Zu,
  expandOid: Ku,
  expandRef: Ju,
  fastForward: rf,
  fetch: nf,
  findMergeBase: af,
  findRoot: of,
  getRemoteInfo: uf,
  getRemoteInfo2: ff,
  hashBlob: df,
  indexPack: pf,
  init: mf,
  isDescendent: gf,
  isIgnored: yf,
  listBranches: _f,
  listFiles: vf,
  listNotes: kf,
  listRefs: Sf,
  listRemotes: If,
  listServerRefs: $f,
  listTags: Bf,
  log: Cf,
  merge: Ff,
  packObjects: Uf,
  pull: Pf,
  push: Wf,
  readBlob: qf,
  readCommit: As,
  readNote: Zf,
  readObject: Vf,
  readTag: Yf,
  readTree: Kf,
  remove: Jf,
  removeNote: eh,
  renameBranch: rh,
  resetIndex: ih,
  updateIndex: _h,
  resolveRef: nh,
  status: ph,
  statusMatrix: gh,
  tag: yh,
  version: bh,
  walk: vh,
  writeBlob: Eh,
  writeCommit: kh,
  writeObject: Sh,
  writeRef: xh,
  writeTag: Rh,
  writeTree: Th,
  stash: wh
};
function $h(t) {
  let e = [t];
  return {
    next() {
      return Promise.resolve({ done: e.length === 0, value: e.pop() });
    },
    return() {
      return e = [], {};
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
function Bh(t) {
  return t[Symbol.asyncIterator] ? t[Symbol.asyncIterator]() : t[Symbol.iterator] ? t[Symbol.iterator]() : t.next ? t : $h(t);
}
async function Ah(t, e) {
  const r = Bh(t);
  for (; ; ) {
    const { value: i, done: n } = await r.next();
    if (i && await e(i), n) break;
  }
  r.return && r.return();
}
async function Dh(t) {
  let e = 0;
  const r = [];
  await Ah(t, (a) => {
    r.push(a), e += a.byteLength;
  });
  const i = new Uint8Array(e);
  let n = 0;
  for (const a of r)
    i.set(a, n), n += a.byteLength;
  return i;
}
function Oh(t) {
  if (t[Symbol.asyncIterator]) return t;
  const e = t.getReader();
  return {
    next() {
      return e.read();
    },
    return() {
      return e.releaseLock(), {};
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
async function Ch({
  onProgress: t,
  url: e,
  method: r = "GET",
  headers: i = {},
  body: n
}) {
  n && (n = await Dh(n));
  const a = await fetch(e, { method: r, headers: i, body: n }), o = a.body && a.body.getReader ? Oh(a.body) : [new Uint8Array(await a.arrayBuffer())];
  i = {};
  for (const [s, l] of a.headers.entries())
    i[s] = l;
  return {
    url: a.url,
    method: a.method,
    statusCode: a.status,
    statusMessage: a.statusText,
    body: o,
    headers: i
  };
}
var Bt = { request: Ch };
class yi {
  constructor(e = !0, r = !1) {
    this.on = e, this.trace = r;
  }
  consoleDotLog(...e) {
    this.on && (console.log(...e), this.trace && console.trace());
  }
  consoleDotError(...e) {
    this.on && (console.error(...e), this.trace && console.trace());
  }
}
const Hr = {
  corsProxy: "http://localhost:9000/",
  logging: {
    fsManagerES6: !0,
    swUtils: !0,
    memoryBackendES6: !0,
    dotGit: !0
  }
}, Ms = new yi(Hr.logging.swUtils);
function dr(...t) {
  Ms.consoleDotLog("[ SWUtils ]", ...t);
}
function Ii(...t) {
  Ms.consoleDotError("[ SWUtils ]", ...t);
}
class Us {
  constructor() {
  }
  async fetchWithServiceWorker(e, r) {
    dr("Starting fetchWithServiceWorker with operation:", e, "and args:", r);
    try {
      const i = new URL("/git", self.location.origin).toString();
      dr("Constructed URL for fetch:", i);
      const n = {
        method: "POST",
        body: JSON.stringify({ operation: e, args: r }),
        headers: { "Content-Type": "application/json" }
      };
      dr("Request options:", n);
      const a = await fetch(i, n);
      dr("Fetch response received:", a);
      let o;
      try {
        o = await a.json(), dr("Parsed JSON response:", o);
      } catch (s) {
        throw Ii("Error parsing JSON response:", s), new Error("Response is not valid JSON");
      }
      if (!a.ok) {
        let s = `Fetch failed with status: ${a.status}`;
        switch (dr("Response status is not OK:", a.status), a.status) {
          case 400:
            s = "Bad Request: The server could not understand the request.";
            break;
          case 401:
            s = "Unauthorized: Authentication is required or has failed.";
            break;
          case 403:
            s = "Forbidden: You do not have permission to access this resource.";
            break;
          case 404:
            s = "Not Found: The requested resource could not be found.";
            break;
          case 500:
            s = "Internal Server Error: The server encountered an error.";
            break;
          case 502:
            s = "Bad Gateway: The server received an invalid response from the upstream server.";
            break;
          case 503:
            s = "Service Unavailable: The server is currently unable to handle the request.";
            break;
          case 504:
            s = "Gateway Timeout: The server did not receive a timely response from the upstream server.";
            break;
          default:
            s = `Unexpected status code: ${a.status}`;
        }
        throw Ii("Error message based on status code:", s), Ii("Response details:", o.details), new Error(JSON.stringify(o.details));
      }
      return dr("Fetch completed successfully with response:", o), o;
    } catch (i) {
      throw Ii("Fetch error:", i), i;
    }
  }
  async sendMessageToChannel(e, r = "worker-channel") {
    return new Promise((i) => {
      const n = new BroadcastChannel(r);
      n.onmessage = (a) => {
        a.data.operation === `${e.operation}` && (n.close(), i(a.data));
      }, n.postMessage(e);
    });
  }
}
const Ps = new yi(Hr.logging.memoryBackendES6);
function ct(...t) {
  Ps.consoleDotLog("[MemoryBackend ES6]", ...t);
}
function Zr(...t) {
  Ps.consoleDotError("[MemoryBackend ES6]", ...t);
}
function Fh() {
  return "tab-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
}
ct("Loading memoryBackend module");
class yo {
  constructor(e = {}, r = "default") {
    this.dbName = r, this.options = e, this.deviceId = e.deviceId || Fh(), this._files = /* @__PURE__ */ new Map(), this.versionVector = { [this.deviceId]: 0 }, this.swUtilsInstance = new Us(), this.channel = null, this.isProcessing = !1, this.pendingUpdates = [], this.processingQueue = !1, this._initializeRoot(), this.options?.supportsServiceWorker && this.options?.useSW && this._setupReceiveChannel(), Promise.resolve().then(() => this._requestInitialSync()), ct(`Initialized with dbName: ${this.dbName}, deviceId: ${this.deviceId}`);
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
  _isNewerVersionVector(e) {
    let r = !1;
    for (const i in e) {
      const n = this.versionVector[i] || 0;
      e[i] > n && (r = !0);
    }
    return r;
  }
  _mergeVersionVector(e) {
    for (const r in e)
      (!this.versionVector[r] || e[r] > this.versionVector[r]) && (this.versionVector[r] = e[r]);
  }
  _requestInitialSync() {
    try {
      const e = new BroadcastChannel(`memory-backend-${this.dbName}`);
      e.postMessage({
        operation: "memorySyncRequest",
        data: {
          dbName: this.dbName,
          requesterVV: this.versionVector,
          requesterId: this.deviceId
        }
      }), e.close(), ct("Initial sync request sent");
    } catch (e) {
      Zr("Failed to send initial sync request:", e);
    }
  }
  async getFiles() {
    return new Map(
      Array.from(this._files.entries()).map(([r, i]) => [r, { ...i }])
    );
  }
  async sendFilesToSW(e = null) {
    const r = {
      operation: "memorySync",
      data: {
        files: Array.from(this._files.entries()),
        dbName: this.dbName,
        versionVector: { ...this.versionVector },
        sender: this.deviceId,
        targetId: e
      }
    };
    if (this.isProcessing) {
      ct("Queueing update due to ongoing processing"), this.pendingUpdates.push(r);
      return;
    }
    try {
      this.isProcessing = !0, ct("Sending files to SW:", r);
      const i = new BroadcastChannel(`memory-backend-${this.dbName}`);
      i.postMessage(r), i.close(), ct("Files sent to SW successfully"), await this._processPendingUpdates();
    } catch (i) {
      Zr("Failed to send files to SW:", i);
    } finally {
      this.isProcessing = !1;
    }
  }
  async _processPendingUpdates() {
    if (!(this.processingQueue || this.pendingUpdates.length === 0)) {
      this.processingQueue = !0;
      try {
        for (; this.pendingUpdates.length > 0; ) {
          const e = this.pendingUpdates.shift();
          ct("Processing queued update:", e);
          const r = new BroadcastChannel(`memory-backend-${this.dbName}`);
          r.postMessage(e), r.close();
        }
      } catch (e) {
        Zr("Error processing queued updates:", e);
      } finally {
        this.processingQueue = !1;
      }
    }
  }
  _setupReceiveChannel() {
    try {
      const e = new BroadcastChannel(`memory-backend-${this.dbName}`);
      ct("Listening for updates on:", e.name), this.channel = e, this.channel.onmessage = async (r) => {
        Promise.resolve().then(() => this._handleChannelMessage(r));
      }, this._requestInitialSync();
    } catch (e) {
      Zr("BroadcastChannel init failed:", e);
    }
  }
  async _handleChannelMessage(e) {
    const { operation: r, data: i } = e.data || {};
    if (!i?.dbName || i.dbName !== this.dbName) return;
    if (r === "memorySyncRequest") {
      this._isNewerVersionVector(i.requesterVV) ? (ct("Responding to sync request with newer data"), Promise.resolve().then(() => this.sendFilesToSW(i.requesterId))) : ct("No newer data to send to requester");
      return;
    }
    if (r !== "memorySync") return;
    const n = i.versionVector;
    if (i.sender === this.deviceId) {
      ct("Skipping own update");
      return;
    }
    if (i.targetId && i.targetId !== this.deviceId) {
      ct("Message not meant for this tab. Ignoring.");
      return;
    }
    if (!this._isNewerVersionVector(n)) {
      ct("Skipping received update - not newer than current", this.versionVector, n);
      return;
    }
    try {
      ct("Applying update from channel:", i), this._files = new Map(i.files), this._mergeVersionVector(n), ct("Memory updated from channel successfully");
    } catch (o) {
      Zr("Failed to apply channel message:", o);
    }
  }
  async wipe() {
    ct(`Wiping db: ${this.dbName}`), this._files.clear(), this._initializeRoot(), this.versionVector = { [this.deviceId]: 0 }, await this._handleFilesChange();
  }
  async _handleFilesChange() {
    this._incrementVersionVector(), this.options?.supportsServiceWorker && this.options?.useSW && await this.sendFilesToSW();
  }
  async readFile(e, r = {}) {
    if (ct("this.files", this._files), !this._files.has(e))
      throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
    const i = this._files.get(e);
    if (i.type !== "file")
      throw Object.assign(new Error("EISDIR"), { code: "EISDIR" });
    return r.encoding === "utf8" ? new TextDecoder().decode(i.data) : i.data;
  }
  async writeFile(e, r, i = {}) {
    const n = typeof r == "string" ? new TextEncoder().encode(r) : r || new Uint8Array();
    this._files.set(e, {
      type: "file",
      mode: i.mode || 438,
      data: n,
      size: n.length,
      ino: e,
      mtimeMs: Date.now(),
      ctimeMs: Date.now()
    }), await this._handleFilesChange();
  }
  async unlink(e) {
    if (!this._files.has(e))
      throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
    this._files.delete(e), await this._handleFilesChange();
  }
  async readdir(e) {
    if (!this._files.has(e))
      throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
    if (this._files.get(e).type !== "dir")
      throw Object.assign(new Error("ENOTDIR"), { code: "ENOTDIR" });
    const i = /* @__PURE__ */ new Set(), n = e === "/" ? "/" : `${e}/`;
    for (const a of this._files.keys())
      if (a.startsWith(n) && a !== e) {
        const o = a.slice(n.length).split("/")[0];
        i.add(o);
      }
    return [...i];
  }
  async stat(e) {
    if (!this._files.has(e))
      throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
    return this._files.get(e);
  }
  async lstat(e) {
    return this.stat(e);
  }
  async mkdir(e) {
    const r = this._getParentDir(e);
    if (r !== "/" && !this._files.has(r))
      throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
    this._files.set(e, {
      type: "dir",
      mode: 511,
      size: 0,
      ino: e,
      mtimeMs: Date.now(),
      ctimeMs: Date.now()
    }), await this._handleFilesChange();
  }
  async rmdir(e) {
    const r = e === "/" ? "/" : e.replace(/\/+$/, "");
    if (!this._files.has(r))
      throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
    if (this._files.get(r).type !== "dir")
      throw Object.assign(new Error("ENOTDIR"), { code: "ENOTDIR" });
    for (const n of this._files.keys())
      if (n.startsWith(`${r}/`))
        throw Object.assign(new Error("ENOTEMPTY"), { code: "ENOTEMPTY" });
    this._files.delete(r), await this._handleFilesChange();
  }
  _getParentDir(e) {
    const r = e.lastIndexOf("/");
    return r <= 0 ? "/" : e.slice(0, r);
  }
  _getBaseName(e) {
    return e.slice(e.lastIndexOf("/") + 1);
  }
  async saveSuperblock() {
  }
  async loadSuperblock() {
  }
}
var Bn, _o;
function Nh() {
  if (_o) return Bn;
  _o = 1, Bn = t;
  function t(e) {
    var r, i;
    if (typeof e != "function")
      throw new Error("expected a function but got " + e);
    return function() {
      return r || (r = !0, i = e.apply(this, arguments)), i;
    };
  }
  return Bn;
}
var An = {}, bo;
function Mh() {
  return bo || (bo = 1, function(t) {
    function e(I, R) {
      var D;
      return I instanceof fe ? D = I : D = fe.from(I.buffer, I.byteOffset, I.byteLength), D.toString(R);
    }
    var r = function(I) {
      return fe.from(I);
    };
    function i(I) {
      for (var R = 0, D = Math.min(256 * 256, I.length + 1), L = new Uint16Array(D), U = [], M = 0; ; ) {
        var B = R < I.length;
        if (!B || M >= D - 1) {
          var O = L.subarray(0, M), W = O;
          if (U.push(String.fromCharCode.apply(null, W)), !B) return U.join("");
          I = I.subarray(R), R = 0, M = 0;
        }
        var z = I[R++];
        if ((z & 128) === 0) L[M++] = z;
        else if ((z & 224) === 192) {
          var Y = I[R++] & 63;
          L[M++] = (z & 31) << 6 | Y;
        } else if ((z & 240) === 224) {
          var Y = I[R++] & 63, F = I[R++] & 63;
          L[M++] = (z & 31) << 12 | Y << 6 | F;
        } else if ((z & 248) === 240) {
          var Y = I[R++] & 63, F = I[R++] & 63, J = I[R++] & 63, se = (z & 7) << 18 | Y << 12 | F << 6 | J;
          se > 65535 && (se -= 65536, L[M++] = se >>> 10 & 1023 | 55296, se = 56320 | se & 1023), L[M++] = se;
        }
      }
    }
    function n(I) {
      for (var R = 0, D = I.length, L = 0, U = Math.max(32, D + (D >>> 1) + 7), M = new Uint8Array(U >>> 3 << 3); R < D; ) {
        var B = I.charCodeAt(R++);
        if (B >= 55296 && B <= 56319) {
          if (R < D) {
            var O = I.charCodeAt(R);
            (O & 64512) === 56320 && (++R, B = ((B & 1023) << 10) + (O & 1023) + 65536);
          }
          if (B >= 55296 && B <= 56319) continue;
        }
        if (L + 4 > M.length) {
          U += 8, U *= 1 + R / I.length * 2, U = U >>> 3 << 3;
          var W = new Uint8Array(U);
          W.set(M), M = W;
        }
        if ((B & 4294967168) === 0) {
          M[L++] = B;
          continue;
        } else if ((B & 4294965248) === 0) M[L++] = B >>> 6 & 31 | 192;
        else if ((B & 4294901760) === 0) M[L++] = B >>> 12 & 15 | 224, M[L++] = B >>> 6 & 63 | 128;
        else if ((B & 4292870144) === 0) M[L++] = B >>> 18 & 7 | 240, M[L++] = B >>> 12 & 63 | 128, M[L++] = B >>> 6 & 63 | 128;
        else continue;
        M[L++] = B & 63 | 128;
      }
      return M.slice ? M.slice(0, L) : M.subarray(0, L);
    }
    var a = "Failed to ", o = function(I, R, D) {
      if (I) throw new Error("".concat(a).concat(R, ": the '").concat(D, "' option is unsupported."));
    }, s = typeof fe == "function" && fe.from, l = s ? r : n;
    function f() {
      this.encoding = "utf-8";
    }
    f.prototype.encode = function(I, R) {
      return o(R && R.stream, "encode", "stream"), l(I);
    };
    function u(I) {
      var R;
      try {
        var D = new Blob([I], { type: "text/plain;charset=UTF-8" });
        R = URL.createObjectURL(D);
        var L = new XMLHttpRequest();
        return L.open("GET", R, !1), L.send(), L.responseText;
      } finally {
        R && URL.revokeObjectURL(R);
      }
    }
    var m = !s && typeof Blob == "function" && typeof URL == "function" && typeof URL.createObjectURL == "function", g = ["utf-8", "utf8", "unicode-1-1-utf-8"], y = i;
    s ? y = e : m && (y = function(I) {
      try {
        return u(I);
      } catch {
        return i(I);
      }
    });
    var E = "construct 'TextDecoder'", A = "".concat(a, " ").concat(E, ": the ");
    function T(I, R) {
      o(R && R.fatal, E, "fatal"), I = I || "utf-8";
      var D;
      if (s ? D = fe.isEncoding(I) : D = g.indexOf(I.toLowerCase()) !== -1, !D) throw new RangeError("".concat(A, " encoding label provided ('").concat(I, "') is invalid."));
      this.encoding = I, this.fatal = !1, this.ignoreBOM = !1;
    }
    T.prototype.decode = function(I, R) {
      o(R && R.stream, "decode", "stream");
      var D;
      return I instanceof Uint8Array ? D = I : I.buffer instanceof ArrayBuffer ? D = new Uint8Array(I.buffer) : D = new Uint8Array(I), y(D, this.encoding);
    }, t.TextEncoder = t.TextEncoder || f, t.TextDecoder = t.TextDecoder || T;
  }(typeof window < "u" ? window : typeof globalThis < "u" ? globalThis : An)), An;
}
var Dn, vo;
function Uh() {
  return vo || (vo = 1, Mh(), Dn = {
    encode: (t) => new TextEncoder().encode(t),
    decode: (t) => new TextDecoder().decode(t)
  }), Dn;
}
var On, Eo;
function Ph() {
  if (Eo) return On;
  Eo = 1, On = t;
  function t(e, r, i) {
    var n;
    return function() {
      if (!r)
        return e.apply(this, arguments);
      var a = this, o = arguments, s = i && !n;
      if (clearTimeout(n), n = setTimeout(function() {
        if (n = null, !s)
          return e.apply(a, o);
      }, r), s)
        return e.apply(this, arguments);
    };
  }
  return On;
}
var Cn, ko;
function da() {
  if (ko) return Cn;
  ko = 1;
  function t(s) {
    if (s.length === 0)
      return ".";
    let l = i(s);
    return l = l.reduce(o, []), r(...l);
  }
  function e(...s) {
    let l = "";
    for (let f of s)
      f.startsWith("/") ? l = f : l = t(r(l, f));
    return l;
  }
  function r(...s) {
    if (s.length === 0) return "";
    let l = s.join("/");
    return l = l.replace(/\/{2,}/g, "/"), l;
  }
  function i(s) {
    if (s.length === 0) return [];
    if (s === "/") return ["/"];
    let l = s.split("/");
    return l[l.length - 1] === "" && l.pop(), s[0] === "/" ? l[0] = "/" : l[0] !== "." && l.unshift("."), l;
  }
  function n(s) {
    const l = s.lastIndexOf("/");
    if (l === -1) throw new Error(`Cannot get dirname of "${s}"`);
    return l === 0 ? "/" : s.slice(0, l);
  }
  function a(s) {
    if (s === "/") throw new Error(`Cannot get basename of "${s}"`);
    const l = s.lastIndexOf("/");
    return l === -1 ? s : s.slice(l + 1);
  }
  function o(s, l) {
    if (s.length === 0)
      return s.push(l), s;
    if (l === ".") return s;
    if (l === "..") {
      if (s.length === 1) {
        if (s[0] === "/")
          throw new Error("Unable to normalize path - traverses above root directory");
        if (s[0] === ".")
          return s.push(l), s;
      }
      return s[s.length - 1] === ".." ? (s.push(".."), s) : (s.pop(), s);
    }
    return s.push(l), s;
  }
  return Cn = {
    join: r,
    normalize: t,
    split: i,
    basename: a,
    dirname: n,
    resolve: e
  }, Cn;
}
var Fn, So;
function Ls() {
  if (So) return Fn;
  So = 1;
  function t(o) {
    return class extends Error {
      constructor(...s) {
        super(...s), this.code = o, this.message ? this.message = o + ": " + this.message : this.message = o;
      }
    };
  }
  const e = t("EEXIST"), r = t("ENOENT"), i = t("ENOTDIR"), n = t("ENOTEMPTY"), a = t("ETIMEDOUT");
  return Fn = { EEXIST: e, ENOENT: r, ENOTDIR: i, ENOTEMPTY: n, ETIMEDOUT: a }, Fn;
}
var Nn, xo;
function Lh() {
  if (xo) return Nn;
  xo = 1;
  const t = da(), { EEXIST: e, ENOENT: r, ENOTDIR: i, ENOTEMPTY: n } = Ls(), a = 0;
  return Nn = class {
    constructor() {
    }
    _makeRoot(s = /* @__PURE__ */ new Map()) {
      return s.set(a, { mode: 511, type: "dir", size: 0, ino: 0, mtimeMs: Date.now() }), s;
    }
    activate(s = null) {
      s === null ? this._root = /* @__PURE__ */ new Map([["/", this._makeRoot()]]) : typeof s == "string" ? this._root = /* @__PURE__ */ new Map([["/", this._makeRoot(this.parse(s))]]) : this._root = s;
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
    _countInodes(s) {
      let l = 1;
      for (let [f, u] of s)
        f !== a && (l += this._countInodes(u));
      return l;
    }
    autoinc() {
      return this._maxInode(this._root.get("/")) + 1;
    }
    _maxInode(s) {
      let l = s.get(a).ino;
      for (let [f, u] of s)
        f !== a && (l = Math.max(l, this._maxInode(u)));
      return l;
    }
    print(s = this._root.get("/")) {
      let l = "";
      const f = (u, m) => {
        for (let [g, y] of u) {
          if (g === 0) continue;
          let E = y.get(a), A = E.mode.toString(8);
          l += `${"	".repeat(m)}${g}	${A}`, E.type === "file" ? l += `	${E.size}	${E.mtimeMs}
` : (l += `
`, f(y, m + 1));
        }
      };
      return f(s, 0), l;
    }
    parse(s) {
      let l = 0;
      function f(y) {
        const E = ++l, A = y.length === 1 ? "dir" : "file";
        let [T, I, R] = y;
        return T = parseInt(T, 8), I = I ? parseInt(I) : 0, R = R ? parseInt(R) : Date.now(), /* @__PURE__ */ new Map([[a, { mode: T, type: A, size: I, mtimeMs: R, ino: E }]]);
      }
      let u = s.trim().split(`
`), m = this._makeRoot(), g = [
        { indent: -1, node: m },
        { indent: 0, node: null }
      ];
      for (let y of u) {
        let A = y.match(/^\t*/)[0].length;
        y = y.slice(A);
        let [T, ...I] = y.split("	"), R = f(I);
        if (A <= g[g.length - 1].indent)
          for (; A <= g[g.length - 1].indent; )
            g.pop();
        g.push({ indent: A, node: R }), g[g.length - 2].node.set(T, R);
      }
      return m;
    }
    _lookup(s, l = !0) {
      let f = this._root, u = "/", m = t.split(s);
      for (let g = 0; g < m.length; ++g) {
        let y = m[g];
        if (f = f.get(y), !f) throw new r(s);
        if (l || g < m.length - 1) {
          const E = f.get(a);
          if (E.type === "symlink") {
            let A = t.resolve(u, E.target);
            f = this._lookup(A);
          }
          u ? u = t.join(u, y) : u = y;
        }
      }
      return f;
    }
    mkdir(s, { mode: l }) {
      if (s === "/") throw new e();
      let f = this._lookup(t.dirname(s)), u = t.basename(s);
      if (f.has(u))
        throw new e();
      let m = /* @__PURE__ */ new Map(), g = {
        mode: l,
        type: "dir",
        size: 0,
        mtimeMs: Date.now(),
        ino: this.autoinc()
      };
      m.set(a, g), f.set(u, m);
    }
    rmdir(s) {
      let l = this._lookup(s);
      if (l.get(a).type !== "dir") throw new i();
      if (l.size > 1) throw new n();
      let f = this._lookup(t.dirname(s)), u = t.basename(s);
      f.delete(u);
    }
    readdir(s) {
      let l = this._lookup(s);
      if (l.get(a).type !== "dir") throw new i();
      return [...l.keys()].filter((f) => typeof f == "string");
    }
    writeStat(s, l, { mode: f }) {
      let u;
      try {
        let A = this.stat(s);
        f == null && (f = A.mode), u = A.ino;
      } catch {
      }
      f == null && (f = 438), u == null && (u = this.autoinc());
      let m = this._lookup(t.dirname(s)), g = t.basename(s), y = {
        mode: f,
        type: "file",
        size: l,
        mtimeMs: Date.now(),
        ino: u
      }, E = /* @__PURE__ */ new Map();
      return E.set(a, y), m.set(g, E), y;
    }
    unlink(s) {
      let l = this._lookup(t.dirname(s)), f = t.basename(s);
      l.delete(f);
    }
    rename(s, l) {
      let f = t.basename(l), u = this._lookup(s);
      this._lookup(t.dirname(l)).set(f, u), this.unlink(s);
    }
    stat(s) {
      return this._lookup(s).get(a);
    }
    lstat(s) {
      return this._lookup(s, !1).get(a);
    }
    readlink(s) {
      return this._lookup(s, !1).get(a).target;
    }
    symlink(s, l) {
      let f, u;
      try {
        let A = this.stat(l);
        u === null && (u = A.mode), f = A.ino;
      } catch {
      }
      u == null && (u = 40960), f == null && (f = this.autoinc());
      let m = this._lookup(t.dirname(l)), g = t.basename(l), y = {
        mode: u,
        type: "symlink",
        target: s,
        size: 0,
        mtimeMs: Date.now(),
        ino: f
      }, E = /* @__PURE__ */ new Map();
      return E.set(a, y), m.set(g, E), y;
    }
    _du(s) {
      let l = 0;
      for (const [f, u] of s.entries())
        f === a ? l += u.size : l += this._du(u);
      return l;
    }
    du(s) {
      let l = this._lookup(s);
      return this._du(l);
    }
  }, Nn;
}
class js {
  constructor(e = "keyval-store", r = "keyval") {
    this.storeName = r, this._dbName = e, this._storeName = r, this._init();
  }
  _init() {
    this._dbp || (this._dbp = new Promise((e, r) => {
      const i = indexedDB.open(this._dbName);
      i.onerror = () => r(i.error), i.onsuccess = () => e(i.result), i.onupgradeneeded = () => {
        i.result.createObjectStore(this._storeName);
      };
    }));
  }
  _withIDBStore(e, r) {
    return this._init(), this._dbp.then((i) => new Promise((n, a) => {
      const o = i.transaction(this.storeName, e);
      o.oncomplete = () => n(), o.onabort = o.onerror = () => a(o.error), r(o.objectStore(this.storeName));
    }));
  }
  _close() {
    return this._init(), this._dbp.then((e) => {
      e.close(), this._dbp = void 0;
    });
  }
}
let Mn;
function br() {
  return Mn || (Mn = new js()), Mn;
}
function jh(t, e = br()) {
  let r;
  return e._withIDBStore("readwrite", (i) => {
    r = i.get(t);
  }).then(() => r.result);
}
function zh(t, e, r = br()) {
  return r._withIDBStore("readwrite", (i) => {
    i.put(e, t);
  });
}
function Hh(t, e, r = br()) {
  return r._withIDBStore("readwrite", (i) => {
    const n = i.get(t);
    n.onsuccess = () => {
      i.put(e(n.result), t);
    };
  });
}
function Wh(t, e = br()) {
  return e._withIDBStore("readwrite", (r) => {
    r.delete(t);
  });
}
function qh(t = br()) {
  return t._withIDBStore("readwrite", (e) => {
    e.clear();
  });
}
function Gh(t = br()) {
  const e = [];
  return t._withIDBStore("readwrite", (r) => {
    (r.openKeyCursor || r.openCursor).call(r).onsuccess = function() {
      this.result && (e.push(this.result.key), this.result.continue());
    };
  }).then(() => e);
}
function Zh(t = br()) {
  return t._close();
}
var Vh = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  Store: js,
  clear: qh,
  close: Zh,
  del: Wh,
  get: jh,
  keys: Gh,
  set: zh,
  update: Hh
}), zs = /* @__PURE__ */ Pc(Vh), Un, Io;
function Xh() {
  if (Io) return Un;
  Io = 1;
  const t = zs;
  return Un = class {
    constructor(r, i) {
      this._database = r, this._storename = i, this._store = new t.Store(this._database, this._storename);
    }
    saveSuperblock(r) {
      return t.set("!root", r, this._store);
    }
    loadSuperblock() {
      return t.get("!root", this._store);
    }
    readFile(r) {
      return t.get(r, this._store);
    }
    writeFile(r, i) {
      return t.set(r, i, this._store);
    }
    unlink(r) {
      return t.del(r, this._store);
    }
    wipe() {
      return t.clear(this._store);
    }
    close() {
      return t.close(this._store);
    }
  }, Un;
}
var Pn, Ro;
function Yh() {
  return Ro || (Ro = 1, Pn = class {
    constructor(e) {
      this._url = e;
    }
    loadSuperblock() {
      return fetch(this._url + "/.superblock.txt").then((e) => e.ok ? e.text() : null);
    }
    async readFile(e) {
      const r = await fetch(this._url + e);
      if (r.status === 200)
        return r.arrayBuffer();
      throw new Error("ENOENT");
    }
    async sizeFile(e) {
      const r = await fetch(this._url + e, { method: "HEAD" });
      if (r.status === 200)
        return r.headers.get("content-length");
      throw new Error("ENOENT");
    }
  }), Pn;
}
var Ln, To;
function Kh() {
  if (To) return Ln;
  To = 1;
  const t = zs, e = (r) => new Promise((i) => setTimeout(i, r));
  return Ln = class {
    constructor(i, n) {
      this._id = Math.random(), this._database = i, this._storename = n, this._store = new t.Store(this._database, this._storename), this._lock = null;
    }
    async has({ margin: i = 2e3 } = {}) {
      if (this._lock && this._lock.holder === this._id) {
        const n = Date.now();
        return this._lock.expires > n + i ? !0 : await this.renew();
      } else
        return !1;
    }
    // Returns true if successful
    async renew({ ttl: i = 5e3 } = {}) {
      let n;
      return await t.update("lock", (a) => {
        const s = Date.now() + i;
        return n = a && a.holder === this._id, this._lock = n ? { holder: this._id, expires: s } : a, this._lock;
      }, this._store), n;
    }
    // Returns true if successful
    async acquire({ ttl: i = 5e3 } = {}) {
      let n, a, o;
      if (await t.update("lock", (s) => {
        const l = Date.now(), f = l + i;
        return a = s && s.expires < l, n = s === void 0 || a, o = s && s.holder === this._id, this._lock = n ? { holder: this._id, expires: f } : s, this._lock;
      }, this._store), o)
        throw new Error("Mutex double-locked");
      return n;
    }
    // check at 10Hz, give up after 10 minutes
    async wait({ interval: i = 100, limit: n = 6e3, ttl: a } = {}) {
      for (; n--; ) {
        if (await this.acquire({ ttl: a })) return !0;
        await e(i);
      }
      throw new Error("Mutex timeout");
    }
    // Returns true if successful
    async release({ force: i = !1 } = {}) {
      let n, a, o;
      if (await t.update("lock", (s) => (n = i || s && s.holder === this._id, a = s === void 0, o = s && s.holder !== this._id, this._lock = n ? void 0 : s, this._lock), this._store), await t.close(this._store), !n && !i) {
        if (a) throw new Error("Mutex double-freed");
        if (o) throw new Error("Mutex lost ownership");
      }
      return n;
    }
  }, Ln;
}
var jn, $o;
function Jh() {
  return $o || ($o = 1, jn = class {
    constructor(e) {
      this._id = Math.random(), this._database = e, this._has = !1, this._release = null;
    }
    async has() {
      return this._has;
    }
    // Returns true if successful
    async acquire() {
      return new Promise((e) => {
        navigator.locks.request(this._database + "_lock", { ifAvailable: !0 }, (r) => (this._has = !!r, e(!!r), new Promise((i) => {
          this._release = i;
        })));
      });
    }
    // Returns true if successful, gives up after 10 minutes
    async wait({ timeout: e = 6e5 } = {}) {
      return new Promise((r, i) => {
        const n = new AbortController();
        setTimeout(() => {
          n.abort(), i(new Error("Mutex timeout"));
        }, e), navigator.locks.request(this._database + "_lock", { signal: n.signal }, (a) => (this._has = !!a, r(!!a), new Promise((o) => {
          this._release = o;
        })));
      });
    }
    // Returns true if successful
    async release({ force: e = !1 } = {}) {
      this._has = !1, this._release ? this._release() : e && navigator.locks.request(this._database + "_lock", { steal: !0 }, (r) => !0);
    }
  }), jn;
}
var zn, Bo;
function Qh() {
  if (Bo) return zn;
  Bo = 1;
  const { encode: t, decode: e } = Uh(), r = Ph(), i = Lh(), { ENOENT: n, ENOTEMPTY: a, ETIMEDOUT: o } = Ls(), s = Xh(), l = Yh(), f = Kh(), u = Jh(), m = da();
  return zn = class {
    constructor() {
      this.saveSuperblock = r(() => {
        this.flush();
      }, 500);
    }
    async init(y, {
      wipe: E,
      url: A,
      urlauto: T,
      fileDbName: I = y,
      db: R = null,
      fileStoreName: D = y + "_files",
      lockDbName: L = y + "_lock",
      lockStoreName: U = y + "_lock"
    } = {}) {
      this._name = y, this._idb = R || new s(I, D), this._mutex = navigator.locks ? new u(y) : new f(L, U), this._cache = new i(y), this._opts = { wipe: E, url: A }, this._needsWipe = !!E, A && (this._http = new l(A), this._urlauto = !!T);
    }
    async activate() {
      if (this._cache.activated) return;
      this._needsWipe && (this._needsWipe = !1, await this._idb.wipe(), await this._mutex.release({ force: !0 })), await this._mutex.has() || await this._mutex.wait();
      const y = await this._idb.loadSuperblock();
      if (y)
        this._cache.activate(y);
      else if (this._http) {
        const E = await this._http.loadSuperblock();
        this._cache.activate(E), await this._saveSuperblock();
      } else
        this._cache.activate();
      if (!await this._mutex.has())
        throw new o();
    }
    async deactivate() {
      await this._mutex.has() && await this._saveSuperblock(), this._cache.deactivate();
      try {
        await this._mutex.release();
      } catch (y) {
        console.log(y);
      }
      await this._idb.close();
    }
    async _saveSuperblock() {
      this._cache.activated && (this._lastSavedAt = Date.now(), await this._idb.saveSuperblock(this._cache._root));
    }
    _writeStat(y, E, A) {
      let T = m.split(m.dirname(y)), I = T.shift();
      for (let R of T) {
        I = m.join(I, R);
        try {
          this._cache.mkdir(I, { mode: 511 });
        } catch {
        }
      }
      return this._cache.writeStat(y, E, A);
    }
    async readFile(y, E) {
      const { encoding: A } = E;
      if (A && A !== "utf8") throw new Error('Only "utf8" encoding is supported in readFile');
      let T = null, I = null;
      try {
        I = this._cache.stat(y), T = await this._idb.readFile(I.ino);
      } catch (R) {
        if (!this._urlauto) throw R;
      }
      if (!T && this._http) {
        let R = this._cache.lstat(y);
        for (; R.type === "symlink"; )
          y = m.resolve(m.dirname(y), R.target), R = this._cache.lstat(y);
        T = await this._http.readFile(y);
      }
      if (T && ((!I || I.size != T.byteLength) && (I = await this._writeStat(y, T.byteLength, { mode: I ? I.mode : 438 }), this.saveSuperblock()), A === "utf8" ? T = e(T) : T.toString = () => e(T)), !I) throw new n(y);
      return T;
    }
    async writeFile(y, E, A) {
      const { mode: T, encoding: I = "utf8" } = A;
      if (typeof E == "string") {
        if (I !== "utf8")
          throw new Error('Only "utf8" encoding is supported in writeFile');
        E = t(E);
      }
      const R = await this._cache.writeStat(y, E.byteLength, { mode: T });
      await this._idb.writeFile(R.ino, E);
    }
    async unlink(y, E) {
      const A = this._cache.lstat(y);
      this._cache.unlink(y), A.type !== "symlink" && await this._idb.unlink(A.ino);
    }
    readdir(y, E) {
      return this._cache.readdir(y);
    }
    mkdir(y, E) {
      const { mode: A = 511 } = E;
      this._cache.mkdir(y, { mode: A });
    }
    rmdir(y, E) {
      if (y === "/")
        throw new a();
      this._cache.rmdir(y);
    }
    rename(y, E) {
      this._cache.rename(y, E);
    }
    stat(y, E) {
      return this._cache.stat(y);
    }
    lstat(y, E) {
      return this._cache.lstat(y);
    }
    readlink(y, E) {
      return this._cache.readlink(y);
    }
    symlink(y, E) {
      this._cache.symlink(y, E);
    }
    async backFile(y, E) {
      let A = await this._http.sizeFile(y);
      await this._writeStat(y, A, E);
    }
    du(y) {
      return this._cache.du(y);
    }
    flush() {
      return this._saveSuperblock();
    }
  }, zn;
}
var Hn, Ao;
function ed() {
  return Ao || (Ao = 1, Hn = class {
    constructor(e) {
      this.type = e.type, this.mode = e.mode, this.size = e.size, this.ino = e.ino, this.mtimeMs = e.mtimeMs, this.ctimeMs = e.ctimeMs || e.mtimeMs, this.uid = 1, this.gid = 1, this.dev = 1;
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
  }), Hn;
}
var Wn, Do;
function td() {
  if (Do) return Wn;
  Do = 1;
  const t = Qh(), e = ed(), r = da();
  function i(o, s, ...l) {
    return o = r.normalize(o), (typeof s > "u" || typeof s == "function") && (s = {}), typeof s == "string" && (s = {
      encoding: s
    }), [o, s, ...l];
  }
  function n(o, s, l, ...f) {
    return o = r.normalize(o), (typeof l > "u" || typeof l == "function") && (l = {}), typeof l == "string" && (l = {
      encoding: l
    }), [o, s, l, ...f];
  }
  function a(o, s, ...l) {
    return [r.normalize(o), r.normalize(s), ...l];
  }
  return Wn = class {
    constructor(s, l = {}) {
      this.init = this.init.bind(this), this.readFile = this._wrap(this.readFile, i, !1), this.writeFile = this._wrap(this.writeFile, n, !0), this.unlink = this._wrap(this.unlink, i, !0), this.readdir = this._wrap(this.readdir, i, !1), this.mkdir = this._wrap(this.mkdir, i, !0), this.rmdir = this._wrap(this.rmdir, i, !0), this.rename = this._wrap(this.rename, a, !0), this.stat = this._wrap(this.stat, i, !1), this.lstat = this._wrap(this.lstat, i, !1), this.readlink = this._wrap(this.readlink, i, !1), this.symlink = this._wrap(this.symlink, a, !0), this.backFile = this._wrap(this.backFile, i, !0), this.du = this._wrap(this.du, i, !1), this._deactivationPromise = null, this._deactivationTimeout = null, this._activationPromise = null, this._operations = /* @__PURE__ */ new Set(), s && this.init(s, l);
    }
    async init(...s) {
      return this._initPromiseResolve && await this._initPromise, this._initPromise = this._init(...s), this._initPromise;
    }
    async _init(s, l = {}) {
      await this._gracefulShutdown(), this._activationPromise && await this._deactivate(), this._backend && this._backend.destroy && await this._backend.destroy(), this._backend = l.backend || new t(), this._backend.init && await this._backend.init(s, l), this._initPromiseResolve && (this._initPromiseResolve(), this._initPromiseResolve = null), l.defer || this.stat("/");
    }
    async _gracefulShutdown() {
      this._operations.size > 0 && (this._isShuttingDown = !0, await new Promise((s) => this._gracefulShutdownResolve = s), this._isShuttingDown = !1, this._gracefulShutdownResolve = null);
    }
    _wrap(s, l, f) {
      return async (...u) => {
        u = l(...u);
        let m = {
          name: s.name,
          args: u
        };
        this._operations.add(m);
        try {
          return await this._activate(), await s.apply(this, u);
        } finally {
          this._operations.delete(m), f && this._backend.saveSuperblock(), this._operations.size === 0 && (this._deactivationTimeout || clearTimeout(this._deactivationTimeout), this._deactivationTimeout = setTimeout(this._deactivate.bind(this), 500));
        }
      };
    }
    async _activate() {
      this._initPromise || console.warn(new Error(`Attempted to use LightningFS ${this._name} before it was initialized.`)), await this._initPromise, this._deactivationTimeout && (clearTimeout(this._deactivationTimeout), this._deactivationTimeout = null), this._deactivationPromise && await this._deactivationPromise, this._deactivationPromise = null, this._activationPromise || (this._activationPromise = this._backend.activate ? this._backend.activate() : Promise.resolve()), await this._activationPromise;
    }
    async _deactivate() {
      return this._activationPromise && await this._activationPromise, this._deactivationPromise || (this._deactivationPromise = this._backend.deactivate ? this._backend.deactivate() : Promise.resolve()), this._activationPromise = null, this._gracefulShutdownResolve && this._gracefulShutdownResolve(), this._deactivationPromise;
    }
    async readFile(s, l) {
      return this._backend.readFile(s, l);
    }
    async writeFile(s, l, f) {
      return await this._backend.writeFile(s, l, f), null;
    }
    async unlink(s, l) {
      return await this._backend.unlink(s, l), null;
    }
    async readdir(s, l) {
      return this._backend.readdir(s, l);
    }
    async mkdir(s, l) {
      return await this._backend.mkdir(s, l), null;
    }
    async rmdir(s, l) {
      return await this._backend.rmdir(s, l), null;
    }
    async rename(s, l) {
      return await this._backend.rename(s, l), null;
    }
    async stat(s, l) {
      const f = await this._backend.stat(s, l);
      return new e(f);
    }
    async lstat(s, l) {
      const f = await this._backend.lstat(s, l);
      return new e(f);
    }
    async readlink(s, l) {
      return this._backend.readlink(s, l);
    }
    async symlink(s, l) {
      return await this._backend.symlink(s, l), null;
    }
    async backFile(s, l) {
      return await this._backend.backFile(s, l), null;
    }
    async du(s) {
      return this._backend.du(s);
    }
    async flush() {
      return this._backend.flush();
    }
  }, Wn;
}
var qn, Oo;
function rd() {
  if (Oo) return qn;
  Oo = 1;
  const t = Nh(), e = td();
  function r(i, n) {
    return typeof i == "function" && (n = i), n = t(n), [(...o) => n(null, ...o), n];
  }
  return qn = class {
    constructor(...n) {
      this.promises = new e(...n), this.init = this.init.bind(this), this.readFile = this.readFile.bind(this), this.writeFile = this.writeFile.bind(this), this.unlink = this.unlink.bind(this), this.readdir = this.readdir.bind(this), this.mkdir = this.mkdir.bind(this), this.rmdir = this.rmdir.bind(this), this.rename = this.rename.bind(this), this.stat = this.stat.bind(this), this.lstat = this.lstat.bind(this), this.readlink = this.readlink.bind(this), this.symlink = this.symlink.bind(this), this.backFile = this.backFile.bind(this), this.du = this.du.bind(this), this.flush = this.flush.bind(this);
    }
    init(n, a) {
      return this.promises.init(n, a);
    }
    readFile(n, a, o) {
      const [s, l] = r(a, o);
      this.promises.readFile(n, a).then(s).catch(l);
    }
    writeFile(n, a, o, s) {
      const [l, f] = r(o, s);
      this.promises.writeFile(n, a, o).then(l).catch(f);
    }
    unlink(n, a, o) {
      const [s, l] = r(a, o);
      this.promises.unlink(n, a).then(s).catch(l);
    }
    readdir(n, a, o) {
      const [s, l] = r(a, o);
      this.promises.readdir(n, a).then(s).catch(l);
    }
    mkdir(n, a, o) {
      const [s, l] = r(a, o);
      this.promises.mkdir(n, a).then(s).catch(l);
    }
    rmdir(n, a, o) {
      const [s, l] = r(a, o);
      this.promises.rmdir(n, a).then(s).catch(l);
    }
    rename(n, a, o) {
      const [s, l] = r(o);
      this.promises.rename(n, a).then(s).catch(l);
    }
    stat(n, a, o) {
      const [s, l] = r(a, o);
      this.promises.stat(n).then(s).catch(l);
    }
    lstat(n, a, o) {
      const [s, l] = r(a, o);
      this.promises.lstat(n).then(s).catch(l);
    }
    readlink(n, a, o) {
      const [s, l] = r(a, o);
      this.promises.readlink(n).then(s).catch(l);
    }
    symlink(n, a, o) {
      const [s, l] = r(o);
      this.promises.symlink(n, a).then(s).catch(l);
    }
    backFile(n, a, o) {
      const [s, l] = r(a, o);
      this.promises.backFile(n, a).then(s).catch(l);
    }
    du(n, a) {
      const [o, s] = r(a);
      this.promises.du(n).then(o).catch(s);
    }
    flush(n) {
      const [a, o] = r(n);
      this.promises.flush().then(a).catch(o);
    }
  }, qn;
}
var id = rd(), Ri = /* @__PURE__ */ Qt(id);
const Hs = new yi(Hr.logging.fsManagerES6);
function Rt(...t) {
  Hs.consoleDotLog("[fsManagerES6] ", ...t);
}
function Gn(...t) {
  Hs.consoleDotError("[fsManagerES6] ", ...t);
}
Rt("Loading fsmanagerES6.");
class nd {
  constructor(e = { supportsServiceWorker: !0, useSW: !0 }) {
    this.fsInstances = /* @__PURE__ */ new Map(), this.initializationLocks = /* @__PURE__ */ new Map(), this.debug = !0, this.options = e, this.memoryBackends = /* @__PURE__ */ new Map();
  }
  _log(...e) {
    this.debug && Rt("[fsManager]", ...e);
  }
  _error(...e) {
    Gn("[fsManager]", ...e);
  }
  async initializeFS(e, r) {
    const i = `${e}-${r}`;
    this._log(`Initializing FS: ${i}`);
    try {
      if (Rt("Initializing."), this.fsInstances.has(i))
        return this._log(`FS ${i} already exists`), this.fsInstances.get(i);
      let n;
      if (r === "memory") {
        Rt(`Creating memory FS for ${i}`);
        const a = new yo(this.options, e);
        Rt(`Memory backend created for ${i} backend: `, a), this.memoryBackends.set(i, a), n = new Ri(e, { backend: a }), Rt(`Memory FS created for ${i}`), this._log(`Created memory FS with backend for ${i}`);
      } else if (r === "idb")
        n = new Ri(e), this._log(`Created IDB FS for ${i}`);
      else
        throw new Error(`Unsupported FS type: ${r}`);
      return this.fsInstances.set(i, n), n;
    } catch (n) {
      throw this._error(`Failed to initialize ${i}:`, n), n;
    }
  }
  async getFS(e, r) {
    const i = `${e}-${r}`;
    if (this._log(`Requesting FS: ${i}`), this.initializationLocks.has(i))
      return this._log(`Waiting for existing initialization of ${i}`), this.initializationLocks.get(i);
    const n = (async () => {
      try {
        return this.fsInstances.has(i) ? this.fsInstances.get(i) : await this.initializeFS(e, r);
      } finally {
        this.initializationLocks.delete(i);
      }
    })();
    return this.initializationLocks.set(i, n), n;
  }
  async deleteFS(e, r) {
    const i = `${e}-${r}`;
    this._log(`Deleting FS: ${i}`);
    try {
      if (!this.fsInstances.has(i)) {
        this._log(`File system ${i} does not exist. Nothing to delete.`);
        return;
      }
      const n = this.fsInstances.get(i);
      if (r === "idb")
        try {
          await this.deleteIndexedDB(e), this._log(`IndexedDB file system ${i} deleted successfully.`);
        } catch (a) {
          throw this._error(`Error deleting IndexedDB file system ${i}:`, a), a;
        }
      else if (r === "memory") {
        if (this.memoryBackends.has(i)) {
          const a = this.memoryBackends.get(i);
          if (a && a.close)
            try {
              await a.close(), this._log(`Memory backend for ${i} closed successfully.`);
            } catch (o) {
              this._error(`Error closing memory backend for ${i}:`, o);
            }
          this.memoryBackends.delete(i);
        }
        this._log(`Memory file system ${i} deleted successfully.`);
      } else
        throw new Error(`Unsupported file system type: ${r}`);
      this.fsInstances.delete(i);
    } catch (n) {
      throw this._error(`Failed to delete ${i}:`, n), n;
    }
  }
  // Enhanced createBackupFS method with better memory support
  async createBackupFS(e, r, i = "_replica") {
    const n = `${e}${i}`, a = `${e}-${r}`, o = `${n}-${r}`;
    this._log(`Creating backup of ${a} as ${o}`);
    try {
      const s = await this.getFS(e, r);
      if (r === "memory") {
        const l = this.memoryBackends.get(a);
        if (!l)
          throw new Error("Original memory backend not found");
        const f = new yo({
          ...this.options,
          deviceId: `${this.options.deviceId || "default"}-${Date.now()}`
        }, n);
        if (l._files instanceof Map)
          for (const [m, g] of l._files)
            f._files.set(m, { ...g });
        else
          throw new Error("Original memory backend files not in expected format");
        const u = new Ri(n, { backend: f });
        this.fsInstances.set(o, u), this.memoryBackends.set(o, f);
      } else if (r === "idb") {
        const l = new Ri(n);
        this.fsInstances.set(o, l), await this._copyIDBContents(s, l, "/");
      } else
        throw new Error(`Unsupported FS type for backup: ${r}`);
      return await this._registerBackupMount(e, n), this._log(`Backup created successfully: ${o}`), this.fsInstances.get(o);
    } catch (s) {
      throw this._error(`Failed to create backup ${o}:`, s), this.fsInstances.has(o) && this.fsInstances.delete(o), this.memoryBackends.has(o) && this.memoryBackends.delete(o), s;
    }
  }
  // Memory-specific methods
  async getMemorySnapshot(e) {
    const r = `${e}-memory`;
    if (!this.memoryBackends.has(r))
      throw new Error(`Memory filesystem ${e} not found`);
    const i = this.memoryBackends.get(r);
    if (!i._files)
      throw new Error("Memory backend files not initialized");
    const n = /* @__PURE__ */ new Map();
    for (const [a, o] of i._files)
      n.set(a, { ...o });
    return n;
  }
  async restoreMemorySnapshot(e, r) {
    const i = `${e}-memory`;
    if (!this.memoryBackends.has(i))
      throw new Error(`Memory filesystem ${e} not found`);
    const n = this.memoryBackends.get(i);
    n._files || n._initializeRoot(), n._files.clear();
    for (const [a, o] of r)
      n._files.set(a, { ...o });
    this._log(`Memory filesystem ${e} restored from snapshot`);
  }
  async getMemoryStats(e) {
    const r = `${e}-memory`;
    if (!this.memoryBackends.has(r))
      throw new Error(`Memory filesystem ${e} not found`);
    const i = this.memoryBackends.get(r);
    if (!i._files)
      return {
        fileCount: 0,
        totalSize: 0,
        paths: []
      };
    let n = 0, a = 0;
    const o = [];
    for (const [s, l] of i._files)
      n++, a += l.data ? l.data.byteLength : 0, o.push(s);
    return {
      fileCount: n,
      totalSize: a,
      paths: o.sort()
    };
  }
  async _copyIDBContents(e, r, i = "/") {
    try {
      const n = i === "/" ? "/" : i.replace(/\/+$/, ""), a = await e.promises.readdir(n);
      for (const o of a) {
        const s = n === "/" ? `/${o}` : `${n}/${o}`, l = s;
        try {
          if ((await e.promises.stat(s)).isDirectory()) {
            try {
              await r.promises.mkdir(l, { recursive: !0 });
            } catch (u) {
              if (u.code !== "EEXIST")
                throw u;
              Rt(`Directory ${l} already exists, continuing`);
            }
            await this._copyIDBContents(e, r, s);
          } else {
            const u = await e.promises.readFile(s);
            await r.promises.writeFile(l, u);
          }
        } catch (f) {
          this._error(`Error processing ${s}:`, f);
          continue;
        }
      }
    } catch (n) {
      throw n.code === "ENOENT" ? this._error(`Source path ${i} does not exist`) : n.code === "EEXIST" ? Rt(`Path ${i} already exists`) : this._error(`Error copying path ${i}:`, n), n;
    }
  }
  async _registerBackupMount(e, r, i = {}) {
    const a = { ...{
      readOnly: !0,
      // Backups are typically read-only
      hidden: !1,
      // Whether to hide from normal listings
      preserveOriginal: !0,
      // Keep original metadata
      mountPath: `/${r}`
      // Customizable mount path
    }, ...i }, { mountPath: o } = a;
    this._log(`Registering backup mount from ${e} to ${o}`);
    try {
      if (typeof this.mounts != "object" && (this.mounts = {}), this.backupRegistry || (this.backupRegistry = /* @__PURE__ */ new Map()), this.mounts[o])
        throw new Error(`Mount path ${o} already in use`);
      const s = this.mounts[`/${e}`] || {};
      return this.mounts[o] = {
        ...a.preserveOriginal ? s : {},
        fsName: r,
        isBackup: !0,
        originalFsName: e,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        lastAccessed: null,
        accessCount: 0,
        metadata: {
          ...s.metadata || {},
          backupType: "full",
          // could be 'incremental' or 'differential'
          backupVersion: 1,
          ...a
        }
      }, this.backupRegistry.set(r, {
        original: e,
        mountPoint: o,
        createdAt: this.mounts[o].createdAt,
        options: a,
        stats: {
          fileCount: 0,
          // Could be populated during backup
          totalSize: 0,
          // Could be populated during backup
          lastVerified: null
        }
      }), this._log(`Successfully registered backup mount at ${o}`), {
        mountPath: o,
        backupName: r,
        originalName: e,
        details: this.mounts[o]
      };
    } catch (s) {
      throw this._error("Failed to register backup mount:", s), this.mounts && this.mounts[o] && delete this.mounts[o], this.backupRegistry && this.backupRegistry.has(r) && this.backupRegistry.delete(r), s;
    }
  }
  async deleteIndexedDB(e) {
    return new Promise((r, i) => {
      const n = indexedDB.deleteDatabase(e);
      n.onsuccess = () => {
        Rt(`Deleted database ${e} successfully`), r();
      }, n.onerror = (a) => {
        Gn(`Error deleting database ${e}:`, a), i(a);
      }, n.onblocked = () => {
        console.warn(`Delete database ${e} blocked`);
      };
    });
  }
  async getFileStoreNames(e, r) {
    const i = `${e}-${r}`;
    if (!this.fsInstances.has(i))
      throw new Error(`File system ${i} not found. Call initializeFS first.`);
    if (r === "idb")
      try {
        const n = await this.getFileStoresFromDatabases();
        return Rt(`File store names for ${i}:`, n), n;
      } catch (n) {
        throw Gn(`Error retrieving file store names for ${i}:`, n), n;
      }
    else if (r === "memory") {
      if (this.memoryBackends.has(i)) {
        const n = this.memoryBackends.get(i);
        if (n._files)
          return {
            fileCount: n._files.size,
            filePaths: Array.from(n._files.keys())
          };
      }
      return {
        fileCount: 0,
        filePaths: []
      };
    } else
      throw new Error(`Unsupported file system type: ${r}`);
  }
  async processDatabaseList(e) {
    const r = [];
    for (const i of e) {
      const n = typeof i == "string" ? i : i.name, o = (await this.openDatabase(n)).objectStoreNames, s = Array.from(o).filter((l) => l.startsWith("fs_")).map((l) => ({ database: n, fileStore: l }));
      r.push(...s);
    }
    return Rt("Processing database list:", r), r;
  }
  async openDatabase(e) {
    return Rt("Opening database:", e), new Promise((r, i) => {
      const n = indexedDB.open(e);
      n.onsuccess = (a) => {
        const o = a.target.result;
        r(o);
      }, n.onerror = (a) => {
        i(`Error opening database ${e}: ${a.target.error}`);
      };
    });
  }
  async getFileStoresFromDatabases() {
    return new Promise((e, r) => {
      const i = indexedDB.webkitGetDatabaseNames ? indexedDB.webkitGetDatabaseNames() : indexedDB.databases ? indexedDB.databases() : null;
      if (!i) {
        r("Your browser does not support retrieving a list of IndexedDB databases");
        return;
      }
      i instanceof Promise ? i.then((n) => {
        this.processDatabaseList(n).then((a) => e(a)).catch((a) => r(a));
      }).catch((n) => r(n)) : (i.onsuccess = async (n) => {
        const a = n.target.result;
        try {
          const o = await this.processDatabaseList(a);
          e(o);
        } catch (o) {
          r(o);
        }
      }, i.onerror = (n) => {
        r(`Error retrieving database list: ${n.target.error}`);
      });
    });
  }
}
var at = {
  async resolveRef(t, e, r = "HEAD") {
    try {
      return await re.resolveRef({
        fs: t,
        dir: e,
        ref: r
      });
    } catch (i) {
      throw console.error("Error resolving ref:", i), i;
    }
  },
  async readCommit(t, e, r) {
    try {
      return await re.readCommit({
        fs: t,
        dir: e,
        oid: r
      });
    } catch (i) {
      throw console.error("Error reading commit:", i), i;
    }
  }
};
const pe = new yi(Hr.logging.dotGit), wr = /* @__PURE__ */ new Map();
function mt(...t) {
  pe.consoleDotLog("[DotGit] ", ...t);
}
function ad(...t) {
  pe.consoleDotError("[DotGit] ", ...t);
}
var qt = {
  staged: wr,
  async commitStagedChanges(t, e, r = null, i = "System", n = "system@example.com") {
    try {
      if (pe.consoleDotLog("staged", wr, e), this.staged.size === 0)
        return pe.consoleDotLog("No staged changes to commit"), { committed: !1 };
      let a;
      try {
        a = await re.resolveRef({ fs: t, dir: e, ref: "HEAD" }), pe.consoleDotLog(`Parent commit OID: ${a}`);
      } catch {
        pe.consoleDotLog("No existing commit, starting fresh repository"), a = null;
      }
      let o = [];
      if (a) {
        const { commit: y } = await re.readCommit({ fs: t, dir: e, oid: a });
        o = (await re.readTree({ fs: t, dir: e, oid: y.tree })).tree;
      }
      const s = async (y, E) => {
        const A = JSON.parse(JSON.stringify(y));
        for (const [T, I] of E) {
          if (!T || typeof T != "string") {
            pe.consoleDotError("Invalid file path in staged changes:", T);
            continue;
          }
          const D = T.replace(/^\/+|\/+$/g, "").split("/").filter((B) => B.length > 0);
          if (D.length === 0) {
            pe.consoleDotError("Empty path in staged changes");
            continue;
          }
          const L = D.pop();
          let U = A, M = [];
          for (const B of D) {
            let O = U.find((z) => z.path === B && z.type === "tree");
            if (!O) {
              const z = await re.writeTree({ fs: t, dir: e, tree: [] });
              O = {
                mode: "040000",
                path: B,
                oid: z,
                type: "tree"
              }, U.push(O);
            }
            const { tree: W } = await re.readTree({ fs: t, dir: e, oid: O.oid });
            O.tree = W, U = W, M.push(B);
          }
          try {
            if (I.type === "write" || I.type === "writeDir") {
              const B = U.findIndex((W) => W.path === L), O = I.type === "writeDir" ? I.treeOid : I.oid;
              if (!O)
                throw new Error(`Missing OID for ${I.type} operation on ${T}`);
              B >= 0 ? (U[B].oid = O, U[B].type = I.type === "write" ? "blob" : "tree", U[B].mode = I.type === "write" ? "100644" : "040000") : U.push({
                mode: I.type === "write" ? "100644" : "040000",
                path: L,
                oid: O,
                type: I.type === "write" ? "blob" : "tree"
              });
            } else if (I.type === "remove" || I.type === "removeDir") {
              const B = U.findIndex((O) => O.path === L);
              B >= 0 && U.splice(B, 1);
            }
          } catch (B) {
            throw pe.consoleDotError(`Error processing ${I.type} for ${T}:`, B), B;
          }
        }
        return A;
      }, l = Array.from(this.staged.entries()), f = await s(o, l);
      for (const y of f)
        console.log("entry of updated tree, ", y), y.path || console.error("❌ Missing path:", y), y.oid || console.error("❌ Missing oid:", y);
      ((y) => {
        for (const E of y) {
          if (!E.path || typeof E.path != "string")
            throw new Error(`Invalid tree entry: ${JSON.stringify(E)}`);
          if (!E.oid || typeof E.oid != "string")
            throw new Error(`Invalid OID for path ${E.path}`);
        }
      })(f);
      const m = await this._writeFullTree(t, e, f), g = await this.commitChanges(t, e, {
        message: r || `Batch commit ${l.length} staged changes`,
        treeOid: m,
        parentCommitOids: a ? [a] : [],
        name: i,
        email: n,
        actionType: "batch",
        filePath: null
      });
      return this.staged.clear(), {
        committed: !0,
        commitOid: g,
        treeOid: m,
        stagedCount: l.length
      };
    } catch (a) {
      throw pe.consoleDotError("Error committing staged changes:", a), a;
    }
  },
  async commitChanges(t, e, {
    message: r,
    treeOid: i,
    parentCommitOids: n = [],
    name: a = "System",
    email: o = "system@example.com",
    actionType: s = "change",
    filePath: l = null
  }) {
    try {
      const f = await re.commit({
        fs: t,
        dir: e,
        message: r,
        tree: i,
        parent: n,
        author: { name: a, email: o }
      });
      return pe.consoleDotLog(`Committed ${s} for ${l || "repository"}: ${f}`), f;
    } catch (f) {
      throw pe.consoleDotError("Error committing changes:", f), f;
    }
  },
  async _writeFullTree(t, e, r) {
    const i = async (n) => {
      const a = [];
      for (const o of n)
        if (o.type === "tree") {
          const s = await i(o.tree || []);
          a.push({
            mode: "040000",
            path: o.path,
            oid: s,
            type: "tree"
          });
        } else
          a.push(o);
      return await re.writeTree({ fs: t, dir: e, tree: a });
    };
    return await i(r);
  },
  async findInGitHistory(t, e, r) {
    try {
      pe.consoleDotLog("Starting findInGitHistory function..."), pe.consoleDotLog(`File path: ${r}`);
      const i = r.split("/");
      pe.consoleDotLog(`Path parts: ${JSON.stringify(i)}`);
      let n = await at.resolveRef(t, e);
      for (pe.consoleDotLog(`Starting from commit: ${n}`); n; ) {
        pe.consoleDotLog(`Processing commit: ${n}`);
        const { commit: a } = await at.readCommit(t, e, n);
        let o = a.tree;
        pe.consoleDotLog(`Root tree OID: ${o}`);
        let s = !0;
        for (let l = 0; l < i.length; l++) {
          const f = i[l];
          pe.consoleDotLog(`Processing path part: ${f}`);
          const { tree: u } = await re.readTree({
            fs: t,
            dir: e,
            oid: o
          }), m = u.find((g) => g.path === f);
          if (!m) {
            pe.consoleDotLog(`Path part "${f}" not found in tree.`), s = !1;
            break;
          }
          if (l === i.length - 1)
            return pe.consoleDotLog(`Found path "${r}" in commit ${n}`, u), pe.consoleDotLog(m), {
              type: m.type,
              oid: m.oid,
              commitOid: n,
              treeOid: o
            };
          if (m.type === "tree")
            o = m.oid, pe.consoleDotLog(`Found subtree OID: ${o}`);
          else {
            pe.consoleDotLog(`Path part "${f}" is not a directory.`), s = !1;
            break;
          }
        }
        if (s)
          return pe.consoleDotLog(`Path "${r}" found in commit ${n}`), {
            type: "tree",
            oid: o,
            commitOid: n
          };
        n = a.parent.length > 0 ? a.parent[0] : null, pe.consoleDotLog(`Moving to parent commit: ${n}`);
      }
      throw new Error(`Path "${r}" not found in any commit.`);
    } catch (i) {
      throw pe.consoleDotLog("Error in findInGitHistory:", i), i;
    }
  },
  async readFileDot(t, e, r, i = null) {
    try {
      if (pe.consoleDotLog(`args are fs: ${t}, dir: ${e}, filePath: ${r}, commitOid: ${i}`), r = r.replace(/^\/+|\/+$/g, ""), i === "staged") {
        const m = this.staged.get(r);
        if (m && m.type === "write")
          try {
            const g = await re.readBlob({
              fs: t,
              dir: e,
              oid: m.oid
            }), y = g.blob instanceof ArrayBuffer ? new Uint8Array(g.blob) : g.blob instanceof Uint8Array ? g.blob : null;
            if (!y) throw new Error("Invalid blob data");
            return new TextDecoder().decode(y);
          } catch (g) {
            pe.consoleDotError("Error reading staged blob, falling back:", g);
          }
        else
          pe.consoleDotLog(`File "${r}" not found in staged changes. Falling back...`);
      }
      const n = r.split("/"), a = n.pop(), o = i && i !== "staged" ? i : await at.resolveRef(t, e), { commit: s } = await at.readCommit(t, e, o);
      let l = s.tree;
      for (const m of n) {
        const { tree: g } = await re.readTree({ fs: t, dir: e, oid: l }), y = g.find((E) => E.path === m && E.type === "tree");
        if (!y)
          return pe.consoleDotLog(`Directory "${m}" not found`), "";
        l = y.oid;
      }
      const f = await re.readBlob({
        fs: t,
        dir: e,
        oid: l,
        filepath: a
      }), u = f.blob instanceof ArrayBuffer ? new Uint8Array(f.blob) : f.blob instanceof Uint8Array ? f.blob : null;
      return u ? new TextDecoder().decode(u) : (pe.consoleDotError("Invalid blob data from commit"), "");
    } catch (n) {
      return pe.consoleDotError("Error in readFileDot:", n), "";
    }
  },
  async readDirDot(t, e, r, i = null) {
    try {
      if (r = r.replace(/^\/+|\/+$/g, ""), i === "staged")
        try {
          const f = Array.from(this.staged.entries()).filter(([u, m]) => {
            const g = u.replace(/^\/+|\/+$/g, ""), y = g.split("/"), E = r.split("/");
            return y.length === E.length + 1 && g.startsWith(r + (r ? "/" : ""));
          });
          if (f.length > 0)
            return {
              entries: f.map(([u, m]) => ({
                path: u.split("/").pop(),
                type: m.type === "write" ? "blob" : "tree",
                oid: m.oid,
                mode: m.type === "write" ? "100644" : "040000"
              })),
              dirPath: r,
              commitOid: "staged",
              treeOid: "staged"
            };
          pe.consoleDotLog(`No staged entries for "${r}", falling back...`);
        } catch (f) {
          pe.consoleDotError("Error reading staged directory, falling back:", f);
        }
      const n = i && i !== "staged" ? i : await at.resolveRef(t, e), { commit: a } = await at.readCommit(t, e, n);
      let o = a.tree;
      const s = r.split("/").filter(Boolean);
      for (const f of s) {
        const { tree: u } = await re.readTree({ fs: t, dir: e, oid: o }), m = u.find((g) => g.path === f && g.type === "tree");
        if (!m)
          return pe.consoleDotLog(`Directory "${f}" not found in commit tree.`), { entries: [], dirPath: r, commitOid: n, treeOid: o };
        o = m.oid;
      }
      const { tree: l } = await re.readTree({ fs: t, dir: e, oid: o });
      return {
        entries: l.map((f) => ({
          path: f.path,
          type: f.type,
          oid: f.oid,
          mode: f.mode
        })),
        dirPath: r,
        commitOid: n,
        treeOid: o
      };
    } catch (n) {
      return pe.consoleDotError("Error in readDirDot:", n), { entries: [], dirPath: r, commitOid: null, treeOid: null };
    }
  },
  async writeFileDot(t, e, r, i, n = "sample", a = "sample@email.com", o = 1) {
    try {
      pe.consoleDotLog("Starting writeFileDot function..."), r = r.replace(/^\/+|\/+$/g, "");
      const s = r.split("/"), l = s.pop(), f = await this.isDirectoryDot(t, e, r);
      if (f.exists) {
        if (f.isDirectory)
          throw new Error(`Path ${r} exists and is a directory - cannot write as file`);
        pe.consoleDotLog(`File ${r} exists and will be overwritten`);
      }
      const u = await re.writeBlob({
        fs: t,
        dir: e,
        blob: new TextEncoder().encode(i)
      });
      pe.consoleDotLog(`Blob OID created: ${u}`);
      let m;
      try {
        m = await re.resolveRef({ fs: t, dir: e, ref: "HEAD" }), pe.consoleDotLog(`Latest commit OID resolved: ${m}`);
      } catch {
        pe.consoleDotLog("No existing commit, starting fresh repository"), m = null;
      }
      let g = [];
      if (m) {
        const { commit: I } = await re.readCommit({ fs: t, dir: e, oid: m });
        g = (await re.readTree({ fs: t, dir: e, oid: I.tree })).tree, pe.consoleDotLog(`Current tree loaded with ${g.length} entries`);
      }
      const y = async (I, R, D) => {
        if (R.length === 0) {
          const W = I.findIndex((z) => z.path === l);
          if (W >= 0 && I[W].type === "tree")
            throw new Error(`Cannot overwrite directory ${l} with file content`);
          return W >= 0 ? I[W] = {
            mode: "100644",
            path: l,
            oid: D,
            type: "blob"
          } : I.push({
            mode: "100644",
            path: l,
            oid: D,
            type: "blob"
          }), I;
        }
        const L = R.shift();
        let U = I.find((W) => W.path === L && W.type === "tree");
        if (!U) {
          const W = await re.writeTree({ fs: t, dir: e, tree: [] });
          U = {
            mode: "040000",
            path: L,
            oid: W,
            type: "tree"
          }, I.push(U);
        }
        const { tree: M } = await re.readTree({ fs: t, dir: e, oid: U.oid }), B = await y([...M], R, D), O = await re.writeTree({ fs: t, dir: e, tree: B });
        return U.oid = O, I;
      }, E = await y([...g], [...s], u), A = await re.writeTree({ fs: t, dir: e, tree: E });
      pe.consoleDotLog(`New tree OID: ${A}`);
      let T = null;
      return o ? (T = await re.commit({
        fs: t,
        dir: e,
        message: `Updated ${r}`,
        tree: A,
        parent: m ? [m] : [],
        author: { name: n, email: a }
      }), pe.consoleDotLog(`New commit OID: ${T}`)) : (wr.set(r, {
        type: "write",
        oid: u,
        treeOid: A,
        filePath: r,
        action: "staged"
      }), pe.consoleDotLog(`Staged write for ${r} with blobOid ${u}`)), {
        blobOid: u,
        treeOid: A,
        commitOid: T,
        filePath: r,
        action: o ? "committed" : "staged",
        createdTrees: s.length
      };
    } catch (s) {
      throw pe.consoleDotError("Error in writeFileDot:", s), s;
    }
  },
  async isDirectoryDot(t, e, r) {
    try {
      if (mt("[isDirectoryDot] Checking path:", r), !r || r === "/") {
        mt("[isDirectoryDot] Path is root or empty, resolving root directory...");
        const l = await at.resolveRef(t, e);
        mt("[isDirectoryDot] Resolved commit OID:", l);
        const f = await at.readCommit(t, e, l), u = await re.readTree({
          fs: t,
          dir: e,
          oid: f.commit.tree
        });
        return mt("[isDirectoryDot] Root directory tree loaded:", u.tree), {
          exists: !0,
          isDirectory: !0,
          hasChildren: u.tree.length > 0
        };
      }
      const i = r.split("/").filter((l) => l.length > 0);
      mt("[isDirectoryDot] Path parts:", i);
      const n = await at.resolveRef(t, e);
      mt("[isDirectoryDot] Resolved commit OID:", n);
      const a = await at.readCommit(t, e, n), o = await re.readTree({
        fs: t,
        dir: e,
        oid: a.commit.tree
      });
      mt("[isDirectoryDot] Initial tree loaded:", o.tree);
      let s = o.tree;
      for (let l = 0; l < i.length; l++) {
        const f = i[l];
        mt(`[isDirectoryDot] Checking part "${f}" in current tree...`);
        const u = s.find((m) => m.path === f);
        if (!u)
          return mt(`[isDirectoryDot] Part "${f}" not found in current tree.`), {
            exists: !1,
            isDirectory: !1,
            hasChildren: !1
          };
        if (u.type === "tree") {
          if (mt(`[isDirectoryDot] Part "${f}" is a directory.`), l === i.length - 1) {
            const g = await re.readTree({ fs: t, dir: e, oid: u.oid });
            return mt("[isDirectoryDot] Subtree loaded:", g.tree), {
              exists: !0,
              isDirectory: !0,
              hasChildren: g.tree.length > 0
            };
          }
          s = (await re.readTree({ fs: t, dir: e, oid: u.oid })).tree;
        } else return l === i.length - 1 ? (mt(`[isDirectoryDot] Part "${f}" is a file.`), {
          exists: !0,
          isDirectory: !1,
          hasChildren: !1
        }) : (mt(`[isDirectoryDot] Part "${f}" is not a directory.`), {
          exists: !1,
          isDirectory: !1,
          hasChildren: !1
        });
      }
      return mt("[isDirectoryDot] Path does not exist."), {
        exists: !1,
        isDirectory: !1,
        hasChildren: !1
      };
    } catch (i) {
      return ad("[isDirectoryDot] Error checking directory:", i), {
        exists: !1,
        isDirectory: !1,
        hasChildren: !1
      };
    }
  },
  async listFilesDot(t, e, r = !0) {
    try {
      let i;
      try {
        i = await at.resolveRef(t, e);
      } catch {
        return pe.consoleDotLog("No commit found, returning empty list."), [];
      }
      const n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), o = async (f, u = "") => {
        if (a.has(f)) return;
        a.add(f), pe.consoleDotLog("Traversing tree:", f, "Path:", u);
        const { tree: m } = await re.readTree({ fs: t, dir: e, oid: f });
        await Promise.all(m.map(async (g) => {
          const y = u ? `${u}/${g.path}` : g.path;
          if (n.has(y) || n.set(y, {
            path: y,
            type: g.type,
            oid: g.oid,
            commitOid: i
          }), g.type === "tree")
            return o(g.oid, y);
        }));
      }, { commit: s } = await at.readCommit(t, e, i);
      await o(s.tree);
      let l = Array.from(n.values());
      return r || (l = l.filter((f) => f.type !== "tree")), pe.consoleDotLog("Total entries:", l.length, "Entries:", l), l;
    } catch (i) {
      throw pe.consoleDotLog("Error in listFilesDot:", i), i;
    }
  },
  async mkdirDot(t, e, r, i = "sample", n = "sample@email.com", a = 1) {
    try {
      pe.consoleDotLog(`Creating directories for path: ${r}`), r = r.replace(/^\/+|\/+$/g, "");
      const o = r.split("/"), s = await this.isDirectoryDot(t, e, r);
      if (s.exists) {
        if (!s.isDirectory)
          throw new Error(`Path ${r} exists and is a file - cannot create as directory`);
        return {
          dirPath: r,
          existing: !0,
          treeOid: s.treeOid,
          commitOid: null,
          action: "none"
        };
      }
      let l = await at.resolveRef(t, e).catch(() => null), f = l ? (await at.readCommit(t, e, l)).commit.tree : null, u = f ? (await re.readTree({ fs: t, dir: e, oid: f })).tree : [], m = [], g = f, y = u, E = 0;
      for (const T of o) {
        let I = y.find((R) => R.path === T && R.type === "tree");
        if (!I) {
          const R = await re.writeTree({ fs: t, dir: e, tree: [] });
          I = { path: T, mode: "040000", oid: R, type: "tree" }, y.push(I), E++;
        }
        m.push({ tree: y, subtree: I }), g = I.oid, y = (await re.readTree({ fs: t, dir: e, oid: g })).tree;
      }
      for (let T = m.length - 1; T >= 0; T--) {
        const { tree: I, subtree: R } = m[T];
        I.find((D) => D.path === R.path).oid = g, g = await re.writeTree({ fs: t, dir: e, tree: I });
      }
      let A = null;
      return a ? (A = await re.commit({
        fs: t,
        dir: e,
        author: { name: i, email: n },
        message: `Created directory: ${r}`,
        tree: g,
        parent: l ? [l] : []
      }), pe.consoleDotLog(`New commit OID for directory creation: ${A}`)) : (wr.set(r, {
        type: "writeDir",
        treeOid: g,
        filePath: r,
        action: "staged"
      }), pe.consoleDotLog(`Staged write for ${r} with treeOid ${g}`)), {
        dirPath: r,
        treeOid: g,
        commitOid: A,
        createdTrees: E,
        action: a ? "committed" : "staged"
      };
    } catch (o) {
      throw pe.consoleDotLog("Error in mkdirdot:", o), o;
    }
  },
  async removeFileDot(t, e, r, i = 1) {
    try {
      pe.consoleDotLog(`[removeFileDot] Starting removal for: ${r}, staged files: `, wr), r = r.replace(/^\/+|\/+$/g, "");
      const n = r.split("/"), a = n.pop(), o = await at.resolveRef(t, e), { commit: s } = await at.readCommit(t, e, o), { tree: l } = await re.readTree({
        fs: t,
        dir: e,
        oid: s.tree
      });
      let f = null, u = null;
      const g = l.filter((E) => E.type === "tree").find((E) => E.path === "");
      if (g) {
        const { tree: E } = await re.readTree({
          fs: t,
          dir: e,
          oid: g.oid
        });
        if (f = E.find((A) => A.path === a), f) {
          pe.consoleDotLog(`[removeFileDot] Found ${a} in unnamed subtree`);
          const A = E.filter((R) => R.path !== a), T = await re.writeTree({
            fs: t,
            dir: e,
            tree: A
          }), I = l.map(
            (R) => R.path === "" && R.type === "tree" ? { ...R, oid: T } : R
          );
          u = await re.writeTree({
            fs: t,
            dir: e,
            tree: I
          });
        }
      }
      if (!f) {
        const E = async (A, T) => {
          const { tree: I } = await re.readTree({ fs: t, dir: e, oid: A });
          if (T.length === 0) {
            if (f = I.find((O) => O.path === a), !f)
              throw new Error(`File ${a} not found in tree`);
            const M = I.filter((O) => O.path !== a);
            return await re.writeTree({ fs: t, dir: e, tree: M });
          }
          const R = T[0], D = I.find((M) => M.path === R && M.type === "tree");
          if (!D) throw new Error(`Directory ${R} not found`);
          const L = await E(D.oid, T.slice(1)), U = I.map(
            (M) => M.path === R && M.type === "tree" ? { ...M, oid: L } : M
          );
          return await re.writeTree({ fs: t, dir: e, tree: U });
        };
        u = await E(s.tree, n);
      }
      if (!f)
        throw new Error(`File ${r} not found in repository`);
      let y = null;
      return i ? (y = await re.commit({
        fs: t,
        dir: e,
        author: { name: "System", email: "system@example.com" },
        message: `Removed file ${r}`,
        tree: u,
        parent: [o]
      }), pe.consoleDotLog(`[removeFileDot] Committed removal: ${y}`)) : (wr.set(r, {
        type: "remove",
        oid: f.oid,
        treeOid: u,
        filePath: r,
        action: "staged"
      }), pe.consoleDotLog(`Staged removal for ${r} with blobOid ${f.oid}`)), {
        filePath: r,
        treeOid: u,
        commitOid: y,
        action: i ? "committed" : "staged",
        blobOid: f.oid
      };
    } catch (n) {
      throw pe.consoleDotLog("[removeFileDot] ERROR:", n), n;
    }
  },
  async removeDirDot(t, e, r, i = 1) {
    try {
      r = r.replace(/^\/+|\/+$/g, "");
      const n = r.split("/"), a = n.pop(), o = await at.resolveRef(t, e), { commit: s } = await at.readCommit(t, e, o), l = async (g, y) => {
        const { tree: E } = await re.readTree({ fs: t, dir: e, oid: g });
        if (y.length === 0) {
          const A = E.find((R) => R.path === a && R.type === "tree");
          if (!A)
            throw new Error(`Directory ${a} not found`);
          const T = E.filter((R) => R.path !== a);
          return { newTreeOid: await re.writeTree({ fs: t, dir: e, tree: T }), removedTreeOid: A.oid };
        } else {
          const A = y[0], T = E.find((U) => U.path === A && U.type === "tree");
          if (!T)
            throw new Error(`Directory not found: ${A}`);
          const { newTreeOid: I, removedTreeOid: R } = await l(T.oid, y.slice(1)), D = E.map((U) => U.path === A && U.type === "tree" ? { ...U, oid: I } : U);
          return { newTreeOid: await re.writeTree({ fs: t, dir: e, tree: D }), removedTreeOid: R };
        }
      }, { newTreeOid: f, removedTreeOid: u } = await l(s.tree, n);
      let m = null;
      return i ? m = await re.commit({
        fs: t,
        dir: e,
        author: { name: "System", email: "system@example.com" },
        message: `Removed directory ${r}`,
        tree: f,
        parent: [o]
      }) : (wr.set(r, {
        type: "removeDir",
        treeOid: f,
        filePath: r,
        action: "staged"
      }), pe.consoleDotLog(`Staged removal for ${r} with newTreeOid ${f}`)), {
        dirPath: r,
        treeOid: f,
        commitOid: m,
        removedTreeOid: u,
        action: i ? "committed" : "staged"
      };
    } catch (n) {
      throw pe.consoleDotLog("Error in removeDirDot:", n), n;
    }
  }
};
self.onerror = (t) => {
  console.error("Worker initialization error:", t);
};
const od = new Ic(self), Ws = new yi(Hr.logging.dotGit), _i = new nd(), qs = new Us();
function ee(...t) {
  Ws.consoleDotLog(...t);
}
function ge(...t) {
  Ws.consoleDotError(...t);
}
ee("gitWorker loaded.");
let ce = "/", ht, dt, Ge = "main", et = "", We = "origin", Kt = 10, bi = "testUser", vi = "testUser@example.com", Gs = {}, oe = null, ea = "/settings", wa = {}, Ot = !0, yr, Ht, kt = Hr.corsProxy, Wt = !1;
const Ke = {
  async fill() {
    return ee("authenticate", ht, dt), { username: ht, password: dt };
  },
  async rejected() {
    const t = new Error("Authentication rejected");
    throw ee("Authentication rejected", t), t;
  }
};
async function lr(t) {
  Wt && Ot ? await qs.sendMessageToChannel(t) : ee("This browser doesn't support service worker");
}
self.setAuthParams = async function() {
  await lr({
    operation: "setAuthParams",
    data: { username: ht, password: dt }
  });
};
self.setDir = async function() {
  await lr({ operation: "setDir", data: ce });
};
self.setRef = async function() {
  await lr({ operation: "setRef", data: Ge });
};
self.setDepth = async function() {
  await lr({ operation: "setDepth", data: Kt });
};
self.setRemote = async function() {
  await lr({ operation: "setRemote", data: We });
};
self.passFsArgs = async function() {
  await lr({ operation: "passFsArgs", data: wa });
};
self.setRepoDir = async function() {
  await lr({ operation: "setRepoDir", data: ce });
};
self.setSettingsAddresses = async function() {
  await lr({ operation: "setSettingsAddresses", data: Gs });
};
async function Wr(t, e) {
  if (Wt && Ot)
    return await qs.fetchWithServiceWorker(t, e);
  ee("This browser doesn't support service worker");
}
async function sd(t, e = Ot) {
  Wt = t, Ot = e, _i.options = { supportsServiceWorker: Wt, useSW: Ot };
}
async function cd(t) {
  ce = t, await self.setDir();
}
function ld(t) {
  return /^https?:\/\/.+/.test(t);
}
async function vr(t) {
  if (ee("seturl url ", t), !ld(t))
    throw new Error("Invalid Git URL format.");
  et = t;
}
async function ta(t) {
  Ge = t, await self.setRef();
}
async function Zs(t) {
  Kt = t, await self.setDepth();
}
async function ud(t) {
  kt = t;
}
async function fd(t, e) {
  ht = t, dt = e, await self.setAuthParams();
}
async function Vs(t) {
  We = t, await self.setRemote();
}
async function hd() {
  return We;
}
async function dd() {
  try {
    const t = await Ks("library");
    ee("libs", t);
    const e = await gc();
    if (ee("directories", e), t && e)
      for (const [r, i] of Object.entries(t)) {
        if (!e[i])
          throw new Error(`File not found: ${i}`);
        return Gs[i] = {
          fileName: r,
          filePath: i
        }, console.log(`File mapped: ${i}`), await self.setSettingsAddresses(), { success: !0 };
      }
    else
      return { success: !1 };
  } catch (t) {
    console.error(`Error in setSettingsAddresses: ${t.message}`);
  }
}
async function wd(t, e) {
  return ee("entering getFileStoresFromDatabases object"), _i.getFileStoreNames(t, e);
}
async function Pi({ fsName: t, fsType: e }) {
  try {
    if (ee("Initializing FS with:", { _fsName: t, _fsType: e }), !t || !e)
      throw new Error("fsName and fsType are required");
    if (wa = { fsName: t, fsType: e }, Ht = t, yr = e, ee("Getting FS instance from FSManager"), oe = await _i.getFS(t, e), !oe)
      throw new Error("Failed to initialize file system");
    return ee("FS initialized successfully:", oe), await self.passFsArgs(), oe;
  } catch (r) {
    throw ge("Error initializing file system:", r), r;
  }
}
async function pd(t) {
  let e = await Jr();
  ee("current branch", e), ee("ref", Ge), ee("_ref", t);
  let r = await pa();
  if (ee("branchesList", r), r.includes(t) || await Xs({ ref: t }), Ge === t || e === t) {
    ee(`you are already on the branch ${t}`);
    return;
  } else {
    let i = await tw();
    if (Object.keys(i).length === 0) {
      await md({ ref: t, noCheckout: !1, noUpdateHead: !1 }), Ge = t, await Js({ url: et }), ee("done");
      return;
    } else
      return ee("failed"), 0;
  }
}
async function Xs(t) {
  return await re.branch({
    ...t,
    fs: oe,
    dir: ce
  });
}
async function md(t) {
  return await re.checkout({
    ...t,
    fs: oe,
    dir: ce,
    remote: We
  });
}
async function pa() {
  return await re.listBranches({
    fs: oe,
    dir: ce
  });
}
async function Ys() {
  try {
    return await re.listBranches({ fs: oe, dir: ce, remote: We });
  } catch (t) {
    ge("Error in listBranches:", t);
  }
}
async function Jr() {
  return await re.currentBranch({
    fs: oe,
    dir: ce,
    fullname: !1
  });
}
async function gd() {
  const t = await Jr();
  return await mc(`branch.${t}.remote`);
}
function yd(t) {
  const e = {};
  let r = null;
  return t.split(/\r?\n/).forEach((i) => {
    if (i = i.trim(), !(!i || i.startsWith(";") || i.startsWith("#")))
      if (i.startsWith("[") && i.endsWith("]"))
        r = i.slice(1, -1).trim(), e[r] = e[r] || {};
      else {
        const [n, a] = i.split("=").map((o) => o.trim());
        r && (e[r][n] = a);
      }
  }), e;
}
function _d(t) {
  let e = "";
  return Object.keys(t).forEach((r) => {
    e += `[${r}]
`, Object.entries(t[r]).forEach(([i, n]) => {
      e += `    ${i} = ${n}
`;
    }), e += `
`;
  }), e;
}
async function Ks(t = null, e = null) {
  try {
    if (!await oe.promises.lstat(ea).catch(() => null))
      return ge("Settings file does not exist yet."), {};
    if ((await oe.promises.readdir(`${ce}`)).includes("settings")) {
      const n = await re.readFile({ fs: oe, dir: ce, filePath: ea }), a = yd(n);
      return ee("settingsData,", a), t && e ? a[t] && a[t][e] ? a[t][e] : null : t ? a[t] ? a[t] : null : a;
    } else {
      ge("The settings file dosen't exist yet!");
      return;
    }
  } catch (r) {
    if (r.code === "ENOENT") return {};
    throw r;
  }
}
async function bd(t) {
  const e = _d(t);
  await ya({ filePath: ea, fileContents: e });
}
async function vd(t, e, r) {
  let i = {};
  try {
    i = await Ks(), ee(i), i || (i = {}, ee("No past data is available. New file will be created.")), i[t] || (i[t] = {}), i[t][e] = r, ee("settingsData", i), await bd(i), ee("done");
  } catch {
    ee("No past data is available.");
  }
}
async function Ed(t) {
  try {
    return await Zi(t), await ga(t), await ma(t);
  } catch (e) {
    ee("Something bad happened pushing your file: ", e);
  }
}
async function kd(t) {
  try {
    return await vc(), await ga(t), await ma(t);
  } catch (e) {
    ee("Something bad happened pushing your files: ", e);
  }
}
async function Js(t) {
  t?.attempt;
  const e = 1;
  ee("Doing fetch operation"), !et && await vr(t?.url);
  try {
    if (Wt && Ot)
      try {
        return await Wr("fetch", t), { success: !0 };
      } catch (r) {
        return ee("Service Worker fetch failed, falling back to Web Worker", r), await re.fetch({
          ...t,
          fs: oe,
          http: Bt,
          dir: ce,
          corsProxy: kt,
          ref: Ge,
          url: et,
          remote: We,
          depth: Kt,
          tags: !1,
          headers: At(ht, dt),
          onAuth() {
            return Ke.fill();
          },
          onAuthFailure() {
            return Ke.rejected();
          }
        }), { success: !0 };
      }
    else
      return ee("Service Worker not supported, using Web Worker directly"), await re.fetch({
        ...t,
        fs: oe,
        http: Bt,
        dir: ce,
        corsProxy: kt,
        ref: Ge,
        url: et,
        remote: We,
        depth: Kt,
        tags: !1,
        headers: At(ht, dt),
        onAuth() {
          return Ke.fill();
        },
        onAuthFailure() {
          return Ke.rejected();
        }
      }), { success: !0 };
  } catch (r) {
    return ge("some error happend while fetching: ", r), await qr(r, t, "doFetch", e), { success: !1 };
  }
}
async function Qs(t) {
  t?.attempt;
  const e = 1;
  !et && await vr(t?.url);
  try {
    await Gi(t);
    try {
      if (Wt && Ot)
        try {
          const r = await Wr("listServerRefs", { ...t, url: et });
          return ee("listServerRefs result with sw:", r), r;
        } catch (r) {
          ee("Service Worker listServerRefs failed, falling back to Web Worker", r);
          const i = await re.listServerRefs({
            ...t,
            fs: oe,
            url: et,
            http: Bt,
            dir: ce,
            corsProxy: kt,
            remote: We,
            headers: At(ht, dt),
            onAuth() {
              return Ke.fill();
            },
            onAuthFailure() {
              return Ke.rejected();
            }
          });
          return ee("listServerRefs result:", i), { success: !0, refs: i };
        }
      else {
        ee("Service Worker not supported, using Web Worker directly");
        const r = await re.listServerRefs({
          ...t,
          fs: oe,
          url: et,
          http: Bt,
          dir: ce,
          corsProxy: kt,
          remote: We,
          headers: At(ht, dt),
          onAuth() {
            return Ke.fill();
          },
          onAuthFailure() {
            return Ke.rejected();
          }
        });
        return ee("listServerRefs result:", r), { success: !0, refs: r };
      }
    } catch (r) {
      throw r;
    }
  } catch (r) {
    return ge("some error happened while listing server refs: ", r), await qr(r, t, "listServerRefs", e), { success: !1, error: r.message };
  }
}
const Sd = ({ contents: t, filepath: e }, r = "theirs") => {
  if (t[1] === t[2]) return { cleanMerge: !0, mergedText: t[1] };
  if (t[0] === t[2]) return { cleanMerge: !0, mergedText: t[1] };
  if (t[0] === t[1]) return { cleanMerge: !0, mergedText: t[2] };
  switch (r) {
    case "ours":
      return { cleanMerge: !0, mergedText: t[1] };
    case "theirs":
      return { cleanMerge: !0, mergedText: t[2] };
    case "combine":
      return {
        cleanMerge: !0,
        mergedText: `<<<<<<< ours
${t[1]}
=======
${t[2]}
>>>>>>> theirs
`
      };
    default:
      return { cleanMerge: !0, mergedText: t[2] };
  }
};
async function xd(t = "main", e = "origin/main", r = "theirs", {
  onConflict: i = null,
  author: n = { name: bi, email: vi }
} = {}) {
  try {
    ee("kire khar: ", t, e, r);
    const a = i || (({ contents: s, filepath: l }) => Sd({ contents: s, filepath: l }, r));
    return await re.merge({
      fs: oe,
      dir: ce,
      ours: t,
      theirs: e,
      mergeDriver: a,
      fastForwardOnly: !1
    });
  } catch (a) {
    if (a.message.includes("MergeConflictError")) {
      const s = (await re.statusMatrix({ fs: oe, dir: ce })).filter((l) => l[2] === 2).map((l) => l[0]);
      if (r === "combine")
        return console.log("Merge conflicts preserved. Resolve these files:"), console.log(s.join(`
`)), {
          status: "conflicted",
          conflictedFiles: s,
          message: "Resolve conflicts and commit",
          commit: async () => {
            for (const l of s)
              await re.add({ fs: oe, dir: ce, filepath: l });
            return re.commit({
              fs: oe,
              dir: ce,
              author: n,
              message: "Merge with conflicts resolved"
            });
          }
        };
      throw await re.mergeReset({ fs: oe, dir: ce }), a;
    }
    throw a;
  }
}
async function Id(t = {}) {
  try {
    ee("Received args in getCommitHistoryFromReplica:", t);
    const e = t?.depth || 10, r = Ht;
    ee("Initializing replica FS..."), await Pi({ fsName: `${r}_replica`, fsType: yr }), ee("Pulling from remote..."), await _c({ url: et, depth: e }), ee("Getting commit logs...");
    const i = await lc({ depth: e });
    ee("Replica commit logs:", i), ee("Restoring main FS..."), await Pi({ fsName: r, fsType: yr });
    const n = i.map((a) => a.oid);
    return ee("Returning commits:", n), {
      success: !0,
      commits: n,
      head: n[0] || null
    };
  } catch (e) {
    return ge("Error getting commit history from replica:", e), {
      success: !1,
      error: e.message,
      commits: []
    };
  }
}
async function ec(t) {
  ee("getLatestRemoteCommit args:", t);
  const e = t?.url || e, r = await Qs({ ...t, url: e });
  ee("getLatestRemoteCommit result:", r);
  const i = t?.ref || Ge || "HEAD";
  if (ee("getLatestRemoteCommit _ref:", i), !r.success)
    return ge("Failed to fetch server refs", r.error), { success: !1, error: r.error };
  const n = r.refs;
  let a = n.find((o) => o.ref === `refs/heads/${i}`)?.oid;
  return a || (a = n.find("refs/heads/main")?.oid), a ? (ee("headOid", a), {
    success: !0,
    commit: a
  }) : (ge("Could not determine latest remote commit."), { success: !1, error: `No HEAD or ${Ge} main/master ref found` });
}
async function tc(t = et) {
  try {
    const e = await rc(), r = t || r || await pc() || "", i = await ec({ url: r });
    if (!i.success)
      return ge("Failed to get latest remote commit:", i.error), !0;
    const n = i.commit;
    return n === e ? (ee("lastRemoteCommit", n, "localRef", e), !0) : (ee("lastRemoteCommit", n, "localRef", e), !1);
  } catch (e) {
    return ee(
      "Some error happened while checking whether you are in sync or not:",
      e
    ), !1;
  }
}
async function Rd() {
  try {
    return (await re.resolveRef({ fs: oe, dir: ce, ref: `/refs/remotes/${We}/${Ge}` }))?.trim();
  } catch (t) {
    ee(
      "some error happend while getting last remote commit: ",
      t
    );
  }
}
async function rc(t) {
  try {
    const e = t || Ge || "HEAD";
    return ee("branch", e), (await re.resolveRef({ fs: oe, dir: ce, ref: `refs/heads/${e}` }))?.trim();
  } catch (e) {
    ee(
      "some error happend while getting last local commit: ",
      e
    );
  }
}
async function ic(t = et, e = We) {
  try {
    return await Vs(e), await re.addRemote({
      url: t,
      force: !0,
      fs: oe,
      dir: ce,
      remote: e
    });
  } catch (r) {
    ee("some error happend while adding remote: ", r);
  }
}
async function Td(t = We) {
  try {
    return await re.deleteRemote({
      fs: oe,
      dir: ce,
      remote: t
    });
  } catch (e) {
    ee("some error happend while adding remote: ", e);
  }
}
async function nc() {
  return await re.listRemotes({
    fs: oe,
    dir: ce
  });
}
async function $d(t) {
  try {
    const e = et || t?.url, r = We || t?.remote;
    ee("handleNoRef args: ", t, e, r, et, We), await ic(e, r);
    let i = await Ys() || [];
    if (ee(i), i.length == 0)
      return !1;
  } catch (e) {
    throw ge("Error handling no ref:", e), e;
  }
}
async function Bd() {
  try {
    await re.init({
      fs: oe,
      dir: ce
    });
  } catch (t) {
    ee("something went wrong while initing the repo: ", t);
  }
}
async function Ad() {
  try {
    const t = await oe.promises.readdir(ce), e = await nc();
    let r = [];
    return e.forEach((i) => r.push(i.url)), ee("urls:", r, e, t), !(r.length > 0 && !r.includes(et) || t.length === 0 || r.length === 0);
  } catch (t) {
    if (t.code === "ENOENT")
      return ee("Directory does not exist:", ce), !1;
    throw ge("Error checking directory existence:", t), t;
  }
}
async function Dd(t) {
  try {
    return await re.findMergeBase({
      fs: oe,
      dir: ce,
      oids: t
    });
  } catch (e) {
    ge("Error finding merge base:", e);
  }
}
async function ac() {
  try {
    ee("🔄 Handling merge conflict in git-only storage...");
    const e = (await re.statusMatrix({ fs: oe, dir: ce })).filter((r) => r[3] === 3).map((r) => r[0]);
    if (e.length === 0)
      return ee("✅ No conflicted files found in git index"), { success: !0, resolved: !1 };
    ee(`⚠️ Found ${e.length} conflicted files in git:`, e);
    for (const r of e)
      try {
        ee(`🔧 Resolving ${r} in git index...`);
        const i = await re.readBlob({
          fs: oe,
          dir: ce,
          oid: await re.resolveRef({ fs: oe, dir: ce, ref: "HEAD" }),
          filepath: r
        }).catch(() => null), n = await re.readBlob({
          fs: oe,
          dir: ce,
          oid: await re.resolveRef({ fs: oe, dir: ce, ref: `refs/remotes/${We}/${Ge}` }),
          filepath: r
        }).catch(() => null), a = i?.blob || n?.blob || "";
        await re.add({
          fs: oe,
          dir: ce,
          filepath: r,
          // Force add even if file doesn't exist in working directory
          force: !0
        }), ee(`✅ Resolved ${r} in git index`);
      } catch (i) {
        ge(`❌ Failed to resolve ${r} in git index:`, i);
      }
    return ee("✅ All conflicts resolved in git index"), { success: !0, resolved: !0, conflictedFiles: e };
  } catch (t) {
    return ge("❌ Failed to resolve git-only merge conflicts:", t), { success: !1, error: t.message };
  }
}
async function qr(t, e, r, i = 1, n = 0) {
  ge(`Some error happened while ${r}: `, t);
  const a = t && (t.toString().includes("401") || t.toString().includes("403")), o = t && (t.toString().toLowerCase().includes("network") || t.toString().toLowerCase().includes("fetch")), s = t instanceof re.Errors.MergeConflictError || t.toString().includes("MergeConflictError") || t.toString().includes("CheckoutConflictError") || t.toString().includes("merge conflicts");
  if (t && (t.toString().includes("NotFoundError") || t.toString().toLowerCase().includes("could not find head")), a || o)
    throw ee("Authentication or network error detected. Not deleting the repository."), t;
  if (s) {
    ee("Merge conflict detected. Attempting to resolve...");
    try {
      if ((await ac()).success) {
        ee("Merge conflicts resolved successfully");
        return;
      } else
        throw ee("Merge conflict resolution failed"), t;
    } catch (f) {
      throw ge("Error during merge conflict resolution:", f), f;
    }
  }
  const l = e.attempt || 0;
  if (l < i)
    if (n) {
      const f = await tc();
      !f && await Od({ ...e, attempt: l + 1 }), f && await ra({ ...e, attempt: l + 1 });
    } else
      await ra({ ...e, attempt: l + 1 });
  else
    throw new Error(`${r} wasn't successful: ${t}`);
}
async function Od(t) {
  const e = t?.attempt + 1 || 1;
  ee(`Attempting hard reset for ${Ht}. Attempt: ${e}`);
  try {
    return await uc({ dir: ce, ref: "HEAD~1", branch: Ge }), ee(`Hard reset to HEAD~1 successful for ${Ht}`), e;
  } catch (r) {
    throw ge(`Error during hard reset for ${Ht}: `, r), r;
  }
}
async function ra(t) {
  const e = t?.attempt + 1 || 1, r = t?.reclone || !1, i = t?.fsName || Ht, n = t?.fsType || yr;
  try {
    await _i.deleteFS(i, n), r && await oc({ ...t, url: t.url, attempt: e });
    return;
  } catch (a) {
    ge(`Error during delete, close, and reclone process for ${Ht}: `, a);
  }
}
async function oc(t) {
  ee("doCloneAndStuff args: ", t);
  let e = !1;
  t?.attempt;
  const r = 1;
  !et && await vr(t?.url), await Zs(Kt);
  try {
    let i = !0, n = await Ad();
    if (ee("dirExists", n), n && !e) {
      ee("Directory already exists. Using existing directory...");
      let a = await Jr();
      return await ta(a), { handleNoRefResult: i, message: "exists", success: !0 };
    } else {
      ee("Cloning repository ...");
      const a = await Fd(t);
      await _i.createBackupFS(Ht, yr), ee("createBackupFS created backup"), await Pi({ fsName: Ht, fsType: yr });
      let o = await Jr();
      await ta(o), ee(a, o), a?.data && a?.data?.isCacheUsed && await bc({
        url: t.url
      }), i = await $d(t), await Cd();
    }
    return { handleNoRefResult: i, message: "notExist", success: !0 };
  } catch (i) {
    return await qr(i, t, "doCloneAndStuff", r), { handleNoRefResult: !1, message: "error", success: !1 };
  }
}
async function ia(t) {
  return (await oe.promises.lstat(t)).isDirectory();
}
async function sc(t) {
  try {
    if (!await ia(t))
      await Co(t);
    else {
      const e = await oe.promises.readdir(t);
      for (const r of e) {
        const i = `${t}/${r}`;
        await ia(i) ? (await sc(i), await oe.promises.rmdir(i)) : await Co(i), await oe.promises.rmdir(t);
      }
    }
  } catch (e) {
    if (e.code === "ENOENT") {
      ee(`File ${t} already deleted, skipping...`);
      return;
    }
    ge("Error while removing directory contents:", e);
  }
}
async function Cd() {
  try {
    let t = await Ys(), e = await pa();
    ee("remoteBranches", t), ee("localBranches", e), e.push("HEAD");
    const r = t.filter((n) => !e.includes(n));
    ee("filteredBranches", r);
    let i = ce === "/" ? "" : ce;
    await Promise.all(
      r.map(async (n) => {
        await Xs({
          ref: n,
          object: i + `/.git/refs/remotes/${We}/${n}`
        }), await ya({
          filePath: i + `/.git/refs/heads/${n}`,
          fileContents: await re.readFile({ fs: oe, dir: ce, filePath: i + `/.git/refs/remotes/${We}/${n}` })
        });
      })
    );
  } catch (t) {
    throw ge("Error initializing local branches:", t), t;
  }
}
function At(t, e) {
  return !t && !e ? (ee("No username or password provided. Returning empty headers."), {}) : {
    authorization: `Basic ${btoa(`${t}:${e}`)}`
  };
}
async function Fd(t) {
  try {
    let e;
    if (Wt && Ot)
      try {
        e = await Wr("clone", t);
      } catch (r) {
        ee("Service Worker clone failed, falling back to Web Worker", r), e = await re.clone({
          ...t,
          fs: oe,
          http: Bt,
          dir: ce,
          remote: We,
          ref: Ge,
          corsProxy: kt,
          depth: Kt,
          noCheckout: !0,
          headers: At(ht, dt),
          onAuth() {
            return Ke.fill();
          },
          onAuthFailure() {
            return Ke.rejected();
          }
        });
      }
    else
      ee("Service Worker not supported, using Web Worker directly"), e = await re.clone({
        ...t,
        fs: oe,
        http: Bt,
        dir: ce,
        remote: We,
        ref: Ge,
        corsProxy: kt,
        depth: Kt,
        noCheckout: !0,
        headers: At(ht, dt),
        onAuth() {
          return Ke.fill();
        },
        onAuthFailure() {
          return Ke.rejected();
        }
      });
    return e;
  } catch (e) {
    throw ge("Some error happened while cloning:", e), e;
  }
}
async function cc(t) {
  let e = t.split("/").filter((i) => i.trim() !== ""), r = ce.split("/").filter((i) => i.trim() !== "").join("").length;
  return e = e.join("/"), e = ce === "/" ? e : e.slice(r + 1), e;
}
async function Nd(t) {
  try {
    let e = await cc(t.filePath);
    await re.remove({
      fs: oe,
      dir: ce,
      filepath: e
    }), await sc(t.filePath);
  } catch (e) {
    ge("Error while removing the file:", e);
  }
}
async function Co(t) {
  try {
    await oe.promises.unlink(t);
  } catch (e) {
    ge("Error occured while unlinking:", e);
  }
}
async function Md(t, e) {
  try {
    if (t === e)
      return;
    await yc(e), await oe.promises.rename(t, e);
  } catch (r) {
    ge("Error occured while renaming filePath:", r);
  }
}
async function lc(t = {}) {
  try {
    ee("Attempting to retrieve log with the following args:", { ...t, fs: oe, depth: Kt, dir: ce, ref: Ge });
    const e = await re.log({ ...t, fs: oe, depth: Kt, dir: ce, ref: Ge });
    return ee("git.log result:", e), e;
  } catch (e) {
    throw ge("Error in log:", e), e && typeof e == "object" && Object.keys(e).length > 0 ? (ge("Error properties:", Object.keys(e)), ge("Full error object:", JSON.stringify(e, null, 2))) : ge("An unknown error occurred, and no additional error details are available."), new Error("An unknown error occurred during the log operation");
  }
}
async function ma(t) {
  ee("Starting to push with these args: ", t), t?.attempt;
  const e = 1, r = t?.force || !0;
  !et && await vr(t?.url);
  try {
    await Gi(t);
    try {
      if (Wt && Ot)
        try {
          return await Wr("push", t), { success: !0 };
        } catch (i) {
          return ee("Service Worker push failed, falling back to Web Worker", i), await re.push({
            ...t,
            fs: oe,
            http: Bt,
            dir: ce,
            corsProxy: kt,
            remote: We,
            ref: Ge,
            force: r,
            headers: At(ht, dt),
            onAuth() {
              return Ke.fill();
            },
            onAuthFailure() {
              return Ke.rejected();
            }
          }), { success: !0 };
        }
      else
        return ee("Service Worker not supported, using Web Worker directly"), await re.push({
          ...t,
          fs: oe,
          http: Bt,
          dir: ce,
          corsProxy: kt,
          remote: We,
          ref: Ge,
          force: !0,
          headers: At(ht, dt),
          onAuth() {
            return Ke.fill();
          },
          onAuthFailure() {
            return Ke.rejected();
          }
        }), ee("Pushing was successful."), { success: !0 };
    } catch (i) {
      throw i;
    }
  } catch (i) {
    return ge("some error happend while pushing: ", i), await qr(i, t, "push", e), { success: !1 };
  }
}
async function Ud(t = "push") {
  try {
    await dc() && await wc() || (await fc({ username: bi }), await hc({ email: vi })), await re.stash({
      fs: oe,
      dir: ce,
      op: t
    });
  } catch (e) {
    ge("An error occurred while stashing:", e);
  }
}
async function Pd(t) {
  return await re.status({
    fs: oe,
    dir: ce,
    filepath: t?.filePath
  });
}
async function Ld(t, e = Ge = "HEAD") {
  oe.writeFile(ce + `/.git/refs/heads/${e}`, t, (r) => {
    if (r) throw r;
    console.log("git reset has successfully done.");
  });
}
async function uc({ dir: t, ref: e, branch: r }) {
  var i = /^HEAD~([0-9]+)$/, n = e.match(i);
  if (n) {
    var a = +n[1], o = await re.log({ fs: oe, dir: t, depth: a + 1 }), s = o.pop().oid;
    return new Promise((l, f) => {
      oe.writeFile(t + `/.git/refs/heads/${r}`, s, (u) => {
        if (u)
          return f(u);
        oe.unlink(t + "/.git/index", (m) => {
          if (m)
            return f(m);
          re.checkout({ fs: oe, dir: t, ref: r, force: !0 }).then(l);
        });
      });
    });
  }
  return Promise.reject(`Wrong ref ${e}`);
}
async function fc(t) {
  try {
    const e = t?.name ? t?.name : "sampleUser";
    bi = e, await re.setConfig({
      fs: oe,
      dir: ce,
      path: "user.name",
      value: e
    });
  } catch (e) {
    ge("An error occurred while setting user name:", e);
  }
}
async function hc(t) {
  try {
    const e = t?.email ? t?.email : "sampleUser";
    vi = e, await re.setConfig({
      fs: oe,
      dir: ce,
      path: "user.email",
      value: e
    });
  } catch (e) {
    ge("An error occurred while setting email:", e);
  }
}
async function dc() {
  try {
    const t = await re.getConfig({
      fs: oe,
      dir: ce,
      path: "user.email"
    });
    return ee(t), t;
  } catch (t) {
    ge("An error occurred while getting email:", t);
  }
}
async function wc() {
  try {
    const t = await re.getConfig({
      fs: oe,
      dir: ce,
      path: "user.name"
    });
    return ee(t), t;
  } catch (t) {
    ge("An error occurred while getting username:", t);
  }
}
async function pc(t = We) {
  try {
    return await re.getConfig({
      fs: oe,
      dir: ce,
      path: `remote.${t}.url`
    });
  } catch (e) {
    ge("An error occurred while getting remote url:", e);
  }
}
async function jd(t = et, e = We) {
  try {
    await re.setConfig({
      fs: oe,
      dir: ce,
      path: `remote.${e}.url`,
      value: t
    });
  } catch (r) {
    ge("An error occurred while setting remote url:", r);
  }
}
async function mc(t) {
  try {
    const e = await re.getConfig({
      fs: oe,
      dir: ce,
      path: t
    });
    return ee(e), e;
  } catch (e) {
    ge("An error occurred while getting config:", e);
  }
}
async function zd(t, e) {
  try {
    await re.setConfig({
      fs: oe,
      dir: ce,
      path: t,
      value: e
    });
  } catch (r) {
    ge("An error occurred while setting config:", r);
  }
}
async function Gi(t) {
  try {
    await fc(t), await hc(t);
  } catch (e) {
    ge("An error occurred while setting configs:", e);
  }
}
async function Hd(t = "HEAD") {
  return await re.resolveRef({
    fs: oe,
    dir: ce,
    ref: t
  });
}
async function Wd(t) {
  return await re.readCommit({
    fs: oe,
    dir: ce,
    oid: t
  });
}
async function qd(t) {
  await re.writeCommit({
    fs: oe,
    dir: ce,
    commit: t
  });
}
async function Gd(t) {
  await re.writeRef({
    fs: oe,
    dir: ce,
    ref: "refs/heads/main",
    value: t
  });
}
async function Zd(t = "") {
  await qt.commitStagedChanges(oe, ce);
}
async function Vd(t, e = "staged") {
  try {
    ee(`[GITWorker] Reading file: ${t}`), ee("Current FS state:", { fs: oe, fsName: Ht, fsType: yr, fsArgs: wa });
    const r = await oe.promises.readdir("/");
    ee("Root directory contents:", r);
    const i = await qt.readFileDot(oe, ce, t, e);
    return ee(`[GITWorker] Successfully read file: ${t}`), i;
  } catch (r) {
    throw ge(`[GITWorker] Failed to read file ${t}:`, r), new Error(`Failed to read file: ${r.message}`);
  }
}
async function Xd(t, e, r = 1) {
  try {
    ee(`[GITWorker] Writing to file: ${t}`);
    const i = await qt.writeFileDot(
      oe,
      ce,
      t,
      e,
      bi,
      vi,
      r
    );
    return ee(`[GITWorker] Successfully wrote to file: ${t}`), i;
  } catch (i) {
    throw ge(`[GITWorker] Failed to write to file ${t}:`, i), new Error(`Failed to write file: ${i.message}`);
  }
}
async function Fo(t, e = "staged") {
  try {
    ee(`[GITWorker] Reading directory: ${t}`);
    const r = await qt.readDirDot(oe, ce, t, e);
    return ee(`[GITWorker] Directory contents for ${t}:`, r), r;
  } catch (r) {
    throw ge(`[GITWorker] Failed to read directory ${t}:`, r), new Error(`Failed to read directory: ${r.message}`);
  }
}
async function No(t) {
  try {
    ee(`[GITWorker] Checking if path is directory: ${t}`);
    const e = await qt.isDirectoryDot(oe, ce, t);
    return ee(`[GITWorker] Path ${t} is directory:`, e), e;
  } catch (e) {
    throw ge(`[GITWorker] Failed to check directory status for ${t}:`, e), new Error(`Failed to check directory: ${e.message}`);
  }
}
async function gc(t = 1) {
  try {
    ee("[GITWorker] Listing all files");
    const e = await qt.listFilesDot(oe, ce, t);
    return ee("[GITWorker] File list:", e), e;
  } catch (e) {
    throw ge("[GITWorker] Failed to list files:", e), new Error(`Failed to list files: ${e.message}`);
  }
}
async function yc(t, e = 1) {
  try {
    ee(`[GITWorker] Creating directory: ${t}`);
    const r = await qt.mkdirDot(oe, ce, t, bi, vi, e);
    return ee(`[GITWorker] Successfully created directory: ${t}`), r;
  } catch (r) {
    throw ge(`[GITWorker] Failed to create directory ${t}:`, r), new Error(`Failed to create directory: ${r.message}`);
  }
}
async function Yd(t, e = 1) {
  try {
    ee(`[GITWorker] Removing directory: ${t}`);
    const r = await qt.removeDirDot(oe, ce, t, e);
    return ee(`[GITWorker] Successfully removed directory: ${t}`), r;
  } catch (r) {
    throw ge(`[GITWorker] Failed to remove directory ${t}:`, r), new Error(`Failed to remove directory: ${r.message}`);
  }
}
async function Kd(t, e = 1) {
  try {
    ee(`[GITWorker] Removing file: ${t}`);
    const r = await qt.removeFileDot(oe, ce, t, e);
    return ee(`[GITWorker] Successfully removed file: ${t}`), r;
  } catch (r) {
    throw ge(`[GITWorker] Failed to remove file ${t}:`, r), new Error(`Failed to remove file: ${r.message}`);
  }
}
async function Jd(t) {
  try {
    ee(`[GITWorker] Searching git history for: ${t}`);
    const e = await qt.findInGitHistory(oe, ce, t);
    return ee(`[GITWorker] Found git history for ${t}:`, e), e;
  } catch (e) {
    throw ge(`[GITWorker] Failed to search git history for ${t}:`, e), new Error(`Failed to search git history: ${e.message}`);
  }
}
async function _c(t) {
  t?.attempt;
  const e = 1;
  !et && await vr(t?.url);
  try {
    await Gi(t);
    try {
      if (Wt && Ot)
        try {
          return await Wr("pull", t), { success: !0 };
        } catch (r) {
          return ee("Service Worker pull failed, falling back to Web Worker", r), await re.pull({
            ...t,
            fs: oe,
            http: Bt,
            dir: ce,
            corsProxy: kt,
            remote: We,
            url: et,
            remoteRef: Ge,
            fastForward: !0,
            fastForwardOnly: !1,
            forced: !0,
            noCheckout: !0,
            // Ensure this is true to prevent file checkout
            singleBranch: !0,
            // Consider adding this to match clone behavior
            headers: At(ht, dt),
            onAuth() {
              return Ke.fill();
            },
            onAuthFailure() {
              return Ke.rejected();
            }
          }), { success: !0 };
        }
      else
        return ee("Service Worker not supported, using Web Worker directly"), await re.pull({
          ...t,
          fs: oe,
          http: Bt,
          dir: ce,
          corsProxy: kt,
          remote: We,
          remoteRef: Ge,
          fastForward: !0,
          fastForwardOnly: !1,
          forced: !0,
          noCheckout: !0,
          // Ensure this is true to prevent file checkout
          singleBranch: !0,
          // Consider adding this to match clone behavior
          headers: At(ht, dt),
          onAuth() {
            return Ke.fill();
          },
          onAuthFailure() {
            return Ke.rejected();
          }
        }), { success: !0 };
    } catch (r) {
      throw r;
    }
  } catch (r) {
    return ge("some error happend while pulling: ", r), await qr(r, t, "pull", e), { success: !1 };
  }
}
async function bc(t) {
  t?.attempt;
  const e = 1;
  try {
    if (!et && await vr(t?.url), Wt && Ot)
      try {
        return await Wr("fastForward", t), { success: !0 };
      } catch (r) {
        return ee("Service Worker fastForward failed, falling back to Web Worker", r), await re.fastForward({
          ...t,
          fs: oe,
          http: Bt,
          dir: ce,
          remote: We,
          corsProxy: kt,
          ref: Ge,
          remoteref: Ge,
          forced: !0,
          headers: At(ht, dt),
          onAuth() {
            return Ke.fill();
          },
          onAuthFailure() {
            return Ke.rejected();
          }
        }), { success: !0 };
      }
    else
      return ee("Service Worker not supported, using Web Worker directly"), await re.fastForward({
        ...t,
        fs: oe,
        http: Bt,
        dir: ce,
        remote: We,
        corsProxy: kt,
        ref: Ge,
        remoteref: Ge,
        forced: !0,
        headers: At(ht, dt),
        onAuth() {
          return Ke.fill();
        },
        onAuthFailure() {
          return Ke.rejected();
        }
      }), { success: !0 };
  } catch (r) {
    return ee("This error occured while fast-forwarding: ", r), await qr(r, t, "fastForward", e), { success: !1 };
  }
}
async function Zi(t) {
  try {
    ee("addFile log", t);
    let e = await cc(t.filePath);
    await re.add({
      fs: oe,
      dir: ce,
      filepath: e
    });
  } catch (e) {
    ge("An error occurred while adding the file(s):", e);
  }
}
async function vc() {
  try {
    const t = await Ec();
    ee("changedFiles", t);
    for (let e in t)
      t[e].includes("deleted") ? await Nd({ filePath: e }) : await Zi({ filePath: e });
  } catch (t) {
    ge("Error adding all changed files:", t);
  }
}
async function Qd(t) {
  try {
    await ya(t), await Zi(t);
  } catch (e) {
    ge("Error adding file to staging area:", e);
  }
}
async function ga(t) {
  try {
    await re.commit({
      fs: oe,
      dir: ce,
      author: {
        name: t.username,
        email: t.email
      },
      message: t.commitMessage || "Commit by dnegar"
    });
  } catch (e) {
    ee("This error occured while commiting: ", e);
  }
}
async function ew(t) {
  try {
    return await oe.promises.readdir(t);
  } catch (e) {
    throw ge("Error reading directory:", e), e;
  }
}
async function ya(t) {
  try {
    await oe.promises.writeFile(t.filePath, t.fileContents, "utf8");
  } catch (e) {
    ge("an error happend while writing to file:", e);
  }
}
async function Ec() {
  let i = await re.statusMatrix({ fs: oe, dir: ce });
  return i = i.filter((n) => n[1] !== n[2] || n[1] !== n[3]), await kc(i);
}
async function tw() {
  let i = await re.statusMatrix({ fs: oe, dir: ce });
  return i = i.filter((n) => n[2] !== n[3] || n[1] !== n[3]), await kc(i);
}
async function kc(t) {
  const r = {
    "003": "added, staged, deleted unstaged",
    "020": "new, untracked",
    "022": "added, staged",
    "023": "added, staged, with unstaged changes",
    100: "deleted, staged",
    101: "deleted, unstaged",
    103: "modified, staged, deleted unstaged",
    111: "unmodified",
    121: "modified, unstaged",
    122: "modified, staged",
    123: "modified, staged, with unstaged changes"
  };
  try {
    const i = {};
    return t.forEach((n) => {
      const a = n[0], o = r[n.slice(1).join("")];
      ce !== "/" ? i[ce + "/" + a] = o : i[ce + a] = o;
    }), ee(i), i;
  } catch (i) {
    ge("Error getting changed files list:", i);
  }
}
function rw(t) {
  return {
    message: t.message,
    stack: t.stack,
    name: t.name,
    code: t.code
  };
}
function Vr(t) {
  if (!(t === void 0 || typeof t == "function")) {
    if (t instanceof Error)
      return rw(t);
    if (Array.isArray(t))
      return t.map(Vr);
    if (t && typeof t == "object") {
      const e = {};
      for (const r in t)
        e[r] = Vr(t[r]);
      return e;
    }
    return t;
  }
}
const Mo = {
  setFs: Pi,
  doCloneAndStuff: oc,
  doFetch: ({ args: t }) => Js(t),
  doPushFile: Ed,
  doPushAll: kd,
  addFile: ({ filePath: t }) => Zi({ filePath: t }),
  commit: ({ username: t, email: e, commitMessage: r }) => ga({ username: t, email: e, commitMessage: r }),
  push: ({ url: t, remote: e, ref: r, force: i = !0 }) => ma({ url: t, remote: e, ref: r, force: i }),
  pull: ({ url: t, remote: e, ref: r }) => _c({ url: t, remote: e, ref: r }),
  addDot: vc,
  merge: ({ ours: t, theirs: e, strategy: r }) => xd(t, e, r),
  addFileToStaging: Qd,
  commitStagedChanges: Zd,
  status: Pd,
  log: lc,
  listRemotes: nc,
  listBranches: pa,
  checkoutBranch: ({ ref: t }) => pd(t),
  currentBranch: Jr,
  currentRemote: gd,
  setRemote: ({ remote: t }) => Vs(t),
  setRemoteUrl: ({ url: t, remote: e }) => jd(t, e),
  getRemoteUrl: ({ remote: t }) => pc(t),
  getRemote: ({ remote: t }) => hd(),
  getRemoteCommitInLocalRepo: ({ remote: t }) => Rd(),
  getChangedFilesList: Ec,
  getCommitHistoryFromReplica: Id,
  getLatestRemoteCommit: ({ url: t, remote: e }) => ec({ url: t, remote: e }),
  getLastLocalCommit: ({ ref: t }) => rc(t),
  handleDeleteCloseAndReclone: ({ args: t }) => ra(t),
  isSync: ({ url: t }) => tc(t),
  hardReset: uc,
  softReset: ({ commitHash: t, branch: e }) => Ld(t, e),
  addRemote: ({ url: t, remote: e }) => ic(t, e),
  deleteRemote: ({ remote: t }) => Td(t),
  findMergeBase: ({ oids: t }) => Dd(t),
  findInGitHistory: Jd,
  resolveMergeConflict: ac,
  fastForward: bc,
  setConfigs: Gi,
  setUrl: ({ url: t }) => vr(t),
  setCorsProxy: ({ corsProxy: t }) => ud(t),
  setSWUsage: ({ useSW: t }) => sd(t),
  setDir: ({ dir: t }) => cd(t),
  setDepth: ({ depth: t }) => Zs(t),
  setRef: ({ ref: t }) => ta(t),
  setAuthParams: ({ username: t, password: e }) => fd(t, e),
  setSettingsAddresses: dd,
  addToSetting: vd,
  stash: ({ operation: t }) => Ud(t),
  readFileDot: ({ filePath: t, commitOid: e = "staged" }) => Vd(t, e),
  writeFileDot: ({ filePath: t, fileContent: e, doCommit: r = 1 }) => Xd(t, e, r),
  readDirDot: ({ path: t, commitOid: e = "staged" }) => Fo(t, e),
  isDirectoryDot: ({ path: t }) => No(t),
  listFilesDot: ({ listDirs: t = 1 }) => gc(t),
  mkdirDot: ({ dirPath: t, doCommit: e = 1 }) => yc(t, e),
  removeDirDot: ({ dirPath: t, doCommit: e = 1 }) => Yd(t, e),
  removeFileDot: ({ filePath: t, doCommit: e = 1 }) => Kd(t, e),
  rename: ({ oldPath: t, newPath: e }) => Md(t, e),
  listServerRefs: ({ args: t }) => Qs(t),
  getUsername: wc,
  getEmail: dc,
  getConfig: ({ path: t }) => mc(t),
  setConfig: ({ path: t, value: e }) => zd(t, e),
  resolveRef: ({ ref: t }) => Hd(t),
  readCommit: ({ head: t }) => Wd(t),
  writeCommit: qd,
  writeRef: Gd,
  init: Bd,
  isDirectory: ({ path: t }) => ia(t),
  isDirectoryDot: ({ path: t }) => No(t),
  readdir: ({ path: t }) => ew(t),
  readDirDot: ({ path: t }) => Fo(t),
  getFileStoresFromDatabases: wd
};
let Sc;
const iw = new Promise((t) => {
  Sc = t;
}), xc = {
  execute: async (t, e = {}) => {
    try {
      const r = Mo[t];
      if (!r) throw new Error(`Unknown operation: ${t}`);
      const i = Vr(e), n = await r(i);
      return Vr(n);
    } catch (r) {
      throw Vr(r);
    }
  },
  // Special case for ready check
  ready: () => iw,
  // Maintain backward compatibility with direct method calls
  // by proxying them to execute()
  ...Object.fromEntries(
    Object.keys(Mo).map((t) => [
      t,
      async (e) => xc.execute(t, e)
    ])
  )
};
Sc();
od.set("workerThread", xc);
ee("Worker initialized and ready");
//# sourceMappingURL=gitWorker.js.map
