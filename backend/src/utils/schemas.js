// utils/schemas.js
import { z } from "zod";

// Define the schema for a single Jira Story/Task
const JiraIssueSchema = z.object({
  type: z.enum(["Story", "Task", "Bug"]), // e.g., Story, Task, Bug
  summary: z.string().describe("A concise title for the Jira issue."),
  description: z
    .string()
    .describe(
      "Detailed description outlining the goal and acceptance criteria (if a Story)."
    ),
  priority: z.enum(["High", "Medium", "Low"]).describe("Priority level."),
  // Optional: You could add fields like 'epic', 'estimated_points', etc.
});

// Define the main schema for the entire output
export const PRDParserSchema = z
  .object({
    project_title: z
      .string()
      .describe("The main project title derived from the PRD."),
    jira_issues: z
      .array(JiraIssueSchema)
      .describe("A list of generated Jira Stories and Tasks."),
  })
  .describe(
    "The structured output containing parsed PRD information converted into Jira issues."
  );
