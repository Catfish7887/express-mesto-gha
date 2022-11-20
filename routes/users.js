const usersRouter = require('express').Router();

const {
  getUsers, getUser, editUser, editAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/:id', getUser);
usersRouter.get('/me', getUser);
usersRouter.patch('/me', editUser);
usersRouter.patch('/me/avatar', editAvatar);

module.exports = usersRouter;
