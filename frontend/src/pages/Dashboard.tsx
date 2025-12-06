import { useEffect } from "react";

const Dashboard = () => {
  const cloudId = localStorage.getItem("cloudId");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchProjects = async () => {
      const res = await fetch("http://localhost:2000/auth/jira/projects", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      console.log("Projects Full Response:", data);
      console.log("Projects:", data.values);

      return data.values;
    };

    const fetchBoards = async () => {
      const res = await fetch("http://localhost:2000/auth/jira/boards", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      console.log("Boards:", data.values);

      return data.values;
    };

    const fetchSprints = async (boardId: number) => {
      const res = await fetch(
        `http://localhost:2000/auth/jira/boards/${boardId}/sprints`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      console.log(`Sprints for board ${boardId}:`, data.values);

      return data.values;
    };

    const fetchSprintIssues = async (sprintId: number) => {
      const res = await fetch(
        `http://localhost:2000/auth/jira/sprints/${sprintId}/issues`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      console.log(`Issues for sprint ${sprintId}:`, data.issues);

      return data.issues;
    };

    const run = async () => {
      const boards = await fetchBoards();
      if (!boards || boards.length === 0) return;

      const selectedBoard = boards[0];

      const sprints = await fetchSprints(selectedBoard.id);
      if (!sprints || sprints.length === 0) return;

      const activeSprint = sprints.find((s: any) => s.state === "active");

      if (activeSprint) {
        await fetchSprintIssues(activeSprint.id);
      } else {
        console.log("No active sprint found.");
      }
    };

    run();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Cloud ID: {cloudId}</p>
    </div>
  );
};

export default Dashboard;
