// App.js
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import useAuthCheck from "utils/useAuthCheck";
import AppRoutes from "routes";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isTokenVerified = useAuthCheck();

  useEffect(() => {
    setUser(JSON.parse(sessionStorage.getItem("user")));
  }, []);

  const handleAfterLogin = useCallback(
    (userData) => {
      sessionStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      navigate("/");
    },
    [navigate]
  );

  return (
    <>
      {isTokenVerified || location.pathname === "/login" ? (
        <AppRoutes user={user} handleAfterLogin={handleAfterLogin} />
      ) : (
        <div>Loading...</div>
      )}
      <div>
        <ToastContainer />
      </div>
    </>
  );
}

export default App;