import React from "react";
import { Routes, Route } from "react-router-dom";
import Tool from "./pages/Tool";
import Login from "./pages/Login";
import ProtectedRoute from "./auth/ProtectedRoute";
import "./App.scss";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/tool"
        element={
          <ProtectedRoute>
            <Tool />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
