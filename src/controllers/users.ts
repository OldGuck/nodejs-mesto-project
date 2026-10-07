import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import { ERROR_CODES, handleError } from '../utils/errors';

export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => handleError(err, res));
};

export const getUserById = (req: Request, res: Response) => {
  const id = req.params.userId;

  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODES.NOT_FOUND).send({ message: 'Пользователь не найден' });
      }

      return res.send(user);
    })
    .catch((err) => handleError(err, res));
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
    })
    .then((user) => res.status(201).send(user))
    .catch((err) => handleError(err, res));
};

export const updateProfile = (req: Request, res: Response) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user?._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODES.NOT_FOUND).send({ message: 'Пользователь не найден' });
      }

      return res.send(user);
    })
    .catch((err) => handleError(err, res));
};

export const updateAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user?._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODES.NOT_FOUND).send({ message: 'Пользователь не найден' });
      }

      return res.send(user);
    })
    .catch((err) => handleError(err, res));
};
