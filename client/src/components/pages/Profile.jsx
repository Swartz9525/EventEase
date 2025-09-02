import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  ListGroup,
  Badge,
  Spinner,
  Alert,
  Row,
  Col,
  Button,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Clock, Person, CurrencyRupee, Gear } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.email) {
      setUserEmail(user.email);
      fetchBookings(user.email);
    } else {
      const cached = JSON.parse(localStorage.getItem("bookings")) || [];
      if (cached?.length) {
        setBookings(normalizeAndSort(cached));
      } else {
        setError("Please log in to view your bookings");
      }
    }
  }, []);

  const normalizeAndSort = (rawArray) => {
    const normalized = (Array.isArray(rawArray) ? rawArray : []).map((b) => ({
      ...b,
      date: b?.date ? new Date(b.date) : new Date(0),
      eventDate: b?.eventDate ? new Date(b.eventDate) : null,
      items: Array.isArray(b.services)
        ? b.services
        : Array.isArray(b.addons)
        ? b.addons
        : Array.isArray(b.items)
        ? b.items
        : [],
      total: Number(b.total || 0),
      status: b.status || "pending",
    }));

    return normalized.sort((a, b) => b.date - a.date);
  };

  const fetchBookings = async (email) => {
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/bookings`,
        {
          params: { email },
        }
      );

      const normalized = normalizeAndSort(data?.bookings || data || []);
      setBookings(normalized);
      localStorage.setItem("bookings", JSON.stringify(normalized));
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    try {
      const d = date instanceof Date ? date : new Date(date);
      return d.toLocaleString("en-IN", {
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

  const getEventBadgeVariant = (eventDate) => {
    if (!eventDate) return "secondary";

    const today = new Date();
    const event = new Date(eventDate);
    event.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (event.getTime() === today.getTime()) return "success";
    if (event > today) return "primary";
    return "secondary";
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "danger";
      case "cancelled":
        return "secondary";
      case "pending":
      default:
        return "warning";
    }
  };

  const toggleExpand = (index) => {
    setExpandedBooking(expandedBooking === index ? null : index);
  };

  // ✅ Pass booking details to /event-manage
  const handleManage = (booking) => {
    navigate(`/event-manage`, { state: { booking } });
  };

  // ---- New: Cancel (soft-delete) booking by setting status to 'cancelled'
  const handleCancel = async (bookingId) => {
    if (!bookingId) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking? This will mark it as cancelled."
    );
    if (!confirmed) return;

    setError("");
    setSuccessMsg("");
    setCancelingId(bookingId);

    try {
      // PATCH request to update booking status (adjust endpoint if your backend uses a different one)
      const { data } = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/bookings/${bookingId}`,
        { status: "cancelled" }
      );

      // Update local UI (optimistic)
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );

      setSuccessMsg("Booking has been cancelled.");
      // clear success msg after 3s
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Cancel error:", err);
      setError(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold mb-2">
            <Person className="me-2" size={28} />
            My Bookings
          </h2>
          <p className="text-muted">
            {userEmail || "Log in to view your booking history"}
          </p>
        </Col>
      </Row>

      {error && <Alert variant="warning">{error}</Alert>}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}

      {loading && !bookings.length ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading your bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <Card.Body className="text-center py-5">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png"
              alt="No bookings"
              width="120"
              className="mb-3 opacity-75"
            />
            <h5 className="text-muted mb-2">No bookings found</h5>
            <p className="text-muted mb-0">
              {userEmail
                ? "You haven't made any bookings yet"
                : "Please log in to view your bookings"}
            </p>
          </Card.Body>
        </Card>
      ) : (
        bookings.map((booking, index) => {
          const isExpanded = expandedBooking === index;
          return (
            <Card
              key={booking._id || index}
              className="mb-4 border-0 shadow-sm overflow-hidden"
            >
              <Card.Header className="bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1 fw-semibold">
                      Booking #{bookings.length - index}
                    </h5>
                    <Badge
                      bg={getStatusBadgeVariant(booking.status)}
                      className="me-2"
                    >
                      {booking.status?.toUpperCase()}
                    </Badge>
                    {booking.eventDate && (
                      <Badge bg={getEventBadgeVariant(booking.eventDate)}>
                        <Clock className="me-1" size={14} />
                        {formatDate(booking.eventDate)}
                      </Badge>
                    )}
                  </div>
                  <div className="text-end">
                    <Badge bg="primary" className="fs-6 px-3 py-2 me-2">
                      <CurrencyRupee className="me-1" size={16} />
                      {booking.total.toLocaleString()}
                    </Badge>

                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => toggleExpand(index)}
                    >
                      {isExpanded ? "Show Less" : "View Details"}
                    </Button>

                    <OverlayTrigger
                      placement="top"
                      overlay={
                        booking.status !== "approved" ? (
                          <Tooltip>
                            You can manage this event when it is approved.
                          </Tooltip>
                        ) : (
                          <></>
                        )
                      }
                    >
                      <span className="d-inline-block">
                        <Button
                          variant="outline-dark"
                          size="sm"
                          className="ms-2"
                          onClick={() => handleManage(booking)}
                          disabled={booking.status !== "approved"} // ✅ disable unless approved
                        >
                          <Gear className="me-1" size={16} />
                          Manage
                        </Button>
                      </span>
                    </OverlayTrigger>

                    {/* Delete/Cancel button */}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="ms-2"
                      onClick={() => handleCancel(booking._id)}
                      disabled={
                        booking.status === "cancelled" ||
                        cancelingId === booking._id
                      }
                    >
                      {cancelingId === booking._id ? (
                        <Spinner as="span" animation="border" size="sm" />
                      ) : booking.status === "cancelled" ? (
                        "Cancelled"
                      ) : (
                        "Delete"
                      )}
                    </Button>
                  </div>
                </div>
              </Card.Header>

              {isExpanded && (
                <Card.Body>
                  <ListGroup variant="flush">
                    {booking.items?.length ? (
                      booking.items.map((item, idx) => (
                        <ListGroup.Item
                          key={idx}
                          className="border-0 py-2 px-0"
                        >
                          <div className="d-flex justify-content-between">
                            <div>
                              <h6 className="mb-1 fw-medium">
                                {item.name || item.title || "Service"}
                              </h6>
                              <div className="d-flex text-muted small">
                                {item.type && (
                                  <span className="me-2">{item.type}</span>
                                )}
                                {item.quantity > 1 && (
                                  <span>Qty: {item.quantity}</span>
                                )}
                              </div>
                            </div>
                            <div className="text-end">
                              <div className="fw-medium">
                                ₹
                                {(
                                  item.price * (item.quantity || 1)
                                ).toLocaleString()}
                              </div>
                              <small className="text-muted">
                                ₹{item.price?.toLocaleString()} each
                              </small>
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))
                    ) : (
                      <ListGroup.Item className="text-muted py-3 text-center">
                        No services listed
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card.Body>
              )}
            </Card>
          );
        })
      )}
    </Container>
  );
};

export default Profile;
