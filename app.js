const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { createUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { celebBodyAuth, celebBodyUserCreate } = require('./validators/user');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mydb');

app.use(bodyParser.json());
app.post('/signup', celebBodyUserCreate, createUser);
app.post('/signin', celebBodyAuth, login);
app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);

app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Страница с указанным адресом не найдена' });
});

app.use(errors());

// Обработчик ошибок сервера
app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  next();
});
// Обработчик ошибок Joi

app.listen(PORT);
