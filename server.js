const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db")
const userRouter = require("./routes/user.routes")
const productRouter = require("./routes/product.routes")
const cartRouter = require("./routes/cart.routes")
const checkoutRouter = require("./routes/checkout.routes")
const orderRouter = require("./routes/order.routes")
const uploadRouter = require("./routes/upload.routes")

// Connect to Database
connectDB()

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const PORT = process.env.PORT ||  3000;

app.get("/", (req, res)=>{
    res.send("hello world")
})

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/orders", orderRouter);
app.use("/api/upload", uploadRouter);

app.listen(PORT, () => {
    console.log(`Server started to listen on port: ${PORT}`);
})
