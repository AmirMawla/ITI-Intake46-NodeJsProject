const Bookmark = require('../models/bookmark.model');
const Post = require('../models/post.model');
const BookmarkErrors = require('../Errors/BookmarkErrors');

const bookmarkPost = async (userId, postId) => {
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
        throw BookmarkErrors.PostNotFound;
    }

    // Check if already bookmarked
    const existingBookmark = await Bookmark.findOne({ userId, postId });
    if (existingBookmark) {
        throw BookmarkErrors.AlreadyBookmarked;
    }

    const bookmark = await Bookmark.create({ userId, postId });
    return bookmark;
};

const removeBookmark = async (userId, postId) => {
    const bookmark = await Bookmark.findOneAndDelete({ userId, postId });
    if (!bookmark) {
        throw BookmarkErrors.NotBookmarked;
    }
    return bookmark;
};

const getUserBookmarks = async (userId, { page = 1, limit = 10 }) => {
    page = Number(page);
    limit = Number(limit);

    const bookmarksPromise = Bookmark.find({ userId })
        .populate({
            path: 'postId',
            populate: {
                path: 'userId',
                select: 'name email profilePicture'
            }
        })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    const totalPromise = Bookmark.countDocuments({ userId });
    const [bookmarks, total] = await Promise.all([bookmarksPromise, totalPromise]);

    const data = bookmarks.map(b => b.postId);

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

const isPostBookmarked = async (userId, postId) => {
    return await Bookmark.isBookmarked(userId, postId);
};

module.exports = {
    bookmarkPost,
    removeBookmark,
    getUserBookmarks,
    isPostBookmarked,
};
