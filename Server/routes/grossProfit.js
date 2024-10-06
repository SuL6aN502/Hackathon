const e = require("express");
const router = e.Router();
const Purchase = require("../modules/Purchase");
const Sale = require("../modules/Sale");

router.get("/", async (req, res) => {
  try {
    // استرجاع جميع الشراءات مع حقل السعر والكمية فقط
    const purchases = await Purchase.find({}).select("price quantity");
    // استرجاع جميع المبيعات مع حقل السعر والكمية فقط
    const sales = await Sale.find({}).select("price quantity");

    // حساب المجموع الكلي للشراءات
    const totalPurchases = purchases.reduce((acc, purchase) => {
      const price = Number(purchase.price); // تحويل السعر إلى رقم
      const quantity = Number(purchase.quantity); // تحويل الكمية إلى رقم

      // التحقق من أن السعر والكمية أرقام صالحة
      if (!isNaN(price) && !isNaN(quantity)) {
        return acc + price * quantity;
      }
      return acc; // إذا كانت القيم غير صالحة، نعيد القيمة الحالية
    }, 0);

    // حساب المجموع الكلي للمبيعات
    const totalSales = sales.reduce((acc, sale) => {
      const price = Number(sale.price); // تحويل السعر إلى رقم
      const quantity = Number(sale.quantity); // تحويل الكمية إلى رقم

      // التحقق من أن السعر والكمية أرقام صالحة
      if (!isNaN(price) && !isNaN(quantity)) {
        return acc + price * quantity;
      }
      return acc; // إذا كانت القيم غير صالحة، نعيد القيمة الحالية
    }, 0);

    // حساب الفرق بين المشتريات والمبيعات
    const difference = totalSales -  totalPurchases ;

    console.log({ totalPurchases, totalSales, difference });

    // إرسال الاستجابة
    res.json({
      totalPurchases: totalPurchases,
      totalSales: totalSales,
      difference: difference,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
