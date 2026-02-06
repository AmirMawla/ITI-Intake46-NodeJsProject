const Joi = require('joi');

const GetPostCommentsQuery = Joi.object({
    page: Joi.number().min(1).optional().default(1),
    limit: Joi.number().min(1).max(100).optional().default(10),
});

const GetPostCommentsParam = Joi.object({
    postId: Joi.string().hex().length(24).required(),
}).required().messages({
    'any.required': 'Post ID is required',
    'string.empty': 'Post ID is required',
    'string.hex': 'Invalid post ID format',
    'string.length': 'Invalid post ID format'
})

const getPostCommentsSchema = {
    query: GetPostCommentsQuery,
    params: GetPostCommentsParam
}

module.exports = getPostCommentsSchema;