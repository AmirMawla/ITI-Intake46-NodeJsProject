const postService = require('../services/post.service');
const APIError = require('../Errors/APIError');

const createPost = async (req, res, next) => {
  const { title, content, author, tags, published } = req.body;
  const { userId } = req.user;

  try {
    const post = await postService.createPost({
      title,
      content,
      author,
      tags,
      published,
      userId
    });

    return res.status(201).json({ data: post });
  } catch (err) {
    next(err);
  }
};

const getAllPosts = async (req, res, next) => {
  const { userId } = req.user;

  try {
    const result = await postService.getPosts(req.query, userId);

    return res.json({
      data: result.data,
      pagenation: result.pagination,
    });
  } catch (err) {
    next(err);
  }
};

const getPostById = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const post = await postService.getPostById(id, userId);

    if (!post) {
      throw new APIError('Post not found', 404);
    }

    return res.json({ data: post });
  } catch (err) {
   next(err);
  }
};

const updatePost = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const updatedPost = await postService.updatePost(id, req.body, userId);

    return res.json({ data: updatedPost });
  } catch (err) {
   next(err);
  }
};

const deletePost = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const deletedPost = await postService.deletePost(id, userId);

    return res.json({
      message: 'Post deleted successfully',
      data: deletedPost,
    });
  } catch (err) {
   next(err);
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};

