import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import BooksPage from "./pages/BooksPage";
import AddBookPage from "./pages/AddBookPage";
import BorrowsPage from "./pages/BorrowsPage";
import BorrowForm from "./pages/BorrowForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/add" element={<AddBookPage />} />
        {/* <Route path="/books/edit/:id" element={<BookForm />} /> */}
        <Route path="/borrows" element={<BorrowsPage />} />
        <Route path="/borrows/add" element={<BorrowForm />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;