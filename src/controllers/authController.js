const Joi = require('joi');
const User = require('../models/User');
const { signToken } = require('../utils/jwt');

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
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
