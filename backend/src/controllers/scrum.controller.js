import { getSuggestionsFromPRD } from "../services/ai/prdToTickets.service.js";
import { PushAISuggestionsBodySchema } from "../utils/schemas.js";
import { pushAISuggestionsHierarchy } from "../services/jira/transformers/hierarchy.service.js";

export const generateSuggestions = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PRD file uploaded." });
    }

    const prdBuffer = req.file.buffer;
    const userPrompt = req.body.userPrompt || "";
    const aiSuggestions = await getSuggestionsFromPRD(prdBuffer, userPrompt);

    return res.status(200).json({
      success: true,
      message: "AI-generated suggestions retrieved successfully.",
      data: aiSuggestions,
    });
  } catch (error) {
    console.error("Error generating suggestions:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate suggestions.",
    });
  }
};

export const pushAISuggestionsToJira = async (req, res) => {
  try {
    const parsed = PushAISuggestionsBodySchema.parse(req.body);
    const { projectKey, suggestions } = parsed;

    const result = await pushAISuggestionsHierarchy({
      projectKey,
      suggestions,
    });

    return res.status(200).json({
      success: result.success,
      created: result.created,
      errors: result.errors,
    });
  } catch (error) {
    const zodIssues = error?.issues || error?.errors;
    if (zodIssues) {
      return res.status(400).json({
        success: false,
        error: "Invalid request body",
        details: zodIssues,
      });
    }
    console.error("Error pushing AI suggestions to Jira:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to push AI suggestions to Jira.",
    });
  }
};
