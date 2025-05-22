
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-sm">
        <Logo className="mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4 text-salesBlue">404</h1>
        <p className="text-xl text-slate-600 mb-6">
          Oops! We couldn't find the page you're looking for
        </p>
        <Button asChild className="bg-salesBlue hover:bg-salesBlue-dark">
          <a href="/">Return to Dashboard</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
