import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import LoginPage from './components/LoginPage.jsx';
import RequireAuth from './components/RequireAuth.jsx';

import DashboardPage     from './pages/DashboardPage.jsx';
import DisastersPage     from './pages/DisastersPage.jsx';
import AffectedAreasPage from './pages/AffectedAreasPage.jsx';
import CampsPage         from './pages/CampsPage.jsx';
import VictimsPage       from './pages/VictimsPage.jsx';
import VolunteersPage    from './pages/VolunteersPage.jsx';
import ResourcesPage     from './pages/ResourcesPage.jsx';
import DonationsPage     from './pages/DonationsPage.jsx';
import AllocationsPage   from './pages/AllocationsPage.jsx';
import ShortagesPage     from './pages/ShortagesPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="/"                element={<DashboardPage />} />
        <Route path="/disasters"       element={<DisastersPage />} />
        <Route path="/areas"           element={<AffectedAreasPage />} />
        <Route path="/camps"           element={<CampsPage />} />
        <Route path="/victims"         element={<VictimsPage />} />
        <Route path="/volunteers"      element={<VolunteersPage />} />
        <Route path="/resources"       element={<ResourcesPage />} />
        <Route path="/donations"       element={<DonationsPage />} />
        <Route path="/allocations"     element={<AllocationsPage />} />
        <Route path="/shortages"       element={<ShortagesPage />} />
        <Route path="*"                element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
