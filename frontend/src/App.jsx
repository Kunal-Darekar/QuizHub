import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import QuizTake from './pages/QuizTake';
import Result from './pages/Result';
import CreateQuiz from './pages/CreateQuiz';
import QuizEdit from './pages/QuizEdit';
import MyQuizzes from './pages/MyQuizzes';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/quiz/:id" element={<QuizTake />} />
              <Route path="/result/:attemptId" element={<Result />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <CreateQuiz />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-quizzes"
                element={
                  <ProtectedRoute>
                    <MyQuizzes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quiz/:id/edit"
                element={
                  <ProtectedRoute requireAdmin>
                    <QuizEdit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-quiz"
                element={
                  <ProtectedRoute requireAdmin>
                    <CreateQuiz />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;