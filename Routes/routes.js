const express = require('express')
const authController = require('../Controller/authController')
const userController = require('../Controller/userController')
const jobController = require('../Controller/jobController')
const jobApplicationController = require('../Controller/jobApplicationController')
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

router.post('/jobs/apply', jwtMiddleware, jobApplicationController.applyJob )
router.get('/applications', jwtMiddleware, jobApplicationController.getApplications)
router.put('/applications/status/:applicationId', jwtMiddleware, jobApplicationController.updateApplicationStatus)

module.exports = router         