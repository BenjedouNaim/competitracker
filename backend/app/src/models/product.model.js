// models/product.model.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  competitor: { type: String, required: true },
  url: { type: String, required: true },
  product_name: { type: String, required: true },
  product_price: { type: Number, required: true }, 
  discount: { type: Number, default: 0 },         
  category: { type: String, required: true },
  sub_category: { type: String, required: true },
  stock_status: { type: String, required: true },
  LastUpdate: { type: Date, default: Date.now }
});

const Product = mongoose.model('products', productSchema);
module.exports = Product;
