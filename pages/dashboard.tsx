import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

import Layout from "../components/Layout";
import PlaceSearch from "../components/PlaceSearch";
import WeatherCard from "../components/WeatherCard";
import HourlyForecast from "../components/HourlyForecast";
import TemperatureChart from "../components/TemperatureChart";
import PopularCities from "../components/PopularCities";
import AirQualityCard from "../components/AirQualityCard";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [aqi, setAqi] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (usr) => {
      if (usr) setUser(usr);
      else window.location.href = "/login";
    });
  }, []);

  const handleCitySelect = async ({ name, lat, lon }) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,windspeed_10m,weathercode&timezone=auto`
      );
      const data = await res.json();

      const hourly = data.hourly.time.map((t, i) => ({
  dt: t,
  temp: data.hourly.temperature_2m[i],
  humidity: data.hourly.relative_humidity_2m[i],
  wind: data.hourly.windspeed_10m[i],
  code: data.hourly.weathercode[i], // ✅ Add weathercode
}));

setWeather({
  name,
  temp: data.hourly.temperature_2m[0],
  humidity: data.hourly.relative_humidity_2m[0],
  wind: data.hourly.windspeed_10m[0],
  code: data.hourly.weathercode[0], // ✅ Store current weathercode
});

      setForecast({ hourly });

      const airRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
      );
      const airData = await airRes.json();
      setAqi(airData.list[0]);
    } catch (err) {
      console.error("Error fetching forecast or AQI:", err);
    }
  };

  return (
    <Layout>
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-white">
          Search Weather
        </h2>
        <PlaceSearch onSelect={handleCitySelect} />

        {weather && (
          <div className="mt-6 space-y-8">
            <WeatherCard data={weather} />
            {aqi && <AirQualityCard aqi={aqi} />}
            {forecast?.hourly && (
              <>
                <HourlyForecast hourly={forecast.hourly} />
                <TemperatureChart hourly={forecast.hourly} />
              </>
            )}
          </div>
        )}

        <PopularCities onSelect={handleCitySelect} />
      </div>
    </Layout>
  );
}
