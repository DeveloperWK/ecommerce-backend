import { Document, model, models, ObjectId, Schema } from 'mongoose';
export interface IOrder extends Document {
  orderId: string;
  user: ObjectId;
  orderNumber: string;
  items: Array<{
    product: ObjectId;
    quantity: number;
    price: number;
    name: string;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    fullAddress: string;
  };
  total: number;
  paymentMethod: string;
  paymentId: string;
  status: string;
  paymentStatus: string;
}
const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderNumber: { type: String, required: true, unique: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        name: { type: String, required: true }, // Denormalized for history
      },
    ],
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true, default: 'Bangladesh' },
      postalCode: { type: String, required: true },
      fullAddress: { type: String, required: true },
    },
    total: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentId: { type: String },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

const Order = models.Order || model<IOrder>('Order', orderSchema);
export default Order;
