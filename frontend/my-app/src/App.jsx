import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/ui/navbar";
import Home from "./components/ui/home";
import SignIn from "./components/ui/signIn";
import SignUp from "./components/ui/signUp";
import MapComponent from "./components/ui/map"; // Import the MapComponent
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/map" element={<MapComponent />} /> {/* Add route for MapComponent */}
      </Routes>
    </Router>
  );
}

export default App;