const express = require('express')
const userController = require('../controller/userController')
const appController = require('../controller/applicationController')
const jwtMiddleware = require('../middleware/jwtMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')
const notificationController = require('../controller/notificationController')
const upload = require('../middleware/multerMiddleware')
const router = new express.Router()

// register
router.post('/register', userController.registerController)

// login
router.post('/login', userController.loginController)

// googleLogin
router.post('/google-login', userController.googleLoginController)

// add
router.post('/add', jwtMiddleware, upload.single("resume"), appController.addApplication)

// edit
router.put('/edit/:id', jwtMiddleware, upload.single("resume"), appController.editApplication)

// get-profile
router.get('/get-profile', jwtMiddleware, userController.getProfile)

// update-profile (admin)
router.put('/admin-profile/:id', adminMiddleware, upload.single("image"), userController.updateProfile);

// update-profile
router.put('/user-profile', jwtMiddleware, upload.single("image"), userController.userUpdateProfile);

// get-notifications
router.get('/get-notify', jwtMiddleware, notificationController.getNotifications)

// put-notifications
router.put('/put-notify/:id', jwtMiddleware, notificationController.markAsRead)

// delete-notifications
router.delete('/delete-notify/:id', jwtMiddleware, notificationController.deleteNotification)

// clear-notifications
router.delete('/clear-notify', jwtMiddleware, notificationController.clearAll)

// get all (admin)
router.get('/all-apps', adminMiddleware, appController.getAllApplications)

// update resume
router.put("/update-resume/:id", jwtMiddleware, upload.single("resume"), appController.updateResume)

// get single
router.get('/single/:id', jwtMiddleware, appController.getSingleApplication)

// get user apps
router.get('/user-apps', jwtMiddleware, appController.getUserApplications)

// get all users (admin)
router.get('/all-users', adminMiddleware, userController.getAllUsers)

// stats
router.get('/stats', adminMiddleware, appController.getStats)

// update status(admin)
router.put('/update/:id', adminMiddleware, appController.updateStatus)

// delete user
router.delete('/user/delete/:id', jwtMiddleware, appController.deleteApplication)

// delete admin
router.delete('/admin/delete/:id', adminMiddleware, appController.adminDeleteApplication)

module.exports = router