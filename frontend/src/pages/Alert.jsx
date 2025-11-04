import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ API fetch
  const fetchAlerts = async () => {
    try {
      const res = await fetch("YOUR_ALERTS_API_URL"); // Add your backend URL
      const data = await res.json();
      setAlerts(data || []);
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  // ✅ Dynamic grouping by type
  const groupedAlerts = alerts.reduce((acc, alert) => {
    if (!acc[alert.type]) acc[alert.type] = [];
    acc[alert.type].push(alert);
    return acc;
  }, {});

  if (loading) {
    return <div className="p-10 text-center text-gray-600 text-lg">Loading alerts...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Automated Incident Analytics</h2>
      <p className="text-gray-600 mb-6">AI-powered classification and hazard detection</p>

      {/* ✅ Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.keys(groupedAlerts).map((type) => (
          <AlertTypeCard
            key={type}
            type={type}
            count={groupedAlerts[type].length}
          />
        ))}
      </div>

      {/* ✅ Sections */}
      <div className="space-y-6">
        {Object.keys(groupedAlerts).map((type) => (
          <AlertSection
            key={type}
            title={`${type.charAt(0).toUpperCase() + type.slice(1)} Incidents`}
            alerts={groupedAlerts[type]}
          />
        ))}
      </div>
    </div>
  );
}

// ✅ Summary Card Component
function AlertTypeCard({ type, count }) {
  return (
    <div className="rounded-lg border-2 bg-gray-50 text-gray-700 border-gray-200 p-6">
      <h3 className="text-2xl font-bold mb-1">{count}</h3>
      <p className="text-sm font-medium capitalize">{type}</p>
    </div>
  );
}

// ✅ Incident List Section
function AlertSection({ title, alerts }) {
  if (!alerts.length) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {title} <span className="text-sm text-gray-600">({alerts.length})</span>
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {alerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
}

// ✅ Single card
function AlertCard({ alert }) {
  const severityColors = {
    high: 'bg-red-100 text-red-800 border-red-300',
    medium: 'bg-orange-100 text-orange-800 border-orange-300',
    low: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-3">
          <AlertTriangle size={20} className="text-gray-400" />
          <span className={`px-2 py-1 text-xs font-bold rounded-full border ${severityColors[alert.severity]}`}>
            {alert.severity?.toUpperCase()} RISK
          </span>
        </div>
        <span className="text-xs text-gray-500">{alert.date}</span>
      </div>

      <p className="text-sm text-gray-900">{alert.message}</p>
      <p className="text-xs text-gray-500 mt-1">State: {alert.state}</p>
    </div>
  );
}
