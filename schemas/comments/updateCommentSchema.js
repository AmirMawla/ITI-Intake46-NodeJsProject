const Joi = require('joi');

const UpdateCommentBody = Joi.object({
    content: Joi.string().min(1).max(1000).required(),
}).required()

const UpdateCommentParam = Joi.object({
    id: Joi.string().hex().length(24).required(),
}).required()

const UpdateCommentSchema = {
    body: UpdateCommentBody,
    params: UpdateCommentParam
}

module.exports = UpdateCommentSchema;