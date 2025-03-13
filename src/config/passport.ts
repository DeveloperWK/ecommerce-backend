import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

import { configDotenv } from 'dotenv';
import User from '../models/userSchema';
configDotenv();
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env._JWT_SECRET as string,
};

// Register the JWT strategy
passport.use(
  new JwtStrategy(jwtOptions, (jwtPayload, done) => {
    const user = User.findOne({ id: jwtPayload.id });
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  }),
);

export default passport;
