// File: src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { Container, Card, ListGroup, Badge } from "react-bootstrap";

const Profile = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(data);
  }, []);

  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4 text-primary">Your Bookings</h2>
      {bookings.length === 0 ? (
        <Card className="p-4 shadow-sm">
          <p className="mb-0 text-muted">You haven’t made any bookings yet.</p>
        </Card>
      ) : (
        bookings.map((booking, index) => (
          <Card key={index} className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3 d-flex justify-content-between">
                <span className="fw-semibold">Booking #{index + 1}</span>
                <Badge bg="success">₹{booking.total.toLocaleString()}</Badge>
              </Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {booking.date}
              </Card.Subtitle>
              <ListGroup>
                {booking.addons.map((addon, idx) => (
                  <ListGroup.Item key={idx}>{addon.name}</ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default Profile;
