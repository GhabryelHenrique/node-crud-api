const mongoose = require("mongoose");

const userSchema = new mongoose.model('User',{
    name: String,
    email: String,
    age: Number,
    phoneNumber: Number,
    job: String,
})

module.exports = userSchema;