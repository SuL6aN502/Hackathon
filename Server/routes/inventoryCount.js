const express = require('express');
const router = express.Router();
const InventoryCount = require('../modules/InventoryCount');
const Product = require('../modules/Product');

router.post('/', async (req, res) => {
  try {
    const { productId, countedQuantity } = req.body;

    // إنشاء سجل الجرد
    const countEntry = await InventoryCount.create({ productId, countedQuantity });

    // مقارنة المخزون الفعلي بالمخزون المسجل
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const discrepancy = countedQuantity - product.Stock;

    res.status(201).json({ countEntry, discrepancy });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/discrepancies', async (req, res) => {
  try {
    const counts = await InventoryCount.find().populate("productId");

    const discrepancies = [];

    for (const count of counts) {
      // تحقق مما إذا كان productId موجودًا
      if (count.productId) {
        const product = await Product.findById(count.productId._id);
        if (product && product.Stock !== count.countedQuantity) {
          discrepancies.push({
            productName: product.Name,
            expectedStock: product.Stock,
            actualStock: count.countedQuantity,
            difference: count.countedQuantity - product.Stock,
          });
        }
      } else {
        // يمكنك إضافة منطق هنا للتعامل مع الحالات التي لا يوجد فيها productId
        console.warn(`No productId for count: ${count}`);
      }
    }

    res.json({ discrepancies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;