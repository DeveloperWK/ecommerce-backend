import { Request, Response } from 'express';
import Order from '../../models/orderSchema';
import User from '../../models/userSchema';

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    const userCount = await User.countDocuments();
    res
      .status(200)
      .json({ message: 'Users fetched successfully', users, userCount });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find();
    const orderCount = await Order.countDocuments();
    res
      .status(200)
      .json({ message: 'Orders fetched successfully', orders, orderCount });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
const updateOrderStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;
  try {
    if (!id) {
      res.status(400).json({ message: 'Order id is required' });
      return;
    }
    const order = await Order.findByIdAndUpdate(
      id,
      { $set: { status, paymentStatus } },
      { new: true },
    );
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
export { getAllOrders, getAllUsers, updateOrderStatus };
