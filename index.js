require("dotenv").config();

const express = require("express")
const path = require("path")
const checkforauth = require("./middlewares/auth")
const router = require("./routes/user")
const mongodb = require("./connect")
const cookieparser = require("cookie-parser")
const blogroute = require("./routes/blog");
const Blog = require("./models/blog")

const app = express();

mongodb(process.env.MONGO_URL)
.then(()=>console.log("mongodb Connected"))
.catch((err)=>console.log("error",err))

app.set("view engine","ejs");
app.set("views",path.resolve(__dirname,"./views"))
app.use(express.urlencoded({extended : false}))
app.use(cookieparser());
app.use(checkforauth("uid"))
app.use(express.static(path.resolve("./public")));

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.get('/',async (req,res)=>{
    const allBlogs = await Blog.find({});
    console.log(allBlogs);
    res.render('home',{
        blogs : allBlogs,
    });
})

app.use("/user",router);
app.use("/blog",blogroute);

const PORT = process.env.PORT || 8000;
app.listen(PORT,()=>console.log("server started..."))