import Joi from 'joi';
const createProductSchema = Joi.object({
  title: Joi.string().required().trim(),
  description: Joi.string().required(),
  sku: Joi.string().required(),
  price: Joi.number().required(),
  salePrice: Joi.number(),
  stock: Joi.number().required().default(0),
  category: Joi.string().required(),
  images: Joi.array().items(Joi.string()),
  slug: Joi.string(),
  attributes: Joi.array().items({
    name: Joi.string(),
    value: Joi.string(),
  }),
  status: Joi.array()
    .items(Joi.string())
    .default('draft')
    .valid('active', 'inactive', 'draft'),
  tags: Joi.array().items(Joi.string()),
  variants: Joi.array().items({
    name: Joi.string(),
    value: Joi.string(),
  }),
});
export { createProductSchema };
