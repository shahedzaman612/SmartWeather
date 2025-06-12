// components/AlertCard.tsx

type WeatherAlert = {
  event: string;
  description: string;
  sender_name?: string;
};

export default function AlertCard({ alert }: { alert: WeatherAlert }) {
  if (!alert) return null;

  return (
    <div className="bg-red-500/10 border border-red-400 text-red-900 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold">⚠️ Weather Alert</h3>
      <p className="mt-2 text-sm">
        <strong>{alert.event}</strong>
      </p>
      {alert.sender_name && (
        <p className="text-xs italic mt-1">Source: {alert.sender_name}</p>
      )}
      <p className="mt-2 text-sm">{alert.description}</p>
    </div>
  );
}
