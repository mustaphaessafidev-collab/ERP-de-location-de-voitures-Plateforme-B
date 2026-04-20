import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { mapRoutesToRouter } from "../helpers/routeHelpers";
import AppLayout from "../layouts/AppLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import { guestRouteLoader, privateRouteLoader } from "./authLoaders";
import LoginPage from "../components/auth/LoginPage";
import RegisterPage from "../components/auth/RegisterPage";
import ValidateEmailPage from "../components/auth/ValidateEmailPage";
import VehicleCatalogPage from "../pages/VehicleCatalogPage";
import VehicleDetailsPage from "../pages/VehicleDetailsPage";
import ReservationPage from "../components/reservation/Reservation";
import PlaceholderPage from "../components/pages/PlaceholderPage";
import NotFoundPage from "../pages/NotFoundPage";
import NotificationsPage from "../pages/NotificationsPage";
import HomePage from "../pages/HomePage";
import Dashboard from "../components/dashboard/Dashboard";
import HistoryPage from "../components/dashboard/HistoryPage";
import DriveEaseProfile from "../components/profile/DriveEaseProfile";
import RatingsPage from "../pages/RatingsPage";
import RentCarPage from "../pages/RentCarPage";
import ReservationSuccessPage from "../pages/ReservationSuccessPage";
<<<<<<< HEAD
import Dashboard from "../components/dashboard/Dashboard";
=======
import ReviewsPage from "../pages/ReviewsPage";

>>>>>>> 6657c7b18bdceefee063bf7a7c9bb21ea05e39fb


const guestAuthRoutes = mapRoutesToRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/validate-email", element: <ValidateEmailPage /> },
]);

const publicRoutes = mapRoutesToRouter([
  { path: "/", element: <HomePage/> },
  {
    loader: guestRouteLoader,
    element: <Outlet />,
    children: guestAuthRoutes,
  },
  { path: "/VehicleCatalogPage", element: <VehicleCatalogPage /> },
  { path: "/VehicleDetail/:id", element: <VehicleDetailsPage /> },
  { path: "/notifications", element: <NotificationsPage /> },
<<<<<<< HEAD
  {
    path: "/dashboard",
    element: (
      <Dashboard/>
    ),
  },

=======
>>>>>>> 6657c7b18bdceefee063bf7a7c9bb21ea05e39fb
]);

// Dashboard routes (with sidebar) - Full paths since no parent
const dashboardRoutes = mapRoutesToRouter([
  {
    path: "/dashboard",
<<<<<<< HEAD
    element: (
      <Dashboard/>
    ),
=======
    element: <Dashboard />,
>>>>>>> 6657c7b18bdceefee063bf7a7c9bb21ea05e39fb
  },
  {
    path: "/history",
    element: <HistoryPage />,
  },
  {
    path: "/ratings",
    element: <RatingsPage />,
  },
  {
    path: "/profile",
    element: <DriveEaseProfile />,
  },
  {
    path: "/rent-car",
    element: <RentCarPage />,
  },
]);

// Non-dashboard private routes (without sidebar)
const otherPrivateRoutes = mapRoutesToRouter([
  { path: "/booking-review", element: <ReservationPage /> },
  { path: "/reviews", element: <ReviewsPage /> },
  { path: "/test-success", element: <PlaceholderPage title="Test réussi" message="Message de test réussi" /> },
  { path: "/reservation", element: <ReservationPage /> },
  { path: "/reservation-reussie", element: <ReservationSuccessPage /> },
]);

// Dashboard group (with sidebar layout) - NO PATH needed
const dashboardGroup = {
  element: <DashboardLayout />,
  children: dashboardRoutes,
};

// All private routes combined
const privateRoutes = [
  dashboardGroup,
  ...otherPrivateRoutes,
];

export function createAppRouter() {
  return createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        ...publicRoutes,
        {
          loader: privateRouteLoader,
          element: <Outlet />,
          children: privateRoutes,
        },
        { path: "*", element: <NotFoundPage /> },
      ],
    },
  ]);
}
