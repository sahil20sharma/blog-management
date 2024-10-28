const {Router} = require("express");
const router = Router();
const User = require("../models/user");

router.get("/signin",(req,res)=>{
    res.render("signin");
});

router.get("/signup",(req,res)=>{
    res.render("signup");
});

router.post("/signup",async (req,res)=>{
    const{fullname,email,password} = req.body;
    await User.create({
        fullname,
        email,
        password,
    });
    return res.redirect("home");
});
router.post("/signin",async (req,res)=>{
    const{email,password} = req.body;
    try{
   const token= await User.matchpasswordandgenratetoken(email,password);
   console.log("token",token);
   return res.cookie("token",token).redirect("/");}
   catch(error){
    return res.render("signin",{
        error:"incorrect password or email",
    });
   }
});

router.get("/logout",(req,res)=>{
    return res.clearCookie("token").redirect("/");
});
module.exports = router;