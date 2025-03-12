import { model, models, ObjectId, Schema } from 'mongoose';
export interface ICart extends Document {
  _id: ObjectId;
  user: ObjectId;
  items: { product: ObjectId; quantity: number }[];
}
const cartSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
  },
  { timestamps: true },
);

const Cart = models.Cart || model<ICart>('Cart', cartSchema);
export default Cart;
