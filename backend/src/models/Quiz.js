import { Schema, model } from 'mongoose';

const quizSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a quiz title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true
  },
  topic: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  timeLimit: {
    type: Number,
    default: 0 // 0 means no time limit, otherwise in minutes
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

quizSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default model('Quiz', quizSchema);