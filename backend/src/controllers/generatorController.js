import { validationResult } from 'express-validator';
import { aiGenerator } from '../services/aiService.js';
import { generateQuizQuestions } from '../services/noApiService.js';

export async function generateQuestions(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { topic, numQuestions = 15, difficulty = 'medium' } = req.body;

    try {
      console.log(`🧠 Generating ${numQuestions} ${difficulty} questions about "${topic}"`);
      
      let result;
      let usedProvider = 'unknown';
      
      // First try AI services if available
      try {
        console.log('🤖 Attempting AI generation...');
        result = await aiGenerator.generateQuestions(topic, numQuestions, difficulty);
        usedProvider = result.provider || 'ai';
        console.log(`✅ Successfully generated ${result.questions.length} questions using AI (${usedProvider})`);
      } catch (aiError) {
        console.log(`⚠️ AI generation failed: ${aiError.message}`);
        console.log('🔄 Falling back to template-based generation...');
        
        // Fallback to template-based generation
        result = await generateQuizQuestions(topic, numQuestions, difficulty);
        usedProvider = result.provider || 'template-based';
        console.log(`✅ Successfully generated ${result.questions.length} questions using template-based generation`);
      }
      
      res.json({
        success: true,
        data: {
          questions: result.questions,
          provider: usedProvider,
          generated: result.questions.length,
          requested: numQuestions,
          message: `Generated ${result.questions.length} questions using ${usedProvider.replace('-', ' ').toUpperCase()}`
        }
      });
    } catch (error) {
      console.error('❌ Question generation failed:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to generate questions. Please try again.',
        error: error.message
      });
    }
  } catch (error) {
    console.error('Generate questions error:', error.message);
    next(error);
  }
}