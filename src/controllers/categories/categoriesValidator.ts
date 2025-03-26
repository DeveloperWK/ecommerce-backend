import Joi from 'joi';

const createCategorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  parent: Joi.string(),
});
export { createCategorySchema };
