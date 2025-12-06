import { BrowserRouter, Routes, Route } from "react-router-dom";
import CallbackPage from "./pages/CallbackPage.tsx";
import SuccessPage from "./pages/SuccessPage.tsx";
import LoginWithJiraButton from "./components/LoginWIthJiraButton.tsx"
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import WorkspaceSelect from "./pages/WorkspaceSelect";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/oauth/callback" element={<CallbackPage />} />
        <Route path="/oauth/success" element={<SuccessPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workspace" element={<WorkspaceSelect />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/" element={<LoginWithJiraButton />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;

