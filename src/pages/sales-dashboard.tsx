import { useEffect } from "react";

export default function SalesDashboardSafe() {
  useEffect(() => {
    console.log("\uD83E\uDDEA Sales Dashboard Safe loaded");
  }, []);

  return (
    <div style={{ padding: "2rem", fontSize: "1.2rem", fontFamily: "sans-serif" }}>
      <h1>\uD83D\uDCCA SALES DASHBOARD (SAFE MODE)</h1>
      <p>Currently running in non-AI mode to verify layout and auth flow stability.</p>
      <button
        style={{ marginTop: "1rem", padding: "0.5rem 1rem", fontSize: "1rem" }}
        onClick={() => {
          localStorage.clear();
          window.location.href = "/auth";
        }}
      >
        Logout
      </button>
    </div>
  );
}
