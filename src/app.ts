import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import errorHandler from './middleware/errorHandler';
import notFoundMiddleware from './middleware/notFoundMiddleware';
import authRoutes from './routes/authRoutes';
const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  }),
);
app.use(express.json());
app.use(passport.initialize());
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use(notFoundMiddleware);
app.use(errorHandler);

export default app;
