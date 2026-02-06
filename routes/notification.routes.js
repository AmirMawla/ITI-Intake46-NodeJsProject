const validate = require('../middlewares/validate');
const schema = require('../schemas');
const express = require('express');
const { Authentication } = require('../middlewares/Authentication');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');

// Get user's notifications (authenticated, paginated)
router.get(
    '/',
    Authentication,
    validate(schema.Notifications.getNotificationsSchema),
    notificationController.getUserNotifications
);

// Get unread count
router.get(
    '/unread-count',
    Authentication,
    notificationController.getUnreadCount
);

// Mark notification as read
router.patch(
    '/:id/read',
    Authentication,
    validate(schema.Notifications.markAsReadSchema),
    notificationController.markAsRead
);

// Mark all as read
router.patch(
    '/read-all',
    Authentication,
    notificationController.markAllAsRead
);

module.exports = router;
