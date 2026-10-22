

// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import connectDB from './config/db.js';
// import authRoutes from './routes/authRoutes.js';
// import tourRoutes from './routes/tourRoutes.js';

// import bookingRoutes from './routes/bookingRoutes.js';

// // Setup __dirname for ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Load environment variables
// dotenv.config();

// // Connect to MongoDB Database
// connectDB();

// const app = express();

// // Middlewares
// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:5173',
//   credentials: true
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve Uploaded Images statically (Max 7MB uploads directory)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/tours', tourRoutes);

// app.use('/api/bookings', bookingRoutes);

// // Base / Health Check Route
// app.get('/', (req, res) => {
//   res.json({
//     project: 'Dropido Odyssey API',
//     status: 'Running',
//     message: 'Welcome to Dropido Odyssey South India Tour & Stays API 🌴'
//   });
// });

// // Port configuration & Server Listening
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running in http://localhost:${PORT}`);
// });


import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import tourRoutes from './routes/tourRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Allowed Origins (Netlify Live Frontend + Local Development)
const allowedOrigins = [
  'https://unique-dango-b16f89.netlify.app',
  'http://localhost:5173',
  process.env.CLIENT_URL
].filter(Boolean);

// Middlewares with Dynamic CORS Validation
app.use(cors({
  origin: function (origin, callback) {
    // Mobile apps, Postman or same-origin requests (origin is undefined)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Images statically (Max 7MB uploads directory)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes);

// Base / Health Check Route
app.get('/', (req, res) => {
  res.json({
    project: 'Dropido Odyssey API',
    status: 'Running',
    message: 'Welcome to Dropido Odyssey South India Tour & Stays API 🌴'
  });
});

// Port configuration & Server Listening
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in http://localhost:${PORT}`);
});