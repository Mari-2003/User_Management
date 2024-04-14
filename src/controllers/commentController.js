const {validationResponse,successResponse,errorResponse} = require('../exception/responseFormat');


const Comment = require('../models/commentSchema'); 
const blogPost = require('../models/blogPostSchema');

const createComment = async (req, res) => {
    const { postId } = req.query;
    const { commentText } = req.body;
    try {
        const post = await blogPost.findById(postId).populate('comments');
        if (!post) {
            return res.status(404).json(validationResponse(404, "Blog post not found"));
        }
        // Create a new comment
        const newComment = new Comment({
            comment: commentText, 
            author: req.user[0].id, 
            post: postId
        });
        // Save the new comment
        const savedComment = await newComment.save(); 

        // Ensure post.comments is initialized as an array
        if (!post.comments) {
            post.comments = [];
        }

        // Add the comment to the blog post
        post.comments.push(savedComment._id);
        await post.save();
        res.status(201).json(successResponse(201, "Comment posted successfully", savedComment));
    } catch (error) {
        console.log(error)
        res.status(500).json(errorResponse());
    }
};


const updateComment = async (req, res) => {
    const  commentId  = req.params.id;
    const { commentText } = req.body;
    try {
        let comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json(validationResponse(404, "Comment not found"));
        }
        // Update the comment text
        comment.comment = commentText;
        // Save the updated comment
        comment = await comment.save();
        res.status(200).json(successResponse(200, "Comment updated successfully", comment));
    } catch (error) {
        console.log(error)
        res.status(500).json(errorResponse());
    }
};


const deleteComment = async (req, res) => {
    const commentId  = req.params.id;
    try {
       
        const comment = await Comment.findByIdAndDelete(commentId);
        if (!comment) {
            return res.status(404).json(validationResponse(404, "Comment not found"));
        }
        res.status(200).json(successResponse(200, "Comment deleted successfully"));
    } catch (error) {
        res.status(500).json(errorResponse());
    }
};




module.exports = {
    createComment,
    updateComment,
    deleteComment
};
