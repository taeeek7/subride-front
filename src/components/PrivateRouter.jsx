import { Navigate, Outlet } from "react-router-dom";

function PrivateRouter({ isLoggedIn }) {
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRouter;
