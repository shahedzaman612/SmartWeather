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
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-8 rounded-xl text-white shadow-3xl w-full max-w-md mx-auto relative overflow-hidden transform perspective-1000">
    
      <div className="absolute inset-0 bg-dots opacity-10 animate-pulse-slow"></div>

      <h2 className="text-3xl font-extrabold mb-8 text-center text- bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-wider uppercase drop-shadow-lg">
        Daily Forecast
      </h2>

      <div className="space-y-6">
        {daily.time.map((date, i) => (
          <div
            key={i}
            className="grid grid-cols-4 items-center py-5 border border-white/10 rounded-lg backdrop-filter backdrop-blur-lg bg-white/5 hover:bg-white/10 transition-all duration-300 ease-in-out transform hover:scale-[1.02] animate-slide-in"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            {/* Day */}
            <div className="capitalize text-lg font-bold text-cyan-300 pl-4 tracking-wide">
              {i === 0
                ? "Yesterday"
                : i === 1
                ? "Today"
                : moment(date).subtract(1, "day").format("ddd")}
            </div>

            {/* Precipitation */}
            <div className="flex items-center gap-2 justify-center">
              <span className="text-3xl text-blue-300 drop-shadow-md">☔</span>
              <span className="tabular-nums text-xl font-semibold text-white">
                {daily.precipitation_probability_max?.[i] ?? "--"}%
              </span>
            </div>

            {/* Weather Icon */}
            <div className="flex justify-center text-4xl transform hover:rotate-6 transition-transform duration-200">
              {getWeatherIcon(daily.weathercode?.[i])}
            </div>

            {/* Temperatures */}
            <div className="text-right tabular-nums text-2xl font-extrabold text-purple-300 pr-4">
              {Math.round(daily.temperature_2m_max[i])}°
              <span className="text-white/50 ml-3 font-medium">
                {Math.round(daily.temperature_2m_min[i])}°
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
