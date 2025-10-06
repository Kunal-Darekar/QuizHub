const validateGeneratedQuestions = (data) => {
  const errors = [];

  // Check if data has questions array
  if (!data || typeof data !== 'object') {
    errors.push('Response is not a valid object');
    return { valid: false, errors };
  }

  if (!Array.isArray(data.questions)) {
    errors.push('Questions field must be an array');
    return { valid: false, errors };
  }

  if (data.questions.length === 0) {
    errors.push('No questions generated');
    return { valid: false, errors };
  }

  // Validate each question
  data.questions.forEach((q, index) => {
    if (!q.text || typeof q.text !== 'string' || q.text.trim() === '') {
      errors.push(`Question ${index + 1}: text is required and must be a non-empty string`);
    }

    if (!Array.isArray(q.options)) {
      errors.push(`Question ${index + 1}: options must be an array`);
    } else if (q.options.length < 2) {
      errors.push(`Question ${index + 1}: must have at least 2 options`);
    } else if (q.options.some(opt => typeof opt !== 'string' || opt.trim() === '')) {
      errors.push(`Question ${index + 1}: all options must be non-empty strings`);
    }

    // Validate correctOptionIndex based on type
    if (q.type === 'multi-choice') {
      if (!Array.isArray(q.correctOptionIndex)) {
        errors.push(`Question ${index + 1}: multi-choice questions require correctOptionIndex to be an array`);
      } else if (q.correctOptionIndex.length === 0) {
        errors.push(`Question ${index + 1}: correctOptionIndex array cannot be empty`);
      } else if (q.correctOptionIndex.some(idx => typeof idx !== 'number' || idx < 0 || idx >= q.options.length)) {
        errors.push(`Question ${index + 1}: invalid correctOptionIndex values`);
      }
    } else {
      if (typeof q.correctOptionIndex !== 'number') {
        errors.push(`Question ${index + 1}: correctOptionIndex must be a number`);
      } else if (q.correctOptionIndex < 0 || q.correctOptionIndex >= q.options.length) {
        errors.push(`Question ${index + 1}: correctOptionIndex out of range`);
      }
    }

    if (q.type && !['single-choice', 'multi-choice', 'text'].includes(q.type)) {
      errors.push(`Question ${index + 1}: invalid type "${q.type}"`);
    }

    if (q.marks !== undefined && (typeof q.marks !== 'number' || q.marks < 0)) {
      errors.push(`Question ${index + 1}: marks must be a non-negative number`);
    }

    if (q.explanation && typeof q.explanation !== 'string') {
      errors.push(`Question ${index + 1}: explanation must be a string`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
};

export { validateGeneratedQuestions };