// File: src/components/ServicesSection.jsx
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ButtonGroup,
  Button,
  OverlayTrigger,
  Tooltip,
  Form,
} from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./ServicesSection.css";

const allServices = [
  {
    title: "Weddings",
    category: "Personal",
    description:
      "Dream weddings with personalized décor and flawless planning.",
    icon: "💍",
  },
  {
    title: "Birthday Parties",
    category: "Personal",
    description: "Themed birthday events filled with joy and fun for all ages.",
    icon: "🎉",
  },
  {
    title: "Corporate Events",
    category: "Corporate",
    description: "Professional and engaging corporate setups.",
    icon: "🏢",
  },
  {
    title: "Anniversaries",
    category: "Personal",
    description: "Celebrate milestones with memorable arrangements.",
    icon: "❤️",
  },
  {
    title: "Workshops",
    category: "Corporate",
    description: "Interactive setups for skill development and learning.",
    icon: "🧠",
  },
  {
    title: "Baby Showers",
    category: "Personal",
    description: "Cute and cozy celebrations for new beginnings.",
    icon: "👶",
  },
  {
    title: "Concerts",
    category: "Entertainment",
    description: "High-energy music events with pro audio/visual.",
    icon: "🎶",
  },
  {
    title: "Product Launches",
    category: "Corporate",
    description: "Sleek and impactful setups for your brand.",
    icon: "🚀",
  },
  {
    title: "Award Ceremonies",
    category: "Corporate",
    description: "Formal events with premium hospitality and decor.",
    icon: "🏆",
  },
  {
    title: "Fashion Shows",
    category: "Entertainment",
    description: "Stylish runway events with lighting and stage setup.",
    icon: "👗",
  },
  {
    title: "Festivals",
    category: "Entertainment",
    description: "Large-scale cultural and music celebrations.",
    icon: "🎪",
  },
  {
    title: "Retirement Parties",
    category: "Personal",
    description: "Warm send-offs with customized themes.",
    icon: "👴",
  },
];

const categories = [
  { label: "All", icon: "🌐", tip: "Show all services" },
  { label: "Personal", icon: "👨‍👩‍👧", tip: "Family and social celebrations" },
  { label: "Corporate", icon: "💼", tip: "Business and professional events" },
  { label: "Entertainment", icon: "🎭", tip: "Music, shows, and festivals" },
];

const ServicesSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredServices = allServices.filter((service) => {
    const matchesCategory =
      selectedCategory === "All" || service.category === selectedCategory;
    const matchesSearch = service.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">Services We Offer</h2>

      {/* Search and Categories */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-4">
        <Form.Control
          type="text"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ maxWidth: "300px" }}
        />

        <ButtonGroup>
          {categories.map(({ label, icon, tip }) => (
            <OverlayTrigger
              key={label}
              placement="top"
              overlay={<Tooltip>{tip}</Tooltip>}
            >
              <Button
                variant={
                  selectedCategory === label ? "primary" : "outline-primary"
                }
                onClick={() => setSelectedCategory(label)}
              >
                {icon} {label}
              </Button>
            </OverlayTrigger>
          ))}
        </ButtonGroup>
      </div>

      {filteredServices.length === 0 ? (
        <p className="text-center text-muted">No services found.</p>
      ) : (
        <Row>
          <AnimatePresence>
            {filteredServices.map((service, idx) => (
              <Col md={3} sm={6} xs={12} key={service.title} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <Card
                    className="service-card h-100 text-center"
                    onClick={() =>
                      navigate(
                        `/services/${service.title
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`
                      )
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <Card.Body>
                      <div className="service-icon mb-2">{service.icon}</div>
                      <Card.Title>{service.title}</Card.Title>
                      <Card.Text>
                        {service.description.slice(0, 60)}...
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </AnimatePresence>
        </Row>
      )}
    </Container>
  );
};

export default ServicesSection;
