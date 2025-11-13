const mongoose = require('mongoose');
const Cart = require('./src/models/cart.model');
const Product = require('./src/models/product.model');
const User = require('./src/models/user.model');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("🔗 Conectado a MongoDB");

    const user = await User.findOne();
    if (!user) {
      console.log("❌ No hay usuarios en la base de datos");
      process.exit(1);
    }

    const products = await Product.find().limit(5);

    const cartData = {
      _id: new mongoose.Types.ObjectId(),
      user: user._id,
      products: products.map(p => ({ product: p._id, quantity: Math.floor(Math.random() * 3) + 1 }))
    };

    const newCart = await Cart.create(cartData);

    console.log("✅ Carrito creado con productos:", newCart);
    process.exit(0);
  })
  .catch(err => console.error(err));
