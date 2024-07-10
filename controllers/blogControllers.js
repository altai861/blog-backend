const Blog = require("../models/Blog")
const Meta = require("../models/Meta");

const updateMetaInfoFromContent = async (blogId, content) => {
    try {
        // title
        // categories
        // modifiedDate
        // imageLink
        const blocks = content.blocks;
        const result = {};
        let foundTitle = false
        let foundCategories = false;
        let foundImage = false;
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i].type === "header" && !foundTitle) {
                result["title"] = blocks[i].data.text;
                foundTitle = true
            } else if (blocks[i].type === "image" && !foundImage) {
                result["imageLink"] = blocks[i].data.url
                foundImage = true
            } else if (blocks[i].type === "paragraph" && !foundCategories) {
                if (blocks[i].data.text.toLowerCase().startsWith("tag:")) {
                    result["categories"] = blocks[i].data.text.substring(4);
                    foundCategories = true;
                }
            }
            if (foundCategories && foundImage && foundTitle) {
                break;
            }
        }
        if (!foundTitle) {
            result["title"] = "No Title"
        }
        if (!foundCategories) {
            result["categories"] = ""
        }
        if (!foundImage) {
            result["imageLink"] = "https://i.pinimg.com/736x/2c/b9/08/2cb908d9f969eede348d7ef1ce56a62c.jpg"
        }
        result["modifiedDate"] = new Date();
        const meta = await Meta.findOne({ blogId: blogId }).exec();
        if (!meta) {
            console.error('Meta information not found');
            return;
        }
        meta.title = result["title"];
        meta.categories = result["categories"];
        meta.imageLink = result["imageLink"];
        meta.modifiedDate = result["modifiedDate"];
        await meta.save();
    } catch (error) {
        console.error('Error fetching meta information:', error);
    }

}

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
        await updateMetaInfoFromContent(blog._id, content);
        return res.status(201).json(meta);
    } else {
        return res.status(401).json({ message: "Blog could not created" });
    }

}

const updateBlog = async (req, res) => {
    const { blogId, content } = req.body
    await updateMetaInfoFromContent(blogId, content)
    const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          blogContent: content
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
    const meta = await Meta.findOne({ blogId }).exec();
    const result = await blog.deleteOne();
    const deletedMeta = await meta.deleteOne();
    const reply = `${result._id} ${deletedMeta._id} deleted`;

    return res.json(reply)
}   


const getSingleBlog = async (req, res) => {
    const blogId = req.params.blogId;
    console.log(blogId)
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