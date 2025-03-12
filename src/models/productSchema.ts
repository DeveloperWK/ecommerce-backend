import { Document, model, models, ObjectId, Schema } from 'mongoose';
export interface IProduct extends Document {
  _id: ObjectId;
  title: string;
  description: string;
  sku: string;
  price: number;
  salePrice: number;
  stock: number;
  category: ObjectId;
  images: string[];
  slug: string;
  attributes: { name: string; value: string }[];
  status: 'active' | 'inactive' | 'draft';
  variants: { name: string; value: string }[];
}
const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    stock: { type: Number, required: true, default: 0 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    images: [{ type: String }], // Array of image URLs
    slug: { type: String, unique: true },
    attributes: [
      {
        name: { type: String },
        value: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft'],
      default: 'draft',
    },
    variants: [
      {
        name: { type: String },
        value: { type: String },
      },
    ],
  },
  { timestamps: true },
);
productSchema.index(
  {
    title: 'text',
    description: 'text',
    'attributes.value': 'text',
  },
  {
    weights: {
      title: 10,
      'attributes.value': 3,
      description: 1,
    },
    name: 'productSearch',
  },
);
const Product = models.Product || model<IProduct>('Product', productSchema);
export default Product;
