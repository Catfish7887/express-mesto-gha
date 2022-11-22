const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    next(new UnauthorizedError('Требуется авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(authorization, 'salt');
    req.user = payload;
    next();
  } catch (err) {
    next(new UnauthorizedError('Требуется авторизация'));
  }
};
