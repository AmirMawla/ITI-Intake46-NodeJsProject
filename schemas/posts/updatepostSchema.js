const Joi = require('joi');
const { param } = require('../../routes/user.routes');


const Updatepostbody = Joi.object(
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

const Updatepostsquery = Joi.object(
    {
        id: Joi.string().hex().length(24).required()
    }
)

const UpdatePostSchema = {
    body: Updatepostbody,
    param: Updatepostsquery
}



module.exports = UpdatePostSchema;