const express = require("express");
const router = express.Router();
const blogControllers = require("../controllers/blogControllers.js");

router.route("/")
    .get(blogControllers.getAllTheBlogs);

router.route("/")
    .post(blogControllers.addBlog)

router.route("/")
    .put(blogControllers.updateBlog)

router.route("/:blogId")
    .get(blogControllers.getSingleBlog)

router.route("/delete")
    .post(blogControllers.deleteBlog);

module.exports = router;