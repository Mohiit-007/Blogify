const mongoose = require("mongoose");

const Blogschema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    body : {
        type : String,
        required : true,
    },
    coverImageURL : {
        type : String,
        required : false,
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
},{timestamps : true});

const Blog = mongoose.model("Blog",Blogschema);

module.exports = Blog;