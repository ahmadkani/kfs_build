const isNode = typeof window === 'undefined';

export class Logger {
  constructor(on = true, trace = false) {
    this.on = on;
    this.trace = trace;
    }

    consoleDotLog(...parameters) {
    if (!this.on) return;
    console.log(...parameters);
    this.trace && console.trace();
    }

    consoleDotError(...parameters) {
    if (!this.on) return;
    console.error(...parameters);
    this.trace && console.trace();
    }
}
