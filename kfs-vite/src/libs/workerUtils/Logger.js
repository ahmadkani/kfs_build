(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else {
        root.Logger = factory();
    }
  }(typeof self !== "undefined" ? self : this, function () {
    class Logger {
        constructor(on = true, trace = false) {
            this.on = on;
            this.trace = trace;
        }
  
        consoleDotLog(...parameters) {
            if (!this.on) return;
            console.log(...parameters);
        }
  
        consoleDotError(...parameters) {
            if (!this.on) return;
            console.error(...parameters);
            this.trace && console.trace();
        }
    }
  
    return Logger;
  }));
  