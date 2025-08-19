import React, { useState } from "react";
import { Container, Row, Col, Nav, Card } from "react-bootstrap";
import { Gear, BoxSeam, CalendarCheck, People } from "react-bootstrap-icons";

// Import your individual pages
import ServicesPage from "./AdminServices";
import SubServicesPage from "./AdminSubServices";
import BookingsPage from "./BookingPage";
import UserDetail from "./UserDetail";

const menuItems = [
  { name: "Services", icon: <BoxSeam className="me-2" /> },
  { name: "SubServices", icon: <Gear className="me-2" /> },
  { name: "Bookings", icon: <CalendarCheck className="me-2" /> },
  { name: "Users", icon: <People className="me-2" /> },
];

const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState("Services");

  const renderContent = () => {
    switch (activeItem) {
      case "Services":
        return <ServicesPage />;
      case "SubServices":
        return <SubServicesPage />;
      case "Bookings":
        return <BookingsPage />;
      case "Users":
        return <UserDetail />;
      default:
        return <h5>Welcome to Admin Dashboard</h5>;
    }
  };

  return (
    <Container fluid className="p-0" style={{ background: "#f8f9fa" }}>
      <Row>
        {/* Sidebar */}
        <Col
          xs={12}
          md={3}
          lg={2}
          className="bg-white vh-100 p-3 border-end shadow-sm d-flex flex-column"
          style={{ minHeight: "100vh", position: "sticky", top: 0 }}
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
        </Col>

        {/* Main Content */}
        <Col xs={12} md={9} lg={10} className="p-4">
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
