require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./Connection/db')
const router = require('./Routes/routes')

const tasknetServer = express()

const allowedOrigins = [
    "http://localhost:5173",
    "https://task-nest-frontend.vercel.app"
];

tasknetServer.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
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