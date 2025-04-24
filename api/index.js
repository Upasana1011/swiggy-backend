const app = require("./server");
const connect = require("../src/configs/db");

const port = process.env.PORT || 8000;

connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });

module.exports = async (req, res) => {
  return app(req, res);
};