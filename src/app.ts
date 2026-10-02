import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/users';
import cardRoutes from './routes/cards';

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

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '6abfda3d70667391bb8255bb',
  };

  next();
});
app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.listen(PORT, () => {
  console.info(`Сервер запущен на порту ${PORT}`);
});
