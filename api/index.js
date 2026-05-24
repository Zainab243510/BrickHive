import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRouter from '../server/routes/user.route.js';
import authRouter from '../server/routes/auth.route.js';
import listingRouter from '../server/routes/listing.route.js';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import notificationRoutes from '../server/routes/notifications.route.js';
import favoriteRoutes from '../server/routes/favourites.route.js';
import paymentRoutes from '../server/routes/payment.route.js';
import { stripeWebhook } from '../server/controllers/payment.controller.js';

dotenv.config();

// Cache the connection across serverless invocations. On a warm container the
// promise resolves immediately; on cold start the first request waits for it.
let mongoConnection = null;
function connectMongo() {
  if (!mongoConnection) {
    mongoConnection = mongoose
      .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 })
      .then((m) => {
        console.log("✅ MongoDB Connected");
        return m;
      })
      .catch((err) => {
        mongoConnection = null;
        console.log("❌ MongoDB Connection Error:", err.message);
        throw err;
      });
  }
  return mongoConnection;
}

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(async (req, res, next) => {
  try {
    await connectMongo();
    next();
  } catch (err) {
    next(err);
  }
});

// Stripe webhook needs the raw request body to verify the signature, so it
// MUST be mounted before the global express.json() parser.
app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listings', listingRouter);
app.use('/api/notifications', notificationRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/payments', paymentRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });

  console.error("Error:", err.stack);
});

// Vercel calls the exported handler; we only spin up the long-lived
// http+socket.io server when running locally. (Vercel's serverless runtime
// can't hold persistent socket connections anyway.)
let io = null;
if (!process.env.VERCEL) {
  const server = http.createServer(app);
  io = new Server(server, {
    cors: { origin: allowedOrigins, methods: ['GET', 'POST', 'PUT', 'DELETE'] },
  });
  app.set("io", io);

  const users = {};
  io.on("connection", (socket) => {
    socket.on("addUser", (userId) => {
      users[userId] = socket.id;
    });
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`🔥 Server running at http://localhost:${PORT}`);
  });
}

export { io };
export default app;
