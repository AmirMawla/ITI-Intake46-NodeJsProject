const APIError = require('./APIError');

class LikeErrors {
  static LikeNotFound = new APIError('The specified like was not found.', 404);
  static InvalidLikeData = new APIError('The provided like data is invalid.', 400);
  static UnauthorizedLikeAccess = new APIError('You do not have permission to access this like.', 403);
  static PostNotFound = new APIError('The specified post was not found.', 404);
  static CommentNotFound = new APIError('The specified comment was not found.', 404);
  static MissingParameters  = new APIError('Missing required parameters: targetType and targetId.', 400);
  static TargetTypeInvalid = new APIError('Target type is invalid.', 400);
  static LikeAlreadyExists = new APIError('You have already liked this item', 409);
}