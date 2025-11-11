import { getSuggestionsFromPRD } from "../services/ai/prdToTickets.service.js";

export const generateSuggestions = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PRD file uploaded." });
    }

    const prdBuffer = req.file.buffer;
    const aiSuggestions = await getSuggestionsFromPRD(prdBuffer);

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
