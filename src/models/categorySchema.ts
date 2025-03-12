import { model, models, ObjectId, Schema } from 'mongoose';
export interface ICategory extends Document {
  _id: ObjectId;
  name: string;
  description: string;
  parent: ObjectId | null;
}
const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    parent: { type: Schema.Types.ObjectId, ref: 'Category' }, // For nested categories
  },
  { timestamps: true },
);

const Category =
  models.Category || model<ICategory>('Category', categorySchema);
export default Category;
