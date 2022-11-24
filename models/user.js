const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const UnauthorizedError = require('../errors/UnauthorizedError');

// Регулярка для ссылки
// eslint-disable-next-line no-useless-escape
const regExp = /https?:\/\/[a-z0-9\.-\/-_~:\/?#\[\]@!$&'()*+,;=]+/i;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minlength: 2,
      maxlength: 30,
    },
    about: {
      type: String,
      default: 'Исследователь',
      minlength: 2,
      maxlength: 30,
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (value) => regExp.test(value),
        message: () => 'Аватар должен быть ссылкой',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: () => 'Электронная почта должна быть вида email@example.com',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
    statics: {
      findOneAndValidatePassword({ password, email }) {
        return this.findOne({ email })
          .select('+password')
          .then((document) => {
            if (!document) {
              throw new UnauthorizedError('Неправильный логин или пароль');
            }

            return bcrypt.compare(password, document.password).then((isSuccess) => {
              if (!isSuccess) {
                throw new UnauthorizedError('Неправильный логин или пароль');
              }

              const { password: removed, ...user } = document.toObject();
              return user;
            });
          });
      },
    },
  },
);

module.exports = mongoose.model('user', userSchema);
