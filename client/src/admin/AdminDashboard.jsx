// File: src/components/pages/AdminDashboard.jsx
import React, { useState } from "react";
import { Container, Row, Col, Nav, Card, Button } from "react-bootstrap";
import {
  Gear,
  BoxSeam,
  CalendarCheck,
  People,
  InfoCircle,
  BoxArrowRight,
} from "react-bootstrap-icons";

// Import your individual pages
import AdminHome from "./AdminHome";
import ServicesPage from "./AdminServices";
import SubServicesPage from "./AdminSubServices";
import BookingsPage from "./BookingPage";
import UserDetail from "./UserDetail";

// Import user-facing pages
import ServicesSection from "../components/pages/ServicesSection";
import ServiceDetail from "../components/pages/ServiceDetail";
import About from "../components/pages/About";

const menuItems = [
  { name: "Home", icon: <Gear className="me-2" /> },
  { name: "Services", icon: <BoxSeam className="me-2" /> },
  { name: "SubServices", icon: <Gear className="me-2" /> },
  { name: "Bookings", icon: <CalendarCheck className="me-2" /> },
  { name: "Users", icon: <People className="me-2" /> },
  { name: "User Service", icon: <BoxSeam className="me-2" /> },
  { name: "About", icon: <InfoCircle className="me-2" /> },
];

const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState("Home");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const renderContent = () => {
    if (activeItem.startsWith("ServiceDetail:")) {
      const id = activeItem.split(":")[1];
      return <ServiceDetail id={id} />;
    }

    switch (activeItem) {
      case "Home":
        return <AdminHome />;
      case "Services":
        return <ServicesPage setActiveItem={setActiveItem} />;
      case "SubServices":
        return <SubServicesPage />;
      case "Bookings":
        return <BookingsPage />;
      case "Users":
        return <UserDetail />;
      case "User Service":
        return <ServicesSection setActiveItem={setActiveItem} />;
      case "About":
        return <About />;
      default:
        return <h5>Welcome to Admin Dashboard</h5>;
    }
  };

  return (
    <Container fluid className="p-0" style={{ background: "#f8f9fa" }}>
      <Row className="g-0">
        {/* Sidebar */}
        <Col
          xs="auto"
          style={{
            width: "250px", // fixed sidebar width
            position: "sticky",
            top: 0,
            height: "100vh",
            zIndex: 1000,
          }}
          className="bg-white p-3 border-end shadow-sm d-flex flex-column"
        >
          <h4 className="mb-4 text-primary fw-bold">Admin Panel</h4>

          <Nav className="flex-column" variant="pills" activeKey={activeItem}>
            {menuItems.map((item) => (
              <Nav.Item key={item.name} className="mb-2">
                <Nav.Link
                  eventKey={item.name}
                  onClick={() => setActiveItem(item.name)}
                  className={`fw-semibold d-flex align-items-center ${
                    activeItem === item.name
                      ? "bg-primary text-white rounded"
                      : "text-dark"
                  }`}
                  style={{ padding: "10px 15px", transition: "0.2s" }}
                >
                  {item.icon} {item.name}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          {/* Logout Button pinned bottom */}
          <div className="mt-auto">
            <Button
              variant="outline-danger"
              className="w-100 d-flex align-items-center justify-content-center fw-semibold"
              onClick={handleLogout}
            >
              <BoxArrowRight className="me-2" />
              Logout
            </Button>
          </div>
        </Col>

        {/* Main Content */}
        <Col className="p-4">
          <Card
            className="shadow-sm border-0 rounded-4 p-3"
            style={{ minHeight: "80vh" }}
          >
            {renderContent()}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
