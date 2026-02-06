const imageKitService = require('../services/imageKit.service');
const User = require('../models/user.model');
const Post = require('../models/post.model');
const ImageErrors = require('../Errors/ImageErrors');
const PostErrors = require('../Errors/PostErrors');
const UserErrors = require('../Errors/UserErrors');

const uploadProfilePicture = async (req, res, next) => {
    try {
        if (!req.file) {
            throw ImageErrors.NoFileProvided;
        }

        const { userId } = req.user;
        const user = await User.findById(userId);

        if (!user) {
            throw UserErrors.UserNotFound;
        }

        if (user.profilePicture && user.profilePicture.fileId) {
            try {
                await imageKitService.deleteImage(user.profilePicture.fileId);
            } catch (err) {
                console.log('Failed to delete old profile picture:', err.message);
            }
        }

        const result = await imageKitService.uploadImage(
            req.file.buffer,
            req.file.originalname,
            'profile-pictures'
        );

        user.profilePicture = {
            url: result.url,
            fileId: result.fileId
        };
        await user.save();

        res.status(200).json({
            message: 'Profile picture uploaded successfully',
            data: {
                profilePicture: {
                    url: result.url,
                    thumbnailUrl: imageKitService.getThumbnailUrl(result.url)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

const deleteProfilePicture = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const user = await User.findById(userId);

        if (!user) {
            throw UserErrors.UserNotFound;
        }

        if (!user.profilePicture || !user.profilePicture.fileId) {
            throw ImageErrors.ImageNotFound;
        }

        await imageKitService.deleteImage(user.profilePicture.fileId);

        user.profilePicture = null;
        await user.save();

        res.status(200).json({
            message: 'Profile picture deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

const uploadPostImages = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            throw ImageErrors.NoFileProvided;
        }

        const { id } = req.params;
        const { userId } = req.user;

        const post = await Post.findById(id);

        if (!post) {
            throw PostErrors.PostNotFound;
        }

        if (post.userId.toString() !== userId) {
            throw PostErrors.NotPostAuthor;
        }

        const uploadPromises = req.files.map(file =>
            imageKitService.uploadImage(
                file.buffer,
                file.originalname,
                `posts/${id}`
            )
        );

        const uploadResults = await Promise.all(uploadPromises);

        const newImages = uploadResults.map(result => ({
            url: result.url,
            fileId: result.fileId
        }));

        post.images = [...(post.images || []), ...newImages];
        await post.save();

        res.status(200).json({
            message: 'Images uploaded successfully',
            data: {
                images: newImages.map(img => ({
                    url: img.url,
                    fileId: img.fileId,
                    thumbnailUrl: imageKitService.getThumbnailUrl(img.url)
                }))
            }
        });
    } catch (error) {
        next(error);
    }
};

const deletePostImage = async (req, res, next) => {
    try {
        const { id, imageId } = req.params;
        const { userId } = req.user;

        const post = await Post.findById(id);

        if (!post) {
            throw PostErrors.PostNotFound;
        }

        if (post.userId.toString() !== userId) {
            throw PostErrors.NotPostAuthor;
        }

        
        const imageIndex = post.images.findIndex(img => img.fileId === imageId);

        if (imageIndex === -1) {
            throw ImageErrors.ImageNotFound;
        }

        await imageKitService.deleteImage(imageId);

        post.images.splice(imageIndex, 1);
        await post.save();

        res.status(200).json({
            message: 'Image deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    uploadProfilePicture,
    deleteProfilePicture,
    uploadPostImages,
    deletePostImage
};
