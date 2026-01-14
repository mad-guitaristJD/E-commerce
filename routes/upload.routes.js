const {verifyUserToken} = require("../middlewares/authMiddleware")
const express = require("express");
const streamifier = require("streamifier")
const multer = require("multer")
const cloudinary = require("cloudinary").v2
require("dotenv").config();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({storage});

const router = express.Router();

router.post("/",verifyUserToken, upload.single("image"), async(req, res)=>{
    try {
        if(!req.file) return res.status(400).json({message:"No file uploaded"});
        
        // Function to handle the stream upload on cloudinary
        const streamUpload = (fileBuffer) =>{
            return new Promise((resolve, reject)=>{
                const stream = cloudinary.uploader.upload_stream((error, result)=>{
                    if(result) resolve(result);
                    else reject(error)
                })
                streamifier.createReadStream(fileBuffer).pipe(stream)
            })
        }
        
        // Stream upload function
        const result = await streamUpload(req.file.buffer)

        res.json({imageUrl: result.secure_url})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server Error"})
    }
})

module.exports = router