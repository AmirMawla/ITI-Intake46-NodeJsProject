const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const User = require('../models/user.model');
const Like = require('../models/like.model');
const APIError = require('../Errors/APIError');
const CommentErrors = require('../Errors/CommentErrors');
const UserErrors = require('../Errors/UserErrors');
const PostErrors = require('../Errors/PostErrors');
const notificationService = require('./notification.service');



const createComment = async (commentData, userId) => {
    const { content, postId } = commentData;


    const post = await Post.findById(postId);
    if (!post) {
        throw PostErrors.PostNotFound;
    }
    const comment = await Comment.create({
        content,
        postId,
        userId,
        parentCommentId: null
    });

    await comment.populate('userId', 'name email');

    // Create notification for post owner
    await notificationService.createNotification({
        userId: post.userId,
        type: 'comment',
        relatedUserId: userId,
        relatedPostId: postId,
        relatedCommentId: comment._id,
    });

    return comment;
};

const addReply = async (commentData, userId) => {
    const { content, postId, parentCommentId } = commentData;


    const post = await Post.findById(postId);
    if (!post) {
        throw PostErrors.PostNotFound;
    }

    if (parentCommentId) {
        const parentComment = await Comment.findById(parentCommentId);
        if (!parentComment) {
            throw CommentErrors.CommentParentNotFound;
        }

        // Check if parent belongs to the same post
        if (parentComment.postId.toString() !== postId.toString()) {
            throw CommentErrors.CommentParentPostMismatch;
        }
    }

    const comment = await Comment.create({
        content,
        postId,
        userId,
        parentCommentId: parentCommentId
    });

    await comment.populate('userId', 'name email');

    // Create notification for parent comment owner (reply notification)
    if (parentCommentId) {
        const parentComment = await Comment.findById(parentCommentId);
        if (parentComment) {
            await notificationService.createNotification({
                userId: parentComment.userId,
                type: 'reply',
                relatedUserId: userId,
                relatedPostId: postId,
                relatedCommentId: comment._id,
            });
        }
    }

    return comment;
};



const getAllComments = async (query, postId, userId) => {
    let { page = 1, limit = 10 } = query;

    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const filter = {};
    if (postId) {
        filter.postId = postId;
    }

    // Only get top-level comments (no parent)
    //   filter.parentCommentId = null;

    const comments = await Comment.find(filter)
        .populate('userId', 'name email')
        .populate({
            path: 'replies',
            populate: {
                path: 'userId',
                select: 'name email'
            }
        })
        .skip(skip)
        .limit(limit);

    const total = await Comment.countDocuments(filter);

    // Add isOwner and isLiked flags
    const commentsWithFlags = await Promise.all(comments.map(async (comment) => {
        const commentObj = comment.toObject();
        commentObj.isOwner = userId ? comment.userId._id.toString() === userId.toString() : false;
        commentObj.isLiked = userId ? await Like.isLikedByUser(userId, 'Comment', comment._id) : false;

        // Add flags to replies
        if (commentObj.replies) {
            commentObj.replies = await Promise.all(commentObj.replies.map(async (reply) => {
                reply.isOwner = userId ? reply.userId._id.toString() === userId.toString() : false;
                reply.isLiked = userId ? await Like.isLikedByUser(userId, 'Comment', reply._id) : false;
                return reply;
            }));
        }

        return commentObj;
    }));
    return {
        comments: commentsWithFlags,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    };
};

const getCommentById = async (id, userId) => {
    const comment = await Comment.findById(id)
        .populate('userId', 'name email')
        .populate({
            path: 'replies',
            populate: {
                path: 'userId',
                select: 'name email'
            }
        });

    if (!comment) {
        throw CommentErrors.CommentNotFound;
    }

    const commentObj = comment.toObject();
    commentObj.isOwner = userId ? comment.userId._id.toString() === userId.toString() : false;
    commentObj.isLiked = userId ? await Like.isLikedByUser(userId, 'Comment', comment._id) : false;

    // Add flags to replies
    if (commentObj.replies) {
        commentObj.replies = await Promise.all(commentObj.replies.map(async (reply) => {
            reply.isOwner = userId ? reply.userId._id.toString() === userId.toString() : false;
            reply.isLiked = userId ? await Like.isLikedByUser(userId, 'Comment', reply._id) : false;
            return reply;
        }));
    }

    return commentObj;
};


