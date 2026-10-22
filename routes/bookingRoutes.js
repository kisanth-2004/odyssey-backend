import express from 'express';
import twilio from 'twilio';
import Booking from '../models/Booking.js';

const router = express.Router();

// Initialize Twilio Client
const getTwilioClient = () => {
  if (process.env.TWILIO_SID && process.env.TWILIO_AUTH) {
    return twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
  }
  return null;
};

// POST /api/bookings - Create booking & dispatch Twilio WhatsApp alert
router.post('/', async (req, res) => {
  try {
    const { 
      packageName, 
      packagePrice, 
      packageRoute, 
      customerName, 
      customerPhone, 
      travelDate, 
      travelersCount, 
      notes 
    } = req.body;

    if (!packageName || !customerName || !customerPhone || !travelDate) {
      return res.status(400).json({ success: false, message: 'Please provide all required booking fields.' });
    }

    // 1. Save in MongoDB
    const newBooking = await Booking.create({
      packageName,
      packagePrice,
      packageRoute,
      customerName,
      customerPhone,
      travelDate,
      travelersCount: travelersCount || 2,
      notes: notes || '',
    });

    // 2. Format Twilio WhatsApp Message
    const messageBody = 
      `🚨 *NEW TOUR BOOKING - DROPIDO ODYSSEY* 🌴\n\n` +
      `📦 *Package:* ${packageName}\n` +
      `💰 *Price:* ${packagePrice}\n` +
      `🛣️ *Route:* ${packageRoute}\n\n` +
      `👤 *Customer Name:* ${customerName}\n` +
      `📞 *Phone:* +91 ${customerPhone}\n` +
      `📅 *Date:* ${travelDate}\n` +
      `👥 *Travelers:* ${travelersCount || 2} Persons\n` +
      `📝 *Notes:* ${notes || 'No special requests'}\n\n` +
      `_Received via Dropido Odyssey Web Platform_`;

    // 3. Dispatch Twilio WhatsApp Message to Admin
    const client = getTwilioClient();
    if (client) {
      try {
        await client.messages.create({
          body: messageBody,
          from: process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886',
          to: process.env.ADMIN_WHATSAPP_TO || 'whatsapp:+918072240899',
        });
      } catch (twilioErr) {
        console.error('Twilio WhatsApp dispatch error:', twilioErr.message);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Booking created and WhatsApp notification sent to admin!',
      data: newBooking,
    });
  } catch (error) {
    console.error('Booking processing error:', error);
    res.status(500).json({ success: false, message: 'Server error while processing booking.' });
  }
});

export default router;