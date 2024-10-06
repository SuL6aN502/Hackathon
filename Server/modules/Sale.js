// modules/Sale.js
const mongoose = require('mongoose');
const Product = require('./Product');

const saleSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

// بعد حفظ عملية بيع، تحديث المخزون تلقائيًا
saleSchema.post('save', async function (doc) {
  try {
    await Product.findByIdAndUpdate(doc.productId, { $inc: { Stock: -doc.quantity } });
  } catch (error) {
    console.error('Error updating stock after sale:', error);
  }
});

module.exports = mongoose.model('Sale', saleSchema);