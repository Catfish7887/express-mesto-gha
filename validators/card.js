const { Joi, Segments } = require('celebrate');

const { celebrate, schemaObjectId, schemaURL } = require('./utils');

const joiSchemaCard = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  link: schemaURL.required(),
});

const joiSchemaCardId = Joi.object({
  cardId: schemaObjectId.required(),
});

const cardSegment = { [Segments.BODY]: joiSchemaCard };
const cardIdSegment = { [Segments.PARAMS]: joiSchemaCardId };

const celebCard = celebrate(cardSegment);
const celebCardId = celebrate(cardIdSegment);

module.exports = {
  celebCard, celebCardId,
};
