const Notification = require('../model/notificationModel')
const users = require('../model/userModel')

// GET
exports.getNotifications = async (req, res) => {

    try {

        const data = await Notification.find({
            userId: req.payload
        }).sort({ createdAt: -1 })

        res.status(200).json(data)

    } catch (err) {

        res.status(500).json(err)

    }
}

// MARK READ
exports.markAsRead = async (req, res) => {
    await Notification.findByIdAndUpdate(req.params.id, { read: true })
    res.status(200).json("Updated")
}

// DELETE ONE
exports.deleteNotification = async (req, res) => {
    await Notification.findByIdAndDelete(req.params.id)
    res.status(200).json("Deleted")
}

// CLEAR ALL
exports.clearAll = async (req, res) => {
    await Notification.deleteMany({ userId: req.payload })
    res.status(200).json("Cleared")
}