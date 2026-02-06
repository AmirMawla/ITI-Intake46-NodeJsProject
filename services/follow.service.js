const Follow = require('../models/follow.model');
const User = require('../models/user.model');
const FollowErrors = require('../Errors/FollowErrors');
const notificationService = require('./notification.service');

const followUser = async (followerId, followingId) => {
    // Check if trying to follow self
    if (followerId.toString() === followingId.toString()) {
        throw FollowErrors.CannotFollowSelf;
    }

    // Check if user to follow exists
    const userToFollow = await User.findById(followingId);
    if (!userToFollow) {
        throw FollowErrors.UserNotFound;
    }

    // Check if already following
    const existingFollow = await Follow.findOne({ followerId, followingId });
    if (existingFollow) {
        throw FollowErrors.AlreadyFollowing;
    }

    const follow = await Follow.create({ followerId, followingId });

    // Create notification for the followed user
    await notificationService.createNotification({
        userId: followingId,
        type: 'follow',
        relatedUserId: followerId,
    });

    return follow;
};

const unfollowUser = async (followerId, followingId) => {
    const follow = await Follow.findOneAndDelete({ followerId, followingId });
    if (!follow) {
        throw FollowErrors.NotFollowing;
    }
    return follow;
};

const getFollowers = async (userId, { page = 1, limit = 10 }) => {
    page = Number(page);
    limit = Number(limit);

    const followsPromise = Follow.find({ followingId: userId })
        .populate('followerId', 'name email profilePicture')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    const totalPromise = Follow.countDocuments({ followingId: userId });
    const [follows, total] = await Promise.all([followsPromise, totalPromise]);

    const data = follows.map(f => f.followerId);

    return {
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

const getFollowing = async (userId, { page = 1, limit = 10 }) => {
    page = Number(page);
    limit = Number(limit);

    const followsPromise = Follow.find({ followerId: userId })
        .populate('followingId', 'name email profilePicture')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    const totalPromise = Follow.countDocuments({ followerId: userId });
    const [follows, total] = await Promise.all([followsPromise, totalPromise]);

    const data = follows.map(f => f.followingId);

    return {
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

const getFollowCounts = async (userId) => {
    const [followers, following] = await Promise.all([
        Follow.getFollowerCount(userId),
        Follow.getFollowingCount(userId),
    ]);

    return { followers, following };
};

const isFollowing = async (followerId, followingId) => {
    return await Follow.isFollowing(followerId, followingId);
};

module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getFollowCounts,
    isFollowing,
};
