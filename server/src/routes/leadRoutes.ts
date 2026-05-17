import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  exportLeads
} from '../controllers';
import { authenticate, validate } from '../middleware';
import { LeadStatus, LeadSource } from '../types';

const router = Router();

// All lead routes require authentication
router.use(authenticate);

// Validation rules
const createLeadValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Lead name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('status')
    .optional()
    .isIn(Object.values(LeadStatus))
    .withMessage(`Status must be one of: ${Object.values(LeadStatus).join(', ')}`),
  body('source')
    .notEmpty()
    .withMessage('Source is required')
    .isIn(Object.values(LeadSource))
    .withMessage(`Source must be one of: ${Object.values(LeadSource).join(', ')}`)
];

const updateLeadValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid lead ID'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('status')
    .optional()
    .isIn(Object.values(LeadStatus))
    .withMessage(`Status must be one of: ${Object.values(LeadStatus).join(', ')}`),
  body('source')
    .optional()
    .isIn(Object.values(LeadSource))
    .withMessage(`Source must be one of: ${Object.values(LeadSource).join(', ')}`),
  body('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('Invalid assignedTo user ID')
];

const getLeadsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('status')
    .optional()
    .isIn(Object.values(LeadStatus))
    .withMessage(`Status must be one of: ${Object.values(LeadStatus).join(', ')}`),
  query('source')
    .optional()
    .isIn(Object.values(LeadSource))
    .withMessage(`Source must be one of: ${Object.values(LeadSource).join(', ')}`),
  query('sortBy')
    .optional()
    .isIn(['latest', 'oldest'])
    .withMessage('sortBy must be either latest or oldest')
];

const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid lead ID')
];

// Routes
router.get('/', validate(getLeadsValidation), getLeads);
router.get('/export', exportLeads);
router.get('/:id', validate(idValidation), getLead);
router.post('/', validate(createLeadValidation), createLead);
router.put('/:id', validate(updateLeadValidation), updateLead);
router.delete('/:id', validate(idValidation), deleteLead);

export default router;
