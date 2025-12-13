import mongoose, { Schema, Document, models } from 'mongoose';

export interface IRoom extends Document {
  roomNumber: string;
  type: 'Single' | 'Double' | 'Suite';
  status: 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance';
  pricePerNight: number; // Base price, can be edited
  currentOccupant?: mongoose.Types.ObjectId;
}

const RoomSchema: Schema = new Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Single', 'Double', 'Suite'],
  },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'Occupied', 'Cleaning', 'Maintenance'],
    default: 'Available',
  },
  pricePerNight: {
    type: Number,
    required: true,
  },
  currentOccupant: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Room = models.Room || mongoose.model<IRoom>('Room', RoomSchema);

export default Room;