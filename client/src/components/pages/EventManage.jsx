import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  Container,
  ListGroup,
  Badge,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";
import { ArrowLeft, Clock, CurrencyRupee, Upload } from "react-bootstrap-icons";
import axios from "axios";

const EventManage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  const [emails, setEmails] = useState([]);
  const [manualInput, setManualInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (!booking) {
    return (
      <Container className="py-5 text-center">
        <h4>No booking details found</h4>
        <Button variant="primary" onClick={() => navigate("/profile")}>
          Back to Profile
        </Button>
      </Container>
    );
  }

  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  // ✅ Add emails from input
  const handleAddEmails = () => {
    const newEmails = manualInput
      .split(/[\s,;]+/)
      .map((e) => e.trim())
      .filter((e) => e.includes("@") && !emails.includes(e));
    setEmails([...emails, ...newEmails]);
    setManualInput("");
  };

  // ✅ Upload from CSV/TXT
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const fileEmails = text
        .split(/[\s,;]+/)
        .map((e) => e.trim())
        .filter((e) => e.includes("@") && !emails.includes(e));
      setEmails([...emails, ...fileEmails]);
    };
    reader.readAsText(file);
  };

  // ✅ Remove email
  const removeEmail = (email) => {
    setEmails(emails.filter((e) => e !== email));
  };

  // ✅ Save emails to backend
  const saveInvites = async () => {
    if (!emails.length) return alert("No emails added!");
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/bookings/invite", {
        bookingId: booking._id,
        emails,
      });
      alert("Invites saved successfully ✅");
    } catch (error) {
      console.error(error);
      alert("Failed to save invites ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Button variant="link" className="mb-3" onClick={() => navigate(-1)}>
        <ArrowLeft className="me-1" /> Back
      </Button>

      {/* Booking details */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Header className="bg-light">
          <h4 className="mb-0">Manage Booking</h4>
        </Card.Header>
        <Card.Body>
          <h5 className="fw-bold mb-2">Booking Details</h5>
          <p>
            <strong>Status:</strong>{" "}
            <Badge
              bg={
                booking.status === "approved"
                  ? "success"
                  : booking.status === "rejected"
                  ? "danger"
                  : "warning"
              }
            >
              {booking.status.toUpperCase()}
            </Badge>
          </p>
          {booking.eventDate && (
            <p>
              <Clock className="me-2" />
              <strong>Event Date:</strong> {formatDate(booking.eventDate)}
            </p>
          )}
          <p>
            <CurrencyRupee className="me-2" />
            <strong>Total Amount:</strong> ₹{booking.total?.toLocaleString()}
          </p>

          <h6 className="fw-bold mt-4">Booked Services</h6>
          <ListGroup variant="flush">
            {booking.items?.length ? (
              booking.items.map((item, idx) => (
                <ListGroup.Item key={idx} className="px-0">
                  <div className="d-flex justify-content-between">
                    <div>
                      <span className="fw-medium">
                        {item.name || item.title || "Service"}
                      </span>
                      {item.quantity > 1 && (
                        <span className="ms-2 text-muted">
                          (x{item.quantity})
                        </span>
                      )}
                    </div>
                    <div>
                      ₹{(item.price * (item.quantity || 1)).toLocaleString()}
                    </div>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No services listed</ListGroup.Item>
            )}
          </ListGroup>
        </Card.Body>
      </Card>

      {/* Email Invite Section */}
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-light">
          <h5 className="mb-0">Invite Participants</h5>
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Add Emails Manually</Form.Label>
              <div className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="Enter emails separated by comma/space"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                />
                <Button
                  className="ms-2"
                  variant="primary"
                  onClick={handleAddEmails}
                >
                  Add
                </Button>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Upload Email List (CSV or TXT)</Form.Label>
              <Form.Control
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
              />
            </Form.Group>
          </Form>

          {emails.length > 0 && (
            <>
              <h6 className="fw-bold mt-3">Added Emails</h6>
              <ListGroup className="mb-3">
                {emails.map((email, idx) => (
                  <ListGroup.Item
                    key={idx}
                    className="d-flex justify-content-between align-items-center"
                  >
                    {email}
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => removeEmail(email)}
                    >
                      Remove
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Button
                variant="success"
                disabled={loading}
                onClick={saveInvites}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      className="me-2"
                    />
                    Saving...
                  </>
                ) : (
                  "Save Invites"
                )}
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EventManage;
