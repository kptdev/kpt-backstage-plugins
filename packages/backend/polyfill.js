/**
 * Polyfill for SlowBuffer which was removed in Node.js 26.
 * Required by buffer-equal-constant-time (transitive dep of jsonwebtoken).
 */
const buffer = require('buffer');
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = function SlowBuffer(length) {
    return Buffer.allocUnsafe(length);
  };
  buffer.SlowBuffer.prototype = Buffer.prototype;
}
