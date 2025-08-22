import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Spinner,
  ButtonGroup,
  Dropdown,
  Alert,
  Modal,
  Form,
  InputGroup,
} from "react-bootstrap";

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  // ✅ Fetch all bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/bookings/all`
      );
      setBookings(data);
    } catch (err) {
      console.error("Fetch bookings error:", err);
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update booking status and refresh
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setStatusUpdateLoading(true);
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/bookings/${id}/status`,
        { status: newStatus }
      );
      fetchBookings(); // refresh after update
    } catch (err) {
      console.error("Update status error:", err);
      setError("Failed to update booking status.");
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  // ✅ View booking details
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ✅ Filter and sort bookings
  const filteredBookings = bookings
    .filter((booking) => {
      if (filter === "all") return true;
      return booking.status === filter;
    })
    .filter((booking) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        booking.email.toLowerCase().includes(searchLower) ||
        (booking.bookingId &&
          booking.bookingId.toLowerCase().includes(searchLower)) ||
        (booking._id && booking._id.toLowerCase().includes(searchLower)) ||
        booking.services.some((service) =>
          service.name.toLowerCase().includes(searchLower)
        )
      );
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt || b.bookingDate) -
          new Date(a.createdAt || a.bookingDate)
        );
      } else if (sortBy === "oldest") {
        return (
          new Date(a.createdAt || a.bookingDate) -
          new Date(b.createdAt || b.bookingDate)
        );
      } else if (sortBy === "highest") {
        return b.total - a.total;
      } else if (sortBy === "lowest") {
        return a.total - b.total;
      }
      return 0;
    });

  // ✅ Get badge variant based on status
  const getStatusVariant = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "danger";
      default:
        return "secondary";
    }
  };

  // ✅ Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <Container fluid className="py-4">
      {/* Header Section */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-1 fw-bold text-primary">Booking Management</h2>
          <p className="text-muted mb-0">
            Manage and track all customer bookings
          </p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={fetchBookings} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "🔄 Refresh"}
          </Button>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body className="p-3">
          <Row className="g-3">
            <Col md={6} lg={4}>
              <Form.Group>
                <Form.Label className="fw-medium">Filter by Status</Form.Label>
                <ButtonGroup className="w-100">
                  <Button
                    variant={filter === "all" ? "dark" : "outline-dark"}
                    onClick={() => setFilter("all")}
                    size="sm"
                  >
                    All
                  </Button>
                  <Button
                    variant={
                      filter === "pending" ? "warning" : "outline-warning"
                    }
                    onClick={() => setFilter("pending")}
                    size="sm"
                  >
                    Pending
                  </Button>
                  <Button
                    variant={
                      filter === "approved" ? "success" : "outline-success"
                    }
                    onClick={() => setFilter("approved")}
                    size="sm"
                  >
                    Approved
                  </Button>
                  <Button
                    variant={
                      filter === "rejected" ? "danger" : "outline-danger"
                    }
                    onClick={() => setFilter("rejected")}
                    size="sm"
                  >
                    Rejected
                  </Button>
                </ButtonGroup>
              </Form.Group>
            </Col>
            <Col md={6} lg={4}>
              <Form.Group>
                <Form.Label className="fw-medium">Sort By</Form.Label>
                <Form.Select
                  size="sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Amount</option>
                  <option value="lowest">Lowest Amount</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={12} lg={4}>
              <Form.Group>
                <Form.Label className="fw-medium">Search Bookings</Form.Label>
                <InputGroup size="sm">
                  <Form.Control
                    type="text"
                    placeholder="Search by email, ID, or service..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <Button
                      variant="outline-secondary"
                      onClick={() => setSearchTerm("")}
                    >
                      ✕
                    </Button>
                  )}
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert
          variant="danger"
          className="mb-4"
          dismissible
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {/* Stats Summary */}
      <Row className="mb-4">
        <Col xl={3} md={6} className="mb-3">
          <Card className="border-0 bg-primary bg-opacity-10">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-muted mb-1">Total Bookings</h6>
                  <h4 className="fw-bold mb-0">{bookings.length}</h4>
                </div>
                <div className="icon-shape bg-primary text-white rounded-circle p-3">
                  <i className="bi bi-receipt fs-4"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6} className="mb-3">
          <Card className="border-0 bg-success bg-opacity-10">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-muted mb-1">Approved</h6>
                  <h4 className="fw-bold mb-0">
                    {bookings.filter((b) => b.status === "approved").length}
                  </h4>
                </div>
                <div className="icon-shape bg-success text-white rounded-circle p-3">
                  <i className="bi bi-check-circle fs-4"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6} className="mb-3">
          <Card className="border-0 bg-warning bg-opacity-10">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-muted mb-1">Pending</h6>
                  <h4 className="fw-bold mb-0">
                    {bookings.filter((b) => b.status === "pending").length}
                  </h4>
                </div>
                <div className="icon-shape bg-warning text-white rounded-circle p-3">
                  <i className="bi bi-clock fs-4"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6} className="mb-3">
          <Card className="border-0 bg-danger bg-opacity-10">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-muted mb-1">Rejected</h6>
                  <h4 className="fw-bold mb-0">
                    {bookings.filter((b) => b.status === "rejected").length}
                  </h4>
                </div>
                <div className="icon-shape bg-danger text-white rounded-circle p-3">
                  <i className="bi bi-x-circle fs-4"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bookings List */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Loading bookings...</p>
        </div>
      ) : (
        <>
          {filteredBookings.length === 0 ? (
            <Card className="text-center py-5 border-0 shadow-sm">
              <Card.Body>
                <i className="bi bi-inbox display-4 text-muted"></i>
                <h5 className="mt-3 text-muted">No bookings found</h5>
                <p className="text-muted">
                  {searchTerm || filter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "No bookings have been made yet"}
                </p>
              </Card.Body>
            </Card>
          ) : (
            <Row>
              {filteredBookings.map((booking) => (
                <Col
                  xl={4}
                  lg={6}
                  key={booking._id || booking.bookingId}
                  className="mb-4"
                >
                  <Card className="h-100 shadow-sm border-0">
                    <Card.Body className="p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h5 className="card-title mb-1">
                            Booking #
                            {booking.bookingId ||
                              booking._id.slice(-6).toUpperCase()}
                          </h5>
                          <Badge
                            bg={getStatusVariant(booking.status)}
                            className="mt-1"
                          >
                            {booking.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-primary fs-5">
                            {formatCurrency(booking.total)}
                          </div>
                          <small className="text-muted">
                            {new Date(booking.eventDate).toLocaleDateString()}
                          </small>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-envelope me-2 text-muted"></i>
                          <span className="text-truncate">{booking.email}</span>
                        </div>
                        {booking.phone && (
                          <div className="d-flex align-items-center mb-2">
                            <i className="bi bi-telephone me-2 text-muted"></i>
                            <span>{booking.phone}</span>
                          </div>
                        )}
                        <div className="d-flex align-items-center">
                          <i className="bi bi-calendar-event me-2 text-muted"></i>
                          <span>
                            Event:{" "}
                            {new Date(booking.eventDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h6 className="fw-medium mb-2">Services:</h6>
                        <div className="bg-light p-2 rounded">
                          {booking.services.map((service, i) => (
                            <div
                              key={`${booking._id}-${service.name}-${i}`}
                              className="d-flex justify-content-between py-1"
                            >
                              <span>
                                {service.name} × {service.quantity}
                              </span>
                              <span className="fw-medium">
                                {formatCurrency(service.price)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="d-flex gap-2 flex-wrap">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleViewDetails(booking)}
                        >
                          <i className="bi bi-eye me-1"></i> Details
                        </Button>
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="outline-secondary"
                            size="sm"
                            id="dropdown-status"
                            disabled={statusUpdateLoading}
                          >
                            <i className="bi bi-pencil me-1"></i> Change Status
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() =>
                                handleStatusUpdate(booking._id, "approved")
                              }
                            >
                              <i className="bi bi-check-circle text-success me-2"></i>{" "}
                              Approve
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                handleStatusUpdate(booking._id, "pending")
                              }
                            >
                              <i className="bi bi-clock text-warning me-2"></i>{" "}
                              Set Pending
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                handleStatusUpdate(booking._id, "rejected")
                              }
                            >
                              <i className="bi bi-x-circle text-danger me-2"></i>{" "}
                              Reject
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}

      {/* Booking Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Booking Details #
            {selectedBooking?.bookingId ||
              selectedBooking?._id.slice(-6).toUpperCase()}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <h6 className="fw-medium">Customer Information</h6>
                  <p className="mb-1">
                    <i className="bi bi-envelope me-2 text-muted"></i>
                    {selectedBooking.email}
                  </p>
                  {selectedBooking.phone && (
                    <p className="mb-1">
                      <i className="bi bi-telephone me-2 text-muted"></i>
                      {selectedBooking.phone}
                    </p>
                  )}
                  <p className="mb-0">
                    <i className="bi bi-calendar-event me-2 text-muted"></i>
                    Event Date:{" "}
                    {new Date(selectedBooking.eventDate).toLocaleDateString()}
                  </p>
                </Col>
                <Col md={6}>
                  <h6 className="fw-medium">Booking Information</h6>
                  <p className="mb-1">
                    Status:{" "}
                    <Badge bg={getStatusVariant(selectedBooking.status)}>
                      {selectedBooking.status.toUpperCase()}
                    </Badge>
                  </p>
                  <p className="mb-1">
                    Created:{" "}
                    {new Date(
                      selectedBooking.createdAt || selectedBooking.date
                    ).toLocaleDateString()}
                  </p>
                  <p className="mb-0 fw-bold text-primary">
                    Total: {formatCurrency(selectedBooking.total)}
                  </p>
                </Col>
              </Row>

              <h6 className="fw-medium mt-4">Services Booked</h6>
              <div className="bg-light p-3 rounded">
                {selectedBooking.services.map((service, i) => (
                  <div
                    key={i}
                    className="d-flex justify-content-between align-items-center py-2 border-bottom"
                  >
                    <div>
                      <div className="fw-medium">{service.name}</div>
                      <small className="text-muted">
                        Quantity: {service.quantity}
                      </small>
                    </div>
                    <div className="fw-medium">
                      {formatCurrency(service.price)}
                    </div>
                  </div>
                ))}
                <div className="d-flex justify-content-between align-items-center pt-2 fw-bold">
                  <div>Total Amount:</div>
                  <div>{formatCurrency(selectedBooking.total)}</div>
                </div>
              </div>

              {selectedBooking.message && (
                <>
                  <h6 className="fw-medium mt-4">Customer Message</h6>
                  <div className="bg-light p-3 rounded">
                    {selectedBooking.message}
                  </div>
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BookingPage;
