// Routes/OrdersRoute.js
const express = require("express");
const router = express.Router();
const OrderModel = require("../Models/OrderModel");

router.post("/create-order", async (req, res) => {
  const { name, email, phone, amount, razorpay_payment_id } = req.body;

  try {
    console.log("Received order details:", {
      name,
      email,
      phone,
      amount,
      razorpay_payment_id,
    });

    const orderDetails = new OrderModel({
      name,
      email,
      phone,
      amount,
      payment_id: razorpay_payment_id,
      order_id: "order_" + new Date().getTime(),
    });

    console.log("Saving order details:", orderDetails);

    const savedOrder = await orderDetails.save();

    res.json({ success: true, order_id: savedOrder.order_id });
  } catch (error) {
    console.error("Error creating order:", error);
    res.json({ success: false, message: "Failed to create order" });
  }
});

module.exports = router;
