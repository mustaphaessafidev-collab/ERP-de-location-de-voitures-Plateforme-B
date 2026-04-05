import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NotificationProvider } from './context/NotificationContext';

import VehicleCatalogPage from "./pages/VehicleCatalogPage";
import VehicleDetails from './pages/VehicleDetailsPage';
import ReservationPage from "../src/components/reservation/Reservation.jsx";
import ReservationSuccessPage from "./pages/ReservationSuccessPage";

// Auth Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ValidateEmailPage from './pages/ValidateEmailPage';
import TestLoggedPage from './pages/TestLoggedPage';

export default function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/validate-email" element={<ValidateEmailPage />} />
          
          {/* Temporary Test Route */}
          <Route path="/test-success" element={<TestLoggedPage />} />
          
          {/* App Routes */}
          <Route path="/VehicleCatalogPage" element={<VehicleCatalogPage />} />
          <Route path="/VehicleDetail/:id" element={<VehicleDetails />} />
          <Route path="/reservation" element={<ReservationPage />} />
          <Route path="/booking-review" element={<ReservationPage />} />
          <Route path="/reservation-reussie" element={<ReservationSuccessPage />} />
          
          {/* Default route */}
          <Route path="/" element={<Navigate to="/register" replace />} />
        </Routes>
      </NotificationProvider>
    </BrowserRouter>
  );
}