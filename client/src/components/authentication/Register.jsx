import React, { useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate, useLocation, Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    password: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    message: "",
    error: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: "", error: false });

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({
          loading: false,
          message: "🎉 Registration successful!",
          error: false,
        });
        setForm({
          firstName: "",
          lastName: "",
          mobile: "",
          email: "",
          password: "",
        });

        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1500);
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (err) {
      setStatus({ loading: false, message: err.message, error: true });
    }
  };

  return (
    <Container className="py-5">
      <Card
        className="p-4 shadow-lg border-0 mx-auto rounded-4"
        style={{ maxWidth: "550px" }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Create Your Account</h2>
          <p className="text-muted mb-0">Join us to make your event shine ✨</p>
        </div>

        {status.message && (
          <Alert variant={status.error ? "danger" : "success"}>
            {status.message}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Floating>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                />
                <label>First Name</label>
              </Form.Floating>
            </Col>
            <Col>
              <Form.Floating>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                />
                <label>Last Name</label>
              </Form.Floating>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Floating>
              <Form.Control
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
              <label>Email Address</label>
            </Form.Floating>
          </Form.Group>

          <Form.Group className="mb-4">
            <InputGroup>
              <Form.Floating className="flex-grow-1">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  minLength={6}
                />
                <label>Password</label>
              </Form.Floating>
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Floating>
              <Form.Control
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Mobile"
                pattern="[0-9]{10}"
                required
              />
              <label>Mobile Number</label>
            </Form.Floating>
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100 fw-bold rounded-pill"
            disabled={status.loading}
          >
            {status.loading ? (
              <>
                <Spinner animation="border" size="sm" /> Creating Account...
              </>
            ) : (
              "Register Now"
            )}
          </Button>
        </Form>

        <div className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/login" className="fw-bold text-decoration-none">
            Login here
          </Link>
        </div>
      </Card>
    </Container>
  );
};

export default Register;
