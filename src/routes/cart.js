const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { protect } = require('../middleware/auth');
const { cartValidation, handleValidationErrors } = require('../utils/validation');

const router = express.Router();
const prisma = new PrismaClient();

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
                stock: true,
                isActive: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      // Create cart if it doesn't exist
      const newCart = await prisma.cart.create({
        data: { userId: req.user.id },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  imageUrl: true,
                  stock: true,
                  isActive: true,
                },
              },
            },
          },
        },
      });

      return res.status(200).json({
        success: true,
        data: {
          cart: newCart,
          summary: {
            itemsCount: 0,
            totalAmount: 0,
          },
        },
      });
    }

    // Calculate cart summary
    const summary = cart.items.reduce(
      (acc, item) => {
        if (item.product.isActive) {
          acc.itemsCount += item.quantity;
          acc.totalAmount += parseFloat(item.product.price) * item.quantity;
        }
        return acc;
      },
      { itemsCount: 0, totalAmount: 0 }
    );

    res.status(200).json({
      success: true,
      data: {
        cart,
        summary,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
router.post('/items', protect, cartValidation.addItem, handleValidationErrors, async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Check if product exists and is active
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Product not found or inactive',
      });
    }

    // Check if sufficient stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient stock available',
      });
    }

    // Get or create user's cart
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user.id },
      });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    let cartItem;

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;

      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          error: 'Insufficient stock for the requested quantity',
        });
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
              stock: true,
            },
          },
        },
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
              stock: true,
            },
          },
        },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      data: { cartItem },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:itemId
// @access  Private
router.put('/items/:itemId', protect, cartValidation.updateItem, handleValidationErrors, async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    // Find cart item and verify ownership
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: parseInt(itemId),
        cart: { userId: req.user.id },
      },
      include: {
        product: true,
      },
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found',
      });
    }

    // Check stock availability
    if (cartItem.product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient stock available',
      });
    }

    // Update quantity
    const updatedItem = await prisma.cartItem.update({
      where: { id: parseInt(itemId) },
      data: { quantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
            stock: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Cart item updated successfully',
      data: { cartItem: updatedItem },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private
router.delete('/items/:itemId', protect, async (req, res, next) => {
  try {
    const { itemId } = req.params;

    // Find cart item and verify ownership
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: parseInt(itemId),
        cart: { userId: req.user.id },
      },
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found',
      });
    }

    // Delete cart item
    await prisma.cartItem.delete({
      where: { id: parseInt(itemId) },
    });

    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
router.delete('/', protect, async (req, res, next) => {
  try {
    // Delete all cart items for user
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
