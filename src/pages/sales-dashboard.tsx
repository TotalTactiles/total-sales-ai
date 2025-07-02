
import dynamic from "next/dynamic";

const FullDashboard = dynamic(() => import("@/components/Sales/SalesDashboard"), {
  ssr: false,
  loading: () => <p>Loading full dashboard logic...</p>,
});

export default function SalesDashboardWrapper() {
  return <FullDashboard />;
}
