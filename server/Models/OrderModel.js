const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    payment_id: {
        type: String,
        required: true
    },
    order_id: {
        type: String,
        required: true,
        unique: true // Ensure order_id is unique
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    shipmentStatus:{
      type:String,
      default:'packed'
    }
});

const Order = mongoose.model('ordercfg', orderSchema);

module.exports = Order;
