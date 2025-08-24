import express from "express";
import Product from "../models/Product.js";
import multer from "multer";
import path from 'path'

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        // find products
        const products = await Product.find()
        res.json(products)
    } catch (error) {
        res.status(500).json({
            message: "error"
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        // find product by id
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({
                message: "not found"
            })
        }
        res.json(product)
    } catch (error) {
        res.status(500).json({
            message: "error"
        })
    }
})

export default router