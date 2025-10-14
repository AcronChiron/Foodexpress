/**
 * Centralized error handler
 * Maps common error types to HTTP status codes and returns a consistent JSON shape
 * Supported mappings:
 * - Joi validation errors -> 400
 * - Mongoose ValidationError -> 422
 * - Mongoose CastError -> 400
 * - Mongo duplicate key (code 11000) -> 409
 * - JWT errors -> 401
 * - SyntaxError (body parser) -> 400
 * - err.status present -> use it
 */

function formatValidationDetails(details) {
  try {
    return details.map((d) => ({ message: d.message, path: d.path || d.context?.key }));
  } catch (e) {
    return undefined;
  }
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Default
  let status = err.status || 500;
  const payload = { error: { message: err.message || 'Internal Server Error' } };

  // Joi validation (server-side validation middleware)
  if (err && (err.isJoi || (err.name === 'ValidationError' && err._original && err.details))) {
    status = 400;
    payload.error.message = 'Invalid request';
    payload.error.details = formatValidationDetails(err.details || []);
    return res.status(status).json(payload);
  }

  // Mongoose validation error
  if (err && err.name === 'ValidationError') {
    status = 422;
    payload.error.message = 'Unprocessable entity';
    payload.error.details = Object.values(err.errors || {}).map((e) => ({
      message: e.message,
      path: e.path,
    }));
    return res.status(status).json(payload);
  }

  // Mongoose CastError (invalid ObjectId)
  if (err && err.name === 'CastError') {
    status = 400;
    payload.error.message = `Invalid ${err.path || 'id'}`;
    return res.status(status).json(payload);
  }

  // Mongo duplicate key
  if (err && err.code && Number(err.code) === 11000) {
    status = 409;
    const fields = Object.keys(err.keyValue || {});
    payload.error.message = `${fields.join(', ') || 'Resource'} already exists`;
    payload.error.details = { keyValue: err.keyValue };
    return res.status(status).json(payload);
  }

  // JWT errors
  if (err && (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError')) {
    status = 401;
    payload.error.message = 'Invalid or expired token';
    return res.status(status).json(payload);
  }

  // Syntax error from body parser
  if (err && err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    status = 400;
    payload.error.message = 'Malformed JSON body';
    return res.status(status).json(payload);
  }

  // Use explicit status if provided
  if (err && err.status) {
    status = err.status;
  }

  // Fallback message for 500
  if (status === 500) {
    // eslint-disable-next-line no-console
    console.error(err);
    payload.error.message = 'Internal Server Error';
  }

  return res.status(status).json(payload);
}

module.exports = errorHandler;
