const Post = require('../models/post.model');

const createPost = async ({ title, content, author, tags, published }) => {
 

  
  if (title.length < 3 || title.length > 30) {
    return { error: 'Title must be between 3 and 30 characters long' };
  }

  if (content.length < 3 || content.length > 200) {
    return { error: 'Content must be between 3 and 200 characters long' };
  }

  if (author.length < 3 || author.length > 30) {
    return { error: 'Author must be between 3 and 30 characters long' };
  }

  const post = await Post.create({ title, content, author, tags, published });
  if (!post) {
    return { error: 'Failed to create post' };
  }

  return { data: post };
};

const getPosts = async ({ page = 1, limit = 10 }) => {
  page = Number(page);
  limit = Number(limit);

  const postsPromise = Post.find({})
    .skip((page - 1) * limit)
    .limit(limit);
  const totalPromise = Post.countDocuments();
  const [posts, total] = await Promise.all([postsPromise, totalPromise]);

  if (!posts || posts.length === 0) {
    return { error: 'No posts found' };
  }

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

const getPostById = async (id) => {
  const post = await Post.findOne({ _id: id });
  if (!post) {
    return { error: 'Post not found' };
  }
  return { data: post };
};

const updatePost = async (id, { title, content, author, tags, published }) => {
  if (!title || !content || !author) {
    return { error: 'All fields are required' };
  }

  if (content.length < 3 || content.length > 200) {
    return { error: 'Content must be between 3 and 200 characters long' };
  }
  if (author.length < 3 || author.length > 30) {
    return { error: 'Author must be between 3 and 30 characters long' };
  }

  const updatedPost = await Post.findOneAndUpdate(
    { _id: id },
    { title, content, author, tags, published },
    { new: true }
  );

  if (!updatedPost) {
    return { error: 'Post not found' };
  }

  return { data: updatedPost };
};

const deletePost = async (id) => {
  const deletedPost = await Post.findOneAndDelete({ _id: id });
  if (!deletedPost) {
    return { error: 'Post not found' };
  }
  return { data: deletedPost };
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
};

