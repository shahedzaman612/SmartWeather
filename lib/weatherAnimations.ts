import clear from "../public/animations/clear.json";
import cloudy from "../public/animations/cloudy.json";
import fog from "../public/animations/fog.json";
import rain from "../public/animations/rain.json";
import snow from "../public/animations/snow.json";
import storm from "../public/animations/strom.json";
import partlycloudy from "../public/animations/partly cloudy.json";
import thunder from "../public/animations/thunder.json";
import shower from "../public/animations/shower.json";
import overcast from "../public/animations/overcast.json";

export function getWeatherDescription(code: number): string {
  switch (code) {
    case 0:
      return "Clear Sky";
    case 1:
      return "Clear";
    case 2:
      return "Partly Cloudy";
    case 3:
      return "Overcast";
    case 45:
      return "Foggy";
    case 48:
      return "Foggy";
    case 51:
      return "Light Drizzle";
    case 53:
      return "Moderate Drizzle";
    case 55:
      return "Dense Drizzle";
    case 56:
        return "Freezing Drizzle";
    case 57:
      return "Freezing Drizzle";
    case 61:
      return "Light Rain";
    case 63:
      return "Moderate Rain";
    case 65:
      return "Heavy Rain";
    case 66:
      return "Heavy Freezing Rain";
    case 67:
      return "Freezing Rain";
    case 71:
      return "Light Snow";
    case 73:
      return "Moderate Snow";
    case 75:
      return "Heavy Snow";
    case 77:
      return "Snow Grains";
    case 80:
      return "Light Rain Showers";
    case 81:
      return "Moderate Rain Showers";
    case 82:
      return "Violent Rain Showers";
    case 85:
      return "Light Snow Showers";
    case 86:
      return "Heavy Snow Showers";
    case 95:
      return "Thunderstorm";
    case 96:
      return "Thunderstorm with Light Hail";
    case 99:
      return "Thunderstorm with Hail";
    default:
      return "Unknown Weather";
  }
}
export function getWeatherAnimation(code: number) {
  switch (code) {
    case 0:
      return clear;
    case 1: 
      return clear;
    case 2:
      return partlycloudy;
    case 3:
      return overcast;
    case 45:
      return fog;
    case 48:
      return fog;
    case 51:
      return cloudy;
    case 53:
      return rain;
    case 55:
      return rain;
    case 56:
      return rain;
    case 57:
      return rain;
    case 61:
      return rain;
    case 63:
      return rain;
    case 65:
      return rain;
    case 66:
      return rain;
    case 67:
      return rain;
    case 71:
      return snow;
    case 73:
      return snow;
    case 75:
      return snow;
    case 77:
      return snow;
    case 80:
      return shower;
    case 81:
      return shower;
    case 82:
      return shower;
    case 85:
      return snow;
    case 86:
      return snow;
    case 95:
      return thunder;
    case 96:
      return storm;
    case 99:
      return storm;
    default:
      console.warn(
        `Unhandled weather code: ${code}. Returning default clear weather.`
      );
      return clear;
  }
}
