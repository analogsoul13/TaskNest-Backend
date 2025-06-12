const User = require('../Models/userModel')

// Get User profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found!" })
        } else {
            res.status(200).json(user)
        }
    } catch (error) {
        res.status(500).json({ message: "Server error!!" })
    }
}

// Update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const { name, bio, profilePic } = req.body
        const user = await User.findById(req.user.id)

        if (!user) return res.status(404).json({ message: "User not found!!" })

        if (name) user.name = name;
        if (bio) user.bio = bio;
        if (profilePic) user.profilePic = profilePic

        await user.save()
        res.status(200).json({ message: "Profile updated succesfully", user })
    } catch (error) {
        res.status(500).json({ message: "Server error!!" })
    }
}