import { PRDParserSchema } from "../../utils/schemas.js";
import { PdfReader } from "pdfreader";
import dotenv from "dotenv";
import { model } from "../ai/model.service.js";
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
    const scrumGuidelines =
      "Follow Scrum best practices when structuring Epics, Stories, and Tasks. An Epic represents a large business goal or initiative that may span multiple sprints and should be split into smaller, independent, value-delivering User Stories. Each Story should deliver a vertical slice of functionality that provides user or business value, can be completed within a single sprint, and follows the INVEST principles (Independent, Negotiable, Valuable, Estimable, Small, Testable). Split Epics by user journey steps, personas, data boundaries, or features—not by technical layers. Each Story must include clear and measurable acceptance criteria and be estimable in story points (1–13). Tasks represent the technical work required to implement a story and should be actionable, specific, and completable within a day or two. Split Stories into Tasks by technical responsibility, component, or discipline (e.g., frontend, backend, testing, design). Avoid horizontal or overlapping stories and ensure each issue has a clear purpose and outcome. If a story or task cannot be completed within a sprint, split it further. Always prefer delivering small, testable, vertical slices of value over large, cross-cutting chunks of work.";
    const structuredChain = model.withStructuredOutput(PRDParserSchema);
    console.log("Sending PRD to AI model for processing...");
    const fullPrompt = `You are a Senior Scrum Master and Agile Coach.
                        Analyze the following Product Requirements Document (PRD) and generate
                         a **hierarchical set of Jira issues** that strictly conforms to the schema provided by the system.
                        ---
                        ### Follow These Scrum Guidelines:
                        ${scrumGuidelines}
                        ---
                        ### 🧭 Output Structure Rules
                        1. Each **Epic** should contain related **Stories** in an array called "issues".
                        2. Each **Story** may contain related **Tasks/Subtasks** in an array called "sub_issues".
                        3. Each Task or Subtask should not exist outside its parent Story (unless it’s standalone).
                        4. If the PRD includes independent Stories or Tasks (not tied to an Epic), include them in "jira_issues" (flat list).
                        5. Maintain valid parent_ref links:
                          - Story.parent_ref = Epic.title
                          - Task.parent_ref = Story.summary
                          - Subtask.parent_ref = Task.summary
                        6. Use realistic story_points (1–13).
                        7. Only output valid JSON, no markdown or explanations.
                        ---
                        ### 💡 Hierarchy Example:
                        JSON:
                        {
                          "epics": [
                            {
                              "title": "User Authentication",
                              "description": "Implement secure login and signup.",
                              "issues": [
                                {
                                  "type": "Story",
                                  "summary": "As a user, I want to log in securely so that I can access my account.",
                                  "description": "Frontend and backend login implementation.",
                                  "story_points": 5,
                                  "parent_ref": "User Authentication",
                                  "sub_issues": [
                                    {
                                      "type": "Task",
                                      "summary": "Create login API endpoint",
                                      "description": "Implement backend login route in Express.js",
                                      "parent_ref": "As a user, I want to log in securely so that I can access my account."
                                    },
                                    {
                                      "type": "Task",
                                      "summary": "Design login page UI",
                                      "description": "Create responsive login form using React and Tailwind.",
                                      "parent_ref": "As a user, I want to log in securely so that I can access my account."
                                    }
                                  ]
                                }
                              ]
                            }
                          ],
                          "jira_issues": []
                        }
                        ### 🧾 PRD Input: ${prdText}`;
    const aiResponse = await structuredChain.invoke(fullPrompt);
    return aiResponse;
  } catch (error) {
    console.error("Error processing PRD:", error);
    throw new Error("Failed to generate structured suggestions from PRD.");
  }
};
