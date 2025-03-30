import React, { useState, useEffect } from "react";

const DynamicBackground = () => {
  const [color, setColor] = useState("#ff416c");

  useEffect(() => {
    const colors = ["#ff416c", "#ff4b2b", "#1e90ff", "#32cd32", "#ff8c00"];
    let index = 0;

    const interval = setInterval(() => {
      setColor(colors[index]);
      index = (index + 1) % colors.length;
    }, 2000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: color,
        transition: "background-color 1s ease",
      }}
    />
  );
};

export default DynamicBackground;