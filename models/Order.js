import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: { // This will be set by the kitchen staff for food items
        type: Number,
    }
  }],
  status: {
    type: String,
    enum: ['PENDING_QUOTE', 'AWAITING_APPROVAL', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING_QUOTE',
  },
  total: {
    type: Number,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  orderType: {
      type: String,
      enum: ['Kitchen', 'Bar', 'Laundry', 'Room Service'],
      required: true
  }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
