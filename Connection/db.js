const mongoose = require('mongoose')

const connectDB = async ()=> {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING)
        console.log("Connected to mongoDB!!");
    } catch (error) {
        console.error("MongoDB Connection Error:", error)
        process.exit(1)
    }
}

module.exports = connectDB