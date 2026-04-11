import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { mapRoutesToRouter } from "../helpers/routeHelpers";
import AppLayout from "../layouts/AppLayout";
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

import DriveEaseProfile from "../components/profile/DriveEaseProfile";

import ReservationSuccessPage from "../pages/ReservationSuccessPage";
import ReviewsPage from "../pages/ReviewsPage";



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

]);

const privateRoutes = mapRoutesToRouter([
  {
    path: "/dashboard",
    element: (
      <PlaceholderPage
        title="Tableau de bord"
        message="Le contenu principal du tableau de bord sera ajouté ici prochainement."
      />
    ),
  },
  {
    path: "/dashboard/stats",
    element: (
      <PlaceholderPage
        title="Statistiques"
        message="Cette page affichera bientôt vos indicateurs et graphiques de performance."
      />
    ),
  },
  {
    path: "/bookings",
    element: (
      <PlaceholderPage
        title="Réservations"
        message="La liste et le suivi de vos réservations seront disponibles ici prochainement."
      />
    ),
  },
  {
    path: "/profile",
    element: <DriveEaseProfile />,
  },
  {
    path: "/settings",
    element: (
      <PlaceholderPage
        title="Paramètres"
        message="Les préférences du compte et les options d'application seront ajoutées ici."
      />
    ),
  },

  { path: "/booking-review", element: <ReservationPage /> },
  { path: "/notifications", element: <NotificationsPage /> },
  { path: "/reviews", element: <ReviewsPage /> },
  { path: "/test-success", element: <PlaceholderPage title="Test success" message="Test success message" /> },
  { path: "/reservation", element: <ReservationPage /> },
  { path: "/reservation-reussie", element: <ReservationSuccessPage /> },
]);

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
