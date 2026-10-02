import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ChangePassword from './pages/auth/ChangePassword';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Staff
import StaffDashboard from './pages/staff/StaffDashboard';
import IncomingStock from './pages/staff/IncomingStock';
import StorageLocations from './pages/staff/StorageLocations';
import DispatchShipments from './pages/staff/DispatchShipments';

// Supervisor
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';
import ApproveDispatch from './pages/supervisor/ApproveDispatch';
import InventoryReport from './pages/supervisor/InventoryReport';
import ManageStorage from './pages/supervisor/ManageStorage';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import ManagePersonnel from './pages/admin/ManagePersonnel';
import WarehouseData from './pages/admin/WarehouseData';
import AdminReports from './pages/admin/AdminReports';
import AdminRecords from './pages/admin/AdminRecords';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="/staff" element={<DashboardLayout allowedRole="Staff" />}>
            <Route index element={<StaffDashboard />} />
            <Route path="stock" element={<IncomingStock />} />
            <Route path="storage" element={<StorageLocations />} />
            <Route path="shipments" element={<DispatchShipments />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>

          <Route path="/supervisor" element={<DashboardLayout allowedRole="Supervisor" />}>
            <Route index element={<SupervisorDashboard />} />
            <Route path="approvals" element={<ApproveDispatch />} />
            <Route path="inventory" element={<InventoryReport />} />
            <Route path="storage" element={<ManageStorage />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>

          <Route path="/admin" element={<DashboardLayout allowedRole="Admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<ManagePersonnel />} />
            <Route path="data" element={<WarehouseData />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="records" element={<AdminRecords />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
