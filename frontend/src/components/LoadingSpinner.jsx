import React from "react";
import { ClipLoader, FadeLoader, PulseLoader, RingLoader } from "react-spinners";
import './LoadingSpinner.css'

const LoadingSpinner = () => {
  return (
    <div className="loader-container">
     <PulseLoader />
    </div>
  );
};

export default LoadingSpinner;
