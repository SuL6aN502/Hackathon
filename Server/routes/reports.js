const express = require('express');
const router = express.Router();
const Purchase = require('../modules/Purchase');
const Sale = require('../modules/Sale');


router.get('/cogs-fifo', async (req, res) => {
  try {
    // الحصول على جميع المشتريات مراتبها زمنيًا
    const purchases = await Purchase.find().sort({ date: 1 });

    // الحصول على جميع المبيعات مراتبها زمنيًا
    const sales = await Sale.find().sort({ date: 1 });
    
    let cogs = 0;
    let purchaseIndex = 0;
    let remainingSales = 0;

    for (let sale of sales) {
      let quantityToFulfill = sale.quantity;

      while (quantityToFulfill > 0 && purchaseIndex < purchases.length) {
        let purchase = purchases[purchaseIndex];
        let availableQuantity = purchase.quantity;

        if (availableQuantity === 0) {
          purchaseIndex++;
          continue;
        }

        let quantityUsed = Math.min(quantityToFulfill, availableQuantity);
        cogs += quantityUsed * purchase.price;

        // تحديث كمية الشراء
        purchase.quantity -= quantityUsed;
        quantityToFulfill -= quantityUsed;

        if (purchase.quantity === 0) {
          purchaseIndex++;
        }
      }
      // لمعالجة الحالات التي لا تكون فيها كمية الشراء كافية
      if (quantityToFulfill > 0) {
        return res.status(400).json({ error: 'لا يوجد مخزون كافٍ لتلبية المبيعات.' });
      }
    }

    res.json({ COGS: cogs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;