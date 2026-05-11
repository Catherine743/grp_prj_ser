const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: "smartTracker-user"
    },
    image: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
})

const users = mongoose.model('users', userSchema)
module.exports = users