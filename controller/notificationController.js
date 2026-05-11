const Notification = require('../model/notificationModel')
const users = require('../model/userModel')

// GET
exports.getNotifications = async (req, res) => {
    try {

        const userEmail = req.payload;
        const role = req.role;

        let query = {};

        if (role === "admin") {

            // ADMIN: get all admin + system alerts
            query = {
                recipientType: "admin"
            };

        } else {

            // USER: get ALL user notifications (safe fallback)
            const user = await users.findOne({ email: userEmail });

            query = {
                userId: user._id.toString(),
                recipientType: "user"
            };

        }

        const data = await Notification.find(query)
            .sort({ createdAt: -1 });

        res.status(200).json(data);

    } catch (err) {
        res.status(500).json(err);
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
    await Notification.deleteMany({
        userId: req.payload,
        recipientType: "user"
    });
    res.status(200).json("Cleared")
}

// GET ADMIN NOTIFICATIONS
exports.getAdminNotifications = async (req, res) => {
    try {
        const data = await Notification.find({
            recipientType: "admin"
        }).sort({ createdAt: -1 });

        res.status(200).json(data);

    } catch (err) {
        res.status(500).json(err);
    }
};

exports.clearAdminNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({
            recipientType: "admin"
        });

        res.status(200).json("Admin notifications cleared");

    } catch (err) {
        res.status(500).json(err);
    }
};

// MARK ADMIN NOTIFICATION AS READ
exports.markAdminAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, {
            read: true
        });

        res.status(200).json("Marked as read");
    } catch (err) {
        res.status(500).json(err);
    }
};

// DELETE SINGLE ADMIN NOTIFICATION
exports.deleteAdminNotification = async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.status(200).json("Deleted");
    } catch (err) {
        res.status(500).json(err);
    }
};