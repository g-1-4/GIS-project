import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import MapComponent from "./pages/Mapcomponent";  // ✅ Updated import
import ProtectedRoute from "./pages/ProtectedRoute";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div style={{ height: "100vh" }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/map" element={<ProtectedRoute><MapComponent /></ProtectedRoute>} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
