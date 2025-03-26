import { configDotenv } from 'dotenv';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import User from '../models/userSchema';

configDotenv();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env._JWT_SECRET as string,
};

// Register the JWT strategy
passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      // Await the result of the database query
      const user = await User.findById(jwtPayload.id)
        .lean()
        .select('email role'); // Use `_id` instead of `id` for MongoDB
      if (!user) {
        console.log('No user found with ID:', jwtPayload.id);
        return done(null, false); // No user found
      }
      console.log('User found:', user);
      return done(null, user); // Pass the resolved user document to the callback
    } catch (error) {
      console.error('Error finding user:', error);
      return done(error, false); // Handle errors
    }
  }),
);

export default passport;
