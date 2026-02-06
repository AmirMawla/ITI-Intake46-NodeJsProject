const Post = require('../models/post.model');
const APIError = require('../Errors/APIError');
const PostErrors = require('../Errors/PostErrors');
const UserErrors = require('../Errors/UserErrors');
const User = require('../models/user.model');

const createPost = async ({ title, content, author, tags, published, userId }) => {
  const post = await Post.create({ title, content, author, tags, published, userId });
  if (!post) {
    throw new APIError('Failed to create post', 500);
  }

  return post;
};

const getPosts = async ({ page = 1, limit = 10 }, userId) => {
  page = Number(page);
  limit = Number(limit);

  const postsPromise = Post.find({})
    .populate('userId', 'name email')
    .skip((page - 1) * limit)
    .limit(limit);

  const totalPromise = Post.countDocuments();
  const [posts, total] = await Promise.all([postsPromise, totalPromise]);

  const data = posts.map((post) => {
    const obj = post.toObject();
    const ownerId = obj.userId?._id?.toString();
    obj.isOwner = ownerId && userId ? ownerId === userId.toString() : false;
    return obj;
  });

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

const getMyPosts = async ({ page = 1, limit = 10 }, userId) => {
  page = Number(page);
  limit = Number(limit);

  const postsPromise = Post.find({ userId: userId })
    .populate('userId', 'name email')
    .skip((page - 1) * limit)
    .limit(limit);

  const totalPromise = Post.countDocuments({ userId: userId });
  const [posts, total] = await Promise.all([postsPromise, totalPromise]);

  const data = posts.map((post) => {
    const obj = post.toObject();
    const ownerId = obj.userId?._id?.toString();
    obj.isOwner = ownerId && userId ? ownerId === userId.toString() : false;
    return obj;
  });

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

const getPostById = async (id, userId) => {
  const post = await Post.findById(id).populate('userId', 'name email');
  if (!post) {
    throw PostErrors.PostNotFound;
  }

  const obj = post.toObject();
  const ownerId = obj.userId?._id?.toString();
  obj.isOwner = ownerId && userId ? ownerId === userId.toString() : false;

  return obj;
};

const updatePost = async (id, { title, content, author, tags, published }, userId) => {
  const post = await Post.findById(id);
  if (!post) {
    throw PostErrors.PostNotFound;
  }

  const user = await User.findById(userId);
  if (!user) {
    throw UserErrors.UserNotFound;
  }
  if ((!post.userId || !userId || post.userId.toString() !== userId.toString()) && user.role !== 'admin') {
    throw PostErrors.UnauthorizedPostAccess;
  }

  const updatedPost = await Post.findByIdAndUpdate(
    id,
    { title, content, author, tags, published, userId: userId },
    { new: true }
  );

  if (!updatedPost) {
    throw PostErrors.PostNotFound;
  }

  return updatedPost;
};

const deletePost = async (id, userId) => {
  const post = await Post.findById(id);
  if (!post) {
    throw PostErrors.PostNotFound;
  }
  const user = await User.findById(userId);
  if (!user) {
    throw UserErrors.UserNotFound;
  }

  if ((!post.userId || !userId || post.userId.toString() !== userId.toString()) && user.role !== 'admin') {
    throw PostErrors.UnauthorizedPostAccess;
  }

  const deletedPost = await Post.findByIdAndDelete(id);
  if (!deletedPost) {
    throw PostErrors.PostNotFound;
  }
  return deletedPost;
};

const searchPosts = async ({ q, tags, startDate, endDate, page = 1, limit = 10 }) => {
  page = Number(page);
  limit = Number(limit);

  // Build query using text search
  const query = {
    $text: { $search: q },
    status: 'published'
  };

  // Add tag filter if provided
  if (tags) {
    const tagArray = Array.isArray(tags) ? tags : [tags];
    query.tags = { $in: tagArray };
  }

  // Add date range filter if provided
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {
      query.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      query.createdAt.$lte = new Date(endDate);
    }
  }

  const postsPromise = Post.find(query, { score: { $meta: 'textScore' } })
    .populate('userId', 'name email')
    .sort({ score: { $meta: 'textScore' } })
    .skip((page - 1) * limit)
    .limit(limit);

  const totalPromise = Post.countDocuments(query);
  const [posts, total] = await Promise.all([postsPromise, totalPromise]);

  return {
    data: posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const incrementPostViews = async (postId) => {
  const post = await Post.findByIdAndUpdate(
    postId,
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!post) {
    throw PostErrors.PostNotFound;
  }

  return post;
};

const getPostViews = async (postId) => {
  const post = await Post.findById(postId, 'views');

  if (!post) {
    throw PostErrors.PostNotFound;
  }

  return { views: post.views };
};

const getDrafts = async ({ page = 1, limit = 10 }, userId) => {
  page = Number(page);
  limit = Number(limit);

  const query = { userId, status: 'draft' };

  const postsPromise = Post.find(query)
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const totalPromise = Post.countDocuments(query);
  const [posts, total] = await Promise.all([postsPromise, totalPromise]);

  return {
    data: posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const publishPost = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw PostErrors.PostNotFound;
  }

  if (post.userId.toString() !== userId.toString()) {
    throw PostErrors.UnauthorizedPostAccess;
  }

  if (post.status === 'published') {
    throw PostErrors.PostAlreadyPublished;
  }

  post.status = 'published';
  post.publishedAt = new Date();
  await post.save();

  return post;
};

const schedulePost = async (postId, publishedAt, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw PostErrors.PostNotFound;
  }

  if (post.userId.toString() !== userId.toString()) {
    throw PostErrors.UnauthorizedPostAccess;
  }

  const scheduledDate = new Date(publishedAt);
  if (scheduledDate <= new Date()) {
    throw new APIError('Scheduled date must be in the future', 400);
  }

  post.status = 'scheduled';
  post.publishedAt = scheduledDate;
  await post.save();

  return post;
};

const publishScheduledPosts = async () => {
  const now = new Date();
  const result = await Post.updateMany(
    { status: 'scheduled', publishedAt: { $lte: now } },
    { status: 'published' }
  );
  return result.modifiedCount;
};

module.exports = {
  createPost,
  getPosts,
  getMyPosts,
  getPostById,
  updatePost,
  deletePost,
  searchPosts,
  incrementPostViews,
  getPostViews,
  getDrafts,
  publishPost,
  schedulePost,
  publishScheduledPosts,
};

