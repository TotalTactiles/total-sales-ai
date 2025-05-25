import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Dashboard from './pages/Dashboard';
import SmartDialer from './pages/SmartDialer';
import LeadManagement from './pages/LeadManagement';
import Analytics from './pages/Analytics';
import AgentMissions from './pages/AgentMissions';
import CompanyBrain from './pages/CompanyBrain';
import AgentTools from './pages/AgentTools';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>

          {/* Public Routes (No Layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />

          {/* Protected Routes (With Layout) */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/smart-dialer" element={<SmartDialer />} />
            <Route path="/lead-management" element={<LeadManagement />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/agent-missions" element={<AgentMissions />} />
            <Route path="/company-brain" element={<CompanyBrain />} />
            <Route path="/agent-tools" element={<AgentTools />} />
            <Route path="/reports" element={<Reports />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
