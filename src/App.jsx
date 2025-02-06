import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from "./sections/Sidebar.js";
import Main from "./sections/Main.js";
import EmergencyCall from "./components/VictimInterface/EmergencyCall.js";
import "leaflet/dist/leaflet.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/emergency-call" element={<EmergencyCall />} />
        <Route
          path="/"
          element={
            <div className="p-10 bg-backGrey text-[#1F2633] font-sans w-full h-full flex gap-[5%]">
              <Sidebar className="w-1/5 flex h-full " />
              <Main className="w-4/5 flex h-full" />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
