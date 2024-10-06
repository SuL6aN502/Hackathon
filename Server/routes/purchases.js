const express = require("express");
const router = express.Router();
const Purchase = require("../modules/Purchase");

// تسجيل شراء جديد
router.post("/", async (req, res) => {
  try {
    const { productId, quantity, price } = req.body;
    // إنشاء سجل الشراء
      await Purchase.create({ productId, quantity, price });

    // تحديث المخزون - يتم تلقائيًا عبر Middleware في Purchase.js
    res.status(201).json({ Purchase: Purchase });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// عرض كافة المشتريات
router.get("/", async (req, res) => {
  try {
    const purchases = await Purchase.find().populate("productId");
    res.json({ Purchases: purchases });
  } catch (error) {
    res.status(500).json({error:error.message });
  }
});

module.exports = router;
