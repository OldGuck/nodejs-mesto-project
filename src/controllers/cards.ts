import { Request, Response } from 'express';
import Card from '../models/card';
import { ERROR_CODES, handleError } from '../utils/errors';

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => handleError(err, res));
};

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user?._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => handleError(err, res));
};

export const deleteCardById = (req: Request, res: Response) => {
  const id = req.params.cardId;

  Card.findByIdAndDelete(id)
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODES.NOT_FOUND).send({ message: 'Карточка не найдена' });
      }

      return res.send(card);
    })
    .catch((err) => handleError(err, res));
};

export const likeCard = (req: Request, res: Response) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user?._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODES.NOT_FOUND).send({ message: 'Карточка не найдена' });
      }

      return res.send(card);
    })
    .catch((err) => handleError(err, res));
};

export const dislikeCard = (req: Request, res: Response) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user?._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODES.NOT_FOUND).send({ message: 'Карточка не найдена' });
      }

      return res.send(card);
    })
    .catch((err) => handleError(err, res));
};
