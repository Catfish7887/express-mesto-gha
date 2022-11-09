const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Произошла неизвестная ошибка. ' }));
};

module.exports.getUserById = (req, res) => {
  const { id } = req.params;

  User.find({ _id: id })
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Произошла неизвестная ошибка. Повторите попытку позже' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Не удалось создать пользователя' }));
};

module.exports.editUser = (req, res) => {
  const updatedData = {
    name: req.body.name,
    about: req.body.about,
  };

  User.findByIdAndUpdate(req.user._id, { $set: updatedData }, { new: true })
    .then(() => res.send('ok'))
    .catch((err) => res.send(err));
};

module.exports.editAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { $set: { avatar: req.body.avatar } }, { new: true })
    .then(() => res.send('ok'))
    .catch(() => res.send('not ok'));
};
