const notificationService = require('../services/notification.service');

const getUserNotifications = async (req, res, next) => {
    const { userId } = req.user;

    try {
        const result = await notificationService.getUserNotifications(userId, req.query);

        return res.json({
            data: result.data,
            unreadCount: result.unreadCount,
            pagination: result.pagination,
        });
    } catch (err) {
        next(err);
    }
};

const markAsRead = async (req, res, next) => {
    const { userId } = req.user;
    const { id } = req.params;

    try {
        const notification = await notificationService.markAsRead(id, userId);

        return res.json({
            message: 'Notification marked as read',
            data: notification,
        });
    } catch (err) {
        next(err);
    }
};

const markAllAsRead = async (req, res, next) => {
    const { userId } = req.user;

    try {
        const result = await notificationService.markAllAsRead(userId);

        return res.json({
            message: 'All notifications marked as read',
            modifiedCount: result.modifiedCount,
        });
    } catch (err) {
        next(err);
    }
};

const getUnreadCount = async (req, res, next) => {
    const { userId } = req.user;

    try {
        const count = await notificationService.getUnreadCount(userId);

        return res.json({
            unreadCount: count,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
};
