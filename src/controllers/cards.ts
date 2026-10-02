import { Request, Response } from 'express';

export const createCard = (req: Request, res: Response) => {
  console.log(req.user?._id);
};
