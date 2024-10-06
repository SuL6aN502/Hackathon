const express = require('express');
const router = express.Router();
const Product = require('../modules/Product');

// عرض كافة المنتجات
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ Products: products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// البحث عن منتجات باستخدام مفتاح
router.get('/search/:key', async (req, res) => { // تغيير المسار لتجنب التعارض مع عرض منتج واحد
  try {
    const { key } = req.params;
    const products = await Product.find({
      $or: [
        { Name: { $regex: key, $options: 'i' } }, // استخدام $options لعدم الحساسية لحالة الأحرف
        { Description: { $regex: key, $options: 'i' } },
        { Barcode: { $regex: key, $options: 'i' } },
        { Category: { $regex: key, $options: 'i' } },
      ],
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// عرض منتج واحد بواسطة ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ Product: product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// إنشاء منتج جديد
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ Product: product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// تحديث عدة منتجات (Bulk Update)
router.put('/bulk-update', async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "يجب توفير مصفوفة صالحة من المنتجات للتحديث" });
    }

    const bulkOps = products.map((product) => ({
      updateOne: {
        filter: { _id: product._id },
        update: { $set: product },
      },
    }));

    const result = await Product.bulkWrite(bulkOps);

    
    res.json({
      success: true,
      message: `تم تحديث ${result.modifiedCount} منتج`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// تحديث منتج واحد بواسطة ID
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
    res.json({ Product: updatedProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// حذف منتج واحد بواسطة ID
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: "تم حذف المنتج بنجاح" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;