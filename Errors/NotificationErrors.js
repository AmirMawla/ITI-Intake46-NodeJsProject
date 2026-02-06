const APIError = require('./APIError');

class NotificationErrors {
    static NotificationNotFound = new APIError('The specified notification was not found.', 404);

    static UnauthorizedAccess = new APIError('You do not have permission to access this notification.', 403);
}

module.exports = NotificationErrors;
