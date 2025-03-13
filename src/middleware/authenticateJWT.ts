import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { IUser } from '../models/userSchema';
declare global {
  namespace Express {
    interface Request {
      locals?: IUser; // Replace 'any' with a proper type if you know the structure of the decoded token
    }
  }
}

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'jwt',
    { session: false },
    (err: Error, user: IUser) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      req.locals = user; // Attach the user to the request object
      next();
    },
  )(req, res, next);
};

export default authenticateJWT;
