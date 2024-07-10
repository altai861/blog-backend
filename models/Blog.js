const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    blogContent: {
        type: Object
    }
})

module.exports = mongoose.model("Blog", blogSchema);