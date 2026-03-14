import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import SignUp from "./pages/SignUp"
import Train from "./components/backendpages/Train"
import Login from "./pages/Login"
import Navbar from "./pages/Navbar"
import DemandAndInfra from "./components/backendpages/DemandAndInfra"
import DashBoard from "./components/backendpages/DashBoard"
import Revenue from "./components/backendpages/Revenue"

function App() {
  return (
    <BrowserRouter>

      {/* 🔗 Navigation Links */}
      <nav>
        
      </nav>

      {/* 📍 Route Mapping */}
      <Routes>
        <Route path="/" element={<DashBoard />} />
        <Route path="/DemandAndInfra" element={<DemandAndInfra />} />
        <Route path="/Revenue" element={<Revenue />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/train" element={<Train />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App