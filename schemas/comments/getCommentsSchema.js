const Joi = require('joi');

const GetCommentsQuery = Joi.object({
    page: Joi.number().min(1).optional() .default(1),
    limit: Joi.number().min(1).max(100).optional().default(10),
});

const GetCommentsParam = Joi.object({
    postId: Joi.string().hex().length(24).optional()
});

const GetCommentsSchema = {
    query: GetCommentsQuery,
    params: GetCommentsParam
}

module.exports = GetCommentsSchema;