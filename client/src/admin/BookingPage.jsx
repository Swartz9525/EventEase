import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Table,
  Spinner,
  Alert,
  Button,
  Badge,
  Row,
  Col,
  ButtonGroup,
  Dropdown,
  Form,
  InputGroup,
  Pagination,
  OverlayTrigger,
  Tooltip,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import {
  CheckCircle,
  XCircle,
  ClockHistory,
  Search,
  Filter,
  CalendarEvent,
  Person,
  CurrencyRupee,
  ThreeDotsVertical,
  ArrowClockwise,
  InfoCircle,
} from "react-bootstrap-icons";
import axios from "axios";

const BACKEND_URL = "http://localhost:5000";

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [retryCount, setRetryCount] = useState(0);
  const [showUpdateError, setShowUpdateError] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [lastFailedUpdate, setLastFailedUpdate] = useState({
    id: null,
    status: null,
  });
  const itemsPerPage = 8;

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/booking`, {
        timeout: 5000,
      });
      setBookings(data || []);
      setRetryCount(0);
      localStorage.setItem("cachedBookings", JSON.stringify(data || []));
    } catch (err) {
      console.error("Fetch bookings error:", err);
      let errorMessage = "Failed to fetch bookings";

      if (err.response) {
        errorMessage =
          err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else if (err.code === "ECONNABORTED") {
        errorMessage = "Request timed out. Please try again.";
      }

      setError(errorMessage);
      const cached = JSON.parse(localStorage.getItem("cachedBookings")) || [];
      if (cached.length) setBookings(cached);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      const { data } = await axios.put(
        `${BACKEND_URL}/api/booking/${id}/status`,
        { status }
      );

      const updatedBookings = bookings.map((b) =>
        b._id === id ? { ...b, status: data.status } : b
      );

      setBookings(updatedBookings);
      localStorage.setItem("cachedBookings", JSON.stringify(updatedBookings));
      return true;
    } catch (err) {
      console.error("Update status error:", err);
      const errorMsg =
        err.response?.data?.message || "Failed to update booking status";
      setUpdateError(errorMsg);
      setShowUpdateError(true);
      setLastFailedUpdate({ id, status });
      return false;
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    const originalBookings = [...bookings];
    const updatedBookings = bookings.map((b) =>
      b._id === id ? { ...b, status } : b
    );

    setBookings(updatedBookings);

    const success = await updateStatus(id, status);
    if (!success) {
      setBookings(originalBookings);
    }
  };

  const formatDate = (dateString, options = {}) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return (
        <span className="text-danger">
          Invalid date
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Original value: {dateString}</Tooltip>}
          >
            <InfoCircle className="ms-1" size={14} />
          </OverlayTrigger>
        </span>
      );
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      ...options,
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <Badge bg="success" className="d-flex align-items-center">
            <CheckCircle className="me-1" size={14} />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge bg="danger" className="d-flex align-items-center">
            <XCircle className="me-1" size={14} />
            Rejected
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge bg="warning" className="d-flex align-items-center text-dark">
            <ClockHistory className="me-1" size={14} />
            Pending
          </Badge>
        );
    }
  };

  const handleRetry = () => {
    const delay = Math.min(1000 * 2 ** retryCount, 30000);
    setTimeout(() => {
      setRetryCount((prev) => prev + 1);
      fetchBookings();
    }, delay);
  };

  const handleRetryFailedUpdate = () => {
    setShowUpdateError(false);
    if (lastFailedUpdate.id && lastFailedUpdate.status) {
      handleStatusUpdate(lastFailedUpdate.id, lastFailedUpdate.status);
    }
  };

  useEffect(() => {
    const cached = JSON.parse(localStorage.getItem("cachedBookings")) || [];
    if (cached.length) setBookings(cached);
    fetchBookings();

    const handleOnline = () => {
      if (error && navigator.onLine) {
        handleRetry();
      }
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  const filteredBookings = bookings
    .filter((booking) => {
      const matchesSearch = booking.email
        ?.toLowerCase()
        ?.includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading && !bookings.length) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading bookings...</p>
      </Container>
    );
  }

  if (error && !bookings.length) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <h5>Could not load bookings</h5>
          <p>{error}</p>
          <div className="d-flex justify-content-center gap-2 mt-3">
            <Button variant="primary" onClick={handleRetry}>
              <ArrowClockwise className="me-1" />
              {retryCount > 0 ? `Try again (${retryCount})` : "Retry"}
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showUpdateError}
          onClose={() => setShowUpdateError(false)}
          delay={5000}
          autohide
          bg="danger"
        >
          <Toast.Header>
            <strong className="me-auto">Update Failed</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            <div>{updateError} - Showing cached data</div>
            <Button
              variant="light"
              size="sm"
              className="mt-2"
              onClick={handleRetryFailedUpdate}
            >
              Retry Update
            </Button>
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white py-3">
          <Row className="align-items-center">
            <Col md={6}>
              <h5 className="mb-0 d-flex align-items-center">
                <CalendarEvent className="me-2" size={20} />
                Booking Management
              </h5>
            </Col>
            <Col md={6} className="text-md-end">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={fetchBookings}
                className="me-2"
                disabled={loading}
              >
                <ArrowClockwise size={16} />
              </Button>
              <Dropdown className="d-inline-block me-2">
                <Dropdown.Toggle variant="outline-secondary" size="sm">
                  <Filter className="me-1" size={16} />
                  Status: {statusFilter === "all" ? "All" : statusFilter}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setStatusFilter("all")}>
                    All
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setStatusFilter("pending")}>
                    Pending
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setStatusFilter("approved")}>
                    Approved
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setStatusFilter("rejected")}>
                    Rejected
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <InputGroup style={{ width: "200px" }}>
                <Form.Control
                  placeholder="Search email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="sm"
                />
                <Button variant="outline-secondary" size="sm">
                  <Search size={16} />
                </Button>
              </InputGroup>
            </Col>
          </Row>
        </Card.Header>

        {error && bookings.length > 0 && (
          <Alert variant="warning" className="mb-0 rounded-0">
            {error} - Showing cached data
          </Alert>
        )}

        <Card.Body className="p-0">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-5">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png"
                alt="No bookings"
                width="100"
                className="opacity-50 mb-3"
              />
              <h5 className="text-muted">No bookings found</h5>
              <p className="text-muted">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter"
                  : "No bookings have been made yet"}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>#</th>
                    <th>
                      <Person className="me-1" size={16} />
                      User
                    </th>
                    <th>Services</th>
                    <th>
                      <CurrencyRupee className="me-1" size={16} />
                      Amount
                    </th>
                    <th>Event Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBookings.map((booking, index) => {
                    const bookingDate = formatDate(booking.createdAt);
                    const eventDate = formatDate(booking.eventDate);
                    const isUpcoming =
                      booking.eventDate &&
                      new Date(booking.eventDate) > new Date();

                    return (
                      <tr key={booking._id}>
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>
                          <div className="fw-medium">{booking.email}</div>
                          {bookingDate && (
                            <small className="text-muted">{bookingDate}</small>
                          )}
                        </td>
                        <td>
                          <div className="d-flex flex-column gap-1">
                            {booking.services?.map((service, i) => (
                              <div
                                key={i}
                                className="d-flex align-items-center"
                              >
                                <span className="me-2">
                                  {service.name || "Unnamed Service"}
                                </span>
                                <Badge
                                  bg="light"
                                  text="dark"
                                  className="border"
                                >
                                  {service.quantity || 1} × ₹
                                  {service.price || 0}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="fw-bold">
                          ₹{booking.total?.toLocaleString()}
                        </td>
                        <td>
                          {eventDate || "Not specified"}
                          {eventDate && (
                            <small
                              className={`d-block text-${
                                isUpcoming ? "success" : "muted"
                              }`}
                            >
                              {isUpcoming ? "Upcoming" : "Past"}
                            </small>
                          )}
                        </td>
                        <td>{getStatusBadge(booking.status)}</td>
                        <td>
                          {booking.status === "pending" ? (
                            <ButtonGroup size="sm">
                              <Button
                                variant="outline-success"
                                onClick={() =>
                                  handleStatusUpdate(booking._id, "approved")
                                }
                                disabled={updatingId === booking._id}
                              >
                                {updatingId === booking._id ? (
                                  <Spinner size="sm" animation="border" />
                                ) : (
                                  "Approve"
                                )}
                              </Button>
                              <Button
                                variant="outline-danger"
                                onClick={() =>
                                  handleStatusUpdate(booking._id, "rejected")
                                }
                                disabled={updatingId === booking._id}
                              >
                                {updatingId === booking._id ? (
                                  <Spinner size="sm" animation="border" />
                                ) : (
                                  "Reject"
                                )}
                              </Button>
                            </ButtonGroup>
                          ) : (
                            <Dropdown>
                              <Dropdown.Toggle
                                variant="light"
                                size="sm"
                                className="border-0"
                              >
                                <ThreeDotsVertical />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item
                                  onClick={() =>
                                    handleStatusUpdate(booking._id, "pending")
                                  }
                                >
                                  Set as Pending
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onClick={() =>
                                    handleStatusUpdate(booking._id, "approved")
                                  }
                                >
                                  Approve
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onClick={() =>
                                    handleStatusUpdate(booking._id, "rejected")
                                  }
                                >
                                  Reject
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>

        {totalPages > 1 && (
          <Card.Footer className="bg-white border-top">
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-muted small">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredBookings.length)}{" "}
                of {filteredBookings.length} bookings
              </div>
              <Pagination className="mb-0">
                <Pagination.Prev
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                />
                {Array.from({ length: totalPages }, (_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                />
              </Pagination>
            </div>
          </Card.Footer>
        )}
      </Card>
    </Container>
  );
};

export default BookingPage;
