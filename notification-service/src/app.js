// src/app.js
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("./logger");

const app = express();
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  logger.info("Health check - Notification Service is up");
  res.send("Notification Service is up");
});

app.post("/notify", (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    logger.warn("Notification request missing userId or message");
    return res.status(400).json({ error: "Missing userId or message" });
  }

  logger.info(`📨 Notification sent to User ${userId}: ${message}`);
  res.status(200).json({
    success: true,
    message: `Notification sent to user ${userId}`,
    delivered: true
  });
});

module.exports = app;
