// client/src/Home.js
import React, { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    // Automatically redirect to backend which initiates Microsoft login
window.location.href = "https://letsdeepu.com:5000/login"
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Redirecting to Microsoft Login...</h2>
    </div>
  );
};

export default Home;
