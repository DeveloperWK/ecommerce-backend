import { NextFunction, Request, Response } from 'express';

const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Check if req.locals exists and has the 'user' object with 'role' property
    if (!req.locals?.user || req.locals.user.role !== 'admin') {
      res.status(403).json({ message: 'Unauthorized: User is not an admin' });
      return;
    }

    // If the user is an admin, proceed to the next middleware/route handler
    next();
  } catch (error) {
    console.error('Error in isAdmin middleware:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default isAdmin;
