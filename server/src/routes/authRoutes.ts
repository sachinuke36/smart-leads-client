import { Router } from 'express';
import { body, param } from 'express-validator';
import { register, login, getMe, getAllUsers, updateUserRole } from '../controllers';
import { authenticate, authorize, validate } from '../middleware';
import { UserRole } from '../types';

const router = Router();

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['admin', 'sales'])
    .withMessage('Role must be either admin or sales')
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const updateRoleValidation = [
  param('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid user ID'),
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['admin', 'sales'])
    .withMessage('Role must be either admin or sales')
];

// Routes
router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);
router.get('/me', authenticate, getMe);

// Admin only routes
router.get('/users', authenticate, authorize(UserRole.ADMIN), getAllUsers);
router.patch('/users/:userId/role', authenticate, authorize(UserRole.ADMIN), validate(updateRoleValidation), updateUserRole);

export default router;
