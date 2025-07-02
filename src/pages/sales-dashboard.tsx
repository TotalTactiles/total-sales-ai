
import React, { Suspense } from 'react';

const SalesDashboard = React.lazy(() => import("@/pages/sales/Dashboard"));

export default function SalesDashboardWrapper() {
  return (
    <Suspense fallback={<p>Loading full dashboard logic...</p>}>
      <SalesDashboard />
    </Suspense>
  );
}
