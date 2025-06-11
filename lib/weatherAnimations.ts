
import clear from "../public/animations/clear.json";
import cloudy from "../public/animations/cloudy.json";
import fog from "../public/animations/fog.json";
import rain from "../public/animations/rain.json";
import snow from "../public/animations/snow.json";
import storm from "../public/animations/storm.json";

export function getWeatherAnimation(code: number) {
  if (code === 0) return clear;
  if ([1, 2, 3].includes(code)) return cloudy;
  if ([45, 48].includes(code)) return fog;
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return rain;
  if ([71, 73, 75, 85, 86].includes(code)) return snow;
  if ([95, 96, 99].includes(code)) return storm;
  return cloudy;
}
