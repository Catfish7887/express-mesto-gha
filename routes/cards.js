const cardsRouter = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { celebCard, celebCardId } = require('../validators/card');

cardsRouter.get('/', getCards);
cardsRouter.post('/', celebCard, createCard);
cardsRouter.delete('/:id', celebCardId, deleteCard);
cardsRouter.put('/:cardId/likes', celebCardId, likeCard);
cardsRouter.delete('/:cardId/likes', celebCardId, dislikeCard);

module.exports = cardsRouter;
