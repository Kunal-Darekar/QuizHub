import { Router } from 'express';
import { body } from 'express-validator';
import { protect, admin } from '../middleware/auth.js';
import { getQuizzes, getQuiz, createQuiz, updateQuiz, addQuestion, submitQuiz, getUserAttempts, getAllUserAttempts, getAttemptDetails } from '../controllers/quizController.js';

const router = Router();

const quizValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard'])
];

const questionValidation = [
  body('text').trim().notEmpty().withMessage('Question text is required'),
  body('options').isArray({ min: 2 }).withMessage('At least 2 options required'),
  body('correctOptionIndex').exists().withMessage('Correct answer is required'),
  body('marks').optional().isInt({ min: 0 }),
  body('type').optional().isIn(['single-choice', 'multi-choice', 'text'])
];

router.get('/', protect, getQuizzes);
router.get('/my-attempts', protect, getAllUserAttempts);
router.get('/:id', protect, getQuiz);
router.post('/:id/submit', protect, submitQuiz);
router.get('/:id/attempts', protect, getUserAttempts);
router.get('/attempts/:attemptId', protect, getAttemptDetails);
router.post('/', protect, admin, quizValidation, createQuiz);
router.patch('/:id', protect, admin, updateQuiz);
router.post('/:quizId/questions', protect, admin, questionValidation, addQuestion);

export default router;