const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    image: String,
    price: Number,
    size: String,
    color: String,
    quantity: { type: Number, required: true, default: 1 },
  }],
  shippingAddress: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    phone: { type: String, required: true },
  },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    default: 'Order Received',
    enum: ['Order Received', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
  },
  estimatedDays: { type: Number, default: 7 },
  adminNotes: { type: String, default: '' },
  paymentMethod: { type: String, default: 'COD' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
