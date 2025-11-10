import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PRDParserSchema } from "../../utils/schemas.js";
import { PdfReader } from "pdfreader";
import dotenv from "dotenv";
dotenv.config();

const extractTextFromPdfBuffer = (pdfBuffer) => {
  return new Promise((resolve, reject) => {
    let fullText = "";
    try {
      new PdfReader().parseBuffer(pdfBuffer, (err, item) => {
        if (err) {
          reject(err);
        } else if (!item) {
          // End of buffer
          resolve(fullText.trim());
        } else if (item.text) {
          fullText += item.text + " ";
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const getSuggestionsFromPRD = async (prdBuffer) => {
  try {
    // Extract text
    const prdText = await extractTextFromPdfBuffer(prdBuffer);

    if (!prdText || prdText.length < 20) {
      console.warn(
        " No text found in uploaded PRD. Check if it's a scanned or image-based PDF."
      );
      throw new Error(
        "Could not extract text from PRD file. Please upload a text-based PDF."
      );
    }

    console.log(`Extracted PRD text length: ${prdText.length} characters`);

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing GOOGLE_API_KEY in environment variables.");
      }
      console.log(": Using Gemini API Key:", process.env.GEMINI_API_KEY.slice(0, 5) + "****");
      const model = new ChatGoogleGenerativeAI({
        apiKey: process.env.GEMINI_API_KEY,
        model: "gemini-2.0-flash",
        temperature: 0.4,
      });

      const structuredChain = model.withStructuredOutput(PRDParserSchema);
      console.log("Sending PRD to AI model for processing...");
      const fullPrompt = `You are a Senior Scrum Master. Analyze the following PRD and convert it into structured Jira stories and tasks. Return JSON only.\n\nPRD:\n${prdText}`;
    const aiResponse = await structuredChain.invoke(fullPrompt);

    return aiResponse;
  } catch (error) {
    console.error("Error processing PRD:", error);
    throw new Error("Failed to generate structured suggestions from PRD.");
  }
};
