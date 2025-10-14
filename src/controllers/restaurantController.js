const Joi = require('joi');
const Restaurant = require('../models/Restaurant');
const { getPagination, getSort, getFilters } = require('../utils/pagination');

const createSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().allow('', null),
  phone: Joi.string().allow('', null),
  opening_hours: Joi.string().allow('', null),
});

const updateSchema = createSchema.min(1);

async function listRestaurants(req, res, next) {
  try {
    const { page, limit, skip } = getPagination(req);
    const sort = getSort(req, 'name');
    const filter = getFilters(req, ['q', 'name']);
    const [items, total] = await Promise.all([
      Restaurant.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Restaurant.countDocuments(filter),
    ]);
    res.set('X-Total-Count', String(total));
    return res.json({ data: items, meta: { page, limit, total } });
  } catch (err) {
    return next(err);
  }
}

async function getRestaurant(req, res, next) {
  try {
    const { id } = req.params;
    const r = await Restaurant.findById(id).lean();
    if (!r) {
      const err = new Error('Restaurant not found');
      err.status = 404;
      return next(err);
    }
    return res.json({ data: r });
  } catch (err) {
    return next(err);
  }
}

async function createRestaurant(req, res, next) {
  try {
    const payload = req.body;
    const r = new Restaurant(payload);
    await r.save();
    return res.status(201).json({ data: r.toJSON() });
  } catch (err) {
    return next(err);
  }
}

async function updateRestaurant(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const r = await Restaurant.findById(id);
    if (!r) {
      const err = new Error('Restaurant not found');
      err.status = 404;
      return next(err);
    }
    Object.assign(r, updates);
    await r.save();
    return res.json({ data: r.toJSON() });
  } catch (err) {
    return next(err);
  }
}

async function deleteRestaurant(req, res, next) {
  try {
    const { id } = req.params;
    const r = await Restaurant.findByIdAndDelete(id).lean();
    if (!r) {
      const err = new Error('Restaurant not found');
      err.status = 404;
      return next(err);
    }
    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  createSchema,
  updateSchema,
};
