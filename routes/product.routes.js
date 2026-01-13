const express = require("express");
const {verifyUserToken, admin} = require("../middlewares/authMiddleware")
const {createNewProduct, updateProduct, deleteProduct, getAllProducts, getProductById, getSimilarProductById, bestSellerProduct, newArrivalsProducts} = require("../controllers/product.controller")

const router = new express.Router();

// @route POST /api/products
// @desc Create a new Product
// @access Private/Admin
router.post("/", verifyUserToken, admin, createNewProduct)

// @route GET /api/products/best-seller
// @desc Retreive the product with the highest rating
// @access Public
router.get("/best-seller", bestSellerProduct)

// @route GET /api/products/new-arrivals
// @desc Retreive the newly added products
// @access Public
router.get("/new-arrivals", newArrivalsProducts)

// @route PATCH /api/products/:id
// @desc Update an exisiting product ID
// @access Private/Admin
router.patch("/:id",verifyUserToken,admin, updateProduct)

// @route DELETE /api/products/:id
// @desc Delete an existing product
// @access Private/Admin
router.delete("/:id", verifyUserToken, admin, deleteProduct)

// @route GET /api/products
// @desc Get all products with optional query filter
// @access Public
router.get("/", getAllProducts)

// @route GET /api/products/:id
// @desc get a single product by id
// @access Public
router.get("/:id", getProductById)

// @route GET /api/similar/:id
// @desc retreive all the similar products
// @access Public
router.get("/similar/:id", getSimilarProductById)


module.exports = router;