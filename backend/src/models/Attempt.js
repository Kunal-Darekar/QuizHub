import { Schema, model } from 'mongoose';

const attemptSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  totalMarks: {
    type: Number,
    default: 0
  },
  answers: [{
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'Question'
    },
    answer: Schema.Types.Mixed,
    isCorrect: Boolean,
    marksAwarded: Number,
    correctAnswer: Schema.Types.Mixed,
    questionText: String,
    explanation: String
  }],
  completed: {
    type: Boolean,
    default: false
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
});

attemptSchema.virtual('percentage').get(function() {
  return this.totalMarks > 0 ? Math.round((this.score / this.totalMarks) * 100) : 0;
});

attemptSchema.virtual('timeTaken').get(function() {
  if (this.completedAt && this.startedAt) {
    return Math.round((this.completedAt - this.startedAt) / (1000 * 60));
  }
  return 0;
});

// Virtual to get total questions from answers array
attemptSchema.virtual('totalQuestions').get(function() {
  return this.answers ? this.answers.length : 0;
});

attemptSchema.set('toJSON', { virtuals: true });

export default model('Attempt', attemptSchema);
