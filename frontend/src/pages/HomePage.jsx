import { useEffect, useState, useMemo } from "react";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

export default function HomePage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch incidents from backend
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("YOUR_API_URL");  // ✅ Replace with your API endpoint
        const data = await res.json();

        setIncidents(data?.incidents || []);
      } catch (err) {
        console.error(err);
        setError("❌ Failed to load incidents");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // ✅ Compute statistics dynamically
  const stats = useMemo(() => {
    if (!incidents.length) return null;

    const total = incidents.length;
    const casualties = incidents.reduce((sum, inc) => sum + (inc.casualties || 0), 0);
    const highSeverity = incidents.filter((inc) => inc.severity === "high").length;

    const typeCount = {};
    incidents.forEach((inc) => {
      if (inc.type) {
        typeCount[inc.type] = (typeCount[inc.type] || 0) + 1;
      }
    });

    return { total, casualties, highSeverity, typeCount };
  }, [incidents]);

  if (loading) return <p className="text-center py-10 text-gray-600">⏳ Loading incidents...</p>;
  if (error) return <p className="text-center py-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Real-Time Accident Monitoring</h2>
        <p className="text-gray-600">Live safety incident analytics across mines</p>
      </div>

      {/* ✅ Stats - Only show if data exists */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          <DynamicStatCard title="Total Incidents" value={stats.total} />
          <DynamicStatCard title="Casualties" value={stats.casualties} />
          <DynamicStatCard title="High Severity" value={stats.highSeverity} />
        </div>
      )}

      {/* ✅ Incident Type Distribution */}
      {stats && Object.keys(stats.typeCount).length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Type Distribution</h3>

          <div className="space-y-4">
            {Object.entries(stats.typeCount).map(([type, count]) => {
              const percent = ((count / stats.total) * 100).toFixed(1);
              return (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 capitalize">{type}</span>
                    <span className="text-gray-900 font-medium">{count} ({percent}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ✅ Recent Incidents Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Incidents Timeline</h3>

        {incidents.length > 0 ? (
          <div className="space-y-3">
            {incidents.slice(0, 8).map((incident) => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm">No incident records found.</p>
        )}
      </div>
    </div>
  );
}

/* ✅ Dynamic Stat Card (no hardcoded smiley, no trend numbers) */
function DynamicStatCard({ title, value }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
          <AlertCircle size={24} />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value ?? 0}</h3>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );
}

/* ✅ Clean Incident Card */
function IncidentCard({ incident }) {
  const severityColors = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-orange-100 text-orange-800 border-orange-200",
    low: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

  return (
    <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-semibold text-gray-900 capitalize">{incident?.type || "Unknown"}</h4>

          {incident?.severity && (
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full border ${
                severityColors[incident.severity] || "bg-gray-100 text-gray-800 border-gray-200"
              }`}
            >
              {incident.severity.toUpperCase()}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-700 mb-2">
          {incident?.description || "No description available"}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
          <span>{incident?.date || "Date N/A"}</span>
          <span>{incident?.state || "State N/A"}</span>
          {incident?.mineType && <span>{incident.mineType}</span>}
          {incident?.machineryType && <span>{incident.machineryType}</span>}
          {incident?.casualties != null && (
            <span className="text-red-600 font-medium">{incident.casualties} casualties</span>
          )}
        </div>
      </div>
    </div>
  );
}
