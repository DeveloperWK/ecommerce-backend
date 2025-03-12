import { Request, Response } from 'express';
const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  res.json({ message: 'Get all users' });
};
const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  res.json({ message: 'Get all orders' });
};
const updateOrderStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  res.json({ message: 'Update order status by id' });
};
export { getAllOrders, getAllUsers, updateOrderStatus };
