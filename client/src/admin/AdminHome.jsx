import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Button,
  ButtonGroup,
  Badge,
} from "react-bootstrap";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const COLORS = ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0", "#FF5722"];

const AdminHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("monthly");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/admin/stats`);

      const dailyIncome =
        data.dailyIncome?.map((item) => ({
          day: `${item._id.day}/${item._id.month}`,
          income: item.total,
        })) || [];

      const monthlyIncome =
        data.monthlyIncome?.map((item) => ({
          month: new Date(item._id.year, item._id.month - 1).toLocaleString(
            "default",
            { month: "short" }
          ),
          income: item.total,
        })) || [];

      const yearlyIncome =
        data.yearlyIncome?.map((item) => ({
          year: item._id.year.toString(),
          income: item.total,
        })) || [];

      const userGrowth =
        data.userGrowth?.map((item) => ({
          month: new Date(item._id.year, item._id.month - 1).toLocaleString(
            "default",
            { month: "short" }
          ),
          users: item.total,
        })) || [];

      setDashboardData({
        totalUsers: data.totalUsers || 0,
        totalBookings: data.totalBookings || 0,
        totalIncome: data.totalIncome || 0,
        dailyIncome,
        monthlyIncome,
        yearlyIncome,
        userGrowth,
      });
    } catch (err) {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white border rounded shadow-sm">
          <p className="fw-bold">{label}</p>
          <p style={{ color: payload[0].color }}>{`${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading)
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (error)
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  if (!dashboardData) return null;

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold text-dark">📊 Admin Dashboard</h2>
          <p className="text-muted">
            Monitor platform performance in real-time
          </p>
        </Col>
        <Col xs="auto">
          <Button onClick={fetchDashboard} variant="primary">
            <i className="bi bi-arrow-clockwise"></i> Refresh
          </Button>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4 g-3">
        <Col md={4}>
          <Card className="shadow border-0 h-100">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted">Total Users</h6>
                <h3 className="fw-bold">{dashboardData.totalUsers}</h3>
                <Badge bg="success">
                  +{dashboardData.userGrowth.at(-1)?.users || 0} this month
                </Badge>
              </div>
              <i className="bi bi-people-fill text-primary fs-1"></i>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow border-0 h-100">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted">Total Income</h6>
                <h3 className="fw-bold">
                  {formatCurrency(dashboardData.totalIncome)}
                </h3>
                <Badge bg="info">
                  Monthly {dashboardData.monthlyIncome.at(-1)?.income || 0}
                </Badge>
              </div>
              <i className="bi bi-currency-rupee text-success fs-1"></i>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow border-0 h-100">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted">Total Bookings</h6>
                <h3 className="fw-bold">{dashboardData.totalBookings}</h3>
                <Badge bg="warning" text="dark">
                  Active {Math.floor(dashboardData.totalBookings * 0.7)}
                </Badge>
              </div>
              <i className="bi bi-ticket-perforated text-warning fs-1"></i>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Revenue Chart */}
      <Row className="mb-4">
        <Col lg={8} className="mb-3">
          <Card className="shadow border-0 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <h5>Revenue Analytics</h5>
                <ButtonGroup size="sm">
                  <Button
                    variant={
                      timeRange === "daily" ? "primary" : "outline-primary"
                    }
                    onClick={() => setTimeRange("daily")}
                  >
                    Daily
                  </Button>
                  <Button
                    variant={
                      timeRange === "monthly" ? "primary" : "outline-primary"
                    }
                    onClick={() => setTimeRange("monthly")}
                  >
                    Monthly
                  </Button>
                  <Button
                    variant={
                      timeRange === "yearly" ? "primary" : "outline-primary"
                    }
                    onClick={() => setTimeRange("yearly")}
                  >
                    Yearly
                  </Button>
                </ButtonGroup>
              </div>
              <div style={{ height: 300 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={
                      timeRange === "daily"
                        ? dashboardData.dailyIncome
                        : timeRange === "monthly"
                        ? dashboardData.monthlyIncome
                        : dashboardData.yearlyIncome
                    }
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey={
                        timeRange === "daily"
                          ? "day"
                          : timeRange === "monthly"
                          ? "month"
                          : "year"
                      }
                    />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="income"
                      fill="#4CAF50"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Pie Chart */}
        <Col lg={4} className="mb-3">
          <Card className="shadow border-0 h-100">
            <Card.Body>
              <h5>Platform Distribution</h5>
              <div style={{ height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "Bookings",
                          value: dashboardData.totalBookings,
                        },
                        { name: "Users", value: dashboardData.totalUsers },
                        {
                          name: "Revenue",
                          value: dashboardData.totalIncome / 100,
                        },
                      ]}
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                      label
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={index} fill={color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* User Growth */}
      <Row>
        <Col>
          <Card className="shadow border-0">
            <Card.Body>
              <h5>User Growth Trend</h5>
              <div style={{ height: 250 }}>
                <ResponsiveContainer>
                  <LineChart data={dashboardData.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#2196F3"
                      strokeWidth={2}
                      dot
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminHome;
