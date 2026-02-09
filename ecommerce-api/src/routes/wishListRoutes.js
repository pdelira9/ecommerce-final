import express from 'express';
import { body, param } from 'express-validator';
import validate from '../middlewares/validation.js';
import {
  getUserWishList,
  addToWishList,
  removeFromWishList,
  clearWishList,
  checkProductInWishList,
  moveToCart
} from '../controllers/wishListController.js';
import authMiddleware from '../middlewares/auth.js'; 

const router = express.Router();

router.get('/', authMiddleware, getUserWishList);

router.post('/add', [
  body('productId')
    .notEmpty().withMessage('Product ID is required')
    .isMongoId().withMessage('Product ID must be a valid MongoDB ObjectId')
], validate, authMiddleware, addToWishList);

router.get('/check/:productId', [
  param('productId')
    .isMongoId().withMessage('Product ID must be a valid MongoDB ObjectId')
], validate, authMiddleware, checkProductInWishList);

router.delete('/remove/:productId', [
  param('productId')
    .isMongoId().withMessage('Product ID must be a valid MongoDB ObjectId')
], validate, authMiddleware, removeFromWishList);

router.post('/move-to-cart', [
  body('productId')
    .notEmpty().withMessage('Product ID is required')
    .isMongoId().withMessage('Product ID must be a valid MongoDB ObjectId')
], validate, authMiddleware, moveToCart);

router.delete('/clear', authMiddleware, clearWishList);

export default router;