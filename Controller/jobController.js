const Job = require('../Models/jobModel')

exports.createJob = async (req, res) => {
    try {
        const { title, description, category, budget, deadline } = req.body

        if (!title || !description || !category || !budget || !deadline) {
            return res.status(400).json({ message: "All fields are required!" })
        }

        const job = new Job({
            title,
            description,
            category,
            budget,
            deadline,
            postedBy: req.user.id,
        })

        await job.save()
        res.status(201).json({ message: "Job posted succesfully", job })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

exports.getJobs = async (req, res) => {
    try {

        const { search, category, minBudget, maxBudget, page, limit } = req.query
        let query = {}

        // Search
        if (search) {
            query.title = { $regex: search, $options: "i" }
        }

        // Filter
        if (category) {
            query.category = category
        }

        // Filter by budget
        if (minBudget && maxBudget) {
            query.budget = { $gte: minBudget, $lte: maxBudget }
        }

        // Pagination
        const pageNumber = parseInt(page) || 1
        const pageSize = parseInt(limit) || 10
        const skip = (pageNumber - 1) * pageSize

        // Fetch jobs with filters & pagination
        const jobs = await Job.find(query)
            .populate("postedBy", "name email")
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 })  // Sort lates jobs

        const totalJobs = await Job.countDocuments(query)

        if (jobs.length === 0) {
            return res.status(404).json({ message: "No jobs found matching the filters" })
        }

        res.status(200).json({
            totalJobs,
            page: pageNumber,
            totalPages: Math.ceil(totalJobs / pageSize),
            jobs
        })


    } catch (error) {
        res.status(500).json({ message: "Server Error!", error: error.message })
    }
}

exports.getJobsById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate("postedBy", "name email")
        if (!job) {
            return res.status(400).json({ message: "Job not found" })
        }
        res.status(200).json(job)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)

        if (!job) {
            return res.status(400).json({ message: "Job not found!" })
        }

        if (job.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to update job" })
        }

        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true })

        res.status(200).json(updatedJob)

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)

        if (!job) {
            return res.status(400).json({ message: "Job not found" })
        }

        if (job.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this job!" })
        }

        await Job.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Job deleted succesfully" })

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}