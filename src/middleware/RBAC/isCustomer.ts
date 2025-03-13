import { NextFunction, Request, Response } from 'express';

const isCustomer = (res: Response, req: Request, next: NextFunction) => {
  try {
    if (!req.locals || req.locals.role !== 'customer') {
      res.status(403).json({ message: 'Unauthorized: User is not a customer' });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
};
export default isCustomer;
