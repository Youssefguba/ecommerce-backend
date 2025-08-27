const { body, validationResult } = require('express-validator');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }
  next();
};

// User validation rules
const userValidation = {
  register: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('firstName')
      .notEmpty()
      .trim()
      .withMessage('First name is required'),
    body('lastName')
      .notEmpty()
      .trim()
      .withMessage('Last name is required'),
  ],
  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  updateProfile: [
    body('firstName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('First name cannot be empty'),
    body('lastName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Last name cannot be empty'),
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('phone')
      .optional()
      .isMobilePhone()
      .withMessage('Please provide a valid phone number'),
  ],
};

// Product validation rules
const productValidation = {
  create: [
    body('name')
      .notEmpty()
      .trim()
      .withMessage('Product name is required'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('sku')
      .notEmpty()
      .trim()
      .withMessage('SKU is required'),
    body('categoryId')
      .isInt({ min: 1 })
      .withMessage('Valid category ID is required'),
    body('stock')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer'),
  ],
};

// Cart validation rules
const cartValidation = {
  addItem: [
    body('productId')
      .isInt({ min: 1 })
      .withMessage('Valid product ID is required'),
    body('quantity')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Quantity must be a positive integer'),
  ],
  updateItem: [
    body('quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be a positive integer'),
  ],
};

module.exports = {
  handleValidationErrors,
  userValidation,
  productValidation,
  cartValidation,
};
