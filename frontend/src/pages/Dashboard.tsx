const Dashboard = () => {
  const cloudId = localStorage.getItem("cloudId");

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Cloud ID: {cloudId}</p>
    </div>
  );
};

export default Dashboard;
