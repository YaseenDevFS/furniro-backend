import express from "express";
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
const router = express.Router();

router.post('/register', async (req, res) => {
    // get name, email, password
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "all fields are required"
        })
    }
    // hash password
    const hashed = await bcrypt.hash(password, 10)

    // if user exist
    const exist = await User.findOne({ email })
    if (exist) {
        return res.status(400).json({
            message: "user already exist"
        })
    }


    // create user
    const user = await User.create({
        name,
        email,
        password: hashed
    })
    res.status(200).json(user)
})
router.post('/login', async (req, res) => {
    try {
        // email password from body
        const { email, password } = req.body

        // find user
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({
                message: "user not found"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                message: "password incorrect"
            })
        }
        // add token
        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET
        )
        res.json({ token, user })
    } catch (error) {
        return res.status(500).json({
            message: "server error"
        })

    }

})

export default router