import { Request, Response } from 'express';
const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  res.json({ message: 'Get all products' });
};

const getProductById = async (req: Request, res: Response): Promise<void> => {
  res.json({ message: 'Get product by id' });
};

const createProduct = async (req: Request, res: Response): Promise<void> => {
  res.json({ message: 'Create product' });
};

const updateProduct = async (req: Request, res: Response): Promise<void> => {
  res.json({ message: 'Update product by id' });
};
const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  res.json({ message: 'Delete product by id' });
};

export {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
};
