import React from "react";
import "./Loader.css"; // Add CSS for the loader

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      <p>Loading events...</p>
    </div>
  );
};

export default Loader;