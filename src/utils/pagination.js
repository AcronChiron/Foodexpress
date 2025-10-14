function getPagination(req) {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

function getSort(req, defaultSort = 'name') {
  const sort = req.query.sort || defaultSort;
  const order = req.query.order === 'desc' ? -1 : 1;
  return { [sort]: order };
}

/**
 * Build a Mongoose filter object from query params.
 * - allowed: array of query keys to accept. Supports special keys:
 *   - 'q' -> general text search on name/address
 *   - '<field>_min' / '<field>_max' -> numeric range for <field>
 */
function getFilters(req, allowed = []) {
  const q = {};
  for (const key of allowed) {
    const val = req.query[key];
    if (val === undefined) continue;

    // general search
    if (key === 'q' || key === 'search') {
      const re = new RegExp(val, 'i');
      q.$or = [{ name: re }, { address: re }];
      continue;
    }

    // range filters: price_min / price_max style
    const rangeMatch = key.match(/^(.+?)_(min|max)$/);
    if (rangeMatch) {
      const field = rangeMatch[1];
      q[field] = q[field] || {};
      if (rangeMatch[2] === 'min') q[field].$gte = parseFloat(val);
      else q[field].$lte = parseFloat(val);
      continue;
    }

    // name partial match
    if (key === 'name') {
      q.name = new RegExp(val, 'i');
      continue;
    }

    // default equality
    q[key] = val;
  }
  return q;
}

// Backwards-compatible aliases
const parsePagination = getPagination;
const parseSort = getSort;

module.exports = { getPagination, getSort, getFilters, parsePagination, parseSort };
