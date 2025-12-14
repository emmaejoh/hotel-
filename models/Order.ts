import mongoose, { Schema, Document, models, Types } from 'mongoose';
import { IUser } from './User';
import { IProduct } from './Product';

export interface IOrder extends Document {
  customer: Types.ObjectId | IUser;
  items: {
    product: Types.ObjectId | IProduct;
    quantity: number;
    quotedPrice?: number; // Price quoted by Kitchen staff for a specific item
  }[];
  status:
    | 'PENDING_QUOTE'
    | 'AWAITING_APPROVAL'
    | 'CONFIRMED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED';
  totalPrice?: number;
  assignedTo?: Types.ObjectId | IUser; // Staff member assigned to the order
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        quotedPrice: {
          type: Number, // Only set for Kitchen items after staff input
        },
      },
    ],
    status: {
      type: String,
      required: true,
      enum: [
        'PENDING_QUOTE',
        'AWAITING_APPROVAL',
        'CONFIRMED',
        'IN_PROGRESS',
        'COMPLETED',
        'CANCELLED',
      ],
      default: 'PENDING_QUOTE',
    },
    totalPrice: {
      type: Number, // Will be calculated after customer approval for kitchen items
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt automatically

const Order = models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
