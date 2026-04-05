import { createBrowserRouter, Navigate } from "react-router-dom";
import { mapRoutesToRouter } from "../helpers/routeHelpers";
import AppLayout from "../layouts/AppLayout";
import RequireAuth from "./RequireAuth";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ValidateEmailPage from "../pages/ValidateEmailPage";
import VehicleCatalogPage from "../pages/VehicleCatalogPage";
import VehicleDetailsPage from "../pages/VehicleDetailsPage";
import ReservationPage from "../components/reservation/Reservation";
import PlaceholderPage from "../components/pages/PlaceholderPage";
import NotFoundPage from "../pages/NotFoundPage";

const publicRoutes = mapRoutesToRouter([
  { path: "/", element: <Navigate to="/VehicleCatalogPage" replace /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/validate-email", element: <ValidateEmailPage /> },
  { path: "/VehicleCatalogPage", element: <VehicleCatalogPage /> },
  { path: "/VehicleDetail/:id", element: <VehicleDetailsPage /> },
  

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
    element: (
      <PlaceholderPage
        title="Profil"
        message="Vous pourrez bientôt modifier vos informations personnelles sur cette page."
      />
    ),
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
  { path: "/reservation", element: <ReservationPage /> },
  { path: "/booking-review", element: <ReservationPage /> },
]);

export function createAppRouter() {
  return createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        ...publicRoutes,
        {
          element: <RequireAuth />,
          children: privateRoutes,
        },
        { path: "*", element: <NotFoundPage /> },
      ],
    },
  ]);
}
