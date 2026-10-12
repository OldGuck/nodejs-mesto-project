import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/index';

interface JwtPayload {
  _id: string;
}

const authorization = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new UnauthorizedError('Необходимо авторизоваться'));
  }

  let payload: JwtPayload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as JwtPayload;
  } catch (err) {
    return next(new UnauthorizedError('Необходимо авторизоваться'));
  }

  req.user = payload;

  return next();
};

export default authorization;
