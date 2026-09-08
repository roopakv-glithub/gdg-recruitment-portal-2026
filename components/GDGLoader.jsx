import React from "react";

const DWASFWLoader = () => {
  return (
    <div className="corner-loader" role="status" aria-live="polite" aria-label="Loading">
      <span className="corner-loader-dot corner-loader-blue" />
      <span className="corner-loader-dot corner-loader-red" />
      <span className="corner-loader-dot corner-loader-yellow" />
      <span className="corner-loader-dot corner-loader-green" />
      <span className="sr-only">Loading</span>
    </div>
  );
};

export default DWASFWLoader;
