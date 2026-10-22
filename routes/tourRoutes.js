// import express from 'express';
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
// import TourPackage from '../models/TourPackage.js';

// const router = express.Router();

// // Uploads directory ensure cheyadam
// const uploadDir = 'uploads/';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Multer Disk Storage Configuration (Max 7MB)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 7 * 1024 * 1024 }, // 7MB limit
//   fileFilter: (req, file, cb) => {
//     const fileTypes = /jpeg|jpg|png|webp/;
//     const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = fileTypes.test(file.mimetype);
//     if (extname && mimetype) {
//       cb(null, true);
//     } else {
//       cb(new Error('Images only (jpg, jpeg, png, webp)!'));
//     }
//   },
// });

// // 1. GET ALL TOURS (Public for Tour.jsx)
// router.get('/', async (req, res) => {
//   try {
//     const tours = await TourPackage.find().sort({ createdAt: -1 });
//     res.json({ success: true, count: tours.length, data: tours });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // 2. ADMIN AUTHENTICATION CHECK
// router.post('/admin-login', (req, res) => {
//   const { phone, password } = req.body;
//   const authorizedPhones = ['9384263836', '8072240899'];
//   const secureAdminPass = 'Odissey@2026';

//   if (!authorizedPhones.includes(phone)) {
//     return res.status(403).json({ success: false, message: 'Unauthorized phone number.' });
//   }

//   if (password !== secureAdminPass) {
//     return res.status(401).json({ success: false, message: 'Invalid Admin Password.' });
//   }

//   res.json({ success: true, message: 'Admin verified successfully', phone });
// });

// // 3. CREATE TOUR PACKAGE (Admin Only with 7MB Image)
// router.post('/', upload.single('image'), async (req, res) => {
//   try {
//     const { title, state, category, duration, route, price, badge, inclusions } = req.body;

//     if (!req.file) {
//       return res.status(400).json({ success: false, message: 'Package image is required.' });
//     }

//     // Server relative image path
//     const imagePath = `http://localhost:5000/uploads/${req.file.filename}`;

//     const parsedInclusions = typeof inclusions === 'string' 
//       ? inclusions.split(',').map(item => item.trim()).filter(Boolean)
//       : inclusions || [];

//     const newTour = await TourPackage.create({
//       title,
//       state,
//       category: category || 'Curated Tour',
//       duration,
//       route,
//       image: imagePath,
//       price: price.startsWith('₹') ? price : `₹${price}`,
//       badge: badge || 'New',
//       inclusions: parsedInclusions,
//     });

//     res.status(201).json({ success: true, message: 'Package created successfully!', data: newTour });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // 4. DELETE PACKAGE
// router.delete('/:id', async (req, res) => {
//   try {
//     const tour = await TourPackage.findByIdAndDelete(req.params.id);
//     if (!tour) return res.status(404).json({ success: false, message: 'Package not found' });
//     res.json({ success: true, message: 'Package deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// export default router;


import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import TourPackage from '../models/TourPackage.js';

const router = express.Router();

// Uploads directory ensure seivathu
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Disk Storage Configuration (Max 7MB)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 7 * 1024 * 1024 }, // 7MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|webp/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Images only (jpg, jpeg, png, webp)!'));
    }
  },
});

// 1. GET ALL TOURS (Public for Tour.jsx)
router.get('/', async (req, res) => {
  try {
    const tours = await TourPackage.find().sort({ createdAt: -1 });
    res.json({ success: true, count: tours.length, data: tours });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. ADMIN AUTHENTICATION CHECK
router.post('/admin-login', (req, res) => {
  const { phone, password } = req.body;
  const authorizedPhones = ['9384263836', '8072240899'];
  const secureAdminPass = 'Odissey@2026';

  if (!authorizedPhones.includes(phone)) {
    return res.status(403).json({ success: false, message: 'Unauthorized phone number.' });
  }

  if (password !== secureAdminPass) {
    return res.status(401).json({ success: false, message: 'Invalid Admin Password.' });
  }

  res.json({ success: true, message: 'Admin verified successfully', phone });
});

// 3. CREATE TOUR PACKAGE (Dynamic Live Host URL)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, state, category, duration, route, price, badge, inclusions } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Package image is required.' });
    }

    // Dynamic Image URL (Render live URL-ai automatic-aaga edukkum)
    const host = req.get('host');
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const imagePath = `${protocol}://${host}/uploads/${req.file.filename}`;

    const parsedInclusions = typeof inclusions === 'string' 
      ? inclusions.split(',').map(item => item.trim()).filter(Boolean)
      : inclusions || [];

    const newTour = await TourPackage.create({
      title,
      state,
      category: category || 'Curated Tour',
      duration,
      route,
      image: imagePath,
      price: price.startsWith('₹') ? price : `₹${price}`,
      badge: badge || 'New',
      inclusions: parsedInclusions,
    });

    res.status(201).json({ success: true, message: 'Package created successfully!', data: newTour });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. DELETE PACKAGE
router.delete('/:id', async (req, res) => {
  try {
    const tour = await TourPackage.findByIdAndDelete(req.params.id);
    if (!tour) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;