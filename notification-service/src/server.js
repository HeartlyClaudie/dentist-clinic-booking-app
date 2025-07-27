//server.js
const app = require('./index');
const PORT = process.env.PORT || 3004;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`User service is running on port ${PORT}`);
});
