const express = require('express');
const router = express.Router();
const ProductDAO = require('../dao/models/product.dao');
const Cart = require('../models/cart.model');
const { eq, multiply } = require('../utils/handlebarsHelpers');

// Helpers para Handlebars
router.use((req, res, next) => {
  res.locals.eq = eq;
  res.locals.multiply = multiply;
  res.locals.json = (obj) => JSON.stringify(obj);
  next();
});

// Vista de productos con paginación
router.get('/products', async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    
    const result = await ProductDAO.getProducts({
      limit,
      page,
      sort,
      query
    });

    res.render('products', {
      payload: result.payload,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.prevLink,
      nextLink: result.nextLink,
      limit,
      sort,
      query
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message }); 
  }
});

// Vista de detalle de producto
router.get('/products/:pid', async (req, res) => {
  try {
    const product = await ProductDAO.getProductById(req.params.pid);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' }); 
    }
    res.render('product-detail', { product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message }); 
  }
});

// Vista del carrito
router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid)
      .populate('products.product');

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' }); 
    }

    res.render('cart', { cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message }); 
  }
});

// Vista principal
router.get('/', async (req, res) => {
  res.render('index');
});

module.exports = router;