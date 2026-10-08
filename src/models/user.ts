import mongoose, { Model, Schema, Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { match } from 'assert';

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
};

interface UserModel extends Model<IUser> {
  findUserByCredentials: (
    email: string,
    password: string,
  ) => Promise<Document<unknown, any, IUser>>;
};

const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      match: /^https?:\/\/.+/,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: 'Некорректный email',
      },
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  this: UserModel,
  email: string,
  password: string,
) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Пользователя не существует'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неверный пароль'));
          }

          return user;
        })
    })
};

export default mongoose.model<IUser, UserModel>('user', userSchema);
