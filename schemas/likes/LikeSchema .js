const Joi = require('joi');

const LikeQuery = Joi.object({
    targetType: Joi.string().valid('Post', 'Comment').required() .messages({
        'any.required': 'Target type is required',
        'string.empty': 'Target type is required',
        'string.valid': 'Target type must be either Post or Comment'
    }),
    targetId: Joi.string().hex().length(24).required() .messages({
        'any.required': 'Target ID is required',
        'string.empty': 'Target ID is required',
        'string.hex': 'Invalid target ID format',
        'string.length': 'Invalid target ID format'
    })
}).required()

const LikeSchema = {
    query: LikeQuery
}

module.exports = LikeSchema;