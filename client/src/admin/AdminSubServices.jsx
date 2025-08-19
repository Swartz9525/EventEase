// File: src/admin/AdminSubServices.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Spinner,
  Modal,
  Button,
  Form,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiLayers } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SubServiceCard from "./SubServiceCard";

const AdminSubServices = () => {
  const [subServices, setSubServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Edit modal state
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({
    _id: "",
    title: "",
    description: "",
    price: "",
    quantity: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSubServices();
  }, []);

  // Fetch all sub services
  const fetchSubServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/subservices");
      setSubServices(res.data);
      setError("");
    } catch {
      setError("Failed to load sub services. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete sub service
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/subservices/${id}`);
      toast.success("Sub service deleted successfully");
      fetchSubServices();
    } catch {
      toast.error("Failed to delete sub service");
    }
  };

  // Open edit modal
  const handleEdit = (service) => {
    setEditData(service);
    setShowEdit(true);
    setError("");
  };

  // Save edited sub service
  const saveEdit = async () => {
    try {
      setUploading(true);
      setError("");

      if (
        !editData.title ||
        !editData.description ||
        !editData.price ||
        !editData.quantity
      ) {
        setError("Please fill all required fields");
        return;
      }

      const updatedService = {
        title: editData.title,
        description: editData.description,
        price: editData.price,
        quantity: editData.quantity,
      };

      await axios.put(
        `http://localhost:5000/api/subservices/${editData._id}`,
        updatedService
      );

      toast.success("Sub service updated successfully");
      setShowEdit(false);
      fetchSubServices();
    } catch (err) {
      toast.error(
        err.response?.data?.error || err.message || "Error updating sub service"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-sub-services-container">
      <Container className="py-4">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
          <div>
            <h2 className="mb-1 fw-bold text-dark">Sub Services Management</h2>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate("/add-services")}
            className="d-flex align-items-center"
          >
            <FiPlus className="me-2" />
            Add Sub Service
          </Button>
        </div>

        {/* Error */}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading sub services...</p>
          </div>
        ) : subServices.length === 0 ? (
          <div className="empty-state text-center">
            <FiLayers size={48} className="text-primary mb-3" />
            <h5 className="text-muted mb-3">No sub services yet</h5>
            <Button
              variant="outline-primary"
              onClick={() => navigate("/add-services")}
            >
              <FiPlus className="me-2" /> Create First Sub Service
            </Button>
          </div>
        ) : (
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {subServices.map((service) => (
              <Col key={service._id}>
                <SubServiceCard
                  title={service.title}
                  description={service.description}
                  price={service.price}
                  quantity={service.quantity}
                  onEdit={() => handleEdit(service)}
                  onDelete={() => handleDelete(service._id)}
                />
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Edit Modal */}
      <Modal
        show={showEdit}
        onHide={() => setShowEdit(false)}
        centered
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Sub Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price (₹)</Form.Label>
              <Form.Control
                type="number"
                value={editData.price}
                onChange={(e) =>
                  setEditData({ ...editData, price: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={editData.quantity}
                onChange={(e) =>
                  setEditData({ ...editData, quantity: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowEdit(false)}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={saveEdit} disabled={uploading}>
            {uploading ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminSubServices;
