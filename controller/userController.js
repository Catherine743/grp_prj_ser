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

        const email = req.payload;

        const user = await users.findOne({ email }).lean();

        if (!user) {
            return res.status(404).json("User not found");
        }

        // IMAGE URL FIX
        if (user.image) {

            user.image =
                `http://localhost:4000/uploads/${user.image}`;
        }

        res.status(200).json(user);

    } catch (err) {

        res.status(500).json(err);
    }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
    try {
        const { id } = req.params; // user id from admin panel

        const imageFile = req.file ? req.file.filename : null;

        const user = await users.findById(id);

        if (!user) {
            return res.status(404).json("User not found");
        }

        const updateData = {
            username: req.body.username,
            email: req.body.email,
            bio: req.body.bio,
            location: req.body.location,
            role: req.body.role, // admin can change role
        };

        if (imageFile) {
            updateData.image = imageFile;
        }

        const updatedUser = await users.findByIdAndUpdate(
            id,
            updateData,
            { new: true, returnDocument: "after" }
        ).lean();

        if (updatedUser.image) {
            updatedUser.image = `http://localhost:4000/uploads/${updatedUser.image}`;
        }

        res.status(200).json(updatedUser);

    } catch (err) {
        res.status(500).json(err);
    }
};

exports.userUpdateProfile = async (req, res) => {
    try {
        const userEmail = req.payload; // from JWT

        const imageFile = req.file ? req.file.filename : null;

        const user = await users.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json("User not found");
        }

        // OWNER CHECK (extra safety like your delete logic)
        if (user.email !== userEmail) {
            return res.status(403).json("Unauthorized");
        }

        const updateData = {
            username: req.body.username,
            email: req.body.email,
            bio: req.body.bio,
            location: req.body.location,
        };

        if (imageFile) {
            updateData.image = imageFile;
        }

        const updatedUser = await users.findOneAndUpdate(
            { email: userEmail },
            updateData,
            { new: true, returnDocument: "after" }
        ).lean();

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