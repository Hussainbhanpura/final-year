import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { useState, useEffect } from "react";

import BASE_URL from "../config.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Card({ data }) {
  const token = window.localStorage.getItem("token");
  const navigate = useNavigate();
  const [rentedBooksStatus, setRentedBooksStatus] = useState({});

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

  return (
    <div>
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
                    href='/addstudent'
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
                        onClick={() => handleDelete(student._id)}
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
