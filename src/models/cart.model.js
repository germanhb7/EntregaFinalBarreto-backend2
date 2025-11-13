const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
});

const cartSchema = new mongoose.Schema({
  products: [cartItemSchema],
  total: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculo total antes de guardar
cartSchema.pre('save', function(next) {
  if (this.products.length > 0) {
    this.total = this.products.reduce((acc, item) => {
      return acc + (item.quantity * (item.product?.price || 0));
    }, 0);
  } else {
    this.total = 0;
  }
  next();
});

module.exports = mongoose.model('Cart', cartSchema);