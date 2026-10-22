import mongoose from 'mongoose';

const tourPackageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    state: { 
      type: String, 
      required: true, 
      enum: ['Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh'] 
    },
    category: { type: String, default: 'Curated Tour' },
    duration: { type: String, required: true },
    route: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: String, required: true },
    rating: { type: Number, default: 4.9 },
    reviews: { type: Number, default: 12 },
    badge: { type: String, default: 'Special' },
    inclusions: [{ type: String }],
  },
  { timestamps: true }
);

const TourPackage = mongoose.model('TourPackage', tourPackageSchema);
export default TourPackage;