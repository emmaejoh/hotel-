import mongoose, { Schema, Document, models } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  category: 'Bar' | 'Kitchen';
  price?: number; // Price is optional because Kitchen items get quoted
  stock: number; // For inventory management
  imageUrl?: string;
}

const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Bar', 'Kitchen'],
  },
  price: {
    type: Number,
    // Price is not required for Kitchen items
    required: function(this: IProduct) {
      return this.category === 'Bar';
    },
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  imageUrl: {
    type: String,
  },
});

const Product =
  models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
