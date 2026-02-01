const Joi = require('joi');

const getallusersquery =Joi.object({
        page: Joi.number().min(1),
        limit: Joi.number().min(1).max(100),
    }).required();

const GetAllUsersSchems = 
{
    query : getallusersquery
}
module.exports = GetAllUsersSchems;