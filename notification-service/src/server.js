// src/server.js
const app = require('./app');
const PORT = process.env.PORT || 3004;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Notification service running on port ${PORT}`);
});
