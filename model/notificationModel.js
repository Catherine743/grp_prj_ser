const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    userId: String,
    type: String,
    message: String,
    time: {
        type: Date,
        default: Date.now
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model("notifications", notificationSchema)