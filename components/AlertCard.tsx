export default function AlertCard({ alert }) {
  if (!alert) return null;

  return (
    <div className="bg-red-100 text-red-800 p-4 rounded shadow">
      <h3 className="font-semibold text-lg">⚠️ {alert.event}</h3>
      <p className="text-sm mt-1">{alert.description}</p>
      <p className="text-xs opacity-70 mt-2">
        From: {new Date(alert.start * 1000).toLocaleString()} <br />
        To: {new Date(alert.end * 1000).toLocaleString()}
      </p>
    </div>
  );
}
