
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear auth state
    localStorage.clear();
    sessionStorage.clear();

    // Redirect after a delay
    setTimeout(() => {
      navigate("/auth", { replace: true });
    }, 500);
  }, [navigate]);

  return <div className="text-center mt-20">Logging out...</div>;
};

export default Logout;
