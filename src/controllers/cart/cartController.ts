import { Request, Response } from 'express';
import Cart from '../../models/cartSchema';
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
  const { userId, items } = req.body;
  if (!userId || !items) {
    res.status(400).json({ message: 'User id and items are required' });
    return;
  }
  try {
    const cart = await Cart.findById(userId).populate('items.product');
    if (cart) {
      res.status(200).json({
        message: 'Cart retrieved successfully',
        cart,
      });
      return;
    }
    const newCart = await new Cart({ user: userId, items }).save();
    res.status(201).json({
      message: 'Cart created successfully',
      cart: newCart,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const updateCartItem = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { items } = req.body;

  try {
    const cart = await Cart.findByIdAndUpdate(
      id,
      { $set: { items } },
      { new: true },
    ).populate('items.product');
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }
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

const deleteCartItem = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    if (!id) {
      res.status(400).json({ message: 'User id is required' });
      return;
    }
    const cart = await Cart.findByIdAndDelete(id);
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
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

export { cart, deleteCartItem, getCartItems, updateCartItem };
