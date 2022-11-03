const usersRouter = require('express').Router();
const { getUsers, getUserById, createUser } = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/:id', getUserById);
usersRouter.post('/', createUser);

module.exports = usersRouter;
