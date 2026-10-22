

// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import connectDB from './config/db.js';
// import authRoutes from './routes/authRoutes.js';

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

// // API Routes
// app.use('/api/auth', authRoutes);

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

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
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