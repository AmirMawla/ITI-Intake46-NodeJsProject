const Joi = require('joi');

const GetUserLikesQuery = Joi.object({
    page: Joi.number().min(1).optional().default(1),
    limit: Joi.number().min(1).max(100).optional().default(10),
    targetType: Joi.string().valid('Post', 'Comment').optional(),
})

const GetUserLikesParam  = Joi.object({
    userId: Joi.string().hex().length(24).required() .messages({
        'any.required': 'User ID is required',
        'string.empty': 'User ID is required',
        'string.hex': 'Invalid user ID format',
        'string.length': 'Invalid user ID format'
    })
}).required()


const GetUserLikesSchema = {
    query: GetUserLikesQuery,
    params: GetUserLikesParam
}

module.exports = GetUserLikesSchema;