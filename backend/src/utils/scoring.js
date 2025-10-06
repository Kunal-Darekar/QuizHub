const calculateScore = (userAnswers, questions) => {
  let totalScore = 0;
  let totalMarks = 0;
  const details = [];

  // Create a map of questions for quick lookup
  const questionMap = new Map();
  questions.forEach(q => {
    questionMap.set(q._id.toString(), q);
    totalMarks += q.marks || 1;
  });

  userAnswers.forEach(userAnswer => {
    const question = questionMap.get(userAnswer.questionId);
    
    if (!question) {
      details.push({
        questionId: userAnswer.questionId,
        answer: userAnswer.answer,
        isCorrect: false,
        marksAwarded: 0,
        error: 'Question not found'
      });
      return;
    }

    let isCorrect = false;
    let marksAwarded = 0;

    switch (question.type) {
      case 'single-choice':
        isCorrect = userAnswer.answer === question.correctOptionIndex;
        marksAwarded = isCorrect ? (question.marks || 1) : 0;
        break;

      case 'multi-choice':
        // For multi-choice, correctOptionIndex should be an array
        if (Array.isArray(question.correctOptionIndex) && Array.isArray(userAnswer.answer)) {
          const userSet = new Set(userAnswer.answer.sort());
          const correctSet = new Set(question.correctOptionIndex.sort());
          
          // Check if arrays are equal
          isCorrect = userSet.size === correctSet.size && 
                     [...userSet].every(val => correctSet.has(val));
          
          marksAwarded = isCorrect ? (question.marks || 1) : 0;
        }
        break;

      case 'text':
        // For text questions, use exact match (case-insensitive)
        // In a production app, you might want fuzzy matching or manual grading
        if (typeof userAnswer.answer === 'string' && typeof question.correctOptionIndex === 'string') {
          isCorrect = userAnswer.answer.trim().toLowerCase() === 
                     question.correctOptionIndex.trim().toLowerCase();
          marksAwarded = isCorrect ? (question.marks || 1) : 0;
        }
        break;

      default:
        console.warn(`Unknown question type: ${question.type}`);
    }

    totalScore += marksAwarded;

    details.push({
      questionId: question._id,
      answer: userAnswer.answer,
      isCorrect,
      marksAwarded,
      correctAnswer: question.correctOptionIndex,
      questionText: question.text,
      explanation: question.explanation
    });
  });

  return {
    score: totalScore,
    totalMarks,
    percentage: totalMarks > 0 ? Math.round((totalScore / totalMarks) * 100) : 0,
    details
  };
};

export { calculateScore };
