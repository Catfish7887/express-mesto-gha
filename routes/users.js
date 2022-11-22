const usersRouter = require('express').Router();

const { celebParamsUsersMe } = require('../validators/user');
const {
  getUsers, getUser, editUser, editAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/:id', celebParamsUsersMe, getUser);
usersRouter.get('/me', getUser);
usersRouter.patch('/me', editUser);
usersRouter.patch('/me/avatar', editAvatar);

module.exports = usersRouter;
