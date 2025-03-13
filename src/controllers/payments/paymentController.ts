import { configDotenv } from 'dotenv';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Stripe } from 'stripe';
import Product from '../../models/productSchema';
import User from '../../models/userSchema';

configDotenv();
const stripeSession = async (req: Request, res: Response): Promise<void> => {
  const stripeSecret = process.env._STRIPE_SECRET_KEY!;
  const stripe = new Stripe(stripeSecret);
  const { cartItems, userId } = req.body;
  if (!cartItems || !userId) {
    res.status(400).json({ message: 'Cart items and user id are required' });
    return;
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    interface CartItem {
      product: mongoose.Types.ObjectId;
      quantity: number;
    }

    interface LineItem {
      price_data: {
        currency: string;
        product_data: {
          name: string;
        };
        unit_amount: number;
      };
      quantity: number;
    }

    const lineItems: LineItem[] = await Promise.all(
      cartItems.map(async (item: CartItem): Promise<LineItem | void> => {
        const product = await Product.findById(item.product);
        if (!product) {
          res.status(404).json({ message: 'Product not found' });
          return;
        }
        const unitAmount = product.price * 100;
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.title,
            },
            unit_amount: unitAmount,
          },
          quantity: item.quantity,
        };
      }),
    );
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env._FRONTEND_URL}/success`,
      cancel_url: `${process.env._FRONTEND_URL}/cancel`,
      client_reference_id: userId,
      payment_intent_data: {
        metadata: {
          cartItems: JSON.stringify(cartItems),
          userId: userId,
        },
      },
      customer_email: user?.email,
    });
    res.json({ session });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
export { stripeSession };
