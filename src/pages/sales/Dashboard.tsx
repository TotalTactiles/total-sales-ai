import { useEffect, useState } from "react";

export default function SalesDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🚀 SALES DASHBOARD MOUNTED");
    try {
      // Simulate risky code with logging
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (!user) throw new Error("User not found in localStorage");

      console.log("👤 User:", user);

      // Simulate AI hook call or agent init
      console.log("🧠 Simulating agent init...");
      // agent.start(user.id) or similar (comment out if crashing)

      setTimeout(() => {
        console.log("✅ Data loaded");
        setData({ deals: [], stats: {} });
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error("💥 Dashboard error caught:", err);
    }
  }, []);

  if (loading) return <p>Loading data...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📊 Full Sales Dashboard</h2>
      <p>🧪 Rendered safely with stub data.</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
