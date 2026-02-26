import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import SignUp from "./pages/SignUp"
import Train from "./pages/Train"
import Login from "./pages/Login"
import Navbar from "./pages/Navbar"

function App() {
  return (
    <BrowserRouter>

      {/* 🔗 Navigation Links */}
      <nav>
        
      </nav>

      {/* 📍 Route Mapping */}
      <Routes>
        <Route path="/" element={<Train/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/train" element={<Train />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App