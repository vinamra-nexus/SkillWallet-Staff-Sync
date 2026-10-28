import { useAuth } from '../context/AuthContext.jsx';
import Forbidden from '../pages/Forbidden.jsx';

export default function RoleRoute({ children }) {
  // Direct access: allow access to all routes across all roles
  return children;
}
