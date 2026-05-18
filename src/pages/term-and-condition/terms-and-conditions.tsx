import React from "react";

const TermsPage = () => {

  const openPdf = () => {
    window.location.href = "/terms-and-conditions.pdf";
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#111",
        flexDirection: "column",
        color: "#fff",
      }}
    >
      <h2>Terms & Conditions</h2>

      <button
        onClick={openPdf}
        style={{
          padding: "12px 20px",
          background: "#d5ff2e",
          border: "none",
          borderRadius: "6px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Open PDF
      </button>
    </div>
  );
};

export default TermsPage;