import { jiraClient } from "./jira_client.js";
import { search } from "./issue_service.js"; // Import search for spillover JQL

// --- METRIC-SPECIFIC FUNCTIONS (Part 2, Section C) ---

/**
 * Retrieves all issues currently in a project's backlog.
 * @param {number} boardId - The ID of the Jira Agile Board.
 * @returns {Promise<object[]>} An array of issue objects.
 */
export const getBacklogIssues = async (boardId) => {
  try {
    const response = await jiraClient.agile.getIssuesForBacklog({ boardId });
    return response.issues;
  } catch (error) {
    console.error(
      "Error fetching backlog issues:",
      error.response?.data || error.message
    );
    throw new Error(
      "Failed to retrieve backlog issues. Check board ID and permissions."
    );
  }
};

/**
 * Finds the currently active sprint for a given board.
 * @param {number} boardId - The ID of the Jira Agile Board.
 * @returns {Promise<object|null>} The active sprint object or null.
 */
export const getActiveSprint = async (boardId) => {
  try {
    const response = await jiraClient.agile.getSprints({
      boardId,
      state: "active",
    });
    // Jira returns an array in 'values', take the first one if it exists
    return response.values?.[0] || null;
  } catch (error) {
    console.error(
      "Error finding active sprint:",
      error.response?.data || error.message
    );
    return null; // Return null gracefully
  }
};

/**
 * Fetches the last 'sprintCount' number of closed sprints for velocity calculation.
 * @param {number} boardId - The ID of the Jira Agile Board.
 * @param {number} sprintCount - The number of closed sprints to retrieve.
 * @returns {Promise<object[]>} An array of closed sprint objects.
 */
export const getRecentClosedSprints = async (boardId, sprintCount = 3) => {
  try {
    const response = await jiraClient.agile.getSprints({
      boardId,
      state: "closed",
      maxResults: sprintCount,
      orderBy: "-startDate", // Get the most recent ones first
    });
    return response.values || [];
  } catch (error) {
    console.error(
      "Error fetching closed sprints:",
      error.response?.data || error.message
    );
    return [];
  }
};

/**
 * Finds all issues from an older sprint (fromSprintId) that were moved into a newer sprint (toSprintId).
 * This mimics Jira's spillover logic using JQL (Part 2, Section C).
 * @param {number} fromSprintId - The ID of the sprint the issue started in.
 * @param {number} toSprintId - The ID of the sprint the issue ended up in.
 * @returns {Promise<object[]>} An array of spillover issue objects.
 */
export const findSpillover = async (fromSprintId, toSprintId) => {
  // JQL to find issues that were in FROM sprint AND are now in TO sprint
  const jqlString = `sprint = ${fromSprintId} AND sprint = ${toSprintId}`;
  // Re-use the flexible search function from the issue service
  return search(jqlString);
};

/**
 * Calculates the average velocity (Story Points completed) over the last 'sprintCount' closed sprints.
 * Follows the specific algorithm outlined in the blueprint (Part 2, Section C).
 * NOTE: Assumes Story Points field ID is 'customfield_10002', which is common in Jira.
 * @param {number} boardId - The ID of the Jira Agile Board.
 * @param {number} sprintCount - The number of recent closed sprints to average.
 * @returns {Promise<{average: number, sprints: object[]}>} Object containing average velocity and list of sprints with completed points.
 */
export const calculateAverageVelocity = async (boardId, sprintCount = 3) => {
  // 1. Fetch the list of closed sprints
  const recentSprints = await getRecentClosedSprints(boardId, sprintCount);

  if (recentSprints.length === 0) {
    return { average: 0, sprints: [] };
  }

  let totalCompletedPoints = 0;
  let sprintsWithPoints = [];

  // 2. Loop through each of these sprint IDs
  for (const sprint of recentSprints) {
    let completedPoints = 0;

    try {
      // Fetch all issues that were in the sprint.
      const response = await jiraClient.agile.getIssuesForSprint({
        sprintId: sprint.id,
      });
      const issues = response.issues || [];

      // 3. Filter issues and sum story points
      for (const issue of issues) {
        // An issue is "Completed" if its status category is "Done".
        if (issue.fields?.status?.statusCategory?.name === "Done") {
          // Story Points are often stored in a custom field, defaulting to 'customfield_10002'
          const storyPoints = issue.fields?.customfield_10002 || 0;
          completedPoints += storyPoints;
        }
      }

      sprintsWithPoints.push({
        ...sprint,
        completedPoints: completedPoints,
      });

      totalCompletedPoints += completedPoints;
    } catch (error) {
      console.warn(
        `Could not process issues for sprint ${sprint.id}. Skipping.`,
        error.message
      );
      // Continue processing the next sprint
    }
  }

  // 4. Calculate the average
  const averageVelocity = totalCompletedPoints / sprintsWithPoints.length;

  return {
    average: parseFloat(averageVelocity.toFixed(2)),
    sprints: sprintsWithPoints,
  };
};
