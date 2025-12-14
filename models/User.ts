import mongoose, { Schema, Document, models } from 'mongoose';

// Define an interface for the User document
export interface IUser extends Document {
  email: string;
  password?: string; // Password is not always present (e.g., OAuth)
  name: string;
  role: 'Manager' | 'Supervisor' | 'Staff' | 'Customer';
  department?: 'Kitchen' | 'Bar' | 'Laundry' | 'Room Service'; // Specific to Staff
  roomNumber?: string; // Specific to Customer
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required for credentials-based login'],
    select: false, // Do not return password by default
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['Manager', 'Supervisor', 'Staff', 'Customer'],
    default: 'Customer',
  },
  department: {
    type: String,
    enum: ['Kitchen', 'Bar', 'Laundry', 'Room Service', null],
    // Department is required only if the role is 'Staff'
    required: function(this: IUser) {
      return this.role === 'Staff';
    },
  },
  roomNumber: {
    type: String,
    trim: true,
    // roomNumber is optional, assigned when a customer books a room.
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Use existing model if it exists, otherwise create a new one
const User = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
