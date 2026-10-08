import dotenv from 'dotenv';

dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/users';
import cardRoutes from './routes/cards';
import { login, createUser } from './controllers/users';
import { ERROR_CODES } from './utils/errors';

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

app.post('/signin', login);
app.post('/signup', createUser);

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '6abfda3d70667391bb8255bb',
  };

  next();
});

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.use((req: Request, res: Response) => {
  res.status(ERROR_CODES.NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.info(`Сервер запущен на порту ${PORT}`);
});
