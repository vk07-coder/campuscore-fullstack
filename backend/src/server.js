const app = require("./app");
const { testConnection, initDB } = require("./config");

const PORT = process.env.PORT || 5000;

(async () => {
  await testConnection();
  await initDB();

  app.listen(PORT, () => {
    console.log(`\n🚀  CampusCore API running on http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/health\n`);
  });
})();
