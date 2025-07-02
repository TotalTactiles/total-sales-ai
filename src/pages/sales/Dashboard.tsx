
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth/AuthProvider";
import { useLiveDashboardData } from "@/hooks/useLiveDashboardData";

export default function SalesDashboard() {
  const [error, setError] = useState<string | null>(null);

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

  // Use live dashboard data hook
  const { deals, stats, activities, loading: dataLoading, error: dataError } = useLiveDashboardData();

  // Log before any render to debug
  console.log("🟩 Rendering dashboard with:", {
    user: !!user,
    session: !!session,
    authData: !!authData,
    authError: !!authError,
    dataLoading,
    dataError,
    dealsCount: deals.length,
    stats,
    sessionUserId: session?.user?.id,
    userEmail: user?.email
  });

  useEffect(() => {
    console.log("🚀 SALES DASHBOARD MOUNTED");
    console.log("Session Check:", {
      session: !!session,
      user: !!user,
      userId: user?.id,
      email: user?.email
    });
    console.log("✅ Sales Dashboard loaded without crashing");
  }, [session, user]);

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

  if (!user || !session) {
    console.log("🔵 User/session not ready...");
    return (
      <div style={{ padding: "2rem", minHeight: "200px" }}>
        <p>Loading user session...</p>
        <p>🔍 Debug: user={user ? "yes" : "no"}, session={session ? "yes" : "no"}</p>
        <p>Session user ID: {session?.user?.id || "none"}</p>
        <p>User object: {user?.email || "none"}</p>
      </div>
    );
  }

  if (dataLoading) {
    console.log("🔵 Dashboard data loading...");
    return (
      <div style={{ padding: "2rem", minHeight: "200px" }}>
        <p>Loading dashboard data...</p>
        <p>🔍 Debug: user={user.email}, loading data from Supabase...</p>
      </div>
    );
  }
  
  if (dataError || error) {
    const errorMsg = dataError || error;
    console.log("🔴 Dashboard error:", errorMsg);
    return (
      <div style={{ padding: "2rem", border: "2px solid red", minHeight: "200px" }}>
        <h2>⚠️ Error loading dashboard</h2>
        <p>{errorMsg}</p>
        <button onClick={() => window.location.reload()}>Reload Dashboard</button>
        <button onClick={() => window.location.href = '/auth'}>Back to Auth</button>
      </div>
    );
  }

  // Check if we have no data (empty state)
  if (deals.length === 0 && stats.activeLeads === 0) {
    console.log("🟡 Empty dashboard state");
    return (
      <div style={{ padding: "2rem", border: "2px solid blue", minHeight: "200px" }}>
        <h2>📊 Sales Dashboard</h2>
        <p>👤 Welcome, {user?.email}</p>
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <h3>🚀 Ready to get started?</h3>
          <p>No leads or activities yet. Start by importing leads or making calls!</p>
          <div style={{ marginTop: "1rem" }}>
            <button style={{ margin: "0 0.5rem", padding: "0.5rem 1rem" }}>
              Import Leads
            </button>
            <button style={{ margin: "0 0.5rem", padding: "0.5rem 1rem" }}>
              Make First Call
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log("🟩 Sales Dashboard rendering successfully with live data");
  
  return (
    <div style={{ padding: "2rem", border: "2px solid green", minHeight: "200px" }}>
      <h2>📊 Live Sales Dashboard</h2>
      <p>👤 User: {user?.email}</p>
      <p>🆔 Session ID: {session?.user?.id}</p>
      
      {/* Live Stats */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
        gap: "1rem", 
        margin: "1rem 0" 
      }}>
        <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "4px" }}>
          <h4>🎯 Active Leads</h4>
          <p style={{ fontSize: "2rem", margin: "0.5rem 0" }}>{stats.activeLeads}</p>
        </div>
        <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "4px" }}>
          <h4>📞 Calls Today</h4>
          <p style={{ fontSize: "2rem", margin: "0.5rem 0" }}>{stats.callsToday}</p>
        </div>
        <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "4px" }}>
          <h4>💰 Pipeline</h4>
          <p style={{ fontSize: "2rem", margin: "0.5rem 0" }}>{stats.revenuePipeline}</p>
        </div>
        <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "4px" }}>
          <h4>📈 Conversion</h4>
          <p style={{ fontSize: "2rem", margin: "0.5rem 0" }}>{stats.conversionRate}</p>
        </div>
      </div>

      {/* Recent Deals */}
      <div style={{ marginTop: "2rem" }}>
        <h3>🔥 Recent Leads ({deals.length})</h3>
        {deals.slice(0, 5).map((deal, index) => (
          <div key={deal.id || index} style={{ 
            padding: "1rem", 
            margin: "0.5rem 0", 
            border: "1px solid #ddd", 
            borderRadius: "4px",
            backgroundColor: deal.status === 'qualified' ? '#e8f5e8' : '#f9f9f9'
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>{deal.name || 'Unknown Lead'}</strong>
                <p style={{ margin: "0.25rem 0", color: "#666" }}>
                  {deal.company && `${deal.company} • `}
                  {deal.email}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ 
                  padding: "0.25rem 0.5rem", 
                  borderRadius: "12px", 
                  fontSize: "0.8rem",
                  backgroundColor: deal.status === 'qualified' ? '#4caf50' : 
                                 deal.status === 'contacted' ? '#ff9800' : '#2196f3',
                  color: 'white'
                }}>
                  {deal.status || 'new'}
                </span>
                <p style={{ margin: "0.25rem 0", fontSize: "0.8rem", color: "#666" }}>
                  {deal.priority && `Priority: ${deal.priority}`}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {deals.length > 5 && (
          <p style={{ textAlign: "center", margin: "1rem 0", color: "#666" }}>
            ... and {deals.length - 5} more leads
          </p>
        )}
      </div>

      {/* Recent Activities */}
      {activities.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>📋 Recent Activities ({activities.length})</h3>
          {activities.slice(0, 3).map((activity, index) => (
            <div key={activity.id || index} style={{ 
              padding: "0.75rem", 
              margin: "0.5rem 0", 
              border: "1px solid #eee", 
              borderRadius: "4px" 
            }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>📞 {activity.call_type || 'Call'}</span>
                <span style={{ fontSize: "0.8rem", color: "#666" }}>
                  {new Date(activity.created_at).toLocaleDateString()}
                </span>
              </div>
              {activity.notes && (
                <p style={{ margin: "0.5rem 0", fontSize: "0.9rem", color: "#666" }}>
                  {activity.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "2rem", textAlign: "center", padding: "1rem", backgroundColor: "#f0f8ff" }}>
        <h3 style={{ color: "#1976d2" }}>🎯 Live Dashboard Active</h3>
        <p style={{ color: "#666" }}>Connected to Supabase • Real-time data • {deals.length} leads loaded</p>
      </div>
    </div>
  );
}
