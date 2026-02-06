const APIError = require('./APIError');

class PostErrors {
  static PostNotFound = new APIError('The specified post was not found.', 404);

  static InvalidPostData = new APIError('The provided post data is invalid.', 400);

  static PostTitleAlreadyExists = new APIError('A post with this title already exists.', 409);

  static PostAlreadyPublished = new APIError('The post has already been published.', 409);

  static UnauthorizedPostAccess = new APIError('You do not have permission to access this post.', 403);

  static NotPostAuthor = new APIError('You are not the author of this post.', 403);
}

module.exports = PostErrors;