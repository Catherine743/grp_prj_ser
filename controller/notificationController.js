const Notification = require('../model/notificationModel')
const users = require('../model/userModel')

// GET NOTIFICATIONS (USER)
exports.getNotifications = async (req, res) => {
    try {

        const userEmail = req.payload;
        const role = req.role;

        let query = {};

        if (role === "admin") {

            query = {
                recipientType: "admin"
            };

        } else {

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

// MARK READ NOTIFICATIONS (USER)
exports.markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { read: true })
        res.status(200).json("Updated")
    }
    catch (err) {
        res.status(500).json(err)
    }
}

// DELETE NOTIFICATIONS (USER)
exports.deleteNotification = async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id)
        res.status(200).json("Deleted")
    }
    catch (err) {
        res.status(500).json(err)
    }
}

// CLEAR ALL NOTIFICATIONS (USER)
exports.clearAll = async (req, res) => {
    try {
        const user = await users.findOne({ email: req.payload })
        await Notification.deleteMany({
            userId: user._id.toString(),
            recipientType: "user"
        })
        res.status(200).json("Cleared")
    }
    catch (err) {
        res.status(500).json(err)
    }
}

// GET NOTIFICATIONS (ADMIN)
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

// MARK READ NOTIFICATIONS (ADMIN)
exports.markAdminAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { read: true });

        res.status(200).json("Marked as read");
    } catch (err) {
        res.status(500).json(err);
    }
};

// DELETE NOTIFICATIONS (ADMIN)
exports.deleteAdminNotification = async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.status(200).json("Deleted");
    } catch (err) {
        res.status(500).json(err);
    }
};

// CLEAR NOTIFICATIONS (ADMIN)
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