import React from "react";

const NotFound = () => {
  return (
    <div>
      <h1 className="text-center mt-5">404 - Page Not Found</h1>
      <p className="text-center">
        The page you are looking for does not exist.
      </p>
      <div className="text-center">
        <a href="/" className="btn btn-primary">
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
