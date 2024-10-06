const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Description: String,
  Barcode: { type: String, unique: true },
  Price: Number,
  Stock: {
    type: Number,
    default: 0,
    min: [0, "لا يمكن أن يكون المخزون سالبًا."],
    required: [true, "حقل الكمية مطلوب"],
    validate: {
      validator: function (v) {
        return v >= 0;
      },
      message: "القيمة يجب أن تكون 0 أو أكبر",
    },
  },
  reorderLevel: { type: Number, default: 10 },
  Category: String,
  expirationDate: Date,
  CreatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
