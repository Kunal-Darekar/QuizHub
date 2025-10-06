const QuestionCard = ({ question, answer, onAnswerChange, showResult = false }) => {
  const handleOptionSelect = (index) => {
    if (showResult) return;

    if (question.type === 'multi-choice') {
      const currentAnswers = Array.isArray(answer) ? answer : [];
      const newAnswers = currentAnswers.includes(index)
        ? currentAnswers.filter(i => i !== index)
        : [...currentAnswers, index];
      onAnswerChange(newAnswers);
    } else {
      onAnswerChange(index);
    }
  };

  const isOptionSelected = (index) => {
    if (question.type === 'multi-choice') {
      return Array.isArray(answer) && answer.includes(index);
    }
    return answer === index;
  };

  const getOptionClass = (index) => {
    let className = 'option-item';
    if (isOptionSelected(index)) {
      className += ' selected';
    }
    if (showResult) {
      if (question.type === 'multi-choice') {
        if (Array.isArray(question.correctAnswer) && question.correctAnswer.includes(index)) {
          className += ' correct';
        } else if (isOptionSelected(index)) {
          className += ' incorrect';
        }
      } else {
        if (index === question.correctAnswer) {
          className += ' correct';
        } else if (isOptionSelected(index)) {
          className += ' incorrect';
        }
      }
    }
    return className;
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{question.text}</h3>
        {question.type === 'multi-choice' && (
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginTop: '0.5rem' }}>
            Select all that apply
          </p>
        )}
      </div>
      <ul className="options-list">
        {question.options.map((option, index) => (
          <li
            key={index}
            className={getOptionClass(index)}
            onClick={() => handleOptionSelect(index)}
          >
            <input
              type={question.type === 'multi-choice' ? 'checkbox' : 'radio'}
              className="option-radio"
              checked={isOptionSelected(index)}
              onChange={() => handleOptionSelect(index)}
              disabled={showResult}
            />
            <span>{option}</span>
          </li>
        ))}
      </ul>
      {showResult && question.explanation && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          background: 'var(--gray-50)', 
          borderRadius: '0.375rem' 
        }}>
          <strong>Explanation:</strong> {question.explanation}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;