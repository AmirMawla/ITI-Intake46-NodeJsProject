const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetType: {
        type: String,
        required:true,
        enum: {
            values: ['Post', 'Comment'],
            message: 'Target type must be either Post or Comment'
        }
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'targetType'
    }
}, {
    timestamps: true
});


likeSchema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true });


likeSchema.index({ targetType: 1, targetId: 1 });


likeSchema.index({ userId: 1, createdAt: -1 });



// Static method to toggle like
likeSchema.statics.toggleLike = async function(userId, targetType, targetId) {
    const existingLike = await this.findOne({ userId, targetType, targetId });
    
    if (existingLike) {
        // Unlike
        await existingLike.deleteOne();
        return { liked: false, action: 'unliked' };
    } else {
        // Like
        await this.create({ userId, targetType, targetId });
        return { liked: true, action: 'liked' };
    }
};

// Static method to get likes count
likeSchema.statics.getLikesCount = async function(targetType, targetId) {
    return await this.countDocuments({ targetType, targetId });
};

// Static method to check if user liked
likeSchema.statics.isLikedByUser = async function(userId, targetType, targetId) {
    const like = await this.findOne({ userId, targetType, targetId });
    return !!like;
};

module.exports = mongoose.model('Like', likeSchema);