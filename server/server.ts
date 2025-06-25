import express from 'express';
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const authRoutes = require("./routes/authRoutes");

app.use(cors());
app.use(bodyParser.json());
app.use("/api", authRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
