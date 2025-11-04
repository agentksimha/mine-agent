import { useEffect, useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

export default function HomePage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch data from API
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("YOUR_API_URL"); // ✅ INSERT YOUR URL HERE
        const data = await res.json();
        setIncidents(data.incidents || []);
      } catch (err) {
        setError("Failed to load incidents");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // ✅ Compute statistics dynamically
  const stats = useMemo(() => {
    if (!incidents.length) return { total: 0, casualties: 0, highSeverity: 0, typeCount: {} };

    const total = incidents.length;
    const casualties = incidents.reduce((sum, inc) => sum + (inc.casualties || 0), 0);
    const highSeverity = incidents.filter((inc) => inc.severity === 'high').length;

    const typeCount = {};
    incidents.forEach((inc) => {
      typeCount[inc.type] = (typeCount[inc.type] || 0) + 1;
    });

    return { total, casualties, highSeverity, typeCount };
  }, [incidents]);

  if (loading) return <p className="text-center py-10 text-gray-600">Loading incidents...</p>;
  if (error) return <p className="text-center py-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Real-Time Accident Monitoring</h2>
        <p className="text-gray-600">Track and analyze mine safety incidents across regions</p>
      </div>

      {/* ✅ Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Incidents" value={stats.total} trend={12.5} trendUp={true} icon={AlertCircle} color="blue" />
        <StatCard title="Casualties" value={stats.casualties} trend={8.3} trendUp={false} icon={AlertCircle} color="red" />
        <StatCard title="High Severity" value={stats.highSeverity} trend={15.2} trendUp={true} icon={AlertCircle} color="orange" />
        <StatCard title="Active Alerts" value={stats.highSeverity} trend={5.1} trendUp={true} icon={AlertCircle} color="green" />
      </div>

      {/* ✅ Incident Type Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Type Distribution</h3>
        <div className="space-y-4">
          {Object.entries(stats.typeCount).map(([type, count]) => {
            const percentage = ((count / stats.total) * 100).toFixed(1);
            return (
              <div key={type}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 capitalize">{type}</span>
                  <span className="text-gray-900 font-medium">{count} ({percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ✅ Recent Incidents Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Incidents Timeline</h3>
        <div className="space-y-3">
          {incidents.slice(0, 8).map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------ Stat Card ------------- */
function StatCard({ title, value, trend, trendUp, icon: Icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
        <div className={`flex items-center text-sm ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trendUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span className="ml-1 font-medium">{trend}%</span>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );
}

/* ------------ Incident Card ------------- */
function IncidentCard({ incident }) {
  const severityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-orange-100 text-orange-800 border-orange-200',
    low: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };

  return (
    <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-semibold text-gray-900 capitalize">{incident.type || 'Unknown'}</h4>
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${severityColors[incident.severity]}`}>
            {incident.severity?.toUpperCase() || 'N/A'}
          </span>
        </div>

        <p className="text-sm text-gray-700 mb-2">{incident.description || 'No description provided'}</p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
          <span>{incident.date || 'N/A'}</span>
          <span>{incident.state || 'N/A'}</span>
          <span>{incident.mineType || 'N/A'}</span>
          {incident.machineryType && incident.machineryType !== 'N/A' && <span>{incident.machineryType}</span>}
          <span className="text-red-600 font-medium">{incident.casualties || 0} casualties</span>
        </div>
      </div>
    </div>
  );
}
