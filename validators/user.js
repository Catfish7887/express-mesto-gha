const { Joi, Segments } = require('celebrate');

const { celebrate, schemaObjectId, schemaURL } = require('./utils');

const passwordSchema = Joi.string().required();
const emailSchema = Joi.string().email().required();

const userSchema = Joi.object({
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
  avatar: schemaURL,
}).required();

const authSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
}).required();

// Схема для валидации запроса users/me
const joiSchemaUsersMe = Joi.object({
  id: Joi.alternatives().try(Joi.string().equal('me'), schemaObjectId).required(),
}).required();

// Схема для валидации пользователя при регистрации
const joiSchemaUserCreate = userSchema.concat(authSchema);

const segmentBodyAuth = { [Segments.BODY]: authSchema };
const segmentBodyUserCreate = { [Segments.BODY]: joiSchemaUserCreate };
const segmentParamsUsersMe = { [Segments.PARAMS]: joiSchemaUsersMe };
const segmentBodyUser = { [Segments.BODY]: userSchema };

const celebBodyAuth = celebrate(segmentBodyAuth);
const celebBodyUserCreate = celebrate(segmentBodyUserCreate);
const celebParamsUsersMe = celebrate(segmentParamsUsersMe);
const celebBodyUser = celebrate(segmentBodyUser);

module.exports = {
  celebBodyAuth,
  celebBodyUserCreate,
  celebParamsUsersMe,
  celebBodyUser,
};
