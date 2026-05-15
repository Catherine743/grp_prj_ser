const users = require('../model/userModel')
const jwt = require('jsonwebtoken')

// REGISTER
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

// LOGIN
exports.loginController = async (req, res) => {
    console.log("Inside user login controller");
    const { email, password } = req.body
    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            if (password == existingUser.password) {
                const token = jwt.sign({ userId: existingUser._id, userMail: existingUser.email, role: existingUser.role }, process.env.jwtSecret)
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

// GOOGLE LOGIN
exports.googleLoginController = async (req, res) => {
    console.log("Inside user google login controller");
    const { email, password, username, image } = req.body
    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            // login
            const token = jwt.sign({ userId: existingUser._id, userMail: existingUser.email, role: existingUser.role }, process.env.jwtSecret);
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

// GET PROFILE (USER)
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
                `${server_url}/uploads/${user.image}`;
        }

        res.status(200).json(user);

    } catch (err) {

        res.status(500).json(err);
    }
};

// UPDATE PROFILE (USER)
exports.userUpdateProfile = async (req, res) => {
    try {
        const userEmail = req.payload;

        const imageFile = req.file ? req.file.filename : null;

        const user = await users.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json("User not found");
        }

        if (user.email !== userEmail) {
            return res.status(403).json("Unauthorized");
        }

        const updateData = {
            username: req.body.username,
            email: req.body.email,
            phoneNo: req.body.phoneNo,
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
            updatedUser.image = `${server_url}/uploads/${updatedUser.image}`;
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

// UPDATE PROFILE (ADMIN)
exports.updateProfile = async (req, res) => {

    try {

        const userMail = req.payload

        const {
            username,
            email,
            phoneNo,
            bio,
            location
        } = req.body

        // IMAGE
        let image = ""

        if (req.file) {
            image = req.file.filename
        }

        // FIND USER
        const existingUser = await users.findOne({
            email: userMail
        })

        // KEEP OLD IMAGE IF NO NEW IMAGE
        if (!image) {
            image = existingUser.image
        }

        // UPDATE
        const updatedUser = await users.findOneAndUpdate(

            { email: userMail },

            {
                username,
                email,
                phoneNo,
                bio,
                location,
                image
            },

            { new: true }

        )

        res.status(200).json(updatedUser)

    }

    catch (err) {

        console.log(err)

        res.status(500).json(err)

    }
}