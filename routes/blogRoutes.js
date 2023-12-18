const express = require("express");
const router = express.Router();
const blogControllers = require("../controllers/blogControllers.js");

router.route("/")
    .get(blogControllers.getAllTheBlogs);

router.route("/")
    .post(blogControllers.addBlog)


router.route("/allDelete")
    .delete(blogControllers.deleteAll)

router.route("/")
    .patch(blogControllers.updateBlog)

module.exports = router;