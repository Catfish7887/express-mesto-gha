const usersRouter = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  editUser,
  editAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/:id', getUserById);
usersRouter.post('/', createUser);
usersRouter.patch('/me', editUser);
usersRouter.patch('/me/avatar', editAvatar);

module.exports = usersRouter;
