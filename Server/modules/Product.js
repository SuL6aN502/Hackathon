const mongoose = require("mongoose");

// requireds Name , Des , Barcode , price , Stock , Category 
// optional expirationDate , CreatedAt 
const productSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Description: { type: String, required: true },
  Barcode: { type: String, unique: true, required: true },
  Price: { type: Number, required: true },
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
  Category: { type: String, required: true },
  expirationDate: { type: Date },
  CreatedAt: { type: Date, default: Date.now },
});

// Export the model
module.exports = mongoose.model("Product", productSchema);