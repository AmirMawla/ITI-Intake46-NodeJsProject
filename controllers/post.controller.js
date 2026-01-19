const mongoose = require('mongoose');
const postService = require('../services/post.service');

const createPost = async (req, res) => {
  const { title, content, author, tags, published } = req.body;

  if (!title || !content || !author) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const result = await postService.createPost({
      title,
      content,
      author,
      tags,
      published,
    });

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(201).json({ data: result.data });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const result = await postService.getPosts(req.query);

    if (result.error) {
      return res.status(404).json({ message: result.error });
    }

    return res.json({
      data: result.data,
      pagenation: result.pagination,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getPostById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  try {
    const result = await postService.getPostById(id);

    if (result.error) {
      return res.status(404).json({ message: result.error });
    }

    return res.json({ data: result.data });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  try {
    const result = await postService.updatePost(id, req.body);

    if (result.error) {
      if (result.error === 'Post not found') {
        return res.status(404).json({ message: result.error });
      }
      return res.status(400).json({ message: result.error });
    }

    return res.json({ data: result.data });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  try {
    const result = await postService.deletePost(id);

    if (result.error) {
      return res.status(404).json({ message: result.error });
    }

    return res.json({
      message: 'Post deleted successfully',
      data: result.data,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};

