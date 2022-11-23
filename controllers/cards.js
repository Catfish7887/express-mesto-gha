const { constants } = require('http2');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/ServerError');
const Card = require('../models/card');

// Логика сравнения пользователей и удаление карточки для функции ниже
const checkCardOwnerAndRemove = (card, userId) => {
  if (card.owner.toString() === userId) {
    card.remove();
  } else {
    throw new ForbiddenError('Вы не можете удалять чужие карточки');
  }
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(constants.HTTP_STATUS_OK).send(cards))
    .catch(() => next(new ServerError('Произошла неизвестная ошибка')));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user;

  Card.create({ name, link, owner })
    .then((card) => res.status(constants.HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для создания карточки'));
      } else {
        next(new ServerError('Произошла неизвестная ошибка'));
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const user = req.user._id;

  Card.findById(cardId)
    .then((card) => {
      if (card) {
        checkCardOwnerAndRemove(card, user);
        res.status(constants.HTTP_STATUS_OK).send(card);
      } else {
        next(new NotFoundError('Карточка не найдена'));
      }
    })
    .catch((err) => next(err));
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card) {
        res.status(constants.HTTP_STATUS_OK).send(card);
      } else {
        next(new NotFoundError('Карточка по указанному ID не найдена'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
      } else {
        next(new ServerError('Произошла неизвестная ошибка'));
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card) {
        res.status(constants.HTTP_STATUS_OK).send(card);
      } else {
        next(new NotFoundError('Карточка по указанному id не найдена'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
      } else {
        next(new ServerError('Произошла неизвестная ошибка'));
      }
    });
};
