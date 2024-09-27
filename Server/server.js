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

// view all Products

app.get("/product", async (req, res) => {
  const Products = await Product.find();
  res.json({ Products: Products });
});

// view One Product

// app.get("/product", async (req, res) => {
//   const Products = await Product.find();
//   res.json({ Products: Products });
// });

// create Product

app.post("/product", (req, res) => {
  const product = Product.create({
    Name: req.body.Name,
    Description: req.body.Description,
    Barcode: req.body.Barcode,
    Price: req.body.Price,
    expirationDate: req.body.expirationDate,
    Stock: req.body.Stock,
    Category: req.body.Category,
    CreatedAt: req.body.CreatedAt,
  });
  res.json({ product: product });
});

app.put("/product/:id", async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findByIdAndUpdate(productId ,
   {
    Name: req.body.Name,
    Description: req.body.Description,
    Barcode: req.body.Barcode,
    Price: req.body.Price,
    expirationDate: req.body.expirationDate,
    Stock: req.body.Stock,
    Category: req.body.Category,
    CreatedAt: req.body.CreatedAt,
  });
  res.json({ product: product });
});

app.delete("/product/:id", async (req, res) => {
  const productId = req.params.id;
  const note = await Product.deleteOne(productId);
  res.json({ success: "its was deleted" });
});



app.listen(process.env.PORT);