import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      {/* Later you can add: <Route path="/chat" element={<Chat />} /> */}
    </Routes>
  );
}

export default App;
