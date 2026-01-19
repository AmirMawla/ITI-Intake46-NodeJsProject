const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true ,
            minlength: [3] ,
            maxlength: [30] 
        },
        content: {
            type: String,
            required: true ,
            minlength: [3] ,
            maxlength: [200]
        },
        author: {
            type: String, 
            required : true ,
            minlength: [3] ,
            maxlength: [30] 
        },
        tags: {
            type:[String],
            required: false 
        },
        published: {
            type: Boolean,
            default: false 
        },
        likes: {
            type: Number,
            default: 0 
        }
    },
    {timestamps: true}
) 

const Post = mongoose.model('Post', postSchema);

module.exports = Post;