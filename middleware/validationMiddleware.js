import { body, validationResult } from 'express-validator';

const withValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateLogin = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be valid'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  withValidationResult
];

export const validateRegister = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be valid'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  withValidationResult
];

export const validateChangePassword = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  withValidationResult
];

export const validateCreateTodo = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters')
    .isLength({ max: 100 }).withMessage('Title must be less than 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority must be one of: low, medium, high'),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .isString().withMessage('Each tag must be a string'),
  body('dueDate')
    .optional()
    .isISO8601().toDate().withMessage('DueDate must be a valid date'),
  body('reminderAt')
    .optional()
    .isISO8601().toDate().withMessage('ReminderAt must be a valid date'),
  withValidationResult
];

export const validateUpdateTodo = [
  body('title')
    .optional()
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters')
    .isLength({ max: 100 }).withMessage('Title must be less than 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority must be one of: low, medium, high'),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .isString().withMessage('Each tag must be a string'),
  body('dueDate')
    .optional()
    .isISO8601().toDate().withMessage('DueDate must be a valid date'),
  body('reminderAt')
    .optional()
    .isISO8601().toDate().withMessage('ReminderAt must be a valid date'),
  body('completed')
    .optional()
    .isBoolean().withMessage('Completed must be true or false'),
  withValidationResult
];

export const validateShareTodo = [
  body('userId')
    .notEmpty().withMessage('UserId is required')
    .isMongoId().withMessage('UserId must be a valid MongoDB ObjectId'),
  body('permission')
    .optional()
    .isIn(['read', 'write']).withMessage('Permission must be read or write'),
  withValidationResult
];
