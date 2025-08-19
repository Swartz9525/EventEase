// File: src/admin/AdminServices.jsx
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
import { FiPlus, FiCalendar } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ServiceCard from "./ServiceCard";

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Cloudinary env vars (Vite style)
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // Edit modal state
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({
    _id: "",
    name: "",
    description: "",
    image: "",
    imageFile: null,
  });
  const [previewImage, setPreviewImage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  // Fetch all services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/services");
      setServices(res.data);
      setError("");
    } catch {
      setError("Failed to load services. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete service
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/services/${id}`);
      toast.success("Service deleted successfully");
      fetchServices();
    } catch {
      toast.error("Failed to delete service");
    }
  };

  // Open edit modal
  const handleEdit = (service) => {
    setEditData({ ...service, imageFile: null });
    setPreviewImage(service.image);
    setShowEdit(true);
    setError("");
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size should be less than 2MB");
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      setEditData((prev) => ({ ...prev, imageFile: file }));
    }
  };

  // Save edited service
  const saveEdit = async () => {
    try {
      setUploading(true);
      setError("");

      if (!editData.name || !editData.description) {
        setError("Please fill all required fields");
        return;
      }

      let imageUrl = editData.image;

      // Upload new image if selected
      if (editData.imageFile) {
        if (!CLOUD_NAME || !UPLOAD_PRESET) {
          throw new Error("Cloudinary environment variables are missing");
        }

        const formData = new FormData();
        formData.append("file", editData.imageFile);
        formData.append("upload_preset", UPLOAD_PRESET);

        const cloudinaryRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          formData
        );

        if (!cloudinaryRes.data.secure_url) {
          throw new Error("Failed to upload image to Cloudinary");
        }
        imageUrl = cloudinaryRes.data.secure_url;
      }

      const updatedService = {
        name: editData.name,
        description: editData.description,
        image: imageUrl,
      };

      const { data: updated } = await axios.put(
        `http://localhost:5000/api/services/${editData._id}`,
        updatedService
      );

      toast.success("Service updated successfully");

      setServices((prev) =>
        prev.map((s) => (s._id === updated._id ? updated : s))
      );

      setShowEdit(false);
      setEditData({
        _id: "",
        name: "",
        description: "",
        image: "",
        imageFile: null,
      });
      setPreviewImage("");
    } catch (err) {
      toast.error(
        err.response?.data?.error || err.message || "Error updating service"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-services-container">
      <Container className="py-4">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
          <div>
            <h2 className="mb-1 fw-bold text-dark">
              Event Services Management
            </h2>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate("/add-services")}
            className="d-flex align-items-center"
          >
            <FiPlus className="me-2" />
            Add Service
          </Button>
        </div>

        {/* Error */}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading event services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="empty-state text-center">
            <FiCalendar size={48} className="text-primary mb-3" />
            <h5 className="text-muted mb-3">No event services yet</h5>
            <Button
              variant="outline-primary"
              onClick={() => navigate("/add-services")}
            >
              <FiPlus className="me-2" /> Create First Service
            </Button>
          </div>
        ) : (
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {services.map((service) => (
              <Col key={service._id}>
                <ServiceCard
                  image={service.image}
                  name={service.name}
                  description={service.description}
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
          <Modal.Title>Edit Event Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Service Name</Form.Label>
              <Form.Control
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
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
            <Form.Group>
              <Form.Label>Service Image</Form.Label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleImageChange}
              />
              {previewImage && (
                <div className="mt-3">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="img-fluid rounded"
                  />
                </div>
              )}
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

export default AdminServices;
