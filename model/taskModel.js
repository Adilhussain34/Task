const mongoose = require("mongoose");

const taskModel=mongoose.Schema({
    title:String,
    desc:String,
    status:String,
})

const Task = mongoose.model("task", taskModel);
module.exports = Task;
