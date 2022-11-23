const { constants } = require('http2');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const Card = require('../models/card');

// Логика сравнения пользователей и удаление карточки для функции ниже
const checkCardOwnerAndRemove = (card, userId) => {
  if (card.owner.toString() === userId) {
    card.remove();
  } else {
    throw new ForbiddenError('Вы не можете удалять чужие карточки');
  }
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(constants.HTTP_STATUS_OK).send(cards))
    .catch(() => res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user;

  Card.create({ name, link, owner })
    .then((card) => res.status(constants.HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные для создания карточки' });
      } else {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const cardId = req.params.id;
  const user = req.user._id;

  Card.findById(cardId)
    .then((card) => {
      if (card) {
        checkCardOwnerAndRemove(card, user);
        res.status(constants.HTTP_STATUS_OK).send(card);
      } else {
        throw new NotFoundError('Карточка не найдена');
      }
    })
    .catch((err) => { res.send(err); });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card) {
        res.status(constants.HTTP_STATUS_OK).send(card);
      } else {
        throw new NotFoundError('Карточка по указанному ID не найдена');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card) {
        res.status(constants.HTTP_STATUS_OK).send(card);
      } else {
        res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка по указанному id не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка' });
      } else {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка' });
      }
    });
};
