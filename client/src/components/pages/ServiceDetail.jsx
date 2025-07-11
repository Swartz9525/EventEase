// File: src/pages/ServiceDetail.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Badge,
  Alert,
} from "react-bootstrap";

const addons = [
  {
    name: "Premium Decoration",
    description: "Elegant floral and lighting design for your venue.",
    price: 5000,
    tag: "Popular",
    icon: "🎀",
  },
  {
    name: "Catering Services",
    description: "Multi-cuisine buffet with customizable menu.",
    price: 12000,
    tag: "Best Value",
    icon: "🍽️",
  },
  {
    name: "Live Music",
    description: "Professional band/DJ for entertainment.",
    price: 7000,
    icon: "🎵",
  },
  {
    name: "Photography & Videography",
    description: "Capture every special moment in high quality.",
    price: 8000,
    tag: "Highly Rated",
    icon: "📸",
  },
  {
    name: "Custom Stage Design",
    description: "Tailored stage with lighting effects and props.",
    price: 6000,
    icon: "🎭",
  },
  {
    name: "Event Host / MC",
    description: "Engaging host to keep the event lively.",
    price: 3500,
    icon: "🎤",
  },
  {
    name: "Guest Welcome Kit",
    description: "Personalized kits with snacks, souvenirs, and brochures.",
    price: 3000,
    icon: "🎁",
  },
  {
    name: "LED Screens",
    description: "Large screens for live visuals and presentations.",
    price: 9000,
    icon: "📺",
  },
];

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [selectedAddons, setSelectedAddons] = useState([]);

  const formattedTitle = serviceId.replace(/-/g, " ");
  const capitalizedTitle = formattedTitle.replace(/\b\w/g, (char) =>
    char.toUpperCase()
  );

  const toggleAddon = (addon) => {
    setSelectedAddons((prev) => {
      if (prev.includes(addon.name)) {
        return prev.filter((item) => item !== addon.name);
      } else {
        return [...prev, addon.name];
      }
    });
  };

  const handleContinue = () => {
    const selectedDetails = addons.filter((addon) =>
      selectedAddons.includes(addon.name)
    );
    localStorage.setItem("selectedAddons", JSON.stringify(selectedDetails));
    localStorage.setItem("totalPrice", total);
    navigate("/payment");
  };

  const total = addons.reduce(
    (acc, addon) =>
      selectedAddons.includes(addon.name) ? acc + addon.price : acc,
    0
  );

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold display-5 text-primary mb-2">
          {capitalizedTitle}
        </h1>
        <p className="text-muted fs-5">
          Personalize your <strong>{capitalizedTitle.toLowerCase()}</strong>{" "}
          with optional premium services.
        </p>
      </div>

      <Row>
        {/* Add-on selection */}
        <Col lg={8} className="mb-4">
          <Row className="g-4">
            {addons.map((addon) => (
              <Col md={6} key={addon.name}>
                <Card
                  className={`addon-card h-100 shadow-sm border-0 p-3 rounded-4 hover-zoom ${
                    selectedAddons.includes(addon.name) ? "selected-addon" : ""
                  }`}
                >
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Card.Title className="h5 fw-semibold">
                          <span className="me-2 fs-4">{addon.icon}</span>
                          {addon.name}
                        </Card.Title>
                        {addon.tag && (
                          <Badge bg="info" pill>
                            {addon.tag}
                          </Badge>
                        )}
                      </div>
                      <Card.Text className="text-muted small">
                        {addon.description}
                      </Card.Text>
                      <ListGroup variant="flush" className="mb-3">
                        <ListGroup.Item>
                          <strong>Cost:</strong> ₹{addon.price.toLocaleString()}
                        </ListGroup.Item>
                      </ListGroup>
                    </div>
                    <Button
                      variant={
                        selectedAddons.includes(addon.name)
                          ? "danger"
                          : "outline-primary"
                      }
                      onClick={() => toggleAddon(addon)}
                      className="w-100 mt-2"
                    >
                      {selectedAddons.includes(addon.name)
                        ? "Remove"
                        : "Add to Plan"}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        {/* Summary sidebar */}
        <Col lg={4}>
          <Card
            className="shadow sticky-top rounded-4 p-3"
            style={{ top: 100 }}
          >
            <Card.Body>
              <h5 className="fw-bold mb-3 text-secondary">Your Plan Summary</h5>
              {selectedAddons.length === 0 ? (
                <Alert variant="light">
                  You haven’t selected any add-ons yet.
                </Alert>
              ) : (
                <ListGroup className="mb-3">
                  {selectedAddons.map((name) => (
                    <ListGroup.Item key={name}>{name}</ListGroup.Item>
                  ))}
                </ListGroup>
              )}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="fw-bold">Estimated Total:</span>
                <span className="fs-5 text-success">
                  ₹{total.toLocaleString()}
                </span>
              </div>
              <Button
                variant="primary"
                className="mt-4 w-100 rounded-pill fw-bold"
                disabled={selectedAddons.length === 0}
                onClick={handleContinue}
              >
                Continue to Booking
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ServiceDetail;
