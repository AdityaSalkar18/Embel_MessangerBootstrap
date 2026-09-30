import { Routes, Route, Navigate } from "react-router-dom";

import ChatWidget from "./components/layout/ChatWidget";
import Login from "./components/authentication/Login.jsx";

function App() {
  return (
    <div className="min-vh-100" style={{ backgroundColor: "#FFFFFF" }}>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<ChatWidget />} />
        <Route path="/chats" element={<ChatWidget />} />
        <Route path="/groups" element={<ChatWidget />} />
        <Route path="/pinned" element={<ChatWidget />} />
        <Route path="/profile" element={<ChatWidget />} />
        <Route path="/chat/:chatId" element={<ChatWidget />} />
        <Route path="/group/:groupId" element={<ChatWidget />} />

        {/* Views open inside the widget; state is passed via navigate(..., { state }) */}
        <Route path="/groupview" element={<ChatWidget />} />
        <Route path="/onetooneview" element={<ChatWidget />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;