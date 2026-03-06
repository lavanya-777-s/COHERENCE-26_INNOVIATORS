import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AboutUs from './pages/AboutUs';
import AnalystDashboard from './pages/AnalystDashboard';
import AuditorDashboard from './pages/AuditorDashboard';
import CitizenPublicDashboard from './pages/CitizenPublicDashboard';
import Landing from './pages/Landing';
import Login from './pages/Login';
import OfficialDashboard from './pages/OfficialDashboard';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/citizen" element={<CitizenPublicDashboard />} />

        {/* Protected Routes - Government */}
        <Route
          path="/dashboard/official"
          element={
            <ProtectedRoute requiredRole="official">
              <OfficialDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/analyst"
          element={
            <ProtectedRoute requiredRole="analyst">
              <AnalystDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/auditor"
          element={
            <ProtectedRoute requiredRole="auditor">
              <AuditorDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;