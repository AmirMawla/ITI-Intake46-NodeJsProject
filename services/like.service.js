const Like = require('../models/like.model');
const Post = require('../models/post.model');
const Comment = require('../models/comment.model');
const LikeErrors = require('../Errors/LikeErrors');
const notificationService = require('./notification.service');


const toggleLike = async (userId, targetType, targetId) => {
    // Verify target exists
    let targetOwnerId = null;
    let relatedPostId = null;
    let relatedCommentId = null;

    if (targetType === 'Post') {
        const post = await Post.findById(targetId);
        if (!post) {
            throw LikeErrors.PostNotFound;
        }
        if (post.userId.toString() != userId.toString()) {
            throw LikeErrors.UnauthorizedLikeAccess;
        }
        targetOwnerId = post.userId;
        relatedPostId = targetId;
    } else if (targetType === 'Comment') {
        const comment = await Comment.findById(targetId);
        if (!comment) {
            throw LikeErrors.CommentNotFound;
        }
        if (comment.userId.toString() != userId.toString()) {
            throw LikeErrors.UnauthorizedLikeAccess;
        }
        targetOwnerId = comment.userId;
        relatedCommentId = targetId;
        relatedPostId = comment.postId;
    }

    const result = await Like.toggleLike(userId, targetType, targetId);

    // Update likes count on the target
    if (targetType === 'Post') {
        await Post.updateLikesCount(targetId);
    } else if (targetType === 'Comment') {
        await Comment.updateLikesCount(targetId);
    }

    // Create notification if the like was added (not removed)
    if (result.liked && targetOwnerId) {
        await notificationService.createNotification({
            userId: targetOwnerId,
            type: 'like',
            relatedUserId: userId,
            relatedPostId,
            relatedCommentId,
        });
    }

    return result;
};


const getLikesCount = async (targetType, targetId) => {
    return await Like.getLikesCount(targetType, targetId);
};


const isLikedByUser = async (userId, targetType, targetId) => {
    return await Like.isLikedByUser(userId, targetType, targetId);
};






const getUserLikes = async (userId, query) => {
    let { page = 1, limit = 10, targetType } = query;

    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const filter = { userId };
    if (targetType) {
        filter.targetType = targetType;
    }

    const likes = await Like.find(filter)
        .populate('targetId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Like.countDocuments(filter);

    return {
        likes,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    };
};


const getLikersByTarget = async (targetType, targetId, query) => {
    let { page = 1, limit = 10 } = query;

    page = Number(page);
    limit = Number(limit);

    if (targetType === 'Post') {
        const post = await Post.findById(targetId);
        if (!post) {
            throw LikeErrors.PostNotFound;
        }
    } else if (targetType === 'Comment') {
        const comment = await Comment.findById(targetId);
        if (!comment) {
            throw LikeErrors.CommentNotFound;
        }
    }

    const skip = (page - 1) * limit;

    const likes = await Like.find({ targetType, targetId })
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Like.countDocuments({ targetType, targetId });

    const users = likes.map(like => ({
        user: like.userId,
        likedAt: like.createdAt
    }));

    return {
        users,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    };
};


const getLikeStats = async (targetType, targetId) => {
    // Verify target exists
    if (targetType === 'Post') {
        const post = await Post.findById(targetId);
        if (!post) {
            throw LikeErrors.PostNotFound;
        }
    } else if (targetType === 'Comment') {
        const comment = await Comment.findById(targetId);
        if (!comment) {
            throw LikeErrors.CommentNotFound;
        }
    }

    const totalLikes = await Like.getLikesCount(targetType, targetId);
    const recentLikes = await Like.find({ targetType, targetId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('userId', 'name email');

    return {
        targetType,
        targetId,
        totalLikes,
        recentLikes: recentLikes.map(like => ({
            user: like.userId,
            likedAt: like.createdAt
        }))
    };
};


const removeAllLikesForTarget = async (targetType, targetId) => {
    const result = await Like.deleteMany({ targetType, targetId });
    return { deletedCount: result.deletedCount };
};

module.exports = {
    toggleLike,
    getLikesCount,
    isLikedByUser,
    getUserLikes,
    getLikersByTarget,
    getLikeStats,
    removeAllLikesForTarget
};