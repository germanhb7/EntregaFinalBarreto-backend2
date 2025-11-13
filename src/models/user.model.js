const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name:  { type: String, required: true },
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  age:        { type: Number },
  password:   { type: String, required: true }, // almaceno hash
  cart:       { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }, // referencia a carts
  role:       { type: String, enum: ['user','admin'], default: 'user' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
