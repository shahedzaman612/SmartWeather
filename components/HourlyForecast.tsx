// components/HourlyForecast.tsx
import moment from "moment";

type HourData = {
  dt: string;
  temp: number;
  humidity: number;
  wind: number;
};

export default function HourlyForecast({ hourly }: { hourly: HourData[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-2">Next 12 Hours</h3>
      <div className="flex gap-4 overflow-x-auto p-2">
        {hourly.slice(0, 12).map((hour, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-24 bg-white/10 text-white p-3 rounded-lg text-center backdrop-blur-md"
          >
            <p className="text-sm">{moment(hour.dt).format("hA")}</p>
            <p className="text-xl font-bold">{Math.round(hour.temp)}°C</p>
            <p className="text-xs opacity-70">💧 {hour.humidity}%</p>
            <p className="text-xs opacity-70">💨 {hour.wind} m/s</p>
          </div>
        ))}
      </div>
    </div>
  );
}
