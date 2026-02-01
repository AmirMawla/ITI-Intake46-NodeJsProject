const Post = require('../models/post.model');
const APIError = require('../Errors/APIError');
const PostErrors = require('../Errors/PostErrors');

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

  if (!post.userId || !userId || post.userId.toString() !== userId.toString()) {
    throw PostErrors.UnauthorizedPostAccess;
  }

  const updatedPost = await Post.findByIdAndUpdate(
    id,
    { title, content, author, tags, published, userId: userId },
    { new: true }
  );

  return updatedPost;
};

const deletePost = async (id, userId) => {
  const post = await Post.findById(id);
  if (!post) {
    throw PostErrors.PostNotFound;
  }

  if (!post.userId || !userId || post.userId.toString() !== userId.toString()) {
    throw PostErrors.UnauthorizedPostAccess;
  }

  const deletedPost = await Post.findByIdAndDelete(id);

  return deletedPost;
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
};

