export class AIQuizGenerator {
  async generateQuestions(topic, numQuestions, difficulty) {
    console.log(`AI generation requested for ${topic} (${difficulty}, ${numQuestions} questions)`);
    throw new Error('AI providers not configured - using template fallback');
  }
}

export const aiGenerator = new AIQuizGenerator();
