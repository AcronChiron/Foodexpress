/**
 * Authorization helpers
 * - requireRole(role): allow only users with given role
 * - requireSelfOrRole(paramName='id', role='admin'): allow user when req.user.id === req.params[paramName] OR req.user.role === role
 */
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      const err = new Error('Unauthorized');
      err.status = 401;
      return next(err);
    }
    if (req.user.role !== role) {
      const err = new Error('Forbidden');
      err.status = 403;
      return next(err);
    }
    return next();
  };
}

function requireSelfOrRole(paramName = 'id', role = 'admin') {
  return (req, res, next) => {
    if (!req.user) {
      const err = new Error('Unauthorized');
      err.status = 401;
      return next(err);
    }

    const targetId = req.params[paramName];
    if (req.user.id === targetId || req.user.role === role) {
      return next();
    }

    const err = new Error('Forbidden');
    err.status = 403;
    return next(err);
  };
}

module.exports = {
  requireRole,
  requireSelfOrRole,
};
