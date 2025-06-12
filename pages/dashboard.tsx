import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

import Layout from "../components/Layout";
import PlaceSearch from "../components/PlaceSearch";
import WeatherCard from "../components/WeatherCard";
import HourlyForecast from "../components/HourlyForecast";
import TemperatureChart from "../components/TemperatureChart";
import PopularCities from "../components/PopularCities";
import AirQualityCard from "../components/AirQualityCard";
import AlertCard from "../components/AlertCard";

import { saveLocation, getSavedLocations } from "../lib/firestore";

type HourlyWeather = {
  dt: string;
  temp: number;
  humidity: number;
  wind: number;
  code: number;
};

type WeatherData = {
  name: string;
  temp: number;
  humidity: number;
  wind: number;
  code: number;
  sunrise: string;
  sunset: string;
  lat: number;
  lon: number;
};

type AQIData = {
  main: { aqi: 1 | 2 | 3 | 4 | 5 };
  components: { pm2_5: number; pm10: number; [key: string]: number };
};

type WeatherAlert = {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
  tags: string[];
};

type SavedLocation = {
  name: string;
  lat: number;
  lon: number;
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<{ hourly: HourlyWeather[] } | null>(null);
  const [aqi, setAqi] = useState<AQIData | null>(null);
  const [alerts, setAlerts] = useState<WeatherAlert | null>(null);
  const [saved, setSaved] = useState<SavedLocation[]>([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      if (usr) setUser(usr);
      else window.location.href = "/login";
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      getSavedLocations(user.uid).then(setSaved).catch(console.error);
    }
  }, [user]);

  const handleCitySelect = async ({ name, lat, lon }: SavedLocation) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,windspeed_10m,weathercode&daily=sunrise,sunset&timezone=auto`
      );
      if (!res.ok) throw new Error("Failed to fetch weather data");
      const data = await res.json();

      const hourly: HourlyWeather[] = data.hourly.time.map((t: string, i: number) => ({
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
      if (!airRes.ok) throw new Error("Failed to fetch air quality data");
      const airData = await airRes.json();
      const comp = airData.list[0].components;

      setAqi({
        main: { aqi: Math.min(Math.max(1, airData.list[0].main.aqi), 5) as 1 | 2 | 3 | 4 | 5 },
        components: { pm2_5: comp.pm2_5, pm10: comp.pm10, ...comp },
      });

      const alertRes = await fetch(`/api/alert?lat=${lat}&lon=${lon}`);
      const alertData = await alertRes.json();
      const alert = alertData.data?.[0];

      setAlerts(
        alert
          ? {
              sender_name: alert.source || "Tomorrow.io",
              event: alert.name || "Weather Alert",
              start: new Date(alert.onsetTime).getTime() / 1000,
              end: new Date(alert.endTime).getTime() / 1000,
              description: alert.description || "",
              tags: alert.severity ? [alert.severity] : [],
            }
          : null
      );
    } catch (err: unknown) {
      console.error("Error fetching data:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLocation = async () => {
    if (!user || !weather) return;
    setSaving(true);
    try {
      await saveLocation(user.uid, {
        name: weather.name,
        lat: weather.lat,
        lon: weather.lon,
      });
      const updated = await getSavedLocations(user.uid);
      setSaved(updated);
    } catch (e) {
      console.error("Error saving location:", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-white">Search Weather</h2>
        <PlaceSearch onSelect={handleCitySelect} />

        {loading && <p className="text-white mt-4">Loading data...</p>}
        {error && <p className="text-red-400 mt-4">Error: {error}</p>}

        {weather && !loading && !error && (
          <div className="mt-6 space-y-8">
            <WeatherCard data={weather} />
            {aqi && <AirQualityCard aqi={aqi} />}
            {alerts && <AlertCard alert={alerts} />}
            {forecast?.hourly && (
              <>
                <HourlyForecast hourly={forecast.hourly} />
                <TemperatureChart
                  hourly={forecast.hourly.map((h) => ({
                    ...h,
                    dt: new Date(h.dt).getTime(),
                  }))}
                />
              </>
            )}

            {user && (
              <button
                onClick={handleSaveLocation}
                disabled={saving}
                className={`${
                  saving ? "bg-green-300" : "bg-green-500 hover:bg-green-600"
                } text-white px-4 py-2 rounded shadow transition`}
              >
                💾 {saving ? "Saving..." : "Save Location"}
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
                  key={`${loc.name}-${i}`}
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
