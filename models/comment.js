const mongoose = require("mongoose")

const commentschema = new mongoose.Schema({
    content : {
        type : String,
        required : true,
    },
    blogId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "blog",
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    }
},{
    timestamps : true,
})

const Comment = mongoose.model("comment",commentschema);

module.exports = Comment;