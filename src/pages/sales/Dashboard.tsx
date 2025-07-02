import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth/AuthProvider";

export default function SalesDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authState, setAuthState] = useState<string>("checking");

  // Safe auth hook access with defensive guards
  let user = null;
  let session = null;
  let authData = null;
  let authError = null;
  
  try {
    authData = useAuth();
    user = authData?.user || null;
    session = authData?.session || null;
  } catch (err) {
    console.error("⚠️ Auth context error:", err);
    authError = err;
  }

  // Log before any render to debug Error #301
  console.log("🟩 Rendering dashboard with:", {
    user: !!user,
    session: !!session,
    authData: !!authData,
    authError: !!authError,
    loading,
    error,
    authState
  });

  useEffect(() => {
    console.log("🚀 SALES DASHBOARD MOUNTED");
    
    // Update auth state safely in useEffect
    if (authError) {
      setAuthState("no-auth-context");
      return;
    }
    
    if (authData) {
      setAuthState("available");
      console.log("✅ Auth context available:", { user: !!user, session: !!session });
    }
    
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
            resolve({ 
              deals: [], 
              stats: {}, 
              userId: user?.id || 'demo-user',
              email: user?.email || 'demo@example.com'
            });
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

    // Only init if we have some form of auth
    if (authData || localStorage.getItem('demo-auth')) {
      initDashboard();
    } else {
      setLoading(false);
      setError("No authentication found");
    }
  }, [user, session, authData, authError]);

  // Early return guards with defensive checks
  if (authError) {
    console.log("🔴 Auth context missing, showing fallback");
    return (
      <div style={{ padding: "2rem", border: "2px solid orange", minHeight: "200px" }}>
        <h2>⚠️ Auth Context Missing</h2>
        <p>Dashboard running in fallback mode</p>
        <p>Error: {authError?.message || "Unknown auth error"}</p>
        <button onClick={() => window.location.href = '/auth'}>Go to Auth</button>
      </div>
    );
  }

  if (loading) {
    console.log("🔵 Dashboard loading...");
    return (
      <div style={{ padding: "2rem", minHeight: "200px" }}>
        <p>Loading data...</p>
        <p>🔍 Debug: user={user ? "yes" : "no"}, session={session ? "yes" : "no"}, state={authState}</p>
      </div>
    );
  }
  
  if (error) {
    console.log("🔴 Dashboard error:", error);
    return (
      <div style={{ padding: "2rem", border: "2px solid red", minHeight: "200px" }}>
        <h2>⚠️ Error loading dashboard</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reload Dashboard</button>
        <button onClick={() => window.location.href = '/auth'}>Back to Auth</button>
      </div>
    );
  }

  // Final safety check before render
  if (!data) {
    console.log("🟡 No data yet, showing placeholder");
    return (
      <div style={{ padding: "2rem", border: "2px solid yellow", minHeight: "200px" }}>
        <h2>📊 Sales Dashboard</h2>
        <p>Waiting for data...</p>
      </div>
    );
  }

  console.log("🟩 Sales Dashboard rendering successfully");
  
  return (
    <div style={{ padding: "2rem", border: "2px solid green", minHeight: "200px" }}>
      <h2>📊 Full Sales Dashboard</h2>
      <p>🧪 Rendered safely with stub data.</p>
      <p>👤 User: {user?.email || data?.email || "demo-user"}</p>
      <p>🔍 Auth State: {authState}</p>
      <pre style={{ background: "#f5f5f5", padding: "1rem", borderRadius: "4px" }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
