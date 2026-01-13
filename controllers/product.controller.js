const Product = require("../models/product.model")

const createNewProduct = async function(req, res){
    try {
        const {name, description, price, discountPrice, countInStock, category, brand, sizes, colors, collections,material, gender,images, isFeatured, isPublished, tags, dimensions, weight, sku } = req.body;
        const product = new Product({
            name, description, price, discountPrice, countInStock, category, brand, sizes, colors, collections,material, gender,images, isFeatured, isPublished, tags, dimensions, weight, sku , user:req.user._id
        })
        const createdProduct = await product.save();
        res.status(201)
        .json(createdProduct)
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error")
    }
}

const updateProduct = async function(req,res) {
    try {
        const {name, description, price, discountPrice, countInStock, category, brand, sizes, colors, collections,material, gender,images, isFeatured, isPublished, tags, dimensions, weight, sku } = req.body;
        const product = await Product.findById(req.params.id);
        if(product){
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.discountPrice = discountPrice || product.discountPrice;
            product.countInStock = countInStock || product.countInStock;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.sizes = sizes || product.sizes;
            product.colors = colors || product.colors;
            product.collections = collections || product.collections;
            product.material = material || product.material;
            product.gender = gender || product.gender;
            product.images = images || product.images;
            product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
            product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
            product.tags = tags || product.tags;
            product.dimensions = dimensions || product.dimensions;
            product.weight = weight || product.weight;
            product.sku = sku || productweightsku
            const updatedProduct = await product.save();
            res.json(updatedProduct)
        }
        else{
            res.status(404).json({message:"Product not found"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Server Error"})
    }
    
}

// Try and see Product.findByIdAndDelete
const deleteProduct = async function (req, res) {
    try {
        const product = await Product.findById(req.params.id)
        if(product){
            await product.deleteOne();
            res.json({message:"Deleted product succesfully"})
        }
        else{
            res.status(404).json({message:"Product not found"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Server Error"})
    }
}

const getAllProducts = async function (req, res) {
    try {
        const {collections, size, color, gender, minPrice, maxPrice, sortBy, search, category, material, brand, limit} = req.query
        let query = {};
        if(collections && collections.toLocaleLowerCase() !== "all")query.collections = collections
        if(category && category.toLocaleLowerCase() !== "all")query.category = category
        if(material) query.material = {$in:material.split(',')}
        if(brand) query.brand = {$in:brand.split(',')}
        if(size) query.size = {$in:size.split(',')}
        if(color) query.color = {$in:[color]}
        if(gender) query.gender = gender
        if(minPrice || maxPrice){
            query.price = {}
            if(minPrice) query.price.$gte = Number(minPrice)
            if(maxPrice) query.price.$lte = Number(maxPrice)
        };
        if(search){
            query.$or = [
                {name: {$regex: search, options: "i"}},
                {description: {$regex: search, options: "i"}}
            ]
        }
        let sort = {}
        if(sortBy){
            switch(sortBy){
                case "priceAsc":
                    sort = {price:1}
                    break;
                case "priceDesc":
                    sort = {price:-1}
                    break;
                case "popularity":
                    sort = {rating: -1};
                    break;
                default:
                    break;
            }
        }
        let products = await Product.find(query).sort(sort).limit(Number(limit) || 0);
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Server Error"})
    }
}

const getProductById = async function (req, res) {
    try {
        const product = await Product.findById(req.params.id);
        if(product){
            res.json(product)
        }else{
            res.staus(404).json({message:"Product Not Found"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Server Error"})
    }
}

const getSimilarProductById = async function (req, res) {
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        if(!product){
            res.status(404).json({message: "Product Not Found"})
        }
        const similarProducts = await Product.find({
            _id: {$ne: id},
            gender: product.gender,
            category: product.category,
        }).limit(4)
        res.json(similarProducts)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Server Error"})
    }
}

const bestSellerProduct = async function (req, res) {
    try {
        const bestSeller = await Product.findOne().sort({rating:-1});
        if(bestSeller) res.json(bestSeller);
        else res.status(404).json({message: "Best seller not found"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Server Error"})
    }
}

const newArrivalsProducts = async function (req, res) {
    try {
        const newArrivals = await Product.find().sort({createdAt: -1}).limit(8)
        if(!newArrivals) res.status(404).json({message:"No products found"});
        res.json(newArrivals);
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Server Error"})
    }
}

module.exports = {
    createNewProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    getSimilarProductById,
    bestSellerProduct,
    newArrivalsProducts
}