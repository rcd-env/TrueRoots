import express from "express";
import multer from "multer";
import axios from "axios";
import { config } from "dotenv";
config();

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// Identify plant from an image
// Accepts ONLY: multipart/form-data with field: image (file)
router.post(
  "/",
  upload.single("image"),
  async (req: express.Request, res: express.Response) => {
    try {
      const apiKey = process.env.PLANT_ID_API_KEY;
      if (!apiKey) {
        return res
          .status(500)
          .json({ error: "PLANT_ID_API_KEY not configured" });
      }

      if (!req.file || !req.file.buffer) {
        return res.status(400).json({
          error:
            "Upload an image file via multipart/form-data with field name 'image'",
        });
      }
      const mime = req.file.mimetype || "image/jpeg";
      if (!/^image\//.test(mime)) {
        return res
          .status(400)
          .json({ error: "Only image files are supported" });
      }
      const b64 = req.file.buffer.toString("base64");
      const dataUri = `data:${mime};base64,${b64}`;

      const payload = {
        images: [dataUri],
        modifiers: ["crops_fast", "similar_images"],
        plant_language: "en",
        plant_details: [
          "common_names",
          "url",
          "name_authority",
          "wiki_description",
          "taxonomy",
        ],
      };

      const response = await axios.post(
        "https://api.plant.id/v2/identify",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Api-Key": process.env.PLANT_ID_API_KEY || "",
          },
          timeout: 25_000,
        }
      );

      // Transform response to match frontend expectations
      if (
        response.data &&
        response.data.suggestions &&
        response.data.suggestions.length > 0
      ) {
        const topSuggestion = response.data.suggestions[0];
        const scientificName = topSuggestion.plant_name;
        const confidence = topSuggestion.probability;

        return res.json({
          scientificName,
          confidence,
          commonNames: topSuggestion.plant_details?.common_names || [],
          fullResponse: response.data,
        });
      } else {
        return res.status(404).json({ error: "No plant identification found" });
      }
    } catch (err: any) {
      const status = err?.response?.status || 500;
      const data = err?.response?.data || {
        error: err?.message || "PlantID request failed",
      };
      return res.status(status).json(data);
    }
  }
);

export default router;
