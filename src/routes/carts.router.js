// src/routes/carts.router.js
const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const { authenticateJWT, authorizeRoles } = require('../middlewares/auth.middleware');
const { purchaseCart } = require('../controllers/purchase.controller');

// ✅ Obtener todos los carritos (solo admin)
router.get('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const carts = await Cart.find().populate('products.product');
    res.json({ status: 'success', payload: carts });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ✅ Crear un nuevo carrito (solo user)
router.post('/', authenticateJWT, authorizeRoles('user'), async (req, res) => {
  try {
    const cart = new Cart({ products: [] });
    await cart.save();
    res.status(201).json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ✅ Obtener carrito por ID (solo user)
router.get('/:cid', authenticateJWT, authorizeRoles('user'), async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product');

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ✅ Agregar producto al carrito (solo user)
router.post('/:cid/products/:pid', authenticateJWT, authorizeRoles('user'), async (req, res) => {
  try {
    const { quantity = 1 } = req.body;
    const cart = await Cart.findById(req.params.cid);
    const product = await Product.findById(req.params.pid);

    if (!cart || !product) {
      return res.status(404).json({ status: 'error', message: 'Carrito o producto no encontrado' });
    }

    const existingProductIndex = cart.products.findIndex(
      item => item.product.toString() === req.params.pid
    );

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += parseInt(quantity);
    } else {
      cart.products.push({ product: req.params.pid, quantity: parseInt(quantity) });
    }

    await cart.save();
    await cart.populate('products.product');
    
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ✅ Eliminar producto del carrito (solo user)
router.delete('/:cid/products/:pid', authenticateJWT, authorizeRoles('user'), async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    cart.products = cart.products.filter(item => 
      item.product.toString() !== req.params.pid
    );

    await cart.save();
    await cart.populate('products.product');
    
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ✅ Actualizar todos los productos del carrito (solo user)
router.put('/:cid', authenticateJWT, authorizeRoles('user'), async (req, res) => {
  try {
    const { products } = req.body;
    const cart = await Cart.findByIdAndUpdate(
      req.params.cid,
      { products },
      { new: true }
    ).populate('products.product');

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ✅ Actualizar cantidad de producto (solo user)
router.put('/:cid/products/:pid', authenticateJWT, authorizeRoles('user'), async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findById(req.params.cid);
    
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    const productIndex = cart.products.findIndex(
      item => item.product.toString() === req.params.pid
    );

    if (productIndex === -1) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
    }

    cart.products[productIndex].quantity = parseInt(quantity);
    await cart.save();
    await cart.populate('products.product');

    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ✅ Vaciar carrito (solo user)
router.delete('/:cid', authenticateJWT, authorizeRoles('user'), async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(
      req.params.cid,
      { products: [] },
      { new: true }
    ).populate('products.product');

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ✅ Confirmar compra del carrito (solo user)
router.post('/:cid/purchase', authenticateJWT, authorizeRoles('user'), purchaseCart);

module.exports = router;
