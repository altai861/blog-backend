const Blog = require("../models/Blog")
const User = require("../models/User")

const getAllTheBlogs = async (req, res) => {
    const blogs = await Blog.find().lean();
    if (!blogs?.length) {
        return res.status(200).json({ message: 'No blogs' })
    }
    return res.json(blogs);
}

const addBlog = async (req, res) => {
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ message: "UserId is required" });

    const foundUser = await User.findOne({ _id: userId }).exec();

    if (!foundUser) return res.status(400).json({ message: "No user found" });

    const content = {
        "time": new Date().getTime(),
        "blocks": [
            {
                "type": "header",
                "data": {
                    "text": "Hi",
                    "level": 1
                }
            },
        ]
    }

    const blog = await Blog.create({ userId, blogContent: content })

    if (blog) {
        return res.status(201).json(blog);
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

const deleteAll = async (req, res) => {
    await Blog.deleteMany()
    .then(() => {
        return res.status(201).json({ message: "Deleted all blogs" })
    })
    .catch((err) => {
        console.log(err)
        return res.status(500).json({ message: "Internal server error" })
    })
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
    deleteAll,
    updateBlog,
    getSingleBlog,
    deleteBlog
}