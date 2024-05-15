// AddBook.jsx
import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Form,
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AddBook.css";

function AddBook() {
  const token = window.localStorage.getItem("token");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [isbn, setIsbn] = useState("");

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newBook = { title, author, quantity, price, isbn };
      const response = await axiosInstance.post(`/books`, newBook, {
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log(response.data);
      setTitle("");
      setAuthor("");
      setQuantity(0);
      setPrice(0);
      setIsbn("");
    } catch (error) {
      console.error("Creation error:", error.response.data.message);
    }
  };

  return (
    <Container className='mt-4'>
      <Row className='justify-content-md-center'>
        <Col xs={12} md={8}>
          <h2 className='text-center mb-4'>Add Book</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-3'>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Author</Form.Label>
              <Form.Control
                type='text'
                placeholder='Author name'
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type='number'
                placeholder='Quantity'
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>ISBN</Form.Label>
              <Form.Control
                type='text'
                placeholder='ISBN Number'
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
              />
            </Form.Group>
            <Button variant='primary' type='submit'>
              Add Book
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default AddBook;
