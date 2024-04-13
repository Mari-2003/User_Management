//Import files
const blogPost = require('../models/blogPostSchema');
const {validationResponse,successResponse,errorResponse} = require('../exception/responseFormat');

const createPost = async(req,res)=>{
    try{
            const { title, content } = req.body;
            const author = req.user[0].id; 
    
            // Check if all required fields are present
            if (!title || !content ) {
                return res.status(400).json(validationResponse(400, "Title and content are required"));
            }
    
            // Create a new blog post
            const newPost = new blogPost({
                title,
                content,
                author
            });

            await newPost.save();
    
            res.status(201).json(successResponse(201, "Blog post created successfully", newPost));

    }catch(error){
        res.status(500).json(errorResponse())
    }
}



const updatePost = async (req, res) => {
    const { postId } = req.params;
    const { title, content } = req.body;
    try {
        let post = await blogPost.findById(postId);
        // Check if the post exists
        if (!post) {
            return res.status(404).json(validationResponse(404, "Post not found"));
        }
        // Update the post fields if provided in the request body
        if (title) {
            post.title = title;
        }
        if (content) {
            post.content = content;
        }
        // Save the updated post
        post = await post.save();
        res.status(200).json(successResponse(200, "Post updated successfully", post));
    } catch (error) {
        res.status(500).json(errorResponse());
    }
};

const deletePost = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await blogPost.findByIdAndDelete(postId);
    
        if (!post) {
            return res.status(404).json(validationResponse(404, "Post not found"));
        }
        res.status(200).json(successResponse(200, "Post deleted successfully", post));
    } catch (error) {
        res.status(500).json(errorResponse());
    }
};

module.exports = {
    createPost,
    updatePost,
    deletePost
};
