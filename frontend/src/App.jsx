import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import AdminLogin from "./components/AdminLogin";
import { Toaster } from "./components/ui/toaster"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminLogin />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
