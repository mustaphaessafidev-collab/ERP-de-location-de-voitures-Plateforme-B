import Dashboard from "../components/dashboard/Dashboard";
import HistoryPage from "../components/dashboard/HistoryPage";
import RatingsPage from "../pages/RatingsPage";
import NotificationsPage from "../pages/NotificationsPage";
import DriveEaseProfile from "../components/profile/DriveEaseProfile";
import RentCarPage from "../pages/RentCarPage";

export const dashboardRoutes = [
  {
    path: "/dashboard",
    element: <Dashboard />,
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
    path: "/notifications",
    element: <NotificationsPage />,
  },
  {
    path: "/profile",
    element: <DriveEaseProfile />,
  },
  {
    path: "/rent-car",
    element: <RentCarPage />,
  },
];
