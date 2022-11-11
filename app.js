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
    _id: '636ecde8fa34b1b8063a5b09',
  };

  next();
});

app.use('/users', jsonParser, usersRouter);
app.use('/cards', jsonParser, cardsRouter);

// Код для прохождения тестов
app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Страница с указанным адресом не найдена' });
});

app.listen(PORT);
