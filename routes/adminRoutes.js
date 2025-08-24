import express from "express";
import Product from "../models/Product.js";
import multer from "multer";
import path from 'path'

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage
})

router.post('/products', upload.single('image'), async (req, res) => {
    try {
        const { title, description, price, category, rate } = req.body;

        if (!title || !description || !price || !category || !rate) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }
        const product = new Product({
            title,
            description,
            price,
            category,
            rate,
            image: req.file.path// أو req.file.path لو عايز صورة واحدة
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error(error);  // هتشوف التفاصيل في console السيرفر
        res.status(500).json({ message: error.message });
    }
});

export default router;