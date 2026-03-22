const Blog = require("../models/blog");
const Comment = require("../models/comment");

const { Router } = require("express");
const multer = require("multer");
const router = Router();
const path = require("path");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});
const upload = multer({ storage });

router.get("/add-new", (req, res) => {
  return res.render("addblog", {
    user: req.user,
  });
});


router.post("/", upload.single("coverimage"), async (req, res) => {

  const { title, body } = req.body;
  const blog = await Blog.create({
    body,
    title,
    createdby: req.user._id,
    coverimageurl: `/uploads/${req.file.filename}`,

  });
  console.log(req.body);
  console.log(req.file);
  return res.redirect(`/blog/${blog._id}`); // home page redirect
});


router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdby");
  const comments = await Comment.find({ blogid: req.params.id }).populate("createdby");
  console.log("blog", blog);
  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  });
});

router.post("/delete/:id", async (req, res) => {

  // login check
  if (!req.user) {
    return res.redirect("/user/signin");
  }

  const blog = await Blog.findById(req.params.id);

  // blog nahi mila
  if (!blog) {
    return res.redirect("/");
  }

  // sirf owner delete kare
  if (blog.createdby.toString() !== req.user._id.toString()) {
    return res.status(403).send("You are not authorized to delete this blog");
  }

  await Blog.findByIdAndDelete(req.params.id);

  return res.redirect("/");
});

//comment route:-start
router.post("/comment/:blogid", async (req, res) => {
  if (!req.user) {
    return res.render("blog", {
      user: null,
      blog: await Blog.findById(req.params.blogid).populate("createdby"),
      comments: await Comment.find({ blogid: req.params.blogid }).populate("createdby"),
      error: "Please create an account or sign in to add a comment."
    });
  }
  const { content } = req.body;
  const comment = await Comment.create({
    content: content,
    blogid: req.params.blogid,
    createdby: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogid}`);
});

module.exports = router;
























