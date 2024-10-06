const express = require('express');
const router = express.Router();
const Purchase = require('../modules/Purchase');
const Sale = require('../modules/Sale');
const Inventory = require('../modules/Inventory');
const Product = require('../modules/Product');

// تعديل دالة حساب COGS لاستقبال معاملين فقط
function calculateCOGS(purchases, sales) {
  return purchases - sales;
}

router.post('/generate', async (req, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ error: "التاريخ مطلوب." });
    }

    // الحصول على المشتريات حتى التاريخ المحدد
    const purchases = await Purchase.find({ date: { $lte: new Date(date) } });
    
    // طباعة التفاصيل للتحقق
    purchases.forEach(purchase => {
      console.log(`Purchase ID: ${purchase._id}, Quantity: ${purchase.quantity}, Price: ${purchase.price}`);
    });

    const totalPurchases = purchases.reduce((acc, purchase) => {
      const quantity = Number(purchase.quantity);
      const price = Number(purchase.price);

      if (isNaN(quantity) || isNaN(price)) {
        console.error(`Invalid purchase data: quantity=${purchase.quantity}, price=${purchase.price}`);
        return acc;
      }

      return acc + (quantity * price);
    }, 0);

    console.log("Total Purchases:", totalPurchases);

    // الحصول على المبيعات حتى التاريخ المحدد
    const sales = await Sale.find({ date: { $lte: new Date(date) } });
    const totalSales = sales.reduce((acc, sale) => {
      const quantity = Number(sale.quantity);
      const price = Number(sale.price);

      if (isNaN(quantity) || isNaN(price)) {
        console.error(`Invalid sale data: quantity=${sale.quantity}, price=${sale.price}`);
        return acc;
      }

      return acc + (quantity * price);
    }, 0);

    console.log("Total Sales:", totalSales);

    // الحصول على المخزون الحالي
    const products = await Product.find();
    const openingStock = products.reduce((acc, product) => {
      const stock = Number(product.Stock);
      if (isNaN(stock)) {
        throw new Error(`Invalid stock value for product ${product._id}: ${product.Stock}`);
      }
      return acc + stock;
    }, 0);

    console.log("Opening Stock:", openingStock);

    const totalPurchasedQuantity = purchases.reduce((acc, p) => acc + Number(p.quantity), 0);
    const totalSoldQuantity = sales.reduce((acc, s) => acc + Number(s.quantity), 0);
    const closingStock = openingStock + totalPurchasedQuantity - totalSoldQuantity;

    console.log("Closing Stock:", closingStock);

    // حساب COGS
    const cogs = calculateCOGS(totalPurchases, totalSales);

    console.log("COGS:", cogs);

    // التحقق من القيم قبل إنشاء السجل
    if (isNaN(totalPurchases) || isNaN(totalSales) || isNaN(closingStock) || isNaN(cogs)) {
      return res.status(400).json({ error: "هناك قيمة غير صالحة في الحسابات." });
    }

    // إنشاء سجل الجرد
    const inventory = await Inventory.create({
      date: new Date(date),
      openingStock,
      purchases: totalPurchases,
      sales: totalSales,
      closingStock,
      cogs,
    });

    res.status(201).json({ Inventory: inventory });
  } catch (error) {
    console.error('Error generating inventory:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const inventories = await Inventory.find().sort({ date: -1 });
    res.json({ Inventories: inventories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;