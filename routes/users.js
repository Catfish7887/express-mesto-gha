const usersRouter = require('express').Router();

const { celebParamsUsersMe, celebBodyUser } = require('../validators/user');
const {
  getUsers, getUser, editUser, editAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/:id', celebParamsUsersMe, getUser);
usersRouter.get('/me', getUser);
usersRouter.patch('/me', celebBodyUser, editUser);
usersRouter.patch('/me/avatar', celebBodyUser, editAvatar);

module.exports = usersRouter;
