import React from 'react';
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Navigate, Route, Routes } from "react-router-dom";

// Page Imports
import ManagerDashboard from "@/pages/manager/Dashboard";
import LeadManagement from "@/pages/manager/LeadManagement";
import Analytics from "@/pages/manager/Analytics";
import TeamManagement from "@/pages/manager/TeamManagement";
import ManagerAI from "@/pages/manager/AI";
import CompanyBrain from "@/pages/manager/CompanyBrain";
import Reports from "@/pages/manager/Reports";
import DeveloperDashboard from "@/components/MasterBrain/DeveloperDashboard";

const ManagerLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<ManagerDashboard />} />
              <Route path="/leads" element={<LeadManagement />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/team" element={<TeamManagement />} />
              <Route path="/ai" element={<ManagerAI />} />
              <Route path="/company-brain" element={<CompanyBrain />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/developer-dashboard" element={<DeveloperDashboard />} />
              {/* Add more routes as needed */}
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;
