const express = require("express");
const {verifyUserToken} = require("../middlewares/authMiddleware");
const {newCheckoutSession, markPaid, finalisePayment} = require("../controllers/checkout.controller")

const router = express.Router();

// @route POST /api/checkout
// @desc Create a new checkout session
// @access Private
router.post("/",verifyUserToken, newCheckoutSession)

// @route PUT /api/checkout/:id/pay
// @desc Update checkout to mark as paid after successful payment
// @access Private
router.put("/:id/pay", verifyUserToken, markPaid)

// @route POST /api/checkout/:id/finalise
// @desc Finalise checkout and convert to an order after payment confirmation
// @access Private
router.post("/:id/finalise", verifyUserToken, finalisePayment)

module.exports = router