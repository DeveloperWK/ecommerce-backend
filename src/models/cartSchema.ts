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
        quantity: { type: Number, min: 1, default: 1 },
        variants: [
          {
            name: { type: String },
            value: { type: String },
          },
        ],
      },
    ],
  },
  { timestamps: true },
);

const Cart = models.Cart || model<ICart>('Cart', cartSchema);
export default Cart;
