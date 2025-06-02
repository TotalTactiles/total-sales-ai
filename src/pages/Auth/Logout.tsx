
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Logout = () => {
  const { signOut } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        console.log('Logout component: Starting logout process');
        // Use the auth context signOut method which handles cleanup properly
        await signOut();
      } catch (error) {
        console.error('Logout component error:', error);
        // Fallback: clear storage and redirect manually
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/auth';
      }
    };

    performLogout();
  }, [signOut]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Logging out...</p>
      </div>
    </div>
  );
};

export default Logout;
