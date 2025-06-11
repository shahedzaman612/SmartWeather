import Lottie from "lottie-react";
import { getWeatherAnimation } from "../lib/weatherAnimations";

export default function WeatherCard({ data }) {
  const name = data.name || "Selected Location";
  const temp = data.temp ?? "–";
  const humidity = data.humidity ?? "–";
  const wind = data.wind ?? "–";

  const animation = getWeatherAnimation(data.code);

  return (
    <div className="bg-gradient-to-b from-blue-500 to-blue-700 text-white rounded-2xl shadow-lg p-6 w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold">{name}</h2>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-start text-[80px] font-extrabold leading-none">
          {Math.round(temp)}
          <span className="text-[32px] ml-1 mt-2 font-medium">°C</span>
        </div>

        <div className="w-[300px] h-[300px]">
          <Lottie animationData={animation} loop />
        </div>
      </div>
<div className="grid grid-cols-2 gap-4 mt-6 text-sm text-blue-100">
  <div className="text-center">
    <p className="font-semibold">🌅 Sunrise</p>
    <p>{new Date(data.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
  </div>
  <div className="text-center">
    <p className="font-semibold">🌇 Sunset</p>
    <p>{new Date(data.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
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
