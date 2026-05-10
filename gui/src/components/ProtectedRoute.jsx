import { observer } from "mobx-react-lite";
import { Navigate } from "react-router-dom";
import authStore from "../store/AuthStore";

const ProtectedRoute = observer(({ children }) => {
  return authStore.isAuthenticated ? children : <Navigate to="/login" />;
});


/* const ProtectedRoute = observer(({ roles, children }) => {
  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!authStore.hasRole(roles)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}); */


export default ProtectedRoute;