import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import Category from '../../models/categorySchema';
import Product from '../../models/productSchema';
interface SearchQuery {
  q: string;
}

const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, min, max, category } = req.query;
    const pageSize = Number(limit) || 5;
    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * pageSize;
    const filters: {
      price?: { $gte: number; $lte: number };
      category?: Types.ObjectId;

      // stock?: { $gte: number };
    } = {};

    if (typeof min === 'string' && typeof max === 'string') {
      filters.price = {
        $gte: Number(min),
        $lte: Number(max),
      };
    }

    if (typeof category === 'string') {
      if (mongoose.Types.ObjectId.isValid(category)) {
        filters.category = new mongoose.Types.ObjectId(category);
      } else {
        const categoryDoc = await Category.findOne({ name: category });
        if (!categoryDoc) {
          res.status(404).json({ message: 'Category not found' });
          return;
        }
        filters.category = categoryDoc._id as Types.ObjectId;
      }
    }
    const products = await Product.find(filters).skip(skip).limit(pageSize);
    const count = await Product.countDocuments(filters);

    res.status(200).json({
      message: 'Products retrieved successfully',
      products,
      currentPage,
      count,
      totalPages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const productSearch = async (
  req: Request<{}, {}, {}, SearchQuery>,
  res: Response,
): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q) {
      res.status(400).json({ error: 'Search query is required' });
      return;
    }

    if (!/^[a-zA-Z0-9\s\-]+$/.test(q)) {
      res.status(400).json({ error: 'Invalid search query' });
      return;
    }

    const results = await Product.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } },
    ).sort({ score: { $meta: 'textScore' } });

    if (results.length === 0) {
      res.status(404).json({ message: 'No products found matching the query' });
      return;
    }

    res.status(200).json({
      message: 'Products retrieved successfully',
      products: results,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};
const getProductById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    if (!id) {
      res.status(400).json({ message: 'Product id is required' });
      return;
    }
    const product = await Product.findById(id);
    res.status(200).json({
      message: 'Product retrieved successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const createProduct = async (req: Request, res: Response): Promise<void> => {
  const {
    title,
    description,
    sku,
    price,
    salePrice,
    stock,
    category,
    images,
    slug,
    attributes,
    variants,
    status,
  } = req.body;
  try {
    if (!title || !description || !sku || !price || !category) {
      res.status(400).json({
        message:
          'title, description, sku, price, and category are required fields',
      });
      return;
    }
    if (!mongoose.Types.ObjectId.isValid(category)) {
      res.status(400).json({ message: 'Invalid category id' });
      return;
    }
    const product = await new Product({
      title,
      description,
      sku,
      price,
      salePrice,
      stock,
      category,
      images,
      slug,
      attributes,
      variants,
      status,
    }).save();
    res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const {
    title,
    description,
    sku,
    price,
    salePrice,
    stock,
    category,
    images,
    slug,
    attributes,
    variants,
    status,
  } = req.body;
  try {
    if (!id) {
      res.status(400).json({ message: 'Product id is required' });
      return;
    }
    if (!mongoose.Types.ObjectId.isValid(category)) {
      res.status(400).json({ message: 'Invalid category id' });
      return;
    }
    const product = await Product.findByIdAndUpdate(
      id,
      {
        title,
        description,
        price,
        salePrice,
        stock,
        category,
        images,
        slug,
        attributes,
        variants,
        status,
      },
      { new: true },
    );
    res.status(200).json({
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};
const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    if (!id) {
      res.status(400).json({ message: 'Product id is required' });
      return;
    }
    const product = await Product.findByIdAndDelete(id);
    res.status(200).json({
      message: 'Product deleted successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};
export {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  productSearch,
  updateProduct,
};
