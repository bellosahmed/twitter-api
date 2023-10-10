const mongoose = require('mongoose');


const postSchema = mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        maxLength: 499
    },
    img: {
        type: String
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    },
    replies: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            text: {
                type: String,
                required: true
            },
            userprofilepic: {
                type: String
            },
            username: {
                type: String
            },
        },
    ],
}, {
    timestamps: true
});

module.exports = mongoose.model('Posts', postSchema);
