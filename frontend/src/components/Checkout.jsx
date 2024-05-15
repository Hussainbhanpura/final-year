import React, { useState, useEffect } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
} from "mdb-react-ui-kit";
import axios from "axios";
import BASE_URL from "../config.js";

const cartFromLocalStorage = JSON.parse(
  window.localStorage.getItem("checkout") || "[]"
);
let price = 0;
const totalfromLocalStorage = cartFromLocalStorage.map((b) => {
  price = price + b.price * b.cartQuantity;
});

const CheckoutPage = () => {
  const [studentId, setStudentId] = useState("");
  const [bookId, setBookId] = useState("");
  const [checkoutCart, setCheckoutCart] = useState(cartFromLocalStorage);
  const [total, setTotal] = useState(price);

  useEffect(() => {
    window.localStorage.setItem("checkout", JSON.stringify(checkoutCart));
  }, [checkoutCart]);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (studentId) {
        const res = await axios.get(`${BASE_URL}/students/${studentId}`);
        setCheckoutCart([...checkoutCart, res.data.booksRented]);
      }
    };
    fetchStudentData();
  }, [studentId]);

  const handleCheckout = async () => {
    if (studentId === "" || checkoutCart.length < 1) {
      alert("Student Id and book Id must be provided");
      return;
    }
    try {
      const cart = [];
      checkoutCart.map((check) => {
        cart.push({
          _id: check.isbn,
          quantity: check.cartQuantity,
        });
      });
      const data = { studentId: studentId, books: cart };
      const res = await axios.post(`${BASE_URL}/rentals`, data);
      console.log(`Response`, res);
      setStudentId("");
      setCheckoutCart([]);
    } catch (error) {
      alert("Error in checkout cart");
    }
  };

  const handleRemoveBookFromCart = async () => {};

  const handleScan = async (id, sym) => {
    try {
      if (id === undefined || id === "") {
        alert("Enter book id");
        return;
      }
      const response = await axios.get(`${BASE_URL}/books/${id}`);
      setBookId("");
      const existingCart = checkoutCart.find(
        (book) => book._id === response.data[0]._id
      );
      if (existingCart) {
        if (sym === "+") {
          existingCart.cartQuantity++;
        } else {
          if (existingCart.cartQuantity > 1) {
            existingCart.cartQuantity--;
            setCheckoutCart([...checkoutCart]);
          } else {
            setCheckoutCart(
              checkoutCart.filter((book) => book._id !== existingCart._id)
            );
          }
        }
      } else {
        if (sym === "+") {
          const newCartItem = {
            ...response.data[0],
            cartQuantity: 1,
          };
          setCheckoutCart([...checkoutCart, newCartItem]);
        } else {
          alert("Book not found in cart");
        }
      }
      if (sym === "+") {
        setTotal(total + response.data[0].price);
      } else {
        setTotal(total - response.data[0].price);
      }
    } catch (error) {}
  };

  console.log("Checkout Cart:", checkoutCart); // Log the entire cart to see what data it contains

  return (
    <section className='h-100 h-custom'>
      <div className='container h-100 py-5'>
        <MDBRow>
          <MDBCol md='6'>
            <MDBInput
              label='Student ID'
              id='studentId'
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol md='6'>
            <MDBInput
              label='Book ID'
              id='bookId'
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
            />
          </MDBCol>
          <MDBCol md='6'>
            <button
              onClick={() => handleScan(bookId, "+")}
              type='button'
              className='btn'
              style={{
                backgroundColor: "#4bc0d1",
                color: "white",
                margin: "10px",
              }}
            >
              Add
            </button>
            <button
              onClick={() => handleScan(bookId, "-")}
              type='button'
              className='btn'
              style={{
                backgroundColor: "#f76c6c",
                color: "white",
                margin: "10px",
              }}
            >
              Return
            </button>
          </MDBCol>
        </MDBRow>
        <div className='row d-flex justify-content-start align-items-top h-70'>
          <div className='col'>
            <div className='table-responsive'>
              <table className='table'>
                <thead>
                  <tr>
                    <th scope='col' className='h5'>
                      Shopping Bag
                    </th>
                    <th scope='col'>Format</th>
                    <th scope='col'>Quantity</th>
                    <th scope='col'>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {checkoutCart.map((book) => (
                    <tr key={book.id}>
                      <th scope='row'>
                        <div className='d-flex align-items-center'>
                          {/* <img
                            src="https://i.imgur.com/2DsA49b.webp"
                            className="img-fluid rounded-3"
                            style={{ width: 120 }}
                            alt="Book"
                          /> */}
                          <div className='flex-column ms-4'>
                            <p className='mb-2'>{book.title}</p>
                            <p className='mb-0'>{book.author}</p>
                          </div>
                        </div>
                      </th>
                      <td className='align-middle'>
                        <p className='mb-0' style={{ fontWeight: 500 }}>
                          Paperback
                        </p>
                      </td>
                      <td className='align-middle'>
                        <div className='d-flex flex-row'>
                          {/* <button
                            data-mdb-button-init
                            data-mdb-ripple-init
                            className='btn btn-link px-2'
                            onClick={() => decreaseQuantity(book._id)}
                          >
                            <i className='fa fas fa-minus' />
                          </button> */}
                          <input
                            id='form1'
                            min={0}
                            name='quantity'
                            value={book.cartQuantity}
                            type='text'
                            className='form-control form-control-sm'
                            style={{ width: 50 }}
                          />
                          {/* <button
                            data-mdb-button-init
                            data-mdb-ripple-init
                            className='btn btn-link px-2'
                            onClick={() => increaseQuantity(book._id)}
                          >
                            <i className='fa fas fa-plus' />
                          </button> */}
                        </div>
                      </td>
                      <td className='align-middle'>
                        <p className='mb-0' style={{ fontWeight: 500 }}>
                          {book.price}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              className='card shadow-2-strong mb-5 mb-lg-0'
              style={{ borderRadius: 16 }}
            ></div>
          </div>
          <div className='col-lg-4 col-xl-3'>
            <div
              className='d-flex justify-content-between'
              style={{ fontWeight: 500 }}
            >
              <p className='mb-2'>Subtotal</p>
              <p className='mb-2'>${total}</p>
            </div>
            <div
              className='d-flex justify-content-between'
              style={{ fontWeight: 500 }}
            >
              <p className='mb-0'>Shipping</p>
              <p className='mb-0'>$0</p>
            </div>
            <hr className='my-4' />
            <div
              className='d-flex justify-content-between mb-4'
              style={{ fontWeight: 500 }}
            >
              <p className='mb-2'>Total (tax included)</p>
              <p className='mb-2'>${total}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          type='submit'
          className='btn btn-primary w-100'
        >
          Checkout
        </button>
      </div>
    </section>
  );
};

export default CheckoutPage;
