// File: src/components/ServiceCard.jsx
import React from "react";
import { Card, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ServiceCard = ({
  image = "https://via.placeholder.com/300x200?text=No+Image",
  name = "Untitled Service",
  description = "No description available.",
  onEdit = () => {},
  onDelete = () => {},
}) => {
  // Delete confirmation
  const handleDelete = () => {
    Swal.fire({
      title: "Delete Service?",
      text: "This service will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete();
        toast.success("Service deleted successfully!");
      }
    });
  };

  // Edit notification
  const handleEdit = () => {
    onEdit();
    toast.info("Edit mode opened.");
  };

  return (
    <Card
      className="shadow-lg border-0 rounded-4 overflow-hidden h-100"
      style={{ transition: "transform 0.2s" }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {/* Image Section */}
      <div style={{ overflow: "hidden", height: "200px" }}>
        <Card.Img
          src={image || "https://via.placeholder.com/300x200?text=No+Image"}
          alt={name || "Service Image"}
          className="w-100"
          style={{
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      </div>

      {/* Body Section */}
      <Card.Body className="d-flex flex-column justify-content-between">
        {/* Title */}
        <Card.Title className="fw-bold mb-2" style={{ fontSize: "1.1rem" }}>
          {name || "Untitled Service"}
        </Card.Title>

        {/* Description */}
        <Card.Text className="text-muted" style={{ fontSize: "0.9rem" }}>
          {description
            ? description.length > 80
              ? description.substring(0, 80) + "..."
              : description
            : "No description available."}
        </Card.Text>

        {/* Action Buttons */}
        <div className="d-flex justify-content-between mt-auto pt-3">
          <Button variant="outline-warning" size="sm" onClick={handleEdit}>
            ✏ Edit
          </Button>
          <Button variant="outline-danger" size="sm" onClick={handleDelete}>
            🗑 Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ServiceCard;
