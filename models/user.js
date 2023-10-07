const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        minlenght: 5,
        required: true
    },
    age: {
        type: Number
    },
    dob: {
        type: Date
    },
    profilepic: {
        type: String,
        default: ''
    },
    coverpic: {
        type: String,
        default: ''
    },
    followers: {
        type: [String],
        default: []
    },
    following: {
        type: [String],
        default: []
    },
    biography: {
        type: String,
        default: "",
    },
}, { timestamps: true },
);

module.exports = mongoose.model('Users', userSchema);