const { constants } = require('http2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const ServerError = require('../errors/ServerError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(constants.HTTP_STATUS_OK).send(users))
    .catch(() => next(new ServerError('Произошла неизвестная ошибка')));
};

// Этот обработчик используется для получения пользоваателя по ID,
// или для получения данных авторизировавшегося пользователя
module.exports.getUser = (req, res, next) => {
  const id = (req.params.id === 'me') ? req.user._id : req.params.id;

  User.findOne({ _id: id })
    .then((user) => {
      if (user) {
        res.status(constants.HTTP_STATUS_OK).send(user);
      } else {
        next(new NotFoundError({ message: 'Пользователь по указанному id не найден' }));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError({ message: 'Произошла ошибка. Возможно, введён некорректный id пользователя' }));
      } else {
        next(new ServerError('Произошла неизвестная ошибка'));
      }
    });
};

module.exports.editUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.status(constants.HTTP_STATUS_OK).send(user);
      } else {
        next(new NotFoundError({ message: 'Пользователь по указанному id не найден' }));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError({ message: 'Введенные данные некорректны' }));
      } else {
        next(new ServerError('Произошла неизвестная ошибка'));
      }
    });
};

module.exports.editAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.status(constants.HTTP_STATUS_OK).send(user);
      } else {
        next(new NotFoundError('Пользователь по указанному Id не найден'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(new ServerError('Произошла неизвестная ошибка'));
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 12)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((document) => {
      const { password: removed, ...user } = document.toObject();
      res.send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким Email уже зарегистрирован'));
      } else {
        next(new ServerError('Произошла неизвестная ошибка'));
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOneAndValidatePassword({ email, password })
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'salt', { expiresIn: '7d' }),
      });
    })
    .catch(() => {
      next(new ServerError('Произошла неизвестная ошибка'));
    });
};
