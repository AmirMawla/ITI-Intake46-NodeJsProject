const Joi = require('joi');

const GetLikersQuery = Joi.object({
    page: Joi.number().min(1).optional().default(1),
    limit: Joi.number().min(1).max(100).optional().default(10),
    targetType: Joi.string().valid('Post', 'Comment').required(),
    targetId: Joi.string().hex().length(24).required(),
}).required()


const GetLikersSchema = {
    query: GetLikersQuery
}

module.exports = GetLikersSchema;