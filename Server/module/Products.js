const {default : mongoose} = require("mongoose");


const productShema = new mongoose.Schema({
    Name:String,
    Description:String,
    Barcode:String,
    Price:Number,
    expirationDate:Date,
    Stock:Number,
    Category:String,
    CreatedAt: { type: Date, default: Date.now }
})

const Product =  mongoose.model("Product", productShema);

module.exports = Product;