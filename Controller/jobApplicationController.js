const JobApplication = require('../Models/jobApplicationModel')
const Job = require('../Models/jobModel')

exports.applyJob = async (req, res) => {
    try {
        const { jobId } = req.body
        const candidateId = req.user.id

        const jobExist = await Job.findById(jobId)
        if (!jobExist) {
            return res.status(404).json({ message: "Job not found" })
        }

        const alreadyApplied = await JobApplication.findOne({ jobId, candidateId })
        if (alreadyApplied) {
            return res.status(400).json({ message: "You have already applied for this job" })
        }

        const newApplication = await JobApplication.create({
            jobId,
            candidateId
        })

        res.status(201).json({ message: "Job application submitted succesfully", application: newApplication })

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

exports.getApplications = async (req, res) => {
    try {
        const userId = req.user.id
        const userRole = req.user.role

        let applications

        if (userRole === "freelancer") {
            // Freelancer sees their applied jobs
            applications = await JobApplication.find({ candidateId: userId })
                .populate("jobId", "title description budget")
                .populate("candidateId", "name email")
                .select("jobId candidateId status createdAt")
        } else if (userRole === "recruiter") {
            // Recruiter sees applicants for their posted jobs
            const jobsPostedByUser = await Job.find({ postedBy: userId }).select("_id")
            const jobIds = jobsPostedByUser.map(job => job._id)

            applications = await JobApplication.find({ jobId: { $in: jobIds } })  //$in for multiple values
                .populate("jobId", "title description budget")
                .populate("candidateId", "name email")
                .select("jobId candidateId status createdAt")
        } else {
            return res.status(403).json({ message: "Unauthorized" })
        }

        res.status(200).json(applications)
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}