import { z } from "zod";

const JiraIssueTypeEnum = z.enum(["Epic", "Story", "Task", "Subtask", "Bug"]);

const JiraIssueSchema = z.object({
  type: JiraIssueTypeEnum.describe(
    "Type of Jira issue (Epic, Story, Task, etc.)"
  ),

  summary: z
    .string()
    .min(5)
    .describe("Short, descriptive title of the Jira issue."),

  description: z
    .string()
    .min(10)
    .describe(
      "Detailed description, including purpose, details, and acceptance criteria."
    ),

  priority: z
    .enum(["Highest", "High", "Medium", "Low", "Lowest"])
    .optional()
    .default("Medium")
    .describe("Priority level as recognized by Jira."),

  assignee: z
    .string()
    .optional()
    .describe("Email or account ID of the user to assign the issue to."),

  labels: z
    .array(z.string())
    .optional()
    .describe("Optional tags for grouping or filtering issues."),

  parent: z
    .string()
    .optional()
    .describe("If this is a subtask, provide the parent issue key."),

  epic_name: z
    .string()
    .optional()
    .describe(
      "Used only when creating an Epic (required in some Jira configs)."
    ),

  story_points: z
    .number()
    .optional()
    .describe("Story point estimate for Scrum boards."),

  acceptance_criteria: z
    .array(z.string())
    .optional()
    .describe("List of measurable conditions for completion."),
});

export const PRDParserSchema = z.object({
  project_key: z
    .string()
    .describe(
      "The Jira project key where issues will be created, e.g., 'AI' or 'PROJ'."
    ),

  project_title: z
    .string()
    .describe("The main project or feature title derived from the PRD."),

  epics: z
    .array(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        issues: z.array(JiraIssueSchema).optional(),
      })
    )
    .optional()
    .describe("Top-level features (Epics) containing related Stories/Tasks."),

  jira_issues: z
    .array(JiraIssueSchema)
    .describe(
      "A flat list of generated Jira issues if no epic hierarchy is needed."
    ),
});
