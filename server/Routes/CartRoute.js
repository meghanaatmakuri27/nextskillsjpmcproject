const express = require("express");
const router = express.Router();
const CartModel = require("../models/CartModel"); // Adjust the path as necessary

// GET all cart items
router.get("/", async (req, res) => {
  try {
    const cartItems = await CartModel.find();
    res.json(cartItems);
  } catch (err) {
    console.error("Error retrieving cart items:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST add a new item to cart or update quantity
router.post("/add", async (req, res) => {
  const { pid, image, name, price, quantity, user_id } = req.body;

  try {
    const existingProduct = await CartModel.findOne({ pid, user_id });

    if (existingProduct) {
      // If the product already exists in the cart, update the quantity
      existingProduct.quantity += quantity;
      await existingProduct.save();
      res.json(existingProduct);
    } else {
      // If the product doesn't exist in the cart, create a new item
      const newProduct = new CartModel({
        pid,
        image,
        name,
        price,
        quantity,
        user_id
      });
      const savedProduct = await newProduct.save();
      res.json(savedProduct);
    }
  } catch (err) {
    console.error("Error adding product to cart:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH update quantity of a specific cart item by ID
router.patch("/:id", async (req, res) => {
  try {
    const cartItem = await CartModel.findById(req.params.id);
    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    cartItem.quantity = req.body.quantity;
    const updatedCartItem = await cartItem.save();
    res.json(updatedCartItem);
  } catch (err) {
    console.error("Error updating cart item quantity:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE delete a specific cart item by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedCartItem = await CartModel.findByIdAndDelete(req.params.id);
    if (!deletedCartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.json(deletedCartItem);
  } catch (err) {
    console.error("Error deleting cart item:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
