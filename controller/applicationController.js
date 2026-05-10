const applications = require('../model/applicationModel')
const Notification = require("../model/notificationModel");

// ADD APPLICATION
exports.addApplication = async (req, res) => {

    try {

        const {
            userId,
            user,
            email,
            designation,
            company,
            date
        } = req.body

        const resume = req.file
            ? req.file.filename
            : ""

        const newApp = await applications.create({

            userId,
            user,
            email,

            designation,
            company,
            date,

            resume,

        })

        // =======================
        // ADMIN NOTIFICATION
        // =======================

        await Notification.create({

            userId: "admin",

            type: "new-application",

            message: `${user} applied for ${designation} at ${company}`,

            read: false

        })

        res.status(200).json(newApp)

    } catch (err) {

        res.status(500).json(err)

    }
}


// GET ALL APPLICATIONS (ADMIN)
exports.getAllApplications = async (req, res) => {
    try {

        const data = await applications.find({
            isDeletedByAdmin: false
        });

        res.status(200).json({
            data
        });

    } catch (err) {
        res.status(500).json(err);
    }
};


// GET USER APPLICATIONS
exports.getUserApplications = async (req, res) => {
    try {
        const userMail = req.payload;

        const data = await applications.find({ email: userMail });

        res.status(200).json(data);

    } catch (err) {
        res.status(500).json(err);
    }
};

// EDIT APPLICATION
exports.editApplication = async (req, res) => {

    try {

        const { id } = req.params

        const userEmail = req.payload

        const {
            user,
            email,
            designation,
            company,
            date
        } = req.body

        const app = await applications.findById(id)

        if (!app) {
            return res.status(404).json("Application not found")
        }

        // OWNER CHECK
        if (app.email !== userEmail) {
            return res.status(403).json("Unauthorized")
        }

        // NEW RESUME
        const resume = req.file
            ? req.file.filename
            : app.resume

        const updated = await applications.findByIdAndUpdate(
            id,
            {
                user,
                email,
                designation,
                company,
                date,
                resume
            },
            { new: true }
        )

        res.status(200).json(updated)

    } catch (err) {

        res.status(500).json(err)

    }
}

// UPDATE STATUS (ADMIN)
exports.updateStatus = async (req, res) => {

    try {
        const { id } = req.params;
        const { status, interviewDate } = req.body;

        const app = await applications.findById(id);

        if (!app) {
            return res.status(404).json("Application not found");
        }

        const validStatus = ["Applied", "Interview", "Offer", "Rejected"];

        if (!validStatus.includes(status)) {
            return res.status(400).json("Invalid status");
        }

        app.status = status ?? app.status;

        if (interviewDate !== undefined) {
            app.interviewDate = interviewDate;
        }

        // HISTORY
        app.history.push({
            status,
            date: new Date()
        });

        await app.save();

        // =======================
        // NOTIFICATION
        // =======================
        let message = `Your application for ${app.company} is now ${status}`;

        if (status === "Interview") {

            message = `Interview scheduled for ${app.company} on ${interviewDate}`;

            // =======================
            // ADMIN INTERVIEW ALERT
            // =======================

            const today = new Date();

            const interview = new Date(interviewDate);

            const diffTime =
                interview.getTime() - today.getTime();

            const diffDays = Math.ceil(
                diffTime / (1000 * 60 * 60 * 24)
            );

            // WITHIN 3 DAYS

            if (diffDays <= 3 && diffDays >= 0) {

                await Notification.create({

                    userId: "admin",

                    type: "interview-alert",

                    message: `Interview for ${app.user} is scheduled on ${interviewDate}`,

                    read: false

                });

            }

        } else if (status === "Offer") {
            message = `Congratulations! You received an offer from ${app.company}`;
        } else if (status === "Rejected") {
            message = `Your application for ${app.company} was rejected`;
        }

        await Notification.create({
            userId: app.email,   // FIX HERE
            type: "status-update",
            message,
            read: false
        });

        res.status(200).json(app);

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

// DASHBOARD STATS
exports.getStats = async (req, res) => {
    try {
        const { userId } = req.query

        const matchStage = userId ? { userId } : {}

        const stats = await applications.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ])

        res.status(200).json(stats)

    } catch (err) {
        res.status(500).json(err)
    }
}

// DELETE APPLICATION
exports.deleteApplication = async (req, res) => {

    try {

        const { id } = req.params

        const userEmail = req.payload

        const app = await applications.findById(id)

        if (!app) {
            return res.status(404).json("Application not found")
        }

        // OWNER CHECK
        if (app.email !== userEmail) {
            return res.status(403).json("Unauthorized")
        }

        await applications.findByIdAndDelete(id)

        res.status(200).json("Deleted successfully")

    } catch (err) {

        res.status(500).json(err)

    }
}

// ADMIN DELETE APPLICATION
exports.adminDeleteApplication = async (req, res) => {
    try {
        const { id } = req.params;

        const app = await applications.findById(id);

        if (!app) {
            return res.status(404).json("Application not found");
        }

        // DO NOT DELETE
        app.isDeletedByAdmin = true;

        await app.save();

        res.status(200).json("Hidden from admin view");

    } catch (err) {
        res.status(500).json(err);
    }
};

// GET SINGLE APPLICATION
exports.getSingleApplication = async (req, res) => {
    try {
        const data = await applications.findById(req.params.id)
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err)
    }
}

// UPDATE RESUME
exports.updateResume = async (req, res) => {

    try {

        const { id } = req.params

        const app = await applications.findById(id)

        if (!app) {
            return res.status(404).json("Application not found")
        }

        if (!req.file) {
            return res.status(400).json("Please upload a resume")
        }

        app.resume = req.file.filename

        await app.save()

        res.status(200).json(app)

    } catch (err) {

        res.status(500).json(err)

    }
}