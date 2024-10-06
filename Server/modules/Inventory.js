// modules/Inventory.js
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  openingStock: { type: Number, required: true },
  purchases: { type: Number, required: true },
  sales: { type: Number, required: true },
  closingStock: { type: Number, required: true },
  cogs: { type: Number, required: true },
});

module.exports = mongoose.model('Inventory', inventorySchema);