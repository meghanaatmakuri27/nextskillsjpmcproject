// Routes/PaymentRoute.js
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const OrderModel = require("../Models/OrderModel");

router.post("/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
  const secret = "JIhotq1NCQvFEKIcSqkfq0B4"; // Set this in your Razorpay Dashboard

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(req.body);
  const digest = shasum.digest("hex");

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("Request is legitimate");

    try {
      const event = JSON.parse(req.body);

      if (event.event === "payment.captured") {
        const { id, amount, email, contact } = event.payload.payment.entity;

        const order = await OrderModel.findOne({ payment_id: id });

        if (order) {
          order.status = "paid";
          await order.save();
        }

        res.json({ status: "ok" });
      } else {
        res.status(400).json({ error: "Unhandled event type" });
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ error: "Invalid signature" });
  }
});

module.exports = router;
