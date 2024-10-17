const express = require("express");
const router = express.Router();
const DriverModel = require("../Models/CategoryModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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
    const drivers = await DriverModel.find();
    res.json(drivers);
  } catch (err) {
    console.log("error" + err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/add", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const driver = new DriverModel({
    pid: req.body.pid,
  name: req.body.name,
  image:req.file.filename
  });
  try {
    const drivers = await driver.save();
    res.json(drivers);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// router.delete("/delete/:pid", async (req, res) => {
//     try {
//       const st = await productModel.findById(req.params.pid);
//       const s1 = await st.deleteOne(); //deleting the required id
//       res.json(s1); //sending the updated response to the postman
//     } catch (err) {
//         res.json(err);
//     }
//   });
//   router.patch("/update/:pid", async (req, res) => {
//     try {
//       console.log(req.params.pid);
//       const st = await productModel.findById(req.params.pid); //in request params we will have the requested id info
//       st.price= req.body.price;
//       st.image=req.body.image;
//       st.name=req.body.name;
//       const s1 = await st.save(); //saving the updated object by save method
//       res.json(s1);
//     } catch (err) {
//       res.send("Error" + err);
//     }
//   });
router.post("/update", async (req, res) => {
  try {
    const existingProduct = await DriverModel.findOne({ pid: req.body.did });

    if (existingProduct) {
      existingProduct.quantity = req.body.quantity;
      existingProduct.image = req.body.image;
      existingProduct.price = req.body.price;

      const updatedProduct = await existingProduct.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedProduct = await DriverModel.findOneAndDelete({
      _id: req.params.id,
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

module.exports = router;
