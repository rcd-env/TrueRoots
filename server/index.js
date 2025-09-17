const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
require("dotenv").config();
const plantRouter = require("./routes/plant");

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Plant identification route
app.post("/api/plant-identify", plantRouter);

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
