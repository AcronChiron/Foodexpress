const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'change_this_in_env';
const DEFAULT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

/**
 * Sign a JWT token
 * @param {Object} payload - object to embed in token (id, role...)
 * @param {Object} [options] - jwt.sign options (e.g. { expiresIn })
 * @returns {String} signed token
 */
function signToken(payload, options = {}) {
  const opts = { expiresIn: DEFAULT_EXPIRES_IN, ...(options || {}) };
  return jwt.sign(payload, SECRET, opts);
}

/**
 * Verify a JWT token and return payload or throw the underlying error
 * @param {String} token
 * @returns {Object} payload
 */
function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = {
  signToken,
  verifyToken,
};
