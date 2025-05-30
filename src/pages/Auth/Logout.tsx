
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Logout = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Use the auth context signOut method which handles cleanup properly
        await signOut();
      } catch (error) {
        console.error('Logout error:', error);
        // Fallback: clear storage and redirect manually
        localStorage.clear();
        sessionStorage.clear();
        navigate("/auth", { replace: true });
      }
    };

    performLogout();
  }, [navigate, signOut]);

  return <div className="text-center mt-20">Logging out...</div>;
};

export default Logout;
