require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/user.model');
const Product = require('./src/models/product.model');
const Cart = require('./src/models/cart.model');

const MONGO_URI = process.env.MONGO_URI;

const testConnection = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conexión a MongoDB exitosa');

    // Listar usuarios
    const users = await User.find().select('-password');
    console.log('\n👤 Usuarios en la base:', users);

    // Listar productos
    const products = await Product.find();
    console.log('\n💻 Productos en la base:', products);

    // Listar carritos con productos
    const carts = await Cart.find().populate('products.product');
    console.log('\n🛒 Carritos en la base:', carts);

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
  }
};

testConnection();
