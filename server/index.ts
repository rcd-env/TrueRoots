import express from "express";
import cors from "cors";
import { config } from "dotenv";
import plantRouter from "./routes/plant.route";

config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/plant-identify", plantRouter);

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
