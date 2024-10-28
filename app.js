require("dotenv").config();
const path = require("path");
const express = require("express");
//routes
const userroute = require("./routes/user");
const blogroute = require("./routes/blog");

const mongoose = require("mongoose");
//cookieparser

const cookieparser = require("cookie-parser");
const{checkforauthenticationcookie}= require("./middleware/authentication");
const Blog = require("./models/blog");


const PORT = process.env.PORT||8001;
const app = express();

/*mongoose.connect("mongodb://localhost:27017/blogify")*/
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("mongodb connected");
});

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieparser());



app.use(checkforauthenticationcookie("token"));
app.use(express.static(path.resolve("./public")));
app.set("view engine","ejs");
app.set("views", path.resolve("./views"));

app.use("/user",userroute);
app.use("/blog",blogroute);

app.get("/", async (req,res)=>{
    const allblogs = await Blog.find({});
    return res.render("home",{
        user:req.user,
        blogs:allblogs,
    });
});

app.listen(PORT,()=>{
    console.log("server started at localhost 8001");
});
