import WishList from '../models/wishList.js';
import Product from '../models/product.js';

const getUserWishList = async (req, res, next) => {
  try {
    const userId = req.user.userId; 

    let wishList = await WishList.findOne({ user: userId })
      .populate('products.product', 'name price images category inStock');

    if (!wishList) {
      wishList = new WishList({ user: userId, products: [] });
      await wishList.save();
    }

    res.status(200).json({
      message: 'Wishlist retrieved successfully',
      count: wishList.products.length,
      wishList
    });
  } catch (error) {
    next(error);
  }
};

const addToWishList = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishList = await WishList.findOne({ user: userId });

    if (!wishList) {
      wishList = new WishList({
        user: userId,
        products: [{ product: productId }]
      });
    } else {
      const productExists = wishList.products.some(
        item => item.product.toString() === productId
      );

      if (productExists) {
        return res.status(400).json({ message: 'Product already in wishlist' });
      }

      wishList.products.push({ product: productId });
    }

    await wishList.save();
    await wishList.populate('products.product', 'name price images category inStock');

    res.status(200).json({
      message: 'Product added to wishlist successfully',
      wishList
    });
  } catch (error) {
    next(error);
  }
};

const removeFromWishList = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    const wishList = await WishList.findOne({ user: userId });

    if (!wishList) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    const productIndex = wishList.products.findIndex(
      item => item.product.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in wishlist' });
    }

    wishList.products.splice(productIndex, 1);
    await wishList.save();

    await wishList.populate('products.product', 'name price images category inStock');

    res.status(200).json({
      message: 'Product removed from wishlist successfully',
      wishList
    });
  } catch (error) {
    next(error);
  }
};

const clearWishList = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const wishList = await WishList.findOne({ user: userId });

    if (!wishList) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishList.products = [];
    await wishList.save();

    res.status(200).json({
      message: 'Wishlist cleared successfully',
      wishList
    });
  } catch (error) {
    next(error);
  }
};

const checkProductInWishList = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    const wishList = await WishList.findOne({ user: userId });

    if (!wishList) {
      return res.status(200).json({
        message: 'Product not in wishlist',
        inWishList: false
      });
    }

    const productExists = wishList.products.some(
      item => item.product.toString() === productId
    );

    res.status(200).json({
      message: productExists ? 'Product is in wishlist' : 'Product not in wishlist',
      inWishList: productExists
    });
  } catch (error) {
    next(error);
  }
};

const moveToCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;

    const wishList = await WishList.findOne({ user: userId });

    if (!wishList) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    const productIndex = wishList.products.findIndex(
      item => item.product.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in wishlist' });
    }


    wishList.products.splice(productIndex, 1);
    await wishList.save();

    res.status(200).json({
      message: 'Product moved to cart and removed from wishlist',
      wishList
    });
  } catch (error) {
    next(error);
  }
};

export {
  getUserWishList,
  addToWishList,
  removeFromWishList,
  clearWishList,
  checkProductInWishList,
  moveToCart
};