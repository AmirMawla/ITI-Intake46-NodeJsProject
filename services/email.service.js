const { publishToQueue } = require('../Config/rabbitmq');

const EMAIL_QUEUE = process.env.EMAIL_QUEUE_NAME || 'email_queue';

//Email Types - used to identify which template to use

const EMAIL_TYPES = {
    WELCOME: 'welcome',
    PASSWORD_RESET: 'passwordReset',
    PASSWORD_RESET_CONFIRMATION: 'passwordResetConfirmation',
    COMMENT_NOTIFICATION: 'commentNotification',
    REPLY_NOTIFICATION: 'replyNotification'
};

//Send welcome email after user registration

const sendWelcomeEmail = async (user) => {
    const emailData = {
        type: EMAIL_TYPES.WELCOME,
        to: user.email,
        subject: 'Welcome to Our AURA Platform! 🎉',
        data: {
            userName: user.name,
            loginUrl: `${process.env.FRONTEND_URL}/login`
        }
    };

    await publishToQueue(EMAIL_QUEUE, emailData);
    console.log(`📧 Welcome email queued for ${user.email}`);
};


//Send password reset OTP email
const sendPasswordResetOTP = async (user, otp) => {
    const emailData = {
        type: EMAIL_TYPES.PASSWORD_RESET,
        to: user.email,
        subject: 'Your Password Reset OTP',
        data: {
            userName: user.name,
            otp,
            expiryTime: '10 minutes'
        }
    };

    await publishToQueue(EMAIL_QUEUE, emailData);
    console.log(`📧 Password reset OTP email queued for ${user.email}`);
};


//Send password reset confirmation
const sendPasswordResetConfirmation = async (user) => {
    const emailData = {
        type: EMAIL_TYPES.PASSWORD_RESET_CONFIRMATION,
        to: user.email,
        subject: 'Your Password Has Been Reset',
        data: {
            userName: user.name,
            loginUrl: `${process.env.FRONTEND_URL}/login`,
            timestamp: new Date().toLocaleString()
        }
    };

    await publishToQueue(EMAIL_QUEUE, emailData);
    console.log(`📧 Password reset confirmation queued for ${user.email}`);
};


//Notify post author of new comment
const sendCommentNotification = async (postAuthor, commenter, post, comment) => {
    // Don't send email if author commented on their own post
    if (postAuthor._id.toString() === commenter._id.toString()) {
        return;
    }

    const postUrl = `${process.env.FRONTEND_URL}/posts/${post._id}`;

    const emailData = {
        type: EMAIL_TYPES.COMMENT_NOTIFICATION,
        to: postAuthor.email,
        subject: `New comment on your post: "${post.title}"`,
        data: {
            postAuthorName: postAuthor.name,
            commenterName: commenter.name,
            postTitle: post.title,
            commentContent: comment.content,
            postUrl
        }
    };

    await publishToQueue(EMAIL_QUEUE, emailData);
    console.log(`📧 Comment notification queued for ${postAuthor.email}`);
};

//Notify comment author of reply

const sendReplyNotification = async (commentAuthor, replier, comment, reply) => {

    if (commentAuthor._id.toString() === replier._id.toString()) {
        return;
    }

    const commentUrl = `${process.env.FRONTEND_URL}/posts/${comment.postId}#comment-${comment._id}`;

    const emailData = {
        type: EMAIL_TYPES.REPLY_NOTIFICATION,
        to: commentAuthor.email,
        subject: `${replier.name} replied to your comment`,
        data: {
            commentAuthorName: commentAuthor.name,
            replierName: replier.name,
            originalComment: comment.content,
            replyContent: reply.content,
            commentUrl
        }
    };

    await publishToQueue(EMAIL_QUEUE, emailData);
    console.log(`📧 Reply notification queued for ${commentAuthor.email}`);
};

module.exports = {
    EMAIL_TYPES,
    sendWelcomeEmail,
    sendPasswordResetOTP,
    sendPasswordResetConfirmation,
    sendCommentNotification,
    sendReplyNotification
};