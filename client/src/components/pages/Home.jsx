// File: src/pages/Home.jsx
import React from "react";
import {
  Carousel,
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import HeroCarousel from "./HeroCarousel";

const staticImages = [
  "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F1066430473%2F2824830914871%2F1%2Foriginal.png?h=200&w=512&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C940%2C470&s=ed132eb38cc71546b90cd380207dc339",
  "https://tse1.mm.bing.net/th/id/OIP.jUw1QMntV4ZqhHmqmcP1JAHaE8?pid=Api&P=0&h=220",
  "https://tse1.mm.bing.net/th/id/OIP.wVS0lAcQPXYFbrgWt8nPNQHaEO?pid=Api&P=0&h=220",
  "https://tse4.mm.bing.net/th/id/OIP.R6L5KZO2c-gSCVIURcGoVQHaFj?pid=Api&P=0&h=220",
  "https://tse1.mm.bing.net/th/id/OIP.P7zOq36SYCdzw8pG2-To-AHaE7?pid=Api&P=0&h=220",
  "https://images.unsplash.com/photo-1531058020387-3be344556be6",
];

const Home = () => {
  return (
    <>
      <HeroCarousel />

      {/* Services We Offer */}
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Services We Offer</h2>
          <Link to="/services" className="btn btn-outline-primary btn-sm">
            View All Services
          </Link>
        </div>
        <Row>
          {["Wedding", "Birthday", "Corporate", "Anniversary"].map(
            (service) => (
              <Col md={3} key={service} className="mb-4">
                <Card className="h-100 text-center">
                  <Card.Body>
                    <Card.Title>{service}</Card.Title>
                    <Card.Text>
                      High-quality planning and management for your perfect{" "}
                      {service.toLowerCase()}.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            )
          )}
        </Row>
      </Container>

      <Container className="py-5 bg-light">
        <h2 className="text-center mb-4">Our Past Events</h2>
        <Row>
          {staticImages.map((imgUrl, idx) => (
            <Col md={4} className="mb-4" key={idx}>
              <div
                style={{
                  width: "100%",
                  height: "250px",
                  overflow: "hidden",
                  borderRadius: "10px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={imgUrl}
                  alt={`event-${idx + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Feedback Section */}
      <Container className="py-5">
        <h2 className="text-center mb-4">Client Feedback</h2>
        <Row>
          {[1, 2, 3].map((_, idx) => (
            <Col md={4} key={idx}>
              <Card className="mb-4 shadow-sm border-0">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                      style={{ width: 50, height: 50, fontSize: "1.5rem" }}
                    >
                      {`C${idx + 1}`}
                    </div>
                    <div className="ms-3">
                      <Card.Title className="mb-0">Client {idx + 1}</Card.Title>
                      <Card.Subtitle className="text-muted">
                        Verified User
                      </Card.Subtitle>
                    </div>
                  </div>
                  <Card.Text>
                    <em>
                      "EventEase made everything stress-free and smooth.
                      Absolutely recommend them!"
                    </em>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Contact Section */}
      <Container className="py-5 bg-light">
        <h2 className="text-center mb-4">Contact Us</h2>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Your Name" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Your Email" />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Message</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Your Message" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Container>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} EventEase. All rights reserved.
        </p>
      </footer>
    </>
  );
};

export default Home;
