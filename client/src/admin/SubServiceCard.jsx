// File: src/components/SubServiceCard.jsx
import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SubServiceCard = ({
  title = "Untitled Sub Service",
  description = "No description available.",
  price = 0,
  quantity = 0,
  onEdit = () => {},
  onDelete = () => {},
}) => {
  // Delete confirmation
  const handleDelete = () => {
    Swal.fire({
      title: "Delete Sub Service?",
      text: "This sub service will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e63946",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete();
        toast.success("Sub service deleted successfully!");
      }
    });
  };

  return (
    <Card
      className="shadow-lg border-0 rounded-4 overflow-hidden h-100"
      style={{
        transition: "all 0.3s ease-in-out",
        cursor: "pointer",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-6px)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <Card.Body className="d-flex flex-column justify-content-between p-4">
        {/* Header Row */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title
            className="fw-bold mb-0 text-dark"
            style={{ fontSize: "1.2rem" }}
          >
            {title}
          </Card.Title>
          <Badge
            bg="success"
            pill
            className="shadow-sm"
            style={{ fontSize: "0.9rem", padding: "0.5em 1em" }}
          >
            ₹{price}
          </Badge>
        </div>

        {/* Description */}
        <Card.Text
          className="text-muted flex-grow-1"
          style={{
            fontSize: "0.95rem",
            lineHeight: "1.5",
            minHeight: "60px",
          }}
        >
          {description
            ? description.length > 120
              ? description.substring(0, 120) + "..."
              : description
            : "No description available."}
        </Card.Text>

        {/* Quantity */}
        <div className="d-flex align-items-center justify-content-between mt-3">
          <span className="fw-semibold text-secondary">
            Quantity:{" "}
            <span
              className={`fw-bold ${
                quantity > 0 ? "text-success" : "text-danger"
              }`}
            >
              {quantity > 0 ? quantity : "Out of Stock"}
            </span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="d-flex justify-content-between mt-4 pt-2 border-top">
          <Button
            variant="outline-primary"
            size="sm"
            className="rounded-3 px-4"
            onClick={onEdit}
          >
            ✏ Edit
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            className="rounded-3 px-4"
            onClick={handleDelete}
          >
            🗑 Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SubServiceCard;
