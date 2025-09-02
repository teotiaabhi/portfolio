import React from "react";

const Button = ({ children, className = "", ...props }) => {
  return (
    <button
  className={`px-4 py-2 rounded bg-neutral-900 text-white hover:bg-neutral-800 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };
