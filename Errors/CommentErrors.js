const APIError = require('./APIError');

class CommentErrors {
  static CommentNotFound = new APIError('The specified comment was not found.', 404);
  
  static InvalidCommentData = new APIError('The provided comment data is invalid.', 400);
  
  static UnauthorizedCommentAccess = new APIError('You do not have permission to access this comment.', 403);
  static CommentContentTooLong = new APIError('Comment content must be less than 1000 characters.', 400);
  static CommentContentTooShort = new APIError('Comment content must be at least 1 character.', 400);
  static CommentContentRequired = new APIError('Comment content is required.', 400);
  static CommentPostRequired = new APIError('Comment post is required.', 400);
  static CommentUserIdRequired = new APIError('Comment user id is required.', 400);
  static CommentParentCommentIdInvalid = new APIError('Comment parent comment id is invalid.', 400);
  static CommentParentCommentIdNotFound = new APIError('Comment parent comment id not found.', 404);
  static CommentParentNotFound = new APIError('Comment parent comment is not found.', 404);
  static CommentParentPostMismatch = new APIError('Comment parent comment does not belong to the same post.', 400);
}

module.exports = CommentErrors;