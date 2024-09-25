const e = require("express");
const app = e();

const Product = require("./module/Products");
const conectingToDb = require("./config/connectToDb");

if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

conectingToDb();

// gets
app.use(e.json());

app.get("/product", async (req, res) => {
  const Products = await Product.find();
  res.json({ Products: Products });
  
});



app.listen(process.env.PORT);


