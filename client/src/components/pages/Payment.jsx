import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  ListGroup,
  Toast,
  ToastContainer,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const [services, setServices] = useState([]);
  const [total, setTotal] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");
  const [eventDate, setEventDate] = useState(""); // new state for event day
  const navigate = useNavigate();

  const [cardInfo, setCardInfo] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    const selectedAddons =
      JSON.parse(localStorage.getItem("selectedAddons")) || [];
    const selectedSubServices =
      JSON.parse(localStorage.getItem("selectedSubServices")) || [];

    const allServices = [
      ...selectedAddons.map((s) => ({
        ...s,
        type: "Addon",
        quantity: s.quantity || 1,
      })),
      ...selectedSubServices.map((s) => ({
        ...s,
        type: "Subservice",
        quantity: s.quantity || 1,
      })),
    ];

    setServices(allServices);
    const totalPrice = allServices.reduce(
      (acc, s) => acc + s.price * s.quantity,
      0
    );
    setTotal(totalPrice);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "number") {
      let digits = value.replace(/\D/g, "").slice(0, 16);
      let formatted = digits.replace(/(.{4})/g, "$1 ").trim();
      setCardInfo((prev) => ({ ...prev, number: formatted }));
    } else if (name === "expiry") {
      let digits = value.replace(/\D/g, "").slice(0, 4);
      if (digits.length > 2)
        digits = digits.slice(0, 2) + "/" + digits.slice(2);
      setCardInfo((prev) => ({ ...prev, expiry: digits }));
    } else if (name === "cvv") {
      let digits = value.replace(/\D/g, "").slice(0, 3);
      setCardInfo((prev) => ({ ...prev, cvv: digits }));
    } else {
      setCardInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateCard = () => {
    const numberRegex = /^(\d{4} ){3}\d{4}$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvvRegex = /^\d{3}$/;

    if (!cardInfo.name.trim()) return "Cardholder name is required";
    if (!numberRegex.test(cardInfo.number)) return "Invalid card number";
    if (!expiryRegex.test(cardInfo.expiry)) return "Expiry must be MM/YY";
    if (!cvvRegex.test(cardInfo.cvv)) return "Invalid CVV";
    if (!eventDate) return "Event date is required"; // validate event date
    return null;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateCard();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("User not logged in!");
        return;
      }

      const bookingData = {
        email: user.email,
        services,
        total,
        date: new Date().toISOString(),
        eventDate: new Date(eventDate), // send event day
      };

      await axios.post("http://localhost:5000/api/bookings", bookingData);

      setShowToast(true);

      setTimeout(() => {
        localStorage.removeItem("selectedAddons");
        localStorage.removeItem("selectedSubServices");
        localStorage.removeItem("totalPrice");
        navigate("/profile");
      }, 2500);
    } catch (err) {
      console.error("Payment error:", err);
      setError(
        err.response?.data?.message || "Payment failed. Please try again."
      );
    }
  };

  return (
    <Container className="py-5 position-relative">
      <Card className="mx-auto shadow p-4" style={{ maxWidth: "600px" }}>
        <h3 className="text-center mb-4">Payment Method</h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <ListGroup className="mb-4">
          {services.map((s, idx) => (
            <ListGroup.Item key={idx}>
              <div className="d-flex justify-content-between">
                <div>
                  {s.name || s.title} ({s.type}) x {s.quantity}
                </div>
                <div>₹{(s.price * s.quantity).toLocaleString()}</div>
              </div>
            </ListGroup.Item>
          ))}
          <ListGroup.Item className="d-flex justify-content-between fw-bold border-top">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </ListGroup.Item>
        </ListGroup>

        <Form onSubmit={handlePayment}>
          <Form.Group className="mb-3">
            <Form.Label>Event Date</Form.Label>
            <Form.Control
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cardholder Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={cardInfo.name}
              onChange={handleChange}
              required
              placeholder="Enter name"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Card Number</Form.Label>
            <Form.Control
              type="text"
              name="number"
              value={cardInfo.number}
              onChange={handleChange}
              required
              placeholder="1234 5678 9012 3456"
            />
          </Form.Group>

          <Form.Group className="d-flex gap-3 mb-3">
            <div className="flex-fill">
              <Form.Label>Expiry (MM/YY)</Form.Label>
              <Form.Control
                type="text"
                name="expiry"
                value={cardInfo.expiry}
                onChange={handleChange}
                required
                placeholder="MM/YY"
              />
            </div>
            <div className="flex-fill">
              <Form.Label>CVV</Form.Label>
              <Form.Control
                type="password"
                name="cvv"
                value={cardInfo.cvv}
                onChange={handleChange}
                required
                placeholder="***"
              />
            </div>
          </Form.Group>

          <Button variant="success" type="submit" className="w-100 fw-bold">
            Pay Now ₹{total.toLocaleString()}
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
            Your booking has been saved and confirmed!
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default Payment;
