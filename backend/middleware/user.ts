import { NextFunction, Response } from 'express';
import User from '../models/User';
import { RequestWithUser } from './auth';

const user = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  const headerValue = req.get('Authorization');

  if (!headerValue) {
    return next();
  }

  const [_bearer, token] = headerValue.split(' '); // "Bearer token"

  if (!token) {
    return;
  }

  const user = await User.findOne({ token });

  if (!user) {
    return next();
  }

  req.user = user;

  next();
};

export default user;
