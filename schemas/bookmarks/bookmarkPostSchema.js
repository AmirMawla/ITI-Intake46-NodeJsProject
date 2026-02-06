const Joi = require('joi');

const bookmarkPostParams = Joi.object({
    postId: Joi.string().required().messages({
        'any.required': 'Post ID is required'
    })
});

const bookmarkPostSchema = {
    params: bookmarkPostParams
};

module.exports = bookmarkPostSchema;
