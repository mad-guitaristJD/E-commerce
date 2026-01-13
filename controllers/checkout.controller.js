const Product = require("../models/product.model")
const Order = require("../models/order.model")
const Checkout = require("../models/checkout.model")
const Cart = require("../models/cart.model")


const newCheckoutSession = async function (req,res) {
    try {
        const {checkoutItems, shippingAddress, paymentMethod, totalPrice} = req.body
        if(!checkoutItems || checkoutItems.length === 0) return res.status(400).json({message:"No items in the checkout"});
        // Create a new checkout session
        const newCheckout = await Checkout.create({
            userId:req.user._id,
            checkoutItems: checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: "Pending",
            isPaid: false
        });
        console.log(`New checkout session created for user:${req.user._id}`);
        return res.status(201).json(newCheckout);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server Error"})
    }
}

const markPaid = async function (req, res) {
    try {
        const {paymentStatus, paymentDetails} = req.body
        const checkout = await Checkout.findById(req.params.id);
        if(!checkout) return res.status(404).json({message:"Checkout session not found"});
        if(paymentStatus === "paid"){
            checkout.isPaid = true
            checkout.paymentStatus = paymentStatus
            checkout.paymentDetails = paymentDetails
            checkout.paidAt = Date.now()
            await checkout.save()
            return res.status(200).json(checkout)
        }else return res.status(400).json({message:"Invalid payment status"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server Error"})
    }
}

const finalisePayment = async function (req, res) {
    try {
        const checkout = await Checkout.findById(req.params.id);
        if(!checkout) return res.status(404).json({message:"Checkout not found"});
        if(checkout.isPaid && !checkout.isFinalised){
            // Create a final order based on the checkout details
            const finalOrder = await Order.create({
                userId: checkout.userId,
                orderItems: checkout.checkoutItems,
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid : true,
                paidAt : checkout.paidAt,
                isDelivered: false,
                paymentStatus: "paid",
                paymentDetails : checkout.paymentDetails
            });
            
            // Mark the checkout as final
            checkout.isFinalised = true;
            checkout.finalisedAt = Date.now();
            await checkout.save()
            // Delete the cart with the associated userId
            await Cart.findOneAndDelete({userId : checkout.userId})
            return res.status(201).json(finalOrder)
        }else if(checkout.isFinalised) return res.status(400).json({message:"Checkout already finalised"});
        else return res.status(400).json({message:"Checkout is not paid"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server Error"})
    }
}


module.exports = {
    newCheckoutSession,
    markPaid,
    finalisePayment
}