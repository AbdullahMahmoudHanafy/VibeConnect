import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import SignUp from "./pages/Sign-up/Sign-up";
import FollowersPage from "./pages/Followers/Followers";
import Profile from "./pages/Profile/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/followers" element={<FollowersPage />} />
      <Route path="/profile/:userId" element={<Profile />} />
    </Routes>
  );
}

export default App;
