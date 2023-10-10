const Post = require('../models/post');
const User = require('../models/user');

// Create post
const createPost = async (req, res) => {
    try {
        const { postedBy, text, img } = req.body;

        if (!postedBy || !text) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        const user = await User.findById(postedBy);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized to create post" });
        }

        const maxLength = 499;
        if (text.length > maxLength) {
            return res.status(400).json({ message: `Has exceeded the ${maxLength} characters limit` });
        }

        const newPost = new Post({ postedBy, text, img });

        await newPost.save();
        return res.status(201).json({ message: "Post created", newPost });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error in createpost: ", error.message)
    }
};

// Get Post
const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not exist" });
        }

        res.status(200).json({ post });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Post
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) { return res.status(404).json({ message: "Post does not exist" }) };

        if (post.postedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "You are unauthorized to delete this post." });
        }
        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Your post has been removed" });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//Like and Unlike
const likeunlikePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post does not exist" });
        }

        const likedPost = post.likes.includes(userId);
        if (likedPost) {
            //Unlike Post
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            res.status(200).json({ message: "Post has been unlike" });
        } else {
            //Like Post
            post.likes.push(userId);
            await post.save();
            res.status(200).json({ message: "Post has been liked" });
        }

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

// Reply Post
const replyPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        const userprofilepic = req.user.profilepic;
        const username = req.user.username;

        if (!text) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const reply = { userId, text, userprofilepic, username };

        post.replies.push(reply);
        await post.save();

        res.status(200).json({ message: "Reply sent", post });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Feeds
const feedPost = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const following = user.following;

        const feedPost = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

        res.status(200).json(feedPost);

    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log("Error in getfeed: ", error.message)
    }
};

module.exports = { createPost, getPost, deletePost, likeunlikePost, replyPost, feedPost };