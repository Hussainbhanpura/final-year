import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BASE_URL from "../config.js";

const RentalPage = () => {
  const { id } = useParams();
  const [rentalBooks, setRentalBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRentalBooks = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/students/${id}`);
        const booksRented = res.data.booksRented;
        if (booksRented.length > 0) {
          const bookDetailsPromises = booksRented.map((book) =>
            axios.get(`${BASE_URL}/books/${book._id}`)
          );
          const booksDetailsResponses = await Promise.all(bookDetailsPromises);
          const newBooks = booksDetailsResponses.map((b, index) => ({
            ...b.data[0],
            cartQuantity: booksRented[index].quantity,
          }));
          setRentalBooks(newBooks);
        } else {
          setRentalBooks([]);
        }
      } catch (error) {
        console.error(
          "Error fetching rental books:",
          error.response?.data?.message
        );
      }
      setIsLoading(false);
    };

    fetchRentalBooks();
  }, [id]);

  return (
    <section className='h-100 h-custom'>
      <div className='container h-100 py-5'>
        <div className='table-responsive'>
          {isLoading ? (
            <h3>
              <em>Loading...</em>
            </h3>
          ) : rentalBooks.length === 0 ? (
            <h3 className='text-center'>
              <em>It Seems the Student haven't rented any books yet</em>
            </h3>
          ) : (
            <table className='table'>
              <thead>
                <tr>
                  <th scope='col'>Title</th>
                  <th scope='col'>Author</th>
                  <th scope='col'>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {rentalBooks.map((rentalBook) => (
                  <tr key={rentalBook._id}>
                    <td>{rentalBook.title}</td>
                    <td>{rentalBook.author}</td>
                    <td>{rentalBook.cartQuantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
};

export default RentalPage;
