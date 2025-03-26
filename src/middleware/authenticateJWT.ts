declare global {
  namespace Express {
    interface Locals {
      user: IUser; // Define the type of the `user` object
    }

    interface Request {
      locals?: Locals; // Optional because it might not be set yet
    }
  }
}
// Define the IUser interface (adjust based on your User schema)

import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { IUser } from '../models/userSchema';

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'jwt',
    { session: false },
    (err: Error, user: IUser | false) => {
      if (err) {
        console.error('Error in JWT authentication:', err);
        return next(err);
      }
      if (!user) {
        console.log('No user found in JWT payload');
        return res.status(401).json({ message: 'Unauthorized' });
      }
      console.log('User object from JWT:', user); // Log the user object for debugging
      req.locals = { user }; // Attach the user object to req.locals
      next();
    },
  )(req, res, next);
};
export default authenticateJWT;
