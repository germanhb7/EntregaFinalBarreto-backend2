// src/routes/products.router.js
const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');
const { authenticateJWT, authorizeRoles } = require('../middlewares/auth.middleware');

// ✅ GET /api/products con filtros, paginación y ordenamiento (público)
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      lean: true
    };

    if (sort) {
      options.sort = { price: sort === 'asc' ? 1 : -1 };
    }

    const filter = query
      ? {
          $or: [
            { category: { $regex: query, $options: 'i' } },
            {
              status:
                query === 'available'
                  ? true
                  : query === 'unavailable'
                  ? false
                  : undefined
            }
          ].filter(condition => {
            const value = Object.values(condition)[0];
            return value !== undefined && value !== null;
          })
        }
      : {};

    const result = await Product.paginate(filter, options);

    const baseUrl = `${req.protocol}://${req.get('host')}/api/products?`;
    const queryParams = [];

    if (limit && parseInt(limit) !== 10) queryParams.push(`limit=${limit}`);
    if (sort) queryParams.push(`sort=${sort}`);
    if (query) queryParams.push(`query=${query}`);

    const queryString = queryParams.length > 0 ? `${queryParams.join('&')}&` : '';

    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `${baseUrl}${queryString}page=${result.prevPage}`
        : null,
      nextLink: result.hasNextPage
        ? `${baseUrl}${queryString}page=${result.nextPage}`
        : null
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ✅ GET /api/products/:pid (público)
router.get('/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (!product) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Producto no encontrado' });
    }
    res.json({ status: 'success', payload: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ✅ POST /api/products (solo admin)
router.post('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ status: 'success', payload: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ✅ PUT /api/products/:pid (solo admin)
router.put('/:pid', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.pid, req.body, {
      new: true
    });
    if (!updated)
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

    res.json({ status: 'success', payload: updated });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ✅ DELETE /api/products/:pid (solo admin)
router.delete('/:pid', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.pid);
    if (!deleted)
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

    res.json({ status: 'success', message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
