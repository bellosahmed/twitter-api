const bcrypt = require('bcryptjs');
const User = require('../models/user');

const signupUser = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        const user = await User.findOne({ $or: [{ email }, { username }] });

        if (user) {
            res.status(400).json({ message: "User exist" });
        }
        const salt = await bcrypt.genSalt(9);
        const hashedpassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            username,
            password: hashedpassword,
        });
        await newUser.save();

        if (newUser) {
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                password: newUser.password
            });
        } else {
            res.status(400).json({ message: "Invaild User data" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
        console.log("Error in signupUser: ", err.message)
    }
};

module.exports = { signupUser };