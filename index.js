require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieparser = require("cookie-parser")

const app = express();

const Connectdb = require("./connect");
const staticroute = require("./routes/staticroute");
const userroute = require("./routes/user");
const checkauth = require("./middleware/auth")
const Blog = require("./models/blog")

app.use(express.urlencoded({extended : true}))
app.use(cookieparser());
app.use(express.json())
app.use(checkauth("token"));
app.use(express.static(path.resolve("./public")))

Connectdb(process.env.MONGO_URI)
.then(()=>console.log('mongodb connected..'))
.catch((err)=>console.log(err,'error'))

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use((req, res, next) => {
  res.locals.User = req.user;
  next();
});

app.get('/',async (req,res)=>{
    const addblogs = await Blog.find({});
    return res.render('home',{
        blogs : addblogs,
    });
})

app.use('/',staticroute);
app.use('/user',userroute);

const PORT = process.env.PORT || 8000;
app.listen(PORT,()=>console.log("server started"));