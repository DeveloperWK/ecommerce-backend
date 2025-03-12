import { configDotenv } from 'dotenv';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/userSchema';
configDotenv();
const JWT_SECRET = process.env._JWT_SECRET;
const generateToken = (user: IUser) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET as string);
};
export default generateToken;
