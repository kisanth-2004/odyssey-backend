import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    packageName: { type: String, required: true },
    packagePrice: { type: String, required: true },
    packageRoute: { type: String, required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    travelDate: { type: String, required: true },
    travelersCount: { type: Number, default: 2 },
    notes: { type: String, default: '' },
    status: { type: String, default: 'Pending' },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;