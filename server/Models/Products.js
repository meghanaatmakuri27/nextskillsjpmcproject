const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  pid: Number,
  name: String,
  price: Number,
  image: String,
  category: String,
  quantity: Number,
  description: String,
});
module.exports = mongoose.model("cfgproducts", productSchema); // Use "foodproducts" as the model name
