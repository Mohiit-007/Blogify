    const mongoose = require("mongoose");

    const blogschema = new mongoose.Schema({
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        coverImageURL: {
            type: String,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    }, { timestamps: true });

    const Blog = mongoose.model("blog", blogschema);

    module.exports = Blog;
