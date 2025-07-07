const fs = require("fs");
const https = require("https");
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const qs = require("querystring");
require("dotenv").config();

const app = express();
app.use(cors());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TENANT_ID = process.env.TENANT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;
const FRONTEND_URL = process.env.FRONTEND_URL;

const AUTHORITY = `https://login.microsoftonline.com/${TENANT_ID}`;
const AUTHORIZE_ENDPOINT = `${AUTHORITY}/oauth2/v2.0/authorize`;
const TOKEN_ENDPOINT = `${AUTHORITY}/oauth2/v2.0/token`;

// Microsoft Login Start
app.get("/login", (req, res) => {
  const params = {
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    response_mode: "query",
    scope: "https://graph.microsoft.com/User.Read",
  };
  const authUrl = `${AUTHORIZE_ENDPOINT}?${qs.stringify(params)}`;
  res.redirect(authUrl);
});


// Callback from Microsoft
app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;
  try {
    const tokenRes = await axios.post(
      TOKEN_ENDPOINT,
      qs.stringify({
        client_id: CLIENT_ID,
        scope: "https://graph.microsoft.com/User.Read",
        code,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
        client_secret: CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = tokenRes.data;
    return res.redirect(`${FRONTEND_URL}/dashboard?token=${access_token}`);
  } catch (err) {
    console.error("Token Error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    });
    res.status(500).send("Failed to get token");
  }
});

// Logout
app.get("/logout", (req, res) => {
  const logoutUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/logout?post_logout_redirect_uri=${FRONTEND_URL}`;
  res.redirect(logoutUrl);
});

// HTTPS SSL setup
const httpsOptions = {
  key: fs.readFileSync("letsdeepu.com-key.pem"),
  cert: fs.readFileSync("letsdeepu.com.pem"),
};

https.createServer(httpsOptions, app).listen(5000, '0.0.0.0', () => {
  console.log("✅ Server started securely on https://letsdeepu.com:5000");
});

console.log("✅ Loaded CLIENT_SECRET:", CLIENT_SECRET);
