const validate = require('../middlewares/validate');
const schema = require('../schemas');
const express = require('express');
const { Authentication } = require('../middlewares/Authentication');
const router = express.Router();
const postController = require('../controllers/post.controller');

router.post(
  '/',
  Authentication,
  validate(schema.Posts.createpostSchema),
  postController.createPost
);
router.get(
  '/',
  Authentication,
  validate(schema.Posts.GetAllPostsSchema),
  postController.getAllPosts
);
router.get('/:id', Authentication, postController.getPostById);
router.patch(
  '/:id',
  Authentication,
  validate(schema.Posts.UpdatePostSchema),
  postController.updatePost
);
router.delete('/:id', Authentication, postController.deletePost);

module.exports = router;

