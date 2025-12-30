// App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PageTransition from "./components/ui/PageTransition";
import PrivateRoute from "./Security/private-route";
import TemperatureHistory from "./pages/TemperatureHistory";
import HumidityHistory from "./pages/HumidityHistory";
import IncidentsHistory from "./pages/IncidentsHistory";
import SensorManagement from "./pages/SensorManagement";
import AuditLogsHistory from "./pages/AuditLogsHistory";
import Tickets from "./pages/Tickets";
import Users from "./pages/Users";

// AnimatedRoutes component to handle transitions
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <PageTransition>
                <Dashboard />
              </PageTransition>
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />
        <Route
          path="/register"
          element={
            <PageTransition>
              <Register />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <PageTransition>
                <Dashboard />
              </PageTransition>
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <PageTransition>
                <Users />
              </PageTransition>
            </PrivateRoute>
          }
        />
        <Route
          path="/sensors"
          element={
            <PrivateRoute>
              <PageTransition>
                <SensorManagement />
              </PageTransition>
            </PrivateRoute>
          }
        />
        <Route
          path="/tickets"
          element={
            <PrivateRoute>
              <PageTransition>
                <Tickets />
              </PageTransition>
            </PrivateRoute>
          }
        />
        <Route
          path="/temperature/history"
          element={
            <PageTransition>
              <TemperatureHistory />
            </PageTransition>
          }
        />
        <Route
          path="/humidity/history"
          element={
            <PageTransition>
              <HumidityHistory />
            </PageTransition>
          }
        />
        <Route
          path="/incidents/history"
          element={
            <PageTransition>
              <IncidentsHistory />
            </PageTransition>
          }
        />
        <Route
          path="/audit"
          element={
            <PageTransition>
              <AuditLogsHistory />
            </PageTransition>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition>
              <h2 className="text-center text-white mt-10">404 - Page non trouvée</h2>
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return <AnimatedRoutes />;
}
