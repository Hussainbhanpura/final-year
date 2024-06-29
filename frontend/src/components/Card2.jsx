import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import "./Card.css";

import BASE_URL from "../config.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Card({ data }) {
  const token = window.localStorage.getItem("token");
  const navigate = useNavigate();
  const [rentedBooksStatus, setRentedBooksStatus] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (Array.isArray(data)) {
      data.forEach(async (student) => {
        try {
          const res = await axios.get(`${BASE_URL}/students/${student.isbn}`);
          setRentedBooksStatus((prevStatus) => ({
            ...prevStatus,
            [student.isbn]: res.data.booksRented.length > 0,
          }));
        } catch (error) {
          console.error(
            "Error fetching rental books:",
            error.response?.data?.message
          );
        }
      });
    }
  }, [data]);

  const handleDelete = async (id) => {
    const res = await axios.delete(`${BASE_URL}/students/${id}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    window.location.reload();
  };
  const handleEdit = (id) => {
    navigate(`/editstudent/${id}`);
  };

  const handleCheckRentals = (id) => {
    navigate(`/rentalpage/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      const res = await axios.delete(`${BASE_URL}/students/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      });
      setShowDeleteModal(false);
      window.location.reload();
    }
  };

  const DeleteConfirmationModal = () => (
    <div className='modal'>
      <div className='modal-content'>
        <h4>Confirm Deletion</h4>
        <p>Are you sure you want to delete this book?</p>
        <button onClick={confirmDelete} className='button button-delete'>
          Delete
        </button>
        <button
          onClick={() => setShowDeleteModal(false)}
          className='button button-cancel'
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {showDeleteModal && <DeleteConfirmationModal />}
      <div className='container'>
        <div className='table-responsive'>
          <div className='table-wrapper'>
            <div className='table-title'>
              <div className='row'>
                <div className='col-xs-6'>
                  <h2>
                    Manage <b>Students</b>
                  </h2>
                </div>
                <div className='col-xs-6'>
                  <a
                    href='/register'
                    className='btn btn-success'
                    data-toggle='modal'
                  >
                    <i className='material-icons'></i>
                    <span>Add New Student</span>
                  </a>
                </div>
              </div>
            </div>
            <table className='table table-bordered table-striped table-hover'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Grade</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((student, index) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.grade}</td>
                    <td>
                      <a
                        onClick={() => handleEdit(student.isbn)}
                        className='btn btn-link edit'
                        data-toggle='modal'
                      >
                        <i>
                          <EditIcon />
                        </i>
                      </a>

                      <a
                        onClick={() => handleDeleteClick(student._id)}
                        className='btn btn-link delete'
                        data-toggle='modal'
                      >
                        <i>
                          <DeleteIcon />
                        </i>
                      </a>
                      {rentedBooksStatus[student.isbn] ? (
                        <a
                          onClick={() => handleCheckRentals(student.isbn)}
                          className='btn btn-link'
                        >
                          <ShoppingCartIcon />
                        </a>
                      ) : (
                        <a className='btn btn-link'>
                          <RemoveShoppingCartIcon />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
