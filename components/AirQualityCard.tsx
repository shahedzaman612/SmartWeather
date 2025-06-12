type AQIData = {
  main: {
    aqi: 1 | 2 | 3 | 4 | 5;
  };
  components: {
    pm2_5: number;
    pm10: number;
  };
};

const AQI_LABELS: Record<1 | 2 | 3 | 4 | 5, { label: string; color: string }> =
  {
    1: { label: "Good", color: "text-green-400" },
    2: { label: "Fair", color: "text-yellow-400" },
    3: { label: "Moderate", color: "text-orange-400" },
    4: { label: "Poor", color: "text-red-400" },
    5: { label: "Very Poor", color: "text-purple-500" },
  };

export default function AirQualityCard({ aqi }: { aqi: AQIData }) {
  if (!aqi) return null;

  const level = AQI_LABELS[aqi.main.aqi];

  return (
    <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl text-white">
      <h3 className="text-lg font-semibold mb-2">Air Quality Index</h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-4xl font-bold">{aqi.main.aqi}</p>
          <p className={`text-sm ${level.color}`}>{level.label}</p>
        </div>
        <div className="text-sm text-right text-white/70">
          <p>PM2.5: {aqi.components.pm2_5} µg/m³</p>
          <p>PM10: {aqi.components.pm10} µg/m³</p>
        </div>
      </div>
    </div>
  );
}
