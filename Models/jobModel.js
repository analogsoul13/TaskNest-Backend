const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        budget: {
            type: String,
            required: true
        },
        deadline: {
            type: Date,
            required: true
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId, 
            ref:"User",
            required: true
        }
    },{timestamps: true}
)

module.exports = mongoose.model("Job", jobSchema)
