// File: src/components/ServicesSection.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Spinner } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ServicesSection.css";

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("az");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/services");
      setServices(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortOption === "az") return a.name.localeCompare(b.name);
    if (sortOption === "za") return b.name.localeCompare(a.name);
    if (sortOption === "newest")
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOption === "oldest")
      return new Date(a.createdAt) - new Date(b.createdAt);
    return 0;
  });

  return (
    <section className="services-section py-5">
      <Container>
        {/* Heading */}
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="fw-bold display-6">Our Professional Services</h2>
          <p className="text-muted fs-5">
            Discover tailored event solutions designed to make your moments
            unforgettable.
          </p>
        </motion.div>

        {/* Controls */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-4">
          <Form.Control
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ maxWidth: "320px" }}
          />
          <Form.Select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{ maxWidth: "220px" }}
          >
            <option value="az">Sort: A–Z</option>
            <option value="za">Sort: Z–A</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </Form.Select>
        </div>

        {/* Loader / Error */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading services...</p>
          </div>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : sortedServices.length === 0 ? (
          <p className="text-center text-muted">No services found.</p>
        ) : (
          <Row className="g-4">
            <AnimatePresence>
              {sortedServices.map((service, idx) => (
                <Col md={4} sm={6} xs={12} key={service._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <Card
                      className="service-card h-100"
                      onClick={() =>
                        navigate(
                          `/services/${service.name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`
                        )
                      }
                    >
                      {service.image && (
                        <Card.Img
                          variant="top"
                          src={service.image}
                          alt={service.name}
                          className="service-img"
                        />
                      )}
                      <Card.Body className="text-center">
                        <h5 className="fw-bold">{service.name}</h5>
                        <p className="text-muted small">
                          {service.description.length > 90
                            ? service.description.slice(0, 90) + "..."
                            : service.description}
                        </p>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </AnimatePresence>
          </Row>
        )}
      </Container>
    </section>
  );
};

export default ServicesSection;
