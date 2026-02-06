const validate = require('../middlewares/validate');
const schema = require('../schemas')
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const likeController = require('../controllers/like.controller');
const { Authentication } = require('../middlewares/Authentication');
const restrictTo = require('../middlewares/restrictTo');
const rateLimiter = require('../middlewares/rateLimiter');
const imageController = require('../controllers/image.controller');
const upload = require('../middlewares/upload');

router.post('/Sign-Up', validate(schema.Users.createUserSchema), userController.Register);
router.post(
    '/forgot-password',
    rateLimiter.passwordResetLimiter,
    validate(schema.Users.forgotPasswordSchema),
    userController.forgotPassword
);

router.post(
    '/verify-otp',
    rateLimiter.passwordResetLimiter,
    validate(schema.Users.verifyOTPSchema),
    userController.verifyOTP
);

router.post(
    '/reset-password',
    rateLimiter.passwordResetLimiter,
    validate(schema.Users.resetPasswordSchema),
    userController.resetPassword
);

router.patch(
    '/change-password',
    Authentication,
    validate(schema.Users.changePasswordSchema),
    userController.changePassword
);
router.post('/Login', validate(schema.Users.logInSchema), userController.Login);
router.get('/', Authentication, validate(schema.Users.GetAllUsersSchema), userController.getAllUsers);
router.get('/me', Authentication, userController.getMyProfile);
router.get('/:id', Authentication, userController.getUserById);
router.patch('/me', Authentication, userController.updateMyProfile);
router.patch('/:id', Authentication, restrictTo(['admin']), validate(schema.Users.UpdateUserSchema), userController.updateUser);
router.delete('/me', Authentication, userController.deleteMyProfile);
router.delete('/:id', Authentication, restrictTo(['admin']), userController.deleteUser);


router.post(
    '/me/profile-picture',
    Authentication,
    upload.uploadProfilePicture,
    imageController.uploadProfilePicture
);

router.delete(
    '/me/profile-picture',
    Authentication,
    imageController.deleteProfilePicture
);

// Get all likes by a specific user
router.get(
    '/:userId/likes',
    Authentication,
    validate(schema.Likes.GetUserLikesSchema),
    likeController.getUserLikes
);

// Search users
router.get(
    '/search',
    validate(schema.Users.searchUsersSchema),
    userController.searchUsers
);

// Follow routes
const followController = require('../controllers/follow.controller');

// Follow a user
router.post(
    '/:userId/follow',
    Authentication,
    validate(schema.Follows.followUserSchema),
    followController.followUser
);

// Unfollow a user
router.delete(
    '/:userId/follow',
    Authentication,
    validate(schema.Follows.followUserSchema),
    followController.unfollowUser
);

// Get user's followers
router.get(
    '/:userId/followers',
    Authentication,
    validate(schema.Follows.getFollowersSchema),
    followController.getFollowers
);

// Get users being followed by a user
router.get(
    '/:userId/following',
    Authentication,
    validate(schema.Follows.getFollowersSchema),
    followController.getFollowing
);

// Get follow counts for a user
router.get(
    '/:userId/follow-counts',
    Authentication,
    followController.getFollowCounts
);

// Bookmark routes
const bookmarkController = require('../controllers/bookmark.controller');

// Get user's bookmarks
router.get(
    '/bookmarks',
    Authentication,
    validate(schema.Bookmarks.getBookmarksSchema),
    bookmarkController.getUserBookmarks
);

module.exports = router;

