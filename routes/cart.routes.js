const express = require("express");
const {addItemsToCart, updateQuantity, deleteProduct, getUserCart,
    mergeGuestCartWithUserCart
} = require("../controllers/cart.controller")
const {verifyUserToken} = require("../middlewares/authMiddleware")

const router = express.Router();

// @route POST /api/cart
// @desc Add a product to cart for logged in user or guest
// @access Public
router.post("/", addItemsToCart)

// @route PATCH /api/cart
// @desc Update product quantity in the cart
// @access Public
router.patch("/", updateQuantity)

// @route DELETE /api/cart
// @desc Remove a product from the cart
// @access Public
router.delete("/", deleteProduct)

// @route GET /api/cart
// @desc Get cart of logged-in or guest user
// @access Public
router.get("/",getUserCart)

// @route POST /api/cart/merge
// @desc Merge guest cart with user cart at login
// @access Private
router.post("/merge", verifyUserToken, mergeGuestCartWithUserCart)

module.exports = router;