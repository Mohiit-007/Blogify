const express = require("express");
const route = express.Router();
const multer = require("multer");
const path = require("path")
const Blog = require('../models/blog')

const {handleusersignup , handleuserlogin , handleuserblog ,
    handleusercomment , handleuserdelete , handleusercommentdelete,
    handleuseredit , handleusercommentedit} = require("../controllers/user");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('./public/uploads/'))
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()} - ${file.originalname}`
    cb(null, filename)
  }
})

const upload = multer({ storage: storage })

route.post('/signUp',handleusersignup)

route.post('/login',handleuserlogin)

route.post('/blog',upload.single('coverImage'),handleuserblog)

route.post('/comment/:blogId',handleusercomment)

route.post('/delete/:id',handleuserdelete)

route.post('/delete/comment/:id',handleusercommentdelete)

route.post('/blog/edit/:id',handleuseredit)

route.post('/blog/comment/edit/:id',handleusercommentedit)

module.exports = route;