const APIError = require('./APIError');

class BookmarkErrors {
    static AlreadyBookmarked = new APIError('This post is already bookmarked.', 409);

    static NotBookmarked = new APIError('This post is not bookmarked.', 404);

    static PostNotFound = new APIError('The specified post was not found.', 404);
}

module.exports = BookmarkErrors;
