const Joi = require('joi');


const createpostbody = Joi.object(
    {
        title: Joi.string().min(3).max(30).required(),
        content: Joi.string().min(3).max(200).required(),
        author: Joi.string().min(3).max(30).required(),
        tags: Joi.array()
            .items(Joi.string())
            .optional(),
        published: Joi.boolean()
            .optional()
    }
)

const createpostSchema = {
    body: createpostbody,
}

module.exports = createpostSchema;