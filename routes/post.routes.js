const validate = require('../middlewares/validate');
const schema = require('../schemas');
const express = require('express');
const { Authentication } = require('../middlewares/Authentication');
const router = express.Router();
const postController = require('../controllers/post.controller');
const commentController = require('../controllers/comment.controller');
const restrictTo = require('../middlewares/restrictTo');
const commentSchemas = require('../schemas/comments');
const imageController = require('../controllers/image.controller');
const upload = require('../middlewares/upload');

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

router.get(
  '/me',
  Authentication,
  validate(schema.Posts.GetAllPostsSchema),
  postController.getMyPosts
);

// Search posts (public)
router.get(
  '/search',
  validate(schema.Posts.searchPostsSchema),
  postController.searchPosts
);

// Get user's drafts (authenticated)
router.get(
  '/drafts',
  Authentication,
  postController.getDrafts
);

// Get post by ID
router.get('/:id', Authentication, postController.getPostById);

// Update post
router.patch(
  '/:id',
  Authentication,
  validate(schema.Posts.UpdatePostSchema),
  postController.updatePost
);

// Delete post
router.delete('/:id', Authentication, postController.deletePost);

// Publish a draft post
router.post(
  '/:id/publish',
  Authentication,
  postController.publishPost
);

// Schedule a post for future publication
router.post(
  '/:id/schedule',
  Authentication,
  postController.schedulePost
);

// Increment view count
router.post(
  '/:id/view',
  postController.viewPost
);

// Get view count
router.get(
  '/:id/views',
  postController.getPostViews
);

// Create comment (authenticated)
router.post(
  '/:postId/comments',
  Authentication,
  validate(commentSchemas.createCommentSchema),
  commentController.createComment
);

router.get(
  '/:postId/comments',
  Authentication,
  validate(schema.Comments.GetPostCommentsSchema),
  commentController.getCommentsByPost
);

router.post(
  '/:postId/comments/:parentCommentId',
  Authentication,
  validate(commentSchemas.AddReplySchema),
  commentController.addReply
);



router.post(
  '/:id/images',
  Authentication,
  upload.uploadPostImages,
  imageController.uploadPostImages
);

router.delete(
  '/:id/images/:imageId',
  Authentication,
  imageController.deletePostImage
);

// Bookmark routes
const bookmarkController = require('../controllers/bookmark.controller');

// Bookmark a post
router.post(
  '/:postId/bookmark',
  Authentication,
  validate(schema.Bookmarks.bookmarkPostSchema),
  bookmarkController.bookmarkPost
);

// Remove bookmark from a post
router.delete(
  '/:postId/bookmark',
  Authentication,
  validate(schema.Bookmarks.bookmarkPostSchema),
  bookmarkController.removeBookmark
);

module.exports = router;

