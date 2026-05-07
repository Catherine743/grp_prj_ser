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
            else {
                res.status(401).json("Incorrect Email/Password")
            }
        }
        else {
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

// GET PROFILE
exports.getProfile = async (req, res) => {
    try {
        const email = req.payload

        const user = await users.findOne({ email })

        res.status(200).json(user)

    } catch (err) {
        res.status(500).json(err)
    }
}

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
    try {
        const userMail = req.payload;

        const imageFile = req.file ? req.file.filename : null;

        const updateData = {
            ...req.body,
        };

        if (imageFile) {
            updateData.image = imageFile;
        }

        const updatedUser = await users.findOneAndUpdate(
            { email: userMail },
            updateData,
            {
                new: true,
                returnDocument: "after"
            }
        ).lean();

        // convert to full URL
        if (updatedUser.image) {
            updatedUser.image = `http://localhost:4000/uploads/${updatedUser.image}`;
        }

        res.status(200).json(updatedUser);

    } catch (err) {
        res.status(500).json(err);
    }
};

// GET ALL USERS (ADMIN)
exports.getAllUsers = async (req, res) => {
    try {
        const data = await users.find({ role: "user" });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
};