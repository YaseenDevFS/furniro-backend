import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }, // صورة واحدة
    category: {
        type: String,
        enum: ["electronics", "clothes", "books", "other"], // استبدل بالقيم اللي انت عايزها
        required: true
    },
    rate: {
        type: String,
        enum: ["1", "2", "3", "4", "5"], // أو أي قيم تقييم انت عايزها
        required: true
    }
});

const Product = mongoose.model("Product", productSchema);
export default Product;