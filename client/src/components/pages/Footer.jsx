// File: src/components/pages/Footer.jsx
import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5 mt-4">
      <Container>
        <Row className="gy-5">
          {/* Logo & Description */}
          <Col xs={12} md={4}>
            <h5 className="text-success fw-bold">EventEase</h5>
            <p className="mb-0">
              Your trusted partner for planning and managing weddings,
              birthdays, conferences, and corporate events with excellence.
            </p>
          </Col>

          {/* Quick Links */}
          <Col xs={6} sm={6} md={2}>
            <h6 className="text-success mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              {["Home", "About", "Services", "Contact"].map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="text-white text-decoration-none d-block mb-1"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          {/* Social Media Links */}
          <Col xs={6} sm={6} md={2}>
            <h6 className="text-success mb-3">Follow Us</h6>
            <div className="d-flex flex-wrap gap-3">
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-success fs-4"
              >
                <FaGithub />
              </a>
              <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-success fs-4"
              >
                <FaLinkedin />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-success fs-4"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-success fs-4"
              >
                <FaInstagram />
              </a>
              <a
                href="mailto:youremail@example.com"
                className="text-success fs-4"
              >
                <FaEnvelope />
              </a>
            </div>
          </Col>

          {/* Newsletter */}
          <Col xs={12} md={4}>
            <h6 className="text-success mb-3">Stay Updated</h6>
            <p className="mb-2">
              Subscribe to our newsletter for the latest event updates and
              offers.
            </p>
            <Form className="d-flex flex-column flex-sm-row">
              <Form.Control
                type="email"
                placeholder="Enter your email"
                className="mb-2 mb-sm-0 me-sm-2"
              />
              <Button variant="success" type="submit">
                Subscribe
              </Button>
            </Form>
          </Col>
        </Row>

        {/* Footer Bottom */}
        <div className="text-center mt-5 pt-3 border-top border-secondary">
          <small>
            © {new Date().getFullYear()} EventEase. All rights reserved.
          </small>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
