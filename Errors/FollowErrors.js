const APIError = require('./APIError');

class FollowErrors {
    static CannotFollowSelf = new APIError('You cannot follow yourself.', 400);

    static AlreadyFollowing = new APIError('You are already following this user.', 409);

    static NotFollowing = new APIError('You are not following this user.', 404);

    static UserNotFound = new APIError('The specified user was not found.', 404);
}

module.exports = FollowErrors;
