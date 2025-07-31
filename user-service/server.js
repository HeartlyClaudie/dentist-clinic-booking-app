const app = require('./app');
const sequelize = require('./sequelize');

// Sync DB before starting the server
sequelize.sync().then(() => {
  console.log("Database synced. Starting server...");
  app.listen(3000, () => {
    console.log("User service running on port 3000");
  });
}).catch((err) => {
  console.error("Failed to sync database:", err);
});
