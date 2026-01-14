const express = require("express")
const {verifyUserToken, admin} = require("../middlewares/authMiddleware")
const {getAllUsers, createNewUser, updateUser, deleteUser, getAllProducts, getAllOrders, updateOrderStatus, deleteOrder} = require("../controllers/admin.controller");

const router = express.Router()

// @route GET /api/admin/users
// @desc get all users (Admin only)
// @access Private/Admin
router.get("/users", verifyUserToken, admin, getAllUsers);

// @route GET /api/admin/products
// @desc get all the products
// @access Private/Admin
router.get("/products", verifyUserToken, admin, getAllProducts)

// @route GET /api/admin/orders
// @desc get all the orders
// @access Private/Admin
router.get("/orders", verifyUserToken, admin, getAllOrders)

// @route PUT /api/admin/orders/:id
// @desc update status of an order
// @access Private/Admin
router.put("/orders/:id", verifyUserToken, admin, updateOrderStatus)

// @route DELETE /api/admin/orders/:id
// @desc update status of an order
// @access Private/Admin
router.delete("/orders/:id", verifyUserToken, admin, deleteOrder)

// @route POST /api/admin/users
// @desc add a new user (Admin only)
// @access Private/Admin
router.post("/users", verifyUserToken, admin, createNewUser)

// @route PUT /api/admin/users/:id
// @desc update a user info - name, email, role (Admin only)
// @access Private/Admin
router.put("/users/:id", verifyUserToken, admin, updateUser)

// @route DELETE /api/admin/users/:id
// @desc delete a user (Admin only)
// @access Private/Admin
router.delete("/users/:id", verifyUserToken, admin, deleteUser)

module.exports = router