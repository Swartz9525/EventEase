// File: src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({
    loading: false,
    message: "",
    error: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: "", error: false });

    try {
      const res = await fetch("http://localhost:5000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setStatus({
        loading: false,
        message: "✅ Reset link sent to your email!",
        error: false,
      });
    } catch (err) {
      setStatus({ loading: false, message: err.message, error: true });
    }
  };

  return (
    <Container className="py-5">
      <Card className="p-4 shadow-lg mx-auto" style={{ maxWidth: "500px" }}>
        <h4 className="text-center mb-4">Forgot Password</h4>
        {status.message && (
          <Alert variant={status.error ? "danger" : "success"}>
            {status.message}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
            />
          </Form.Group>
          <Button type="submit" className="w-100" disabled={status.loading}>
            {status.loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default ForgotPassword;
