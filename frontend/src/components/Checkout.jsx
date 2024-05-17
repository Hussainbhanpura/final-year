import React, { useState, useEffect, useRef } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
} from "mdb-react-ui-kit";
import axios from "axios";
import BASE_URL from "../config.js";
import "./Checkout.css";

const cartFromLocalStorage = JSON.parse(
  window.localStorage.getItem("checkout") || "[]"
);
let price = 0;
cartFromLocalStorage.forEach((b) => {
  price += b.price * b.cartQuantity;
});

const CheckoutPage = () => {
  const [studentId, setStudentId] = useState("");
  const [bookId, setBookId] = useState("");
  const [checkoutCart, setCheckoutCart] = useState(cartFromLocalStorage);
  const [total, setTotal] = useState(price);
  const [debouncedStudentId, setDebouncedStudentId] = useState(studentId);
  const [student, setStudent] = useState("");
  const studentIdInputRef = useRef(null);
  const bookIdInputRef = useRef(null);

  // Focus on Student ID input on component mount
  useEffect(() => {
    if (studentIdInputRef.current) {
      studentIdInputRef.current.focus();
    }
  }, []);

  // Handle student ID input changes
  const handleStudentIdChange = (e) => {
    setStudentId(e.target.value);
  };

  // Automatically focus on Book ID input when Student ID is entered
  useEffect(() => {
    if (studentId.length > 5 && bookIdInputRef.current) {
      bookIdInputRef.current.focus();
    }
  }, [studentId]);

  useEffect(() => {
    if (studentId.length > 5) {
      // Assuming some validation or length check
      bookIdInputRef.current.focus();
    }

    const handler = setTimeout(() => {
      setDebouncedStudentId(studentId);
    }, 500); // 1500 ms = 1.5 seconds

    return () => {
      clearTimeout(handler);
    };
  }, [studentId]);

  // Fetch student data when debouncedStudentId changes
  useEffect(() => {
    if (debouncedStudentId) {
      fetchStudentData();
    }
  }, [debouncedStudentId]);

  const fetchStudentData = async () => {
    setCheckoutCart([]);
    if (debouncedStudentId) {
      try {
        const res = await axios.get(
          `${BASE_URL}/students/${debouncedStudentId}`
        );
        setStudent(res.data.name);
        if (res.data.booksRented.length > 0) {
          res.data.booksRented.forEach(async (book) => {
            const b = await axios.get(`${BASE_URL}/books/${book._id}`);

            const newBook = {
              ...b.data[0],
              cartQuantity: book.quantity,
            };
            setCheckoutCart((prevCart) => [...prevCart, newBook]);
          });
        }
      } catch (error) {
        alert("No student found");
        studentIdInputRef.current.focus();
        setStudentId("");
      }
    }
  };

  useEffect(() => {
    window.localStorage.setItem("checkout", JSON.stringify(checkoutCart));
    let newTotal = 0;
    checkoutCart.forEach((item) => {
      newTotal += item.price * item.cartQuantity;
    });
    setTotal(newTotal);
  }, [checkoutCart]);

  const handleCheckout = async () => {
    if (studentId === "" || checkoutCart.length < 1) {
      alert("Student ID and book ID must be provided");
      return;
    }
    try {
      const cart = checkoutCart.map((check) => ({
        _id: check.isbn,
        quantity: check.cartQuantity,
      }));
      const data = { studentId, books: cart };
      await axios.post(`${BASE_URL}/rentals`, data);
      setStudentId("");
      setCheckoutCart([]);
    } catch (error) {
      alert("Error in checkout cart");
    }
  };

  const handleScan = async (id, studentId, sym) => {
    try {
      if (!id || !studentId) {
        alert("Enter both IDs");
        return;
      }
      const response = await axios.get(`${BASE_URL}/books/${id}`);
      setBookId("");
      const bookData = response.data[0];
      const existingCart = checkoutCart.find(
        (book) => book._id === bookData._id
      );

      if (existingCart) {
        if (sym === "+") {
          existingCart.cartQuantity++;
        } else if (existingCart.cartQuantity > 1) {
          existingCart.cartQuantity--;
        } else {
          setCheckoutCart(
            checkoutCart.filter((book) => book._id !== existingCart._id)
          );
          return;
        }
        setCheckoutCart([...checkoutCart]);
      } else if (sym === "+") {
        const newCartItem = { ...bookData, cartQuantity: 1 };
        setCheckoutCart([...checkoutCart, newCartItem]);
      } else {
        alert("Book not found in cart");
        return;
      }

      const newTotal = total + (sym === "+" ? bookData.price : -bookData.price);
      setTotal(newTotal);

      await updateBookQuantity(bookData.isbn, sym === "+" ? 1 : -1);
    } catch (error) {
      alert("Error scanning book");
    }
  };

  const updateBookQuantity = async (bookId, quantityChange) => {
    try {
      await axios.put(`${BASE_URL}/rentals/${bookId}`, {
        quantityChange,
      });
    } catch (error) {
      alert("Error updating book quantity in database");
    }
  };

  return (
    <MDBContainer className='py-5'>
      <MDBRow className='mb-4'>
        <MDBCol md='6'>
          <MDBInput
            label='Student ID'
            id='studentId'
            value={studentId}
            onChange={handleStudentIdChange}
            className='mb-3'
            ref={studentIdInputRef}
          />
        </MDBCol>
        <MDBCol md='6'>
          <p style={{ color: "blue", fontSize: "18px", fontWeight: "bold" }}>
            {student ? student : null}
          </p>
        </MDBCol>
      </MDBRow>
      <MDBRow className='mb-4'>
        <MDBCol md='6'>
          <MDBInput
            label='Book ID'
            id='bookId'
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            className='mb-3'
            ref={bookIdInputRef}
          />
        </MDBCol>
        <MDBCol md='6' className='d-flex align-items-center'>
          <button
            className='btn me-2 btn-add'
            onClick={() => handleScan(bookId, studentId, "+")}
            style={{ backgroundColor: "#4bc0d1", color: "white" }}
          >
            Add
          </button>
          <button
            className='btn btn-return'
            onClick={() => handleScan(bookId, studentId, "-")}
            style={{ backgroundColor: "#f76c6c", color: "white" }}
          >
            Return
          </button>
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol>
          <div className='table-responsive'>
            <table className='table table-bordered'>
              <thead className='bg-primary text-white'>
                <tr>
                  <th scope='col'>Rent Books</th>
                  <th scope='col'>Format</th>
                  <th scope='col'>Quantity</th>
                  <th scope='col'>Price</th>
                </tr>
              </thead>
              <tbody>
                {checkoutCart.map((book) => (
                  <tr key={book.id}>
                    <td>
                      <div className='d-flex align-items-center'>
                        <div className='flex-column'>
                          <p className='mb-2'>{book.title}</p>
                          <p className='mb-0 text-muted'>{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td>Paperback</td>
                    <td>
                      <input
                        id='form1'
                        min={0}
                        name='quantity'
                        value={book.cartQuantity}
                        type='text'
                        className='form-control form-control-sm'
                        style={{ width: 50 }}
                        readOnly
                      />
                    </td>
                    <td>${book.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MDBCol>
        <MDBCol lg='4' xl='3' className='mt-4 mt-lg-0'>
          <div className='p-3 shadow-2-strong' style={{ borderRadius: 16 }}>
            <div className='d-flex justify-content-between mb-2'>
              <p className='mb-2 fw-bold'>Subtotal</p>
              <p className='mb-2'>${total}</p>
            </div>
            <div className='d-flex justify-content-between mb-2'>
              <p className='mb-0 fw-bold'>Shipping</p>
              <p className='mb-0'>$0</p>
            </div>
            <hr className='my-4' />
            <div className='d-flex justify-content-between mb-4'>
              <p className='mb-2 fw-bold'>Total (tax included)</p>
              <p className='mb-2'>${total}</p>
            </div>
            <button onClick={handleCheckout} className='btn btn-success w-100'>
              Checkout
            </button>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default CheckoutPage;
