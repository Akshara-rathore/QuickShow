import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { serve } from 'inngest/express';
import { inngest } from './inngest/client.js';
import { sendNewMovieNotification, releaseSeatsOnPaymentTimeout, sendBookingConfirmationEmail } from './inngest/functions.js';
import webhookRouter from './routes/webhookRoute.js';
import movieRouter from './routes/movieRoute.js';
console.log("✅ THIS SERVER.JS IS RUNNING");


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Webhook routes should typically use raw bodies instead of JSON, but we'll configure that specifically for the webhook endpoints.
app.use((req, res, next) => {
  if (req.originalUrl === '/api/webhooks/clerk' || req.originalUrl === '/api/webhooks/stripe') {
    next(); // Skip JSON parsing for these routes
  } else {
    express.json()(req, res, next);
  }
});

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
import showRouter from './routes/showRoute.js';
import bookingRouter from './routes/bookingRoute.js';
import theatreRouter from './routes/theatreRoute.js';
import screenRouter from './routes/screenRoute.js';

app.use('/api/webhooks', webhookRouter);
app.use('/api/shows', showRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/theatres', theatreRouter);
app.use('/api/screens', screenRouter);
app.use('/api/movies', movieRouter);

app.get('/', (req, res) => {
  res.send('Quickshow API is running...');
});

// Inngest setup
app.use(
  '/api/inngest',
  serve({
    client: inngest,
    functions: [sendNewMovieNotification, releaseSeatsOnPaymentTimeout, sendBookingConfirmationEmail],
  })
);

app.get('/api/theatres', (req, res) => {
  res.json({ success: true, message: 'Direct theatre route working' });
});

app.post('/api/theatres/add', (req, res) => {
  res.json({ success: true, message: 'Direct add theatre route working' });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
