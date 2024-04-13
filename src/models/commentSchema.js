const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
    comment: {
        type: String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users' 
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blogPosts' 
    }
});


const comments = mongoose.model('comments', commentsSchema);
module.exports = comments;