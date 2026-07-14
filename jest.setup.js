// Polyfill for SlowBuffer removed in Node.js 26
const buffer = require('buffer');
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = function SlowBuffer(length) {
    return Buffer.allocUnsafe(length);
  };
  buffer.SlowBuffer.prototype = Buffer.prototype;
}

const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Suppress jsdom CSS parsing errors from @backstage/ui's modern CSS nesting syntax
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    (typeof args[0] === 'object' && args[0]?.type === 'css-parsing') ||
    (typeof args[0] === 'string' && args[0].includes('Could not parse CSS stylesheet'))
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Suppress jsdom CSS parsing exceptions thrown during module loading
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('Could not parse CSS stylesheet')) {
    return;
  }
  originalConsoleWarn(...args);
};
