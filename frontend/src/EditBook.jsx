import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function EditBook() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/",
  });

  useEffect(() => {
    async function fetchBook(id) {
      try {
        const response = await axiosInstance.get(`books/${id}`);
        setTitle(response.data[0].title);
        setAuthor(response.data[0].author);
        setQuantity(response.data[0].quantity);
        setPrice(response.data[0].price);
      } catch (error) {
        console.error(
          "Error fetching book details:",
          error.response.data.message
        );
      }
    }
    fetchBook(id);
  }, []);

  const handleSubmit = async (e) => {
    try {
      const updatedBook = { title, author, quantity, price };
      const response = await axiosInstance.put(`/books/${id}`, updatedBook);
      console.log(response.data); // handle successful update
    } catch (error) {
      console.error("Update error:", error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Edit Book</h2>
      {id && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label>Author:</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div>
            <label>Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div>
            <label>Price:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <button type="submit">Update</button>
        </form>
      )}
    </div>
  );
}

export default EditBook;
