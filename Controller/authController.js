const User = require('../Models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body
        if (!name || !email || !password || !role) {
            res.status(406).json("All fields required!!")
        }

        let user = await User.findOne({ email })
        if (user) return res.status(400).json({ message: 'User already exists!!' })

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        user = new User({ name, email, password: hashedPassword, role })
        await user.save()

        res.status(201).json({ message: 'User registered succesfully' })
    } catch (error) {
        res.status(500).json({ message: 'Server error!!' })
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            res.status(406).json({ message: 'All fields required!' })
        }

        const user = await User.findOne({ email })
        if (!user) return res.status(406).json({ message: 'Invalid credentials' })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ message: 'Invalid Password!!' })

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, {
            expiresIn: '1h'
        })

        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })

    } catch (error) {
        res.status(500).json({message: 'Server Error!!'})
    }
}