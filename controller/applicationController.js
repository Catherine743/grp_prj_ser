const applications = require('../model/applicationModel')
const Notification = require("../model/notificationModel");

// ADD APPLICATION
exports.addApplication = async (req, res) => {

    try {

        const {
            userId,
            user,
            email,
            designation
        } = req.body

        // CHECK RESUME
        if (!req.file) {
            return res.status(400).json("Resume is required")
        }

        const resume = req.file.filename

        const newApp = await applications.create({

            userId,
            user,
            email,
            designation,
            resume

        })
        
        // ADMIN NOTIFICATION
        await Notification.create({
            userId: "admin",
            type: "new-application",
            message: `${user} applied for ${designation}`,
            recipientType: "admin",
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

        const data = await applications.find();

        res.status(200).json({ data });

    } catch (err) {
        res.status(500).json(err);
    }
};


// GET APPLICATIONS (USER)
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
            designation
        } = req.body

        const app = await applications.findById(id)

        if (!app) {
            return res.status(404).json("Application not found")
        }

        // OWNER CHECK
        if (app.email != userEmail) {
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
                resume
            },
            { new: true }
        )

        await Notification.create({
            userId: "admin",
            type: "application-updated",
            message: `${user} updated application for ${designation}`,
            recipientType: "admin",
            read: false
        })

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


        await app.save();

        // NOTIFICATION
        let message = `Your application for ${app.designation} is now ${status}`;

        if (status === "Interview") {

            message = `Interview scheduled for ${app.designation} on ${interviewDate}`;

            // ADMIN INTERVIEW ALERT

            const today = new Date();

            today.setHours(0, 0, 0, 0)

            const selectedDate = new Date(interviewDate)

            selectedDate.setHours(0, 0, 0, 0)

            if (selectedDate <= today) {
                return res
                    .status(400)
                    .json("Interview date must be after today")
            }

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
                    recipientType: "admin",
                    read: false
                });

            }

        } else if (status === "Offer") {
            message = `Congratulations! You received an offer for ${app.designation}`;
        } else if (status === "Rejected") {
            message = `Your application for ${app.designation} was rejected`;
        }

        await Notification.create({
            userId: app.userId,
            type: "status-update",
            message,
            recipientType: "user",
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

        await applications.findByIdAndDelete(id);

        res.status(200).json("Hidden from admin view");

    } catch (err) {
        res.status(500).json(err);
    }
};

// GET SINGLE APPLICATION
exports.getSingleApplication = async (req, res) => {

    try {

        const app = await applications.findById(req.params.id);

        if (!app) {
            return res.status(404).json("Application not found");
        }

        if (
            req.role !== "admin" &&
            app.email !== req.payload
        ) {
            return res.status(403).json("Unauthorized");
        }

        res.status(200).json(app);

    } catch (err) {

        res.status(500).json(err);

    }
}

// UPDATE RESUME
exports.updateResume = async (req, res) => {

    try {

        const { id } = req.params

        const app = await applications.findById(id)

        const fs = require("fs")
        const path = require("path")

        if (!app) {
            return res.status(404).json("Application not found")
        }

        if (!req.file) {
            return res.status(400).json("Please upload a resume")
        }

        if (app.resume) {

            const oldPath = path.join(
                __dirname,
                "../uploads",
                app.resume
            )

            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath)
            }
        }
        app.resume = req.file.filename

        await app.save()

        res.status(200).json(app)

    } catch (err) {

        res.status(500).json(err)

    }
}