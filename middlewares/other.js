const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // Один час
  max: 70,
  message: 'С Вашего IP адреса поступило слишком много запросов. Повторите попытку через час',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = rateLimiter;
