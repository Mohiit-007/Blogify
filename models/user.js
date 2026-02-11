const mongoose = require("mongoose");

const Userschema = new mongoose.Schema({
    fullname : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    profileImageURL : {
        type : String,
        default : '/images/avatar.jpg'
    },
    role : {
        type : String,
        enum : ["USER","ADMIN"],
        default : "USER",
    },
    password : {
        type : String,
        required : true,
    },
}, {timestamps : true});

const User = mongoose.model("User",Userschema);

module.exports = User;