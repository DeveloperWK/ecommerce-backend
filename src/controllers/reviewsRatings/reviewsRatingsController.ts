import { Request, Response } from 'express';
const getProductsReview = async (
  req: Request,
  res: Response,
): Promise<void> => {
  res.json({ message: 'Get all products reviews' });
};
const createReview = async (req: Request, res: Response): Promise<void> => {};
const updateReview = async (req: Request, res: Response): Promise<void> => {};
const deleteReview = async (req: Request, res: Response): Promise<void> => {};
export { createReview, deleteReview, getProductsReview, updateReview };
