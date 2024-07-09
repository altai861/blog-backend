const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const metaSchema = new Schema({
    blogId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    categories: {
        type: [String],
        default: []
    },
    createdDate: {
        type: Date,
        required: true
    },
    modifiedDate: {
        type: Date,
        required: true
    },
    imageLink: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model("Meta", metaSchema);