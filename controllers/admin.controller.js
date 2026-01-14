const User = require("../models/user.model")
const Product = require("../models/product.model")
const Order = require("../models/order.model")

const getAllUsers = async function (req, res) {
    try {
        const users = await User.find({});
        if(!users) return res.status(404).json({message:"No user found"})
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server Error"})
    }
}

const createNewUser = async function (req, res) {
    try {
        const {name, email, password, role} = req.body
        let user = await User.findOne({email});
        if(user) return res.status(400).json({message:"User with the email already exists"});
        user = new User({
            name, email, password, role: role || "customer"
        })
        await user.save();
        return res.status(201).json(user)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server Error"})
    }
}

const updateUser = async function (req, res) {
    try {
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json({message:"Server Error"});
        user.name = req.body.name || user.name;
        user.role = req.body.role || user.role;
        user.email = req.body.email || user.email;
        const updatedUser = await user.save();
        return res.status(200).json({user:updatedUser});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server Error"})
    }
}

const deleteUser = async function (req, res) {
    try {
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json({message:"Server Error"});
        await User.deleteOne();
        res.status(200).json({message:"User deleted successfully"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server Error"})
    }
}

const getAllProducts = async function (req, res) {
    try {
        const products = await Product.find({});
        if(!products) return res.status(404).json({message:"No products found"})
        res.status(200).json(products)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server Error"})
    }
}

const getAllOrders = async function (req, res) {
    try {
        const orders = await Order.find({});
        if(!orders) return res.status(404).json({message:"No orders found"})
        res.status(200).json(orders)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server Error"})
    }
}

const updateOrderStatus = async function (req, res) {
    try {
        const order = await Order.findById(req.params.id);
        if(!order) return res.status(404).json({message:"Order ID not valid"});
        order.status = req.body.status || order.status;
        order.isDelivered = req.body.status === "Delivered" ? true : order.isDelivered;
        order.deliveredAt = req.body.status === "Delivered" ? Date.now() : order.deliveredAt;
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server Error"})
    }
}

const deleteOrder = async function (req, res) {
    try {
        const order = await Order.findById(req.params.id);
        if(!order) return res.status(404).json({message:"Order ID not valid"});
        await order.deleteOne();
        res.status(200).json({message:"Order has been deleted"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server Error"})
    }
}

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    getAllProducts,
    getAllOrders,
    updateOrderStatus,
    deleteOrder
}