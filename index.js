require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./Connection/db')
const router = require('./Routes/routes')

const tasknetServer = express()

tasknetServer.use(cors())
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