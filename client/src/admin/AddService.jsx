import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddService = () => {
  const [type, setType] = useState("service"); // default: service

  const [formData, setFormData] = useState({
    // Service
    name: "",
    description: "",
    image: null,
    // SubService
    title: "",
    descriptionSub: "",
    priceSub: "",
    quantity: "",
  });

  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const CLOUDINARY_URL =
    "https://api.cloudinary.com/v1_1/dhavqcgxt/image/upload";
  const UPLOAD_PRESET = "EventEase";

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      if (type === "service") {
        // Service requires image
        if (!formData.image) {
          Swal.fire("Error", "Please upload an image", "error");
          setUploading(false);
          return;
        }

        // Upload to Cloudinary
        const formImg = new FormData();
        formImg.append("file", formData.image);
        formImg.append("upload_preset", UPLOAD_PRESET);

        const cloudRes = await axios.post(CLOUDINARY_URL, formImg);
        const imageUrl = cloudRes.data.secure_url || cloudRes.data.url;

        if (!imageUrl)
          throw new Error("Cloudinary did not return an image URL");

        // Save Service (✅ no price)
        await axios.post("http://localhost:5000/api/services", {
          name: formData.name,
          description: formData.description,
          image: imageUrl,
        });
      } else {
        // Save SubService (✅ schema fields aligned)
        await axios.post("http://localhost:5000/api/subservices", {
          title: formData.title,
          description: formData.descriptionSub,
          price: formData.priceSub,
          quantity: formData.quantity,
        });
      }

      Swal.fire(
        "Success",
        `${type === "service" ? "Service" : "SubService"} added successfully!`,
        "success"
      );
      toast.success(
        `${type === "service" ? "Service" : "SubService"} added successfully!`
      );

      // Reset form
      setFormData({
        name: "",
        description: "",
        image: null,
        title: "",
        descriptionSub: "",
        priceSub: "",
        quantity: "",
      });
      setPreviewUrl("");
    } catch (error) {
      console.error("Error adding:", error.response?.data || error.message);
      Swal.fire(
        "Error",
        "Something went wrong. Check console for details.",
        "error"
      );
      toast.error("Error adding data.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container className="my-4">
      <ToastContainer />
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4 shadow-lg">
            <h3 className="text-center mb-4">
              Add New {type === "service" ? "Service" : "SubService"}
            </h3>

            {/* Choose type */}
            <Form.Group className="mb-3">
              <Form.Label>Select Type</Form.Label>
              <Form.Select
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="service">Service</option>
                <option value="subservice">SubService</option>
              </Form.Select>
            </Form.Group>

            <Form onSubmit={handleSubmit}>
              {type === "service" ? (
                <>
                  {/* Service form */}
                  <Form.Group className="mb-3">
                    <Form.Label>Service Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter service name"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter description"
                      rows={3}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Upload Image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                    />
                  </Form.Group>

                  {previewUrl && (
                    <div className="text-center mb-3">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        style={{ width: "200px", borderRadius: "8px" }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* SubService form */}
                  <Form.Group className="mb-3">
                    <Form.Label>SubService Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter subservice title"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="descriptionSub"
                      value={formData.descriptionSub}
                      onChange={handleChange}
                      placeholder="Enter description"
                      rows={3}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      name="priceSub"
                      value={formData.priceSub}
                      onChange={handleChange}
                      placeholder="Enter price"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="Enter quantity"
                      required
                    />
                  </Form.Group>
                </>
              )}

              <Button
                type="submit"
                className="w-100"
                disabled={uploading}
                variant="primary"
              >
                {uploading
                  ? "Saving..."
                  : `Add ${type === "service" ? "Service" : "SubService"}`}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddService;
