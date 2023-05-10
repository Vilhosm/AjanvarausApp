// Import necessary libraries and components
import { Routes, Route } from "react-router-dom";
import AdminDashboard from './components/Admin/AdminDashboard';
import Login from './components/Public/Login';
import Register from './components/Public/Register';
import AdminProfile from './components/Admin/AdminProfile';
import AdminBookings from "./components/Admin/AdminBookings";
import AdminHomepage from './components/Admin/AdminHomepage';
import Homepage from './components/Public/Homepage';
import { RequireAuth, useAuthUser } from 'react-auth-kit';
import withAdminRole from "./hooks/withAdminRole";

function App() {
  // Protected routes for admin
  const AdminDashboardProtected = withAdminRole(AdminDashboard);
  const AdminBookingsProtected = withAdminRole(AdminBookings);
  const AdminProfileProtected = withAdminRole(AdminProfile);
  const AdminHomepageProtected = withAdminRole(AdminHomepage);

  const auth = useAuthUser();
  const userRole = auth()?.role;

  // Displays the guestpage if not role admin
  const LandingPage = () => {
    if (userRole === 'admin') {
      return <RequireAuth loginPath='/login'><AdminHomepageProtected /></RequireAuth>;
    } else {
      return <Homepage />
    }
  };
  return (
              // Website pages
    <Routes>
      <Route path='/admin-dashboard' element={<RequireAuth loginPath='/login'><AdminDashboardProtected /></RequireAuth>}></Route>
      <Route path='/admin-bookings' element={<RequireAuth loginPath='/login'><AdminBookingsProtected /></RequireAuth>}></Route>
      <Route path='/admin-profile' element={<RequireAuth loginPath='/login'><AdminProfileProtected /></RequireAuth>}></Route>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/' element={<LandingPage />} />
    </Routes>
  );
}

export default App;
