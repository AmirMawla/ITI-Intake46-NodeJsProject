const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
    },
    { timestamps: true }
);

// Compound unique index to prevent duplicate bookmarks
bookmarkSchema.index({ userId: 1, postId: 1 }, { unique: true });

// Index for efficient querying
bookmarkSchema.index({ userId: 1, createdAt: -1 });

// Static method to check if post is bookmarked
bookmarkSchema.statics.isBookmarked = async function (userId, postId) {
    const bookmark = await this.findOne({ userId, postId });
    return !!bookmark;
};

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;
