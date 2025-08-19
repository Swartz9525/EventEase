// File: src/pages/ServiceDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import { motion } from "framer-motion";

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [subServices, setSubServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSubServices, setSelectedSubServices] = useState([]);

  useEffect(() => {
    fetchSubServices();
  }, [serviceId]);

  const fetchSubServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/subservices`);
      setSubServices(res.data);
    } catch (err) {
      setError("Failed to fetch subservices. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSubService = (sub) => {
    setSelectedSubServices((prev) => {
      const exists = prev.find((s) => s._id === sub._id);
      if (exists) {
        return prev.filter((s) => s._id !== sub._id);
      } else {
        return [...prev, { ...sub, quantity: 1 }];
      }
    });
  };

  const changeQuantity = (subId, delta) => {
    setSelectedSubServices((prev) =>
      prev.map((s) =>
        s._id === subId
          ? { ...s, quantity: Math.max(1, s.quantity + delta) }
          : s
      )
    );
  };

  const handleContinue = () => {
    localStorage.setItem(
      "selectedSubServices",
      JSON.stringify(selectedSubServices)
    );
    localStorage.setItem("totalPrice", total);
    navigate("/payment");
  };

  const total = selectedSubServices.reduce(
    (acc, s) => acc + s.price * s.quantity,
    0
  );

  const formattedTitle = serviceId.replace(/-/g, " ");
  const capitalizedTitle = formattedTitle.replace(/\b\w/g, (char) =>
    char.toUpperCase()
  );

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold display-5 text-primary mb-2">
          {capitalizedTitle}
        </h1>
        <p className="text-muted fs-5">
          Customize your <strong>{capitalizedTitle}</strong> with premium
          services to make it unforgettable!
        </p>
        <Alert variant="info" className="mt-3">
          🌟 Tip: Click on any service to add it to your plan. You can adjust
          quantity for multiple services!
        </Alert>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      ) : (
        <Row>
          <Col lg={8} className="mb-4">
            <Row className="g-4">
              {subServices.map((sub) => {
                const selected = selectedSubServices.find(
                  (s) => s._id === sub._id
                );
                return (
                  <Col md={6} key={sub._id}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card
                        className={`h-100 shadow-sm rounded-4 border-hover ${
                          selected ? "selected-addon" : ""
                        }`}
                      >
                        <Card.Body className="d-flex flex-column justify-content-between">
                          <div>
                            <Card.Title className="h5 fw-semibold mb-2">
                              {sub.title}
                            </Card.Title>
                            <Card.Text className="text-muted small mb-3">
                              {sub.description}
                            </Card.Text>
                            <ListGroup variant="flush">
                              <ListGroup.Item>
                                <strong>Price:</strong> ₹
                                {sub.price.toLocaleString()}
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <strong>Available:</strong> {sub.quantity}
                              </ListGroup.Item>
                            </ListGroup>
                          </div>
                          <div className="mt-3 d-flex gap-2 align-items-center">
                            {selected && (
                              <div className="d-flex gap-2 align-items-center">
                                <Button
                                  size="sm"
                                  variant="outline-secondary"
                                  onClick={() => changeQuantity(sub._id, -1)}
                                >
                                  -
                                </Button>
                                <span>{selected.quantity}</span>
                                <Button
                                  size="sm"
                                  variant="outline-secondary"
                                  onClick={() => changeQuantity(sub._id, 1)}
                                >
                                  +
                                </Button>
                              </div>
                            )}
                            <Button
                              variant={selected ? "danger" : "outline-primary"}
                              className="flex-grow-1"
                              onClick={() => toggleSubService(sub)}
                            >
                              {selected ? "Remove" : "Add to Plan"}
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                );
              })}
            </Row>
          </Col>

          <Col lg={4}>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                className="shadow sticky-top rounded-4 p-3"
                style={{ top: 100 }}
              >
                <Card.Body>
                  <h5 className="fw-bold mb-3 text-secondary">
                    Your Plan Summary
                  </h5>
                  {selectedSubServices.length === 0 ? (
                    <Alert variant="light">
                      You haven’t selected any subservices yet.
                    </Alert>
                  ) : (
                    <ListGroup className="mb-3">
                      {selectedSubServices.map((s) => (
                        <ListGroup.Item key={s._id}>
                          <div className="d-flex justify-content-between">
                            <div>
                              {s.title} x {s.quantity}
                            </div>
                            <div>
                              ₹{(s.price * s.quantity).toLocaleString()}
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                  <div className="d-flex justify-content-between align-items-center mt-3 border-top pt-3">
                    <span className="fw-bold">Estimated Total:</span>
                    <span className="fs-5 text-success">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                  <Button
                    variant="primary"
                    className="mt-4 w-100 rounded-pill fw-bold"
                    disabled={selectedSubServices.length === 0}
                    onClick={handleContinue}
                  >
                    Continue to Booking
                  </Button>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ServiceDetail;
