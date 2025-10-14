const { verifyToken } = require('../utils/jwt');

/**
 * authMiddleware
 * - verifies Authorization: Bearer <token>
 * - on success attaches req.user = { id, role }
 * - on failure forwards an error with status 401
 */
function authMiddleware(req, res, next) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (!header || typeof header !== 'string' || !header.startsWith('Bearer ')) {
    const err = new Error('Missing or invalid Authorization header');
    err.status = 401;
    return next(err);
  }

  const token = header.split(' ')[1];
  try {
    const payload = verifyToken(token);
    // minimal shape exposure
    req.user = { id: payload.id, role: payload.role };
    return next();
  } catch (e) {
    const err = new Error('Invalid or expired token');
    err.status = 401;
    return next(err);
  }
}

module.exports = authMiddleware;
