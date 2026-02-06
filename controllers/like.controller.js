const likeService = require('../services/like.service');
const LikeErrors = require('../Errors/LikeErrors');


const toggleLike = async (req, res) => {
    const { targetType, targetId } = req.query;
    const { userId } = req.user;
    
    const result = await likeService.toggleLike(userId, targetType, targetId);
    
    const likesCount = await likeService.getLikesCount(targetType, targetId);
    
    res.status(200).json({
        data: {
            ...result,
            likesCount
        }
    });
};


const getLikesCount = async (req, res) => {
    const { targetType, targetId } = req.query;
    
    if (!targetType || !targetId) {
        throw LikeErrors.MissingParameters;
    }
    
    const count = await likeService.getLikesCount(targetType, targetId);
    
    res.status(200).json({
        data: {
            targetType,
            targetId,
            count
        }
    });
};


const checkIfLiked = async (req, res) => {
    const { targetType, targetId } = req.query;
    const { userId } = req.user;
    
    if (!targetType || !targetId) {
        throw LikeErrors.MissingParameters;
    }
    
    const isLiked = await likeService.isLikedByUser(userId, targetType, targetId);
    
    res.status(200).json({
        data: {
            isLiked
        }
    });
};


const getUserLikes = async (req, res) => {
    const { userId } = req.params;
    
    const result = await likeService.getUserLikes(userId, req.query);
    
    res.status(200).json({
        data: result.likes,
        pagination: result.pagination
    });
};


const getLikersByTarget = async (req, res) => {
    const { targetType, targetId } = req.query;
    
    if (!targetType || !targetId) {
        throw LikeErrors.MissingParameters;
    }
    
    const result = await likeService.getLikersByTarget(targetType, targetId, req.query);
    
    res.status(200).json({
        data: result.users,
        pagination: result.pagination
    });
};


const getLikeStats = async (req, res) => {
    const { targetType, targetId } = req.query;
    
    if (!targetType || !targetId) {
        throw LikeErrors.MissingParameters;
    }
    
    const stats = await likeService.getLikeStats(targetType, targetId);
    
    res.status(200).json({
        data: stats
    });
};

module.exports = {
    toggleLike,
    getLikesCount,
    checkIfLiked,
    getUserLikes,
    getLikersByTarget,
    getLikeStats
};