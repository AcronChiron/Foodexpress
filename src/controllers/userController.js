const Joi = require('joi');
const User = require('../models/User');

const userCreateSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
});

async function register(req, res, next) {
  try {
    if (!req.body || typeof req.body !== 'object') {
      const err = new Error('Request body is required');
      err.status = 400;
      return next(err);
    }

    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      const err = new Error('Email, username, and password are required');
      err.status = 400;
      return next(err);
    }

    // Check unique constraints
    const existing = await User.findOne({ $or: [{ email }, { username }] }).lean();
    if (existing) {
      const conflictField = existing.email === email ? 'email' : 'username';
      const err = new Error(`${conflictField} already exists`);
      err.status = 409;
      return next(err);
    }

    const user = new User({ email, username, password });
    await user.save();
    const userJson = user.toJSON();
    return res.status(201).json({ data: userJson });
  } catch (err) {
    return next(err);
  }
}

// GET /users/:id
async function getUser(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.findById(id).lean();
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      return next(err);
    }
    return res.json({ data: user });
  } catch (err) {
    return next(err);
  }
}

// PUT /users/:id
const userUpdateSchema = Joi.object({
  email: Joi.string().email(),
  username: Joi.string().min(3),
  password: Joi.string().min(6),
}).min(1);

async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;
    // If password provided, it will be hashed by pre-save hook; use findById then set
    const user = await User.findById(id);
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      return next(err);
    }
    Object.assign(user, updates);
    await user.save();
    return res.json({ data: user.toJSON() });
  } catch (err) {
    return next(err);
  }
}

// DELETE /users/:id
async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id).lean();
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      return next(err);
    }
    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  register,
  getUser,
  updateUser,
  deleteUser,
  userCreateSchema,
  userUpdateSchema,
};
