const { Router } = require("express")
const User = require("../models/user")

const router = Router();

router.get('/signUp',(req,res) =>{
    res.render('signup')
})

router.get('/login',(req,res) =>{
    res.render('login')
})

router.get('/logout',(req,res)=>{
    res.clearCookie("uid").redirect("/");
})

router.post('/signUp',async (req,res)=>{
    const {fullname , email , password} = req.body;
    console.log(req.body);

    await User.create({
        fullname,
        email,
        password,
    })

    return res.redirect('/');
})

router.post('/login',async (req,res)=>{
    try {
        const {email,password} = req.body;
        // const user = await User.matchpassword(email, password);
        const token = await User.matchpasswordandGenerateToken(email,password);
        // verifytoken(token);
        return res.cookie("uid",token).redirect("/");
    } catch (error) {
        return res.render('login',{
            error : 'Incorrect Email or Password',
        })
    }
});

module.exports = router;