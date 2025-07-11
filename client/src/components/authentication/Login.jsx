// File: src/pages/Login.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Confetti from "react-confetti";
import { jwtDecode } from "jwt-decode"; // ✅ Correct named import

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"; // ⭐ return to previous page

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          navigate(from, { replace: true });
        }
      } catch (e) {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", success: false });

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      setStatus({ loading: false, error: "", success: true });
      setShowConfetti(true);

      setTimeout(() => {
        navigate(from, { replace: true }); // ✅ Redirect to previous protected route
      }, 2000);
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: false });
    }
  };

  return (
    <Container className="py-5">
      <Card
        className="p-4 shadow-lg border-0 mx-auto rounded-4"
        style={{ maxWidth: "500px" }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Login</h2>
          <p className="text-muted">Access your account below</p>
        </div>

        {status.error && <Alert variant="danger">{status.error}</Alert>}
        {status.success && <Alert variant="success">Login successful!</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <div className="d-flex justify-content-end mb-3">
            <a href="/forgot-password" className="text-decoration-none small">
              Forgot Password?
            </a>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-100 fw-bold"
            disabled={status.loading}
          >
            {status.loading ? (
              <>
                <Spinner size="sm" animation="border" /> Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </Form>
      </Card>

      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
    </Container>
  );
};

export default Login;
