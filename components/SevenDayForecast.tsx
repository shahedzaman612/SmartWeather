import moment from "moment";

type SevenDayData = {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
  weathercode?: number[];
};

type Props = {
  daily: SevenDayData;
};

// Function to map weather code to icon
function getWeatherIcon(code: number | undefined): string {
  if (code === undefined) return "❓";

  if (code === 0) return "☀️"; // Clear
  if (code >= 1 && code <= 3) return "⛅"; // Partly to fully cloudy
  if (code >= 45 && code <= 48) return "🌫️"; // Fog
  if (code >= 51 && code <= 67) return "🌧️"; // Drizzle/Rain
  if (code >= 71 && code <= 77) return "🌨️"; // Snow
  if (code >= 80 && code <= 82) return "🌦️"; // Showers
  if (code >= 95 && code <= 99) return "⛈️"; // Thunderstorm

  return "🌈"; // Default/fallback
}

export default function SevenDayForecast({ daily }: Props) {
  return (
    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-4 rounded-2xl text-white shadow-lg w-full max-w-md mx-auto">
      <ul className="space-y-2 text-sm font-medium">
        {daily.time.map((date, i) => (
          <li
            key={i}
            className="grid grid-cols-4 items-center py-2 border-b border-white/10 text-sm"
          >
            {/* Day */}
            <div className="capitalize">
              {i === 0
                ? "Yesterday"
                : i === 1
                ? "Today"
                : moment(date).subtract(1, "day").local().format("ddd")}
            </div>

            {/* Precipitation */}
            <div className="flex items-center gap-1 justify-center">
              <span>💧</span>
              <span className="tabular-nums">
                {daily.precipitation_probability_max?.[i] ?? "--"}%
              </span>
            </div>

            {/* Weather Icon */}
            <div className="flex justify-center">
              {getWeatherIcon(daily.weathercode?.[i])}
            </div>

            {/* Temperatures */}
            <div className="text-right tabular-nums">
              {Math.round(daily.temperature_2m_max[i])}°{" "}
              <span className="text-white/60">
                {Math.round(daily.temperature_2m_min[i])}°
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
