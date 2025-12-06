import { useEffect } from "react";

const Dashboard = () => {
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const fetchProjects = async () => {
    const res = await fetch("http://localhost:2000/auth/jira/projects", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    console.log("Projects:", data.values);
  };

  fetchProjects();
}, []);

  const cloudId = localStorage.getItem("cloudId");

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Cloud ID: {cloudId}</p>
    </div>
  );
};

export default Dashboard;
