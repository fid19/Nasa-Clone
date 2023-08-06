const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const { mongoConnect } = require("./services/mongo");

const app = require("./app");
const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchData } = require("./models/launches.model");

const PORT = process.env.PORT || 8000;

const server = http.createServer(
  {
    key: fs.readFileSync(require.resolve("./key.pem")),
    cert: fs.readFileSync(require.resolve("./cert.pem")),
  },
  app
);

async function startServer() {
  await mongoConnect();

  await loadPlanetsData();

  await loadLaunchData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

startServer();
