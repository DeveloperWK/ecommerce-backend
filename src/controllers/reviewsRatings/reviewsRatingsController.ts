import { Request, Response } from 'express';
import Review from '../../models/reviewSchema';
const getProductsReview = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  try {
    if (!id) {
      res.status(400).json({ message: 'Product id is required' });
      return;
    }
    const reviews = await Review.find({ product: id }).populate(
      'user',
      'firstName lastName -_id',
    );
    if (!reviews) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }
    res.status(200).json({
      message: 'Review retrieved successfully',
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};
const createReview = async (req: Request, res: Response): Promise<void> => {
  const { user, product, rating, comment } = req.body;
  try {
    if (!user || !product || !comment) {
      res
        .status(400)
        .json({ message: 'user, product, and comment are required' });
      return;
    }
    const review = await new Review({ user, product, rating, comment }).save();
    res.status(201).json({
      message: 'Review created successfully',
      review,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};
const updateReview = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  try {
    if (!id) {
      res.status(400).json({ message: 'Review id is required' });
      return;
    }

    const review = await Review.findByIdAndUpdate(
      id,
      { rating, comment },
      { new: true },
    );
    if (!review) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }
    res.status(200).json({
      message: 'Review updated successfully',
      review,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};
const deleteReview = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }
    res.status(200).json({
      message: 'Review deleted successfully',
      deletedReview,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};
export { createReview, deleteReview, getProductsReview, updateReview };
