const express = require("express");
const USER = require('../models/user')
const Blog = require('../models/blog')
const Comment = require("../models/comments")

const route = express.Router();

route.get('/',(req,res)=>{
    res.render('home');
})

route.get('/signUp',(req,res)=>{
    return res.render('signup');
})

route.get('/login',(req,res)=>{
    return res.render('login');
})

route.get('/logout',(req,res)=>{
    res.clearCookie("token",{
        httpOnly: true,
        sameSite: "lax",
        secure : false,
    }).redirect("/");
})

route.get('/blog',(req,res)=>{
    const User = req.user;
    if(!User){
        return res.render('addBlog',{
        error : "Please log in to create a blog post",
    });
    }
    res.render('addBlog',{
        User : User,
    });
})

route.get('/blog/:id',async (req,res)=>{ // blogid
    const id = req.params.id;
    const blog = await Blog.findById(id).populate("createdBy");
    const comments = await Comment.find({blogId : req.params.id}).populate("createdBy");
    if (!blog) {
        return res.redirect('/');
    }
    console.log("comment",comments);
    console.log("blog",blog);
    res.render('blog',{
        user : req.user,
        blog,
        comments,
    })
})

route.get('/blog/edit/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        return res.redirect('/');
    }

    if (
        req.user.role !== "ADMIN" &&
        blog.createdBy.toString() !== req.user.id
    ) {
        return res.status(403).send("Unauthorized");
    }

    res.render('editblog', {
        blog,
        user: req.user
    });
});

route.get('/blog/comment/edit/:id', async (req, res) => {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
        return res.redirect('/');
    }

    if (
        req.user.role !== "ADMIN" &&
        comment.createdBy.toString() !== req.user.id
    ) {
        return res.status(403).send("Unauthorized");
    }

    res.render('editcomment', {
        comment,
        user: req.user
    });
});


module.exports = route;