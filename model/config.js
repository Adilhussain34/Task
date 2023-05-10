const mongoose = require("mongoose");

mongoose
        .connect("mongodb://127.0.0.1:27017/Project1")
        .then(() => console.log("Connection Established!..."))
        .catch((err) => console.log(err.message));