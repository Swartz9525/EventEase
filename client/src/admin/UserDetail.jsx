import React, { useEffect, useState } from "react";
import { Container, Table, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

// ✅ use import.meta.env instead of process.env
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const UserDetail = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/users`);
      setUsers(data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p>Loading users...</p>
      </div>
    );

  if (error)
    return (
      <Alert variant="danger" className="mt-3">
        {error}
      </Alert>
    );

  if (!users.length)
    return (
      <Alert variant="info" className="mt-3">
        No users found.
      </Alert>
    );

  return (
    <Container>
      <h4 className="mb-4">All Users</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>
                {user.firstName} {user.lastName}
              </td>
              <td>{user.email}</td>
              <td>{user.mobile}</td>
              <td>{user.role || "User"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default UserDetail;
