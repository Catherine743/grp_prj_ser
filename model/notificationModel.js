const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    type: String,
    message: String,

    // NEW: clearly separate admin/user
    recipientType: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model("notifications", notificationSchema)