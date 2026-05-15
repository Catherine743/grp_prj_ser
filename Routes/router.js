const express = require('express')
const userController = require('../controller/userController')
const appController = require('../controller/applicationController')
const jwtMiddleware = require('../middleware/jwtMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')
const notificationController = require('../controller/notificationController')
const upload = require('../middleware/multerMiddleware')
const router = new express.Router()

// REGISTER
router.post('/register', userController.registerController)

// LOGIN
router.post('/login', userController.loginController)

// GOOGLE LOGIN
router.post('/google-login', userController.googleLoginController)

// ADD APPLICATION (USER)
router.post('/add', jwtMiddleware, upload.single("resume"), appController.addApplication)

// EDIT APPLICATION (USER)
router.put('/edit/:id', jwtMiddleware, upload.single("resume"), appController.editApplication)

// GET SINGLE APPLICATION (USER)
router.get('/single/:id', jwtMiddleware, appController.getSingleApplication)

// GET APPLICATIONS (USER)
router.get('/user-apps', jwtMiddleware, appController.getUserApplications)

// DELETE APPLICATION (USER)
router.delete('/user/delete/:id', jwtMiddleware, appController.deleteApplication)

// GET PROFILE (USER)
router.get('/get-profile', jwtMiddleware, userController.getProfile)

// UPDATE PROFILE (USER)
router.put('/user-profile', jwtMiddleware, upload.single("image"), userController.userUpdateProfile);

// GET NOTIFICATIONS (USER)
router.get('/get-notify', jwtMiddleware, notificationController.getNotifications)

// MARK READ NOTIFICATIONS (USER)
router.put('/put-notify/:id', jwtMiddleware, notificationController.markAsRead)

// DELETE NOTIFICATIONS (USER)
router.delete('/delete-notify/:id', jwtMiddleware, notificationController.deleteNotification)

// CLEAR NOTIFICATIONS (USER)
router.delete('/clear-notify', jwtMiddleware, notificationController.clearAll)

// GET ALL APPLICATIONS (ADMIN)
router.get('/all-apps', adminMiddleware, appController.getAllApplications)

// GET ALL USERS (ADMIN)
router.get('/all-users', adminMiddleware, userController.getAllUsers)

// UPDATE PROFILE (ADMIN)
router.put('/admin-profile/:id', adminMiddleware, upload.single("image"), userController.updateProfile);

// UPDATE STATUS (ADMIN)
router.put('/update/:id', adminMiddleware, appController.updateStatus)

// DELETE APPLICATION (ADMIN)
router.delete('/admin/delete/:id', adminMiddleware, appController.adminDeleteApplication)

// GET NOTIFICATIONS (ADMIN)
router.get('/admin-notify', adminMiddleware, notificationController.getAdminNotifications)

// MARK READ NOTIFICATIONS (ADMIN)
router.put('/admin-put-notify/:id', adminMiddleware, notificationController.markAdminAsRead);

// DELETE NOTIFICATIONS (ADMIN)
router.delete('/admin-delete-notify/:id', adminMiddleware, notificationController.deleteAdminNotification);

// CLEAR NOTIFICATIONS (ADMIN)
router.delete('/admin-clear-notify', adminMiddleware, notificationController.clearAdminNotifications)

module.exports = router