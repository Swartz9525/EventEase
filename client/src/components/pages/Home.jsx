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

      {/* Past Events Gallery */}
      <Container className="py-5 bg-light">
        <h2 className="text-center mb-4">Our Past Events</h2>
        <Row>
          {[1, 2, 3, 4, 5, 6].map((_, idx) => (
            <Col md={4} className="mb-3" key={idx}>
              <img
                src={`https://source.unsplash.com/400x300/?event,${idx}`}
                alt={`event-${idx}`}
                className="img-fluid rounded shadow-sm"
              />
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
