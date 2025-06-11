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

import { saveLocation, getSavedLocations } from "../lib/firestore";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [aqi, setAqi] = useState(null);
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (usr) => {
      if (usr) {
        setUser(usr);
      } else {
        window.location.href = "/login";
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      getSavedLocations(user.uid).then(setSaved);
    }
  }, [user]);

  const handleCitySelect = async ({ name, lat, lon }) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,windspeed_10m,weathercode&daily=sunrise,sunset&timezone=auto`
      );
      const data = await res.json();

      const hourly = data.hourly.time.map((t, i) => ({
        dt: t,
        temp: data.hourly.temperature_2m[i],
        humidity: data.hourly.relative_humidity_2m[i],
        wind: data.hourly.windspeed_10m[i],
        code: data.hourly.weathercode[i],
      }));

      setWeather({
        name,
        temp: data.hourly.temperature_2m[0],
        humidity: data.hourly.relative_humidity_2m[0],
        wind: data.hourly.windspeed_10m[0],
        code: data.hourly.weathercode[0],
        sunrise: data.daily.sunrise[0],
        sunset: data.daily.sunset[0],
        lat,
        lon,
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
        <h2 className="text-2xl font-semibold mb-4 text-white">Search Weather</h2>
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
            {user && (
              <button
                onClick={async () => {
                  await saveLocation(user.uid, {
                    name: weather.name,
                    lat: weather.lat,
                    lon: weather.lon,
                  });
                  const updated = await getSavedLocations(user.uid);
                  setSaved(updated);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
              >
                💾 Save Location
              </button>
            )}
          </div>
        )}

        <PopularCities onSelect={handleCitySelect} />

        {user && saved.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-2">📌 Your Locations</h3>
            <div className="grid grid-cols-2 gap-2">
              {saved.map((loc, i) => (
                <button
                  key={i}
                  onClick={() => handleCitySelect(loc)}
                  className="bg-white/10 text-white py-2 px-4 rounded hover:bg-white/20 transition"
                >
                  {loc.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
