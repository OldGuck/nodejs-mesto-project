import { Request, Response } from 'express';
import Card from '../models/card';

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.send({ message: err.message }));
};

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user?._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.send({ message: err.message }));
};

export const deleteCardById = (req: Request, res: Response) => {
  const id = req.params.cardId;

  Card.findByIdAndDelete(id)
    .then((card) => {
      if (!card) {
        return res.send({ message: 'Карточки с таким id нет' });
      }

      return res.send({ data: card });
    })
    .catch((err) => res.send({ message: err.message }));
};

export const likeCard = (req: Request, res: Response) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user?._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.send({ message: 'Нет карточки с таким id' });
      }

      return res.send({ data: card });
    })
    .catch((err) => res.send({ message: err.message }));
};

export const dislikeCard = (req: Request, res: Response) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user?._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.send({ message: 'Нет карточки с таким id' });
      }

      return res.send({ data: card });
    })
    .catch((err) => res.send({ message: err.message }));
};
