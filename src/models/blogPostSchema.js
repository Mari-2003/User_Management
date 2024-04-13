const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users' 
    }
});

const blogPost = mongoose.model('blogPosts', blogPostSchema); 
module.exports = blogPost;