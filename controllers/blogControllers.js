const Blog = require("../models/Blog")
const User = require("../models/User")
const Meta = require("../models/Meta");

const getAllTheBlogs = async (req, res) => {
    const blogs = await Meta.find().lean();
    if (!blogs?.length) {
        return res.status(200).json({ message: 'No blogs' })
    }
    return res.json(blogs);
}

const addBlog = async (req, res) => {
    const { content } = req.body;

    if (!content) return res.status(400).json({ message: "Fields are required" });

    const blog = await Blog.create({ blogContent: content })

    if (blog) {
        const meta = await Meta.create({ blogId: blog._id, title: "TEST", createdDate: new Date(), modifiedDate: new Date() });
        return res.status(201).json(meta);
    } else {
        return res.status(401).json({ message: "Blog could not created" });
    }

}

const updateBlog = async (req, res) => {
    const { userId, blogId, blogContent, categories, public } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          blogContent: blogContent,
          categories: categories,
          public: public
        },
        { new: true } // This option ensures that the updated document is returned
      );
  
      if (!updatedBlog) {
        return res.status(404).json({ error: 'Blog not found' });
      }
      res.json(updatedBlog);
}

const deleteBlog = async (req, res) => {
    const { blogId } = req.body;
    if (!blogId) {
        return res.status(401).json({ message: "BlogId is required" });
    }
    const blog = await Blog.findById(blogId).exec();
    const result = await blog.deleteOne();
    const reply = `${result._id} deleted`;

    return res.json(reply)
}   


const getSingleBlog = async (req, res) => {
    const blogId = req.params.blogId;
    const blog = await Blog.findById(blogId).exec();
    if (!blog) {
        return res.status(400).json({ message: "Blog not found" });
    }
    return res.json(blog)
}


module.exports = {
    getAllTheBlogs,
    addBlog,
    updateBlog,
    getSingleBlog,
    deleteBlog
}