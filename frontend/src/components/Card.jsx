import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import React, { useState, useEffect } from "react";
import BASE_URL from "../config.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Card.css";

function Card({ data }) {
  const token = window.localStorage.getItem("token");
  const navigate = useNavigate();
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    if (selectedBookId) {
      const res = await axios.delete(`${BASE_URL}/books/${selectedBookId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      window.location.reload();
    }
  };

  const handleEdit = (id) => {
    navigate(`/editbook/${id}`);
  };

  const openModal = (id) => {
    console.log("Opening modal for book ID:", id); // Debug statement
    setSelectedBookId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBookId(null);
  };

  return (
    <div>
      <div className='container'>
        {showModal && (
          <div className='modal'>
            <div className='modal-content'>
              <h4>Confirm Deletion</h4>
              <p>Are you sure you want to delete this book?</p>
              <button onClick={handleDelete} className='button button-delete'>
                Delete
              </button>
              <button onClick={closeModal} className='button button-cancel'>
                Cancel
              </button>
            </div>
          </div>
        )}
        <div className='table-responsive'>
          <div className='table-wrapper'>
            <div className='table-title'>
              <div className='row'>
                <div className='col-xs-6'>
                  <h2>
                    Manage <b>Books</b>
                  </h2>
                </div>
                <div className='col-xs-6'>
                  <a
                    href='/addbook'
                    className='btn btn-success'
                    data-toggle='modal'
                  >
                    <span>Add New Book</span>
                  </a>
                </div>
              </div>
            </div>
            <div className='table-responsive'>
              <table className='table table-bordered table-hover table-striped'>
                <thead>
                  <tr>
                    <th scope='col'>Title</th>
                    <th scope='col'>Author</th>
                    <th scope='col'>Quantity</th>
                    <th scope='col'>Price</th>
                    <th scope='col'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((book, index) => (
                    <tr key={book._id}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.quantity}</td>
                      <td>{book.price}</td>
                      <td>
                        <a
                          onClick={() => handleEdit(book.isbn)}
                          className='btn btn-link edit'
                          data-toggle='modal'
                        >
                          <i>
                            <EditIcon />
                          </i>
                        </a>

                        <a
                          onClick={() => openModal(book.isbn)}
                          className='btn btn-link delete'
                          data-toggle='modal'
                        >
                          <i>
                            <DeleteIcon />
                          </i>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
