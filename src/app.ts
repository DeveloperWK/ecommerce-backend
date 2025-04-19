import { configDotenv } from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { createServer } from 'node:http';
import { Server } from 'socket.io';
import passport from './config/passport';
import errorHandler from './middleware/errorHandler';
import notFoundMiddleware from './middleware/notFoundMiddleware';
import adminSpecificRoutes from './routes/adminSpecificRoutes';
import authRoutes from './routes/authRoutes';
import cartRoutes from './routes/cartRoutes';
import categoriesRoutes from './routes/categoriesRoutes';
import orderRoutes from './routes/orderRoutes';
import paymentRoutes from './routes/paymentRoutes';
import productRoutes from './routes/productRoutes';
import reviewsRatingsRoutes from './routes/reviewsRatingsRoutes';
configDotenv();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  },
});
io.on('connection', (socket) => {
  console.log('🔥 A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

app.disable('x-powered-by');
// app.use(
//   nodeApiGuard({
//     enableLogging: true,
//     rateLimit: {
//       maxRequests: 100,
//       windowMs: 60000,
//       message: 'Too many requests from this IP, please try again later.',
//     },
//     logToFile: true,
//   }),
// );

app.use(express.json());
app.use(passport.initialize());
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/carts', cartRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/reviews', reviewsRatingsRoutes);
app.use('/api/v1/admin', adminSpecificRoutes);
app.use('/api/v1/categories', categoriesRoutes);

//Middleware
app.use(notFoundMiddleware);
app.use(errorHandler);

export default server;
