// Global shims for browser environment expecting certain Node globals
declare global {
  var global: typeof globalThis | undefined; // allow assignment (var to extend global scope)
}

if (typeof global === "undefined") {
  (window as unknown as { global: typeof globalThis }).global = globalThis;
}

export {};
