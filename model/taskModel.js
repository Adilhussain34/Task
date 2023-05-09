const mongoose = require("mongoose");

const taskModel=mongoose.Schema({
    title:String,
    desc:String,
    status:String,
    user_id :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    } 
})

const Task = mongoose.model("task", taskModel);
module.exports = Task;
