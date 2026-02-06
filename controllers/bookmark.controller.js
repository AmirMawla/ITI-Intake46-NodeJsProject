const bookmarkService = require('../services/bookmark.service');

const bookmarkPost = async (req, res, next) => {
    const { userId } = req.user;
    const { postId } = req.params;

    try {
        await bookmarkService.bookmarkPost(userId, postId);

        return res.status(201).json({
            message: 'Post bookmarked successfully',
        });
    } catch (err) {
        next(err);
    }
};

const removeBookmark = async (req, res, next) => {
    const { userId } = req.user;
    const { postId } = req.params;

    try {
        await bookmarkService.removeBookmark(userId, postId);

        return res.json({
            message: 'Bookmark removed successfully',
        });
    } catch (err) {
        next(err);
    }
};

const getUserBookmarks = async (req, res, next) => {
    const { userId } = req.user;

    try {
        const result = await bookmarkService.getUserBookmarks(userId, req.query);

        return res.json({
            data: result.data,
            pagination: result.pagination,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    bookmarkPost,
    removeBookmark,
    getUserBookmarks,
};
