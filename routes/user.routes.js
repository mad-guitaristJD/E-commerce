const express = require("express");
const {registerUser, loginUser} = require("../controllers/user.controller")
const {verifyUserToken} = require("../middlewares/authMiddleware")


const router = express.Router();

// @route POST /api/users/register
// @desc Register a new user
// @access Public
router.post("/register", registerUser);

// @route POST /api/users/login
// @desc login an existing user
// @access Public
router.post("/login", loginUser)

// @route GET /api/users/profile
// @desc get logged in user's profile
// @access Private
router.get("/profile", verifyUserToken,(req,res)=>{
    res.json(req.user);
} )

module.exports = router;
