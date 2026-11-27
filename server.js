


import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import tourRoutes from './routes/tourRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Trust Render / Reverse Proxy so req.protocol & x-forwarded-proto return 'https'
app.set('trust proxy', 1);

// Ensure uploads directory exists on server boot
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Allowed Origins (Netlify Live Frontend + Local Development + Custom Domain)
const allowedOrigins = [
  'https://unique-dango-b16f89.netlify.app',
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
]
  .filter(Boolean)
  .map((url) => url.replace(/\/$/, ''));

// Middlewares with Dynamic CORS Validation
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow mobile apps, Postman, or same-origin requests where origin is undefined
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, '');
      if (
        allowedOrigins.includes(normalizedOrigin) ||
        normalizedOrigin.endsWith('.netlify.app')
      ) {
        callback(null, true);
      } else {
        callback(new Error(`Blocked by CORS policy: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve Uploaded Images statically (Max 7MB uploads directory)
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/ai', aiRoutes);

// Base / Health Check Route
app.get('/', (req, res) => {
  res.json({
    project: 'Dropido Odyssey API',
    status: 'Running',
    message: 'Welcome to Dropido Odyssey South India Tour & Stays API 🌴',
  });
});

// Global Error Handler (Clean JSON errors for Multer 7MB limit & CORS)
app.use((err, req, res, next) => {
  if (err && err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message:
        err.code === 'LIMIT_FILE_SIZE'
          ? 'Image size exceeds 7MB limit.'
          : err.message,
    });
  }
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  }
  next();
});

// Port configuration & Server Listening
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});