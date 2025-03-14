import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/ui/navbar";
import Home from "./components/ui/home";
import SignIn from "./components/ui/signIn";
import SignUp from "./components/ui/signUp";
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
