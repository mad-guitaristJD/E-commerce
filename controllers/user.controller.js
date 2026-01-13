const User = require("../models/user.model")
const jwt = require("jsonwebtoken");

const generateAccessToken = async function(user){
    const payload = { user: {id:user._id, role:user.role,} };
    const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: "10h"})
    return token;
}

const registerUser = async function(req, res){
    const {name, email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if(user) return res.status(400).json({message: "user already exists"});
        user = new User({name, email, password});
        await user.save()
        let token = await generateAccessToken(user);
        res.status(201)
        .json({
            user:{
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }, token
        })
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error")
    }
}

const loginUser = async function (req,res) {
    const {email, password} = req.body;
    try {
        let user = await User.findOne({email})
        if(!user) return res.status(400).json({message:"Invalid credentials"});
        const isMatch = await user.matchPassword(password);
        if(!isMatch) return res.status(400).json({message:"Invalid credentials"});
        let token = await generateAccessToken(user);
        res
        .json({
            user:{
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }, token
        })
    } catch (error) {
        console.log(error)
        res.status(500).send("Servor Error")
    }
}



module.exports = {
    registerUser,
    loginUser
}