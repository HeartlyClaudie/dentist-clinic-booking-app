// src/server.js
const app = require("./app");

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});
