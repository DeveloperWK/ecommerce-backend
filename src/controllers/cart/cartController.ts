import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Cart from '../../models/cartSchema';
interface CartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
}
const getCartItems = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: 'User id is required' });
    return;
  }
  try {
    const cart = await Cart.findById(id).populate('items.product');
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

const cart = async (req: Request, res: Response): Promise<void> => {
  const { userId, productId, quantity } = req.body;
  if (!userId || !productId) {
    res.status(400).json({ message: 'User id and product id are required' });
    return;
  }
  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ userId, items: [] });
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
    });
  }
};

// const updateCartItem = async (req: Request, res: Response): Promise<void> => {
//   const { id } = req.params;
//   const { items } = req.body;

//   try {
//     const cart = await Cart.findByIdAndUpdate(
//       id,
//       { $set: { items } },
//       { new: true },
//     ).populate('items.product');
//     if (!cart) {
//       res.status(404).json({ message: 'Cart not found' });
//       return;
//     }
//     res.status(200).json({
//       message: 'Cart updated successfully',
//       cart,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: 'Internal server error',
//     });
//   }
// };

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
      message: 'Cart deleted successfully',
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export { cart, deleteCartItem, getCartItems };
