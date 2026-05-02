const express = require('express')
const userController = require('../controller/userController')
const appController = require('../controller/applicationController')
const jwtMiddleware = require('../middleware/jwtMiddleware')
const router = new express.Router()

// register
router.post('/register', userController.registerController)

// login
router.post('/login', userController.loginController)

// googleLogin
router.post('/google-login', userController.googleLoginController)

// add
router.post('/add', jwtMiddleware, appController.addApplication)

// get all (admin)
router.get('/all', appController.getAllApplications)

// get user apps
router.get('/user/:userId', appController.getUserApplications)

// update status
router.put('/update/:id', appController.updateStatus)

// delete
router.delete('/delete/:id', appController.deleteApplication)

module.exports = router