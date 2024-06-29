import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BookList from "./components/BookList";
import AddBook from "./components/AddBook";
import StudentList from "./components/StudentList";
import EditStudent from "./components/EditStudent";
import RentalList from "./components/RentalList";
import HomePage from "./components/Homepage";
import EditBook from "./components/EditBook";
import Login from "./components/Login";
import Register from "./components/Register";
import Library from "./components/Library";
import Checkout from "./components/Checkout";
import RentalPage from "./components/RentalPage";
function App() {
  return (
    <Router>
      <div className='App container-fluid row'>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/' element={<HomePage />}>
            <Route path='' element={<Library />} />
            <Route path='addbook' element={<AddBook />} />
            <Route path='books' element={<BookList />} />
            <Route path='students' element={<StudentList />} />
            <Route path='editstudent/:id' element={<EditStudent />} />
            <Route path='rentals' element={<RentalList />} />
            <Route path='/rentalpage/:id' element={<RentalPage />} />
            <Route path='editbook/:id' element={<EditBook />} />
            <Route path='checkout' element={<Checkout />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
