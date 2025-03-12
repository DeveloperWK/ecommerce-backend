import { Request, Response } from 'express';
const cart = async (req: Request, res: Response): Promise<void> => {
  res.json({ message: 'Get all cart items' });
};

const createCartItem = async (req: Request, res: Response): Promise<void> => {
  res.json({ message: 'Create cart item' });
};

const updateCartItem = async (req: Request, res: Response): Promise<void> => {
  res.json({ message: 'Update cart item by id' });
};

const deleteCartItem = async (req: Request, res: Response): Promise<void> => {
  res.json({ message: 'Delete cart item by id' });
};

export { cart, createCartItem, deleteCartItem, updateCartItem };
