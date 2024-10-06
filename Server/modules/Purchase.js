// modules/Purchase.js
const mongoose = require("mongoose");
const Product = require("./Product");


const purchaseSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { 
    type: Number, 
    required: true,
    min: [0, 'Quantity must be 0 or greater']
  },
  price: { 
    type: Number, 
    required: true,
    min: [0, 'Price must be 0 or greater']
  }, // Unit price at the time of purchase
  date: { type: Date, default: Date.now },
});

// After saving a purchase, automatically update the stock
purchaseSchema.post("save", async function(doc) { // Use a regular function to access `this`
  try {
    // Fetch the product based on productId
    const product = await Product.findById(doc.productId);

    if (!product) {
      console.log("Product not found");
      return;
    }

      // Update the stock
      product.Stock += doc.quantity;
      await product.save();
      console.log("Stock updated successfully");

    } catch (error) {
    console.error("Error updating stock after purchase:\n", error);
  }
});

module.exports = mongoose.model("Purchase", purchaseSchema);