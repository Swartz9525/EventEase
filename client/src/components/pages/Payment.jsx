import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  ListGroup,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const [addons, setAddons] = useState([]);
  const [total, setTotal] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const selected = JSON.parse(localStorage.getItem("selectedAddons")) || [];
    const price = localStorage.getItem("totalPrice") || 0;
    setAddons(selected); // FIXED
    setTotal(price);
  }, []);

  const handlePayment = (e) => {
    e.preventDefault();

    const newBooking = {
      addons,
      total: Number(total),
      date: new Date().toLocaleString(),
    };

    const existing = JSON.parse(localStorage.getItem("bookings")) || [];
    const updated = [...existing, newBooking];
    localStorage.setItem("bookings", JSON.stringify(updated));

    setShowToast(true);
    setTimeout(() => {
      localStorage.removeItem("selectedAddons");
      localStorage.removeItem("totalPrice");
      navigate("/profile");
    }, 3000);
  };

  return (
    <Container className="py-5 position-relative">
      <Card className="mx-auto shadow p-4" style={{ maxWidth: "500px" }}>
        <h3 className="text-center mb-4">Payment Method</h3>

        <ListGroup className="mb-4">
          {addons.map((addon, idx) => (
            <ListGroup.Item key={idx}>{addon.name}</ListGroup.Item>
          ))}
          <ListGroup.Item className="d-flex justify-content-between fw-bold">
            <span>Total</span>
            <span>₹{Number(total).toLocaleString()}</span>
          </ListGroup.Item>
        </ListGroup>

        <Form onSubmit={handlePayment}>
          <Form.Group className="mb-3">
            <Form.Label>Cardholder Name</Form.Label>
            <Form.Control type="text" required placeholder="Enter name" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Card Number</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="1234 5678 9012 3456"
            />
          </Form.Group>

          <Form.Group className="d-flex gap-3 mb-3">
            <div className="flex-fill">
              <Form.Label>Expiry</Form.Label>
              <Form.Control type="text" required placeholder="MM/YY" />
            </div>
            <div className="flex-fill">
              <Form.Label>CVV</Form.Label>
              <Form.Control type="password" required placeholder="***" />
            </div>
          </Form.Group>

          <Button variant="success" type="submit" className="w-100 fw-bold">
            Pay Now ₹{Number(total).toLocaleString()}
          </Button>
        </Form>
      </Card>

      <ToastContainer position="top-center" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={2500}
          bg="success"
          autohide
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto">Payment Success</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            Your booking has been confirmed!
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default Payment;
