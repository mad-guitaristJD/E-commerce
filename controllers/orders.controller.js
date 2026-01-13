const Order = require("../models/order.model")


const getMyOrders = async function (req, res) {
    try {
        const orders = await Order.find({userId : req.user._id}).sort({createdAt:-1})
        res.status(200).json(orders);
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server Error"})
    }
}

const getOrdersById = async function (req, res) {
    try {
        const order = await Order.findById(req.params.id).populate("userId", "name email");
        if(!order) return res.status(404).json({message:"Order not found"});
        return res.status(200).json(order);
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server Error"})
    }
}

module.exports = {
    getMyOrders,
    getOrdersById
}