const Notification = require('../models/notification.model');
const NotificationErrors = require('../Errors/NotificationErrors');

const createNotification = async (data) => {
    // Don't create notification if user is notifying themselves
    if (data.userId.toString() === data.relatedUserId.toString()) {
        return null;
    }

    const notification = await Notification.create(data);
    return notification;
};

const getUserNotifications = async (userId, { page = 1, limit = 10 }) => {
    page = Number(page);
    limit = Number(limit);

    const notificationsPromise = Notification.find({ userId })
        .populate('relatedUserId', 'name email profilePicture')
        .populate('relatedPostId', 'title')
        .populate('relatedCommentId', 'content')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    const totalPromise = Notification.countDocuments({ userId });
    const unreadCountPromise = Notification.countDocuments({ userId, read: false });

    const [notifications, total, unreadCount] = await Promise.all([
        notificationsPromise,
        totalPromise,
        unreadCountPromise,
    ]);

    return {
        data: notifications,
        unreadCount,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

const markAsRead = async (notificationId, userId) => {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
        throw NotificationErrors.NotificationNotFound;
    }

    if (notification.userId.toString() !== userId.toString()) {
        throw NotificationErrors.UnauthorizedAccess;
    }

    notification.read = true;
    await notification.save();

    return notification;
};

const markAllAsRead = async (userId) => {
    const result = await Notification.updateMany(
        { userId, read: false },
        { read: true }
    );

    return { modifiedCount: result.modifiedCount };
};

const getUnreadCount = async (userId) => {
    const count = await Notification.countDocuments({ userId, read: false });
    return count;
};

module.exports = {
    createNotification,
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
};
