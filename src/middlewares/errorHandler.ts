import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/index';

interface MongoError extends Error {
  code?: number;
}

export default (
  err: AppError | MongoError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if ('code' in err && err.code === 11000) {
    return res
      .status(409)
      .send({ message: 'Пользователь с таким email уже существует' });
  }

  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).send({ message: err.message });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  return res
    .status(500)
    .send({ message: 'На сервере произошла ошибка' });
};
