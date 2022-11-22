const { celebrator, Joi } = require('celebrate');

// настраиваем celebrate один раз и потом используем везде эту функцию
const celebrate = celebrator(
  { mode: 'full' }, // проверять весь запрос (если валидируем несколько частей)
  { abortEarly: false }, // не останавливать проверку при первой же ошибке
);

// ниже объявляем все константы, которые пригодятся в других местах
const schemaObjectId = Joi.string().hex().length(24); // как валидировать ObjectID
// схема без .required() будет считать поле необязательным
const schemaURL = Joi.string().uri({ scheme: ['http', 'https'] });

module.exports = {
  celebrate, schemaObjectId, schemaURL,
};
