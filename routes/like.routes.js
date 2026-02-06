const express = require('express');
const router = express.Router();
const likeController = require('../controllers/like.controller');
const { Authentication } = require('../middlewares/Authentication');
const validate  = require('../middlewares/validate');
const likeSchemas = require('../schemas/likes');


router.post(
    '/',
    Authentication,
    validate(likeSchemas.LikeSchema),
    likeController.toggleLike
);


router.get(
    '/count',
    Authentication,
    validate(likeSchemas.LikeSchema),
    likeController.getLikesCount
);


router.get(
    '/check',
    Authentication,
    validate(likeSchemas.LikeSchema),
    likeController.checkIfLiked
);


router.get(
    '/likers',
    Authentication,
    validate(likeSchemas.GetLikersSchema),
    likeController.getLikersByTarget
);


router.get(
    '/stats',
    Authentication,
    validate(likeSchemas.LikeSchema),
    likeController.getLikeStats
);



module.exports = router;