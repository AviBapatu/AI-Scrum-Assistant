import { BrowserRouter, Routes, Route } from "react-router-dom";
import CallbackPage from "./pages/CallbackPage.tsx";
import SuccessPage from "./pages/SuccessPage.tsx";
import LoginWithJiraButton from "./components/LoginWIthJiraButton.tsx"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/oauth/callback" element={<CallbackPage />} />
        <Route path="/oauth/success" element={<SuccessPage />} />
        <Route path="/" element={<LoginWithJiraButton />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

