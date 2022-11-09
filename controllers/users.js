const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Произошла неизвестная ошибка' }));
};

module.exports.getUserById = (req, res) => {
  const { id } = req.params;

  User.findOne({ _id: id })
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send({ message: 'Пользователь по указанному id не найден' });
      }
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла неизвестная ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(500).send({ message: 'Произошла неизвестная ошибка' });
      }
    });
};

module.exports.editUser = (req, res) => {
  const updatedData = {
    name: req.body.name,
    about: req.body.about,
  };

  User.findByIdAndUpdate(req.user._id, { $set: updatedData }, { new: true })
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send({ message: 'Пользователь по указанному id не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Введенные данные некорректны' });
      } else {
        res.status(500).send({ message: 'Произошла неизвестная ошибка' });
      }
    });
};

module.exports.editAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { $set: { avatar: req.body.avatar } }, { new: true })
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send({ message: 'Пользователь по указанному id не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Введенные данные некорректны' });
      } else {
        res.status(500).send({ message: 'Произошла неизвестная ошибка' });
      }
    });
};
