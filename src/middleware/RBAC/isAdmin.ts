import { NextFunction, Request, Response } from 'express';

const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (!req.locals || req.locals.role !== 'admin') {
      res.status(403).json({ message: 'Unauthorized: User is not an admin' });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
};
export default isAdmin;
