import { Version3Client } from "jira.js";
import "dotenv/config";

if (
  !process.env.JIRA_HOST ||
  !process.env.JIRA_EMAIL ||
  !process.env.JIRA_API_TOKEN
) {
  console.error(
    "JIRA_HOST, JIRA_EMAIL, and JIRA_API_TOKEN must be set in the .env file."
  );

}

export const jiraClient = new Version3Client({
  host: process.env.JIRA_HOST,
  authentication: {
    basic: {
      email: process.env.JIRA_EMAIL,
      apiToken: process.env.JIRA_API_TOKEN,
    },
  },
});
