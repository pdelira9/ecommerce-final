import express from 'express';
import {
  getCarts,
  getCartById,
  getCartByUser,
  createCart,
  updateCart,
  deleteCart,
  addProductToCart,
  removeFromCart
} from '../controllers/cartController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import isAdmin from '../middlewares/isAdminMiddleware.js';

const router = express.Router();

router.get('/cart', authMiddleware, isAdmin, getCarts);
router.get('/cart/user/:id', authMiddleware, getCartByUser);

router.get('/cart/:id', authMiddleware, isAdmin, getCartById);

router.post('/cart', authMiddleware, createCart);

router.post('/cart/add-product', authMiddleware, addProductToCart);

router.delete(
  "/cart/remove-product",
  authMiddleware,
  removeFromCart
);

router.put('/cart/:id', authMiddleware, updateCart);

router.delete('/cart/:id', authMiddleware, deleteCart);

export default router;
