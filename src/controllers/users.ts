import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import {
  NotFoundError,
  UnauthorizedError,
} from '../errors/index';

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
  .then((user) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });

    return res
    .cookie('jwt', token, {
      httpOnly: true,
      maxAge: 3600000 * 24 * 7
    }).send({ message: 'Авторизация прошла успешно' });
  })
  .catch(() => next(new UnauthorizedError('Неправильные почта или пароль')));
};

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.user?._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      return res.send(user);
    })
    .catch(next);
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.userId;

  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      return res.send(user);
    })
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      return User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
    })
    .then((user) => res.status(201).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch(next);
};

export const updateProfile = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user?._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      return res.send(user);
    })
    .catch(next);
};

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user?._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      return res.send(user);
    })
    .catch(next);
};
