const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: [3],
      maxlength: [30],
    },
    content: {
      type: String,
      required: true,
      minlength: [3],
      maxlength: [200],
    },
    tags: {
      type: [String],
      required: false,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled'],
      default: 'draft',
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    images: [{
      url: {
        type: String,
        required: true
      },
      fileId: {
        type: String,
        required: true
      }
    }],
  },
  { timestamps: true }
);

// Text index for full-text search on title and content
postSchema.index({ title: 'text', content: 'text' });

// Index for status and publishedAt for scheduled posts queries
postSchema.index({ status: 1, publishedAt: 1 });

postSchema.statics.updateLikesCount = async function (postId) {
  const Like = mongoose.model('Like');
  const count = await Like.countDocuments({
    targetType: 'Post',
    targetId: postId
  });

  await this.findByIdAndUpdate(postId, { likes: count });
};


const Post = mongoose.model('Post', postSchema);

module.exports = Post;