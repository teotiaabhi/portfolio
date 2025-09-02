// src/components/ui/Tabs.jsx
import React, { useState } from "react";

export const Tabs = ({ value, onChange, children, className }) => {
  return <div className={className}>{children}</div>;
};

export const TabsList = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

export const TabsTrigger = ({ value, onClick, children, className }) => {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children }) => {
  return <div>{children}</div>;
};
