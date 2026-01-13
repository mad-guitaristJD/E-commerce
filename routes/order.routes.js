const express = require("express");
const {verifyUserToken} = require("../middlewares/authMiddleware")
const {getMyOrders, getOrdersById} = require("../controllers/orders.controller")
const router = express.Router();

// @route GET /api/orders/my-orders
// @desc Get logged-in user's orders
// @access Private
router.get("/my-orders", verifyUserToken, getMyOrders);

// @route GET /api/orders/:id
// @desc Get order details by id
// @access Private
router.get("/:id", verifyUserToken, getOrdersById)

module.exports = router;