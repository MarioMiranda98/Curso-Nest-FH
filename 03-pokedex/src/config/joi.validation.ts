import * as Joi from 'joi';

export const joiValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  MONGO_DB_URL: Joi.required(),
  MONGO_DB_NAME: Joi.required(),
  MONGO_INITDB_ROOT_USERNAME: Joi.required(),
  MONGO_INITDB_ROOT_PASSWORD: Joi.required(),
  DEFAULT_LIMIT: Joi.number().default(10)
});