import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ERROR_CODES } from '../utils/errors';

interface JwtPayload {
  _id: string;
}

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res
      .status(ERROR_CODES.UNAUTHORIZED)
      .send({ message: 'Необходимо авторизоваться' });
  }

  let payload: JwtPayload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as JwtPayload;
  } catch (err) {
    return res
      .status(ERROR_CODES.UNAUTHORIZED)
      .send({ message: 'Необходимо авторизоваться' });
  }

  req.user = payload;

  next();
};
