import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Cart from '../../models/cartSchema';
interface CartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
}
const getCartItems = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  if (!userId) {
    res.status(400).json({ message: 'User id is required' });
    return;
  }
  try {
    const cart = await Cart.findOne({
      user: new mongoose.Types.ObjectId(userId),
    }).populate('items.product');
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }
    res.status(200).json({
      message: 'Cart retrieved successfully',
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

/*
const addToCart = async (req: Request, res: Response): Promise<void> => {
  const { userId, productId, quantity = 1 } = req.body;
  if (!userId || !productId) {
    res.status(400).json({ message: 'User id and product id are required' });
    return;
  }
  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });
    const productIndex = cart.items.findIndex((item: CartItem) =>
      item.product.equals(productId),
    );
    if (productIndex > -1) {
      cart.items[productIndex].quantity = quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
    res.status(200).json({
      message: 'Cart updated successfully',
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error,
    });
  }
};
*/

const addToCart = async (req: Request, res: Response): Promise<void> => {
  const { userId, productId, quantity, variants } = req.body;

  if (!userId || !productId) {
    res.status(400).json({ message: 'User ID and Product ID are required' });
    return;
  }

  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });

    const productIndex = cart.items.findIndex((item: CartItem) =>
      item.product.equals(productId),
    );

    if (productIndex > -1) {
      // Product already in cart
      if (quantity !== undefined) {
        cart.items[productIndex].quantity += quantity;
      } else {
        cart.items[productIndex].quantity += 1;
      }
    } else {
      // Product not in cart yet
      cart.items.push({
        product: productId,
        quantity: quantity !== undefined ? quantity : 1,
        variants,
      });
    }

    await cart.save();
    res.status(200).json({
      message: 'Cart updated successfully',
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error,
    });
  }
};

const deleteCartItem = async (req: Request, res: Response): Promise<void> => {
  const { userId, productId } = req.body;

  try {
    if (!userId || !productId) {
      res.status(400).json({ message: 'User id and product id are required' });
      return;
    }
    let cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = cart.items.filter(
        (item: CartItem) => !item.product.equals(productId),
      );
      await cart.save();
    }
    res.status(200).json({
      message: 'Cart item deleted successfully',
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};
export { addToCart, deleteCartItem, getCartItems };
