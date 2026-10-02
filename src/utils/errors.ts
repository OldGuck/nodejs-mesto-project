import { Response } from 'express';

export const ERROR_CODES = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const handleError = (err: any, res: Response) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(ERROR_CODES.BAD_REQUEST).send({ message: err.message });
  }

  return res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).send({ message: err.message });
};
