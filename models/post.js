const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    postedby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        maxLenght: 499
    },
    img: {
        type: String
    },
    likes: {
        type: Number,
        default: 0
    },
    replies: {
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
        }
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Posts', postSchema);