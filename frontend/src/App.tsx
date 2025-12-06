import { BrowserRouter, Routes, Route } from "react-router-dom";
import CallbackPage from "./pages/CallbackPage.tsx";
import SuccessPage from "./pages/SuccessPage.tsx";
import LoginWithJiraButton from "./components/LoginWIthJiraButton.tsx"
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import WorkspaceSelect from "./pages/WorkspaceSelect";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/oauth/callback" element={<CallbackPage />} />
        <Route path="/oauth/success" element={<SuccessPage />} />
        <Route path="/" element={<LoginWithJiraButton />} />

        {/* Authenticated Routes */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workspace" element={<WorkspaceSelect />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/prd" element={<div className="p-8">PRD Generator Coming Soon</div>} />
          <Route path="/tools/standup" element={<div className="p-8">Standup Generator Coming Soon</div>} />
          <Route path="/tools/retro" element={<div className="p-8">Retrospective Generator Coming Soon</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


export default App;

