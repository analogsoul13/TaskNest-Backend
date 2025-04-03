const express = require('express')
const authController = require('../Controller/authController')
const userController = require('../Controller/userController')
const jobController = require('../Controller/jobController')
const { jwtMiddleware } = require('../Middlewares/jwtMiddleware')

const router = express.Router()

router.post('/register', authController.registerUser)
router.post('/login', authController.loginUser)

router.get('/profile', jwtMiddleware, userController.getUserProfile)
router.get('/profile', jwtMiddleware, userController.updateUserProfile)

router.post('/jobs', jwtMiddleware, jobController.createJob)
router.get('/jobs', jobController.getJobs)
router.get('/jobs/:id', jobController.getJobsById)
router.put('/jobs/:id', jwtMiddleware, jobController.updateJob)
router.delete('/jobs/:id', jwtMiddleware, jobController.deleteJob)

module.exports = router         