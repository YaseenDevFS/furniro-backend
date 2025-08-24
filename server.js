import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import Stripe from 'stripe';
import userRoutes from '../backend/routes/userRoues.js'
import productRoutes from '../backend/routes/productRoutes.js'
import adminRoutes from '../backend/routes/adminRoutes.js'
dotenv.config()

const app = express()
const port = process.env.PORT || 5000
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


// use routes
app.use(cors())
app.use(express.json())

// routes
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/admin', adminRoutes)

app.post("/create-checkout-session", async (req, res) => {
  const { product } = req.body;
  console.log("✅ Product received:", product);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.title,
              images: [`http://localhost:5000/${product.image}`],
            },
            unit_amount: product.price * 1, // <= هنا في احتمال كبير المشكلة
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("❌ Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
});


// uploads
app.use("/uploads", express.static('uploads'))

// connect to mongoDb

mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(port, () => {
        console.log("server is running")
    })
})

