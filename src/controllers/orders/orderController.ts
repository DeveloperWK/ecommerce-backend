import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Order from '../../models/orderSchema';
const getOrders = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  console.log(userId);
  try {
    if (!userId) {
      res.status(400).json({ message: 'User id is required' });
      return;
    }
    // const orders = await Order.find({ user: userId });

    // Add orderId filter if provided
    // if (orderId) {
    //   matchStage.orderNumber = { $regex: orderId, $options: 'i' }; // Case-insensitive search
    // }

    const orders = await Order.aggregate([
      // Match orders for the specific user
      {
        $match: { user: new mongoose.Types.ObjectId(userId) },
      },
      // Unwind the items array to work with individual items
      {
        $unwind: '$items',
      },
      // Lookup to join with the Product collection
      {
        $lookup: {
          from: 'products', // The collection to join with
          localField: 'items.product', // Field from the orders collection
          foreignField: '_id', // Field from the products collection
          as: 'items.productDetails', // Output array field
        },
      },
      // Unwind the productDetails array (since lookup returns an array)
      {
        $unwind: '$items.productDetails',
      },
      // Group back to reconstruct the order with enriched product information
      {
        $group: {
          _id: '$_id',
          user: { $first: '$user' },
          orderNumber: { $first: '$orderNumber' },
          shippingAddress: { $first: '$shippingAddress' },
          total: { $first: '$total' },
          paymentMethod: { $first: '$paymentMethod' },
          paymentId: { $first: '$paymentId' },
          status: { $first: '$status' },
          paymentStatus: { $first: '$paymentStatus' },
          items: {
            $push: {
              product: '$items.productDetails.title',
              quantity: '$items.quantity',
              price: '$items.price',
              name: '$items.name',
            },
          },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
        },
      },
      // Sort by createdAt in descending order to get the latest orders first
      {
        $sort: { createdAt: -1 },
      },
    ]);
    const count = await Order.countDocuments({
      user: new mongoose.Types.ObjectId(userId),
    });
    res.status(200).json({
      message: 'Orders retrieved successfully',
      orders,
      count,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error,
    });
  }
};
const getOrderDetailsById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  try {
    if (!id) {
      res.status(400).json({ message: 'Order id is required' });
      return;
    }
    const orderDetails = await Order.findById(id).populate('items.product');
    if (!orderDetails) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    res.status(200).json({
      message: 'Order retrieved successfully',
      orderDetails,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};
const createOrder = async (req: Request, res: Response): Promise<void> => {
  const {
    user,
    items,
    shippingAddress,
    total,
    paymentMethod,
    paymentId,
    status,
    paymentStatus,
    orderNumber,
  } = req.body;
  if (
    !user ||
    !items ||
    !shippingAddress ||
    !total ||
    !paymentMethod ||
    !orderNumber
  ) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }
  try {
    const order = await new Order({
      user,
      items,
      shippingAddress,
      total,
      paymentMethod,
      paymentId,
      status,
      paymentStatus,
      orderNumber,
    }).save();
    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};
export { createOrder, getOrderDetailsById, getOrders };
