const User = require("../models/user.model")
const Cart = require("../models/cart.model")
const Product = require("../models/product.model")

const getCartById = async function (userId, guestId) {
    try {
        if(userId) return await Cart.findOne({userId: userId});
        else if(guestId) return await Cart.findOne({guestId});
        return null;
    } catch (error) {
        console.log(error);
    }
}

const addItemsToCart = async function (req, res) {
    try {
        const {productId, quantity, size, color, guestId, userId} = req.body;
        const product = await Product.findById(productId)
        if(!product) return res.status(404).json({message:"Product not found"});
    
        // User or Guest
        let cart = await getCartById(userId, guestId)
    
        // If the cart exists, update it
        if(cart){
            const productIndex = cart.products.findIndex((p) =>
                                    p.productId.toString() === productId &&
                                    p.size === size &&
                                    p.color === color
                                )
    
            if(productIndex > -1){
                // Update the quantity of the existing product in cart
                cart.products[productIndex].quantity += quantity
            }else{
                // Add the new product
                cart.products.push({
                    productId, name:product.name, image: product.images[0].url, price:product.price, size, color, quantity
                })
            }
    
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save()
            return res.status(200).json(cart);
    
        }else{
            // Creating a new cart for the user
            const newCart = await Cart.create({
                userId: userId ?  userId : undefined,
                guestId: guestId ? guestId : "guest_" + new Date().getTime(),
                products: [
                    {
                        productId, name: product.name, image: product.images[0].url, price: product.price, size, color, quantity
                    }
                ],
                totalPrice: product.price * quantity
            })
            return res.status(201).json(newCart);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Server Error"})
    }
}

const updateQuantity = async function(req, res){
    try {
        const {productId, size, color, quantity, userId, guestId} = req.body;
        let cart = await getCartById(userId, guestId);
        if(!cart) return res.status(404).json({message:"Cart not found"});
        const productIndex = cart.products.findIndex((p)=>p.productId.toString() === productId && p.size === size && p.color === color);
        if(productIndex > -1){
            if(quantity > 0) cart.products[productIndex].quantity = quantity;
            else cart.products.splice(productIndex,1); // Remove the product if quantity becomes 0
            cart.totalPrice = cart.products.reduce((acc, item)=> acc + item.price * item.quantity, 0);
            await cart.save();
            return res.status(200).json(cart);
        }else{
            return res.status(404).json({message:"Product not found in cart"});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server Error"});
    }
}

const deleteProduct = async function (req, res) {
    try {
        const {productId, size, color, userId, guestId} = req.body;
        let cart = await getCartById(userId, guestId);
        if(!cart) return res.status(404).json({message:"Cart not found"});
        const productIndex = cart.products.findIndex((p)=>p.productId.toString() === productId && p.size === size && p.color === color);
        if(productIndex > -1){
            cart.products.splice(productIndex,1);
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.quantity * item.price, 0)
            await cart.save()
            return res.status(200).json(cart)
        }else return res.status(404).json({message:"Product not found in cart"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Server Error"})
    }
}

const getUserCart = async function (req, res) {
    try {
        const {userId, guestId} = req.query;
        const cart = await getCartById(userId, guestId);
        if(!cart) return res.status(404).json({message:"Cart not found"});
        return res.status(200).json(cart)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Server Error"})
    }
}

const mergeGuestCartWithUserCart = async function (req, res) {
    try {
        const {guestId} = req.body
        const guestCart = await Cart.findOne({guestId})
        const userCart = await Cart.findOne({userId: req.user._id})
        if(guestCart){
            if(guestCart.products.length === 0) return res.status(404).json({message:"Guest cart is empty"});
            if(userCart){
                // Merge both the carts
                guestCart.products.forEach((guestItem)=>{
                    let productIndex = userCart.products.findIndex((item)=> item.productId.toString() === guestItem.productId.toString() &&
                                                                      item.size === guestItem.size && item.color === guestItem.color);
                    if(productIndex > -1){
                        // If the item exists in user cart, update the quantity
                        userCart.products[productIndex].quantity += guestItem.quantity;
                    }else userCart.products.push(guestItem); // If the item doesn't exist in user cart push from guest cart
                })
                userCart.totalPrice = userCart.products.reduce((acc, item)=>acc+item.quantity * item.price, 0);
                await userCart.save()
                try {
                    await Cart.findOneAndDelete({guestId});
                } catch (error) {
                    console.error("Error deleting guest cart", error)
                }
                return res.status(200).json(userCart);
            }else{
                // If the user cart doesn't exist, assign the guest cart to the user
                guestCart.userId = req.user._id;
                guestCart.guestId = undefined;
                await guestCart.save()
                return res.status(200).json(guestCart)
            }
        }else{
            if(userCart){
                return res.status(200).json(userCart)
            }else return res.status(404).json({message:"No cart exists"})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Server Error"})
    }
}

module.exports = {
    addItemsToCart,
    updateQuantity,
    deleteProduct,
    getUserCart,
    mergeGuestCartWithUserCart
}