const Joi = require('joi');
const Menu = require('../models/Menu');
const { getPagination, getSort, getFilters } = require('../utils/pagination');

const createSchema = Joi.object({
  restaurant_id: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().allow('', null),
  price: Joi.number().min(0).required(),
  category: Joi.string().allow('', null),
});

const updateSchema = createSchema.min(1);

async function listMenus(req, res, next) {
  try {
    const { page, limit, skip } = getPagination(req);
    const sort = getSort(req, 'price');
    const filter = getFilters(req, ['restaurant_id', 'category', 'price_min', 'price_max', 'q']);
    const [items, total] = await Promise.all([
      Menu.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Menu.countDocuments(filter),
    ]);
    res.set('X-Total-Count', String(total));
    return res.json({ data: items, meta: { page, limit, total } });
  } catch (err) {
    return next(err);
  }
}

async function getMenu(req, res, next) {
  try {
    const { id } = req.params;
    const m = await Menu.findById(id).lean();
    if (!m) {
      const err = new Error('Menu not found');
      err.status = 404;
      return next(err);
    }
    return res.json({ data: m });
  } catch (err) {
    return next(err);
  }
}

async function createMenu(req, res, next) {
  try {
    if (!req.body || typeof req.body !== 'object') {
      const err = new Error('Request body is required');
      err.status = 400;
      return next(err);
    }

    const payload = req.body;
    const m = new Menu(payload);
    await m.save();
    return res.status(201).json({ data: m.toJSON() });
  } catch (err) {
    return next(err);
  }
}

async function updateMenu(req, res, next) {
  try {
    if (!req.body || typeof req.body !== 'object') {
      const err = new Error('Request body is required');
      err.status = 400;
      return next(err);
    }

    const { id } = req.params;
    const updates = req.body;
    const m = await Menu.findById(id);
    if (!m) {
      const err = new Error('Menu not found');
      err.status = 404;
      return next(err);
    }
    Object.assign(m, updates);
    await m.save();
    return res.json({ data: m.toJSON() });
  } catch (err) {
    return next(err);
  }
}

async function deleteMenu(req, res, next) {
  try {
    const { id } = req.params;
    const m = await Menu.findByIdAndDelete(id).lean();
    if (!m) {
      const err = new Error('Menu not found');
      err.status = 404;
      return next(err);
    }
    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listMenus,
  getMenu,
  createMenu,
  updateMenu,
  deleteMenu,
  createSchema,
  updateSchema,
};
