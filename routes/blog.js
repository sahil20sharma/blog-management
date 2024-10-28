const Blog = require("../models/blog");
const Comment = require("../models/comment");

const {Router} = require("express");
const multer = require("multer");
const router = Router();
const path = require("path");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads`));
    },
    filename: function (req, file, cb) {
      const filename =`${Date.now()}-${file.originalname}`;
      cb(null,filename);
    },
  });
  const upload = multer({storage});

router.get("/add-new",(req,res)=>{
    return res.render("addblog",{
        user:req.user,
    });
});


router.post("/",upload.single("coverimage"),async(req,res)=>{
  
  const{title,body} = req.body;
   const blog = await Blog.create({
        body,
        title,
        createdby:req.user._id,
        coverimageurl:`/uploads/${req.file.filename}`,

    });
    console.log(req.body);
    console.log(req.file);
    return res.redirect("/"); // home page redirect
  }); 

   
  router.get("/:id",async (req,res)=>{
    const blog = await Blog.findById(req.params.id).populate("createdby");
    const comments = await Comment.find({blogid:req.params.id}).populate("createdby");
    console.log("blog",blog);
    return res.render("blog",{
      user:req.user,
      blog,
      comments,
    });
  });

  //comment route:-start
  router.post("/comment/:blogid",async(req,res)=>{
    const{content} = req.body;
    const comment = await Comment.create({
      content:content,
      blogid:req.params.blogid,
      createdby:req.user._id,
    });
    return res.redirect(`/blog/${req.params.id}`);
  });

  module.exports = router;
    
    
  
   
  
  
  

  
 

    

  
  

      

    
  




