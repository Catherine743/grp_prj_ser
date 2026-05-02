const users = require('../model/userModel')
const jwt = require('jsonwebtoken')

// register
exports.registerController = async (req, res) => {
    console.log("Inside user register controller");
    const { username, email, password } = req.body
    // console.log(username, email, password);
    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            res.status(402).json("User already exists")
        }
        else {
            const newUser = await users.create({
                username, email, password
            })
            res.status(200).json(newUser)
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

// login
exports.loginController = async (req, res) => {
    console.log("Inside user login controller");
    const { email, password } = req.body
    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            if (password == existingUser.password) {
                const token = jwt.sign({ userMail: existingUser.email, role: existingUser.role }, process.env.jwtSecret)
                res.status(200).json({ user: existingUser, token })
            }
            else{
                res.status(401).json("Incorrect Email/Password")
            }
        }
        else{
            res.status(404).json("Account does not exist")
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

// googleLoginController
exports.googleLoginController = async (req, res) => {
    console.log("Inside user google login controller");
    const { email, password, username, image } = req.body
    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            // login
            const token = jwt.sign({ userMail: existingUser.email, role: existingUser.role }, process.env.jwtSecret);
            res.status(200).json({ user: existingUser, token })
        }
        else {
            // register
            const newUser = await users.create({
                username, email, password, image
            })
            const token = jwt.sign({ userMail: newUser.email, role: newUser.role }, process.env.jwtSecret);
            res.status(200).json({ user: newUser, token })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}