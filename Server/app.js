const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connectToDb = require("./config/connectToDb");
const cors = require("cors");

// استيراد ملفات النماذج المختلفة
require('dotenv').config();

connectToDb();

// استخدام middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// استيراد المسارات
const productsRouter = require("./routes/products");
const purchasesRouter = require("./routes/purchases");
const salesRouter = require("./routes/sales");
const reportsRouter = require("./routes/reports");
const inventoryRouter = require("./routes/inventory");
const inventoryCountRouter = require("./routes/inventoryCount");
const grossProfitRouter = require("./routes/grossProfit");

// ربط المسارات
app.use("/products", productsRouter);
app.use("/purchases", purchasesRouter);
app.use("/sales", salesRouter);
app.use("/reports", reportsRouter);
app.use("/inventory", inventoryRouter);
app.use("/inventoryCount", inventoryCountRouter);
app.use("/grossProfit", grossProfitRouter);


// تشغيل الخادم
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});