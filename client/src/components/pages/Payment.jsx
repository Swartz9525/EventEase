// src/pages/Payment.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Button,
  ListGroup,
  Toast,
  ToastContainer,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const [services, setServices] = useState([]);
  const [total, setTotal] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");
  const [eventDate, setEventDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const selectedAddons =
      JSON.parse(localStorage.getItem("selectedAddons")) || [];
    const selectedSubServices =
      JSON.parse(localStorage.getItem("selectedSubServices")) || [];

    const allServices = [
      ...selectedAddons.map((s) => ({
        ...s,
        type: "Addon",
        quantity: s.quantity || 1,
      })),
      ...selectedSubServices.map((s) => ({
        ...s,
        type: "Subservice",
        quantity: s.quantity || 1,
      })),
    ];

    setServices(allServices);

    const totalPrice = allServices.reduce(
      (acc, s) => acc + (Number(s.price) || 0) * (s.quantity || 1),
      0
    );
    setTotal(totalPrice);
  }, []);

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      if (document.getElementById("razorpay-script")) return resolve(true);
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    setError("");

    if (!eventDate) {
      setError("Please select event date");
      return;
    }
    if (total <= 0) {
      setError("Cart is empty");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("User not logged in!");
      return;
    }

    const sdkLoaded = await loadRazorpay();
    if (!sdkLoaded) {
      setError("Razorpay SDK failed to load. Check your internet connection.");
      return;
    }

    try {
      // Create order on backend
      const orderResp = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/order`,
        {
          amount: Math.round(total * 100),
          currency: "INR",
          services, // optional; server can recompute/check
        }
      );

      const data = orderResp.data || {};
      // defensive extraction (some servers wrap the order)
      const orderId =
        data.id || data.order?.id || data.order_id || data.orderId;
      const amount =
        data.amount ||
        (data.order && data.order.amount) ||
        Math.round(total * 100);
      const currency =
        data.currency || (data.order && data.order.currency) || "INR";

      if (!orderId) {
        console.error("Order creation response (unexpected shape):", data);
        setError(
          "Order creation failed (invalid response). Check server logs."
        );
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // make sure this env var exists (Vite: VITE_RAZORPAY_KEY_ID)
        amount,
        currency,
        name: "Event Booking",
        description: "Payment for services",
        order_id: orderId,
        handler: async (razorpayRes) => {
          try {
            console.log("Razorpay response:", razorpayRes);

            // sanitize services so required fields exist (Booking schema requires name)
            const sanitizedServices = (services || []).map((s, idx) => ({
              name: s.name || s.title || `Service ${idx + 1}`,
              type: s.type || "Unknown",
              price: Number(s.price) || 0,
              quantity: Number(s.quantity) || 1,
            }));

            const payload = {
              razorpay_order_id: razorpayRes.razorpay_order_id,
              razorpay_payment_id: razorpayRes.razorpay_payment_id,
              razorpay_signature: razorpayRes.razorpay_signature,
              email: user.email,
              services: sanitizedServices,
              total: Number(total),
              // send eventDate as ISO so backend receives a parseable date
              eventDate: new Date(eventDate).toISOString(),
            };

            console.log("Verify payload:", payload);

            const verifyResp = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/api/payment/verify`,
              payload
            );

            console.log("Verify response:", verifyResp.data);
            setShowToast(true);
            setTimeout(() => {
              localStorage.removeItem("selectedAddons");
              localStorage.removeItem("selectedSubServices");
              localStorage.removeItem("totalPrice");
              navigate("/profile");
            }, 2000);
          } catch (err) {
            console.error("Verify error:", err);
            const backendMsg =
              err?.response?.data?.message ||
              err?.response?.data?.error ||
              (err?.response?.data ? JSON.stringify(err.response.data) : null);
            setError(
              backendMsg || err.message || "Payment verification failed"
            );
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: "#3399cc" },
        modal: {
          ondismiss: () => {
            setError("Payment cancelled by user");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Order creation error:", err);
      const serverMsg =
        err?.response?.data?.message || err?.response?.data || err.message;
      setError(serverMsg || "Something went wrong. Try again.");
    }
  };

  return (
    <Container className="py-5 position-relative">
      <Card className="mx-auto shadow p-4" style={{ maxWidth: "600px" }}>
        <h3 className="text-center mb-4">Payment</h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <ListGroup className="mb-4">
          {services.map((s, idx) => (
            <ListGroup.Item key={idx}>
              <div className="d-flex justify-content-between">
                <div>
                  {s.name || s.title} ({s.type}) x {s.quantity}
                </div>
                <div>
                  ₹{((s.price || 0) * (s.quantity || 1)).toLocaleString()}
                </div>
              </div>
            </ListGroup.Item>
          ))}
          <ListGroup.Item className="d-flex justify-content-between fw-bold border-top">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </ListGroup.Item>
        </ListGroup>

        <input
          type="date"
          className="form-control mb-3"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
        />

        <Button
          variant="success"
          onClick={handlePayment}
          className="w-100 fw-bold"
        >
          Pay Now ₹{total.toLocaleString()}
        </Button>
      </Card>

      <ToastContainer position="top-center" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={2500}
          bg="success"
          autohide
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto">Payment Success</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            Your booking has been saved and confirmed!
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default Payment;
