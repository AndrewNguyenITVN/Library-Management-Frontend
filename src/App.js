import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import BooksPage from "./pages/BooksPage";
import AddBookPage from "./pages/AddBookPage";
import BorrowsPage from "./pages/BorrowsPage";
import BorrowForm from "./pages/BorrowForm";
import ReaderManagementPage from "./pages/ReaderManagementPage";
import AddUserPage from "./pages/AddUserPage";
import OverdueBorrowersPage from "./pages/OverdueBorrowersPage";
import BorrowingStatsPage from "./pages/BorrowingStatsPage";
import Layout from "./components/Layout";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('jwtToken'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('jwtToken'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setIsAuthenticated(false);
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return <Layout handleLogout={handleLogout}>{children}</Layout>;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <BooksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books/add"
          element={
            <ProtectedRoute>
              <AddBookPage />
            </ProtectedRoute>
          }
        />
        {/* <Route path="/books/edit/:id" element={<BookForm />} /> */}
        <Route
          path="/reader-management"
          element={
            <ProtectedRoute>
              <ReaderManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/borrows"
          element={
            <ProtectedRoute>
              <BorrowsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/borrows/overdue"
          element={
            <ProtectedRoute>
              <OverdueBorrowersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/borrows/stats"
          element={
            <ProtectedRoute>
              <BorrowingStatsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/borrows/add"
          element={
            <ProtectedRoute>
              <BorrowForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-user"
          element={
            <ProtectedRoute>
              <AddUserPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={isAuthenticated ? <Navigate to="/borrows" replace /> : <Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;