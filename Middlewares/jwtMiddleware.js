const jwt = require('jsonwebtoken')

exports.jwtMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]
    
    if (!token) return res.status(401).json({ message: "Access denied" })

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded;
        next()
    } catch (error) {
        res.status(401).json({ message: "Invalid token" })
    }
}