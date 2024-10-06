const mongoose = require('mongoose');

const inventoryCountSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  countedQuantity: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('InventoryCount', inventoryCountSchema);