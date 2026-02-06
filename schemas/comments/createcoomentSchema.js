const Joi = require('joi');

const createcommentbody = Joi.object({
        content: Joi.string()
            .min(1)
            .max(1000)
            .required()
            .messages({
                'string.empty': 'Comment content is required',
                'string.min': 'Comment must be at least 1 character',
                'string.max': 'Comment cannot exceed 1000 characters',
                'any.required': 'Comment content is required'
            })
}).required()

const createcommentparam = Joi.object({
    postId: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            'string.hex': 'Invalid post ID format',
            'string.length': 'Invalid post ID format'
        }) 
}).required()


const createcommentSchema = {
    body: createcommentbody,
    params: createcommentparam
}

module.exports = createcommentSchema;
