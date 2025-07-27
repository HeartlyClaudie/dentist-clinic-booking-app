// src/app.js
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Health check
app.get("/", (req, res) => {
  res.send("Notification Service is up");
});

// POST /notify endpoint
app.post("/notify", (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: "Missing userId or message" });
  }

  // Simulate sending a notification (email/SMS)
  console.log(`📨 Notification sent to User ${userId}: ${message}`);

  res.status(200).json({ success: true, message: `Notification sent to user ${userId}` });
});

module.exports = app;
