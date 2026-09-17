// backend/src/utils/requestId.js
// Generates a unique request ID in the format REQ-<timestamp>-<random>
// Example: REQ-1758173920123-A7K2P

const crypto = require('crypto');

function generateRequestId() {
  const timestamp = Date.now();
  const random = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 hex chars ~ 3 bytes
  return `REQ-${timestamp}-${random}`;
}

module.exports = { generateRequestId };
