# Integrate Updated AI Ticket Schema with Jira

## Overview

Update backend logic to consume the new AI schema (with `project_key`, richer issue fields, optional epic structure) and create Jira tickets accordingly.

## Current State

- `/api/v1/scrum/suggestions` now returns `{ project_key, project_title, epics?, jira_issues }`
- Jira issue service exposes `createTicket(fields)` expecting Jira REST format
- No endpoint yet to push AI issues to Jira
- `scrum.controller.js` still only has `generateSuggestions`
- Need to handle richer fields (assignee, labels, parent, epic_name, story_points, acceptance_criteria)

## Implementation Steps

### 1. Fix Existing Import + Cleanups

- Ensure `issue_service.js` imports `jiraClient.js`
- Remove unused `success` import in `scrum.controller.js`

### 2. Ticket Transformation Utilities

- Create `backend/src/services/jira/ticketTransformer.service.js`
- Functions:
- `mapPriority(priority?)`
- `mapIssueType(type)` (ensure valid Jira values)
- `buildDescription(description, acceptanceCriteria?)`
- `transformAITicketToJira(aiTicket, projectKey)` producing Jira `fields`
- Optionally `transformEpic(epic, projectKey)`
- Handle optional fields: assignee → `assignee.id` or `assignee.accountId`? (use `assignee` as email via `assignee: { name }` or `accountId`? need to choose: default to `assignee: { name: aiTicket.assignee }`)
- Map `story_points` to `customfield_10016` (default story points field) if provided
- For epics, set `issuetype` → Epic and use `customfield_10011` or `epic_name`

### 3. Controller Logic

- Add `createTicketsInJira` to `scrum.controller.js`
- Accept body with either:
- entire AI response `{ project_key, jira_issues, epics? }`
- optional subset selection (allow `tickets` override?) — clarify: assume full payload
- Validation: ensure `project_key` and at least one issue (either `jira_issues` or issues inside `epics`)
- Transform tickets using transformer
- Sequentially create epics first (if provided), capture keys for linking child issues via `parent`
- Create non-epic issues; attach parent key if provided or derived from created epics
- Build response summarizing successes/failures

### 4. Routing

- Update `backend/src/routes/scrum.routes.js`
- Add `POST /api/v1/scrum/tickets/create`
- JSON body (no multer)
- Wire to `createTicketsInJira`

### 5. Error Handling & Logging

- Wrap Jira calls with try/catch
- Accumulate per-ticket errors but continue processing others
- Return 207-style response: HTTP 200 with `created` and `failed`
- Surface Jira error messages for debugging

## Files to Modify

- `backend/src/services/jira/issue_service.js`
- `backend/src/controllers/scrum.controller.js`
- `backend/src/routes/scrum.routes.js`

## Files to Create

- `backend/src/services/jira/ticketTransformer.service.js`

## Additional Considerations

- Story points/custom fields may vary; expose TODO for custom field IDs
- Assignee handling may require Atlassian accountId vs email — document assumption
- Ensure acceptance criteria appended to description (e.g., bullet list)
- If no tickets succeed, return `success: false`