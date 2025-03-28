"use client";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

// Pages
import LandingPage from "./pages/LandingPage";
import PublicCVView from "./pages/PublicCVView";
import ContactCandidate from "./pages/ContactCandidate";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateCV from "./pages/CreateCV";
import MyCVs from "./pages/MyCVs";
import GetHired from "./pages/GetHired";
import Profile from "./pages/Profile";
import ViewCV from "./pages/ViewCV";
import NotFound from "./pages/NotFound";

// Components
import PublicNavbar from "./components/PublicNavbar";

// Protected route component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public layout wrapper
const PublicLayout = ({ children }) => {
  return (
    <>
      <PublicNavbar />
      {children}
    </>
  );
};

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <LandingPage />
          </PublicLayout>
        }
      />
      <Route
        path="/view/:id"
        element={
          <PublicLayout>
            <PublicCVView />
          </PublicLayout>
        }
      />
      <Route
        path="/contact-candidate/:id"
        element={
          <PublicLayout>
            <ContactCandidate />
          </PublicLayout>
        }
      />

      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected routes */}
      <Route element={<MainLayout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-cv"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <CreateCV />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-cvs"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MyCVs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/get-hired"
          element={
            <ProtectedRoute>
              <GetHired />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/view-cv/:id"
          element={
            <ProtectedRoute>
              <ViewCV />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
