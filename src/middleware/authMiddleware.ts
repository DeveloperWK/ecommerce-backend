import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

declare global {
  namespace Express {
    interface Request {
      locals?: any; // Replace 'any' with a proper type if you know the structure of the decoded token
    }
  }
}

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    // Add other user properties here
  }

  interface AuthInfo {
    message: string;
    // Add other auth info properties here
  }

  passport.authenticate(
    'jwt',
    { session: false },
    (err: Error, user: User | false, info: AuthInfo) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: 'Unauthorized' });
      req.locals = user;
      next();
    },
  )(req, res, next);
};
export default authenticateJWT;
