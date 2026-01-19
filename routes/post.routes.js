const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');

router.post('/', postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.patch('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;

