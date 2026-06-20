import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token } = useSelector((state) => state.auth);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const dashboard = user.role === 'student' ? '/student/dashboard' : user.role === 'recruiter' ? '/recruiter/dashboard' : '/admin/dashboard';
    return <Navigate to={dashboard} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
