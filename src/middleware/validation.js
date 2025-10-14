const validationMiddleware = (schema) => async (req, res, next) => {
  try {
    const value = await schema.validateAsync(req.body, { abortEarly: false, stripUnknown: true });
    req.body = value;
    return next();
  } catch (err) {
    err.status = 400;
    return next(err);
  }
};

module.exports = validationMiddleware;
