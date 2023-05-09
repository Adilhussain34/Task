const mongoose = require("mongoose");


const userModel = new mongoose.Schema({
    username: String,
    email: String,
    number: Number,
    password: String, 
    date: {
        type: Date,
        default: Date.now,
    },

});

const user = mongoose.model("user", userModel);
module.exports = user;
