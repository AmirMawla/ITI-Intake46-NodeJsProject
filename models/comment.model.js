const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      minlength: [1],
      maxlength: [1000],
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      required: false,
    },
    likes: {
      type: Number,
      default: 0,
    },
    isEdited: {
      type: Boolean,
      default: false,
      required: false,
    },
    editedAt: {
      type: Date,
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }
  },
  { timestamps: true }
);


commentSchema.index({ postId: 1, createdAt: -1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ parentCommentId: 1 });


commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentCommentId'
});

// Method to check nesting depth
commentSchema.methods.getDepth = async function() {
  let depth = 0;
  let current = this;
  
  while (current.parentCommentId) {
      depth++;
      current = await mongoose.model('Comment').findById(current.parentCommentId);
      if (!current) break;
  }
  
  return depth;
};


commentSchema.statics.updateLikesCount = async function(commentId) {
  const Like = mongoose.model('Like');
  const count = await Like.countDocuments({ 
      targetType: 'Comment', 
      targetId: commentId 
  });
  
  await this.findByIdAndUpdate(commentId, { likes: count });
};

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;