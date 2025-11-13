const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const Ticket = require('../models/ticket.model');
const { v4: uuidv4 } = require('uuid');

async function purchaseCart(req, res) {
  try {
    const { cid } = req.params;
    const userEmail = req.user.email;

    const cart = await Cart.findById(cid).populate('products.product');
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    let totalAmount = 0;
    const productsWithoutStock = [];

    // ✅ Verificar stock de cada producto
    for (const item of cart.products) {
      const product = item.product;

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        totalAmount += product.price * item.quantity;
        await product.save();
      } else {
        productsWithoutStock.push({
          product: product._id,
          name: product.title,
          available: product.stock,
          requested: item.quantity
        });
      }
    }

    // ✅ Generar ticket solo si hubo compra posible
    let ticket = null;
    if (totalAmount > 0) {
      ticket = await Ticket.create({
        code: uuidv4(),
        amount: totalAmount,
        purchaser: userEmail
      });
    }

    // ✅ Dejar solo los productos sin stock en el carrito
    cart.products = cart.products.filter(item =>
      productsWithoutStock.find(p => p.product.toString() === item.product._id.toString())
    );
    await cart.save();

    res.json({
      status: 'success',
      message: 'Compra procesada',
      ticket,
      productsWithoutStock
    });
  } catch (error) {
    console.error('Error en purchaseCart:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

module.exports = { purchaseCart };
