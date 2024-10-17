const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const ordersRoute = require('./Routes/OrdersRoute'); // Assuming you have this route defined correctly
const Product = require('./Routes/Product');
const Category = require('./Routes/CategoriesRoute');
const cart = require('./Routes/CartRoute');
const Razorpay = require('razorpay');
const paymentRoute = require('./Routes/PaymentRoute');
const Order = require('./Models/OrderModel');
const uri = process.env.MONGODB_URI || 'mongodb+srv://admin:admin@cluster0.kyiehv9.mongodb.net/';
const userRoute = require('./Routes/userRoutes');

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const con = mongoose.connection;
con.on('open', () => {
  console.log('connected with mongodb');
});

const app = express();
app.use(express.json());
app.use(cors());
app.use('/user', userRoute);
app.use('/product', Product);
app.use('/orders', ordersRoute);
app.use('/categories', Category);
app.use('/cart', cart);
app.use('/payment', paymentRoute);

const razorpay = new Razorpay({
  key_id: 'rzp_test_pDBkyi8woO2mSC',
  key_secret: 'JIhotq1NCQvFEKIcSqkfq0B4'
});

// Define routes using express.Router()
const router = express.Router();

// Create order endpoint
router.post('/create-order', async (req, res) => {
  const { name, email, phone, amount, razorpay_payment_id } = req.body;

  try {
    // Create the order in your backend database
    const order = new Order({
      name,
      email,
      phone,
      amount,
      payment_id: razorpay_payment_id,
      order_id: "order_" + new Date().getTime() // Example order ID
    });

    const orderDetails = await order.save();

    console.log("Saving order details:", orderDetails); // Debug statement

    res.json({ success: true, order_id: orderDetails.order_id });
  } catch (error) {
    console.error("Error creating order:", error);
    res.json({ success: false, message: 'Failed to create order' });
  }
});

// Get orders endpoint
router.get('/getorders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});
router.get('/order-status/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findOne({ order_id: id });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ shipmentStatus: order.shipmentStatus });
  } catch (error) {
    console.error('Error fetching order status:', error);
    res.status(500).json({ error: 'Failed to fetch order status' });
  }
});

// Mount the router at the base URL
app.use('/', router);

app.listen(9999, () => {
  console.log('Server started at port 9999');
});
