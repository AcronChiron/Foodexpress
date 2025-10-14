require("dotenv").config();
const http = require("http");
const app = require("./app");
const { connect: connectDb } = require("./config/db");

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectDb();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(
      "Warning: database connection failed. Starting server without DB."
    );
  }

  const server = http.createServer(app);
  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${PORT}`);
  });
  return server;
}

module.exports = start();
