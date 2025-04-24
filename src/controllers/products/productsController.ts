import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import redisClientConfig from '../../config/redisClient.config';
import Category from '../../models/categorySchema';
import Product, { IProduct } from '../../models/productSchema';
import deleteProductKeysFromRedis from '../../utils/deleteProductKeysFromRedis';
import generateETag from '../../utils/generateETag';
import { cacheData, getCacheData } from '../../utils/redisUtility';
import { createProductSchema } from './productsValidator';
interface SearchQuery {
  q: string;
}
const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, min, max, category } = req.query;
    const pageSize = Number(limit) || 8;
    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * pageSize;
    const cacheKey = `products:${currentPage}:${pageSize}:${min}:${max}:${category}`;

    // --- 1. Validate category early (avoid cache checks if invalid) ---
    const filters: {
      price?: { $gte: number; $lte: number };
      category?: Types.ObjectId;
    } = {};
    if (typeof category === 'string') {
      if (mongoose.Types.ObjectId.isValid(category)) {
        filters.category = new mongoose.Types.ObjectId(category);
      } else {
        const categoryDoc = await Category.findOne({ name: category });
        if (!categoryDoc) {
          res.status(404).json({ message: 'Category not found' });
          return;
        }
        filters.category = categoryDoc._id;
      }
    }

    // --- 2. Check Cache ---
    const cachedData = (await getCacheData(cacheKey)) as {
      products: IProduct[];
      count: number;
      currentPage: number;
      totalPages: number;
    } | null;
    const cachedETag = await redisClientConfig.get(`${cacheKey}:etag`);
    const clientETag = req.headers['if-none-match'];

    // --- 3. Handle 304 (Not Modified) ---
    if (cachedData && clientETag && clientETag === cachedETag) {
      res.status(304).end();
      return;
    }

    // --- 4. Serve Cached Data (if exists) ---
    if (cachedData) {
      const etag = cachedETag || generateETag(JSON.stringify(cachedData)); // Fallback ETag
      res
        .set('ETag', etag)
        .status(200)
        .json({
          message: 'Products retrieved successfully (from cache)',
          ...cachedData,
        });
      return;
    }

    // --- 5. Fetch from DB ---
    if (typeof min === 'string' && typeof max === 'string') {
      filters.price = { $gte: Number(min), $lte: Number(max) };
    }

    const products = await Product.find(filters)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .populate('category', 'name');
    const count = await Product.countDocuments(filters);
    const dataToCache = {
      products,
      count,
      currentPage,
      totalPages: Math.ceil(count / pageSize),
    };

    // --- 6. Cache + Respond ---
    const etag = generateETag(JSON.stringify(dataToCache));
    await cacheData(cacheKey, dataToCache);
    await redisClientConfig.set(`${cacheKey}:etag`, etag, 'EX', 3600);

    res
      .set('ETag', etag)
      .set('Cache-Control', 'public, max-age=3600')
      .status(200)
      .json({
        message: 'Products retrieved successfully',
        ...dataToCache,
      });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
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
    const product = await Product.findById(id).populate('category', 'name');
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
  const { error } = createProductSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }
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
      error,
    });
  }
};

const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const {
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
  } = req.body;
  try {
    if (!id) {
      res.status(400).json({ message: 'Product id is required' });
      return;
    }
    if (category && !mongoose.Types.ObjectId.isValid(category)) {
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
    if (product) {
      deleteProductKeysFromRedis();
    }
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
    if (product) {
      deleteProductKeysFromRedis();
    }
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
