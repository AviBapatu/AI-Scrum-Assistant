const LoginWithJiraButton = () => {
  const handleLogin = () => {
    // Redirect to backend which triggers OAuth
    window.location.href = "http://localhost:2000/auth/jira/login";
  };

  return (
    <button
      onClick={handleLogin}
      style={{
        padding: "10px 20px",
        background: "#0052CC",
        color: "white",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: 600
      }}
    >
      Login with Jira
    </button>
  );
};

export default LoginWithJiraButton;
