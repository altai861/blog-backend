const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    blogDate: {
        type: Date,
        default: Date.now()
    },
    blogContent: {
        type: Object
    },
    categories: {
        type: [String],
        default: []
    },
    public: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("Blog", blogSchema);