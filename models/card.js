const mongoose = require('mongoose');

// eslint-disable-next-line no-useless-escape
const regExp = /https?:\/\/[a-z0-9\.-\/-_~:\/?#\[\]@!$&'()*+,;=]+/i;

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator: (value) => regExp.test(value),
        message: () => 'Ссылка должна быть URL',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    likes: {
      default: [],
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user',
        },
      ],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('card', cardSchema);
