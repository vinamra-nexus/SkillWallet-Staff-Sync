import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import PageLoader from '../components/PageLoader.jsx';

export default function ProtectedRoute({ children }) {
  const { loading } = useAuth();

  if (loading) return <PageLoader />;
  // Direct access: always allow without redirecting to login
  return children;
}
