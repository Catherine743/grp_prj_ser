const applications = require('../model/applicationModel')


// ➤ ADD APPLICATION
exports.addApplication = async (req, res) => {
    try {
        const { userId, user, email, designation, date } = req.body

        const newApp = await applications.create({
            userId,
            user,
            email,
            designation,
            date
        })

        res.status(200).json(newApp)

    } catch (err) {
        res.status(500).json(err)
    }
}


// ➤ GET ALL APPLICATIONS (ADMIN)
exports.getAllApplications = async (req, res) => {
    try {
        const data = await applications.find()
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err)
    }
}


// ➤ GET USER APPLICATIONS
exports.getUserApplications = async (req, res) => {
    try {
        const { userId } = req.params

        const data = await applications.find({ userId })
        res.status(200).json(data)

    } catch (err) {
        res.status(500).json(err)
    }
}


// ➤ UPDATE STATUS (ADMIN)
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body

        const updated = await applications.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        )

        res.status(200).json(updated)

    } catch (err) {
        res.status(500).json(err)
    }
}


// ➤ DELETE APPLICATION
exports.deleteApplication = async (req, res) => {
    try {
        const { id } = req.params

        await applications.findByIdAndDelete(id)

        res.status(200).json("Deleted successfully")

    } catch (err) {
        res.status(500).json(err)
    }
}