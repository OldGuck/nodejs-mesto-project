import { Request, Response } from 'express';
import User from '../models/user';

export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

export const getUserById = (req: Request, res: Response) => {
  const id = req.params.userId;

  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Нет пользователя с таким id' });
      }

      return res.send(user);
    })
    .catch((err) => res.send({ message: err.message }));
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

export const updateProfile = (req: Request, res: Response) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user?._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.send({ message: 'Нет пользователя с таким id' });
      }

      return res.send({ data: user });
    })
    .catch((err) => res.send({ message: err.message }));
};

export const updateAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user?._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.send({ message: 'Нет пользователя с таким id' });
      }

      return res.send({ data: user });
    })
    .catch((err) => res.send({ message: err.message }));
};
