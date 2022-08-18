import React from "react";
import { Routes, Route } from "react-router-dom";
import Tool from "./pages/Tool";
import Properties from "./pages/Properties";
import Login from "./pages/Login";
import ProtectedRoute from "./auth/ProtectedRoute";
import "./App.scss";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/properties"
        element={
          <ProtectedRoute>
            <Properties />
          </ProtectedRoute>
        }
      />
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
