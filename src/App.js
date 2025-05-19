import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import BooksPage from "./pages/BooksPage";
import AddBookPage from "./pages/AddBookPage";
import BorrowsPage from "./pages/BorrowsPage";
import BorrowForm from "./pages/BorrowForm";
import ReaderManagementPage from "./pages/ReaderManagementPage";
import Layout from "./components/Layout";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return <Layout>{children}</Layout>;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />}
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
          path="/borrows/add"
          element={
            <ProtectedRoute>
              <BorrowForm />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;