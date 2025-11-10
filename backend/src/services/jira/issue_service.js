import { jiraClient } from "./jira_client.js";
/**
 * Creates a new Jira issue (Story/Task/Bug) from structured data.
 * @param {object} ticketData - The structured JSON fields object returned by the AI (Part 3).
 * @returns {Promise<object>} The created Jira issue object (contains id, key, and self link).
 */
export const createTicket = async (ticketData) => {
  try {
    // client.issues.createIssue maps to the POST /rest/api/3/issue endpoint.
    const newIssue = await jiraClient.issues.createIssue({
      fields: ticketData,
    });
    console.log(`Successfully created Jira Issue: ${newIssue.key}`);
    return newIssue;
  } catch (error) {
    console.error(
      "Error creating Jira ticket:",
      error.response?.data || error.message
    );
    throw new Error("Failed to create ticket in Jira.");
  }
};

/**
 * Updates an existing Jira issue with new field data.
 * @param {string} issueIdOrKey - The Jira key or ID (e.g., 'PROJ-123').
 * @param {object} fieldsToUpdate - Object containing fields to modify.
 */
export const updateTicket = async (issueIdOrKey, fieldsToUpdate) => {
  try {
    // client.issues.editIssue maps to the PUT /rest/api/3/issue/{issueIdOrKey} endpoint.
    await jiraClient.issues.editIssue({
      issueIdOrKey: issueIdOrKey,
      fields: fieldsToUpdate,
    });
    console.log(`Successfully updated Jira Issue: ${issueIdOrKey}`);
  } catch (error) {
    console.error(
      `Error updating Jira issue ${issueIdOrKey}:`,
      error.response?.data || error.message
    );
    throw new Error("Failed to update ticket in Jira.");
  }
};

/**
 * Executes a JQL query to retrieve a list of issues (used for Indexing, Spillover, etc.).
 * @param {string} jqlString - The Jira Query Language string.
 * @returns {Promise<object[]>} An array of issue objects.
 */
export const search = async (jqlString) => {
  try {
    // client.issueSearch.searchForIssuesUsingJql provides the JQL flexibility.
    const response = await jiraClient.issueSearch.searchForIssuesUsingJql({
      jql: jqlString,
      // Common fields + Story Points (often customfield_10002)
      fields: [
        "summary",
        "description",
        "status",
        "project",
        "issuetype",
        "customfield_10002",
      ],
    });
    return response.issues;
  } catch (error) {
    console.error(
      "Error searching Jira issues with JQL:",
      error.response?.data || error.message
    );
    throw new Error("Failed to search issues in Jira.");
  }
};
