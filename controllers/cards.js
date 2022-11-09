const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(404).send({ message: 'Карточки не найдены.' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка.' }));
};

module.exports.deleteCard = (req, res) => {
  const cardId = req.params.id;

  Card.findByIdAndDelete(cardId)
    .then(() => res.status(200).send({ message: 'Карточка успешно удалена' }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка.' }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then(() => res.status(200).send({ message: 'Карточка успешно лайкнута' }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then(() => res.status(200).send({ message: 'Карточка успешно дизлайкнута' }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
