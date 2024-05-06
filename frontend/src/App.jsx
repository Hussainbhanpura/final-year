import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import BookList from "./components/BookList";
import StudentList from "./components/StudentList";
import RentalList from "./components/RentalList";
import HomePage from "./Homepage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/rentals" element={<RentalList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
