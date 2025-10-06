import { Schema, model } from 'mongoose';

const questionSchema = new Schema({
  quizId: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
    index: true
  },
  text: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  options: {
    type: [String],
    required: [true, 'Options are required'],
    validate: {
      validator: function(v) {
        return v && v.length >= 2;
      },
      message: 'At least 2 options are required'
    }
  },
  correctOptionIndex: {
    type: Schema.Types.Mixed, // Can be Number or Array of Numbers
    required: [true, 'Correct answer index is required'],
    validate: {
      validator: function(v) {
        if (this.type === 'multi-choice') {
          return Array.isArray(v) && v.length > 0;
        }
        return typeof v === 'number' && v >= 0;
      },
      message: 'Invalid correctOptionIndex for question type'
    }
  },
  marks: {
    type: Number,
    required: true,
    default: 1,
    min: 0
  },
  type: {
    type: String,
    enum: ['single-choice', 'multi-choice', 'text'],
    default: 'single-choice'
  },
  explanation: {
    type: String,
    maxlength: 200,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

questionSchema.index({ quizId: 1, order: 1 });

export default model('Question', questionSchema);
