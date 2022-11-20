const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mydb');

app.use(bodyParser.json());
app.post('/signup', createUser);
app.post('/signin', login);
app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);

// Код для прохождения тестов
app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Страница с указанным адресом не найдена' });
});

app.listen(PORT);
