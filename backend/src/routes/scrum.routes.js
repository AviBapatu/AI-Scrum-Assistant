import express from "express";
import multer from "multer";
import {
  generateSuggestions,
  pushAISuggestionsToJira,
} from "../controllers/scrum.controller.js";

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

const router = express.Router();

router.post("/suggestions", upload.single("prdFile"), generateSuggestions);
router.post("/pushSuggestionsToJira", pushAISuggestionsToJira);

export default router;
