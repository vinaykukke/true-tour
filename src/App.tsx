import React from "react";
import { Routes, Route } from "react-router-dom";
import Tool from "./pages/Tool";
import Properties from "./pages/Properties";
import Login from "./pages/Login";
import Tours from "./pages/Tours";
import ToursPublic from "./pages/ToursPublic";
import ProtectedRoute from "./auth/ProtectedRoute";
import "./App.scss";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/tours/:id/:tourId" element={<ToursPublic />} />
      <Route
        path="/properties"
        element={
          <ProtectedRoute>
            <Properties />
          </ProtectedRoute>
        }
      />
      <Route
        path="/property/:id"
        element={
          <ProtectedRoute>
            <Tours />
          </ProtectedRoute>
        }
      />
      <Route
        path="/property/:id/:tourId"
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
