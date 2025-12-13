import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    // Not required for kitchen items initially
  },
  category: {
    type: String,
    enum: ['Food', 'Beverage', 'Laundry', 'Other'],
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  imageUrl: {
    type: String,
  },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
