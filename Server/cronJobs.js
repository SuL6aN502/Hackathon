
const cron = require('node-cron');
const Purchase = require('./modules/Purchase');
const Sale = require('./modules/Sale');
const Inventory = require('./modules/Inventory');
const Product = require('./modules/Product');

function calculateCOGS() {
  // اجمع تكلفة المشتريات
  Purchase.aggregate([
    {
      $group: {
        _id: null,
        totalPurchases: { $sum: { $multiply: ['$quantity', '$price'] } },
      },
    },
  ]).then(purchaseResult => {
    const totalPurchases = purchaseResult[0]?.totalPurchases || 0;

    // اجمع تكلفة المبيعات
    Sale.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: { $multiply: ['$quantity', '$price'] } },
        },
      },
    ]).then(saleResult => {
      const totalSales = saleResult[0]?.totalSales || 0;

      // حساب COGS
      const cogs = totalPurchases - totalSales;

      // الحصول على المخزون الحالي
      Product.find().then(products => {
        const totalStock = products.reduce((acc, product) => acc + product.Stock, 0);

        // إنشاء سجل الجرد
        Inventory.create({
          date: new Date(),
          openingStock: totalStock + totalSales - totalPurchases, // تقريبًا
          purchases: totalPurchases,
          sales: totalSales,
          closingStock: totalStock,
          cogs: cogs,
        }).then(() => {
          console.log('COGS calculated and inventory updated successfully.');
        }).catch(err => {
          console.error('Error creating inventory record:', err);
        });
      }).catch(err => {
        console.error('Error fetching products:', err);
      });
    }).catch(err => {
      console.error('Error aggregating sales:', err);
    });
  }).catch(err => {
    console.error('Error aggregating purchases:', err);
  });
}

// جدولة المهمة لتشغيلها يوميًا في منتصف الليل
cron.schedule('0 0 * * *', () => {
  console.log('Running COGS calculation job...');
  calculateCOGS();
});