import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Alert,
  Card,
  InputGroup,
} from "react-bootstrap";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ResetPassword = () => {
  const { token } = useParams(); // Token from URL
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    message: "",
    error: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return setStatus({
        message: "❌ Passwords do not match",
        error: true,
      });
    }

    setStatus({ loading: true, message: "", error: false });

    try {
      const res = await fetch(
        `http://localhost:5000/api/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: form.password }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setStatus({
        message: "✅ Password reset successfully! Redirecting to login...",
        error: false,
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setStatus({ message: err.message, error: true, loading: false });
    }
  };

  return (
    <Container className="py-5">
      <Card
        className="p-4 shadow-lg mx-auto rounded-4"
        style={{ maxWidth: "500px" }}
      >
        <h4 className="text-center mb-4 fw-bold text-primary">
          Reset Your Password
        </h4>

        {status.message && (
          <Alert
            variant={status.error ? "danger" : "success"}
            className="text-center"
          >
            {status.message}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter new password"
                required
                minLength={6}
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter new password"
              required
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100 fw-bold"
            disabled={status.loading}
          >
            {status.loading ? "Resetting..." : "Reset Password"}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default ResetPassword;
