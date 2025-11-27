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

/**
 * @openapi
 * /api/v1/scrum/suggestions:
 *   post:
 *     summary: Generate AI suggestions from a PRD (PDF)
 *     tags:
 *       - Scrum
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               prdFile:
 *                 type: string
 *                 format: binary
 *                 description: The PRD PDF file to upload
 *               userPrompt:
 *                 type: string
 *                 description: User instructions to focus the ticket generation
 *     responses:
 *       200:
 *         description: AI-generated suggestions were created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: AI-generated suggestions retrieved successfully.
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request (no file provided)
 *       500:
 *         description: Server error generating suggestions
 */
router.post("/suggestions", upload.single("prdFile"), generateSuggestions);

/**
 * @openapi
 * /api/v1/scrum/pushSuggestionsToJira:
 *   post:
 *     summary: Push AI suggestions into Jira (Team-managed hierarchy)
 *     tags:
 *       - Scrum
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PushAISuggestionsRequest'
 *     responses:
 *       200:
 *         description: Issues created (partial success possible)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PushAISuggestionsResponse'
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Failed to push suggestions to Jira
 */
router.post("/pushSuggestionsToJira", pushAISuggestionsToJira);

/**
 * @openapi
 * /api/v1/scrum/chat:
 *   post:
 *     summary: Chat with the AI Scrum Master
 *     tags:
 *       - Scrum
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *     responses:
 *       200:
 *         description: Chat response
 */
import {
  chatWithScrumMaster,
  getDailyStandupReport,
  getSprintRetrospectiveReport,
} from "../controllers/scrum.controller.js";
router.post("/chat", chatWithScrumMaster);

/**
 * @openapi
 * /api/v1/scrum/standup:
 *   get:
 *     summary: Get Daily Standup Report
 *     tags:
 *       - Scrum
 *     parameters:
 *       - in: query
 *         name: projectKey
 *         required: true
 *         schema:
 *           type: string
 *         description: Jira Project Key
 *     responses:
 *       200:
 *         description: Daily Standup Report
 *       400:
 *         description: Missing project key
 */
router.get("/standup", getDailyStandupReport);

/**
 * @openapi
 * /api/v1/scrum/retrospective:
 *   get:
 *     summary: Get Sprint Retrospective Report
 *     tags:
 *       - Scrum
 *     parameters:
 *       - in: query
 *         name: sprintId
 *         required: true
 *         schema:
 *           type: string
 *         description: Jira Sprint ID
 *     responses:
 *       200:
 *         description: Sprint Retrospective Report
 *       400:
 *         description: Missing sprint ID
 */
router.get("/retrospective", getSprintRetrospectiveReport);

import { handleJiraWebhook } from "../controllers/webhook.controller.js";
router.post("/webhooks/jira", handleJiraWebhook);

export default router;
