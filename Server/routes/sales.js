const express = require("express");
const router = express.Router();
const Sale = require("../modules/Sale");
const Product = require("../modules/Product");
const mongoose = require("mongoose");

// تسجيل بيع واحد
router.post('/', async (req, res) => {
  try {
    const { productId, quantity, price } = req.body;

    // التحقق من وجود المنتج
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'لم يتم العثور على المنتج المطلوب.' });
    }

    // التحقق من كفاية المخزون
    if (product.Stock < quantity) {
      return res.status(400).json({ error: 'المخزون غير كافٍ للمنتج المطلوب.' });
    }

    // إنشاء سجل البيع
    const sale = await Sale.create({ productId, quantity, price });

    // تحديث المخزون
    product.Stock -= quantity;
    await product.save();

    res.status(201).json({ sale, updatedProduct: product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// تسجيل مبيعات متعددة
router.post("/bulk", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { sales } = req.body;

    if (!Array.isArray(sales) || sales.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ error: "يجب توفير مصفوفة صالحة من المبيعات." });
    }

    const updatedProducts = [];
    const createdSales = [];

    for (let saleItem of sales) {
      const { productId, quantity, price } = saleItem;

      const updatedProduct = await Product.findOneAndUpdate(
        { _id: productId, Stock: { $gte: quantity } },
        { $inc: { Stock: -quantity } },
        { new: true, session }
      );

      if (!updatedProduct) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(400)
          .json({ error: `المخزون غير كافٍ للمنتج ${productId}.` });
      }

      updatedProducts.push(updatedProduct);
      const sale = await Sale.create([{ productId, quantity, price }], {
        session,
      });
      createdSales.push(sale[0]);
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "تم تسجيل المبيعات بنجاح.",
      sales: createdSales,
      updatedProducts,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
