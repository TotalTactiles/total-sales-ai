import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth/AuthProvider";

export default function SalesDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authState, setAuthState] = useState<string>("checking");

  // Safe auth hook with proper error handling
  let user = null;
  let session = null;
  let authError = null;
  
  try {
    const authData = useAuth();
    user = authData?.user;
    session = authData?.session;
    console.log("✅ Auth context available:", { user: !!user, session: !!session });
    setAuthState("available");
  } catch (err) {
    console.error("⚠️ Auth context not available:", err);
    authError = err;
    setAuthState("no-auth-context");
  }

  useEffect(() => {
    console.log("🚀 SALES DASHBOARD MOUNTED");
    console.log("👤 Auth User:", user);
    console.log("🔐 Session:", session);
    console.log("🔍 Auth State:", authState);
    
    const initDashboard = async () => {
      try {
        // Check for demo auth fallback
        const demoAuth = localStorage.getItem('demo-auth');
        if (!user && !demoAuth) {
          throw new Error("No authenticated user found and no demo auth");
        }

        console.log("🧠 Starting dashboard init...");
        
        // Simulate loading data with timeout protection
        const dataPromise = new Promise(resolve => {
          setTimeout(() => {
            resolve({ deals: [], stats: {}, userId: user?.id || 'demo-user' });
          }, 500);
        });

        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Dashboard init timeout")), 3000);
        });

        const result = await Promise.race([dataPromise, timeoutPromise]);
        
        console.log("✅ Data loaded successfully");
        setData(result);
        setError(null);
        setAuthState("success");
      } catch (err) {
        console.error("💥 Dashboard error caught:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        setAuthState("error");
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, [user, session, authState]);

  // Debug fallback UI
  if (authState === "no-auth-context") {
    return (
      <div style={{ padding: "2rem", border: "2px solid orange" }}>
        <h2>⚠️ Auth Context Missing</h2>
        <p>Dashboard running in fallback mode</p>
        <button onClick={() => window.location.href = '/auth'}>Go to Auth</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: "2rem" }}>
        <p>Loading data...</p>
        <p>🔍 Debug: user={user ? "yes" : "no"}, session={session ? "yes" : "no"}, loading={loading.toString()}</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{ padding: "2rem", border: "2px solid red" }}>
        <h2>⚠️ Error loading dashboard</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reload Dashboard</button>
        <button onClick={() => window.location.href = '/auth'}>Back to Auth</button>
      </div>
    );
  }

  console.log("✅ Sales Dashboard loaded without crashing");
  
  return (
    <div style={{ padding: "2rem", border: "2px solid green" }}>
      <h2>📊 Full Sales Dashboard</h2>
      <p>🧪 Rendered safely with stub data.</p>
      <p>👤 User: {user?.email || "demo-user"}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
