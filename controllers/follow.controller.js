const followService = require('../services/follow.service');

const followUser = async (req, res, next) => {
    const { userId: followerId } = req.user;
    const { userId: followingId } = req.params;

    try {
        await followService.followUser(followerId, followingId);

        return res.status(201).json({
            message: 'Successfully followed user',
        });
    } catch (err) {
        next(err);
    }
};

const unfollowUser = async (req, res, next) => {
    const { userId: followerId } = req.user;
    const { userId: followingId } = req.params;

    try {
        await followService.unfollowUser(followerId, followingId);

        return res.json({
            message: 'Successfully unfollowed user',
        });
    } catch (err) {
        next(err);
    }
};

const getFollowers = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const result = await followService.getFollowers(userId, req.query);

        return res.json({
            data: result.data,
            pagination: result.pagination,
        });
    } catch (err) {
        next(err);
    }
};

const getFollowing = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const result = await followService.getFollowing(userId, req.query);

        return res.json({
            data: result.data,
            pagination: result.pagination,
        });
    } catch (err) {
        next(err);
    }
};

const getFollowCounts = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const counts = await followService.getFollowCounts(userId);

        return res.json({
            data: counts,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getFollowCounts,
};
