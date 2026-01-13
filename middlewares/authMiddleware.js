const jwt = require("jsonwebtoken");
const User = require("../models/user.model")

const verifyUserToken = async function (req, res, next) {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = await User.findById(decoded.user.id).select("-password")
            next();
        } catch (error) {
            console.log("Token verification error",error);
            res.status(401).json({message: "Not authorized. Token failed."})
        }
    }else{
        res.status(401).json({message: "Not authorized. No token provided."})
    }
}

const admin = (req,res,next)=>{
    if(req.user && req.user.role==='admin') next();
    else{
        res.status(403).json({message:"Not authorised as admin"})
    }
}

module.exports = {
    verifyUserToken,
    admin
}