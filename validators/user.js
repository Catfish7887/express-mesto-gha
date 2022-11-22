const { Joi, Segments } = require('celebrate');

const { celebrate, schemaObjectId, schemaURL } = require('./utils');

const passwordSchema = Joi.string().required();
const emailSchema = Joi.string().email().required();

// Схема для валидации запроса users/me
const joiSchemaUsersMe = Joi.object({
  id: Joi.alternatives().try(Joi.string().equal('me'), schemaObjectId).required(),
}).required();

// Схема для валидации пользователя
const joiSchemaUser = Joi.object({
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
  avatar: schemaURL,
  email: emailSchema,
  password: passwordSchema,
}).required();

// Схема для валидации авторизации
const joiSchemaAuth = Joi.object({
  email: emailSchema,
  password: passwordSchema,
}).required();

const segmentBodyAuth = { [Segments.BODY]: joiSchemaAuth };
const segmentBodyUser = { [Segments.BODY]: joiSchemaUser };
const segmentParamsUsersMe = { [Segments.PARAMS]: joiSchemaUsersMe };

const celebBodyAuth = celebrate(segmentBodyAuth);
const celebBodyUser = celebrate(segmentBodyUser);
const celebParamsUsersMe = celebrate(segmentParamsUsersMe);

module.exports = {
  celebBodyAuth, celebBodyUser, celebParamsUsersMe,
};
