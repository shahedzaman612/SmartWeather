import Lottie, { LottieComponentProps } from "lottie-react";
import {
  getWeatherAnimation,
  getWeatherDescription,
} from "../lib/weatherAnimations";
// The animation and description are now passed via props from Dashboard

// Update the WeatherData type to include animation and description
type WeatherData = {
  name?: string;
  temp?: number;
  humidity?: number;
  wind?: number;
  code?: string | number;
  sunrise?: string | number;
  sunset?: string | number;
  animation?: LottieComponentProps; // Add animation data here
  description?: string; // Add description here
};

interface WeatherCardProps {
  data: WeatherData;
}

export default function WeatherCard({ data }: WeatherCardProps) {
  const name = data.name || "Selected Location";
  const temp = data.temp ?? "–";
  const humidity = data.humidity ?? "–";
  const wind = data.wind ?? "–";

  // Removed: local call to getWeatherAnimation as it's now passed via data
  const codeNumber =
    typeof data.code === "string" ? parseInt(data.code, 10) : data.code ?? 0;
  const animation = getWeatherAnimation(codeNumber);
  const description = getWeatherDescription(codeNumber);

  return (
    <div className="bg-gradient-to-b from-blue-500 to-blue-700 text-white rounded-2xl shadow-lg p-6 w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold">{name}</h2>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-start text-[80px] font-extrabold leading-none">
          {typeof temp === "number" ? Math.round(temp) : temp}
          <span className="text-[32px] ml-1 mt-2 font-medium">°C</span>
        </div>

        <div className="w-[300px] h-[300px]">
          <Lottie animationData={animation} loop />
        </div>
      </div>

      {/* Display the weather description */}
      <h2 className="text-xl font-medium text-center mt-2">{description}</h2>

      <div className="grid grid-cols-2 gap-4 mt-6 text-sm text-blue-100">
        <div className="text-center">
          <p className="font-semibold">🌅 Sunrise</p>
          <p>
            {data.sunrise
              ? new Date(data.sunrise).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "–"}
          </p>
        </div>
        <div className="text-center">
          <p className="font-semibold">🌇 Sunset</p>
          <p>
            {data.sunset
              ? new Date(data.sunset).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "–"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 text-sm text-blue-100">
        <div className="text-center">
          <p className="font-semibold">Humidity</p>
          <p>{humidity}%</p>
        </div>
        <div className="text-center">
          <p className="font-semibold">Wind</p>
          <p>{wind} m/s</p>
        </div>
        <div className="text-center">
          <p className="font-semibold">Location</p>
          <p>{name}</p>
        </div>
      </div>
    </div>
  );
}
