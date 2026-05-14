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
