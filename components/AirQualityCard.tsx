const AQI_LABELS = {
  1: { label: "Good", color: "text-green-500" },
  2: { label: "Fair", color: "text-yellow-400" },
  3: { label: "Moderate", color: "text-orange-400" },
  4: { label: "Poor", color: "text-red-400" },
  5: { label: "Very Poor", color: "text-purple-500" },
};

export default function AirQualityCard({ aqi }) {
  if (!aqi) return null;

  const level = AQI_LABELS[aqi.main.aqi];

  return (
    <div className="bg-white/30 dark:bg-white/10 backdrop-blur-lg p-5 rounded-xl text-gray-900 dark:text-white shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Air Quality Index</h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-4xl font-bold">{aqi.main.aqi}</p>
          <p className={`text-sm font-medium ${level.color}`}>{level.label}</p>
        </div>
        <div className="text-sm text-right text-gray-700 dark:text-white/70">
          <p>PM2.5: {aqi.components.pm2_5} µg/m³</p>
          <p>PM10: {aqi.components.pm10} µg/m³</p>
        </div>
      </div>
    </div>
  );
}
