const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const jsonParser = bodyParser.json();

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mydb');

app.use((req, res, next) => {
  req.user = {
    _id: '6364125a31adf71b48e22de6',
  };

  next();
});

app.use('/users', jsonParser, usersRouter);
app.use('/cards', jsonParser, cardsRouter);

// Код для прохождения тестов
app.patch('/*', (req, res) => {
  res.status(404).send({ message: 'Страница с указанным адресом не найдена' });
});

app.listen(PORT);
