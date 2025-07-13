import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";

const Settings = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "", // stays empty intentionally
  });

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setForm((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        mobile: user.mobile || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSave = async (e) => {
    e.preventDefault();

    if (form.currentPassword && form.newPassword) {
      try {
        const res = await fetch("http://localhost:5000/api/change-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            currentPassword: form.currentPassword,
            newPassword: form.newPassword,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        alert("Password changed successfully!");
      } catch (err) {
        alert("Error: " + err.message);
      }
    } else {
      alert("Saved profile changes (but no password updated).");
    }
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4 text-primary">⚙️ Account Settings</h2>

      <Card className="p-4 shadow-sm rounded-4">
        <Form onSubmit={handleSave}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="tel"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Current Password</Form.Label>
            <Form.Control
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100 fw-bold rounded-pill"
          >
            Save Changes
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Settings;
