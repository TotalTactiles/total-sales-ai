
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from '@/components/ThemeProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';

// Import pages and components
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';

// Import layouts
import ManagerLayout from '@/layouts/ManagerLayout';
import SalesLayout from '@/layouts/SalesLayout';

// Legacy pages for backward compatibility
import LeadWorkspace from '@/pages/LeadWorkspace';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Router>
            <AuthProvider>
              <div className="min-h-screen bg-background text-foreground">
                <Routes>
                  {/* Public routes */}
                  <Route path="/auth/*" element={<Auth />} />
                  
                  {/* Role-based OS routing */}
                  <Route path="/*" element={
                    <ProtectedRoute>
                      <RoleBasedApp />
                    </ProtectedRoute>
                  } />
                  
                  {/* Legacy routes for backward compatibility */}
                  <Route path="/lead-workspace/:id?" element={
                    <ProtectedRoute>
                      <LeadWorkspace />
                    </ProtectedRoute>
                  } />
                  
                  {/* Catch all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                
                <Toaster />
              </div>
            </AuthProvider>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Role-based application component
const RoleBasedApp = () => {
  const { profile } = useAuth();
  
  // Determine which layout to use based on role
  if (profile?.role === 'manager') {
    return <ManagerLayout />;
  }
  
  // Default to sales layout for sales_rep or any other role
  return <SalesLayout />;
};

// Import useAuth hook at the top level to avoid import issues
import { useAuth } from '@/contexts/AuthContext';

export default App;
