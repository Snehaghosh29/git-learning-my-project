import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

// Admin Pages
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminProperties from './admin/pages/AdminProperties';
import AdminUsers from './admin/pages/AdminUsers';
import AdminBookings from './admin/pages/AdminBookings';

// Owner Pages
import OwnerDashboard from './owner/pages/OwnerDashboard';
import OwnerProperties from './owner/pages/OwnerProperties';
import AddProperty from './owner/pages/AddProperty';
import ManageProperty from './owner/pages/ManageProperty';
import OwnerBookings from './owner/pages/OwnerBookings';

// Client Pages
import Home from './client/pages/Home';
import PropertyList from './client/pages/PropertyList';
import PropertyDetails from './client/pages/PropertyDetails';
import MyBookings from './client/pages/MyBookings';

// Shared Pages
import Login from './shared/pages/Login';
import Register from './shared/pages/Register';
import NotFound from './shared/pages/NotFound';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/properties" element={<AdminProperties />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
            </Route>

            {/* Owner Routes */}
            <Route element={<ProtectedRoute allowedRoles={['property_owner']} />}>
              <Route path="/owner" element={<OwnerDashboard />} />
              <Route path="/owner/properties" element={<OwnerProperties />} />
              <Route path="/owner/add-property" element={<AddProperty />} />
              <Route path="/owner/property/:id" element={<ManageProperty />} />
              <Route path="/owner/bookings" element={<OwnerBookings />} />
            </Route>

            {/* Client Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<PropertyList />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route element={<ProtectedRoute allowedRoles={['client']} />}>
              <Route path="/my-bookings" element={<MyBookings />} />
            </Route>

            {/* Shared Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App; 