const updateCommentById = async (id, commentData, userId) => {
    const comment = await Comment.findById(id);
    if (!comment) {
        throw CommentErrors.CommentNotFound;
    }
    const user = await User.findById(userId);
    if (!user) {
        throw UserErrors.UserNotFound;
    }

    if (comment.userId.toString() !== userId.toString() && user.role !== 'admin') {
        throw CommentErrors.UnauthorizedCommentAccess;
    }
    const { content } = commentData;

    comment.content = content;
    comment.isEdited = true;
    comment.editedAt = new Date();

    await comment.save();
    await comment.populate('userId', 'name email');

    return comment;
};


const deleteCommentById = async (id, userId) => {
    const comment = await Comment.findById(id);

    if (!comment) {
        throw CommentErrors.CommentNotFound;
    }

    const user = await User.findById(userId);
    if (!user) {
        throw UserErrors.UserNotFound;
    }

    const isCommentAuthor = comment.userId.toString() === userId.toString();


    const post = await Post.findById(comment.postId);
    const isPostAuthor = post && post.userId.toString() === userId.toString();

    if (!isCommentAuthor && !isPostAuthor && user.role !== 'admin') {
        throw CommentErrors.UnauthorizedCommentAccess;
    }


    await Comment.deleteMany({ parentCommentId: id });


    await Like.deleteMany({ targetType: 'Comment', targetId: id });

    await comment.deleteOne();

    return { message: 'Comment deleted successfully' };
};


const getCommentsByPost = async (postId, userId, query = {}) => {
    let { page = 1, limit = 10 } = query;

    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;


    const post = await Post.findById(postId);
    if (!post) {
        throw PostErrors.PostNotFound;
    }
    const filter = {};
    filter.postId = postId;
    // Only get top-level comments (no parent)
    filter.parentCommentId = null;

    const comments = await Comment.find(filter)
        .populate('userId', 'name email')
        .populate({
            path: 'replies',
            populate: {
                path: 'userId',
                select: 'name email'
            }
        })
        .skip(skip)
        .limit(limit);

    const total = await Comment.countDocuments(filter);

    // Add isOwner and isLiked flags
    const commentsWithFlags = await Promise.all(comments.map(async (comment) => {
        const commentObj = comment.toObject();
        commentObj.isOwner = userId ? comment.userId._id.toString() === userId.toString() : false;
        commentObj.isLiked = userId ? await Like.isLikedByUser(userId, 'Comment', comment._id) : false;

        // Add flags to replies
        if (commentObj.replies) {
            commentObj.replies = await Promise.all(commentObj.replies.map(async (reply) => {
                reply.isOwner = userId ? reply.userId._id.toString() === userId.toString() : false;
                reply.isLiked = userId ? await Like.isLikedByUser(userId, 'Comment', reply._id) : false;
                return reply;
            }));
        }

        return commentObj;
    }));
    return {
        comments: commentsWithFlags,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    };
};



const getRepliesByComment = async (commentId, userId) => {
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw CommentErrors.CommentNotFound;
    }

    const replies = await Comment.find({ parentCommentId: commentId })
        .populate('userId', 'name email')
        .sort({ createdAt: 1 });

    // Add isOwner and isLiked flags
    const repliesWithFlags = await Promise.all(replies.map(async (reply) => {
        const replyObj = reply.toObject();
        replyObj.isOwner = userId ? reply.userId._id.toString() === userId.toString() : false;
        replyObj.isLiked = userId ? await Like.isLikedByUser(userId, 'Comment', reply._id) : false;
        return replyObj;
    }));

    return repliesWithFlags;
};



const getCommentStats = async (commentId) => {
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw CommentErrors.CommentNotFound;
    }

    const repliesCount = await Comment.countDocuments({ parentCommentId: commentId });
    const likesCount = await Like.getLikesCount('Comment', commentId);

    return {
        commentId,
        repliesCount,
        likesCount,
        isEdited: comment.isEdited,
        editedAt: comment.editedAt,
        createdAt: comment.createdAt
    };
};


module.exports = {
    createComment,
    addReply,
    getAllComments,
    getCommentById,
    updateCommentById,
    deleteCommentById,
    getCommentsByPost,
    getRepliesByComment,
    getCommentStats
};
