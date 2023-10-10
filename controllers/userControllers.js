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
    const { name, email, username, password, age, dob, profilepic, coverpic, biography } = req.body;
    const userId = req.user._id;
    try {
        let user = await User.findById(userId);
        if (!user) return res.status(400).json({ message: "User not found" });

        if (req.params.id !== userId.toString()) return res.status(400).json({ message: "You cannot update users profile" });

        if (password) {
            const salt = await bcrypt.genSalt(9);
            const hashedpassword = await bcrypt.hash(password, salt);
            user.password = hashedpassword;
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.age = age || user.age;
        user.dob = dob || user.dob;
        user.profilepic = profilepic || user.profilepic;
        user.coverpic = coverpic || user.coverpic;
        user.biography = biography || user.biography;

        user = await user.save();
        res.status(200).json({ message: "Profile updated", user });

    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error in UpdateUser: ", error.message);
    }
};

//Follow and Unfollow
const followunfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const usertomodify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id === req.user._id.toString()) {
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

//Get Profile
const profileUser = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username }).select('-password').select('-dob').select('-updatedAt');
        if (!user) return res.status(400).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error("Error in profileUser: ", error.message);

    }
};


module.exports = { signupUser, logininUser, logoutUser, followunfollowUser, updateUser, profileUser };