const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  pid: Number,
  name: String,
  image:String
});
module.exports = mongoose.model("categoriescfg", productSchema); // Use "foodproducts" as the model name
