const bcrypt = require('bcryptjs');
const User = require('../models/user');
const tokenandcookies = require('../utils/tokenandcookies');

//Signup User
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
            tokenandcookies(newUser._id, res);
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

//Login User
const logininUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid user or password' });
        }

        tokenandcookies(user._id, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error in LoginUser: ", error.message);
    }
};

//Logout
const logoutUser = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 1 });
        res.status(200).json({ message: "User has logout" })
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error in LogoutUser: ", error.message);
    }
};

//Update
const updateUser = async (req, res) => {

};

//Follow and Unfollow
const followunfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const usertomodify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id === req.user._id) {
            return res.status(400).json({ message: "You cannot follow/unfollow your account" });
        }

        if (!usertomodify || !currentUser) {
            return res.status(404).json({ message: "User not exist" });
        }

        const isfollowing = currentUser.following.includes(id);

        if (isfollowing) {
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            res.status(200).json({ message: "User unfollowed" });
        } else {
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            res.status(200).json({ message: "User followed" });
        }

    } catch (error) {

        res.status(500).json({ message: error.message });
        console.error("Error in followunfollowUser: ", error.message);
    }
};


module.exports = { signupUser, logininUser, logoutUser, followunfollowUser, updateUser };