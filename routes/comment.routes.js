const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { Authentication } = require('../middlewares/Authentication');
const  validate  = require('../middlewares/validate');
const commentSchemas = require('../schemas/comments');
const restrictTo = require('../middlewares/restrictTo');



router.get(
    '/',
    Authentication,
    restrictTo('admin'),
    validate(commentSchemas.GetCommentsSchema),
    commentController.getAllComments
);


router.get(
    '/:id',
    Authentication,
    commentController.getCommentById
);


router.patch(
    '/:id',
    Authentication,
    validate(commentSchemas.UpdateCommentSchema),
    commentController.updateComment
);


router.delete(
    '/:id',
    Authentication,
    commentController.deleteComment
);


router.get(
    '/:id/replies',
    Authentication,
    commentController.getRepliesByComment
);


router.get(
    '/:id/stats',
    Authentication,
    validate(commentSchemas.commentIdSchema),
    commentController.getCommentStats
);

module.exports = router;