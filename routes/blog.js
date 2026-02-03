const { Router } = require("express")
const multer = require("multer");
const router = Router();
const path = require("path");
const Comment = require("../models/comment")
const Blog = require("../models/blog")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public"))
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
})
const upload = multer({ storage })

router.post("/add-new" ,upload.single('coverImage'),async (req,res)=> {
    console.log("REQ.USER =>", req.user);

    const {title , body} = req.body;
    const blog = await Blog.create({
        title : title,
        body : body,
        createdBy: req.user.id,
        coverImageURL: `/${req.file.filename}`,
    });
    console.log(blog);
    
    return res.redirect(`/blog/${blog._id}`);
})

router.get('/add-new',(req,res)=>{
    return res.render('addBlogs',{
        user : req.user,
    });
}) 

router.post('/comment/:blogId',async (req,res)=>{
    const comment = await Comment.create({
        content : req.body.content,
        blogId : req.params.blogId,
        createdBy : req.user.id,
    })

    return res.redirect(`/blog/${req.params.blogId}`);
})

router.get('/:blogId',async (req,res)=>{
    const id = req.params.blogId;
    const blog = await Blog.findById(id).populate("createdBy");
    const comments = await Comment.find({blogId : id}).populate("createdBy");
    console.log(comments);
    return res.render("blog",{
        user : req.user,
        blog,
        comments,
    })
})


router.get("/:id",async (req,res)=>{
    const id = req.params.id;
    const blog = await Blog.findById(id).populate("createdBy");

     if (!blog) {
        return res.status(404).send("Blog not found");
    }

    return res.render('blog',{
        user : req.user,
        blog,
    })
})

module.exports = router;