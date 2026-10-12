import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import {
  ForbiddenError,
  NotFoundError,
} from '../errors/index';


export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user?._id })
    .then((card) => res.status(201).send(card))
    .catch(next);
};

export const deleteCardById = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }

      if (card.owner.toString() !== req.user?._id) {
        throw new ForbiddenError('Нет прав на удаление карточки');
      }

      return Card.findByIdAndDelete(cardId)
        .then((deletedCard) => res.send(deletedCard));
    })
    .catch(next);
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user?._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }

      return res.send(card);
    })
    .catch(next);
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user?._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }

      return res.send(card);
    })
    .catch(next);
};
