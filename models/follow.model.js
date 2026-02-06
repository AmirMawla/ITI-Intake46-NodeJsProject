const mongoose = require('mongoose');

const followSchema = new mongoose.Schema(
    {
        followerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        followingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

// Compound unique index to prevent duplicate follows
followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

// Indexes for efficient querying
followSchema.index({ followerId: 1, createdAt: -1 });
followSchema.index({ followingId: 1, createdAt: -1 });

// Static method to get follower count
followSchema.statics.getFollowerCount = async function (userId) {
    return await this.countDocuments({ followingId: userId });
};

// Static method to get following count
followSchema.statics.getFollowingCount = async function (userId) {
    return await this.countDocuments({ followerId: userId });
};

// Static method to check if user is following another user
followSchema.statics.isFollowing = async function (followerId, followingId) {
    const follow = await this.findOne({ followerId, followingId });
    return !!follow;
};

const Follow = mongoose.model('Follow', followSchema);

module.exports = Follow;
