import { model } from "./model.service.js";
import { queryKnowledgeBase } from "./rag.service.js";

export const chatWithAI = async (userQuery) => {
  try {
    // 1. Retrieve relevant context from ChromaDB
    const contextDocs = await queryKnowledgeBase(userQuery, 5);
    const contextText = contextDocs
      .map((doc) => `[${doc.metadata.type.toUpperCase()}] ${doc.content}`)
      .join("\n\n");

    // 2. Construct Prompt
    const prompt = `You are an AI Scrum Assistant for the project.
You have access to the following project context (Jira tickets, Sprints, PRDs):

---
${contextText}
---

User Query: ${userQuery}

Answer the user's query based strictly on the provided context. If the answer is not in the context, say "I don't have enough information to answer that."
if user want to interact formally like 'hi how are you'you reply for that formally
Keep answers concise and helpful for a Scrum team.`;

    // 3. Generate Response
    const response = await model.invoke(prompt);

    return response.content;
  } catch (error) {
    console.error("Error in chatWithAI:", error);
    throw new Error("Failed to process chat query.");
  }
};
