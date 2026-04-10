import { RouterProvider } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import { appRouter } from "./router";
import { NotificationProvider } from "./context/NotificationContext";

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
      <RouterProvider router={appRouter} />

      </NotificationProvider>
    </AuthProvider>
  );
}
