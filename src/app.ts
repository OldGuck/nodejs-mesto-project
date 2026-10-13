import dotenv from 'dotenv';

dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { celebrate, Joi } from 'celebrate';
import userRoutes from './routes/users';
import cardRoutes from './routes/cards';
import { login, createUser } from './controllers/users';
import { requestLogger, errorLogger } from './middlewares/logger';
import authorization from './middlewares/auth';
import errorHandler from './middlewares/errorHandler';
import { limiter } from './middlewares/rateLimiter';
import { NotFoundError } from './errors/index';

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => {
    console.info('Подключено к БД');
  })
  .catch(() => {
    console.info('Ошибка подключения к БД');
  });

app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);
app.use(limiter);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().uri(),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

app.use(authorization);

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Маршрут не найден'));
});

app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  console.info(`Сервер запущен на порту ${PORT}`);
});
