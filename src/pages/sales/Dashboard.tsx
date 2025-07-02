import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth/AuthProvider";

export default function SalesDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, session } = useAuth();

  useEffect(() => {
    console.log("🚀 SALES DASHBOARD MOUNTED");
    console.log("👤 Auth User:", user);
    console.log("🔐 Session:", session);
    
    const initDashboard = async () => {
      try {
        if (!user) {
          throw new Error("No authenticated user found");
        }

        console.log("🧠 Simulating agent init for user:", user.id);
        
        // Simulate loading data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log("✅ Data loaded successfully");
        setData({ deals: [], stats: {}, userId: user.id });
        setError(null);
      } catch (err) {
        console.error("💥 Dashboard error caught:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, [user, session]);

  if (loading) return <p>Loading data...</p>;
  if (error) return <div>Error loading dashboard: {error}</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📊 Full Sales Dashboard</h2>
      <p>🧪 Rendered safely with stub data.</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
