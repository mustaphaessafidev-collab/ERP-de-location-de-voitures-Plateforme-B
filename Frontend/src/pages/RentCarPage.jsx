import React from "react";
import { Navigate } from "react-router-dom";

export default function RentCarPage() {
  // Redirect to vehicle catalog page
  return <Navigate to="/VehicleCatalogPage" replace />;
}
