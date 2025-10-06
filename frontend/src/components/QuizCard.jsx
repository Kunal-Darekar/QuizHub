import { useNavigate } from 'react-router-dom';

const QuizCard = ({ quiz }) => {
  const navigate = useNavigate();

  const getDifficultyBadgeClass = (difficulty) => {
    const classes = {
      easy: 'badge-easy',
      medium: 'badge-medium',
      hard: 'badge-hard'
    };
    return `badge ${classes[difficulty] || 'badge-medium'}`;
  };

  return (
    <div className="quiz-card" onClick={() => navigate(`/quiz/${quiz._id}`)}>
      <h3 className="quiz-card-title">{quiz.title}</h3>
      <p className="quiz-card-description">{quiz.description}</p>
      <div className="quiz-card-meta">
        <span className={getDifficultyBadgeClass(quiz.difficulty)}>
          {quiz.difficulty}
        </span>
        <span>📝 {quiz.questionCount} questions</span>
        {quiz.timeLimit > 0 && <span>⏱️ {quiz.timeLimit} min</span>}
      </div>
    </div>
  );
};

export default QuizCard;