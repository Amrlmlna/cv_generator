import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import Loading from "./components/shared/Loading";

// Lazy load pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CVBuilder = lazy(() => import("./pages/CVBuilder"));
const SavedCVs = lazy(() => import("./pages/SavedCVs"));
const CareerPathGenerator = lazy(() => import("./pages/CareerPathGenerator"));
const JobListings = lazy(() => import("./pages/JobListings"));
const Candidates = lazy(() => import("./pages/Candidates"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Add the import for GetHired page
const GetHired = lazy(() => import("./pages/GetHired"));

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="cv-builder" element={<CVBuilder />} />
              <Route path="saved-cvs" element={<SavedCVs />} />
              <Route path="career-path" element={<CareerPathGenerator />} />
              <Route path="job-listings" element={<JobListings />} />
              <Route path="candidates" element={<Candidates />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              {/* Add the route for GetHired page (inside the Routes component, within the protected route) */}
              <Route path="get-hired" element={<GetHired />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
