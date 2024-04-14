const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const {verifyToken} = require('../middleware/verifyToken');
const blogPostController = require('../controllers/blogPostController');
const commentController = require('../controllers/commentController');



// Route the API calls
router.post('/signup', userController.signUp)
router.post('/login', userController.login);
router.put('/user', verifyToken,userController.updateUser);
router.get('/user', verifyToken, userController.getOneUserDetails);
router.get('/alluser', verifyToken, userController.getAllUserDetails);

//Route in BlogPost
router.post ('/post',verifyToken, blogPostController.createPost);
router.put('/post/:id', verifyToken,blogPostController.updatePost);
router.delete('/post/:id',verifyToken, blogPostController.deletePost);
router.get('/post/:id', verifyToken, blogPostController.getOnePost);

//Route in Comments
router.post('/comment',verifyToken, commentController.createComment);
router.put('/comment/:id', verifyToken, commentController.updateComment);
router.delete('/comment/:id', verifyToken, commentController.deleteComment);

module.exports = router;
