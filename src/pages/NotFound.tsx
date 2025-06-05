import { logger } from '@/utils/logger';

import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/Logo";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    logger.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader className="space-y-4">
          <Logo className="mx-auto" />
          <div>
            <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
            <CardTitle className="text-2xl text-foreground">Page Not Found</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Attempted URL: <code className="bg-muted px-1 py-0.5 rounded text-xs">{location.pathname}</code>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="flex items-center gap-2">
              <Link to="/">
                <Home className="h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="flex items-center gap-2">
              <Link to="/leads">
                <Search className="h-4 w-4" />
                View Leads
              </Link>
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
