import express from "express";
import cors from "cors";
import { config } from "dotenv";
import plantRouter from "./routes/plant.route";
import paymentRouter from "./routes/payment.route";

config();

// Global BigInt JSON serialization fix - comprehensive approach
(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

// Override JSON.stringify to handle BigInt safely
const originalStringify = JSON.stringify;
JSON.stringify = function (value: any, replacer?: any, space?: any) {
  return originalStringify(
    value,
    (key, val) => {
      if (typeof val === "bigint") {
        return Number(val);
      }
      if (replacer) {
        return replacer(key, val);
      }
      return val;
    },
    space
  );
};

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/plant-identify", plantRouter);
app.use("/api/payments", paymentRouter);

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
