import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");
    const savedToken = localStorage.getItem("access_token");

    const finalToken = tokenFromUrl || savedToken;

    if (finalToken) {
      setToken(finalToken);

      // Store in localStorage if it's new
      if (tokenFromUrl) {
        localStorage.setItem("access_token", tokenFromUrl);
      }

      // Fetch user info from Microsoft Graph API
      axios
        .get("https://graph.microsoft.com/v1.0/me", {
          headers: {
            Authorization: `Bearer ${finalToken}`,
          },
        })
        .then((res) => setUser(res.data))
        .catch((err) => {
          console.error("Failed to fetch user info:", err);
          setUser(null);
        });
    } else {
      // No token found, redirect to login
      window.location.href = "https://letsdeepu.com:5000/login";
    }
  }, [location.search]);

const handleLogout = () => {
  localStorage.removeItem("access_token");

  // Redirect to Microsoft logout first, then back to login
  window.location.href =
    "https://login.microsoftonline.com/dbf95752-7405-4abf-90e4-eedb731e53bd/oauth2/v2.0/logout" +
    "?post_logout_redirect_uri=https://letsdeepu.com:5000/login";
};


  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h1>Welcome {user ? user.displayName : "..."}</h1>
      <p>
        <strong>Email:</strong>{" "}
        {user ? user.mail || user.userPrincipalName : "Loading..."}
      </p>
      <p>
        <strong>Access Token:</strong>{" "}
        {token ? token.slice(0, 30) + "..." : "Not available"}
      </p>
      <button
        onClick={handleLogout}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
