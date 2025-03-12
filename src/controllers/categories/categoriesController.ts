import { Request, Response } from 'express';
import Category from '../../models/categorySchema';
const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({});
    res.status(200).json({
      message: 'Categories fetched successfully',
      categories,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const createCategory = async (req: Request, res: Response): Promise<void> => {
  const { name, description, parent } = req.body;
  if (!name) {
    res.status(400).json({
      message: 'Name is required',
    });
    return;
  }
  try {
    const category = await new Category({ name, description, parent }).save();
    res.status(201).json({
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};
const updateCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, description, parent } = req.body;
  try {
    if (!id) {
      res.status(400).json({ message: 'Category id is required' });
      return;
    }
    const category = await Category.findByIdAndUpdate(
      id,
      { name, description, parent },
      { new: true },
    );
    res
      .status(200)
      .json({ message: 'Category updated successfully', category });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};
const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    if (!id) {
      res.status(400).json({ message: 'Category id is required' });
      return;
    }
    const category = await Category.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: 'Category deleted successfully', category });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export { createCategory, deleteCategory, getAllCategories, updateCategory };
