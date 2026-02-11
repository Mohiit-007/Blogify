const USER = require("../models/user")
const bcrypt = require("bcrypt");
const argon2 = require("argon2");
const { createtoken } = require("../service/auth");
const Blog = require("../models/blog");
const Comment = require("../models/comments")

async function handleusersignup(req,res) {
    try {
        const {name , email , password} = req.body;
        const existingUser  = await USER.findOne({email});
        if(existingUser) return res.render('signup',{
            error: "Email already exists",
        })

        const hashpassword = await argon2.hash(password);

        await USER.create({
            fullname : name,
            email : email,
            password : hashpassword, 
        })

        res.redirect('/login');
    } catch (error) {
        console.error(error);
        return res.render("signup", {
            error: "Something went wrong. Please try again.",
        });
    }
}

async function handleuserlogin(req,res) {
    const {email , password} = req.body;

    try {
        const trimmedEmail = email.trim().toLowerCase();
        const user = await USER.findOne({email : trimmedEmail});

        if (!user) {
            return res.render("login", {
                error: "Invalid email or password",
            });
        }

        // const isMatch = await bcrypt.compare(password, user.password);
        const isMatch = await argon2.verify(user.password,password);
        if (!isMatch){
            return res.render("login", {
                error: "Invalid email or password",
            });
        }
        
        const token = createtoken(user);
    
        return res.cookie("token",token,{
            httpOnly : true,
            secure : false,
            sameSite: "lax",
        }).redirect('/');
    } catch (error) {
        res.render('login',{
            error: "Something went wrong. Please try again.",
        })
    }
}

async function handleuserblog(req,res) {
    const {title , body} = req.body;
    const blog = await Blog.create({
        body,
        title,
        createdBy : req.user.id,
        coverImageURL : `/uploads/${req.file.filename}`,
    })
    return res.redirect(`/blog/${blog._id}`);
}

async function handleusercomment(req,res) {
    if(!req.user){
        return res.send({msg : "user not exist"});
    }
    await Comment.create({
        content : req.body.content,
        blogId : req.params.blogId,
        createdBy : req.user.id,
    })
    return res.redirect(`/blog/${req.params.blogId}`);
}

async function handleuserdelete(req,res) {
    const id = req.params.id;
    const blog = await Blog.findById(id);
    if (!blog) {
        return res.redirect('/');
    }
    if (req.user.role === "ADMIN" || blog.createdBy.toString() === req.user.id) {
        await Blog.findByIdAndDelete(req.params.id);
    }

    res.redirect('/');
}

async function handleusercommentdelete(req,res) {
    try {
        const commentId = req.params.id;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.redirect(`/blog/${comment.blogId}`);
        }

        // Authorization check
        if (
            req.user.role === "ADMIN" ||
            comment.createdBy.toString() === req.user.id
        ) {
            await Comment.findByIdAndDelete(commentId);
        }

        return res.redirect(`/blog/${comment.blogId}`);

    } catch (error) {
        console.error(error);
        return res.redirect("/");
    }
}

async function handleuseredit(req,res) {
    const { title, body } = req.body;

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

    blog.title = title;
    blog.body = body;

    await blog.save();

    res.redirect(`/blog/${blog._id}`);
}

async function handleusercommentedit(req,res) {
    if (!req.user) {
        return res.status(401).send("Unauthorized");
    }
    const {content} = req.body;

    const id = req.params.id;
    const comment = await Comment.findById(id);
    if(!comment){
        res.redirect('/');
    }

    if(req.user.role !== "ADMIN" && req.user.id !== comment.createdBy.toString()){
        return res.status(403).send({msg : "Unauthorized"});
    }

    comment.content = content;
    await comment.save();
    return res.redirect(`/blog/${comment.blogId}`);

}

module.exports = {handleusersignup, handleuserlogin, handleuserblog, handleusercomment,
    handleuserdelete, handleusercommentdelete, handleuseredit, handleusercommentedit }