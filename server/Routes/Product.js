const express = require("express");
const router = express.Router();
const productModel = require("../Models/Products");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define the storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../frontend/public/Images"));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const products = await productModel.find();
    res.json(products);
  } catch (err) {
    console.log("error" + err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/add", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const product = new productModel({
    pid: req.body.pid,
    image: req.file.filename,
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    quantity: 1, // Corrected the field name from 'qunatity' to 'quantity'
    description: req.body.description,
  });
  try {
    const products = await product.save();
    console.log(product);
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/delete/:pid", async (req, res) => {
  try {
    const deletedProduct = await productModel.findOneAndDelete({
      pid: req.params.pid,
    });

    if (deletedProduct) {
      res.json(deletedProduct);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Serve static files from the 'public' directory
router.use(express.static("public"));

module.exports = router;
