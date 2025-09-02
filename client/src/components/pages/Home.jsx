import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import HeroCarousel from "./HeroCarousel";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FiArrowRight, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { FaQuoteLeft } from "react-icons/fa";
import axios from "axios";
import "animate.css";

// 🔹 Static images for Past Events
const staticImages = [
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  "https://images.unsplash.com/photo-1531058020387-3be344556be6",
  "https://images.unsplash.com/photo-1526045612212-70caf35c14df",
  "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
];

// 🔹 Reusable animation wrapper
const AnimatedCard = ({ children }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 },
      }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

const Home = () => {
  const [services, setServices] = useState([]);

  // 🔹 Fetch first 4 services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/services");
        setServices(res.data.slice(0, 4));
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    fetchServices();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message submitted successfully!");
  };

  return (
    <>
      {/* 🔹 Intro Section */}
      <Container className="py-5 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="fw-bold"
        >
          Welcome to EventEase
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="lead text-muted mt-3"
        >
          EventEase is your one-stop solution for organizing, booking, and
          managing events effortlessly. From weddings to corporate parties,
          we’ve got you covered with premium services and seamless experiences.
        </motion.p>
      </Container>

      {/* 🔹 Hero Section (short height) */}
      <div style={{ height: "60vh", overflow: "hidden" }}>
        <HeroCarousel />
      </div>

      {/* 🔹 Services Section */}
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-0"
          >
            Our Premium Services
          </motion.h2>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/services" className="btn btn-outline-primary btn-sm">
              Explore All Services <FiArrowRight className="ms-1" />
            </Link>
          </motion.div>
        </div>

        <Row>
          {services.map((service, index) => (
            <Col md={3} key={service._id} className="mb-4">
              <AnimatedCard>
                <motion.div
                  whileHover={{
                    y: -10,
                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    to={`/services/${service.name.toLowerCase()}`}
                    className="text-decoration-none text-dark"
                  >
                    <Card className="h-100 text-center shadow-sm border-0 overflow-hidden">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <div
                          className="service-image"
                          style={{
                            backgroundImage: `url(${service.image})`,
                            height: "150px",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        />
                        <Card.Body className="p-4">
                          <Card.Title className="fw-bold">
                            {service.name}
                          </Card.Title>
                          <Card.Text className="text-muted">
                            {service.description}
                          </Card.Text>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-3"
                          >
                            <Button variant="outline-primary" size="sm">
                              Learn More
                            </Button>
                          </motion.div>
                        </Card.Body>
                      </motion.div>
                    </Card>
                  </Link>
                </motion.div>
              </AnimatedCard>
            </Col>
          ))}
        </Row>
      </Container>

      {/* 🔹 Past Events Section */}
      <Container className="py-5 bg-light">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-5"
        >
          Our Successful Events
        </motion.h2>
        <Row className="g-4">
          {staticImages.map((imgUrl, idx) => (
            <Col md={4} key={idx}>
              <AnimatedCard>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="position-relative event-card"
                >
                  <div className="event-image-wrapper">
                    <img
                      src={imgUrl}
                      alt={`Past event ${idx + 1}`}
                      className="img-fluid rounded shadow event-image"
                    />
                    <div className="event-overlay">
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="overlay-content"
                      >
                        <Button variant="light" size="sm">
                          View Gallery
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                  <div className="event-caption p-3">
                    <h5 className="mb-1">Event {idx + 1}</h5>
                    <small className="text-muted">December 15, 2023</small>
                  </div>
                </motion.div>
              </AnimatedCard>
            </Col>
          ))}
        </Row>
      </Container>

      {/* 🔹 Testimonials Section */}
      <Container className="py-5">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-5"
        >
          Client Testimonials
        </motion.h2>
        <Row className="g-4">
          {[1, 2, 3].map((_, idx) => (
            <Col md={4} key={idx}>
              <AnimatedCard>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-100 shadow-sm border-0">
                    <Card.Body className="p-4 position-relative">
                      <div className="d-flex align-items-center mb-3">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: idx * 0.2 }}
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                          style={{ width: 50, height: 50, fontSize: "1.5rem" }}
                        >
                          {`C${idx + 1}`}
                        </motion.div>
                        <div className="ms-3">
                          <Card.Title className="mb-0">
                            Client {idx + 1}
                          </Card.Title>
                          <Card.Subtitle className="text-muted">
                            Verified User
                          </Card.Subtitle>
                        </div>
                      </div>
                      <div className="quote-icon">
                        <FaQuoteLeft
                          className="text-primary opacity-25"
                          size={24}
                        />
                      </div>
                      <Card.Text className="mt-3">
                        <em>
                          "EventEase made everything stress-free and smooth.
                          Absolutely recommend them!"
                        </em>
                      </Card.Text>
                      <div className="rating mt-3">
                        {[...Array(5)].map((_, i) => (
                          <motion.span
                            key={i}
                            whileHover={{ scale: 1.2 }}
                            className="text-warning"
                          >
                            ★
                          </motion.span>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </AnimatedCard>
            </Col>
          ))}
        </Row>
      </Container>

      {/* 🔹 Contact Section */}
      <Container className="py-5 bg-light">
        <Row>
          {/* Contact Info */}
          <Col lg={6} className="mb-4 mb-lg-0">
            <AnimatedCard>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="p-4">
                  <h5 className="mb-4">Our Contact Details</h5>
                  <div className="contact-item mb-3">
                    <FiMail className="me-3 text-primary" size={20} />
                    <span>info@eventease.com</span>
                  </div>
                  <div className="contact-item mb-3">
                    <FiPhone className="me-3 text-primary" size={20} />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="contact-item">
                    <FiMapPin className="me-3 text-primary" size={20} />
                    <span>123 Event Street, New York, NY 10001</span>
                  </div>
                </Card.Body>
              </Card>
            </AnimatedCard>
          </Col>

          {/* Contact Form */}
          <Col lg={6}>
            <AnimatedCard>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body className="p-4">
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Your Name</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter your name"
                              required
                              className="input-field"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                              type="email"
                              placeholder="Enter your email"
                              required
                              className="input-field"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Label>Your Message</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          placeholder="Tell us about your event needs"
                          required
                          className="input-field"
                        />
                      </Form.Group>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="primary"
                          type="submit"
                          className="w-100 py-2"
                        >
                          Send Inquiry
                        </Button>
                      </motion.div>
                    </Form>
                  </Card.Body>
                </Card>
              </motion.div>
            </AnimatedCard>
          </Col>
        </Row>
      </Container>

      {/* 🔹 Custom Styles */}
      <style>{`
        .service-image {
          width: 100%;
          height: 150px;
          background-size: cover;
          background-position: center;
          transition: transform 0.5s ease;
        }
        .event-image-wrapper {
          position: relative;
          width: 100%;
          height: 250px;
          overflow: hidden;
          border-radius: 10px 10px 0 0;
        }
        .event-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .event-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .event-card:hover .event-image {
          transform: scale(1.1);
        }
        .event-caption {
          background: white;
          border-radius: 0 0 10px 10px;
        }
        .input-field {
          border-radius: 8px;
          border: 1px solid #dee2e6;
          transition: all 0.3s ease;
        }
        .input-field:focus {
          border-color: #6a11cb;
          box-shadow: 0 0 0 0.25rem rgba(106, 17, 203, 0.25);
        }
        .contact-item {
          display: flex;
          align-items: center;
          padding: 10px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .contact-item:hover {
          background-color: rgba(106, 17, 203, 0.05);
        }
        .quote-icon {
          position: absolute;
          top: 20px;
          right: 20px;
        }
      `}</style>
    </>
  );
};

export default Home;
