import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['Single', 'Double', 'Suite'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Available', 'Occupied', 'Cleaning', 'Maintenance'],
    default: 'Available',
  },
  price: {
    type: Number,
    required: true,
  },
  amenities: [String],
}, { timestamps: true });

export default mongoose.models.Room || mongoose.model('Room', RoomSchema);
