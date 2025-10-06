import { Router } from 'express';
import { body } from 'express-validator';
import { protect, admin } from '../middleware/auth.js';
import { generateQuestions } from '../controllers/generatorController.js';

const router = Router();

const generationValidation = [
  body('topic').trim().notEmpty().withMessage('Topic is required'),
  body('numQuestions')
    .optional()
    .isInt({ min: 5, max: 25 })
    .withMessage('Number of questions must be between 5 and 25'),
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard')
];

router.post('/', protect, admin, generationValidation, generateQuestions);

export default router;