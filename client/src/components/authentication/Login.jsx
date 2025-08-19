import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Confetti from "react-confetti";
import * as jwtDecode from "jwt-decode"; // ES module import for Vite
import { AuthContext } from "../context/AuthContext";

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
  const { login } = useContext(AuthContext);
  const from = location.state?.from?.pathname || "/";

  // Redirect if user already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiry = parseInt(localStorage.getItem("tokenExpiry"), 10);

    if (token && expiry && expiry > Date.now()) {
      navigate(from, { replace: true });
    } else {
      // Expired token cleanup
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("tokenExpiry");
    }
  }, [navigate, from]);

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
      if (!res.ok || !data.token || !data.user) {
        throw new Error(data.message || "Login failed");
      }

      // Store token and user with 7-day expiry
      login(data.token, data.user);

      setStatus({ loading: false, error: "", success: true });
      setShowConfetti(true);

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 2000);
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: false });
    }
  };

  return (
    <Container className="py-5">
      <Card
        className="p-4 shadow-lg border-0 mx-auto rounded-4"
        style={{ maxWidth: "480px" }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Welcome Back 👋</h2>
          <p className="text-muted">Login to continue managing your events</p>
        </div>

        {status.error && <Alert variant="danger">{status.error}</Alert>}
        {status.success && <Alert variant="success">Login successful!</Alert>}

        <Form onSubmit={handleSubmit} className="mt-3">
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="e.g. user@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="rounded-3"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                className="rounded-start-3"
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword((prev) => !prev)}
                className="rounded-end-3"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <div className="d-flex justify-content-end mb-3">
            <Link to="/forgot-password" className="small text-decoration-none">
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-100 fw-bold rounded-pill"
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

        <p className="text-center mt-4 mb-0 small">
          Don’t have an account?{" "}
          <Link to="/register" className="fw-bold text-decoration-none">
            Register here
          </Link>
        </p>
      </Card>

      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
    </Container>
  );
};

export default Login;
