const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()
const Product = require("./models/product.model")
const User = require("./models/user.model")
const Cart = require("./models/cart.model")
const Checkout = require("./models/checkout.model")
const Order = require("./models/order.model")
const products = require("./data/products")

mongoose.connect(process.env.DATABASE_URI)

const seedData = async () => {
    try {
        // Delete existing Products and Users data
        await Product.deleteMany()
        await User.deleteMany()
        await Cart.deleteMany();
        await Checkout.deleteMany();
        await Order.deleteMany();
        // Create a default Admin User
        const createdAdmin = await User.create({
            name: "admin",
            email:"admin@gmail.com",
            password:"123123123",
            role:"admin"
        })
        
        // Assigning default user._id to each product
        const userId = createdAdmin._id;

        const sampleProducts = products.map((product) =>{
            return {...product, user: userId};
        })

        // Insert products in database
        await Product.insertMany(sampleProducts);
        
        console.log("Seeded Succesfully")
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

seedData();