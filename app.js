const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');

const jsonParser = bodyParser.json();

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mydb');
app.use((req, res, next) => {
  req.user = {
    _id: '636413d2c30a86ace38ab821',
  };

  next();
});

app.use('/users', jsonParser, usersRouter);

app.listen(PORT);
