import { validationResult } from 'express-validator';
import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import Attempt from '../models/Attempt.js';
import { calculateScore } from '../utils/scoring.js';

export async function getQuizzes(req, res, next) {
  try {
    const currentPage = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const skipCount = (currentPage - 1) * pageSize;

    const filter = { isActive: true };
    
    if (req.query.status) {
      filter.status = req.query.status;
    } else {
      filter.$or = [
        { status: 'published' },
        { status: { $exists: false } },
        { status: null }
      ];
    }

    const quizzes = await Quiz.find(filter)
      .populate('createdBy', 'name')
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip(skipCount)
      .limit(pageSize);

    // Get question count for each quiz
    const quizzesWithCount = await Promise.all(
      quizzes.map(async (quiz) => {
        const questionCount = await Question.countDocuments({ quizId: quiz._id });
        return {
          ...quiz.toObject(),
          questionCount
        };
      })
    );

    const total = await Quiz.countDocuments(filter);

    res.json({
      success: true,
      data: quizzesWithCount,
      pagination: {
        page: currentPage,
        limit: pageSize,
        total,
        pages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getQuiz(req, res, next) {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'name');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Don't send correct answers to client
    const questions = await Question.find({ quizId: quiz._id })
      .select('-correctOptionIndex -__v -explanation')
      .sort({ order: 1 });

    res.json({
      success: true,
      data: {
        quiz,
        questions
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function createQuiz(req, res, next) {
  try {
    console.log('📝 Creating quiz with data:', req.body);
    console.log('👤 User:', req.user?.id);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const quiz = await Quiz.create({
      ...req.body,
      createdBy: req.user.id
    });

    console.log('✅ Quiz created successfully:', quiz._id);

    res.status(201).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    console.error('❌ Quiz creation error:', error.message);
    next(error);
  }
}

export async function addQuestion(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Get current question count for ordering
    const questionCount = await Question.countDocuments({ quizId: quiz._id });

    const question = await Question.create({
      ...req.body,
      quizId: quiz._id,
      order: req.body.order !== undefined ? req.body.order : questionCount
    });

    res.status(201).json({
      success: true,
      data: question
    });
  } catch (error) {
    next(error);
  }
}

export async function submitQuiz(req, res, next) {
  try {
    const { answers, startedAt } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Please provide valid answers' });
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Get all questions with correct answers
    const questions = await Question.find({ quizId: quiz._id });

    // Calculate score
    const result = calculateScore(answers, questions);

    // Save attempt
    const attempt = await Attempt.create({
      user: req.user.id,
      quiz: quiz._id,
      answers: result.details,
      score: result.score,
      totalMarks: result.totalMarks,
      startedAt: startedAt ? new Date(startedAt) : new Date(),
      completedAt: new Date(),
      completed: true
    });

    res.json({
      success: true,
      data: {
        attemptId: attempt._id,
        score: result.score,
        totalMarks: result.totalMarks,
        percentage: attempt.percentage,
        details: result.details,
        timeTaken: attempt.timeTaken
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserAttempts(req, res, next) {
  try {
    const attempts = await Attempt.find({
      user: req.user.id,
      quiz: req.params.id
    })
      .select('-answers')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: attempts
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllUserAttempts(req, res, next) {
  try {
    const attempts = await Attempt.find({
      user: req.user.id,
      completed: true
    })
      .populate('quiz', 'title description topic difficulty')
      .select('-answers')
      .sort({ completedAt: -1 })
      .limit(50);

    // Add totalQuestions count for each attempt
    const attemptsWithCount = await Promise.all(
      attempts.map(async (attempt) => {
        if (!attempt.quiz) {
          return {
            ...attempt.toObject(),
            totalQuestions: 0,
            quiz: { title: 'Deleted Quiz', description: '', topic: 'Unknown', difficulty: 'medium' }
          };
        }
        const questionCount = await Question.countDocuments({ quizId: attempt.quiz._id });
        return {
          ...attempt.toObject(),
          totalQuestions: questionCount
        };
      })
    );

    res.json({
      success: true,
      data: attemptsWithCount
    });
  } catch (error) {
    console.error('Error fetching user attempts:', error);
    next(error);
  }
}

export async function getAttemptDetails(req, res, next) {
  try {
    const attempt = await Attempt.findById(req.params.attemptId)
      .populate('quiz', 'title description')
      .populate('answers.questionId');

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    // Verify ownership
    if (attempt.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      success: true,
      data: attempt
    });
  } catch (error) {
    next(error);
  }
}

export async function updateQuiz(req, res, next) {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Update quiz with provided fields
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedQuiz
    });
  } catch (error) {
    next(error);
  }
}