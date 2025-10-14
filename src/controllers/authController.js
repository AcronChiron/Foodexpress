const Joi = require('joi');
const User = require('../models/User');
const { signToken } = require('../utils/jwt');

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

async function login(req, res, next) {
  try {
    if (!req.body || typeof req.body !== 'object') {
      const err = new Error('Request body is required');
      err.status = 400;
      return next(err);
    }

    const { email, password } = req.body;
    if (!email || !password) {
      const err = new Error('Email and password are required');
      err.status = 400;
      return next(err);
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      return next(err);
    }

    const match = await user.comparePassword(password);
    if (!match) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      return next(err);
    }

    const token = signToken({ id: user._id.toString(), role: user.role });
    return res.json({ data: { token, user: user.toJSON() } });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  login,
  loginSchema,
};
