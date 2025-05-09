// models/productHistory.model.js
const mongoose = require('mongoose');

const productHistorySchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  product_price: { type: Number, required: true },
  discount : { type: Number, required: true },
  timestamp: { type: Date}
});

const ProductHistory = mongoose.model('ProductHistory', productHistorySchema, 'product_history');
module.exports = ProductHistory;
