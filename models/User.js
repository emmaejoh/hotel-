import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Manager', 'Supervisor', 'Staff', 'Customer'],
    required: true,
  },
  department: {
    type: String,
    enum: ['Kitchen', 'Bar', 'Laundry', 'Room Service', 'Front Desk'],
    // Required only if the role is 'Staff'
    required: function() { return this.role === 'Staff'; }
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
