import bcrypt from 'bcryptjs';
import { Document, model, models, ObjectId, Schema } from 'mongoose';
export interface IUser extends Document {
  _id: ObjectId;
  email: string;
  password: string;
  role: 'customer' | 'admin' | 'vendor';
  otp: string | null;
  otpExpiry: Date | null;
  otpVerified: boolean;
  otpSecret: string | null;
  is2FAEnabled: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
  firstName: string;
  lastName: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    isDefault: boolean;
    fullAddress: string;
  }[];
  phoneNumber: string;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    address: [
      {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        postalCode: { type: String },
        isDefault: { type: Boolean, default: false },
        fullAddress: { type: String, trim: true },
      },
    ],
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['customer', 'admin', 'vendor'],
      default: 'customer',
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    otpSecret: { type: String },
    is2FAEnabled: { type: Boolean, default: false },
    phoneNumber: { type: String },
  },
  {
    timestamps: true,
  },
);
userSchema.pre('save', async function (this: IUser, next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = models.User || model<IUser>('User', userSchema);

export default User;
