require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./Connection/db')
const router = require('./Routes/routes')

const tasknetServer = express()

tasknetServer.use(cors({
    origin: "http://localhost:5173",  // Allow frontend requests
    credentials: true  // Allow cookies & authentication headers
}));

tasknetServer.use(express.json())


connectDB()

tasknetServer.use(router)

const PORT = 3000 || process.env.PORT

tasknetServer.listen(PORT, () => {
    console.log("Server running at :", PORT);

})

tasknetServer.get('/', (req, res) => {
    res.send("<h1>Tasknet Server is Active !!</h1>")
})