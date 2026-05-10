const Notification = require('../model/notificationModel')
const users = require('../model/userModel')

// GET
exports.getNotifications = async (req, res) => {

    try {

        let query = {
            userId: req.payload.email
        };

        // ADMIN GETS ADMIN ALERTS

        if (req.payload.role === "admin") {

            query = {
                $or: [
                    { userId: "admin" },
                    { userId: req.payload.email }
                ]
            };

        }

        const data = await Notification.find(query)
            .sort({ createdAt: -1 });

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