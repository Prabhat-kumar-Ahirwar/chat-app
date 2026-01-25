import { Routes, Route } from "react-router-dom";
import JoinCreateRoom from "../components/JoinCreateRoom";
import ChatRoom from "../components/ChatRoom";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<JoinCreateRoom />} />
      <Route path="/chat" element={<ChatRoom />} />
    </Routes>
  );
};

export default AppRoutes;
