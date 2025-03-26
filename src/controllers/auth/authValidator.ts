import Joi from 'joi';

const registerSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')),
  address: Joi.array()
    .items({
      country: Joi.string().default('Bangladesh'),
      division: Joi.string(),
      district: Joi.string(),
      isDefault: Joi.boolean().default(false),
      fullAddress: Joi.string().trim(),
    })
    .required(),
  role: Joi.string().default('customer').valid('customer', 'admin', 'vendor'),
  phoneNumber: Joi.string().required(),
});
const loginSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6).max(30),
});
export { loginSchema, registerSchema };
