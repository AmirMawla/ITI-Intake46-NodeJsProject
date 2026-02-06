const commentService = require('../services/comment.service');
const CommentErrors = require('../Errors/CommentErrors');
const Post = require('../models/post.model');
const User = require('../models/user.model');
const emailService = require('../services/email.service');

const createComment = async (req, res) => {
    const { content } = req.body;
    const { postId} = req.params;

    const { userId } = req.user;
    
    const comment = await commentService.createComment(
        { content, postId },
        userId
    );

    const post = await Post.findById(postId)
    .populate('userId', 'name email');

const commenter = await User.findById(userId, 'name email');

if (post && post.userId._id.toString() !== userId.toString()) {
    await emailService.sendCommentNotification(
        post.userId,    
        commenter,     
        post,          
        comment       
    );
}
    
    res.status(201).json({
        data: comment
    });
};


const addReply = async (req, res) => {
    const { content } = req.body;
    const { postId, parentCommentId } = req.params;

    const { userId } = req.user;
    
    const comment = await commentService.addReply(
        { content, postId, parentCommentId },
        userId
    );
    const parentComment = await Comment.findById(parentCommentId)
                    .populate('userId', 'name email');
                
                const replier = await User.findById(userId, 'name email');
                
                if (parentComment && parentComment.userId._id.toString() !== userId.toString()) {
                    await emailService.sendReplyNotification(
                        parentComment.userId,  
                        replier,               
                        parentComment,         
                        comment               
                    );
                }
    
    res.status(201).json({
        data: comment
    });
};

const getAllComments = async (req, res) => {
    const { userId } = req.user;
    const { postId } = req.params;
    
    const result = await commentService.getAllComments(req.query, postId, userId);
    
    res.status(200).json({
        data: result.comments,
        pagination: result.pagination
    });
};


const getCommentById = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;
    
    const comment = await commentService.getCommentById(id, userId);
    
    res.status(200).json({
        data: comment
    });
};


const updateComment = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const { userId } = req.user;
    
    const comment = await commentService.updateCommentById(id, { content }, userId);
    
    res.status(200).json({
        message: 'Comment updated successfully',
        data: comment
    });
};


const deleteComment = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;
    
    const result = await commentService.deleteCommentById(id, userId);
    
    res.status(200).json(result);
};


const getCommentsByPost = async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.user;
    
    const result = await commentService.getCommentsByPost(postId, userId, req.query);
    
    res.status(200).json({
        data: result.comments,
        pagination: result.pagination
    });
};



const getRepliesByComment = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;
    
    const replies = await commentService.getRepliesByComment(id, userId);
    
    res.status(200).json({
        data: replies
    });
};


const getCommentStats = async (req, res) => {
    const { id } = req.params;
    
    const stats = await commentService.getCommentStats(id);
    
    res.status(200).json({
        data: stats
    });
};

module.exports = {
    createComment,
    addReply,
    getAllComments,
    getCommentById,
    updateComment,
    deleteComment,
    getCommentsByPost,
    getRepliesByComment,
    getCommentStats
};