import { Request, Response } from 'express';
const getOrders = async (req: Request, res: Response): Promise<void> => {
  res.json({ message: 'Get all orders' });
};
const getOrderDetailsById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  res.json({ message: 'Get order by id' });
};
const createOrder = async (req: Request, res: Response): Promise<void> => {
  res.json({ message: 'Create order' });
};
export { createOrder, getOrderDetailsById, getOrders };
